# Search Console, Bing and Merchant Center — setup

Ordered by return per minute spent. Every step needs your accounts; none of it can be done from here.

---

## 1. Bing Webmaster Tools · best return per minute on this entire list

Almost nobody bothers, which is exactly why it's worth doing. **ChatGPT's web search leans substantially on Bing's index** — so for the AI-visibility goal specifically, Bing matters more than Google, and it takes about ten minutes.

1. bing.com/webmasters → Add site → `https://www.founderbeauty.co`
2. **Verify.** Easiest path: import from Google Search Console once that exists (do step 2 first if you want the shortcut). Otherwise take the meta-tag option, and set the token in Vercel as `NEXT_PUBLIC_BING_SITE_VERIFICATION` — the tag renders automatically. **Redeploy after saving it**; `NEXT_PUBLIC_*` values are baked in at build time.
3. Submit `https://www.founderbeauty.co/sitemap.xml`
4. Turn on **IndexNow**. Bing pulls a changed URL immediately instead of waiting for a crawl.
5. Also add `lalaloca.com` so you can watch the old domain's traffic transfer.

### IndexNow, once verified

Generate a key:

```bash
node -e "console.log(crypto.randomUUID().replace(/-/g,''))"
```

Set it in Vercel as `INDEXNOW_KEY` (all environments) and **redeploy** — `/indexnow-key.txt` deliberately 404s until it exists, because an empty key file is a failed verification rather than a missing one. Then:

```bash
INDEXNOW_KEY=<key> node scripts/indexnow-ping.mjs                        # everything in the sitemap
INDEXNOW_KEY=<key> node scripts/indexnow-ping.mjs /found-her/new-story   # just what changed
```

The script checks the key file is serving before it submits, because the API returns a bare `403` with no explanation when it cannot fetch it.

---

## 2. Google Search Console

1. Add a **Domain property** for `founderbeauty.co` — not a URL-prefix property. Domain covers every subdomain and both protocols in one place, which matters when you have `www` and apex both configured.
2. Verify by **DNS TXT record** at GoDaddy. Better than the meta tag: it survives any change to the site and covers subdomains. (The meta tag is available as a fallback — `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, then redeploy.)
3. Submit `https://www.founderbeauty.co/sitemap.xml`
4. URL-inspect and **Request indexing** for: `/`, `/shop`, the three product pages, `/our-story`, `/found-her`. This is the one time manual submission is worth the clicking — it seeds the index rather than waiting for discovery.
5. **Add a second property for `lalaloca.com`.** Do not skip this. It is the only way to see whether the old domain's traffic is actually transferring, and it preserves the historical data for comparison.
6. Link to GA4: GA4 → Admin → Product Links → Search Console.

### On the Change of Address tool

Usable only once lalaloca.com serves true 301/308s — confirm with `curl -sI https://lalaloca.com | head -3` first. Note also that the tool is designed for whole-site moves. If lalaloca.com never served a full site (only a forward), it may not apply at all. Check `site:lalaloca.com` in Google to see what is actually indexed before deciding.

### What to expect, honestly

Nothing for two to four weeks. Then impressions before clicks, and branded queries before anything else. A new domain does not rank for competitive terms in month one no matter what was built — the work done now is what makes month six possible.

---

## 3. Google Merchant Center

This is what gets the serums into the Shopping tab, into free product listings, and into the product data Gemini and AI Overviews draw on when someone asks what to buy. On-page `Product` schema alone does not do that.

### Check this first — it decides everything else

**Is Shopify already syncing to Merchant Center via the Google & YouTube channel app?**

- **If yes:** do not add the feed below. Two sources create a duplicate record for every product and Merchant Center flags them. Instead, verify that the Shopify sync's product URLs point at `founderbeauty.co` and not at the raw `.myshopify.com` domain — if they point at Shopify, the brand story, the FAQs and the schema are all bypassed.
- **If no:** proceed.

### Setup

1. merchants.google.com → create account → business name **FOUNDER** (the name on the receipt, which is what the policy requires)
2. **Verify and claim** `founderbeauty.co`. Fastest route is to link the Search Console property from step 2.
3. Shipping: Free standard, US, 3–5 business days. Matches `/policies/shipping` and the `OfferShippingDetails` schema. Add Express at $15, 1–2 days if you want it available.
4. **Returns: leave blank.** The window is unconfirmed. Merchant Center will show a warning; that warning is correct and honest, and it disappears the day the policy is signed off.
5. Products → Feeds → Add feed → **Scheduled fetch**:
   - URL: `https://www.founderbeauty.co/feed/products.xml`
   - Frequency: daily
   - Country: United States · Language: English

### What the feed contains

Four items: the three serums plus the trio, marked `is_bundle` and `multipack: 3` so the set does not read as duplicate inventory competing with its own contents.

`identifier_exists: no` is declared on every item because no GTINs have been issued. This is a supported, honest value — omitting it while also omitting `gtin` and `mpn` is what actually triggers disapproval.

### Expect two warnings, and expect them to stay

| Warning | Why | Fix |
|---|---|---|
| Missing GTIN | No barcodes issued | Buy a GS1 prefix, or accept it. Not urgent at this catalogue size |
| Missing return policy | Unconfirmed | Sign off the return window |

Neither blocks the listings. Both are the correct trade against publishing something untrue.

---

## 4. Pinterest — worth ten minutes for a beauty brand

Pinterest is a search engine that happens to look like a mood board, and it indexes product pages. Now that every page has a real Open Graph image, shares actually render.

1. Business account → Settings → Claimed accounts → Claim website
2. Take the meta-tag option → set `NEXT_PUBLIC_PINTEREST_SITE_VERIFICATION` in Vercel → **redeploy**
3. Claiming also enables Rich Pins, which pull live price and availability from the existing `Product` schema — no extra markup needed

---

## Order of operations

```
1. Bing Webmaster Tools        ← 10 min, highest leverage for AI visibility
2. Google Search Console       ← unlocks the keyword map and Merchant verification
3. IndexNow key + redeploy
4. GA4 Measurement ID          ← see GA4_MEASUREMENT_PLAN.md
5. Check Shopify's Merchant sync status, THEN Merchant Center
6. Pinterest
```

**Before any of it: the Vercel trial.** Every step here assumes the site is up.
