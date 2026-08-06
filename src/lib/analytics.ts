/**
 * Provider-agnostic event tracking.
 *
 * No analytics vendor is installed on this site yet. Rather than invent one,
 * events are pushed to `window.dataLayer` (the convention GA4, GTM, Segment and
 * most tag managers already read) and mirrored as a DOM event. Connecting a
 * provider later is a script tag, not a refactor.
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

type Payload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Payload[];
  }
}

export function track(event: TrackEvent, payload: Payload = {}) {
  if (typeof window === "undefined") return;
  const detail = { event, ...payload };
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(detail);
  window.dispatchEvent(new CustomEvent("founder:track", { detail }));
}
