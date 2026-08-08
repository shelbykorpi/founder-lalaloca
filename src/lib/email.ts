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

/** Must be on a domain verified in Resend. */
const FROM = process.env.EMAIL_FROM ?? "FOUNDER <notifications@send.founderbeauty.co>";

/** Where anything needing a human decision goes. */
export const OWNER_EMAIL = process.env.OWNER_EMAIL ?? "shelbykorpi@gmail.com";

export type SendResult = { sent: true } | { sent: false; reason: string };

export async function sendEmail(message: {
  to: string;
  subject: string;
  text: string;
  /** So a reply from the owner goes to the woman who wrote in, not to a robot. */
  replyTo?: string;
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
