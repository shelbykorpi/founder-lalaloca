# FOUNDER — technical SEO audit

**Origin audited:** `https://www.founderbeauty.co`
**Date:** 7 August 2026
**Method:** full route inventory of the App Router source, prerendered HTML inspection, and live HTTP measurement of all eight domain variants.

---

## Scope note, stated plainly

The brief asked for roughly a quarter's work across ten documents. This pass did the part that had to happen first: **find and fix the defects that were actively cancelling out everything else.** Six pages were telling Google not to index them. That had to be fixed before a keyword map or an Etsy plan means anything.

What's implemented and verified is below. What's deferred is listed at the end, honestly, with reasons — not buried.

---

## Correction to a premise in the brief

The brief states lalaloca.com "is currently forwarded to founderbeauty.co." **That is true, but the forward is broken in a way that defeats its purpose** — see the domain findings below. Worth flagging because a migration plan built on "the redirect is handled" would have been built on sand.

---

## Findings — before and after

### SEVERE · Six pages declared the homepage as their canonical

`/shop` and all five `/policies/*` pages set no `alternates.canonical`, so they inherited the root layout's `canonical: "/"`. Every one of them emitted:

```html
<link rel="canonical" href="https://www.founderbeauty.co"/>
```

A canonical is a page telling Google *"if you index one URL, index this one instead of me."* Six pages — including **`/shop`, the primary commercial page** — were formally requesting removal from the index in favour of the homepage.

**Fixed.** Every route now self-references. Verified across nine routes in a production build.

### SEVERE · The old-domain redirect is temporary, not permanent

`lalaloca.com` returns **`302 Found`** → `https://www.founderbeauty.co/`. Measured twice.

GoDaddy's control panel displays the forward as **"Permanent (301)"**. The wire disagrees with the UI, which means **this cannot be fixed by editing that setting** — it's GoDaddy's forwarding edge.

Why it matters for a brand migration specifically: a 301 tells Google *"lalaloca.com has moved permanently — transfer its history to the new address."* A 302 says *"keep lalaloca.com indexed, this is a temporary detour."* Every backlink, every year of branded recognition, every customer bookmark's accumulated value stays stranded on the old domain instead of consolidating into FOUNDER. This is the single most valuable unfixed item on the list.

Two further defects in the same area:
- **Domain-level only.** Every old path collapses to the homepage. `lalaloca.com/products/thirst-trap` does not reach the Thirst Trap page.
- **`www.lalaloca.com` has no DNS record at all.** Not redirected — unresolvable. Anyone who types or bookmarked the www form gets a dead page.

**Not fixed** — requires a DNS change on a second domain with live customers. Exact procedure in Owner Actions.

### MODERATE · `/share-your-story` shipped two `<h1>` elements

Both read "I found her when …". The responsive layout renders a desktop block and a mobile block and hides one with CSS — but both remain in the DOM, so both headings were live. An accessibility failure and an ambiguous document outline.

**Fixed.** `PageIntro` takes a `headingLevel` prop; the mobile copy is now `h2`. Verified: every audited route emits exactly one `h1`.

### MODERATE · `/account` was submitted and blocked simultaneously

Present in `sitemap.ts` at priority 0.8 while `robots.ts` disallowed it for every user agent. Submitting a URL you also block is a Search Console error, not a signal.

**Fixed.** Removed from the sitemap; the robots disallow stands.

### MODERATE · Structured data written but never connected

`collectionSchema()` existed in `seo.tsx` and was imported nowhere — `/shop` emitted no `ItemList`. Separately, every FOUND HER story rendered a **visible breadcrumb with no corresponding schema**, and no `Article` markup at all, despite original first-person editorial being the site's most defensible content.

**Fixed.**

| Route | Schema now emitted |
|---|---|
| All pages | `Organization`, `WebSite` + `SearchAction` |
| `/shop` | `ItemList`, `BreadcrumbList` |
| `/products/*` | `Product`, `Offer`, `OfferShippingDetails`, `BreadcrumbList`, `FAQPage` |
| `/found-her/shelby-korpi` | `Article`, `Person`, `BreadcrumbList` |
| `/found-her/*` notes | `Article`, `BreadcrumbList` |

