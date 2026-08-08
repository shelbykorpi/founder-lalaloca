# FOUNDER — how this operation runs

The document to hand someone. If you were unavailable for a week, this is what would let the business keep moving.

---

## The rule that keeps it organised

**One home per kind of thing. Never two.**

An operation feels chaotic when the same object lives in two places — subscribers in a mailing tool *and* customers in Shopify, stock on Etsy *and* in Shopify. Every duplicate is a future contradiction, and every contradiction costs a customer or an hour.

| Thing | Home | Never also in |
|---|---|---|
| Orders, money, inventory, customers | **Shopify** | A spreadsheet, a CRM, Etsy's own stock count |
| Story submissions and the editorial pipeline | **Airtable** — *FOUNDER — Found Her* | Your inbox as the record of truth |
| Site code, published stories, decisions | **The repo** | Anywhere |
| Conversations with people | **Gmail** | Until there is a second person, then a shared inbox |
| Brand rules, product facts | **The repo** — `brand.ts`, `products.ts` | A doc that drifts from the code |

**There is no single dashboard, and building one is a trap.** A dashboard that copies data is a dashboard that is sometimes wrong, and a number you can't trust is worse than no number.

---

## Before volume arrives

Each item has a **trigger** — the point at which not having done it starts costing real money. Ordered by how quietly it fails.

| # | Do this | Trigger | Why it's on this list |
|---|---|---|---|
| 1 | **Renew Vercel** | Now | Everything below assumes the site is up |
| 2 | **Sync Etsy stock from Shopify** | Before the first good week | Two channels, one set of bottles. You *will* sell the same unit twice. With no reviews yet, the first bad one has nothing to sit beside |
| 3 | **Shopify → Taxes → Tax liability insights** | Today, it's free | Economic nexus accrues *silently* and is often personal liability. Nobody sends a warning |
| 4 | **Confirm the return window** | Before order ~50 | Without it every return is a fresh negotiation — unbounded time, inconsistent outcomes customers compare |
| 5 | **Batch/lot numbers recorded against orders** | Before the next production run | If a batch is ever wrong you need to know who received it. This is the difference between a contained problem and an unbounded one |
| 6 | **Post-purchase review request** | The day you have 10 orders | Biggest commercial gap you have |
| 7 | **MoCRA file** | Build it now, needed at $1M | See `MOCRA_READINESS.md` |
| 8 | **Rename the Shopify business entity** | Before the next payout | It still reads `vercel-store-5078d3d6 - entity` on tax paperwork |
| 9 | **FOUNDER trademark clearance** | Before spending on the name | You already trade under it on receipts |
| 10 | **A second pair of hands** | ~20 orders/week | See below |

---

## The four SOPs

Written so someone who has never seen this business could follow them. That is the test — not whether *you* could.

### SOP 1 · Fulfil an order

1. Shopify → Orders → the unfulfilled one
2. Check stock is physically there. If it isn't, **stop** and go to SOP 4
3. Pack: bottle(s), any insert, tissue
4. **Write the batch/lot number of each bottle into the order's Notes field.** Non-negotiable — this is the recall trail
5. Buy the label in Shopify so tracking attaches to the order automatically
6. Mark fulfilled. Shopify emails the customer; do not email separately
7. Hand to carrier

**Standard:** dispatched within 2 business days. If it will be longer, email before the customer asks — a late parcel someone was warned about is not a complaint.

### SOP 2 · Handle a return

1. Confirm what the published policy says. **If the policy still isn't published, that is the bug — fix it, don't improvise**
2. Opened cosmetics have rules; a genuine problem is still our problem
3. Shopify → Orders → the order → Refund. Refund through Shopify, never by any other route, or the books and the bank disagree
4. Note the reason on the order in one word: *damaged, wrong item, changed mind, reaction, other*
5. **A reaction is not a return, it's a safety record.** Write down the product, batch number, what happened, and the date. See `MOCRA_READINESS.md`
6. Once a month, read the reasons. Three of the same means a product or a page problem, not a customer problem

### SOP 3 · Answer a complaint

1. Reply within one business day, even if the reply is "I'm looking into this."
2. Find the order first. Never ask a customer for information Shopify already has
3. Say what happened, what you're doing, and when. In that order
4. Fix it and then decide whether to explain. Not the reverse
5. **Never** dispute a factual claim about the product. Never say "no one else has had this problem"
6. If it's about a skin reaction: apologise, refund, record it (SOP 2 step 5), and do not offer medical advice or diagnose. Suggest they see a doctor if it's ongoing

### SOP 4 · Publish a story

1. Airtable → *FOUNDER — Found Her* → the row
2. **Check "May publish" is ticked. If it isn't, stop. This is the one unrecoverable mistake this brand can make**
3. Move Status → *Drafting*. Edit into a profile in the **Draft** field. Her verbatim answers stay untouched above
4. Status → *Sent her the draft*. The automation emails it to her
5. She replies. Yes → set **Approved on** to that date, Status → *She approved*. Changes → make them, send again. No → Status → *Passed*, and thank her
6. Add to `profiles.ts` in the repo, using her `Approved on` date. Deploy
7. Status → *Published*

**Never skip step 2 or step 5.** Everything else is style.

---

## Out of stock

The failure that kills growing brands isn't bad marketing, it's running out.

- Know your manufacturer's **lead time** and write it here: `______ weeks`
- Reorder point = weeks of lead time × current weekly sales × 1.5
- Set a Shopify low-stock alert at that number
- When you do run out, **keep the page up** and take back-orders with an honest date. Removing the page throws away its search ranking, and a ranking takes months to earn and one deletion to lose

---

## When to hire, and for what

**Not marketing.** The first hire is the person who packs boxes and answers email — or a 3PL that does the first half.

Those two tasks scale linearly with orders and have zero leverage. Everything else you do — the brand, the stories, the product decisions — compounds. Your hours are the only input this business can't buy more of, so spend them on the compounding half.

**Rough trigger:** when fulfilment plus support passes 10 hours a week. That's around 20 orders a week for a product like this.

**Before anyone starts:** you need these SOPs to actually be true, and a way to give someone Shopify access without giving them everything (Shopify → Users and permissions → a Staff account, not your login).

---

## What must never be automated

Three things, and they're the brand:

1. **Publishing a woman's story.** The entire promise of that page is that a person decided.
2. **The reply to an upset customer.** A templated apology reads as one.
3. **Any statement of fact about the product.** No ingredient, no result, no rating that a human didn't verify.

Automate the reminders, the routing, the receipts, the tracking emails, the nudges. Never the judgement.

---

## Where everything is

| | |
|---|---|
| Site | `founderbeauty.co` · Vercel project `founder-lalaloca` |
| Repo | `~/Founder:LALALOCA` |
| Checkout, customers, list | Shopify — `founderbeauty.myshopify.com` |
| Story pipeline | [Airtable — FOUNDER — Found Her](https://airtable.com/appHAc3Q0Hz3ArKaw) |
| Old domain | `lalaloca.com` → 308 → `www.founderbeauty.co` |
| Marketplace | Etsy, shop name LALALOCA |
| Everything needing a decision | shelbykorpi@gmail.com |

**Other documents:** `SEO_BACKEND.md`, `OWNER_ACTIONS.md`, `FORMS_AND_EMAIL_SETUP.md`, `FOUND_HER_PIPELINE.md`, `REVIEWS_AND_POST_PURCHASE.md`, `SHOPIFY_OPS.md`, `MOCRA_READINESS.md`, `CONTENT_ROADMAP_30_90_180.md`.
