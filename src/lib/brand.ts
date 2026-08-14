/**
 * Single source of truth for brand naming, message hierarchy and navigation.
 *
 * Brand layers — keep these distinct everywhere:
 *   display   FOUNDER            the master brand
 *   collection LALALOCA          the skincare collection sold under it
 *   editorial FOUND HER          the stories platform
 *   trading   FOUNDER            the name on the order, receipt and packaging
 *
 * CHANGED 6 Aug 2026: the Shopify store is named FOUNDER, so FOUNDER is what
 * prints on receipts and confirmation emails. This file was updated to match —
 * previously it named LALALOCA as the seller and the site contradicted the
 * receipt.
 *
 * TWO REAL-WORLD JOBS THIS FILE CANNOT DO:
 *   1. FOUNDER still needs trademark clearance. It is now the trading name on
 *      customer receipts, which is a higher bar than a visible brand name.
 *   2. The registered entity behind the Shopify account is still called
 *      "vercel-store-5078d3d6 - entity". That name appears on tax and payout
 *      paperwork regardless of anything here. Rename it in Shopify → Settings
 *      → General → Business details.
 */

export const BRAND = {
  display: "FOUNDER",
  collection: "LALALOCA",
  collectionFull: "The LALALOCA Collection",
  editorial: "FOUND HER",

  /**
   * The name customers see as the seller — on the checkout header, the order
   * confirmation, the receipt and the packaging. Must stay identical to the
   * Shopify store name, or the site and the receipt disagree.
   */
  legal: {
    name: "FOUNDER",
    note: "FOUNDER is the trading name on your order, receipt and packaging. LALALOCA is the name of the serum collection.",
  },

  /** Structural line — what the customer needs to understand in one read. */
  structure: "FOUNDER presents the LALALOCA Collection.",

  /**
   * The door mark: the F-key. v2.13 makes it the secondary identifier — the
   * compact one — while the master lockup is FOUNDER over BEAUTY. Set normally
   * on the left leaf and mirrored on the right, the pair faces the seam, so it
   * reads as one piece when the doors are shut and parts as they open.
   *
   * Was "L" until 11 August 2026, with a comment describing a mark that is no
   * longer the mark.
   */
  monogram: "F",

  /** Message hierarchy. Each line has one job. Do not stack them together. */
  /**
   * v3.0 campaign line. ALWAYS set stacked on these two lines — a single-line
   * setting is prohibited by the Master Brand Board, not discouraged.
   */
  campaignLines: ["Open the Door.", "The Room Is Yours."],
  tagline: "Beauty for what you’re building.",
  belief: "Every woman is the founder of something.",
  campaign: "You didn’t become her. You found her.",
  question: "When did you find her?",
  supporting: "Be seen. Be heard. Look good doing it.",
} as const;

export const PRIMARY_NAV = [
  /* The collaboration lockup. `stack` is the three centred lines the desktop
     bar shows; `label` is the one-line version the mobile menu uses and the
     accessible name a screen reader hears, because a multiplication sign read
     aloud between two proper nouns is not a sentence. */
  {
    href: "/shop",
    label: "LALALOCA Collection and StandUp for Kids",
    stack: ["LALALOCA", "\u00d7", "StandUp for Kids"],
  },
  { href: "/our-story", label: "Our Story" },
  { href: "/found-her", label: "Found Her" },
  { href: "/young-founders-room", label: "Young Founders\u2019 Room" },
  { href: "/share-your-story", label: "Share Your Story" },
];

export const FOOTER_NAV = [
  {
    heading: "Shop",
    links: [
      { href: "/shop", label: "The LALALOCA Collection" },
      { href: "/products/thirst-trap", label: "Thirst Trap" },
      { href: "/products/c-me-glow", label: "C Me Glow" },
      { href: "/products/bounce-back", label: "Bounce Back" },
      { href: "/find-your-serum", label: "Which serum?" },
    ],
  },
  {
    heading: "Read",
    links: [
      { href: "/found-her", label: "Found Her" },
      { href: "/our-story", label: "Our Story" },
      { href: "/share-your-story", label: "Share Your Story" },
    ],
  },
  {
    heading: "Help",
    links: [
      { href: "/policies/shipping", label: "Shipping" },
      { href: "/policies/returns", label: "Returns" },
      { href: "/account", label: "Account" },
      { href: "/search", label: "Search" },
      { href: "/policies/accessibility", label: "Accessibility" },
    ],
  },
];

/**
 * Homepage hero image.
 *
 * Composition this layout is tuned for: 16:9, subject on the right third,
 * near-black on the left so the headline sits on the photograph without a heavy
 * scrim over her face.
 *
 * Install a new one with `./scripts/set-hero.sh <file>`, then set
 * `approved: true` to remove the placeholder note under the hero.
 */
export const HERO = {
  src: "/editorial/hero-open-door.webp",
  alt: "A woman at the edge of an open door, her hand on its brass frame, warm light across her face. A brass F hangs on the deep green wall behind her.",
  approved: true,
  placeholderNote:
    "Placeholder image · run ./scripts/set-hero.sh to install the approved campaign photograph",
};

/**
 * Canonical origin, resolved at build time.
 *
 * Set NEXT_PUBLIC_SITE_URL once the real domain is attached. Until then Vercel
 * supplies the deployment URL, so canonicals, OG tags and the sitemap point at
 * the site that is actually serving them rather than a domain we do not own.
 */
function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_ENV === "production") {
    return "https://www.founderbeauty.co";
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const SITE = {
  url: resolveSiteUrl(),
  /**
   * Search engines are kept out until this is switched on deliberately.
   * At launch: `vercel env add ALLOW_INDEXING production` with the value "true".
   * Everything stays reachable by link either way — this only controls crawlers.
   */
  indexable:
    process.env.VERCEL_ENV === "production" && process.env.ALLOW_INDEXING === "true",
  title: "FOUNDER | Beauty for what you’re building.",
  description:
    "Skincare for women creating a life that looks and feels like their own. Three serums in the LALALOCA Collection, and stories from women about what they built.",
};
