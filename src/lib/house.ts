/**
 * THE HOUSE MAP — the wings a visitor chooses between.
 *
 * 12 September 2026. `rooms.ts` is the walking order: seven rooms, one loop,
 * the rail and the doors read it. This file is the map view of the same
 * house — what the Founder Key opens — grouped the way a guest thinks about
 * a residence: the hall, the vanity, the boardroom, the gallery, the
 * library, the salon. Same routes, so "You are here" is always true.
 *
 * Every wing is a real page (or an anchor on one). The map never intercepts
 * routing; it is a door, not a level select.
 */

export type Wing = {
  slug: string;
  /** The brass plaque. */
  plaque: string;
  /** One line under it, in the house voice. */
  line: string;
  href: string;
  /** Locked wings show their door and say who it is for. */
  locked?: boolean;
  /** Which pathnames stand inside this wing. */
  matches: (pathname: string, hash: string) => boolean;
  /** Where the plaque sits on the plan, as % of the plan's width/height. */
  plan: { x: number; y: number; w: number; h: number };
};

export const WINGS: Wing[] = [
  {
    slug: "hall",
    plaque: "The Grand Hall",
    line: "Come in. Stay awhile.",
    href: "/#room-house",
    matches: (p, h) => p === "/" && h !== "#room-collection",
    plan: { x: 32, y: 36, w: 36, h: 28 },
  },
  {
    slug: "vanity",
    plaque: "The Vanity",
    line: "The twenty minutes before you walk in.",
    href: "/shop",
    matches: (p, h) =>
      p === "/shop" ||
      p.startsWith("/products/") ||
      p.startsWith("/find-your-serum") ||
      (p === "/" && h === "#room-collection"),
    plan: { x: 2, y: 4, w: 28, h: 30 },
  },
  {
    slug: "boardroom",
    plaque: "The Boardroom",
    line: "Take the head of the table.",
    href: "/founder-collection",
    matches: (p) => p === "/founder-collection" || p.startsWith("/the-next-move"),
    plan: { x: 70, y: 4, w: 28, h: 30 },
  },
  {
    slug: "gallery",
    plaque: "Found Her",
    line: "The women who did it first.",
    href: "/found-her",
    matches: (p) => p.startsWith("/found-her") || p === "/our-story",
    plan: { x: 2, y: 66, w: 28, h: 30 },
  },
  {
    slug: "library",
    plaque: "The Library",
    line: "Read the label. Then decide.",
    href: "/library",
    matches: (p) => p.startsWith("/library"),
    plan: { x: 70, y: 66, w: 28, h: 30 },
  },
  {
    slug: "young-founders",
    plaque: "Young Founders’ Room",
    line: "Pull up a chair.",
    href: "/young-founders-room",
    matches: (p) => p === "/young-founders-room",
    plan: { x: 32, y: 4, w: 36, h: 30 },
  },
  {
    slug: "salon",
    plaque: "The Salon",
    line: "By invitation.",
    href: "/salon",
    locked: true,
    matches: (p) => p === "/salon",
    plan: { x: 32, y: 66, w: 36, h: 30 },
  },
];

export function wingFor(pathname: string, hash = ""): Wing | null {
  return WINGS.find((w) => w.matches(pathname, hash)) ?? null;
}

/** Wings a guest can actually enter today. */
export const OPEN_WINGS = WINGS.filter((w) => !w.locked);
