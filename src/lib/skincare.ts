/**
 * ALL EIGHT PRODUCTS, ONE SHAPE (11 Oct 2026, clarity pass).
 *
 * The catalogue lives in three files with three types: the LALALOCA serums
 * (products.ts), Hold the Room (founderCollection.ts) and the other four
 * FOUNDER Collection pieces (nextMove.ts). Nothing here is retyped: every
 * field is read from those records, which mirror the live Shopify products
 * (variant IDs included), so a price or a name changes in one place.
 *
 * Used by the homepage's "Your next chapter starts here", the /skincare
 * (Shop All) page and nothing else, so neither has to know three types.
 */
import { FOUNDER_COLLECTION } from "./founderCollection";
import { NEXT_MOVE, availabilityLine } from "./nextMove";
import { products } from "./products";
import { VARIANT_ID } from "./shopifyLinks";

export type SkincareItem = {
  slug: string;
  collection: "founder" | "lalaloca";
  name: string;
  /** What it is, as on the label. */
  category: string;
  /** What it does, in one plain sentence (the record's `what`). */
  what: string;
  price: number;
  size: string;
  /** The cutout used on cards. */
  image: string;
  imageAlt: string;
  href: string;
  /** The bag line, or null when a shade must be chosen on the product page. */
  bag: { slug: string; name: string; category: string; price: number; size: string; bottle: string } | null;
  /** Every Shopify variant behind this card, for the live sold-out check. */
  variantIds: string[];
  shades: number;
  /** The ship-date line for the FOUNDER Collection; null for the serums. */
  note: string | null;
};

const bySlug = Object.fromEntries(NEXT_MOVE.map((p) => [p.slug, p]));
const htr = FOUNDER_COLLECTION[0];

function founderItem(slug: string, image: string, imageAlt: string): SkincareItem {
  if (slug === "hold-the-room") {
    return {
      slug,
      collection: "founder",
      name: htr.name,
      category: htr.category,
      what: htr.what,
      price: htr.price,
      size: htr.size,
      image,
      imageAlt,
      href: "/products/hold-the-room",
      bag: { slug: htr.slug, name: htr.name, category: htr.category, price: htr.price, size: htr.size, bottle: htr.bottle },
      variantIds: [VARIANT_ID["hold-the-room"]],
      shades: 0,
      note: availabilityLine("in-stock"),
    };
  }
  const p = bySlug[slug];
  const shaded = Boolean(p.shades && p.shades.length);
  return {
    slug,
    collection: "founder",
    name: p.name,
    category: p.category,
    what: p.what,
    price: p.price,
    size: p.size,
    image,
    imageAlt,
    href: `/products/${slug}`,
    bag: shaded
      ? null
      : { slug: p.variantId!, name: p.name, category: p.category, price: p.price, size: p.size, bottle: p.pack.src },
    variantIds: shaded ? p.shades!.map((s) => s.variantId) : [p.variantId!],
    shades: shaded ? p.shades!.length : 0,
    note: availabilityLine(p.availability),
  };
}

/** The FOUNDER Collection, in the order it is used: cleanse to finish. */
export const FOUNDER_LINE: SkincareItem[] = [
  founderItem("opening-line", "/products/opening-line-cut.webp", "Opening Line oil-to-milk cleanser: a Founder Green bottle with cream and green stripes and a white pump."),
  founderItem("clean-break", "/products/clean-break-cut.webp", "Clean Break purifying face wash: a Founder Green bottle with cream and green stripes and a white pump."),
  founderItem("hold-the-room", "/products/hold-the-room-cut.webp", "Hold the Room peptide moisturizing cream: a Desert Pink airless bottle beside its carton."),
  founderItem("double-take", "/products/double-take-cut.webp", "Double Take peptide eye cream: a small Desert Pink bottle beside its carton."),
  founderItem("smooth-talker", "/products/smooth-talker-cut.webp", "Smooth Talker ceramide tone stick beside its brass carton."),
];

/** The LALALOCA serums. */
export const LALALOCA_LINE: SkincareItem[] = products.map((p) => ({
  slug: p.slug,
  collection: "lalaloca",
  name: p.name,
  category: p.category,
  what: p.what,
  price: p.price,
  size: p.size,
  image: p.bottle,
  imageAlt: `${p.name}, the LALALOCA ${p.category.toLowerCase()} bottle.`,
  href: `/products/${p.slug}`,
  bag: { slug: p.slug, name: p.name, category: p.category, price: p.price, size: p.size, bottle: p.bottle },
  variantIds: [VARIANT_ID[p.slug]],
  shades: 0,
  note: null,
}));

export const ALL_SKINCARE: SkincareItem[] = [...FOUNDER_LINE, ...LALALOCA_LINE];

export const allVariantIds = (items: SkincareItem[]) => items.flatMap((i) => i.variantIds);

/** Sold out only when Shopify says every variant behind the card is. */
export function isSoldOut(item: SkincareItem, availability: Record<string, boolean> | null | undefined) {
  if (!availability) return false;
  return item.variantIds.every((id) => availability[id] === false);
}
