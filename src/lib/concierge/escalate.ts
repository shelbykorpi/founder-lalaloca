/**
 * Making "I'm passing this to our team" true.
 *
 * The design prototype said that sentence in six different places and nothing
 * happened behind any of them. That is worse than not offering — the moments
 * the concierge escalates are, by construction, the moments that matter most: a
 * reaction, an allergy, an order that has gone wrong, a woman offering her
 * story. A promise made there and not kept is the one failure this brand cannot
 * absorb.
 *
 * So escalation is a real side effect with two destinations, and the email is
 * the one that must not fail:
 *
 *   Email    → the owner inbox, always, with the whole conversation attached.
 *   Airtable → a row with a status, when the table is configured.
 *
 * The split is the same one the story form already makes and for the same
 * reason: an inbox has two states, read and unread. A queue that needs chasing
 * needs somewhere to be chased.
 */

import { OWNER_EMAIL, sendEmail } from "../email";
import type { Msg } from "./model";

const API_KEY = process.env.AIRTABLE_API_KEY;
const BASE_ID = process.env.AIRTABLE_BASE_ID;
/** Separate from the FOUND HER table on purpose — different thing, different queue. */
const TABLE_ID = process.env.AIRTABLE_CONCIERGE_TABLE_ID;

export type Escalation = {
  desk: string;
  reason: string;
  /** Full transcript, oldest first. */
  history: Msg[];
  /** What the concierge said before handing over, if anything. */
  reply: string;
  /** Only present if she volunteered it in the conversation. Never solicited by regex. */
  email?: string;
};

export type EscalationResult = { notified: boolean; recorded: boolean; url?: string };

function transcript(history: Msg[]): string {
  return history
    .map((m) => `${m.role === "user" ? "HER" : "CONCIERGE"}: ${m.content}`)
    .join("\n\n");
}

async function record(e: Escalation): Promise<{ recorded: boolean; url?: string }> {
  if (!API_KEY || !BASE_ID || !TABLE_ID) return { recorded: false };

  const fields: Record<string, unknown> = {
    Reason: e.reason,
    Desk: e.desk,
    Status: "Inbox",
    Received: new Date().toISOString(),
    Transcript: transcript(e.history),
    "Last reply": e.reply,
  };
  if (e.email) fields.Email = e.email;

  try {
    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
      method: "POST",
      headers: { authorization: `Bearer ${API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({ records: [{ fields }], typecast: true }),
    });
    if (!response.ok) {
      console.error("[concierge] Airtable write failed:", response.status, await response.text());
      return { recorded: false };
    }
    const id = (await response.json())?.records?.[0]?.id;
    return id
      ? { recorded: true, url: `https://airtable.com/${BASE_ID}/${TABLE_ID}/${id}` }
      : { recorded: false };
  } catch (error) {
    console.error("[concierge] Airtable write threw:", error);
    return { recorded: false };
  }
}

export async function escalate(e: Escalation): Promise<EscalationResult> {
  /* Row first, so the notification can carry a link straight to it — the same
     ordering the story route uses. */
  const stored = await record(e);

  const lastQuestion = [...e.history].reverse().find((m) => m.role === "user")?.content ?? "—";

  const body = [
    `The concierge handed a conversation over.`,
    "",
    `Reason:  ${e.reason}`,
    `Desk:    ${e.desk}`,
    e.email ? `Email:   ${e.email}` : `Email:   not given — she may have left no way to reply`,
    "",
    "HER LAST MESSAGE",
    "",
    lastQuestion,
    "",
    "─".repeat(60),
    "",
    "WHAT THE CONCIERGE SAID",
    "",
    e.reply || "(nothing — the handover replaced the answer)",
    "",
    "─".repeat(60),
    "",
    "FULL CONVERSATION",
    "",
    transcript(e.history),
    "",
    stored.recorded ? `Open in the queue: ${stored.url}` : "NOTE: this could not be written to the Airtable queue, so this email is the only copy. Keep it.",
  ].join("\n");

  /* Awaited, not floated. A serverless function can be frozen the moment it
     responds, and an escalation that never left is the exact failure this
     module exists to prevent. */
  const sent = await sendEmail({
    to: OWNER_EMAIL,
    subject: `Concierge — ${e.reason}`,
    text: body,
    ...(e.email ? { replyTo: e.email } : {}),
  });

  if (!sent.sent) console.error("[concierge] escalation email failed:", sent.reason);

  return { notified: sent.sent, recorded: stored.recorded, url: stored.url };
}
