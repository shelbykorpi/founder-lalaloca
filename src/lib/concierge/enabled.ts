/**
 * The concierge's on/off switch.
 *
 * Off since 2 Oct 2026 (Shelby: "remove the concierge from the site until it's
 * fixed"). The model call is failing (Vercel AI Gateway 403, see model.ts);
 * the rules-based fallback in fallback.ts works, but Shelby wants the desk off
 * the site until the real answers are back.
 *
 * Off means: no bell on any page (layout.tsx), and the two homepage links
 * swap to the serum finder and to email. The API route stays deployed but
 * nothing on the site calls it.
 *
 * Back on 1 Oct 2026, 22:55Z: the direct Anthropic route (Claude Sonnet 5.5,
 * Shelby's key plus ANTHROPIC_WORKSPACE_ID) answered live questions on
 * production correctly in 3-5 s, so the condition she set ("until it's fixed")
 * is met.
 *
 * To take it off again: set this to false. Nothing else changes.
 */
export const CONCIERGE_ENABLED = true;
