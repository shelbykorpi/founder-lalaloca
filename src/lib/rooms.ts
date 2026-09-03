/**
 * THE HOUSE — seven rooms, one loop.
 *
 * 3 September 2026. The site is walked as a sequence of rooms rather than a
 * set of pages, and this file is the floor plan every house component reads:
 * the room's number and name, the route it lives on, the frame that is its
 * hero, the purpose-built portrait crop for phones, and which room the doors
 * at the end of the page open onto.
 *
 * TWO IMAGE SETS WENT INTO THE FRAMES. Shelby's first set fixed the copy,
 * type hierarchy, buttons and pacing; her refined set fixed the doors —
 * deep FOUNDER emerald, brass hardware, the gold F on each leaf — and what
 * is seen through each doorway: always the actual next room, never a pink
 * void. Desert pink is light in this house (sky, silk, reflected glow), not
 * a colour a door is painted. Every frame in `public/editorial/rooms/` had
 * its mock-up type removed before import; the copy is HTML.
 *
 * ROOM 02 IS A BEAT, NOT A ROUTE. The fireplace lounge is where "Enter the
 * house" resolves on the homepage, so its `href` is an anchor. Room 07's
 * doors return to it, which closes the loop.
 */

export type Room = {
  /** 1–7. */
  number: number;
  /** Stable key used for data-attributes, ids and analytics. */
  slug: string;
  /** Rail label — the two-digit number is added by the components. */
  name: string;
  /** Where the room lives. Anchors are allowed (Room 02). */
  href: string;
  /** Match the current pathname to a room. Anchors match their page. */
  pathname: string;
  /** The wide frame (landscape, ≈1672 wide). */
  hero: { src: string; alt: string; position?: string };
  /** The purpose-built phone crop (portrait 3:4). */
  heroMobile: { src: string; position?: string };
  /** What the doors at the end of this page open onto. */
  through: string;
};

export const ROOMS: Room[] = [
  {
    number: 1,
    slug: "threshold",
    name: "The Threshold",
    href: "/",
    pathname: "/",
    hero: {
      src: "/editorial/rooms/threshold-doors.webp",
      alt: "Two tall emerald doors, a brass F on each leaf, standing open onto a firelit sitting room in the FOUNDER house.",
      position: "58% center",
    },
    heroMobile: { src: "/editorial/rooms/threshold-doors-m.webp" },
    through: "The fire’s lit and someone kept your seat. Come in.",
  },
  {
    number: 2,
    slug: "lounge",
    name: "Inside FOUNDER",
    href: "/#room-house",
    pathname: "/",
    hero: {
      src: "/editorial/rooms/inside-founder-lounge.webp",
      alt: "The FOUNDER sitting room: a green velvet sofa by a marble fireplace, a cream blazer over its arm, and through the open emerald doors the lit serum shelves in teal, gold and red.",
      position: "64% center",
    },
    heroMobile: { src: "/editorial/rooms/inside-founder-lounge-m.webp" },
    through: "Three lights through the next doors. Pick the one that’s yours.",
  },
  {
    number: 3,
    slug: "salon",
    name: "The Serum Salon",
    href: "/shop",
    pathname: "/shop",
    hero: {
      src: "/editorial/rooms/serum-salon-doors.webp",
      alt: "The serum salon: three lit marble niches in teal, gold and red, one bottle in each, over a black marble counter, the dressing-room mirrors glowing through the emerald doors either side.",
      position: "center center",
    },
    heroMobile: { src: "/editorial/rooms/serum-salon-doors-m.webp" },
    through: "The boardroom is through the doors. Take the head of the table.",
  },
  {
    number: 4,
    slug: "collection",
    name: "The FOUNDER Collection",
    href: "/founder-collection",
    pathname: "/founder-collection",
    hero: {
      src: "/editorial/rooms/collection-study.webp",
      alt: "The FOUNDER Collection boardroom: a long black marble table set with striped packs at every seat, the emerald doors at the head open onto a lamplit study lined with books.",
      position: "52% center",
    },
    heroMobile: { src: "/editorial/rooms/collection-study-m.webp" },
    through: "Past the table, a desk that was never for show.",
  },
  {
    number: 5,
    slug: "story",
    name: "Our Story",
    href: "/our-story",
    pathname: "/our-story",
    hero: {
      src: "/editorial/rooms/our-story-desk-portraits.webp",
      alt: "The founder's study: an open journal and fountain pen under a brass task lamp on a dark marble desk, her portrait on the wall, the emerald doors open onto the FOUND HER gallery beyond.",
      position: "60% center",
    },
    heroMobile: { src: "/editorial/rooms/our-story-desk-portraits-m.webp" },
    through: "The doors open onto the women who did it first. You’re in good company.",
  },
  {
    number: 6,
    slug: "gallery",
    name: "Found Her",
    href: "/found-her",
    pathname: "/found-her",
    hero: {
      src: "/editorial/rooms/found-her-hall-pink.webp",
      alt: "The FOUND HER gallery: gilt-framed portraits of women down a dark marble hall, sconces lit between them, a doorway at the far end open onto a soft desert-pink sky — the light from the next room.",
      position: "58% center",
    },
    heroMobile: { src: "/editorial/rooms/found-her-hall-pink-m.webp" },
    through: "At the end of the hall, the work is still on the table. Pull up a chair.",
  },
  {
    number: 7,
    slug: "young-founders",
    name: "The Young Founders’ Room",
    href: "/young-founders-room",
    pathname: "/young-founders-room",
    hero: {
      src: "/editorial/rooms/young-founders-fireplace.webp",
      alt: "A long table in the FOUNDER house covered in LALALOCA bottles, swatches, notebooks and a guitar, young hands at work along it, the emerald doors open onto the firelit lounge.",
      position: "66% center",
    },
    heroMobile: { src: "/editorial/rooms/young-founders-fireplace-m.webp" },
    through: "The last doors lead back to the fire. You know the way now.",
  },
];

export function getRoom(slugOrNumber: string | number): Room {
  const room = ROOMS.find((r) =>
    typeof slugOrNumber === "number" ? r.number === slugOrNumber : r.slug === slugOrNumber,
  );
  if (!room) throw new Error(`No room ${slugOrNumber}`);
  return room;
}

/** The room after this one; Room 07 loops to Room 02. */
export function nextRoom(room: Room): Room {
  return room.number === 7 ? getRoom(2) : getRoom(room.number + 1);
}

export function prevRoom(room: Room): Room {
  return room.number === 1 ? getRoom(7) : getRoom(room.number - 1);
}

export function roomForPathname(pathname: string): Room | null {
  const exact = ROOMS.find((r) => r.number !== 2 && r.pathname === pathname);
  if (exact) return exact;
  /* Product pages belong to the room that sells them. */
  if (pathname.startsWith("/products/") || pathname.startsWith("/find-your-serum")) return getRoom(3);
  if (pathname.startsWith("/the-next-move")) return getRoom(4);
  if (pathname.startsWith("/found-her/")) return getRoom(6);
  return null;
}

export const roomLabel = (room: Room) => `${String(room.number).padStart(2, "0")} · ${room.name}`;
