/**
 * Handoff to Shopify checkout.
 *
 * The site is the shop window; Shopify is the till. Nothing here talks to an
 * API — no token, no server code, no webhooks. A cart permalink carries the
 * whole bag to Shopify's hosted checkout in one hop, so there is never a
 * second cart to drift out of sync with this one.
 *
 * Format: https://{shop}/cart/{variantId}:{qty},{variantId}:{qty}
 *
 * KEEPING THIS HONEST
 * -------------------
 * Because prices live in products.ts rather than coming from Shopify, the two
 * can drift, and a customer who sees one price and is charged another is a
 * real problem. If you change a price in Shopify, change it here too:
 *
 *   products.ts  price: 39.99   ->  Shopify variant price
 *   products.ts  SET.price      ->  Shopify SerumSet price
 *
 * Verified against Shopify on 6 Aug 2026: serums $39.99, trio $98.99.
 */

import type { ProductSlug } from "./products";

export const SHOPIFY_DOMAIN = "founderbeauty.myshopify.com";

/**
 * Shopify variant IDs. These are stable — they only change if a product is
 * deleted and recreated. Read them any time from:
 *   https://founderbeauty.myshopify.com/products.json
 */
export const VARIANT_ID: Record<ProductSlug | "all-three", string> = {
  "thirst-trap": "47320268964009",
  "c-me-glow": "47320268898473",
  "bounce-back": "47320268996777",
  "all-three": "47320268931241",
};

export type CheckoutLine = { id: string; quantity: number };

/**
 * Builds the Shopify checkout URL for a bag.
 *
 * Unknown ids are skipped rather than throwing — a stale line left in
 * localStorage from an older build should not be able to block checkout for
 * everything else in the bag. Returns null only if nothing resolved.
 */
export function cartPermalink(lines: CheckoutLine[]): string | null {
  const parts = lines
    .map((line) => {
      const variant = VARIANT_ID[line.id as keyof typeof VARIANT_ID];
      if (!variant) return null;
      const quantity = Math.max(1, Math.min(20, Math.floor(line.quantity)));
      return `${variant}:${quantity}`;
    })
    .filter((part): part is string => part !== null);

  if (parts.length === 0) return null;

  return `https://${SHOPIFY_DOMAIN}/cart/${parts.join(",")}`;
}

/** Direct link to a single product's Shopify page, if you ever want one. */
export function shopifyProductUrl(slug: ProductSlug): string {
  return `https://${SHOPIFY_DOMAIN}/products/${slug}`;
}
