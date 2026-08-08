/**
 * The Founding List welcome.
 *
 * ── WHY THIS IS HERE AND NOT IN SHOPIFY ─────────────────────────────────────
 *
 * Shopify's "Welcome new subscribers" automation is documented as firing when
 * someone "subscribes by using a form on your online store". Subscribers here
 * are written onto the customer record through the Admin API from
 * founderbeauty.co, which is not that store — the Shopify storefront is only a
 * checkout. Shopify does not document whether the trigger fires for an
 * API-driven consent change, and an unverifiable trigger is not something to
 * hang the first impression of the brand on.
 *
 * So the welcome is sent from the same Resend path that already carries the
 * story confirmation: infrastructure that is live, tested and visible in one
 * place when it fails.
 *
 * ── WHY THERE IS NO DISCOUNT IN IT ──────────────────────────────────────────
 *
 * Both of Shopify's welcome templates attach one. A first-purchase discount
 * teaches the most engaged part of an audience to wait for the next one, and it
 * takes margin from the buyers least likely to have needed it. The list was
 * sold on the footer as "be first through the doors" — access, not money off —
 * and the email keeps that promise instead of quietly replacing it.
 *
 * ── WHY IT SETS EXPECTATIONS EXPLICITLY ─────────────────────────────────────
 *
 * The frequency line and the unsubscribe line are the two things that keep a
 * list out of spam folders. Someone who knows what is coming and knows how to
 * leave marks "unsubscribe"; someone who does not marks "spam", and enough of
 * those damage the sending domain for every email after it — including the
 * order confirmations.
 */

import { OWNER_EMAIL, sendEmail, type SendResult } from "./email";
import { unsubscribeOneClickUrl, unsubscribeUrl } from "./unsubscribe";

export const WELCOME_SUBJECT = "You’re on the Founding List";

/**
 * CAN-SPAM requires a valid physical postal address in commercial email, and
 * this is commercial email — it links to products. There is deliberately no
 * default: an invented or borrowed address would be worse than a missing one,
 * because a missing one is visible and a wrong one is not.
 *
 * Set MAILING_ADDRESS in Vercel to a real address that receives post. A PO box
 * or a registered-agent address is acceptable and is what most one-person
 * brands use; a home address is not required and should not be used.
 *
 * Until it is set the email still sends — silently dropping a subscriber's
 * welcome would be the worse failure — but a warning is logged on every send
 * so the gap is loud rather than forgotten.
 */
const MAILING_ADDRESS = process.env.MAILING_ADDRESS;

/**
 * Plain text on purpose. A text email renders identically everywhere, cannot
 * break, weighs nothing, and reads as though a person wrote it — which for a
 * brand whose whole proposition is that a person is behind it, is the format
 * that tells the truth. An HTML template can come later if there is ever
 * something to show; there is not yet.
 *
 * Exported so it can be read in a test without sending anything.
 */
export function welcomeText(email: string): string {
  const optOut = unsubscribeUrl(email);

  return [
    "You’re in.",

    "",
    "The Founding List is the short version of what we’re doing: which serum to",
    "start with, new stories as they’re published, and word when something is",
    "back in stock. A few emails a month, not a few a week. If that stops being",
    "true, the way out is at the bottom of this email and every one after it.",

    "",
    "Two things worth knowing about while you’re here.",

    "",
    "THE LALALOCA COLLECTION",
    "Three serums, sold under FOUNDER. If you don’t know where to start, there’s",
    "a two-minute version of that question here:",
    "https://www.founderbeauty.co/find-your-serum",

    "",
    "FOUND HER",
    "Women talking about what they’re building, and the parts nobody saw. Not",
    "testimonials — we don’t ask them about the products.",
    "https://www.founderbeauty.co/found-her",

    "",
    "And if you’ve got one of your own: https://www.founderbeauty.co/share-your-story",
    "A person reads every submission, and nothing is published without your",
    "permission.",

    "",
    "You can reply to this. It reaches a person.",

    "",
    "FOUNDER",
    "founderbeauty.co",

    "",
    "—",

    /* The opt-out and the postal address, last and unmissable. Neither is
       decoration: the first is what a reader presses instead of the spam
       button, and the second is what CAN-SPAM requires of commercial mail. */
    optOut
      ? `You’re getting this because you entered ${email} on founderbeauty.co.\nLeave the list: ${optOut}`
      : `You’re getting this because you entered ${email} on founderbeauty.co.\nReply with “unsubscribe” and a person will take you off the list.`,

    MAILING_ADDRESS ? "" : null,
    MAILING_ADDRESS ?? null,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

/**
 * Never allowed to fail a signup. The address is already safely on the customer
 * record by the time this runs, and losing a subscriber because a courtesy
 * email bounced would be the wrong trade — the same rule the story confirmation
 * follows. The caller logs the reason and returns success regardless.
 */
export async function sendWelcomeEmail(to: string): Promise<SendResult> {
  if (!MAILING_ADDRESS) {
    console.warn(
      "[welcome] MAILING_ADDRESS is not set — commercial email is going out without the postal address CAN-SPAM requires.",
    );
  }

  const oneClick = unsubscribeOneClickUrl(to);

  return sendEmail({
    to,
    subject: WELCOME_SUBJECT,
    text: welcomeText(to),
    /* A reply goes to a person, not to a no-reply void. This is the one
       promise in the email that costs something to keep, which is why it is
       worth making. */
    replyTo: OWNER_EMAIL,
    /* Puts Gmail's own Unsubscribe control beside the sender name. Both headers
       are needed: List-Unsubscribe alone offers a mailto or a link, and
       List-Unsubscribe-Post is what makes it a single press with no round trip
       (RFC 8058). Gmail and Yahoo both expect these on bulk mail now, and the
       control is the reason a bored reader presses "unsubscribe" instead of
       "report spam" — which is the difference between losing one subscriber and
       damaging the domain that also sends the order confirmations. */
    ...(oneClick
      ? {
          headers: {
            "List-Unsubscribe": `<${oneClick}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
        }
      : {}),
  });
}
