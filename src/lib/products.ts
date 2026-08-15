/**
 * The LALALOCA Collection — three serums already on sale.
 *
 * LOCKED SOURCE MATERIAL: names, categories, sizes, prices, product colours,
 * bottle photography and label wording come from the approved packaging and
 * must not be altered.
 *
 * INGREDIENTS: only what the approved label states is repeated here. No
 * percentages, no undocumented actives, no results claims. Where a full INCI
 * list has not been supplied it is marked as outstanding rather than invented.
 */

import { CONTACT_EMAIL } from "./brand";

export type ProductSlug = "bounce-back" | "thirst-trap" | "c-me-glow";

export type Product = {
  slug: ProductSlug;
  name: string;
  /** Exactly as printed on the label */
  category: string;
  /**
   * ── THE THREE IDENTITIES ──────────────────────────────────────────────────
   *
   * FOUNDER sells three serums that do three different things, and the reason
   * a woman reaches for one over another is rarely only dermatological — it is
   * what kind of day she is having. These three fields carry that, and only
   * that.
   *
   * They are EDITORIAL. Nothing here may state or imply a result, an
   * ingredient, a timeframe or a clinical effect; that work belongs to
   * `what`, `need`, `benefit` and `keyActive`, which are written against the
   * approved label and must not absorb any of this language.
   *
   * The test when editing: if a sentence would need substantiation under FTC
   * claims rules, it does not belong in these three fields.
   */
  /** The identity: The Closer, The Entrance, The Comeback. */
  archetype: string;
  /** One line for the collection page's identity band. */
  archetypeFor: string;
  /** Opens the product page, above the functional description. */
  hero: string;
  /** Plain-language answer to "what is it?" */
  what: string;
  /** The skin need it addresses, in the customer's words */
  need: string;
  /** Who tends to reach for it */
  who: string;
  /** One recognisable moment it belongs to */
  moment: string;
  /** Short benefit used on cards — cosmetic, no results promised */
  benefit: string;
  price: number;
  /** Exactly as printed on the label */
  size: string;
  /** Locked product colour */
  accent: string;
  /** Warm light tint used inside the product doorway */
  glow: string;
  bottle: string;
  /** Where it sits in a routine */
  routine: string;
  /** Morning, night or either */
  timing: string;
  /** Documented on the label only */
  keyActive: string;
  /** Null until the supplier sheet is supplied — never invented */
  ingredients: string[] | null;
  /** Null until documented by the founder */
  texture: string | null;
  howToUse: { step: string; detail: string }[];
  faqs: { q: string; a: string }[];
  gallery: { src: string; alt: string; caption: string }[];
  /** True when a full-resolution approved cutout is already in the repo */
  approvedCutout: boolean;
};

