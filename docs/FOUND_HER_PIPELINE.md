# The Found Her pipeline

**Base:** [FOUNDER — Found Her](https://airtable.com/appHAc3Q0Hz3ArKaw) · already created in your Airtable account
**Table:** Submissions · `tblJ8hEvxMcE0YSV6`

Every story now lands in two places: the Airtable pipeline **and** your inbox. Email is the fallback, not the dependency — if Airtable is down the submission still reaches you, and the email says so.

---

## Why a pipeline and not just an inbox

A submission isn't a message. It's a thing with a **state**: arrived → reading → drafting → sent her the text → she approved → published.

An inbox has two states. Read and unread.

That gap is why editorial intake run from email fails the same way every time — not by rejecting people, but by **going quiet on them.** Something arrives, you mean to come back to it, eleven more land on top. You've promised every woman who writes in that a person reads it. This is the machinery that makes that promise survive volume.

---

## What's in the table

| Field | Why it's there |
|---|---|
| **Status** | The eight states above. Drag between them in a Kanban view |
| **May publish** | **She ticked this on the form.** If it's unchecked, no part of that story goes anywhere, ever. Not a preference — a permission. As a column you can *filter* on it; in an email body it's a sentence you have to remember to read |
| **May contact** | Required on the form, so it should always be ticked |
| Her six answers | Verbatim, one field each. Never edit these — edit the Draft |
| **Draft** | Rich text. Her words stay untouched above; this is what would go on the site |
| **Approved on** | The date **she** signed off on the final text. Leave blank until she has actually said yes. This becomes the story's date on the site |
| **Days waiting** | Auto-calculated. Goes blank once Published or Passed, so finished work stops nagging |
| **Slug** | URL segment if published, e.g. `shelby-korpi` |
| Notes to self | Your thinking. Never sent to her |

There's one **EXAMPLE row** so the views make sense before the first real submission. It's backdated so you can see *Days waiting* working. Delete it once a real one lands.

---

## Three views to make (5 minutes, in Airtable)

The default grid has twenty columns and is unusable. Make these instead — click **+** next to *Grid view*:

**1. "Inbox" — Kanban, stack by Status**
Your main screen. Drag a card from *Inbox* to *Reading* to *Drafting*. Hide every field except Name, Email, Days waiting, May publish.

**2. "Needs a nudge" — Grid**
Filter: `Days waiting` **is greater than** `14`. Sort by Days waiting, descending.
This is the view that earns the whole system. Anything here is a woman who wrote something honest and heard nothing back.

**3. "Ready to publish" — Grid**
Filter: `Status` **is** `She approved` **AND** `May publish` **is** checked.
Two conditions, deliberately. The second is the guard against the one unrecoverable mistake this page can make.

---

## Two automations (10 minutes, in Airtable → Automations)

### "Nudge me about stale submissions"
- **Trigger:** At scheduled time → Weekly, Monday 8am
- **Action:** Find records → view *Needs a nudge*
- **Action:** Send email → to `shelbykorpi@gmail.com`
  Subject: `Found Her — {{count}} submissions are waiting`
  Include the grid of results.

Skip the "if count is zero" condition on your first pass — a quiet Monday email confirming nothing is stuck is worth more than a clever one that might be silently broken. Add the condition once you trust it.

### "Ask her to approve the draft"
- **Trigger:** When record matches conditions → `Status` is `Sent her the draft`
- **Action:** Send email → to the record's `Email`
  Paste the `Draft` field into the body. Ask her to reply yes, no, or with changes — and say plainly that no needs no explanation.

When she says yes: set `Approved on` to that date and move Status to *She approved*. That date is what the site publishes.

**What I'd deliberately not automate: publishing.** The entire promise of that page is that a human decided. Keep the last step manual.

---

## Turning it on

Two new environment variables in Vercel, then redeploy.

**1. Airtable personal access token** — airtable.com/create/tokens

- Name: `FOUNDER site`
- Scopes: **`data.records:write`** only. Nothing else — this token never needs to read a record or see your other base
- Access: **only** the `FOUNDER — Found Her` base
- Copy the token (starts `pat`). You get one look at it

**2. Vercel → Settings → Environment Variables**

| Variable | Value | Sensitive |
|---|---|---|
| `AIRTABLE_API_KEY` | `pat…` | **yes** |
| `AIRTABLE_BASE_ID` | `appHAc3Q0Hz3ArKaw` | no |
| `AIRTABLE_TABLE_ID` | `tblJ8hEvxMcE0YSV6` | no |

Then **redeploy**, and submit a test story to yourself. You should get the usual email — now carrying an **"Open in the pipeline"** link — and a new row sitting in *Inbox*.

If the variables aren't set, nothing breaks. Submissions keep arriving by email exactly as they do today, and the notification just doesn't have a link.

---

## The rest of "everything and everyone"

**People stay in Shopify.** You already have a customer database — buyers, subscribers, tags, notes, segments. A second people-database recreates the exact split we avoided with the mailing list. Even a story subject who's never bought anything can be a Shopify customer tagged `found-her-subject` with no marketing consent. One place for humans.

**Customer service email stays in Gmail** until there's a second person answering it. Shared inboxes (Front, Missive, Help Scout) are a real category, but the trigger for one is a *colleague*, not volume — the problem they solve is two people replying to the same message.

**The cost ceiling:** Airtable's free tier is 1,000 records per base. At a thousand submissions you'd move to Team, about $20/month. That's a good problem and it's a long way off.

---

## How this was tested

Both paths were exercised against a mock Airtable API:

| Case | Result |
|---|---|
| Full submission | Row written with all six answers, both consent flags, location, social, `Status: Inbox`, `Source: Website form` |
| Partial submission (three answers left blank) | Only the answered fields written — no empty strings cluttering the table |
| Consent = false | `May publish: false` recorded, and the notification says *"Do not publish any part of this"* |
| **Airtable unreachable** | **Submission still succeeded.** Email sent, carrying *"this could not be written to the pipeline, so this email is the only copy. Keep it."* |
| No credentials set | Silently skipped — the system behaves exactly as it did before Airtable existed |

`tsc` clean, `eslint` clean, production build clean.
