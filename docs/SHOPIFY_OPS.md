# Shopify — the hardening pass

Everything here is in your Shopify admin. None of it needs code. Ordered by what fails first and most expensively.

---

## 1. Stop the overselling before it starts

**The risk:** you sell the same physical bottles on Etsy and on founderbeauty.co. Unless the two share a stock count, you will sell the same unit twice — and it won't happen once, it'll happen every time you have a good day. The cost is a refund, an apology, and a negative review at a moment when you have no positive ones to absorb it.

**The fix:** Shopify becomes the master and Etsy reads from it. Never the reverse — Shopify is where the money, the customers and the fulfilment already live.

Two routes:

- **Shopify's Etsy sales channel app** — free, first-party, and enough for three SKUs. Start here.
- **A dedicated connector** (Trunk, QuickSync, Craftybase) if the first-party app can't handle a case you need. Roughly $15–40/month. Only if you hit a wall.

**Test it properly before you trust it.** Set one SKU to stock = 1 in Shopify, buy it on Etsy, and confirm Shopify drops to 0 within a few minutes. A sync you haven't watched work is a sync you're guessing about.

**And the thing to decide now, not later:** the trio is three bottles. If Shopify doesn't decrement all three components when a trio sells, your stock count is wrong from the first bundle order. Check this — it's the double-count that's already been flagged once.

---

## 2. Turn on tax liability insights — today, it's free

**Shopify admin → Settings → Taxes and duties → United States → Manage tax liability**

Economic nexus means that once you pass a threshold in a state — commonly $100,000 in sales or 200 transactions, varying by state — you're required to register and collect there. It accrues **silently**. No state writes to warn you, and back taxes plus penalties are frequently a personal liability, not just the company's.

Shopify monitors this and tells you when you're approaching a threshold. It costs nothing and it is the single highest-consequence checkbox in your admin.

It does **not** file for you. When it flags a state, that's a conversation with an accountant, not a setting.

---

## 3. Fix the business entity name

Settings → General → Business details. It still reads **`vercel-store-5078d3d6 - entity`**.

That name appears on tax documents and payout paperwork regardless of anything on the website. Change it to the registered legal entity — which may or may not be "FOUNDER" depending on how the business is actually incorporated. If those two differ, the registered name goes here and FOUNDER stays the trading name.

---

## 4. Make the shipping confirmation email carry its weight

Settings → Notifications → Shipping confirmation.

"Where is my order" is the majority of support volume for a brand like this, and it is almost entirely preventable. A shipping email with a working tracking link, sent the moment you fulfil, deflects more tickets than any help desk will ever handle.

While you're in there: the order confirmation is the first thing a new customer sees after paying. Check it looks like the brand and says FOUNDER, not a Shopify default.

---

## 5. Clean up the phantom data

Two known issues, both small now and both worse later:

- **Order #1001** appears to be a test order carrying revenue. Every report you ever run — this month, this year, year-over-year — is wrong by that amount until it's cancelled or refunded to zero. Fix it while you can still remember which one it is.
- **The trio inventory double-count**, per item 1.

Neither is urgent today. Both become archaeology in six months.

---

## 6. Staff access, before you need it

Settings → Users and permissions.

When someone starts helping — packing, answering email — they get a **staff account with limited permissions**, not your login. Fulfilment and order viewing, not payouts, not settings, not the API tokens.

Set this up before the day you need it, because the day you need it you'll be busy and you'll just share the password.

---

## 7. Low-stock alerts

Products → each variant → set a low-stock threshold, and enable the notification.

The number isn't arbitrary:

```
reorder point = manufacturer lead time (weeks) × current weekly sales × 1.5
```

The 1.5 is the margin for a good week arriving while you're waiting. Running out is the thing that most reliably stalls a growing product brand, and it always happens right after the marketing works.

---

## 8. The API credentials you now have

All of them live only in Vercel's encrypted environment store, marked Sensitive.

| Credential | Scopes | Used by |
|---|---|---|
| `SHOPIFY_CLIENT_ID` + `SHOPIFY_CLIENT_SECRET` | `write_customers`, `read_customers` | The Founding List signup and unsubscribe |
| Storefront | cart permalinks | Checkout handoff |

**Corrected 8 August 2026.** This section previously described a permanent
`shpat_…` Admin API token. Shopify has retired that flow. The app is now created
in the **Dev Dashboard** (`dev.shopify.com`) and the site exchanges the client id
and secret for a token that expires in 24 hours, refreshing it on demand. There
is no long-lived token anywhere — which means a credential caught in a log or a
screenshot is useless within a day.

**None of these can see an order or move money.** That's deliberate: a leaked
credential should be an annoyance, not an incident. If one is ever exposed,
dev.shopify.com → the app → **Client credentials → rotate**, then update Vercel
and redeploy.

Never paste any of them into a chat, a doc, or a support ticket.

---

## Do it in this order

```
Today       Tax liability insights (free, 2 min, highest consequence)
Today       Business entity name
This week   Etsy inventory sync + test it with a real purchase
This week   Shipping confirmation email
This week   Cancel or zero out Order #1001
Before help Staff accounts
Before reorder  Low-stock thresholds
```
