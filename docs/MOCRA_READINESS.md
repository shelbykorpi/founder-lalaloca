# Cosmetics regulation — a readiness briefing

**I am not a lawyer or a regulatory consultant, and this is not legal advice.** It's a briefing written so that your conversation with a specialist takes one hour instead of five — you'll arrive knowing what to ask and what you already have.

Everything below is sourced. Where I couldn't verify something, I say so rather than guessing.

---

## Why this is on the list at all

You sell cosmetics in the United States. Since the Modernization of Cosmetics Regulation Act of 2022 (MoCRA), that carries federal obligations it didn't previously. Some depend on your size — and **the size threshold is one you are actively trying to cross.**

The expensive version of this is discovering it in the quarter you pass $1M. The cheap version is building the file now, while there are three products and one of you.

---

## Where you almost certainly stand today

**Likely exempt from the biggest requirements.** MoCRA's small-business exemption applies to businesses whose average gross annual cosmetic sales over the previous three years are **under $1 million**. That exemption covers:

- Facility registration with FDA
- Cosmetic product listing
- Good Manufacturing Practice requirements
- Keeping adverse-event records for six years

**Two caveats worth checking with a specialist:**

1. **The exemption excludes certain product categories** regardless of size — products that contact the mucous membrane of the eye under customary use, injected products, products for internal use, and products that alter appearance for more than 24 hours. Face serums normally fall outside all four, but "normally" is doing work in that sentence and it's a five-minute question for someone qualified.

2. **The threshold is measured on a three-year average.** It won't announce itself.

---

## What applies regardless of size

This is the part most small brands miss, because the headline is always the exemption.

### Safety substantiation
You must **maintain records supporting adequate safety substantiation** of each product. This is not a filing — it's a file you keep and could produce.

For a brand that doesn't formulate in-house, this usually means getting it from your manufacturer:

- Full formulation / INCI breakdown
- Safety assessment or CPSR
- Stability and challenge (preservative efficacy) testing
- Any patch or irritation testing performed
- Certificates of analysis per batch

**You do not currently have these on the site — `products.ts` records ingredients as `null`.** That's been treated as an SEO gap all along. It's also this. Request the full pack from your supplier; you're entitled to it, and it unlocks the ingredient pages at the same time.

### Serious adverse event reporting
Serious adverse events must be reported to FDA **within 15 business days**. "Serious" has a specific regulatory meaning — hospitalisation, disfigurement, and similar — not "a customer said it stung."

Practically: you need a way for a report to reach you and a record when one does. SOP 2 in `OPERATIONS.md` covers the recording half.

### The label contact
MoCRA requires the label to carry **a domestic address, domestic phone number, or electronic contact information** through which you can receive adverse event reports.

**Go and look at a carton.** This is the most concrete, most checkable item on this page, and if it's missing it's a packaging change with a lead time — which is exactly the kind of thing you want to discover now rather than mid-reorder.

I could not confirm the exact effective date in the sources I could reach; it's commonly cited as two years after enactment. Confirm it, but don't wait on the answer to check the carton.

---

## What to build now, while it's cheap

A single folder. Call it *Product compliance*, keep it wherever you'll find it, one subfolder per product:

```
Thirst Trap/
  Full formulation + INCI
  Safety assessment from the manufacturer
  Stability + preservative efficacy testing
  Certificates of analysis, by batch
  Approved label artwork (current version, dated)
  Batch log: batch number → production date → quantity → orders it went to
```

That last line is the one people skip and the one that matters most. **If a batch ever has a problem, "which customers received it" is either a five-minute query or an impossible question.** SOP 1 in `OPERATIONS.md` puts the batch number on every order for exactly this reason. It costs ten seconds per order now and it is the difference between a contained recall and an unbounded one.

---

## The five questions for a specialist

Take these to a cosmetics regulatory consultant. Budget an hour.

1. Given three leave-on facial serums and current revenue, do we qualify for the small-business exemption — and do any of our products fall into the excluded categories?
2. What exactly must our label carry today, and does our current artwork carry it?
3. What does adequate safety substantiation look like for products we don't formulate ourselves, and does the pack our manufacturer provides meet it?
4. What's our process for a serious adverse event, and who is the responsible person of record?
5. What changes on the day we cross $1M, and how far ahead do we need to start?

---

## Adjacent things a specialist will likely raise

Not MoCRA, but same conversation:

- **California Prop 65** if you ship there, which you do
- **FTC endorsement rules** — relevant the moment you have reviews, gifting, or influencers. Incentivised reviews must be disclosed, which is one of several reasons `REVIEWS_AND_POST_PURCHASE.md` says to offer nothing for a review
- **Claims substantiation** — "firming", "brightening" and similar are cosmetic claims and need support. Your copy is already careful here; that discipline is worth keeping as marketing pressure grows
- **Selling outside the US** — the EU and UK have separate regimes with a responsible person requirement. Don't start shipping there casually

---

## The honest summary

You are probably fine today and probably exempt from the heaviest requirements. The two things that are true regardless of that are: **the label needs a contact route for adverse event reports**, and **you should be holding a safety file you don't currently have.**

Neither is expensive right now. Both get expensive later — one is a packaging run, the other is a conversation with a supplier you'll have less leverage over as you grow.

---

**Sources:**

- [FDA — Modernization of Cosmetics Regulation Act of 2022 (MoCRA)](https://www.fda.gov/cosmetics/cosmetics-laws-regulations/modernization-cosmetics-regulation-act-2022-mocra)
- [FDA — Registration and listing deadline: what does the deadline mean](https://www.fda.gov/cosmetics/cosmetics-news-events/deadline-registration-and-listing-cosmetic-product-facilities-and-products-what-does-deadline-mean)
- [Handcrafted Soap & Cosmetic Guild — MoCRA small business exemption](https://www.soapguild.org/tools-and-resources/resource-center/291/mocra-small-business-exemption/)
- [Axentra Compliance — MoCRA cosmetic labeling requirements](https://www.axentracompliance.com/post/mocra-cosmetic-labeling-requirements)
