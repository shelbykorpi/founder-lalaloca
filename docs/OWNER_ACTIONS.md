# Owner-only actions — things I can't do without your accounts

Ordered by value. Each has exact steps.

---

## 1. Fix the lalaloca.com 302 · highest value on this list

**The problem:** `lalaloca.com` returns a `302` (temporary) to founderbeauty.co, even though GoDaddy's panel displays it as "Permanent (301)". Verified twice on the wire. Because the UI already claims 301, **editing that setting will not fix it** — it's GoDaddy's forwarding edge.

Consequence: Google keeps lalaloca.com in its index and withholds the accumulated link equity and branded-search recognition from FOUNDER. For a brand migration this is the whole ballgame.

**The fix — move the redirect from GoDaddy to Vercel.** This gives a true 308 permanent, preserves paths, and issues real auto-renewing SSL.

1. Vercel → `founder-lalaloca` → Settings → Domains → **Add Existing**
2. Enter `lalaloca.com`. Leave "Redirect apex to www" **unchecked**.
3. Choose **Redirect to Another Domain** → destination `www.founderbeauty.co` → type **308 Permanent**
4. Repeat for `www.lalaloca.com` (see item 2 — it needs DNS first)
5. Vercel shows the DNS records it wants. In GoDaddy → lalaloca.com → DNS:
   - **First delete the existing Forwarding rule** under DNS → Forwarding, or it will keep overriding the A record and re-locking it (this is exactly what happened on founderbeauty.co)
   - Set the A record for `@` to the IP Vercel specifies
6. Wait for Vercel to show "Valid Configuration", then re-test:
   `curl -sI https://lalaloca.com | head -2` — you want **`308`**, not `302`

I can drive all of this in your browser if you'd like — say the word.

---

## 2. `www.lalaloca.com` has no DNS record at all

Not misrouted — **unresolvable**. Anyone who typed or bookmarked the www form gets a dead page, and any old backlink pointing at www is a hard 404 for both users and crawlers.

Add a CNAME for `www` pointing at the Vercel target from step 1 above. Do this in the same sitting.

---

## 3. Bing Webmaster Tools · best return per minute spent

The brief's central goal is AI discovery. **ChatGPT's web search leans substantially on Bing's index** — so for ChatGPT visibility specifically, Bing matters more than Google, and almost nobody sets it up.

1. bing.com/webmasters → add `https://www.founderbeauty.co`
2. Verify (it can import your Google Search Console setup once that exists, which is faster)
3. Submit `https://www.founderbeauty.co/sitemap.xml`
4. Turn on **IndexNow** — Bing pings its index the moment a URL changes rather than waiting for a crawl

---

## 4. Google Search Console

1. Add a **Domain property** for `founderbeauty.co` (covers every subdomain and protocol — better than a URL-prefix property)
2. Verify via DNS TXT record at GoDaddy
3. Submit `https://www.founderbeauty.co/sitemap.xml`
4. URL-inspect and request indexing for: `/`, `/shop`, the three product pages, `/our-story`, `/found-her`
5. **Also add a property for `lalaloca.com`** — don't skip this. It's how you'll see whether the old domain's traffic is transferring, and it preserves historical data for comparison.
6. Link Search Console to GA4 (GA4 → Admin → Product Links → Search Console)

**On Change of Address:** only usable once lalaloca.com serves true 301/308s. Do step 1 first. Also note it's designed for whole-site moves — if lalaloca.com never had a full site (just a forward), it may not apply. Check what's actually indexed under `site:lalaloca.com` before deciding.

---

## 5. GA4 property → send me the Measurement ID

I can't create accounts. Once you have the `G-XXXXXXXXXX`:

1. Send it to me — I add `NEXT_PUBLIC_GA_ID` in Vercel and measurement goes live. The code is already written and dormant.
2. **Then the half everyone forgets:** install the *same* measurement ID inside Shopify. Purchases happen there, not here. Without it you get traffic with no revenue attached.
3. In GA4 → Admin → Data Streams → Configure tag settings → **Configure your domains**, list both `founderbeauty.co` and `founderbeauty.myshopify.com`. The site-side linker is already configured; this is the GA4-side half.
4. Mark as key events: `purchase`, `sign_up`, story submission. Not page views.

---

## 6. Etsy — no changes made, by design

I did not touch the Etsy shop; that needs your authorization and account access. Recommended positioning when you do:

> "LALALOCA is the original skincare collection from FOUNDER — three serums for what you're building."

Keep the LALALOCA shop name. It holds real reviews, sales history and marketplace search recognition — renaming it discards all three. Make the FOUNDER relationship clear in the shop announcement and About section instead.

A full plan needs an audit of your current listings, which I'd rather do from the real data than guess at.

---

## 7. Facts to send me — each unblocks specific work

| Fact | Unblocks |
|---|---|
| Old lalaloca.com URL list (Search Console export or old sitemap) | Path-level redirect map |
| Return window + condition requirements | `hasMerchantReturnPolicy` schema, Product rich results |
| Full INCI ingredient lists | Honest ingredient-level search terms |
| GTINs / barcodes | Merchant Center and AI shopping feeds |
| Etsy listing URLs, SKUs, per-channel prices | Product-identity table |
| Whether Shopify already feeds Merchant Center | Prevents duplicate product records |
| Social profile URLs | `sameAs` on the Organization entity |

---

## 8. The deadline that outranks everything

**The Vercel trial expires in 3 days.** Every item above assumes the site is up.
