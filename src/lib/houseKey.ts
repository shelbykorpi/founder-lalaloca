/**
 * THE FOUNDER KEY — what the house remembers about her.
 *
 * 12 September 2026. Staged on purpose. There is no login on this site and
 * this file does not add one; it defines the shape a customer account or an
 * auth layer would hydrate later, and keeps it in localStorage until then.
 * Everything in it is derivable from her own visit — rooms she has stood
 * in, products she saved — nothing is sent anywhere.
 *
 * Recognition is private-club, not points: the key surfaces a line when a
 * door opens, once, quietly. No XP, no streaks, no confetti (brief §11).
 */

export type Tier = "guest" | "keyholder" | "founding" | "house";

export type HouseKey = {
  /** Wing slugs she has stood in, in the order she found them. */
  roomsVisited: string[];
  /** Product slugs she set aside on the vanity. */
  savedProducts: string[];
  /** Found Her story slugs she kept. */
  storiesSaved: string[];
  /** Invitations extended to her (Salon, launches, events). Empty until Phase 3. */
  invitations: string[];
  tier: Tier;
  /** Recognition lines already shown, so each is said once. */
  notesSeen: string[];
  firstVisit: string;
  lastVisit: string;
};

export const KEY_STORAGE = "founder:key:v1";

export const EMPTY_KEY: HouseKey = {
  roomsVisited: [],
  savedProducts: [],
  storiesSaved: [],
  invitations: [],
  tier: "guest",
  notesSeen: [],
  firstVisit: "",
  lastVisit: "",
};

/* The lines the key can say. Each is said once. They are in the approved
   bank's register — the house recognises, it never rewards. */
export const KEY_NOTES = {
  firstDoor: "Another door has opened.",
  thirdRoom: "You found another key.",
  allRooms: "You know the way now.",
  noteWaiting: "A note was left for you.",
} as const;

export function readKey(): HouseKey {
  if (typeof window === "undefined") return EMPTY_KEY;
  try {
    const raw = window.localStorage.getItem(KEY_STORAGE);
    if (!raw) return EMPTY_KEY;
    const parsed = JSON.parse(raw) as Partial<HouseKey>;
    return { ...EMPTY_KEY, ...parsed };
  } catch {
    return EMPTY_KEY;
  }
}

export function writeKey(key: HouseKey) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY_STORAGE, JSON.stringify(key));
  } catch {
    /* private mode, blocked storage — the key simply does not persist */
  }
}

/** Marks a wing as found. Returns the note to say, if a new one is due. */
export function visit(key: HouseKey, wing: string, openCount: number): { key: HouseKey; note: string | null } {
  const now = new Date().toISOString();
  const already = key.roomsVisited.includes(wing);
  const roomsVisited = already ? key.roomsVisited : [...key.roomsVisited, wing];
  const next: HouseKey = {
    ...key,
    roomsVisited,
    firstVisit: key.firstVisit || now,
    lastVisit: now,
  };
  if (already) return { key: next, note: null };
  const n = roomsVisited.length;
  let note: string | null = null;
  if (n >= openCount && !next.notesSeen.includes(KEY_NOTES.allRooms)) note = KEY_NOTES.allRooms;
  else if (n === 3 && !next.notesSeen.includes(KEY_NOTES.thirdRoom)) note = KEY_NOTES.thirdRoom;
  else if (n === 2 && !next.notesSeen.includes(KEY_NOTES.firstDoor)) note = KEY_NOTES.firstDoor;
  if (note) next.notesSeen = [...next.notesSeen, note];
  return { key: next, note };
}
