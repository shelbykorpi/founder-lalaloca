# 30 / 90 / 180-day plan

Written on the assumption that the technical work in `SEO_BACKEND.md` is deployed. Everything here is either an owner action or a content decision — the code side is done.

**One honest caveat up front:** a new domain does not rank for competitive terms in month one, and nothing in this plan changes that. What the plan does is make month six possible. Expect impressions before clicks, and branded queries before anything else.

---

## Days 0–30 — switch on the instruments

Nothing here is content. It is all measurement, and it comes first because the 90-day plan is supposed to be built from real data rather than from my guesses.

| # | Action | Time | Owner |
|---|---|---|---|
| 1 | **Renew Vercel.** Everything below assumes the site is up | — | you |
| 2 | Deploy this branch | 5 min | you |
| 3 | Bing Webmaster Tools + sitemap + IndexNow | 15 min | you |
| 4 | Google Search Console, both domains, submit sitemaps | 20 min | you |
| 5 | GA4 property → send me the Measurement ID | 15 min | you |
| 6 | **Same GA4 ID inside Shopify + cross-domain domains listed** | 15 min | you |
| 7 | GA4 data retention → 14 months (default 2 silently discards year one) | 2 min | you |
| 8 | `NEXT_PUBLIC_SAME_AS` — Etsy, Instagram, TikTok | 5 min | you |
| 9 | Etsy About + announcement linking to founderbeauty.co | 15 min | you |
| 10 | Check whether Shopify already feeds Merchant Center, then set up the feed | 30 min | you |
| 11 | Confirm the return window with whoever signs it off | — | you |
| 12 | Larger bottle renders — currently ~350px upscaled ~3× | — | you |

Then wait. Twenty-eight days of Search Console data is the input to everything in the next phase.

**End-of-30 checkpoint:** site indexed, GA4 recording purchases with revenue attributed, Bing and Search Console both reporting impressions, `sameAs` connecting Etsy to the site.

---

## Days 31–90 — publish the pages that don't exist yet

Four pieces. Not a content calendar — four specific pages, each owning a query no current page owns.

### 1. Hyaluronic acid vs vitamin C vs collagen — which serum, and why
**The single best unwritten page on the site.**

The comparison table on `/shop` is already the strongest asset for this intent and it is buried below three door animations on a page whose job is transactional. As a standalone editorial piece under FOUND HER it can own the comparison query outright, and comparison content is disproportionately quoted by answer engines because it is structured, specific and decisive.

Rules: no clinical claims, no "best for your skin type" diagnosis. What each ingredient *is*, what each is *for*, and how to choose. Link to all three products.

### 2. How to layer three serums
The routine advice already exists, scattered across nine FAQs. Consolidated, it answers a query nobody at this brand currently owns, and it increases average order value by making the trio make sense.

### 3. Two more FOUND HER profiles
The archive has one profile and three notes. `ItemList` and `Article` schema are in place; the section needs volume to be recognised as an editorial hub rather than a page.

Original first-person interviews are the one kind of content that cannot be produced by summarising someone else's page — which is what both Google's helpful-content system and every answer engine are built to reward. It is also the only content here a competitor cannot copy.

### 4. Ingredients pages — **only if the INCI lists arrive**
`products.ts` marks these `null` and the product pages say so plainly. If the supplier sheets come through, this unlocks a whole tier of honest ingredient-level queries. If they don't, **do not write these pages.** A guessed ingredient list is the single most damaging thing that could be published here.

### Also in this window

- Rewrite titles and meta descriptions for anything sitting in **position 5–20** in Search Console. That band is where the return is: Google already thinks the page is relevant and something small is holding it back
- Read the site-search report (`search` event, now firing). Real customer language, unprompted, free — and it will contain products you don't sell, which is its own kind of research
- Etsy listing titles and descriptions
- First monthly AI check (the five questions in `AI_DISCOVERY_SETUP.md`)

**End-of-90 checkpoint:** 4–6 new indexed pages, branded search trending up, at least one non-branded query with real impressions, `purchase` events with revenue attributed to source.

---

## Days 91–180 — compound what worked

By now the data says what to do, so this is deliberately less prescriptive.

**Double down on whatever the 90-day data rewarded.** If the comparison article earns impressions, write the next three comparisons. If a FOUND HER profile outperforms every product page, the editorial platform is the growth engine and should be resourced like one. Do not spread effort evenly across things that performed unevenly.

**The four structural jobs for this window:**

1. **Reviews.** The largest remaining gap, and unfixable by markup. Every competitor has `aggregateRating` and FOUNDER honestly cannot. A post-purchase email sequence through Shopify, with reviews collected on a platform whose markup is legitimate, closes it. Until then the Etsy shop is the only social proof the brand has.

2. **Links.** No amount of on-page work substitutes. For this brand the credible routes are the founder story — the kitchen-table business, the chicken barns, the delivery year — pitched to founder and small-business press, and the FOUND HER profiles, each of which has a subject with her own audience and her own reason to link.

3. **Core Web Vitals, from field data.** By 180 days there should be enough `web_vitals` events to know what is actually slow rather than what Lighthouse guesses. The bottle renders are the known suspect.

4. **Return policy schema.** The moment the window is signed off, `hasMerchantReturnPolicy` goes in and the Product results stop showing a missing-field warning. `seo.tsx` has the hook (`returnPolicyGap`) waiting.

**End-of-180 checkpoint:** non-branded organic traffic that is not zero, at least one page ranking top-20 for a mid-tail query, revenue attributable to organic search in GA4, and an answer engine that describes the FOUNDER/LALALOCA relationship correctly.

---

## What I'd stop you doing

| Tempting | Why not |
|---|---|
| Publishing weekly to "feed the algorithm" | Four good pages beat twenty thin ones, and thin pages actively drag a small site down |
| Buying links or guest-post packages | The one category of mistake that can get a domain penalised outright |
| Adding `aggregateRating` before there are reviews | Fraud, manual penalty, and it undoes the honesty position that is currently a genuine advantage |
| Chasing "hyaluronic acid serum" head-on | Decades of links stand in front of it. The mid-tail is winnable now |
| Rewriting pages that rank 40+ | Position 5–20 is where effort converts. Below that, the page needs a reason to exist, not a better title |
| Renaming the Etsy shop to FOUNDER | Discards the only reviews and sales history the brand has |

---

## The scoreboard

Check monthly. Five numbers, no dashboard needed.

| Metric | Where | 180-day target |
|---|---|---|
| Branded impressions | Search Console | Trending up, consistently |
| Non-branded clicks | Search Console | > 0, and growing |
| Indexed pages | Search Console → Pages | 20+, no unexpected exclusions |
| Organic revenue | GA4, once Shopify is wired | > 0 and attributable |
| "Is LALALOCA the same as FOUNDER?" | Ask ChatGPT monthly | Answered correctly |

That last one is not a joke metric. It is the migration's real test — if a model still describes LALALOCA as an independent Etsy shop in six months, the unification hasn't landed no matter what the redirects say.
