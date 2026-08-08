# FOUNDER — the SEO backend, as built

**Date:** 7 August 2026 · **Origin:** `https://www.founderbeauty.co`
**Verified against:** a clean production build (`rm -rf .next && next build`), served and inspected route by route.

This is the reference for what now exists in the codebase. It is not a plan. Everything below was built, built successfully, and checked in the emitted output.

---

## What was wrong before this pass, and is not now

| | Before | Now |
|---|---|---|
| Open Graph image | **None, on any page.** Every share — Pinterest, Instagram DM, Slack, WhatsApp, an AI answer card — rendered as a grey box | A generated card per page: default, one per serum, one per story |
| The trio (`$98.99`) | Purchasable, and invisible to every search engine — it has no page, so nothing described it as a product | `Product` + `Offer` on `/shop`, and a `multipack` line in the Merchant feed |
| Brand hierarchy | Stated in prose only, which is what answer engines paraphrase badly | A `Brand` node with a stable `@id`, owned by the Organization, referenced by every Product |
| `/search` | In the sitemap, indexable, `?q=` unbounded | `noindex, follow`, removed from the sitemap |
| `/account` | Blocked in robots.txt, but still indexable on links alone | `noindex` on the page as well as the disallow |
| Product feed | None | `/feed/products.xml`, Merchant Center ready |
| Editorial feed | None | `/feed/found-her.xml` |
| Legacy LALALOCA URLs | 404 on arrival | 30 redirect patterns, `308` |
| Core Web Vitals | No field data, and CrUX won't report for months | Reported from the first visitor |
| GA4 funnel | `view_item` → `add_to_cart` → `begin_checkout`, three gaps | Complete site-side funnel, GA4 reserved names, real `items[]` |
| Image encoding | WebP only | AVIF first, WebP fallback, 1-year cache |
| Security headers | None | HSTS, nosniff, referrer policy, frame options, permissions policy |

---

## New endpoints

| URL | What it is | Notes |
|---|---|---|
| `/feed/products.xml` | Google Merchant Center feed, RSS 2.0 + `g:` namespace | Includes the trio as `is_bundle` / `multipack`. `identifier_exists: no` — honest, because no GTINs are issued |
| `/feed/found-her.xml` | Editorial RSS | Standfirsts and links only, never full bodies — a full-text feed hands the writing to scrapers |
| `/manifest.webmanifest` | Web app manifest | Another unambiguous statement of the brand name, in a place Google reads |
| `/indexnow-key.txt` | IndexNow ownership key | 404s unless `INDEXNOW_KEY` is set — an empty key file is a failed verification, which is worse than none |
| `/opengraph-image` | Default share card | 1200×630, Founder Green, brass hairline frame |
| `/products/{slug}/opengraph-image` | Card per serum, with category, size and price | |
| `/found-her/{slug}/opengraph-image` | Card per story | |

Already existed and untouched: `/sitemap.xml`, `/robots.txt`, `/llms.txt`.

---

## Structured data, per route

| Route | Emitted |
|---|---|
| Every page | `Organization`, **`Brand`**, `WebSite` + `SearchAction` |
| `/shop` | `ItemList`, **`Product` (the trio)**, `BreadcrumbList` |
| `/products/*` | `Product`, `Offer`, `OfferShippingDetails`, `BreadcrumbList`, `FAQPage` |
| `/our-story` | **`AboutPage`**, `BreadcrumbList` |
| `/found-her` | **`ItemList` of the archive**, `BreadcrumbList` |
| `/found-her/{profile}` | `Article`, `Person`, `BreadcrumbList` |
| `/found-her/{note}` | `Article`, `BreadcrumbList` |
| `/find-your-serum` | `BreadcrumbList` |

Bold entries are new in this pass. All eighteen public routes were parsed after the build: **every JSON-LD block is valid JSON, every canonical self-references, every page emits exactly one `<h1>`, and every page carries an `og:image`.**

### Still deliberately absent

- **`aggregateRating` / `Review`** — there are no reviews. Marking up ratings that do not exist is fraud and draws a manual penalty.
- **`hasMerchantReturnPolicy`** — the return window is "to confirm" in `content.ts`. Encoding a guess would publish an unapproved commercial term as machine-readable data. Search Console will flag it as a missing recommended field; that warning is the correct trade until the policy is signed off.
- **`gtin` / `mpn`** — no barcodes issued. The feed declares `identifier_exists: no` rather than omitting the question.

---

## The GA4 funnel, complete

Internal event names are translated to GA4's reserved names on the way out. This is the single most common way an ecommerce property ends up with empty reports: `product_view` lands as a custom event and populates nothing, while `view_item` populates the funnel, the product-performance table and the revenue report.

