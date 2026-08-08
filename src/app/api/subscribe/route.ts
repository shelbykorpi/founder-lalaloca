import { guard, looksLikeEmail, silentOk } from "@/lib/formGuard";
import { subscribeToList } from "@/lib/shopifyAdmin";

/**
 * The Founding List.
 *
 * Writes the address straight onto a Shopify customer record with marketing
 * consent and a source tag, so subscribers and buyers are one list from the
 * first signup rather than two lists to reconcile later.
 *
 * NO NOTIFICATION EMAIL HERE, on purpose. A message for every signup is noise
 * that stops being read by the fifth one, and the list is already visible in
 * Shopify → Customers, filtered by the `newsletter` tag. Email is for things
 * that need a decision; a subscriber does not.
 *
 * ALREADY SUBSCRIBED IS A SUCCESS. Someone re-entering their address should see
 * the same thank-you as anyone else. Telling a visitor "you are already on this
 * list" leaks who is on it — enter an address, learn whether that person
 * subscribed — and there is no reason to make it a failure.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Where on the site the signup happened. Becomes a Shopify tag. */
const ALLOWED_SOURCES = new Set(["footer", "found-her", "shop", "page", "home"]);

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const check = guard(request, body);
  if (!check.ok) return silentOk();

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!looksLikeEmail(email)) {
    return Response.json(
      { ok: false, error: "That doesn’t look like an email address." },
      { status: 400 },
    );
  }

  const raw = typeof body.source === "string" ? body.source : "page";
  const source = ALLOWED_SOURCES.has(raw) ? raw : "page";

  const result = await subscribeToList(email, source);

  if (!result.ok) {
    /* Same rule as the story form: never show a success state over an address
       that was not stored. */
    console.error("[subscribe] failed:", result.reason);
    return Response.json({ ok: false, configured: false }, { status: 503 });
  }

  return Response.json({ ok: true });
}
