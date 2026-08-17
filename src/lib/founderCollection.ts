/**
 * THE FOUNDER COLLECTION — the second line, sold under FOUNDER itself.
 *
 * Separate from products.ts, which is the LALALOCA Collection and says so in
 * its own header. Two lines, two files, no chance of a serum and a cream
 * drifting into one array and inheriting each other's rules.
 *
 * NAMING comes from Master Brand Board v2.14, which assigns a name to each
 * slot rather than to a formula:
 *
 *   01 · THE OPENER     OPENING LINE   hydrating daily cleanser
 *   02 · THE ANCHOR     HOLD THE ROOM  moisturizer          <- this file
 *   03 · THE SIGNATURE  SIGN HERE      conditioning lip treatment
 *
 * The board originally spec'd THE ANCHOR as a peptide cream at 50 ml. The
 * sourced product is 30 ml and built on chamomile and witch hazel, so the
 * SPEC was amended (docs/BRAND_BOARD.md) while the NAME was kept. Archive
 * names — THE FIRST MOVE, SOFT POWER, THE LAST WORD — remain retired.
 *
 * SOURCE OF TRUTH FOR EVERYTHING FACTUAL: the supplier listing (Blanka,
 * "Extreme Moisture Blend", SKU 100249-BLNK-MB-03-02-HM-SM3D). Size, INCI and
 * directions are transcribed from it and must not be edited to read better.
 * Nothing here states a clinical result; appearance language only.
 *
 * NOT YET SELLABLE. There is no Shopify variant for this product, so there is
 * deliberately no add-to-bag path — see `sellable` below. Wire the variant in
 * shopifyLinks.ts and flip the flag in one commit, never separately.
 */

export type FounderProduct = {
  slug: string;
  name: string;
  /** Exactly as it will print on the label. */
  category: string;
  /** The board's slot identity. */
  archetype: string;
  archetypeFor: string;
  /** Editorial opener. No claim, no ingredient, no timeframe. */
  hero: string;
  /** Plain answer to "what is it?" */
  what: string;
  /** The need in the customer's words. */
  need: string;
  /** Cosmetic benefit only — appearance and feel, never a result. */
  benefit: string;
  price: number;
  /** Net contents as the supplier states them. */
  size: string;
  /** Supplier SKU. Ours until Shopify assigns its own. */
  supplierSku: string;
  /** Morning, night or either. */
  timing: string;
  /** Where it sits in a routine. */
  routine: string;
  /** Named on the supplier listing. Not an INCI percentage claim. */
  keyActive: string;
  /** Full INCI, transcribed verbatim from the supplier listing. */
  ingredients: string[] | null;
  /** Manufacturing origin as stated by the supplier. */
  origin: string;
  howToUse: { step: string; detail: string }[];
  faqs: { q: string; a: string }[];
  /**
   * False until the product exists in Shopify with a variant ID AND the
   * board's remaining gates are closed (stability documentation, component
   * and leakage testing, regulatory artwork, trademark clearance,
   * fulfilment timing). Controls whether a buy path renders at all.
   */
  sellable: boolean;
};

export const FOUNDER_COLLECTION: FounderProduct[] = [
  {
    slug: "hold-the-room",
    name: "Hold the Room",
    category: "Moisturizing Cream",
    archetype: "The Anchor",
    archetypeFor: "For the part that comes after arriving.",
    hero: "Anyone can make an entrance. Staying is the harder skill.",
    what: "A rich cream moisturizer with chamomile extract and witch hazel, for skin that needs more than water.",
    need: "Skin that goes dry, tight or dull-looking and doesn’t hold onto moisture for long.",
    benefit:
      "Skin feels smoother and stays comfortably hydrated, morning or night.",
    price: 34.0,
    size: "30 ml / 1 fl oz",
    supplierSku: "100249-BLNK-MB-03-02-HM-SM3D",
    timing: "Morning or night",
    routine: "The last step, after your serums.",
    keyActive: "Chamomile extract and witch hazel",
    /* Verbatim from the supplier listing. Duplicate entries (aqua, glycerin)
       are in the source as printed and are left alone — a tidied INCI is an
       edited INCI. */
    ingredients: [
      "Aqua",
      "Glycerin",
      "Olea Europaea (Olive) Fruit Oil",
      "Dimethicone",
      "PEG-100 Stearate",
      "Glyceryl Stearate",
      "Petrolatum",
      "Isopropyl Myristate",
      "Hydrogenated Polyisobutene",
      "Dipropylene Glycol",
      "Polysorbate 60",
      "Cetearyl Alcohol",
      "Sorbitan Stearate",
      "Aqua",
      "Glycerin",
      "Glyceryl Acrylate/Acrylic Acid Copolymer",
      "PVM/MA Copolymer",
      "Propylene Glycol",
      "1,2-Hexanediol",
      "Polyacrylamide",
      "C13-14 Isoparaffin",
      "Laureth-7",
      "Water",
      "Hydroxyacetophenone",
      "Phenoxyethanol",
      "Ethylhexylglycerin",
      "Carbomer",
      "Triethanolamine",
      "Xanthan Gum",
      "Fragrance",
      "Anthemis Nobilis Flower Oil",
    ],
    origin: "Made in North America.",
    howToUse: [
      {
        step: "Clean skin first",
        detail: "Apply with clean fingertips after washing and toning.",
      },
      {
        step: "Face and neck",
        detail: "Massage upward. Most routines stop at the jawline; this one doesn’t.",
      },
      {
        step: "Last",
        detail:
          "Serums go first, thinnest to thickest. The cream seals the routine. In the morning, SPF goes over the top.",
      },
    ],
    faqs: [
      {
        q: "Does it contain fragrance?",
        a: "Yes. Fragrance and chamomile flower oil are both on the ingredient list. If you avoid fragrance in skincare, this is the one to skip — we would rather say so here than have you find out at home.",
      },
      {
        q: "Where does it go in a routine?",
        a: "Last. Serums first, thinnest to thickest, then this. In the morning, finish with SPF.",
      },
      {
        q: "Is 30 ml enough?",
        a: "The serums are 50 ml because most serums are sold at 30 ml. A moisturizer is a different amount of product per use — 30 ml is the standard size for a cream of this richness.",
      },
      {
        q: "Is this LALALOCA?",
        a: "No. LALALOCA is the serum collection. This is the FOUNDER collection — the same house, a different line.",
      },
    ],
    sellable: false,
  },
];

export function getFounderProduct(slug: string): FounderProduct | undefined {
  return FOUNDER_COLLECTION.find((p) => p.slug === slug);
}
