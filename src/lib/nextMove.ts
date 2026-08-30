/**
 * THE NEXT MOVE — the presale campaign for the three Selfnamed SKUs.
 *
 * EVERY FACT HERE TRACES TO A CONCEPT DOC. The three docs in the Claude
 * project (founder-clean-break-face-wash-concept, -smooth-talker-cc-stick-,
 * -double-take-product-) carry the verbatim INCI, the supplier-stated fill,
 * the approved on-label copy and the explicit may-not-say lists. Where this
 * file and a render disagree, the render is wrong: the 24 Aug campaign
 * artwork drifted in four places and all four are corrected here.
 *
 *   · CLEAN BREAK said MATCHA TEA. The INCI is Ilex Paraguariensis —
 *     yerba maté, a holly, not green tea. Corrected to MATE LEAF.
 *   · CLEAN BREAK said 146 ml / 4.9 fl oz. Supplier fill is 140 ml.
 *   · DOUBLE TAKE called out CERAMIDES, COQ10 and EGF. None of the three
 *     is in its 40-item INCI. Corrected to the documented actives.
 *   · SMOOTH TALKER carried "Broad Spectrum SPF 30 sunscreen". Removed —
 *     see the block on `sunNote` below. This is the important one.
 *
 * PHOTOGRAPHY. The 25 Aug corrected render set replaced the 24 Aug artwork
 * and was verified label by label before use: Smooth Talker now reads
 * CERAMIDE TONE STICK with no SPF or sunscreen wording anywhere; Clean Break
 * reads MATE LEAF and 140 ml / 4.73 fl oz; Double Take reads HEXAPEPTIDE-11 ·
 * VITAMIN C · VITAMIN E with the approved three benefit lines and no firming
 * claim. These are renders of packaging, not photographs of a physical
 * sample — reshoot when a sample exists, per every concept doc.
 *
 * OPENING LINE JOINED ON 30 AUGUST. Board slot 01 finally has a supplier —
 * Selfnamed's Sensitive Skin Oil-To-Milk Cleanser, 150 ml, COSMOS Organic,
 * $9.96 bulk / $16.60 at one, no MOQ. Every fact in its record is transcribed
 * from the supplier's own listing, read logged in on 30 Aug. It is a
 * reservation, not a sale, for the same reason as the other three.
 *
 * SIGN HERE, board slot 03, still has no supplier and is not in this array.
 * Neither Blanka nor Selfnamed stocks a conditioning lip treatment; Selfnamed
 * has a matte lipstick and a hydrogel patch, and matte is the opposite
 * property. It stays a waitlist tile until a component maker is found.
 *
 * NO PRICES, DELIBERATELY. All three concept docs record that Selfnamed's
 * unit cost was not visible in the studio, and their own rule is "no price,
 * no slot". The page therefore reserves rather than sells: nothing is
 * charged, so the FTC Mail Order Rule's 30-day clock never starts against a
 * ship date nobody can name yet. When price and window exist, add them here
 * and switch `RESERVING` to false.
 */

/** While true the page captures reservations and shows no price or buy path. */
export const RESERVING = true;

export type NextMoveProduct = {
  slug: string;
  name: string;
  /** The category exactly as it may be printed. */
  category: string;
  /** The one seductive line. Register: confidence, never empowerment filler. */
  hook: string;
  /** Plain answer to "what is it?" */
  what: string;
  /** Approved appearance-only benefit lines, from the concept docs. */
  benefits: string[];
  /** Supplier's own listed key ingredients, quoted exactly. */
  keyIngredients: string[];
  /** Supplier-stated fill. Regulated declaration — never rounded. */
  size: string;
  /** Shade, where the SKU has one. Kept for products with a single shade. */
  shade?: string;
  /**
   * Shade range, where the SKU has more than one. Three shades of ONE
   * product — same 12 g stick, same formula, same claims — not three
   * products. Each carries its own hero because the carton stripe shifts
   * with the shade, so the picture has to change with the choice.
   *
   * `handle` is the stable identifier for a URL or a future Shopify
   * variant. NO SHOPIFY VARIANT IDS EXIST FOR THESE YET, and none are
   * invented here: the picker records an intent, not a purchase.
   */
  shades?: {
    /** Numeric code as printed: "20". */
    code: string;
    /** Shade name as printed: "Light". */
    name: string;
    /** Stable handle for URLs and future variant mapping. */
    handle: string;
    hero: { src: string; alt: string };
  }[];
  cta: string;
  /**
   * ── DETAIL-PAGE FIELDS (added 25 Aug) ──────────────────────────────────
   * The collection cards used to send every shopper to the shared campaign
   * page, so clicking Clean Break opened a page about three products. Each
   * SKU now has its own route at /products/<slug>, and these carry what that
   * page needs beyond the card.
   */
  /** Longer description, detail page only. Approved wording. */
  description: string;
  /** The detail page's own CTA label. */
  detailCta: string;
  /** What a reservation is, said plainly above the button. */
  reservationStatus: string;
  /**
   * The detail hero — this product ALONE. The card's `scene` may show a
   * family or a range; a detail page may not, or the shopper who clicked
   * one product lands on a picture of three.
   */
  detailHero: { src: string; alt: string };
  /** Extra supported facts, where the supplier documents them. */
  facts?: string[];
  /** The two stripe colours of this SKU's packaging wall. */
  stripes: { a: string; b: string };
  /** Ink that reads on this SKU's mat. */
  ink: string;
  /**
   * Pack shot on white — the card primary. From the corrected Selfnamed
   * renders supplied 25 Aug, which fix all four drifts flagged in the audit.
   */
  pack: { src: string; alt: string };
  /** Architectural scene, revealed on hover. Same corrected packaging. */
  scene: { src: string; alt: string };
  /**
   * Said plainly rather than buried — the board's Truth Standard. Fragrance
   * on an eye product, and a mineral-looking formula that is not a sunscreen,
   * are both things a customer would rather learn here than at home.
   */
  plainly: string;
  /**
   * SMOOTH TALKER only. Zinc oxide leads its INCI and titanium dioxide is in
   * it, so a customer may reasonably assume sun protection. The supplier has
   * never stated an SPF value, no test is held, and an SPF claim would make
   * this an OTC drug in the US requiring a Drug Facts panel, actives with
   * percentages, and FDA registration. So the page says outright that it is
   * not a sunscreen. Delete this line only when Selfnamed supplies tested
   * data AND the US OTC labelling to go with it.
   */
  sunNote?: string;
};

