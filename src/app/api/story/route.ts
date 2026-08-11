import { recordStorySubmission } from "@/lib/airtable";
import { STORY_FIELDS } from "@/lib/content";
import { OWNER_EMAIL, sendEmail } from "@/lib/email";
import { guard, looksLikeEmail, silentOk } from "@/lib/formGuard";
import { STORY_CONFIRMATION_SUBJECT, storyConfirmationText } from "@/lib/storyEmail";

/**
 * FOUND HER story intake.
 *
 * WHAT THIS DOES, END TO END:
 *   1. A woman fills in the form on /found-her#share.
 *   2. This endpoint checks it isn't a bot, then emails the whole submission —
 *      every answer, both consent flags, her contact details — to the owner.
 *   3. It sends her a short confirmation so she knows a person has it.
 *   4. Nothing else. Nothing is published, nothing is added to the mailing
 *      list, nothing happens without a human reading it first.
 *
 * TWO DESTINATIONS, AND THE ORDER MATTERS. The submission is written to the
 * Airtable pipeline first, then emailed — so the notification can carry a link
 * straight to the row. Airtable is where the story acquires a *state*: an inbox
 * has read and unread, a pipeline has "drafting", "sent her the text", "she
 * approved". That distinction is what stops editorial intake failing the way it
 * always fails, which is not by rejecting people but by going quiet on them.
 *
 * AIRTABLE IS NEVER ALLOWED TO BREAK A SUBMISSION. If the write fails the email
 * still sends and says so plainly. Losing a woman's story because a third-party
 * API had a bad minute is not an acceptable failure mode, so the table is a
 * convenience layer over a system that already worked on its own.
 *
 * REPLY-TO IS THE OTHER HALF OF THE WORKFLOW. The notification is sent with her
 * address as reply-to, so hitting reply in Gmail writes to her directly.
 * Answering a woman is a reply, not a login.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Long enough for a real answer, short enough that nobody can post a novel. */
const MAX_FIELD = 5_000;

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, MAX_FIELD) : "";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  /* Bots get a plain 200. Telling a scanner which check caught it just teaches
     it what to change. */
  const check = guard(request, body);
  if (!check.ok) return silentOk();

  const name = clean(body.name);
  const email = clean(body.email);
  const canContact = body.permission_contact === true;
  const canPublish = body.permission_publish === true;

  if (!name || !looksLikeEmail(email) || !canContact) {
    return Response.json(
      { ok: false, error: "Please add your name, a valid email, and tick the first permission." },
      { status: 400 },
    );
  }

  const answers = STORY_FIELDS.map((field) => ({
    label: field.label,
    value: clean(body[field.name]),
  }));

  if (!answers[0].value || !answers[1].value) {
    return Response.json(
      { ok: false, error: "The first two questions are the ones we really need." },
      { status: 400 },
    );
  }

  const location = clean(body.location);
  const social = clean(body.social);

  /* Awaited, not fired and forgotten: a serverless function can be frozen the
     instant it responds, and a floating write is a coin flip on whether the row
     ever exists. */
  const stored = await recordStorySubmission({
    name,
    email,
    location,
    social,
    canPublish,
    canContact,
    answers: Object.fromEntries(
      STORY_FIELDS.map((field) => [field.name, clean(body[field.name])]),
    ),
  });
  if (!stored.recorded) console.error("[story] Airtable write failed:", stored.reason);

  const ownerEmail = [
    `${name} sent a story.`,
    "",
    `Email:     ${email}`,
    location ? `Location:  ${location}` : null,
    social ? `Social:    ${social}` : null,
    "",
    "PERMISSIONS",
    `  Reply to her:        yes`,
    `  Consider for publishing: ${canPublish ? "YES" : "no — read it, but do not publish"}`,
    "",
    "─".repeat(60),
    "",
    ...answers.flatMap(({ label, value }) =>
      value ? [label.toUpperCase(), "", value, "", "─".repeat(60), ""] : [],
    ),
    canPublish
      ? "She has agreed you may consider this for publication. She still sees the final text and can say no then."
      : "She has NOT agreed to publication. Do not publish any part of this.",
    "",
    stored.recorded
      ? `Open in the pipeline: ${stored.url}`
      : "NOTE: this could not be written to the Airtable pipeline, so this email is the only copy. Keep it.",
    "",
    "Reply to this email and it goes straight to her.",
  ]
    .filter((line) => line !== null)
    .join("\n");

  const notified = await sendEmail({
    to: OWNER_EMAIL,
    subject: `FOUND HER submission — ${name}`,
    text: ownerEmail,
    replyTo: email,
  });

  /* If mail is not configured the form must say so rather than show a
     thank-you screen over a message that went nowhere. That has been this
     site's position since before there was a backend and it does not change
     just because there nearly is one. */
  if (!notified.sent) {
    console.error("[story] notification failed:", notified.reason);
    return Response.json({ ok: false, configured: false }, { status: 503 });
  }

  /* Her confirmation.
     AWAITED, not fire-and-forget. A serverless function can be frozen the
     instant it returns a response, so a floating promise here is a coin flip on
     whether the confirmation ever leaves — and "did it send?" is exactly the
     question this email exists to answer. It costs a couple of hundred
     milliseconds on a form that took minutes to fill.
     Its failure is swallowed on purpose: the story is already safely delivered
     and failing her submission over a courtesy email would be the wrong trade. */
  const confirmed = await sendEmail({
    to: email,
    subject: STORY_CONFIRMATION_SUBJECT,
    /* The copy lives in `storyEmail.ts` because it is the owner's, verbatim,
       and because it forks on the publication permission. Do not inline it back
       here — it is long, it is not developer copy, and it needs to be editable
       without reading an API route. */
    text: storyConfirmationText(name, canPublish),
    /* Photographs come back as a REPLY to this email, so reply-to has to reach
       a human inbox rather than the sending domain. It already did; now it
       matters more. */
    replyTo: OWNER_EMAIL,
  });
  if (!confirmed.sent) console.error("[story] confirmation failed:", confirmed.reason);

  return Response.json({ ok: true });
}
