/**
 * Customer reviews.
 *
 * THERE ARE NONE YET, AND THAT IS THE POINT OF THIS FILE. Reviews are the
 * largest remaining gap in the brand's credibility — every competitor has
 * `aggregateRating` on their product pages and FOUNDER honestly cannot. The
 * temptation, when the gap is that visible, is to soften it: seed a few, mark
 * up a rating "provisionally", let the schema say 4.8 because it probably will
 * be. That is fraud, it draws a manual penalty, and it would undo the one
 * position this brand actually has.
 *
 * So the rule is made STRUCTURAL rather than left to discipline: the schema and
 * the on-page section are both derived from this source, and this source is
 * empty. Nothing downstream can display a rating that does not exist here,
 * because there is nowhere for a fake one to come from.
 *
 * ── CONNECTING A REVIEW PLATFORM ────────────────────────────────────────────
 *
 * When reviews start arriving (see REVIEWS_AND_POST_PURCHASE.md — Judge.me's
 * free tier is the recommendation), replace the body of `getReviews` with a
 * fetch against that platform's API. Everything else on the site — the product
 * page section, the aggregateRating in the schema — starts working the moment
 * this function returns real data, and keeps working if it ever returns null.
 *
 * ONE TRAP TO AVOID WHEN YOU DO. Review apps installed on Shopify inject their
 * own `aggregateRating` markup into the *Shopify* storefront. Customers do not
 * see that storefront — they see founderbeauty.co, which is this codebase. So
 * the reviews have to be fetched here and marked up here. If you ever expose
 * the Shopify product pages publicly as well, make sure only one of the two is
 * emitting rating markup for the same product, or Google sees two different
 * ratings for one item and trusts neither.
 */

export type Review = {
  /** Stable id from the review platform, used as a React key. */
  id: string;
  /** 1–5. Never rounded or adjusted on the way in. */
  rating: number;
  /** First name and initial is the convention; never a full name without consent. */
  author: string;
  body: string;
  /** ISO date. Required for `Review` schema to be eligible. */
  published: string;
  /** True only where the platform can confirm a matching order. */
  verified: boolean;
  /** Where it was left. Only "site" reviews may go into schema markup: Google's
      review-snippet rules forbid marking up ratings collected on another site,
      so Etsy reviews are shown on the page and never emitted as structured data. */
  source: "site" | "etsy";
  /** What she bought, as it is named on this site, e.g. "Thirst Trap". */
  item: string;
};

export type ProductReviews = {
  count: number;
  /** The real mean, to one decimal. Not rounded up. */
  average: number;
  items: Review[];
};

/**
 * Reviews per product slug.
 *
 * Do not add entries here by hand unless they are a real customer's review,
 * copied word for word from where she left it, with its source. A review
 * written by anyone other than a customer is exactly the thing this file exists
 * to prevent. For new reviews, connect a platform instead.
 *
 * ── THE ETSY REVIEWS (added 2 Oct 2026, at Shelby's request) ────────────────
 *
 * LALALOCA sold on Etsy before this site. The serums sold there four times:
 * one was Shelby's own test order, one buyer left no review, and one customer
 * bought twice and reviewed both times. These two are therefore EVERY serum
 * review the shop ever received, not a selection. Transcribed verbatim from
 * Etsy Shop Manager → Orders (orders 3927946648 and 4002158875), stars and
 * dates as shown. Author is her public Etsy display name.
 *
 * The shop's overall 4.9★ from 5,722 reviews is NOT used anywhere: almost all
 * of it is the V3RY face-mask business the shop sold before it was renamed.
 * Attaching that number to serums would be misleading.
 *
 * Review one was on an order placed with a public end-of-year sale code (50%
 * off, open to every shopper); review two was a full-price repeat order. No
 * incentive was offered for either review.
 */
const REVIEWS: Partial<Record<string, Review[]>> = {
  "thirst-trap": [
    {
      id: "etsy-3927946648",
      rating: 5,
      author: "Elli",
      body: "I have a very unusual type of skin, that is a combination of dry and oily. I have tried moisturizer after moisturizer, and had various side effects with virtually no benefits from all of them. After using this product, my skin is smooth, shiny, less puffy, and visibly tighter. I have never seen anything like it. Planning on ordering the trio set when I finish this.",
      published: "2026-01-23",
      verified: true,
      source: "etsy",
      item: "Thirst Trap",
    },
  ],
  "all-three": [
    {
      id: "etsy-4002158875",
      rating: 5,
      author: "Elli",
      body: "Finally, a facial product that works magic and doesn't have any adverse effects. I am in love with this set! Fantastic product!",
      published: "2026-03-28",
      verified: true,
      source: "etsy",
      item: "The House Trio",
    },
  ],
};

/** Every review a serum page should show: its own, then the Trio's (which contains it). */
export function reviewsForSerumPage(slug: string): Review[] {
  const own = REVIEWS[slug] ?? [];
  const trio = slug === "all-three" ? [] : (REVIEWS["all-three"] ?? []);
  return [...own, ...trio];
}

/** Every serum review, oldest first: what the /shop page shows. */
export function allSerumReviews(): Review[] {
  return Object.values(REVIEWS)
    .flat()
    .filter((r): r is Review => !!r)
    .sort((a, b) => a.published.localeCompare(b.published));
}

/** Only reviews collected on this site may be marked up (see `source`). */
export function getSchemaReviews(slug: string): ProductReviews | null {
  const items = (REVIEWS[slug] ?? []).filter((r) => r.source === "site");
  if (items.length === 0) return null;
  const total = items.reduce((sum, review) => sum + review.rating, 0);
  return { count: items.length, average: Math.round((total / items.length) * 10) / 10, items };
}

export function getReviews(slug: string): ProductReviews | null {
  const items = REVIEWS[slug];
  if (!items || items.length === 0) return null;

  const total = items.reduce((sum, review) => sum + review.rating, 0);
  return {
    count: items.length,
    /* One decimal, honestly rounded. A 4.44 average displays as 4.4. */
    average: Math.round((total / items.length) * 10) / 10,
    items,
  };
}
