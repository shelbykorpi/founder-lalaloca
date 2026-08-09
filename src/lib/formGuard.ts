/**
 * Shared defences for the two public form endpoints.
 *
 * A form endpoint on a public domain gets found by bots within days of going
 * live — not because anyone targeted this brand, but because scanners walk
 * every new domain looking for anything that accepts a POST. Left open, the
 * story inbox fills with casino spam and the mailing list fills with addresses
 * that will bounce, which is how a sending domain earns a bad reputation and
 * starts landing real email in junk.
 *
 * Three cheap layers, none of which asks a real person to do anything:
 *
 *   1. HONEYPOT — a field a human never sees and never fills. Most bots fill
 *      every input they find. Costs a legitimate visitor nothing.
 *   2. TIMING — the form records when it rendered. A submission completed in
 *      under three seconds was not typed by someone answering "what are you
 *      building?".
 *   3. RATE LIMIT — a per-IP cap.
 *
 * Deliberately NOT a CAPTCHA. This is a form asking women to write about the
 * hardest thing they have done; making them identify traffic lights first is
 * the wrong trade. If spam genuinely becomes a problem, Cloudflare Turnstile
 * is invisible to most visitors and is the next step, not reCAPTCHA.
 */

/** The honeypot's field name. Innocuous enough that a bot will want to fill it. */
export const HONEYPOT_FIELD = "company_website";

/** Milliseconds a human plausibly needs. Under this, it wasn't typed. */
const MIN_FILL_MS = 3_000;

/**
 * In-memory, per-instance rate limiting.
 *
 * BE HONEST ABOUT WHAT THIS IS: serverless functions scale to many instances
 * and this Map lives in one of them, so a determined flood spread across
 * instances gets through proportionally. It stops the common case — one script
 * hammering one endpoint — and costs nothing. A distributed limiter (Vercel KV,
 * Upstash) is the upgrade if the logs ever show it is needed.
 */
const hits = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

/**
 * `bucket` keeps the counters separate.
 *
 * A form submission and a chat message are not the same event and must not
 * share a budget: five per hour is generous for someone submitting a story and
 * absurd for someone having a conversation. Without the namespace, asking the
 * concierge five questions would silently lock the same visitor out of the
 * story form.
 */
export function rateLimited(
  ip: string,
  now: number,
  max: number = MAX_PER_WINDOW,
  bucket = "form",
): boolean {
  const id = `${bucket}:${ip}`;
  const recent = (hits.get(id) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(id, recent);

  /* Keep the map from growing without bound across a long-lived instance. */
  if (hits.size > 5_000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }

  return recent.length > max;
}

export function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Deliberately permissive. The job here is to catch a typo or an obvious bot,
 * not to adjudicate RFC 5322 — over-strict email regexes reject real addresses,
 * and a rejected real customer costs more than an accepted bad one.
 */
export function looksLikeEmail(value: unknown): value is string {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export type GuardResult = { ok: true } | { ok: false; reason: string };

export function guard(
  request: Request,
  body: Record<string, unknown>,
  now = Date.now(),
  /* Defaults reproduce the original behaviour exactly, so the two form
     endpoints are unaffected by the concierge needing different numbers. */
  limits: { max?: number; bucket?: string; minFillMs?: number } = {},
): GuardResult {
  if (typeof body[HONEYPOT_FIELD] === "string" && body[HONEYPOT_FIELD]) {
    return { ok: false, reason: "honeypot" };
  }

  /* `> 0` matters: the client stamps this in a mount effect and sends 0 if the
     effect somehow has not run. Treating 0 as a timestamp would read as "filled
     in 1786156338 milliseconds ago" — harmless here, but the opposite mistake
     (treating a missing stamp as instant) would reject real people. Missing is
     skipped, present is checked. */
  const rendered = Number(body.rendered_at);
  if (Number.isFinite(rendered) && rendered > 0 && now - rendered < (limits.minFillMs ?? MIN_FILL_MS)) {
    return { ok: false, reason: "too fast" };
  }

  if (rateLimited(clientIp(request), now, limits.max, limits.bucket)) {
    return { ok: false, reason: "rate limited" };
  }

  return { ok: true };
}

/**
 * A bot gets the same 200 and the same wording a person does.
 *
 * Telling a scanner "rejected: honeypot" teaches it exactly which field to
 * leave alone next time. Silence is the only response that does not help it.
 */
export function silentOk() {
  return Response.json({ ok: true });
}
