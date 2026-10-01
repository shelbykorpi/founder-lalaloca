/**
 * The model call.
 *
 * ── WHY RAW FETCH AND NO SDK ────────────────────────────────────────────────
 *
 * Every other integration in this codebase — Resend, Shopify, Airtable — is a
 * plain fetch that returns a result object and is inert without credentials.
 * Adding an AI SDK here would buy streaming helpers we do not use and bring a
 * dependency tree into a project that currently has four runtime dependencies.
 * One fetch is easier to reason about and cannot break at install time.
 *
 * ── WHERE THE REQUEST GOES ──────────────────────────────────────────────────
 *
 * Vercel AI Gateway's OpenAI-compatible endpoint, which is already on Shelby's
 * Vercel account. Two ways to authenticate and the code takes whichever exists:
 *
 *   AI_GATEWAY_API_KEY   set it and it is used everywhere, including locally
 *   VERCEL_OIDC_TOKEN    injected automatically in Vercel's runtime
 *
 * An explicit key wins over OIDC, which matches the gateway's own precedence.
 * Set neither and this returns a failure the route turns into an honest "not
 * connected" message rather than a 500.
 *
 * ── COST ────────────────────────────────────────────────────────────────────
 *
 * A support widget on a storefront is an open invitation to spend money, so the
 * limits here are deliberate rather than defensive: the reply is capped, the
 * history handed back is capped, and the route rate-limits per IP before it
 * ever reaches this file. CONCIERGE_MODEL is an env var specifically so the
 * model can be swapped for a cheaper one without a deploy.
 */

/**
 * ── WHY THE ENVIRONMENT IS READ THROUGH AN ALIAS ────────────────────────────
 *
 * `process.env.SOMETHING` written literally is replaced with its build-time
 * value by the bundler and the surrounding expression is folded away. For most
 * of this codebase that is harmless — it is why server-side variables have
 * always needed a redeploy here.
 *
 * It is NOT harmless for two of the values below.
 *
 * VERCEL_OIDC_TOKEN is issued at runtime and rotates. Folded in at build time
 * it would be both stale and baked into the deployed bundle, which is the wrong
 * place for a credential to live.
 *
 * CONCIERGE_MODEL is the cost lever. Freezing it at build time would mean the
 * only way to move off an expensive model is a code change, at exactly the
 * moment someone is trying to stop spending money.
 *
 * Aliasing the object defeats the static replacement, so all of these are read
 * when the request happens. Verified against the built output.
 */
const env = process.env;

/** Overridable so the route can be driven by a stub in testing. Never set in production. */
function gateway(): string {
  return env.CONCIERGE_GATEWAY_URL ?? "https://ai-gateway.vercel.sh/v1/chat/completions";
}

/**
 * Default is a large model, chosen for judgement on safety-adjacent questions.
 * If the bill argues otherwise, point CONCIERGE_MODEL at something smaller —
 * no redeploy needed — and re-run the guardrail tests.
 */
function model(): string {
  return env.CONCIERGE_MODEL ?? "anthropic/claude-opus-5";
}

/** Long enough for three short paragraphs. Not long enough for an essay. */
const MAX_TOKENS = 700;

export type Msg = { role: "user" | "assistant"; content: string };

export type ModelResult =
  | { ok: true; text: string }
  | { ok: false; reason: string; configured: boolean };

function auth(): string | null {
  return env.AI_GATEWAY_API_KEY ?? env.VERCEL_OIDC_TOKEN ?? null;
}

/**
 * ── THE DIRECT ROUTE, AND WHY IT EXISTS ─────────────────────────────────────
 *
 * 1 Oct 2026: every request through Vercel's AI Gateway came back 403, on two
 * unrelated providers, with zero tokens and zero spend. Ruled out from the
 * dashboard: the key authenticates (logs name it on every request), there is
 * free credit, no budget is set, no BYOK is configured, the Model Allowlist is
 * off and the Provider Allowlist permits Anthropic. Valid auth plus credit
 * plus no restrictions plus 403 is Vercel's to explain, and a storefront
 * cannot wait on a support ticket.
 *
 * So: set ANTHROPIC_API_KEY and the gateway is bypassed entirely. Unset it and
 * nothing changes — the gateway path below is untouched and resumes the moment
 * the key is removed. One variable, reversible, no redeploy of logic.
 *
 * THIS USES ANTHROPIC'S NATIVE MESSAGES API, NOT THEIR OPENAI-COMPATIBLE ONE.
 * The compat endpoint at /v1/chat/completions would have been a smaller diff —
 * same body shape as the gateway, no second response parser. Anthropic
 * documents it as being for evaluation and testing rather than production
 * workloads, and this answers real customers about real skincare, so it takes
 * the supported road instead.
 *
 * The shapes differ in three ways, all handled below:
 *   auth      x-api-key header, not Authorization: Bearer
 *   system    a top-level parameter, not a message with role "system"
 *   response  content[0].text, not choices[0].message.content
 */
function anthropicKey(): string | null {
  return env.ANTHROPIC_API_KEY ?? null;
}

/**
 * Keys that aren't scoped to a workspace must name one on every request, or
 * Anthropic answers 400 "This API key is not scoped to a workspace, so this
 * request must include the anthropic-workspace-id header" (seen live, 2 Oct
 * 2026). Shelby kept her key, so the workspace id lives in
 * ANTHROPIC_WORKSPACE_ID (not a secret). Unset, no header is sent, which is
 * right for a workspace-scoped key.
 */
function workspaceHeader(): Record<string, string> {
  const id = env.ANTHROPIC_WORKSPACE_ID?.trim();
  return id ? { "anthropic-workspace-id": id } : {};
}

