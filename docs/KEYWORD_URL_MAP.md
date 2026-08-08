# Keyword → URL map

**One page owns one intent.** When two pages chase the same query they split the signal and Google picks one — usually not the one you wanted.

---

## Read this before the table

**There are no search volumes in this document, and that is deliberate.** I have no access to Keyword Planner, Ahrefs or Semrush from here. Any number I put in a "monthly searches" column would be invented, and an invented number is worse than a blank one because it gets planned against. What follows is an intent map: which page should own which kind of query, and why. Volume gets attached once Search Console has 28 days of real impressions — at which point the guesses below get corrected by data rather than confirmed by it.

**The three tiers, and where a brand this size can actually win:**

| Tier | Example | Realistic? |
|---|---|---|
| **Head** | "hyaluronic acid serum" | No. Dominated by brands with decades of links. Do not plan around it. |
| **Mid** | "8 layer hyaluronic acid serum" | Eventually. The specific formulation claim is a real differentiator and the competition is thin. |
| **Long tail** | "serum for skin that feels tight by the afternoon" | **Yes, now.** This is where the product copy already lives, and where answer engines pull from. |
| **Branded** | "founder beauty", "lalaloca serum" | **Yes, and it is the priority.** Branded search is the migration's scoreboard. |

---

## Primary map

| Query intent | Owning URL | Why that page | Status |
|---|---|---|---|
| `founder beauty`, `founder skincare` | `/` | Homepage owns the brand entity | Live. Organization + Brand schema now state the hierarchy |
| `lalaloca`, `lalaloca serum`, `lalaloca skincare` | `/shop` | The collection page is the collection | **Watch this one.** Etsy currently outranks the site for it — see the Etsy plan |
| `founder presents lalaloca`, "what is lalaloca" | `/shop` | Brand-hierarchy question | Answered in `llms.txt` and Brand schema |
| `8 layer hyaluronic acid serum` | `/products/thirst-trap` | Only page describing the formulation | **Best mid-tail opportunity on the site** |
| `hyaluronic acid serum for tight skin` | `/products/thirst-trap` | `need` copy addresses it directly | Live |
| `vitamin c brightening serum` | `/products/c-me-glow` | | Live |
| `serum for dull skin`, `look washed out in photos` | `/products/c-me-glow` | `who` copy is written in exactly these words | Live |
| `collagen firming serum` | `/products/bounce-back` | | Live |
| `serum for skin that lost its bounce` | `/products/bounce-back` | | Live |
| `which serum should i use`, `hyaluronic vs vitamin c vs collagen` | `/find-your-serum` | The quiz is the answer format | Live. Breadcrumb schema added |
| `hyaluronic acid vs vitamin c serum` (comparison) | `/shop` | The side-by-side table is already the best asset for this | Live. **Underexploited — see roadmap** |
| `serum set`, `skincare trio`, `three serum bundle` | `/shop` | | **Newly eligible** — the trio had no schema at all before |
| `can i use hyaluronic acid and vitamin c together` | `/products/*` FAQs | Already answered in every product's FAQ | Live. `FAQPage` schema makes it quotable |
| `women founder stories`, `female entrepreneur interviews` | `/found-her` | Original first-person reporting | Live. `ItemList` + `Article` added |
| `shelby korpi` | `/found-her/shelby-korpi` | | Live. `Person` schema added |
| `founder beauty shipping`, `free shipping` | `/policies/shipping` | | Live |
| `founder beauty returns` | `/policies/returns` | | **Blocked** — return window unconfirmed |

---

## Deliberate gaps, and what each would cost

These are queries with no owning page. Each is a real opportunity; none should be filled with thin content written to fill it.

| Missing intent | What it needs | Blocked by |
|---|---|---|
| `lalaloca ingredients`, `what's in thirst trap` | An ingredients page per product | Full INCI lists. `products.ts` marks these `null` — never invented |
| `is lalaloca cruelty free / vegan` | A standards page | Nobody has confirmed the answer. Do not guess this one; it is a legally loaded claim |
| `lalaloca reviews` | Reviews | There are none. This query will be answered by third parties whatever we do — the fix is real reviews, not markup |
| `hyaluronic acid vs vitamin c` (educational) | A comparison article under FOUND HER | Nothing. **This is the single best unwritten page on the site** — see the roadmap |
| `how to layer serums` | An article | Nothing. The routine advice already exists scattered across three FAQs |
| `best serum for [age] skin` | Nothing — skip | Segmenting by age invites claims the brand has decided not to make |

---

## The rule that keeps this from decaying

Before publishing any new page, ask: **what query does this own that no existing page owns?** If the answer is "the same one as `/shop`", improve `/shop` instead. Cannibalisation is the most common way a small site's rankings quietly flatten — it doesn't announce itself, it just stops improving.

---

## How this becomes real

1. Search Console property live (see the setup doc)
2. Wait 28 days for impression data
3. Export Performance → Queries → filter to position 5–20. **That band is the money.** Position 5–20 means Google already thinks the page is relevant and something small is holding it back — a title, a missing section, an internal link. Rewriting for those beats chasing anything you don't rank for at all
4. Cross-reference against the site-search report in GA4 (`search` event, now firing) — that's real customer language, unprompted, and free
5. Correct this table against the data. Delete what didn't pan out