export const NEXT_MOVE: NextMoveProduct[] = [
  {
    /* ── OPENING LINE ─────────────────────────────────────────────────────
       Board slot 01, THE OPENER. It was a name and nothing else from 10 Aug
       until 30 Aug, when a supplier was finally found for it: Selfnamed's
       Sensitive Skin Oil-To-Milk Cleanser, 150 ml — which is the board's own
       target format for this slot, "150 mL pump", exactly.

       IT IS HERE AND NOT ON THE WAITLIST because its state changed. It has a
       supplier, a verified fill, a certification, a unit cost and finished
       artwork — the same state Clean Break, Smooth Talker and Double Take were
       in when they became reservations. What it still does not have is a
       retail price, a ship window or a physical sample, which is exactly what
       RESERVING is for.

       THE DESCRIPTOR IS THE PRODUCT'S, NOT THE BOARD'S. The board wrote
       "Hydrating Daily Cleanser" when the slot was a concept. The thing that
       exists is an oil-to-milk cleanser, so that is what the label and this
       record say. Naming it for a formula it does not have would be the same
       error as the invented "Cleanser · 150 mL" from the review build. */
    slug: "opening-line",
    name: "Opening Line",
    category: "Oil-To-Milk Cleanser",
    hook: "You can't control how the day opens.",
    what: "A gentle daily cleanser that turns from oil to milk on contact with water.",
    benefits: [
      "Turns from oil-gel to silky milk",
      "Dissolves make-up and impurities",
      "Leaves skin soft, never stripped",
    ],
    keyIngredients: ["Camomile", "Sea Buckthorn", "Cloudberry"],
    size: "150 ml / 5.07 fl oz",
    description:
      "A gentle daily cleanser for dry and delicate skin. The rich, oily texture turns to a silky milk on contact with water, dissolving make-up and impurities without stripping moisture from the skin.",
    detailCta: "Reserve Opening Line",
    reservationStatus: "Reservation — no charge and no ship date yet.",
    detailHero: {
      src: "/products/opening-line-plate.webp",
      alt: "The Opening Line bottle in rose and green stripes, alone under a single overhead light on dark stone.",
    },
    facts: [
      "COSMOS Organic certified by ECOCERT",
      "Dermatologically tested",
      "Vegan",
    ],
    cta: "Open the day",
    stripes: { a: "var(--color-rose)", b: "var(--color-founder-green)" },
    ink: "var(--color-founder-green)",
    pack: {
      src: "/products/opening-line-pack.webp",
      alt: "The Opening Line bottle: a white airless pump in desert rose and green stripes, its cream label reading Opening Line, oil-to-milk cleanser.",
    },
    scene: {
      src: "/products/opening-line-scene.webp",
      alt: "The Opening Line bottle standing alone on dark stone, lit from above.",
    },
    plainly:
      "Fragranced — a white-flower aroma with jasmine and sandalwood. Certified COSMOS Organic by ECOCERT, dermatologically tested, vegan. Suitable for sensitive skin.",
  },
  {
    slug: "clean-break",
    name: "Clean Break",
    category: "Purifying Face Wash",
    hook: "Ends it cleanly. No hard feelings.",
    what: "A gentle daily wash for blemish-prone skin.",
    benefits: [
      "Washes away impurities and excess oil",
      "pH-balanced, no harsh surfactants",
      "Rinses fresh",
    ],
    keyIngredients: ["Mate Leaf", "Iceland Moss", "Juniper Callus"],
    size: "140 ml / 4.73 fl oz",
    description:
      "A gentle daily face wash for blemish-prone skin. It washes away impurities and excess oil without harsh surfactants, leaving skin feeling fresh.",
    detailCta: "Reserve Clean Break",
    reservationStatus: "Reservation — no charge and no ship date yet.",
    detailHero: {
      src: "/products/clean-break-vanity.webp",
      alt: "The Clean Break bottle on a cream marble basin beside a running brass tap, a blush towel folded alongside, against a dark green wall.",
    },
    cta: "Start fresh",
    stripes: { a: "var(--color-cream)", b: "var(--color-founder-green)" },
    ink: "var(--color-founder-green)",
    pack: {
      src: "/products/clean-break-pack.webp",
      alt: "The Clean Break bottle: a white pump bottle in deep green and cream stripes, its cream label framed in green, reading Clean Break, purifying face wash.",
    },
    scene: {
      src: "/products/clean-break-scene.webp",
      alt: "The Clean Break bottle on a stone ledge against a dark green panelled wall, in low afternoon light.",
    },
    plainly:
      "Fragranced — a fresh green-tea aroma. Certified COSMOS Natural by ECOCERT. For blemish-prone skin; not an acne treatment.",
  },
  {
    slug: "smooth-talker",
    /* Named "Ceramide Tone Stick", not "colour-correcting" — the house
       spells British and US retail expects "color", so the concept doc
       sidesteps the collision rather than picking a losing side. */
    name: "Smooth Talker",
    category: "Ceramide Tone Stick",
    hook: "Smooths everything over.",
    what: "A creamy tone stick that evens the look of skin and lives in a pocket.",
    benefits: [
      "Evens the look of skin tone",
      "Supports the skin barrier",
      "Blends with fingertips",
    ],
    keyIngredients: ["Ceramides", "Cocoa Butter", "Vitamin E"],
    size: "12 g / 0.42 oz",
    /* Three shades. The 25 Aug set was a straight pack shot per shade;
       these replace it with the same three in use — stick and carton on a
       surface, the shade being blended in the mirror behind. Same file
       names and the same 1536x1024, so nothing downstream moves.

       Every carton was read at full resolution before import: SMOOTH TALKER
       / CERAMIDE TONE STICK, the right shade code, 12 g / 0.42 oz, and no
       SPF, sunscreen, broad-spectrum or UV wording anywhere on the pack.
       That rule covers these alt strings and metadata too, not just visible
       copy. */
    shades: [
      {
        code: "20",
        name: "Light",
        handle: "20-light",
        hero: {
          src: "/products/smooth-talker-20-light.webp",
          alt: "FOUNDER Smooth Talker Ceramide Tone Stick in 20 LIGHT beside its pale ivory and cream striped carton on a marble dressing table, a woman blending a swatch along her cheekbone in the mirror behind.",
        },
      },
      {
        code: "25",
        name: "Medium",
        handle: "25-medium",
        hero: {
          src: "/products/smooth-talker-25-medium.webp",
          alt: "FOUNDER Smooth Talker Ceramide Tone Stick in 25 MEDIUM beside its warm beige and cream striped carton on a brass side table, a swatch of the cream drawn beside it and a woman blending it along her cheek in the mirror behind.",
        },
      },
      {
        code: "35",
        name: "Deep",
        handle: "35-deep",
        hero: {
          src: "/products/smooth-talker-35-deep.webp",
          alt: "FOUNDER Smooth Talker Ceramide Tone Stick in 35 DEEP beside its espresso-brown and cream striped carton on a dark tray, a woman blending a swatch along her jaw in the mirror behind.",
        },
      },
    ],
    description:
      "A creamy tone-correcting stick that helps even the look of skin tone, supports the skin barrier and blends easily with fingertips for a natural-looking finish.",
    detailCta: "Reserve your shade",
    reservationStatus:
      "Reservation — three shades, no charge and no ship date yet.",
    /* Unused for this SKU: the detail page shows the SELECTED shade, so the
       hero comes from `shades[]`. Kept non-optional for the type, pointed at
       the default shade so nothing can render empty. */
    detailHero: {
      src: "/products/smooth-talker-25-medium.webp",
      alt: "FOUNDER Smooth Talker Ceramide Tone Stick in 25 MEDIUM beside its warm beige and cream striped carton on a brass side table.",
    },
    cta: "Make your move",
    stripes: { a: "var(--color-cream)", b: "var(--color-champagne)" },
    ink: "var(--color-founder-green)",
    pack: {
      src: "/products/smooth-talker-shades-closet.webp",
      alt: "The three Smooth Talker shades lined up in the FOUNDER dressing closet.",
    },
    /* The family shot leads now: a card showing one shade of a three-shade
       product tells a customer the wrong thing before she ever clicks. */
    scene: {
      src: "/products/smooth-talker-shades.webp",
      alt: "The FOUNDER Smooth Talker Ceramide Tone Stick shade range: 20 LIGHT, 25 MEDIUM and 35 DEEP.",
    },
    plainly:
      "Fragranced, with four declared allergens. Contains cocoa butter. Certified COSMOS Natural by ECOCERT.",
    sunNote:
      "Not a sunscreen. This stick contains mineral pigments, but we hold no SPF test for it and make no sun-protection claim. Wear your usual SPF underneath.",
  },
  {
    slug: "double-take",
    name: "Double Take",
    category: "Peptide Eye Cream",
    hook: "The first look is free. The second one is the point.",
    what: "A lightweight peptide cream for the delicate eye area.",
    benefits: [
      "Softens the look of fine lines",
      "Hydrates and smooths the look of skin",
      "Absorbs fast. Wears under makeup",
    ],
    keyIngredients: ["Hexapeptide-11", "Vitamin C", "Vitamin E"],
    size: "15 ml / 0.51 fl oz",
    description:
      "A hydrating peptide eye cream that helps the appearance of fine lines look softened and the eye area look smoother. Comfortable under makeup.",
    detailCta: "Reserve Double Take",
    reservationStatus: "Reservation — no charge and no ship date yet.",
    detailHero: {
      src: "/products/double-take-vanity.webp",
      alt: "The Double Take bottle and carton on a cream vanity beside a lit dressing-room mirror, with a blush dressing room beyond.",
    },
    facts: [
      "COSMOS Natural certified by ECOCERT Greenlife",
      "99% natural origin",
      "Vegan",
    ],
    cta: "Make them look twice",
    stripes: { a: "var(--color-blush)", b: "var(--color-rose)" },
    ink: "var(--color-founder-green)",
    pack: {
      src: "/products/double-take-pack.webp",
      alt: "The Double Take airless pump bottle and its carton in blush and rose stripes, the cream label reading Double Take, peptide eye cream.",
    },
    scene: {
      src: "/products/double-take-scene.webp",
      alt: "The Double Take bottle and carton on a round plaster plinth against a blush wall, in soft light.",
    },
    plainly:
      "Fragranced — a rose-geranium scent, with five declared allergens. Worth knowing for an eye-area product. Certified COSMOS Natural by ECOCERT, 99% natural origin, vegan.",
  },
];

