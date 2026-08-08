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
 * Deliberately empty. Do not add entries here by hand — a review written by
 * anyone other than a customer is exactly the thing this file exists to
 * prevent. Connect a platform instead.
 */
const REVIEWS: Partial<Record<string, Review[]>> = {};

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
