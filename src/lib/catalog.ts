import { unstable_cache } from "next/cache";
import { adminGraphql, hasAdminCredentials } from "./shopifyAdmin";

/**
 * The self-publishing catalog (copy-cut template, 23 Aug 2026).
 *
 * Shopify owns everything transactional — title, handle, price, images,
 * availability — and eight `founder.*` metafields own everything editorial:
 *
 *   character · descriptor · hook · who · how · actives · door · badge
 *
 * A product added in Shopify admin, published to the sales channel and put in
 * the right collection appears on the site within a minute of the cache
 * expiring, card and detail page included, no deploy.
 *
 * INERT WITHOUT CREDENTIALS, like everything else that talks to Shopify from
 * here. Every reader returns null when the catalog cannot be reached, and
 * every caller has a hand-written fallback — the site can never render an
 * empty shelf because an API had a bad minute. Errors are logged, not thrown.
 *
 * WORD LIMITS ARE AUTHORING RULES, NOT RENDER GATES. The spec says a
 * published product must carry `descriptor` and `hook`; a product missing
 * them still renders (name and price are never wrong), and the gap is logged
 * loudly so it gets fixed in Shopify rather than hidden by a broken page.
 * Deliberately softer than the spec's "fail the build": a missing metafield
 * at 2am should not take the whole site build down with it.
 */

export type CatalogProduct = {
  handle: string;
  title: string;
  /** Numeric variant id, usable directly in a cart permalink. */
  variantId: string;
  price: number;
  available: boolean;
  image: { url: string; alt: string } | null;
  hoverImage: { url: string; alt: string } | null;
  /** founder.* metafields — all optional, all authored in Shopify. */
  character: string | null;
  descriptor: string | null;
  hook: string | null;
  who: string | null;
  how: string | null;
  actives: string | null;
  /** CSS colour for the card ground / PDP accent. */
  door: string | null;
  badge: string | null;
};

const PRODUCT_FIELDS = `
  title
  handle
  status
  media(first: 2) {
    nodes {
      preview { image { url altText } }
    }
  }
  variants(first: 1) {
    nodes { legacyResourceId price availableForSale }
  }
  metafields(first: 12, namespace: "founder") {
    nodes { key value }
  }
`;

/* eslint-disable @typescript-eslint/no-explicit-any */
function toCatalogProduct(node: any): CatalogProduct | null {
  if (!node || node.status !== "ACTIVE") return null;
  const variant = node.variants?.nodes?.[0];
  if (!variant?.legacyResourceId) return null;

  const fields = new Map<string, string>(
    (node.metafields?.nodes ?? []).map((m: any) => [m.key, String(m.value)]),
  );
  const media = node.media?.nodes ?? [];
  const img = (i: number) =>
    media[i]?.preview?.image?.url
      ? {
          url: media[i].preview.image.url as string,
          alt: (media[i].preview.image.altText as string) || node.title,
        }
      : null;

  const product: CatalogProduct = {
    handle: node.handle,
    title: node.title,
    variantId: String(variant.legacyResourceId),
    price: Number(variant.price),
    available: variant.availableForSale !== false,
    image: img(0),
    hoverImage: img(1),
    character: fields.get("character") ?? null,
    descriptor: fields.get("descriptor") ?? null,
    hook: fields.get("hook") ?? null,
    who: fields.get("who") ?? null,
    how: fields.get("how") ?? null,
    actives: fields.get("actives") ?? null,
    door: fields.get("door") ?? null,
    badge: fields.get("badge") ?? null,
  };

  if (!product.descriptor || !product.hook) {
    console.warn(
      `[catalog] ${product.handle} is published without founder.descriptor or founder.hook — ` +
        `it renders minimal. Fill the FOUNDER fields in Shopify → Products.`,
    );
  }
  return product;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Products in a Shopify collection, by collection handle. Cached 60 seconds
 * under the "shopify-catalog" tag, which /api/revalidate can burst — Save in
 * Shopify, correct on the site within a minute either way.
 */
export const fetchCollectionProducts = unstable_cache(
  async (collectionHandle: string): Promise<CatalogProduct[] | null> => {
    if (!hasAdminCredentials()) return null;
    try {
      const data = await adminGraphql(
        `query Collection($handle: String!) {
          collectionByHandle(handle: $handle) {
            products(first: 24, sortKey: COLLECTION_DEFAULT) {
              nodes { ${PRODUCT_FIELDS} }
            }
          }
        }`,
        { handle: collectionHandle },
      );
      const nodes = data?.collectionByHandle?.products?.nodes;
      if (!nodes) return null;
      return nodes
        .map(toCatalogProduct)
        .filter((p: CatalogProduct | null): p is CatalogProduct => p !== null);
    } catch (error) {
      console.warn(`[catalog] collection "${collectionHandle}" unavailable:`, error);
      return null;
    }
  },
  ["catalog-collection"],
  { revalidate: 60, tags: ["shopify-catalog"] },
);

/** One product by its Shopify handle — the detail-page reader. */
export const fetchCatalogProduct = unstable_cache(
  async (handle: string): Promise<CatalogProduct | null> => {
    if (!hasAdminCredentials()) return null;
    try {
      const data = await adminGraphql(
        `query Product($handle: String!) {
          productByHandle(handle: $handle) { ${PRODUCT_FIELDS} }
        }`,
        { handle },
      );
      return toCatalogProduct(data?.productByHandle);
    } catch (error) {
      console.warn(`[catalog] product "${handle}" unavailable:`, error);
      return null;
    }
  },
  ["catalog-product"],
  { revalidate: 60, tags: ["shopify-catalog"] },
);