### MINOR · Sitemap carried no `lastModified`

`profiles.ts` holds a real `approvedOn` date that was going unused. Now emitted. Deliberately **not** using build timestamps — a `lastmod` that changes on every deploy teaches crawlers to ignore the field.

---

## Verified clean

Checked and found correct, so no change made:

- **No duplicate titles or descriptions** across all 20 public routes
- **No broken internal links** — every `href` resolves
- **No hardcoded `vercel.app` or `lalaloca.com` URLs** anywhere in `src/`
- **No orphan pages** — every route is in the sitemap and internally linked
- **Every page server-rendered or statically generated**; all metadata present in initial HTML, not injected by JavaScript
- **Every route statically prerendered** — no `force-dynamic`, no client-only content gaps
- `founderbeauty.co` → `www` is a correct **308**

---

## Deliberately omitted structured data

Two fields an aggressive implementation would have added, and the reason each was left out:

- **`aggregateRating` / `Review`** — there are no reviews. Marking up ratings that don't exist is fraud and draws manual penalties.
- **`hasMerchantReturnPolicy`** — `content.ts` states the return window is "still to confirm, pending commercial and legal sign-off." Encoding a guessed window would publish an unapproved commercial term as machine-readable data. Search Console will report this as a missing recommended field on Product results; that warning is the correct trade until the policy is signed off.

---

## Facts I could not verify, which blocked work

Listed because the brief asked for them and guessing would have been worse:

1. **Old LALALOCA URL paths.** A path-level redirect map needs the old site's URL list. Available from a Search Console export on the lalaloca.com property, an old sitemap, or server logs. Without it the CSV covers domain variants only.
2. **GTINs / barcodes.** Merchant Center and AI shopping feeds prefer them. None found in the repo.
3. **Full INCI ingredient lists.** `products.ts` records these as `null` with the note "never invented." Product pages say so plainly. Required before ingredient-level search terms can be targeted honestly.
4. **Return window, condition requirements, refund timing.** Blocks return-policy schema.
5. **Etsy listing URLs, SKUs and per-channel prices.** Needed for the product-identity table and to prevent conflicting records across channels.
6. **Whether Shopify already feeds Google Merchant Center.** Determines whether a second feed would create duplicates.
7. **Social profile URLs** for `sameAs` on the Organization entity.

---

## Deferred, with reasons

Not attempted in this pass. Each needs either an input above or is a body of work in its own right:

| Deliverable | Blocked by / reason |
|---|---|
| `KEYWORD_URL_MAP.md` | Should be built from real Search Console data once the property exists. Inventing seed lists without validation is what the brief itself warns against. |
| `ETSY_FOUNDER_UNIFICATION_PLAN.md` | Needs an audit of the live Etsy shop's current titles, descriptions and listings. |
| Product-identity table | Needs SKUs, GTINs and per-channel prices (items 2 and 5 above). |
| Merchant Center feed | Needs to know whether Shopify already supplies one. |
| Remaining GA4 events (`view_item_list`, `remove_from_cart`, `view_cart`, `add_shipping_info`, `add_payment_info`, `refund`, promotions) | Several fire only inside Shopify checkout, which this codebase cannot instrument. Site-side events are done. |
| Core Web Vitals work | Needs field data from a live property, not lab guesses. The known issue is bottle renders at ~350px being upscaled ~3×. |
| 30/90/180-day publishing plan | Depends on the keyword map. |

---

## Priority order from here

1. **Fix the 302** — the highest-value unfixed item. Nothing else recovers LALALOCA's accumulated authority.
2. **Bing Webmaster Tools** — ChatGPT's search leans on Bing's index. Ten minutes, and the single best lever for the AI-discovery goal in the brief.
3. **Google Search Console** — then the keyword map becomes real work instead of guesswork.
4. **GA4 Measurement ID** — one env var away from live.
5. **Vercel trial expires in 3 days.** None of this survives the site going dark.
