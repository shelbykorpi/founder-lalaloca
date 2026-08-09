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

export function isConfigured(): boolean {
  return auth() !== null;
}

export async function complete(system: string, history: Msg[]): Promise<ModelResult> {
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
