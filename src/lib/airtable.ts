/**
 * The FOUND HER submissions table.
 *
 * WHY THIS EXISTS ALONGSIDE THE EMAIL, NOT INSTEAD OF IT. A submission is not a
 * message, it is a thing with a state: arrived → reading → drafting → sent her
 * the text → she approved → published. An inbox has exactly two states, read
 * and unread, which is why editorial intake run from email fails the same way
 * every time: not by rejecting people, but by going quiet on them. The site
 * promises every woman who writes in that a person reads it. A table with a
 * status column and a "this has sat for 14 days" automation is how that promise
 * survives contact with volume.
 *
 * EMAIL REMAINS THE FALLBACK, DELIBERATELY. If this call fails the submission
 * still goes through — the notification is sent either way and simply says the
 * record could not be written. Losing a woman's story because a third-party API
 * had a bad minute is not an acceptable failure mode, so Airtable is treated as
 * a convenience layer over a system that already worked.
 *
 * Inert without credentials: no key means "not recorded", never an exception.
 */

const API_KEY = process.env.AIRTABLE_API_KEY;
const BASE_ID = process.env.AIRTABLE_BASE_ID;
const TABLE_ID = process.env.AIRTABLE_TABLE_ID;

export type StoryRecord = {
  name: string;
  email: string;
  location: string;
  social: string;
  canPublish: boolean;
  canContact: boolean;
  answers: Record<string, string>;
};

export type RecordResult =
  | { recorded: true; url: string }
  | { recorded: false; reason: string };

/**
 * Form field name → Airtable column.
 *
 * Kept as an explicit map rather than derived from STORY_FIELDS labels. The
 * labels carry curly apostrophes and ellipses ("I found her when…") which are
 * fine on a page and miserable as column names — one invisible character
 * difference and the write fails with an unhelpful 422.
 */
const COLUMN: Record<string, string> = {
  found: "I found her when",
  building: "What are you building",
  proud: "What are you proud of",
  cost: "What did it take",
  yourself: "What makes you feel most like yourself",
  next: "What would you tell a woman beginning now",
};

export async function recordStorySubmission(story: StoryRecord): Promise<RecordResult> {
  if (!API_KEY || !BASE_ID || !TABLE_ID) {
    return { recorded: false, reason: "Airtable credentials are not set" };
  }

  const fields: Record<string, unknown> = {
    Name: story.name,
    Email: story.email,
    /* Set here rather than by an Airtable "created time" field so the value is
       the moment she pressed send, not the moment the row happened to land. */
    Received: new Date().toISOString(),
    Status: "Inbox",
    Source: "Website form",
    "May publish": story.canPublish,
    "May contact": story.canContact,
  };

  if (story.location) fields.Location = story.location;
  if (story.social) fields["Instagram or website"] = story.social;
  for (const [key, column] of Object.entries(COLUMN)) {
    const value = story.answers[key];
    if (value) fields[column] = value;
  }

  try {
    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${API_KEY}`,
        "content-type": "application/json",
      },
      /* typecast lets Airtable coerce the ISO string into the dateTime column
         rather than rejecting the whole record over a format quibble. */
      body: JSON.stringify({ records: [{ fields }], typecast: true }),
    });

    if (!response.ok) {
      return { recorded: false, reason: `Airtable returned ${response.status}: ${await response.text()}` };
    }

    const json = await response.json();
    const id = json?.records?.[0]?.id;
    return id
      ? { recorded: true, url: `https://airtable.com/${BASE_ID}/${TABLE_ID}/${id}` }
      : { recorded: false, reason: "Airtable accepted the write but returned no record id" };
  } catch (error) {
    return { recorded: false, reason: error instanceof Error ? error.message : "unknown error" };
  }
}
