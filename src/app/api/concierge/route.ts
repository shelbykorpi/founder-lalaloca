import { guard, silentOk } from "@/lib/formGuard";
import { escalate } from "@/lib/concierge/escalate";
import { OUTBOUND_FALLBACK, screenInbound, screenOutbound } from "@/lib/concierge/guardrails";
import { retrieve } from "@/lib/concierge/knowledge";
import { complete, isConfigured, type Msg } from "@/lib/concierge/model";
import { systemPrompt } from "@/lib/concierge/prompt";

/**
 * The concierge endpoint.
 *
 * ── ORDER OF OPERATIONS, AND WHY IT IS THIS ORDER ───────────────────────────
 *
 *   1. bot guard        cheapest, and keeps scrapers off a metered endpoint
 *   2. shape + limits   before anything is paid for
 *   3. INBOUND SCREEN   can answer without the model at all
 *   4. retrieve         local, microseconds
 *   5. model            the only step that costs money
 *   6. OUTBOUND SCREEN  last line, on the model's actual words
 *   7. escalate         a real email, awaited
 *
 * Steps 3 and 6 are the reason this route exists rather than the browser
 * calling a model directly. Everything in between is ordinary.
 *
 * ── ON COST ─────────────────────────────────────────────────────────────────
 *
 * A public LLM endpoint on a storefront is a bill with a URL. Rate limited per
 * IP through the same guard the forms use, history truncated, reply capped in
 * `model.ts`. A reaction report or a request for a human short-circuits before
 * the model is called, which is both safer and free.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Long enough to be useful, short enough that nobody pastes an essay. */
const MAX_CHARS = 1_000;
/** Turns of history sent back to the model. Enough for context, not a novel. */
const MAX_TURNS = 12;

const DESKS = new Set(["beauty", "house", "found", "service"]);

/** Crude, and only used to attach a reply-to if she volunteered one. */
function emailIn(history: Msg[]): string | undefined {
  for (const m of [...history].reverse()) {
    if (m.role !== "user") continue;
    const hit = m.content.match(/[^\s@]+@[^\s@]+\.[a-z]{2,}/i);
    if (hit) return hit[0];
  }
  return undefined;
}

function reply(body: {
  text: string;
  kind?: "care" | "flag";
  tag?: string;
  escalated?: boolean;
}) {
  return Response.json({ ok: true, ...body });
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  /* Bots get a plain 200 and nothing else — same posture as the forms. Telling
     a scanner which check caught it only teaches it what to change.
     Its own bucket and its own numbers: 40 messages an hour is a long
     conversation and a cheap ceiling, and the three-second minimum is dropped
     because "yes" is a legitimate two-character reply typed in one. */
  if (!guard(request, payload, Date.now(), { max: 40, bucket: "concierge", minFillMs: 0 }).ok) {
    return silentOk();
  }

  const message = typeof payload.message === "string" ? payload.message.trim().slice(0, MAX_CHARS) : "";
  if (!message) {
    return Response.json({ ok: false, error: "Say something and I'll answer." }, { status: 400 });
  }

  const desk = typeof payload.desk === "string" && DESKS.has(payload.desk) ? payload.desk : "beauty";

  const priorRaw = Array.isArray(payload.history) ? payload.history : [];
  const prior: Msg[] = priorRaw
    .filter(
      (m): m is Msg =>
        !!m &&
        typeof m === "object" &&
        (m as Msg).role !== undefined &&
        ((m as Msg).role === "user" || (m as Msg).role === "assistant") &&
        typeof (m as Msg).content === "string",
    )
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  const history: Msg[] = [...prior, { role: "user", content: message }];

  /* ── 3. Inbound screen ───────────────────────────────────────────────────
     A fixed reply, never the model's. If this fires the customer gets the same
     words every time, which for a suspected reaction is exactly what you want. */
  const screened = screenInbound(message);
  if (!screened.pass) {
    let escalated = false;
    if (screened.escalate) {
      const result = await escalate({
        desk,
        reason: screened.reason,
        history,
        reply: screened.reply,
        email: emailIn(history),
      });
      escalated = result.notified;
      if (!result.notified) console.error("[concierge] FAILED TO ESCALATE:", screened.reason);
    }
    return reply({ text: screened.reply, kind: screened.kind, tag: screened.tag, escalated });
  }

  if (!isConfigured()) {
    return Response.json({ ok: false, configured: false }, { status: 503 });
  }

  /* ── 4 + 5. Retrieve, then answer ────────────────────────────────────────
     Retrieval runs on the newest message plus the one before it, so a follow-up
     like "and the other one?" still pulls the right product into the window. */
  const lastUser = prior.filter((m) => m.role === "user").slice(-1)[0]?.content ?? "";
  const facts = retrieve(`${lastUser} ${message}`);

  const result = await complete(systemPrompt(desk, facts), history);
  if (!result.ok) {
    console.error("[concierge] model call failed:", result.reason);
    return Response.json({ ok: false, configured: result.configured }, { status: 503 });
  }

  /* The model signals a handover with a token on its own line. Strip it before
     anything reaches the browser. */
  const wants = result.text.includes("[[ESCALATE]]");
  const text = result.text.replace(/\[\[ESCALATE\]\]/g, "").trim();

  /* ── 6. Outbound screen ──────────────────────────────────────────────────
     Checked on what the model actually wrote, not on what it was told to
     write. A blocked answer is replaced and escalated, because a customer who
     triggered it asked something the brand should answer properly. */
  const clean = screenOutbound(text);
  if (!clean.clean) {
    console.error("[concierge] blocked outbound:", clean.why);
    const result = await escalate({
      desk,
      reason: `Blocked answer (${clean.why})`,
      history,
      reply: text,
      email: emailIn(history),
    });
    return reply({
      text: OUTBOUND_FALLBACK,
      kind: "care",
      tag: "Passed to our team",
      escalated: result.notified,
    });
  }

  /* ── 7. Escalate for real ────────────────────────────────────────────────
     Awaited. The customer has just been told a person will follow up; the
     function must not be frozen before that becomes true. */
  let escalated = false;
  if (wants) {
    const sent = await escalate({
      desk,
      reason: "Concierge handed over",
      history: [...history, { role: "assistant", content: text }],
      reply: text,
      email: emailIn(history),
    });
    escalated = sent.notified;
    if (!sent.notified) console.error("[concierge] FAILED TO ESCALATE after handover");
  }

  return reply({
    text,
    ...(wants ? { kind: "care" as const, tag: "Passed to our team" } : {}),
    escalated,
  });
}