/**
 * The campaign line.
 *
 * "THE NEXT ROOM IS OPEN." was retired on Shelby's call, 24 Aug: the board's
 * protected lockup OPEN THE DOOR. / THE ROOM IS YOURS. stays the only room
 * line in circulation. This campaign takes the door instead of the room —
 * these three products are the twenty minutes before the entrance, which is
 * a different moment from the one the lockup owns.
 */
export const CAMPAIGN = {
  name: "The Next Move",
  /**
   * WHO IS ACTUALLY IN THE CAMPAIGN. `NEXT_MOVE` is every product that takes a
   * reservation; THE NEXT MOVE is the three-product campaign shot in August,
   * and its page is built on the number three — "Three moves.", a triad of
   * three verbs, a hero of three packs and a flatlay of three cartons.
   *
   * Opening Line joined the array on 30 Aug but not the campaign. Letting it
   * fall through would have rendered a fourth card under a headline that says
   * three and beside a photograph of three bottles — the same drift this file
   * exists to catch.
   */
  slugs: ["clean-break", "smooth-talker", "double-take"] as const,
  headline: "Before the door opens.",
  standfirst:
    "Three new essentials for the part nobody sees — the twenty minutes before you walk in.",
  triad: [
    "Clean Break resets.",
    "Smooth Talker evens.",
    "Double Take makes them look twice.",
  ],
  /* The card in the campaign photography reads THREE MOVES. ONE ROOM. — the
     second half goes with the retired line. This is the replacement. */
  card: "Three moves.",
  hero: {
    src: "/editorial/next-move-hero.webp",
    alt: "The three FOUNDER packs — Double Take in blush stripes, Smooth Talker in champagne, Clean Break in green — on a stone counter in a dark green panelled room, an archway open behind them.",
  },
  /* Cropped above the campaign card in the supplied flat lay: that card still
     reads THREE MOVES. ONE ROOM. and the room line was retired 25 Aug. */
  flatlay: {
    src: "/editorial/next-move-flatlay.webp",
    alt: "The three packs and their cartons arranged on a dark green folio with a rose silk ribbon and a brass key, in raking sunlight.",
  },
};
