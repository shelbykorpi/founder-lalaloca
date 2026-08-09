/**
 * The confirmation a woman gets the moment she submits a FOUND HER story.
 *
 * ── THIS COPY IS THE OWNER'S, VERBATIM ──────────────────────────────────────
 *
 * Written by Shelby and dropped in as given. It is not marketing copy and it
 * should not be "improved" by anyone editing this file later — it is the first
 * thing the brand says to someone who has just written down something personal,
 * and it makes specific promises about editing, approval, photographs and
 * commercial use that she decided on deliberately.
 *
 * If it changes, it changes because she changed it.
 *
 * ── WHY THERE ARE TWO VERSIONS ──────────────────────────────────────────────
 *
 * The form has two separate permissions:
 *
 *   "You can email me about what I've sent."            — required
 *   "You can consider this for publication."            — OPTIONAL
 *
 * Someone can send a story and deliberately not tick the second one. Sending
 * her the publication text — how we'll edit it, when we'll send the draft, what
 * portrait photographs to reply with — would be answering a question she
 * explicitly did not ask, on the one subject where this brand cannot afford to
 * look like it wasn't listening.
 *
 * So the shared parts are shared, and everything downstream of "we intend to
 * publish this" is replaced with an acknowledgement that she held it back and
 * that doing so was a legitimate choice.
 */

import { BRAND } from "./brand";

export const STORY_CONFIRMATION_SUBJECT = "We have your story";

/**
 * The form collects one free-text name field, so it holds whatever she typed —
 * "Sarah", "Sarah Chen", or "sarah chen from portland". The greeting wants a
 * first name.
 *
 * Taking the first whitespace-separated word is right far more often than it is
 * wrong, and the failure mode is mild: she sees the name she typed. Deliberately
 * NOT capitalised or otherwise corrected — rewriting someone's name to a pattern
 * is how you turn "de Souza" into "De" and an honorific into a first name.
 */
const HONORIFICS = new Set(["mr", "mrs", "ms", "miss", "mx", "dr", "prof", "rev"]);

export function firstName(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";

  /* "Dr. Anne Wu" must not open with "Hi Dr.," — the one edge case common
     enough, and jarring enough, to be worth three lines. Only skipped when
     there is something after it. */
  const stripped = words[0].replace(/\.$/, "").toLowerCase();
  if (words.length > 1 && HONORIFICS.has(stripped)) return words[1];

  return words[0];
}

/** Everything above the fork. */
function opening(name: string): string[] {
  return [
    `Hi ${firstName(name)},`,
    "",
    "Thank you for trusting us with your story.",
    "",
    "FOUND HER was created for the part people do not always see: what a woman",
    "built, carried, survived, changed, finished, or began again before anyone",
    "else gave it a name.",
    "",
    "By writing yours down, you gave that part of your life a place to be seen.",
    "You may also help another woman recognize something in herself.",
  ];
}

/** Everything below the fork. */
function closing(): string[] {
  return [
    "",
    "What you wrote matters. We are honored to give it a room of its own.",
    "",
    BRAND.campaign,
    "",
    "FOUNDER",
    "THE ROOM IS YOURS.",
    "founderbeauty.co",
  ];
}

/**
 * She ticked the publication permission. The full text: what happens to the
 * story, what we will and will not publish, how to send photographs, and the
 * explicit limit on commercial use.
 */
function publicationBranch(): string[] {
  return [
    "",
    "Every story submitted to FOUND HER will be prepared for publication on",
    "founderbeauty.co as long as it meets our standard editorial and publishing",
    "guidelines. This is not a competition, and you do not need a company,",
    "title, purchase, or traditional definition of success to belong here.",
    "",
    "A member of the FOUNDER team will personally review your submission. We may",
    "make light edits for clarity, length, grammar, or privacy while preserving",
    "your voice and meaning. We will send you the final version for approval",
    "before it is published. Nothing will appear under your name until you have",
    "read it and said yes.",
    "",
    "We do not publish content that is sexually explicit, threatening, hateful,",
    "defamatory, unlawfully revealing of another person’s private information,",
    "exploitative, or likely to cause harm. Stories may speak honestly about",
    "difficult experiences, survival, loss, abuse, illness, addiction, failure,",
    "or starting again. The subject does not have to be easy. It simply has to be",
    "shared responsibly.",
    "",
    "If you would like photographs to appear with your story, reply to this email",
    "with two portrait photos:",
    "",
    "  · One clear, close or waist-up portrait.",
    "  · One wider portrait, ideally taken somewhere connected to your life,",
    "    work, or story.",
    "  · Send vertical, well-lit, high-resolution original images — not",
    "    screenshots.",
    "  · Your face should be clearly visible, and the photos should feature only",
    "    you.",
    "  · Do not submit nudity, sexually explicit or suggestive imagery, graphic",
    "    violence, hateful symbols, heavy filters, text overlays, or watermarks.",
    "  · You must own the photographs or have permission from the photographer",
    "    to submit them.",
    "",
    "Photographs are completely optional. Sending them gives FOUNDER permission",
    "to review them for your FOUND HER profile. We will confirm the final story",
    "and selected photographs with you before publication.",
    "",
    "In addition to appearing on founderbeauty.co, some women may be invited to",
    "have their story and portrait featured on future FOUNDER products or",
    "packaging. If your story is considered for that opportunity, we will contact",
    "you separately with the exact proposed use and request additional written",
    "permission. Website publication does not automatically grant FOUNDER",
    "permission to use your story or image commercially.",
  ];
}

/**
 * She did not tick it.
 *
 * Short on purpose. She withheld a permission; the correct response is to
 * confirm we noticed and stop talking about publishing — not to explain at
 * length what she is missing, which would read as a sales pitch for changing
 * her mind.
 *
 * The door is left open in one sentence because some women tick nothing on a
 * first pass and decide later, and she should not have to write the whole thing
 * again to change her answer.
 */
function readOnlyBranch(): string[] {
  return [
    "",
    "You did not give us permission to consider this for publication, so we",
    "won’t. A member of the FOUNDER team will read it and nothing more. That is",
    "a perfectly good reason to have sent it — some things are worth writing down",
    "and not worth publishing, and you are the only person who gets to decide",
    "which this is.",
    "",
    "If you ever change your mind, reply to this email and say so. Nothing would",
    "happen without your approval even then: you would see the final text first",
    "and could still say no.",
  ];
}

export function storyConfirmationText(name: string, canPublish: boolean): string {
  return [
    ...opening(name),
    ...(canPublish ? publicationBranch() : readOnlyBranch()),
    ...closing(),
  ].join("\n");
}
