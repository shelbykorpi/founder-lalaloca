# Owner-only actions — things I can't do without your accounts

Ordered by value. Detail for each lives in the linked document; this is the checklist.

---

## 0. The deadline that outranks everything

**The Vercel trial expires in 3 days.** Every item below assumes the site is up.

---

## 1. Deploy, then set six environment variables

The SEO backend is built and dormant. It switches on with configuration, not code.

**Every `NEXT_PUBLIC_*` variable is baked into the JavaScript at build time. Saving one in Vercel does nothing until you redeploy.** Set them all, then redeploy once.

| Variable | Unlocks | Where the value comes from |
|---|---|---|
| `NEXT_PUBLIC_GA_ID` | GA4 + Web Vitals | GA4 property → `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_SAME_AS` | Ties Etsy + social to this site as one entity | Your profile URLs, comma-separated |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console (fallback to DNS) | Search Console |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Bing Webmaster Tools | Bing |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `ContactPoint` on the Organization | Your support address |
| `INDEXNOW_KEY` | `/indexnow-key.txt` + the ping script | `node -e "console.log(crypto.randomUUID().replace(/-/g,''))"` |

**`NEXT_PUBLIC_SAME_AS` is the highest-value one and it is empty.** It is how a search engine confirms the Etsy shop and this website are one entity — which is the mechanism by which LALALOCA's real reviews and sales history reach the new domain. I did not guess at any URL.

→ Full reference: `SEO_BACKEND.md`

---

## 2. lalaloca.com → founderbeauty.co · done, one line left to confirm

Moved off GoDaddy forwarding onto a Vercel redirect domain set to **308 Permanent**. Paths preserved, `www` now resolves (it was NXDOMAIN), all four Google Workspace MX records untouched.

**A correction I owe you:** I earlier stated as fact — and committed to a document — that the domain served a `302` despite GoDaddy showing "Permanent (301)". **Withdrawn.** The tool I measured with reports the literal string "Status: 302 Found" for *every* redirect it follows; it said the same about the new Vercel redirect, which is configured 308. That's the tool talking, not the server.

Confirm it yourself:

```
curl -sI https://lalaloca.com | head -3
```

You want `308` or `301`. If it really says `302`, tell me and I'll dig in properly.

---

## 3. Bing Webmaster Tools · best return per minute on this list

Ten minutes, and almost nobody does it. **ChatGPT's web search leans on Bing's index** — for the AI-visibility goal, Bing matters more than Google.

Add the site → verify → submit `sitemap.xml` → enable IndexNow.

→ `SEARCH_CONSOLE_AND_MERCHANT_CENTER_SETUP.md`

---

## 4. Google Search Console — both domains

Domain property for `founderbeauty.co`, verified by DNS TXT. **And a second property for `lalaloca.com`** — it's the only way to see whether the old domain's traffic is transferring.

Then request indexing for `/`, `/shop`, the three product pages, `/our-story`, `/found-her`.

→ `SEARCH_CONSOLE_AND_MERCHANT_CENTER_SETUP.md`

---

## 5. GA4 — and the half everyone forgets

Create the property, send me the Measurement ID, set the env var, redeploy.

**Then install the same measurement ID inside Shopify.** Purchases happen there, not here — this site literally cannot see a sale. Without it you get traffic with no revenue attached, and every channel looks equally worthless.

Also: GA4 → Admin → Data Settings → Data Retention → **14 months**. The default is 2 and it silently discards your first year.

→ `GA4_MEASUREMENT_PLAN.md`

---

## 6. Merchant Center — but check one thing first

**Is Shopify already syncing via the Google & YouTube channel app?** If yes, do not add the feed — two sources create duplicate records. If no, point a scheduled fetch at `https://www.founderbeauty.co/feed/products.xml` (built, four items including the trio).

→ `SEARCH_CONSOLE_AND_MERCHANT_CENTER_SETUP.md`

---

## 7. Etsy — nothing touched, by design

Keep the shop name LALALOCA. It holds the only reviews, sales history and marketplace recognition the brand has; renaming discards all three for a consistency nobody outside the company will notice.

Five-minute version: add the Etsy URL to `NEXT_PUBLIC_SAME_AS`, and add founderbeauty.co to the Etsy About section. Both halves.

→ `ETSY_FOUNDER_UNIFICATION_PLAN.md`

---

## 8. Facts to send me — each unblocks specific work

| Fact | Unblocks |
|---|---|
| **Old lalaloca.com URL list** (Search Console export or old sitemap) | Exact path-level redirects instead of section-level patterns |
| **Etsy shop URL + social URLs** | `sameAs` — item 1 |
| **Return window + condition requirements** | `hasMerchantReturnPolicy`, removes the Product rich-result warning |
| Screenshot of current Etsy listings | Real title/description rewrites instead of templates |
| Full INCI ingredient lists | Ingredient pages, honest ingredient-level queries |
| GTINs / barcodes | Removes the Merchant Center identifier warning |
| Whether Shopify already feeds Merchant Center | Item 6 |
| Larger bottle renders | LCP — currently ~350px upscaled ~3× |

---

## The order I'd do it in

```
Today       Renew Vercel · deploy · set the env vars · redeploy
This week   Bing (10 min) → Search Console (20 min) → GA4 + Shopify (30 min)
This week   sameAs + Etsy About link — five minutes, highest leverage per minute
Next week   Merchant Center (after checking the Shopify sync)
Then        Wait 28 days for real data before writing anything new
```

→ `CONTENT_ROADMAP_30_90_180.md` for what happens after the waiting.
