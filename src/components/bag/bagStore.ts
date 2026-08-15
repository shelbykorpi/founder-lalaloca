export type BagLine = {
  id: string;
  name: string;
  category: string;
  price: number;
  size: string;
  image: string;
  href: string;
  quantity: number;
};

/**
 * Bumped v1 -> v2 when serum prices moved from $29.99 to $39.99.
 * Bumped v2 -> v3 when serum prices moved to $38.00 and the trio to $98.00
 * (matched to Shopify, 15 Aug 2026).
 *
 * A bag line stores the price it was added at. Anyone holding a v1 bag would
 * have seen $29.99 in the drawer and then been charged $39.99 at Shopify —
 * so the old key is abandoned rather than migrated. Bump this again on any
 * future price change.
 */
const STORAGE_KEY = "lalaloca.bag.v3";
const EMPTY: BagLine[] = [];

/**
 * The bag lives in localStorage, which is external state — so it is exposed
 * through a small store and read with useSyncExternalStore. That keeps the
 * server render empty, hydrates without a mismatch, and stays in step across
 * browser tabs.
 */
let lines: BagLine[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function read(): BagLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as BagLine[]) : EMPTY;
    return Array.isArray(parsed) ? parsed : EMPTY;
  } catch {
    /* a corrupt or unavailable bag must never break the site */
    return EMPTY;
  }
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  lines = read();
  loaded = true;
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    /* storage may be unavailable in private modes */
  }
}

function set(next: BagLine[]) {
  lines = next;
  persist();
  listeners.forEach((listener) => listener());
}

function onStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY) return;
  lines = read();
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void) {
  ensureLoaded();
  if (listeners.size === 0) window.addEventListener("storage", onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

export function getSnapshot(): BagLine[] {
  ensureLoaded();
  return lines;
}

export function getServerSnapshot(): BagLine[] {
  return EMPTY;
}

export function addLine(line: Omit<BagLine, "quantity">, quantity = 1) {
  const existing = getSnapshot().find((l) => l.id === line.id);
  set(
    existing
      ? getSnapshot().map((l) =>
          l.id === line.id ? { ...l, quantity: l.quantity + quantity } : l,
        )
      : [...getSnapshot(), { ...line, quantity }],
  );
}

export function setLineQuantity(id: string, quantity: number) {
  set(
    quantity <= 0
      ? getSnapshot().filter((l) => l.id !== id)
      : getSnapshot().map((l) => (l.id === id ? { ...l, quantity } : l)),
  );
}

export function removeLine(id: string) {
  set(getSnapshot().filter((l) => l.id !== id));
}
