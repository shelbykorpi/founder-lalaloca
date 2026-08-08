# Etsy → FOUNDER unification

**No changes were made to the Etsy shop.** That needs your authorisation and your account, and I have not seen the live listings. What follows is the plan and the reasoning; the parts that need real listing data are marked.

---

## The strategic call: keep the Etsy shop, and keep it named LALALOCA

The instinct when consolidating a brand is to rename everything to match. Here that would be a mistake, and it's worth being precise about why.

The Etsy shop holds three things founderbeauty.co does not have and cannot manufacture:

1. **Reviews.** Real ones, from real buyers. The website has none and will not have any for months. This is also the single biggest gap in the site's structured data — the one field a competitor has and FOUNDER honestly cannot claim.
2. **Sales history.** Etsy's own ranking algorithm weights it heavily.
3. **Marketplace search recognition.** Buyers who search "LALALOCA" on Etsy find it. Renaming the shop breaks that overnight and Etsy's internal search has no redirect mechanism.

Renaming discards all three for a cosmetic consistency nobody outside the company will notice. **Keep the shop name. Make the FOUNDER relationship explicit in the copy instead.**

This is exactly what the brand architecture already says: FOUNDER presents the LALALOCA Collection. An Etsy shop called LALALOCA selling the LALALOCA Collection is *correct*, not inconsistent.

---

## What to change, in priority order

### 1. Connect the two entities formally — do this first, it takes five minutes

Two halves, and both are needed:

**On the site:** set `NEXT_PUBLIC_SAME_AS` in Vercel to include the Etsy shop URL, then redeploy. This adds the Etsy shop to the Organization's `sameAs` — a formal declaration that they are one entity.

**On Etsy:** put the founderbeauty.co URL in the shop's About section and announcement.

Until both exist, Google has no reason to connect LALALOCA-on-Etsy to FOUNDER-on-founderbeauty.co. That connection is the mechanism by which the Etsy shop's accumulated trust reaches the new domain. It is the highest-value item in this document and the cheapest.

### 2. Shop announcement

The positioning line, which follows the brand rules:

> LALALOCA is the original skincare collection from FOUNDER — three serums for what you're building.

Then the site link. Keep it to two sentences; Etsy truncates.

### 3. About section

Should say, in this order: FOUNDER is the company, LALALOCA is the collection, the three serums are these, the full range and the stories live at founderbeauty.co. This is the same hierarchy statement as `llms.txt` and the Brand schema — **say it identically everywhere.** Consistency across channels is what turns three statements into one fact.

### 4. Listing titles

Etsy search behaves differently from Google: the first ~40 characters carry most of the weight, and Etsy penalises keyword stuffing less than Google but shoppers penalise it more.

Recommended shape, mirroring the Merchant Center feed so the two channels agree:

```
LALALOCA Thirst Trap — 8-Layer Hyaluronic Acid Serum, 50ml
LALALOCA C Me Glow — Vitamin C Brightening Serum, 50ml
LALALOCA Bounce Back — Collagen Firming Serum, 50ml
```

**Requires the current titles to compare against.** Send me a screenshot of the listings page and I'll do this properly rather than guessing at what's there.

### 5. Listing descriptions

First two lines are what shows before "read more" — they should carry the product's actual job, not brand poetry. The `what` and `need` fields in `products.ts` are already written for exactly this and are approved copy.

Add one line at the end of each: *"Part of the LALALOCA Collection from FOUNDER. Full range at founderbeauty.co."*

### 6. Prices must match. Non-negotiable.

$39.99 each, $98.99 for three, on both channels.

If they differ, the cheaper channel wins every comparison and the more expensive one looks like a markup — and worse, Merchant Center and Google Shopping can surface both, showing a customer two prices for the same bottle from the same brand. That reads as either a mistake or a trick.

**Needs checking against live Etsy prices.** Etsy's fee structure sometimes drives a different number, and if it does, that's a decision to make deliberately rather than discover.

---

## What NOT to do

| Don't | Why |
|---|---|
| Rename the Etsy shop to FOUNDER | Discards reviews, history and marketplace search recognition for no gain |
| Close the Etsy shop | It is the only channel with social proof. Closing it removes the brand's only third-party validation |
| Copy website copy verbatim into listings | Duplicate content across domains — one will be filtered, and it will not be the one with the reviews |
| Quote Etsy reviews on the website | Reviews belong to Etsy's platform and the schema policy is no invented ratings. **Linking** to the shop is fine and encouraged; republishing star ratings as `aggregateRating` is not |
| Run different promotions per channel | Confuses buyers who check both, which is most of them |

---

## What I need to finish this properly

| Input | Unblocks |
|---|---|
| Etsy shop URL | `sameAs` — the highest-value item above |
| Screenshot or export of current listings | Real title and description rewrites instead of templates |
| Current Etsy prices | Confirming parity, or flagging a real conflict |
| Etsy listing SKUs | The product-identity table, so one bottle is one record across all three channels |
| Whether Etsy Ads is running | Whether the channels are bidding against each other |

---

## Sequence

```
Week 1   sameAs + Etsy About link          ← both halves, five minutes, do it now
Week 1   Shop announcement
Week 2   Listing titles and descriptions   ← needs current listings
Week 2   Confirm price parity
Ongoing  Review the split monthly: Etsy revenue vs site revenue
```

**The long game:** Etsy is where the trust currently lives; founderbeauty.co is where the margin lives (no marketplace fee, no competitor listings on the same page, and the brand story attached to the sale). The plan is not to move off Etsy — it's to make sure a buyer who finds LALALOCA there understands FOUNDER exists, and a buyer who finds FOUNDER first has a reason to trust it.
