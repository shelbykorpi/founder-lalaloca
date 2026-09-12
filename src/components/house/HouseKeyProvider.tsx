"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { EMPTY_KEY, readKey, visit, writeKey, type HouseKey } from "@/lib/houseKey";
import { OPEN_WINGS, wingFor } from "@/lib/house";
import { track } from "@/lib/analytics";

/**
 * The Founder Key as a small external store — read with
 * useSyncExternalStore, written by the house as she moves through it. An
 * external store rather than React state so the provider can record a
 * visit inside an effect without setting state there, and so any component
 * (the key, the map, later the vanity's "add to vanity") reads one truth.
 */
type Snapshot = { key: HouseKey; note: string | null; ready: boolean };

let snapshot: Snapshot = { key: EMPTY_KEY, note: null, ready: false };
const SERVER: Snapshot = snapshot;
const listeners = new Set<() => void>();
let noteTimer: number | null = null;

function emit(next: Snapshot) {
  snapshot = next;
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
function getSnapshot() {
  return snapshot;
}
function getServerSnapshot() {
  return SERVER;
}

export function hydrateKey() {
  if (snapshot.ready) return;
  emit({ key: readKey(), note: null, ready: true });
}

export function visitWing(slug: string) {
  const { key: next, note } = visit(snapshot.key, slug, OPEN_WINGS.length);
  if (next === snapshot.key && !note) return;
  writeKey(next);
  emit({ ...snapshot, key: next, note: note ?? snapshot.note });
  if (note) {
    track("house_key_note", { note, rooms: next.roomsVisited.length });
    if (noteTimer) window.clearTimeout(noteTimer);
    noteTimer = window.setTimeout(dismissNote, 5200);
  }
}

export function dismissNote() {
  if (!snapshot.note) return;
  emit({ ...snapshot, note: null });
}

export function useHouseKey(): Snapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Mounted once in the layout: hydrates the key and records each wing she stands in. */
export function HouseKeyProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  useEffect(() => {
    hydrateKey();
    const wing = wingFor(pathname ?? "/", window.location.hash);
    if (wing && !wing.locked) visitWing(wing.slug);
  }, [pathname]);
  return <>{children}</>;
}
