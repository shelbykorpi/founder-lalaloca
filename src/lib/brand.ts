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
    note: "FOUNDER is the name on your order. LALALOCA is the name of the collection.",
  },

  /** Structural line — what the customer needs to understand in one read. */
  structure: "FOUNDER presents the LALALOCA Collection.",

  /**
   * The announcement bar. 3 Sept 2026: the bar used to carry `structure`,
   * which explains the brand to itself. Every billion-dollar beauty site puts
   * the offer there instead — shipping, price, the set — because it is the
   * one line every visitor reads on every page. Facts only: free US shipping
   * is the published policy, $38 and $98 are the Shopify prices.
   */
  bar: "Free US shipping on every order · Three serums, $38 each · All three for $98",
  /**
   * The same bar in the FOUNDER Collection's rooms (17 Sept 2026, audit
   * F-14): a $34–$46 plate with another line's price list over it read as
   * someone else's shop. Shipping is the fact both lines share; the second
   * half names the line she is standing in.
   */
  barCollection: "Free US shipping on every order · The FOUNDER Collection is here · Ships in one business day",

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

/* `stack` is the centred two-line lockup the desktop bar draws for a tab;
   `label` stays the one-line version the mobile menu shows and the accessible
   name a screen reader hears. 11 Sept 2026, Shelby: every tab is stacked —
   "Shop" over "The Serums", "The FOUNDER" over "Collection" — because six
   one-line tabs read as a run of small caps with no air between them. Break
   each name where it would break if you said it aloud: the verb or article
   on top, the noun underneath. */
export const SHOP_NAV = [
  { href: "/founder-collection", label: "The FOUNDER Collection", note: "Five pieces · cleanse to finish" },
  { href: "/shop", label: "The LALALOCA Collection", note: "Three serums · three kinds of day" },
] as const;

export const PRIMARY_NAV: { href: string; label: string; stack?: string[] }[] = [
  { href: "/found-her", label: "Found Her", stack: ["Found", "Her"] },
  { href: "/our-story", label: "Our Story", stack: ["Our", "Story"] },
  { href: "/young-founders-room", label: "Young Founders’ Room", stack: ["Young Founders’", "Room"] },
  { href: "/library", label: "The Library", stack: ["The", "Library"] },
];

/** The house's Instagram (Shelby, 1 Oct 2026). Footer link + Organization sameAs. */
export const INSTAGRAM = {
  handle: "@founder_beauty",
  url: "https://www.instagram.com/founder_beauty/",
} as const;

export const FOOTER_NAV = [
  {
    heading: "Shop",
    links: [
      { href: "/shop", label: "The LALALOCA Collection" },
      { href: "/founder-collection", label: "The FOUNDER Collection" },
      { href: "/shop#set-heading", label: "The House Trio · $98" },
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
      { href: "/found-her#share", label: "Share Your Story" },
      { href: "/library", label: "The Library" },
    ],
  },
  {
    heading: "Help",
    links: [
      { href: "/policies/shipping", label: "Shipping" },
      { href: "/policies/returns", label: "Returns" },
      { href: "/search", label: "Search" },
      { href: "/policies/accessibility", label: "Accessibility" },
    ],
  },
];

/**
 * Homepage hero image.
 *
 * Composition this layout is tuned for: 16:9, the open doors centred, dark
 * marble either side so the headline sits on the left wall under a soft shade
 * (30 Sept 2026: the front hall replaced the two-women threshold).
 *
 * Install a new one with `./scripts/set-hero.sh <file>`, then set
 * `approved: true` to remove the placeholder note under the hero.
 */
export const HERO = {
  src: "/editorial/rooms/threshold-hall.webp",
  alt: "Tall Founder Green double doors, a brass F on each leaf, standing open onto a rose-lit salon in the FOUNDER house.",
  approved: true,
  placeholderNote:
    "Placeholder image · run ./scripts/set-hero.sh to install the approved campaign photograph",
};

/**
 * The address a woman writes to.
 *
 * WHY IT IS HERE AND NOT IN NINE STRINGS. Before this existed the site told
 * people to "write to us" or "email us and we'll send the supplier sheet" in
 * nine separate places and never once said where. That is worse than saying
 * nothing: it promises a person at the other end and then hides them. One
 * constant means the address is correct everywhere or wrong everywhere, and
 * changing it is one line rather than a search-and-replace across copy.
 *
 * IT MUST FORWARD SOMEWHERE REAL. shelby@founderbeauty.co only exists as long
 * as the domain's MX records point at a forwarder — see docs/EMAIL_SETUP.md.
 * Publishing an address that bounces is the one failure mode worse than
 * publishing none, so verify the forwarding before shipping a change here.
 *
 * The env var lets a preview deployment point somewhere harmless without a code
 * change; the fallback is what production actually uses.
 */
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "shelby@founderbeauty.co";

/** For `href={CONTACT_MAILTO}`. */
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;

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
    "A private world for women who already know what they bring. Three serums, a five-piece routine, free US shipping, and stories from women about what they built.",
};
