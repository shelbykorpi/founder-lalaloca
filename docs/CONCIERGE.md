# The concierge

A brass bell on every page. Ring it and a leather folio opens with four desks —
Beauty, The House, Found Her, Service.

Built 9 August 2026 from your design prototype. The look is yours, unchanged.
Everything behind it is new, because the prototype's brain ran in the browser
and a brand that has to stand behind what a bot says cannot ship that.

---

## Turn it on

One variable. Nothing else is required.

| Variable | Value | Sensitive |
|---|---|---|
| `AI_GATEWAY_API_KEY` | from Vercel → AI Gateway | **yes** |

On Vercel it will also work with no key at all, using the `VERCEL_OIDC_TOKEN`
that Vercel injects at runtime. The explicit key is worth setting anyway — it
works locally too, and it makes the spend visible against one credential.

Optional:

| Variable | What it does |
|---|---|
| `CONCIERGE_MODEL` | Which model to use. Default `anthropic/claude-opus-5`. **This is the cost lever** — see below. |
| `AIRTABLE_CONCIERGE_TABLE_ID` | `tblTkSQBAfcyB1pLp` — the escalation queue. Without it, escalations still email you. |

Escalation email uses the `RESEND_API_KEY` and `OWNER_EMAIL` you already have.

**Until `AI_GATEWAY_API_KEY` is set the concierge opens, the menus work, and any
question gets an honest "I'm not connected yet" rather than an invented answer.**
That is the same posture as the two forms.

---

## What it costs, and how that is contained

A public LLM endpoint on a storefront is a bill with a URL. Five things hold it
down:

- **40 messages per IP per hour**, in its own bucket so a chat can never lock
  someone out of the story form and vice versa.
- **Replies capped** at 700 tokens — about three short paragraphs.
- **History capped** at 12 turns, so a long conversation does not resend itself.
- **Guardrail answers cost nothing.** A reaction report, a diagnosis question, a
  pregnancy question or a request for a human is answered from fixed text
  without the model being called at all.
- **`CONCIERGE_MODEL` is read at request time**, not baked in at build. If the
  spend surprises you, point it at a cheaper model and it takes effect on the
  next message — no deploy. Re-run the guardrail tests afterwards.

I have not estimated a monthly figure, because it depends entirely on traffic
you do not have yet. Watch it for a week on the AI Gateway dashboard before
deciding anything.

---

## The safety model

### The one rule

> A claim that **limits** what the product does may be written freely.
> A claim that **asserts** what the product does must already exist on the site
> or the approved label.

That asymmetry is the whole design. The concierge is allowed to talk a customer
*down* from a category myth on its own authority — "hyaluronic acid does not
hold 1000× its weight", "nothing here removes a wrinkle" — because being
conservative costs nothing if it turns out to be too cautious. It may only talk
a product *up* in words you have already approved.

### Three layers

**1. Before the model.** Five categories never reach it, and are answered with
fixed text that is identical every time:

| Trigger | Response | Emails you |
|---|---|---|
| Suspected reaction — burning, rash, swelling, hives | Stop using it, seek care if severe, MedWatch | **Yes, immediately** |
| A named skin condition, or "do I have…" | Referred to a dermatologist | No |
| Pregnancy or nursing | Ask your clinician; states only what is factual | No |
| Skin lightening | We don't make products for that | No |
| "Can I speak to a human" | Handover | **Yes** |

The reaction path is deliberately over-sensitive. A false positive costs you one
unnecessary email. A false negative is a woman with a chemical burn being sold a
serum. Those are not comparable. It does check for metaphors — *"I have a
burning question"* passes through.

**2. The model,** with a system prompt and only the retrieved facts. It cannot
see anything that is not in `knowledge.ts`, and that file is generated from
`products.ts` and `content.ts`, so it can never quote a price or a policy the
site does not have.

**3. After the model.** Its actual words are checked against a banned list
before they leave the server: clinical claims, dermatologist endorsements,
FDA-approved, hypoallergenic, invented statistics, guarantees, star ratings,
bestseller claims. A blocked answer is replaced with an honest line **and
escalated to you**, because a customer who triggered it asked something worth
answering properly.

All three run on the server. The prototype ran its equivalent in the browser,
which anyone can bypass with devtools.

### Tested

25 cases, all passing:

- 14 inbound — every trigger category fires, five ordinary questions pass
  through, and the "burning question" metaphor is not caught.
- 9 outbound — every banned phrasing blocked, two legitimate answers allowed.
- Route level, against a stub model: the handover token is stripped before it
  reaches the browser, a banned answer never reaches the customer, and retrieval
  hands the model 3,131 characters of grounded facts.

Re-run these after any change to the model or the prompt.

---

## "I'm passing this to our team" is now true

In the prototype that sentence appeared six times and nothing happened behind
any of them. It now does two things:

1. **Emails you** at `OWNER_EMAIL` with the reason, her last message, what the
   concierge said, and the full transcript. Reply-to is set to her address if
   she gave one in the conversation.
2. **Writes a row** to the new **Concierge** table in your Airtable base
   (`tblTkSQBAfcyB1pLp`) with Reason, Desk, Status, Received, Email, Last reply
   and the transcript. Status starts at *Inbox*.

The email is awaited, not fired and forgotten — a serverless function can be
frozen the moment it responds, and an escalation that never left is the exact
failure this exists to prevent.

**Work the Inbox oldest first.** A reaction report carries a 15-business-day FDA
clock under MoCRA and the clock starts when you are told, not when you read it.

---

## What I cut from your prototype, and why

The knowledge base cited three specific figures: a named 2011 trial with n=76, a
collagen molecular weight of 300,000 Daltons, and "about 55%" of free radicals
getting through SPF 20+.

They may all be sound. None of them appear anywhere on your site, none were
verified, and a bot repeating a citation makes it the brand's claim. They are
out. The honest substance survives without the false precision — the concierge
still says the multi-weight blend is a texture choice rather than a proven
upgrade, still says topical collagen is not the supplement research, still says
vitamin C is not sunscreen.

**If you want the numbers back, they need a source on file first.** Send me one
and I will put them back with the citation attached.

---

## Where everything is

| | |
|---|---|
| Widget | `src/components/concierge/Concierge.tsx` + `concierge.module.css` |
| Menus and desk copy | `src/lib/concierge/desks.ts` — pure copy, edit freely |
| Facts | `src/lib/concierge/knowledge.ts` — mostly generated |
| Voice and rules | `src/lib/concierge/prompt.ts` |
| Guardrails | `src/lib/concierge/guardrails.ts` |
| Model call | `src/lib/concierge/model.ts` |
| Escalation | `src/lib/concierge/escalate.ts` |
| Endpoint | `src/app/api/concierge/route.ts` |

To change what the concierge *says* about a product, change `products.ts`. To
change how it *sounds*, change `prompt.ts`. To change the menus, change
`desks.ts`. Those three cover almost everything.

---

## Still open

- **The niacinamide and edelweiss question.** The concierge currently refuses to
  confirm vegan status for C Me Glow and Bounce Back, and escalates instead,
  because the site and your Shopify listings disagree. Check a carton and this
  gets a straight answer.
- **The return window.** The concierge escalates every return question because
  the published policy says the terms are still to be signed off. Once they are,
  it can answer directly.
- **No conversation logging.** Only escalations are recorded. If you later want
  to see what people ask that the bot could not answer, that is a small addition
  — and worth doing, because it is the best product-research feed you will get.
