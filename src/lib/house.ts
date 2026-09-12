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
 * routing; it is a door, not a level select. 12 Sept, second pass — Shelby:
 * "lines and boxes" are not this house. The map is now a hall of the house's
 * own doors, each one showing its room through the opening.
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
  /** What is seen through this wing's door on the map — its own room, portrait crop. */
  door: string;
};

export const WINGS: Wing[] = [
  {
    slug: "hall",
    plaque: "The Grand Hall",
    line: "Come in. Stay awhile.",
    href: "/#room-house",
    matches: (p, h) => p === "/" && h !== "#room-collection",
    door: "/editorial/rooms/inside-founder-lounge-m.webp",
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
    door: "/editorial/rooms/serum-salon-alcoves-m.webp",
  },
  {
    slug: "boardroom",
    plaque: "The Boardroom",
    line: "Take the head of the table.",
    href: "/founder-collection",
    matches: (p) => p === "/founder-collection" || p.startsWith("/the-next-move"),
    door: "/editorial/rooms/collection-boardroom-open-m.webp",
  },
  {
    slug: "gallery",
    plaque: "Found Her",
    line: "The women who did it first.",
    href: "/found-her",
    matches: (p) => p.startsWith("/found-her") || p === "/our-story",
    door: "/editorial/rooms/found-her-hall-pink-m.webp",
  },
  {
    slug: "library",
    plaque: "The Library",
    line: "Read the label. Then decide.",
    href: "/library",
    matches: (p) => p.startsWith("/library"),
    door: "/editorial/rooms/library-shelves-m.webp",
  },
  {
    slug: "young-founders",
    plaque: "Young Founders’ Room",
    line: "Pull up a chair.",
    href: "/young-founders-room",
    matches: (p) => p === "/young-founders-room",
    door: "/editorial/rooms/young-founders-fireplace-m.webp",
  },
  {
    slug: "salon",
    plaque: "The Salon",
    line: "By invitation.",
    href: "/salon",
    locked: true,
    matches: (p) => p === "/salon",
    door: "/editorial/rooms/threshold-doors-m.webp",
  },
];

export function wingFor(pathname: string, hash = ""): Wing | null {
  return WINGS.find((w) => w.matches(pathname, hash)) ?? null;
}

/** Wings a guest can actually enter today. */
export const OPEN_WINGS = WINGS.filter((w) => !w.locked);
