/**
 * THE SITE SEARCH INDEX — built on the server, handed to <SiteSearch> as data.
 *
 * 30 Sept 2026 (launch crawl): the index only knew the three serums, the
 * Found Her profiles and the nav, so "hold the room", "cleanser" and "eye
 * cream" found nothing while all five FOUNDER Collection products were on
 * sale. It now reads every record the site sells or publishes from its own
 * source file, so a name, category or price changes here when it changes
 * there. Nothing in this file is retyped product copy.
 *
 * Built here rather than in the client component so the browser receives the
 * small index, not the whole Library (study abstracts, bodies) as JavaScript.
 */
import { PRIMARY_NAV } from "@/lib/brand";
import { products, formatPrice } from "@/lib/products";
import { profiles } from "@/lib/profiles";
import { NEXT_MOVE } from "@/lib/nextMove";
import { FOUNDER_COLLECTION } from "@/lib/founderCollection";
import { LIBRARY } from "@/lib/library";

export type SearchEntry = {
  href: string;
  title: string;
  kind: string;
  detail: string;
  haystack: string;
};

const hay = (...parts: (string | undefined)[]) => parts.filter(Boolean).join(" ").toLowerCase();

export function buildSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [
    ...products.map((product) => ({
      href: `/products/${product.slug}`,
      title: product.name,
      kind: "Serum",
      detail: `${product.category} · ${product.benefit}`,
      haystack: hay(
        product.name,
        product.category,
        product.what,
        product.need,
        product.benefit,
        product.keyActive,
        product.timing,
      ),
    })),
    /* The FOUNDER Collection: the anchor from founderCollection.ts, the other
       four from nextMove.ts. Both carry a route at /products/<slug>. */
    ...FOUNDER_COLLECTION.map((product) => ({
      href: `/products/${product.slug}`,
      title: product.name,
      kind: "FOUNDER Collection",
      detail: `${product.category} · ${formatPrice(product.price)}`,
      haystack: hay(
        product.name,
        product.category,
        product.archetype,
        product.what,
        product.need,
        product.benefit,
        product.keyActive,
        product.timing,
        "founder collection",
      ),
    })),
    ...NEXT_MOVE.map((product) => ({
      href: `/products/${product.slug}`,
      title: product.name,
      kind: "FOUNDER Collection",
      detail: `${product.category} · ${formatPrice(product.price)}`,
      haystack: hay(
        product.name,
        product.category,
        product.what,
        product.hook,
        ...product.benefits,
        ...product.keyIngredients,
        product.shades?.map((s) => `${s.code} ${s.name}`).join(" "),
        "founder collection",
      ),
    })),
    ...LIBRARY.map((entry) => ({
      href: `/library/${entry.slug}`,
      title: entry.name,
      kind: "Library",
      detail: `${entry.kind} · ${entry.products.map((p) => p.name).join(", ")}`,
      haystack: hay(
        entry.name,
        entry.inci,
        entry.kind,
        entry.standfirst,
        ...entry.products.map((p) => p.name),
        "library ingredient",
      ),
    })),
    ...profiles.map((profile) => ({
      href: `/found-her/${profile.slug}`,
      title: profile.name,
      kind: "Found Her",
      detail: profile.building,
      haystack: hay(profile.name, profile.role, profile.building, profile.standfirst),
    })),
    ...[
      ...PRIMARY_NAV,
      { href: "/find-your-serum", label: "Which serum?" },
      { href: "/policies/shipping", label: "Shipping" },
      { href: "/policies/returns", label: "Returns" },
    ].map((item) => ({
      href: item.href,
      title: item.label,
      kind: "Page",
      detail: item.href,
      haystack: hay(item.label, item.href),
    })),
  ];

  /* One row per URL: the first record to claim a route wins. */
  const seen = new Set<string>();
  return entries.filter((entry) => (seen.has(entry.href) ? false : (seen.add(entry.href), true)));
}