export const products: Product[] = [
  {
    slug: "thirst-trap",
    name: "Thirst Trap",
    category: "8-Layer Hyaluronic Acid Serum",
    archetype: "The Closer",
    archetypeFor: "For when it needs to get done.",
    hero: "Looks expensive. Never looks exhausted.",
    what: "A lightweight hydrating serum built on eight molecular weights of hyaluronic acid.",
    need: "Skin that goes tight, flaky or dull-looking when it’s short on water.",
    who: "Anyone whose skin feels tight by the afternoon, or whose makeup starts to sit badly by lunchtime.",
    moment:
      "The 6am one, when you’ve been up twice in the night and you’d like your face not to announce it.",
    benefit: "Skin feels softer and more comfortable, and makeup sits better on top.",
    price: 38.0,
    size: "50 ml / 1.69 fl oz",
    accent: "#48958D",
    glow: "#7fd0c4",
    bottle: "/products/thirst-trap-bottle.png",
    routine: "After cleansing, before moisturiser.",
    timing: "Morning or night",
    keyActive: "8-layer hyaluronic acid, with marine collagen and panthenol (B5)",
    ingredients: null,
    texture: null,
    howToUse: [
      { step: "Cleanse", detail: "Start with a clean face." },
      {
        step: "Press 3–5 drops into damp skin",
        detail: "Damp is the important part — hyaluronic acid needs water to hold on to.",
      },
      { step: "Follow with moisturiser", detail: "Seal it in so it doesn’t evaporate off." },
    ],
    faqs: [
      {
        q: "Where does it go in my routine?",
        a: "After cleansing, before moisturiser. Morning or night, or both.",
      },
      {
        q: "Can I use it with the other two?",
        a: "Yes. If you’re using all three, this one layers first because it’s the lightest. Introduce one new product at a time so you know what your skin is reacting to.",
      },
      {
        q: "Where’s the full ingredient list?",
        a: `The complete INCI list hasn’t been published here yet. The label lists eight-weight hyaluronic acid, marine collagen and panthenol. We’d rather leave the rest blank than guess at it — email ${CONTACT_EMAIL} and we’ll send the supplier sheet.`,
      },
      {
        q: "Will it work for me?",
        a: "It’s a cosmetic product and skin varies. We don’t make clinical claims, and anyone who promises you a guaranteed result is overselling.",
      },
    ],
    gallery: [
      {
        src: "/products/thirst-trap-texture.jpg",
        alt: "The Thirst Trap serum and its texture on a soft surface.",
        caption: "The finish",
      },
      {
        src: "/products/thirst-trap-size.jpg",
        alt: "The 50 ml Thirst Trap bottle shown at scale in the hand.",
        caption: "50 ml, in the hand",
      },
    ],
    approvedCutout: true,
  },
  {
    slug: "c-me-glow",
    name: "C Me Glow",
    category: "Vitamin C Brightening Serum",
    archetype: "The Entrance",
    archetypeFor: "For when it’s time to be seen.",
    hero: "For mornings when being overlooked isn’t on the calendar.",
    what: "A vitamin C serum for skin that looks flat or uneven in tone.",
    need: "A complexion that looks dull in daylight, or uneven when you’d rather it weren’t.",
    who: "Anyone who looks fine up close and washed out in photographs.",
    moment:
      "The morning of something that matters, when you want to look like you slept even if you didn’t.",
    benefit: "Tone looks brighter and more even, with a warm finish rather than a shiny one.",
    price: 38.0,
    size: "50 ml / 1.69 fl oz",
    accent: "#F6740B",
    glow: "#ffb066",
    bottle: "/products/c-me-glow-bottle.png",
    routine: "After cleansing, before moisturiser and sunscreen.",
    timing: "Morning",
    keyActive: "Vitamin C",
    ingredients: null,
    texture: null,
    howToUse: [
      { step: "Cleanse", detail: "Start with a clean face." },
      { step: "Press 3–5 drops into damp skin", detail: "Mornings suit this one best." },
      {
        step: "Moisturiser, then sunscreen",
        detail: "Vitamin C and daily SPF belong together.",
      },
    ],
    faqs: [
      {
        q: "Where does it go in my routine?",
        a: "Mornings, after cleansing and before moisturiser and sunscreen.",
      },
      {
        q: "Can I use it with the other two?",
        a: "Yes — most people use this one in the morning and keep the others for nights. Introduce one new product at a time.",
      },
      {
        q: "Where’s the full ingredient list?",
        a: `The complete INCI list hasn’t been published here yet. The label states it is a vitamin C serum; we haven’t listed anything the packaging doesn’t. Email ${CONTACT_EMAIL} and we’ll send the supplier sheet.`,
      },
      {
        q: "Will it work for me?",
        a: "It’s a cosmetic product and skin varies. We don’t make clinical claims. If your skin is reactive, patch test first.",
      },
    ],
    gallery: [],
    approvedCutout: false,
  },
  {
    slug: "bounce-back",
    name: "Bounce Back",
    category: "Collagen Firming Serum",
    archetype: "The Comeback",
    archetypeFor: "For when you’re becoming again.",
    hero: "Because starting over is still starting.",
    what: "A collagen serum for skin that feels slack rather than dry.",
    need: "Skin that’s lost some spring, and a face that reads tired before you feel it.",
    who: "Anyone who wants more cushion and bounce, particularly at the end of a long stretch.",
    moment:
      "The night after the week that took everything, when going to bed with a clean face is the whole plan.",
    benefit: "Skin feels firmer and more cushioned, and looks smoother the next morning.",
    price: 38.0,
    size: "50 ml / 1.69 fl oz",
    accent: "#DC3D39",
    glow: "#f0a08c",
    bottle: "/products/bounce-back-bottle.png",
    routine: "After cleansing, before moisturiser.",
    timing: "Night",
    keyActive: "Collagen",
    ingredients: null,
    texture: null,
    howToUse: [
      { step: "Cleanse", detail: "Start with a clean face." },
      { step: "Press 3–5 drops into damp skin", detail: "Palms flat. No rubbing." },
      { step: "Follow with moisturiser", detail: "Finish however you normally do." },
    ],
    faqs: [
      {
        q: "Where does it go in my routine?",
        a: "After cleansing, before moisturiser. Most people keep this one for nights.",
      },
      {
        q: "Can I use it with the other two?",
        a: "Yes. A common pattern is C Me Glow in the morning and this at night, with Thirst Trap whenever skin feels tight. Introduce one new product at a time.",
      },
      {
        q: "Where’s the full ingredient list?",
        a: `The complete INCI list hasn’t been published here yet. The label states it is a collagen firming serum; we haven’t listed anything the packaging doesn’t. Email ${CONTACT_EMAIL} and we’ll send the supplier sheet.`,
      },
      {
        q: "Will it work for me?",
        a: "It’s a cosmetic product and skin varies. We don’t make clinical claims about firmness or lines.",
      },
    ],
    gallery: [],
    approvedCutout: false,
  },
];

/**
 * The three-bottle set already offered at this price in the existing shop.
 * Not a new bundle — do not add others without founder approval.
 */
export const SET = {
  name: "All three",
  detail: "Three full-size 50 ml serums",
  price: 98.0,
  /** Editorial still life — the three product colours, not a photograph of the bottles. */
  image: "/editorial/collection-still.webp",
};

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function otherProducts(slug: string): Product[] {
  return products.filter((p) => p.slug !== slug);
}

export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}
