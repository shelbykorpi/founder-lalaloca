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
 * The board spec'd THE ANCHOR as a peptide cream at 50 ml. For a while the
 * sourced product was a 30 ml chamomile-and-witch-hazel cream from Blanka
 * ("Extreme Moisture Blend"), and this record was transcribed from that
 * listing. ON 16 SEPTEMBER 2026 THAT STOPPED BEING TRUE: the product in the
 * Selfnamed cart — the one the packaging is printed for, PEPTIDE MOISTURIZING
 * CREAM · 50 ml / 1.69 fl oz, peptide complex, hyaluronic acid, vitamin E —
 * is Selfnamed's Peptide Ageless AM/PM Cream, and the record below is
 * transcribed from THAT listing. The board spec and the product agree again.
 * Archive names — THE FIRST MOVE, SOFT POWER, THE LAST WORD — remain retired.
 *
 * SOURCE OF TRUTH FOR EVERYTHING FACTUAL: the supplier listing (Selfnamed,
 * "Peptide Ageless AM/PM Cream", /face-care/peptide-ageless-am-pm-cream-o7VB3).
 * Size, INCI and directions are transcribed from it and must not be edited to
 * read better. Nothing here states a clinical result; appearance language
 * only. The label's own words are used for the category and the key actives.
 *
 * SELLABLE AS A PREORDER since 19 Aug 2026. The product exists in Shopify
 * (variant 47361868169385, $34.00) and the variant is wired in
 * shopifyLinks.ts, so `sellable` is true and the buy path renders.
 *
 * It is a PREORDER, not stock: Shopify holds 0 on hand and sells anyway
 * ("continue selling when out of stock"). That contradicts the published
 * shipping policy — /policies/shipping promises dispatch within one business
 * day — so `preorder` below states the exception in plain words on the page
 * itself. If the preorder note is ever removed, remove the buy path with it;
 * a customer must never be able to buy this expecting next-day dispatch.
 */

export type FounderProductSlug = "hold-the-room";

export type FounderProduct = {
  slug: FounderProductSlug;
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
  /** Cutout on transparent ground, matched to the LALALOCA bottle treatment. */
  bottle: string;
  bottleAlt: string;
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
  /**
   * Set when the product sells ahead of stock. Rendered next to the buy
   * button, never below the fold — it is the only thing correcting the
   * one-business-day dispatch promise on /policies/shipping. Null means the
   * product ships from stock like the serums do.
   */
  preorder: string | null;
};

export const FOUNDER_COLLECTION: FounderProduct[] = [
  {
    slug: "hold-the-room",
    name: "Hold the Room",
    category: "Peptide Moisturizing Cream",
    archetype: "The Anchor",
    archetypeFor: "For the part that comes after arriving.",
    hero: "Anyone can make an entrance. Staying is the harder skill.",
    what: "A firming peptide cream for morning and night, with hyaluronic acid and vitamin E, for skin that needs more than water.",
    need: "Skin that goes dry, tight or dull-looking and doesn’t hold onto moisture for long.",
    benefit:
      "Skin feels smoother, firmer to the touch and stays comfortably hydrated, morning or night.",
    price: 36.0,
    size: "50 ml / 1.69 fl oz",
    supplierSku: "selfnamed:peptide-ageless-am-pm-cream-o7VB3",
    timing: "Morning or night",
    routine: "The last step, after your serums.",
    keyActive: "Peptide complex, hyaluronic acid and vitamin E",
    /* Verbatim from the Selfnamed INCI tab, 16 Sept 2026, in the order
       printed. The listing's footnotes — ➀ organic farming, ➁ from natural
       essential oils, ➂ pure mineral pigment — are dropped from the names
       and kept here: ➀ jojoba, mango butter, blueberry seed oil, ginkgo;
       ➁ the five allergen components at the end; ➂ the iron oxide. */
    ingredients: [
      "Aqua/Water",
      "Simmondsia Chinensis (Jojoba) Seed Oil",
      "Glycerin",
      "Pentylene Glycol",
      "Polyglyceryl-6 Stearate",
      "Cetearyl Alcohol",
      "Sodium PCA",
      "Dipalmitoyl Hydroxyproline",
      "Propanediol",
      "Aroma/Fragrance",
      "Dicaprylyl Carbonate",
      "Polyglyceryl-6 Behenate",
      "Mangifera Indica (Mango) Seed Butter",
      "Caprylic/Capric Triglyceride",
      "Coco-Caprylate",
      "Fragaria Ananassa (Strawberry) Seed Oil",
      "Vaccinium Myrtillus (Blueberry) Seed Oil",
      "Xanthan Gum",
      "Hexapeptide-11",
      "Phytosterols",
      "Octyldodecanol",
      "Palmitic Acid",
      "Stearic Acid",
      "Tocopherol",
      "Ascorbyl Palmitate",
      "Hydrolyzed Hyaluronic Acid",
      "Sodium Hyaluronate",
      "Sodium Phytate",
      "Potassium Hydroxide",
      "Leuconostoc/Radish Root Ferment Filtrate",
      "Ginkgo Biloba (Ginkgo) Leaf Extract",
      "Citric Acid",
      "Sodium Benzoate",
      "Potassium Sorbate",
      "CI 77491 (Iron Oxides)",
      "Linalyl Acetate",
      "Geranyl Acetate",
      "Linalool",
      "Geraniol",
      "Citronellol",
    ],
    origin: "Made in the EU.",
    bottle: "/products/hold-the-room-pack.webp",
    bottleAlt:
      "The Hold the Room airless pump bottle beside its Desert Pink carton, both carrying a Champagne Cream cartouche with a gold F-key crest, the label reading Hold the Room, the anchor, peptide moisturizing cream.",
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
        a: "Yes. Fragrance is on the ingredient list, along with the essential-oil components that come with it — linalool, geraniol, citronellol and their acetates. If you avoid fragrance in skincare, this is the one to skip — we would rather say so here than have you find out at home.",
      },
      {
        q: "Where does it go in a routine?",
        a: "Last. Serums first, thinnest to thickest, then this. In the morning, finish with SPF.",
      },
      {
        q: "How much is 50 ml?",
        a: "The standard size for a face cream. A cream this rich uses far less per application than a serum does, and the airless pump means none of it is left in the bottle.",
      },
      {
        q: "When does it ship?",
        a: "It’s a preorder against the first run, so it doesn’t follow the one-business-day dispatch the serums do. You’ll hear from us by email before it ships, and you can reply to that email to cancel if the timing no longer works.",
      },
      {
        q: "Is this one of the serums?",
        a: "No. LALALOCA is the serum collection; Hold the Room opens the FOUNDER Collection — the same house, the next line. They’re made to be worn together.",
      },
    ],
    sellable: true,
    preorder:
      "Preorder. Hold the Room ships from the first run — not the next-business-day dispatch the serums get. We’ll email you before it ships, and you can reply to cancel if the timing no longer works.",
  },
];

export function getFounderProduct(slug: string): FounderProduct | undefined {
  return FOUNDER_COLLECTION.find((p) => p.slug === slug);
}