| Step | Internal | GA4 | Fires |
|---|---|---|---|
| 1 | `product_list_view` | `view_item_list` | `/shop` renders — **new** |
| 2 | `product_select` | `select_item` | a door opens — **now carries `items[]`** |
| 3 | `product_view` | `view_item` | a product page |
| 4 | `add_to_cart` | `add_to_cart` | added, single or trio |
| 5 | `cart_view` | `view_cart` | bag drawer opens — **new** |
| 6 | `remove_from_cart` | `remove_from_cart` | line removed — **new** |
| 7 | `begin_checkout` | `begin_checkout` | handoff to Shopify — **last step this site can see** |
| 8 | `purchase` | `purchase` | **only from inside Shopify** |
| — | `site_search` | `search` | site search, debounced 700ms — **new** |
| — | `email_signup` | `sign_up` | |
| — | `web_vitals` | `web_vitals` | LCP, INP, CLS, FCP, TTFB — **new** |

**Step 8 is the one that needs your hands.** The same measurement ID has to be installed inside Shopify or GA4 shows traffic here and revenue nowhere. Details in `GA4_MEASUREMENT_PLAN.md`.

`toTrackItem()` exists so every call site builds the `items[]` array the same way — a payload like `{ product: "thirst-trap" }` reads fine and is discarded silently by GA4.

---

## Redirects for the LALALOCA migration

Thirty patterns in `next.config.ts`, all `308`, covering Shopify collection URLs, content pages, Shopify's fixed policy slugs, blog URLs, cart and account paths, and the URLs people type from memory (`/store`, `/serums`, `/lalaloca`).

Spot-checked on the built server:

```
/collections/all                          308 → /shop
/collections/frontpage/products/c-me-glow 308 → /products/c-me-glow
/pages/about                              308 → /our-story
/policies/refund-policy                   308 → /policies/returns
/blogs/news/some-post                     308 → /found-her
/lalaloca                                 308 → /shop
```

**The one input that would improve this most:** the actual list of URLs lalaloca.com used to serve — a Search Console export from the old property, an old `sitemap.xml`, or server logs. With that, every mapping becomes exact instead of falling back to a section. Section-level is the honest ceiling without it, and still far better than GoDaddy collapsing every legacy URL onto the homepage.

---

## Performance

- **AVIF first, WebP fallback.** Typically 30–50% smaller at equal perceptual quality. LCP here is almost always an image, so this is the cheapest Core Web Vitals win available.
- **Optimised images cached one year** instead of the 60-second default.
- **Real-user vitals from visitor one.** CrUX — the field data Google actually ranks on — only reports for origins with enough traffic to be statistically meaningful, which this site will not have for months.
- **Known issue, unfixed:** the bottle renders are ~350px upscaled roughly 3×. That costs LCP and looks soft. It needs larger source assets, not a code change.

---

## Environment variables

Everything below is inert until set. **`NEXT_PUBLIC_*` variables are inlined at build time — saving one in Vercel does nothing until you redeploy.**

| Variable | Unlocks | Public? |
|---|---|---|
| `NEXT_PUBLIC_GA_ID` | GA4 and Web Vitals reporting | yes |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console meta-tag verification | yes |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Bing Webmaster Tools | yes |
| `NEXT_PUBLIC_PINTEREST_SITE_VERIFICATION` | Pinterest claimed domain | yes |
| `NEXT_PUBLIC_SAME_AS` | `sameAs` — comma-separated profile URLs | yes |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `ContactPoint` on the Organization | yes |
| `INDEXNOW_KEY` | `/indexnow-key.txt` and the ping script | no |
| `ALLOW_INDEXING` | already set — the master switch for crawlers | no |

`NEXT_PUBLIC_SAME_AS` is the highest-value empty one. It is how a search engine confirms the Instagram account, the Etsy shop and this website are one entity rather than three brands with similar names — and it is what ties LALALOCA's Etsy history to the new domain. No URLs were guessed at.

---

## Using IndexNow

Once `INDEXNOW_KEY` is set in Vercel and deployed:

```bash
# after publishing or editing specific pages
INDEXNOW_KEY=<key> node scripts/indexnow-ping.mjs /found-her/new-story /shop

# or submit everything in the sitemap
INDEXNOW_KEY=<key> node scripts/indexnow-ping.mjs
```

Bing, Yandex, Seznam and Naver pull immediately rather than waiting for a crawl. **Google does not participate** — this costs nothing and does not affect Google either way. It matters because ChatGPT's web search leans on Bing's index: faster into Bing is faster into ChatGPT.

Generate a key once:

```bash
node -e "console.log(crypto.randomUUID().replace(/-/g,''))"
```

The script checks that `/indexnow-key.txt` is actually serving your key before submitting, because the API returns a bare `403` with no explanation when it cannot fetch the file.

---

## One compromise, recorded

The Open Graph cards are set entirely in Cormorant Garamond. The type rules reserve Cormorant for display and put the wordmark and small-caps lines in Jost. Registering a second face alongside it did not take in the image renderer — every line still came out in the first font — and a card that silently ignores half its type rules is worse than one knowingly set in a single face. The font is committed to the repo rather than fetched from Google at build time, so a CDN hiccup can never quietly ship cards in a fallback typeface.

---

## Verification run

```
tsc --noEmit                clean
eslint .                    clean
next build                  38 routes, 0 errors
18 public routes parsed:    18/18 one <h1>
                            18/18 self-referencing canonical
                            18/18 og:image present
                            18/18 valid JSON-LD
/search, /account           noindex, follow
all other routes            index, follow
security headers            5/5 present
feed cache-control          public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400
```
