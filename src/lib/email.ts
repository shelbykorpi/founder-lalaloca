/**
 * Outbound transactional email, via Resend.
 *
 * WHY A SENDING SERVICE AT ALL. A server cannot just "send an email" — mail
 * from an unauthenticated source goes to spam or is refused outright. Something
 * has to sign it with SPF and DKIM on a domain that is allowed to send. That is
 * the whole job of a service like this, and it is the one account this system
 * genuinely cannot avoid.
 *
 * WHY RESEND SPECIFICALLY. Free to 3,000 emails a month, which is far more
 * than a story inbox will use; the DNS setup goes on a SUBDOMAIN
 * (send.founderbeauty.co), so the Google Workspace MX records stay untouched;
 * and the same account later covers the submitter's confirmation email and
 * anything else transactional. Alternatives are Postmark (better deliverability
 * reputation, no free tier) and SES (cheapest at volume, worst setup).
 *
 * INERT WITHOUT A KEY. No RESEND_API_KEY means send() returns a failure rather
 * than throwing, and the caller decides what to tell the visitor. A missing
 * environment variable must never turn into a 500 in front of a woman who just
 * spent twenty minutes writing about her life.
 */

const API_KEY = process.env.RESEND_API_KEY;

/**
 * Must be on a domain verified in Resend.
 *
 * The fallback moved from `notifications@send.founderbeauty.co` to the root
 * domain on 15 Aug 2026, when Resend's verified domain was swapped from the
 * subdomain to `founderbeauty.co`. A stale fallback here is not a cosmetic
 * problem: an unverified sender means Resend refuses the send, and the woman
 * gets the "we haven't sent it" screen.
 */
const FROM = process.env.EMAIL_FROM ?? "FOUNDER <notifications@founderbeauty.co>";

/**
 * Where anything needing a human decision goes. This is an INBOX, not an
 * identity — it is never shown to anyone outside the company.
 */
export const OWNER_EMAIL = process.env.OWNER_EMAIL ?? "shelbykorpi@gmail.com";

/**
 * The address a member of the public is invited to reply to.
 *
 * WHY THIS IS NOT OWNER_EMAIL. It used to be, and that meant every confirmation
 * email and every Founding List welcome carried a personal Gmail address in
 * its reply-to. Hit reply to say thank you, and you were writing to
 * shelbykorpi@gmail.com — an address the brand never chose to publish, now
 * sitting in the mailbox of every woman who has ever written in and anywhere
 * her mail is later forwarded, screenshotted or subpoenaed.
 *
 * The two jobs are genuinely different: OWNER_EMAIL is where mail must LAND,
 * this is the identity mail is SENT AS. They point at the same human today
 * because shelby@founderbeauty.co forwards to that Gmail — but the public one
 * can be redirected, delegated or retired without touching the other.
 */
export const PUBLIC_REPLY_TO =
  process.env.PUBLIC_REPLY_TO?.trim() ||
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
  "shelby@founderbeauty.co";

export type SendResult = { sent: true } | { sent: false; reason: string };

export async function sendEmail(message: {
  to: string;
  subject: string;
  text: string;
  /** So a reply from the owner goes to the woman who wrote in, not to a robot. */
  replyTo?: string;
  /**
   * Raw SMTP headers. Used for List-Unsubscribe / List-Unsubscribe-Post, which
   * put a native "Unsubscribe" control in Gmail's own interface next to the
   * sender name. That control is the single most effective thing you can do to
   * stay out of spam folders: it gives an irritated reader something to press
   * that is not the spam button, and Gmail and Yahoo both now require it on
   * bulk mail. It costs two headers.
   */
  headers?: Record<string, string>;
}): Promise<SendResult> {
  if (!API_KEY) return { sent: false, reason: "RESEND_API_KEY is not set" };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [message.to],
        subject: message.subject,
        text: message.text,
        ...(message.replyTo ? { reply_to: message.replyTo } : {}),
        ...(message.headers ? { headers: message.headers } : {}),
      }),
    });

    if (!response.ok) {
      return { sent: false, reason: `Resend returned ${response.status}: ${await response.text()}` };
    }
    return { sent: true };
  } catch (error) {
    return { sent: false, reason: error instanceof Error ? error.message : "unknown error" };
  }
}
