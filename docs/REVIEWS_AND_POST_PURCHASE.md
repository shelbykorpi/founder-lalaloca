# Reviews and the post-purchase flow

**The single biggest commercial gap in the business.** Every competitor's product page carries a star rating. Yours carries none, and won't until real customers leave them.

---

## What I built, and why it's shaped this way

The temptation with a gap this visible is to soften it — seed a few reviews, mark up a rating "provisionally", let the schema say 4.8 because it probably will be. That's fraud, it draws a Google manual penalty, and it would undo the one position this brand actually has.

So the rule is now **structural rather than a matter of discipline.** `src/lib/reviews.ts` is the only source of review data on the site. It is empty. The product page section and the `aggregateRating` in the structured data both derive from it, so **there is no path by which the site can display a rating nobody left** — not because someone remembers not to, but because there's nowhere for a fake one to come from.

**Verified both directions:**

| | Result |
|---|---|
| Zero reviews (today) | No `aggregateRating`, no `Review` nodes, `Product` schema otherwise intact |
| Seeded with a 5 and a 4 | `ratingValue: 4.5`, `reviewCount: 2`, two `Review` nodes, correctly rounded |
| A second product with none | Still completely clean |

The seed was removed after testing. The mechanism works the moment real data arrives.

---

## Which platform

**Judge.me**, on its free plan. Unlimited reviews, photo and video, automatic review-request emails, and no cost at any volume you'll see this year. Loox and Reviews.io are trial-only; Stamped caps its free tier at 50 orders a month.

### The trap specific to your setup

Review apps installed on Shopify inject their star widget and their rating markup into the **Shopify storefront**. Your customers never see that storefront — they see `founderbeauty.co`, which is this codebase.

So installing Judge.me gets you collection and moderation, but **the reviews still have to be fetched and displayed here.** When you're ready, that's one function: replace the body of `getReviews()` in `src/lib/reviews.ts` with a call to Judge.me's API. Everything downstream starts working immediately and keeps working if the call ever fails.

I did not write that fetch yet — I couldn't reach Judge.me's API documentation to confirm the endpoint and parameters, and I'm not shipping an integration I can't verify. Send me the API token once you've installed it and I'll write it properly.

**One thing to watch afterwards:** if you ever expose the Shopify product pages publicly as well, make sure only one of the two sites emits rating markup for the same product. Two different ratings for one item and Google trusts neither.

---

## Getting the first reviews

### 1. Install Judge.me (10 min)
Shopify → Apps → Judge.me → free plan. Import any existing Etsy reviews if the app offers it — that history is real and it's yours.

### 2. Turn on the request email
Judge.me → Settings → Review requests.

- **Send 14 days after fulfilment.** Not delivery, not purchase. Fourteen days is roughly when someone has used a serum enough to have an opinion but not so long that they've forgotten ordering it.
- One reminder at 21 days. Then stop. A third email is nagging.

### 3. Write the request yourself

The default template is generic and it converts badly. Yours should:

- Use her first name and name the actual product she bought
- Ask **one** question, not "leave a review" — *"Has it changed anything?"* gets a real sentence; *"rate your purchase"* gets four stars and silence
- Say plainly that a bad review is useful and will not be deleted. Counterintuitive, and it's what makes the good ones believable
- **Offer nothing in exchange.** Incentivised reviews must be disclosed under FTC rules, disclosed reviews are discounted by readers, and undisclosed ones are a legal problem. Free is also cheaper

### 4. Ask for photos
Photo reviews convert substantially better than text alone in beauty, and Judge.me collects them free.

---

## What "good" looks like

- **20–30 reviews per product** is where a rating starts being believed. Below about 10 it reads as friends and family
- **A 4.6–4.8 average with some 3s in it outperforms a flat 5.0.** A perfect score reads as filtered, and shoppers actively search out the critical ones
- **Never delete a bad review.** Reply to it publicly, fix what's fixable, and let it stand. A visible bad review that was handled well is a selling point; a wall of 5s is not

---

## The rest of the post-purchase sequence

Reviews are one email in a sequence that mostly doesn't exist yet. All of these run from Shopify Email at no cost:

| When | Email | Why |
|---|---|---|
| Immediately | Order confirmation | Shopify sends this. Check it looks like the brand |
| On dispatch | **Shipping confirmation with tracking** | This one email removes most of your future support volume. "Where is my order" is the majority of beauty support tickets and it's almost entirely preventable |
| Day 3 after delivery | How to use it | Reduces returns from misuse, and sets up the review ask by making sure they actually used it |
| **Day 14** | **Review request** | The one above |
| Day 45 | Reorder reminder | A 50ml serum at 3–5 drops daily runs roughly 6–8 weeks. Time this to just before empty |

Build them in that order of value: **shipping confirmation first**, review request second. The rest can wait.

---

## When reviews exist

Three things happen, in this order:

1. **Connect Judge.me to `getReviews()`.** Ratings appear on the product pages and in the schema automatically.
2. **The `aggregateRating` gap in `SEO_AUDIT.md` closes** — the one deliberate omission that was costing rich results.
3. **Then, and only then**, the Merchant Center feed can carry ratings too.

Nothing before step 1. The order matters because every one of those is downstream of real customers having said something real.

---

**Sources:** [Best Shopify review apps 2026 — Craftshift](https://craftshift.com/best-shopify-review-apps-2026/)
