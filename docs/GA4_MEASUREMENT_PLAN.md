# GA4 measurement plan

The code is written and dormant. It switches on with one environment variable.

---

## Part 1 — turn it on (10 minutes, yours)

1. **Create the GA4 property.** analytics.google.com → Admin → Create property. Time zone and currency: **US, USD** — these cannot be changed later without starting over.
2. **Create a Web data stream** for `https://www.founderbeauty.co`. Copy the Measurement ID (`G-XXXXXXXXXX`).
3. **Set it in Vercel:** Settings → Environment Variables → `NEXT_PUBLIC_GA_ID` = `G-XXXXXXXXXX`, all environments.
4. **Redeploy.** This step is not optional and is the one people skip. `NEXT_PUBLIC_*` variables are baked into the JavaScript at build time — saving the variable changes nothing until a new build runs.
5. **Verify:** load the site, open GA4 → Reports → Realtime. You should see yourself. If not, check the page source for `googletagmanager.com/gtag/js`.

---

## Part 2 — the half that everyone forgets

**Checkout happens on Shopify. This site cannot see a purchase, ever.** Not a limitation of the code — the customer is on a different domain by then.

Without the steps below you get a property full of traffic and no revenue, and every report that matters — conversion rate, revenue by source, return on ad spend — reads zero forever.

1. **Install the same Measurement ID inside Shopify.** Shopify admin → Online Store → Preferences → Google Analytics, or via the Google & YouTube channel app. The *same* `G-` ID, not a new property.
2. **Configure cross-domain measurement.** GA4 → Admin → Data Streams → your stream → Configure tag settings → Configure your domains. Add both:
   - `founderbeauty.co`
   - `founderbeauty.myshopify.com`

   The site-side half is already done — `Analytics.tsx` passes `linker: { domains: [...], accept_incoming: true }`. This is the GA4-side half, and both are required.

**What goes wrong without it:** GA4 treats the Shopify checkout as a brand-new session arriving from a referral. The sale detaches from the search, the campaign or the story that earned it. You see traffic here and revenue over there with no thread between them, and every channel looks equally worthless.

3. **Exclude the Shopify domain as a referral source** — same settings panel, "List unwanted referrals". Otherwise a chunk of your own revenue is attributed to `founderbeauty.myshopify.com` as if it were an external site sending you customers.

---

## Part 3 — the events, as implemented

Internal names are translated to GA4's reserved names on the way out. This matters more than it sounds: GA4's ecommerce reports only populate for its own reserved names, **and only when the payload carries an `items` array**. Send `product_view` and the event lands but the funnel, the revenue report and the product-performance table all stay empty.

| Step | Internal name | GA4 name | Fires when | `items[]` |
|---|---|---|---|---|
| 1 | `product_list_view` | `view_item_list` | `/shop` renders | yes |
| 2 | `product_select` | `select_item` | a door is opened | yes |
| 3 | `product_view` | `view_item` | product page loads | yes |
| 4 | `add_to_cart` | `add_to_cart` | added, single or trio | yes |
| 5 | `cart_view` | `view_cart` | bag drawer opens | yes |
| 6 | `remove_from_cart` | `remove_from_cart` | line removed | yes |
| 7 | `begin_checkout` | `begin_checkout` | handoff to Shopify | yes |
| 8 | `purchase` | `purchase` | **inside Shopify only** | — |
| — | `site_search` | `search` | site search, 700ms debounce | no |
| — | `email_signup` | `sign_up` | | no |
| — | `story_submission` | `story_submission` | custom — Found Her submission | no |
| — | `found_her_article_view` | `found_her_article_view` | custom | no |
| — | `web_vitals` | `web_vitals` | LCP, INP, CLS, FCP, TTFB | no |

Every monetary event carries `currency: "USD"` alongside its value. Without the currency, GA4 records the number and then discards it as unattributable revenue.

---

## Part 4 — configure after data starts flowing

### Mark key events
Admin → Events → toggle "Mark as key event":

- `purchase` — the only one that matters commercially
- `sign_up`
- `story_submission`

**Do not** mark page views or `view_item`. A key event is meant to be scarce; marking everything a conversion means the conversion rate becomes a number with no meaning.

### Register custom dimensions
Admin → Custom definitions → Create custom dimension. Event-scoped, one per parameter. Until you do this, the parameter is collected but **cannot be used in any report** — it exists in the data and is invisible in the UI, which is a genuinely maddening way to lose a month.

| Parameter | Dimension name | Why |
|---|---|---|
| `search_term` | Site search term | Real customer language. Free keyword research |
| `metric_name` | Web Vital | Lets you break vitals down by page and device |
| `metric_rating` | Vital rating | good / needs-improvement / poor |
| `item_list_name` | Product list | Which listing drove the click |

### Reading Web Vitals

CLS is sent multiplied by 1000. GA4 stores event parameters as integers, so a raw CLS of `0.0374` would be recorded as `0` for every visitor. **Divide by 1000 when reading.** LCP, INP, FCP and TTFB are in milliseconds, unmodified.

Thresholds Google uses for "good": LCP ≤ 2500ms, INP ≤ 200ms, CLS ≤ 0.1.

### Link the other properties
- Admin → Product Links → **Search Console** (needs the property to exist first)
- Admin → Product Links → **Google Ads**, if you ever run any

### Data retention
Admin → Data Settings → Data Retention → **14 months**. The default is 2 months, and it silently discards your first year of history. Change this on day one; it is not retroactive.

---

## Part 5 — how to know it's actually working

Two weeks after switching on, these should all be true. If any is false, something in Part 2 didn't take.

| Check | Where |
|---|---|
| `purchase` events appearing | Reports → Monetisation → Ecommerce purchases |
| Revenue attributed to sources other than "(direct)" | Reports → Acquisition → Traffic acquisition |
| A funnel with no zeroes between `view_item_list` and `begin_checkout` | Explore → Funnel exploration |
| Product names in the item report, not "(not set)" | Reports → Monetisation → Ecommerce purchases → Item name |
| Site-search terms accumulating | Explore, using the custom dimension |

**"(not set)" in the item report means the `items[]` array isn't reaching GA4** — that is the failure this whole design exists to prevent, so if you see it, say so.
