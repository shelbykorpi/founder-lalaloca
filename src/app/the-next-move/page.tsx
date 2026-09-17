import { permanentRedirect } from "next/navigation";

/**
 * /the-next-move was the August presale campaign page for Clean Break,
 * Smooth Talker and Double Take — reservations, no prices, the 24 Aug pack
 * scenes. By 4 Sept every one of those SKUs had a price, a Shopify variant
 * and its own plate at /products/<slug>, and /founder-collection shows the
 * whole line on one shelf. Two product pages for one product drift: this one
 * still said "In stock … dispatched within one business day" and showed
 * packaging that predates the approved dielines (audit F-07, 17 Sept 2026).
 *
 * The URL was indexed and shared, so it redirects rather than 404s. The
 * campaign's name and its data (`CAMPAIGN`, `NEXT_MOVE`) live on in
 * `lib/nextMove.ts`; only the second page is gone.
 */
export const metadata = { robots: { index: false, follow: false } };

export default function NextMoveMoved() {
  permanentRedirect("/founder-collection");
}
