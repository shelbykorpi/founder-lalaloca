import { unsubscribeFromList } from "@/lib/shopifyAdmin";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe";

/**
 * The way out.
 *
 * TWO METHODS, ON PURPOSE.
 *
 *   POST — the button on /unsubscribe, and the one Gmail presses itself when a
 *          reader uses its built-in Unsubscribe control (RFC 8058 one-click,
 *          advertised by the List-Unsubscribe-Post header on the email).
 *
 * There is deliberately NO GET that unsubscribes. Mail scanners, link previewers
 * and corporate security filters fetch every URL in an email before a human sees
 * it. A GET that acts would quietly remove people who never clicked anything,
 * and they would never know — the worst possible failure for this endpoint,
 * because it is invisible from both ends.
 *
 * NO AUTHENTICATION BEYOND THE SIGNATURE, on purpose. Requiring a login to stop
 * receiving email is a dark pattern and, for a bulk sender, a violation. The
 * signed token in the link is the whole check.
 *
 * ALWAYS 200 ON A VALID TOKEN. Gmail's one-click retries on failure, and it
 * treats a non-200 as a broken sender. If Shopify is down the person is told,
 * on the page, to reply to the email instead — a route that reaches a human.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  /* Gmail one-click posts `List-Unsubscribe=One-Click` as a form body to the
     URL in the header, so the token has to be readable from the query string
     as well as from JSON. */
  const fromQuery = new URL(request.url).searchParams.get("t");

  let fromBody: string | null = null;
  try {
    const body = await request.json();
    if (typeof body?.token === "string") fromBody = body.token;
  } catch {
    /* One-click sends form encoding, not JSON. The query string carries it. */
  }

  const token = fromBody ?? fromQuery;
  if (!token) {
    return Response.json({ ok: false, error: "Missing token." }, { status: 400 });
  }

  const email = verifyUnsubscribeToken(token);
  if (!email) {
    return Response.json(
      { ok: false, error: "That link isn’t valid. Reply to any email from us and we’ll do it by hand." },
      { status: 400 },
    );
  }

  const result = await unsubscribeFromList(email);
  if (!result.ok) {
    console.error("[unsubscribe] failed:", result.reason);
    return Response.json({ ok: false, error: "unavailable" }, { status: 503 });
  }

  return Response.json({ ok: true });
}