/** Pinned: the version header is required, and silence here means breakage later. */
const ANTHROPIC_VERSION = "2023-06-01";

/**
 * ── THE MODEL ON THE DIRECT ROUTE ───────────────────────────────────────────
 *
 * Shelby, 2 Oct 2026: "build a new concierge service that's hooked up to my
 * Anthropic Sonnet." Default: Claude Sonnet 5.5, API id `claude-sonnet-5-5`
 * (Anthropic's models overview, checked 2 Oct 2026: $2 in / $10 out per
 * million tokens). CONCIERGE_DIRECT_MODEL overrides it verbatim, with no
 * prefix stripping and no guessing; paste the id from the Anthropic console.
 * If the id is wrong the log says "Anthropic returned 404" and names it.
 *
 * CONCIERGE_MODEL is the GATEWAY's model name and is not reused here: the two
 * routes don't share a vocabulary ("anthropic/…" vs bare ids).
 */
function directModel(): string {
  return env.CONCIERGE_DIRECT_MODEL ?? "claude-sonnet-5-5";
}

/**
 * ── THREE THINGS SONNET 5.5 DOES DIFFERENTLY (docs, 2 Oct 2026) ─────────────
 *
 * 1. NO TEMPERATURE. Setting temperature, top_p or top_k to a non-default
 *    value returns a 400. The gateway path below still sends one; this route
 *    must not.
 * 2. ADAPTIVE THINKING IS ON BY DEFAULT, and thinking blocks come back BEFORE
 *    the text block, so content[0] is not the answer. The answer is every
 *    block whose type is "text", joined.
 * 3. THINKING COUNTS TOWARD max_tokens. A support reply doesn't need
 *    up-front deliberation, so thinking is set to "between_tools" (no tools
 *    here, so in practice none) and effort to "low", for speed and cost.
 *    max_tokens still leaves headroom in case it thinks anyway, and the
 *    prompt keeps the answer itself to three short paragraphs.
 *
 * If a future model rejects those two controls (400), the call is retried
 * once with model, max_tokens, system and messages only, and the log says so.
 */
const DIRECT_MAX_TOKENS = 1_600;

function textOf(json: unknown): string {
  const blocks = (json as { content?: { type?: string; text?: unknown }[] })?.content ?? [];
  return blocks
    .filter((b) => b?.type === "text" && typeof b.text === "string")
    .map((b) => (b.text as string).trim())
    .filter(Boolean)
    .join("\n\n");
}

export function isConfigured(): boolean {
  return anthropicKey() !== null || auth() !== null;
}

async function callAnthropic(key: string, body: Record<string, unknown>): Promise<Response> {
  return fetch(env.CONCIERGE_ANTHROPIC_URL ?? "https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": ANTHROPIC_VERSION,
      ...workspaceHeader(),
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

async function completeDirect(system: string, history: Msg[]): Promise<ModelResult> {
  const key = anthropicKey();
  if (!key) return { ok: false, configured: false, reason: "ANTHROPIC_API_KEY is not set" };

  const base = {
    model: directModel(),
    max_tokens: DIRECT_MAX_TOKENS,
    /* System is its own field on the Messages API, not a message. */
    system,
    messages: history,
  };

  try {
    let response = await callAnthropic(key, {
      ...base,
      thinking: { type: "between_tools" },
      output_config: { effort: "low" },
    });

    if (response.status === 400) {
      const detail = (await response.text()).slice(0, 300);
      console.error("[concierge] Anthropic rejected the thinking/effort controls, retrying plain:", detail);
      response = await callAnthropic(key, base);
    }

    if (!response.ok) {
      return {
        ok: false,
        configured: true,
        reason: `Anthropic returned ${response.status}: ${(await response.text()).slice(0, 300)}`,
      };
    }

    const json = await response.json();
    const text = textOf(json);
    if (!text) {
      return {
        ok: false,
        configured: true,
        reason: `Anthropic returned no text (stop_reason: ${json?.stop_reason ?? "unknown"})`,
      };
    }

    return { ok: true, text };
  } catch (error) {
    return {
      ok: false,
      configured: true,
      reason: error instanceof Error ? error.message : "unknown error",
    };
  }
}

export async function complete(system: string, history: Msg[]): Promise<ModelResult> {
  /* The direct key wins when present, for the reasons above. Remove it and the
     gateway path below takes over again with no other change. */
  if (anthropicKey()) return completeDirect(system, history);

  const token = auth();
  if (!token) {
    return {
      ok: false,
      configured: false,
      reason: "Neither AI_GATEWAY_API_KEY nor VERCEL_OIDC_TOKEN is set",
    };
  }

  try {
    const response = await fetch(gateway(), {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: model(),
        max_tokens: MAX_TOKENS,
        /* Low, not zero. Zero makes a support bot sound like a form letter
           across a conversation; high makes it improvise, which is the one
           thing this bot must not do. */
        temperature: 0.4,
        messages: [{ role: "system", content: system }, ...history],
      }),
    });

    if (!response.ok) {
      return {
        ok: false,
        configured: true,
        reason: `Gateway returned ${response.status}: ${(await response.text()).slice(0, 300)}`,
      };
    }

    const json = await response.json();
    const text: unknown = json?.choices?.[0]?.message?.content;
    if (typeof text !== "string" || !text.trim()) {
      return { ok: false, configured: true, reason: "Gateway returned no message content" };
    }

    return { ok: true, text: text.trim() };
  } catch (error) {
    return {
      ok: false,
      configured: true,
      reason: error instanceof Error ? error.message : "unknown error",
    };
  }
}
