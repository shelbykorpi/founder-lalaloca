import { guard, looksLikeEmail, silentOk } from "@/lib/formGuard";
import { subscribeToList } from "@/lib/shopifyAdmin";
import { sendWelcomeEmail } from "@/lib/welcomeEmail";

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
 *
 * ONE EMAIL DOES GO OUT: the welcome, and only to someone whose consent
 * actually changed on this call. Re-entering an address that is already
 * subscribed is still a success on screen but sends nothing, so nobody can be
 * made to receive the same welcome twice by refreshing a page. See
 * `welcomeEmail.ts` for why this is sent from here rather than by a Shopify
 * automation.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Where on the site the signup happened. Becomes a Shopify tag. */
const ALLOWED_SOURCES = new Set(["footer", "found-her", "shop", "page", "home", "waitlist"]);

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

  /* AWAITED, not fired and forgotten. A serverless function can be frozen the
     instant it returns a response, so a floating promise here is a coin flip on
     whether the welcome ever leaves. It costs a few hundred milliseconds.

     Its failure is swallowed on purpose: she is on the list either way, and
     failing a signup over a courtesy email would be the wrong trade. The reason
     is logged so a broken sender shows up in Vercel's logs rather than as a
     silence nobody notices for a month. */
  if (result.newlySubscribed) {
    const welcomed = await sendWelcomeEmail(email);
    if (!welcomed.sent) console.error("[subscribe] welcome failed:", welcomed.reason);
  }

  return Response.json({ ok: true });
}
