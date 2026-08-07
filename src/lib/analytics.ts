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
 */

export type TrackEvent =
  | "product_view"
  | "product_select"
  | "add_to_cart"
  | "begin_checkout"
  | "purchase"
  | "email_signup"
  | "found_her_article_view"
  | "story_submission";

/** GA4 reserved names. Anything unmapped passes through as a custom event. */
const GA4_NAME: Partial<Record<TrackEvent, string>> = {
  product_view: "view_item",
  product_select: "select_item",
  email_signup: "sign_up",
};

/** One line item, in the shape GA4's ecommerce reports require. */
export type TrackItem = {
  item_id: string;
  item_name: string;
  price?: number;
  item_category?: string;
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
