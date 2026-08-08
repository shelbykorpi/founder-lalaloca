/**
 * Event tracking.
 *
 * Events go three places at once: `window.dataLayer` (the convention GTM and
 * Segment read), a `founder:track` DOM event, and — when a measurement ID is
 * configured — GA4 via gtag.
 *
 * WHY THE EVENT NAMES GET TRANSLATED. GA4's ecommerce reports only populate
 * for its own reserved event names, and only when the payload carries an
 * `items` array. Our internal names read better in this codebase, so they are
 * mapped on the way out rather than renamed everywhere: product_view becomes
 * view_item, product_select becomes select_item. Send GA4 "product_view" and
 * the event still lands, but the funnel, the revenue report and the product
 * performance table all stay empty.
 *
 * WHAT THIS CANNOT SEE. Checkout happens on Shopify, so `purchase` never fires
 * from this site — it can't. Revenue only appears in GA4 if the same
 * measurement ID is also installed inside Shopify. Until then, treat
 * begin_checkout as the last measurable step in the funnel.
 *
 * THE FUNNEL THIS PRODUCES, in GA4's own vocabulary, so the standard ecommerce
 * reports populate without any custom exploration being built first:
 *
 *   view_item_list  →  /shop, the three doors rendered
 *   select_item     →  a door opened
 *   view_item       →  a product page
 *   add_to_cart     →  added, single or trio
 *   view_cart       →  bag drawer opened
 *   remove_from_cart→  removed from the bag
 *   begin_checkout  →  handed off to Shopify   ← last step this site can see
 *   purchase        →  fires only from inside Shopify, with the same GA4 ID
 *
 * `search` and `sign_up` are also reserved names and are mapped below; a search
 * event under any other name will not populate the site-search report.
 */

export type TrackEvent =
  | "product_view"
  | "product_list_view"
  | "product_select"
  | "add_to_cart"
  | "remove_from_cart"
  | "cart_view"
  | "begin_checkout"
  | "purchase"
  | "site_search"
  | "quiz_complete"
  | "email_signup"
  | "found_her_article_view"
  | "story_submission"
  | "web_vitals";

/** GA4 reserved names. Anything unmapped passes through as a custom event. */
const GA4_NAME: Partial<Record<TrackEvent, string>> = {
  product_view: "view_item",
  product_list_view: "view_item_list",
  product_select: "select_item",
  cart_view: "view_cart",
  site_search: "search",
  email_signup: "sign_up",
};

/** One line item, in the shape GA4's ecommerce reports require. */
export type TrackItem = {
  item_id: string;
  item_name: string;
  price?: number;
  item_category?: string;
  item_brand?: string;
  item_list_id?: string;
  item_list_name?: string;
  index?: number;
  quantity?: number;
};

/* The index signature has to admit TrackItem[] directly — intersecting a
   Record with an `items` field leaves the two rules in conflict. */
type Payload = { [key: string]: string | number | boolean | undefined | TrackItem[] };

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Build one GA4 line item from a product-shaped object.
 *
 * Exists because the single most common way to get an empty ecommerce report
 * is a call site that sends `{ product: "thirst-trap" }` — a perfectly readable
 * payload that GA4 discards silently. Routing every call site through this
 * makes the required shape the path of least resistance.
 */
export function toTrackItem(
  product: { slug: string; name: string; category: string; price: number },
  extra: Partial<TrackItem> = {},
): TrackItem {
  return {
    item_id: product.slug,
    item_name: product.name,
    item_category: product.category,
    item_brand: "LALALOCA",
    price: product.price,
    quantity: 1,
    ...extra,
  };
}

export function track(event: TrackEvent, payload: Payload = {}) {
  if (typeof window === "undefined") return;

  const detail = { event, ...payload };
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(detail);
  window.dispatchEvent(new CustomEvent("founder:track", { detail }));

  if (typeof window.gtag !== "function") return;

  const { items, ...rest } = payload;
  const lineItems = Array.isArray(items) ? items : undefined;
  const ga4: Record<string, unknown> = { ...rest };

  /* Every monetary event needs a currency beside its value, or GA4 records
     the number and discards it as unattributable revenue. */
  if (lineItems?.length || typeof rest.value === "number") {
    ga4.currency = typeof rest.currency === "string" ? rest.currency : "USD";
  }
  if (lineItems?.length) ga4.items = lineItems;

  window.gtag("event", GA4_NAME[event] ?? event, ga4);
}
