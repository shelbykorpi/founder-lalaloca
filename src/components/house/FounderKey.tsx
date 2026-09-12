"use client";

import { useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useHouseKey } from "./HouseKeyProvider";
import { HouseMap } from "./HouseMap";
import { OPEN_WINGS, wingFor } from "@/lib/house";
import { track } from "@/lib/analytics";
import s from "./founder-key.module.css";

/**
 * THE FOUNDER KEY — the one control that follows her through the house.
 *
 * A small brass key, fixed at the foot of the screen. Press it and the
 * House Map opens: seven plaques on a plan, "You are here", the Salon
 * locked. It sits where the phone's room pill used to sit, so a phone has
 * one house control, not two; on desktop the room rail stays on the right
 * and the key on the left.
 *
 * When the key has something to say — "Another door has opened." — it says
 * it here, once, in a small line beside the key, and then it is quiet.
 */
export function FounderKey() {
  const pathname = usePathname();
  const { key, note, ready } = useHouseKey();
  /* The map remembers which page it was opened on, so a route change closes
     it without an effect: the map is a door, and she has gone through it. */
  const [opened, setOpened] = useState<{ on: string; open: boolean }>({ on: "", open: false });
  const open = opened.open && opened.on === pathname;
  const button = useRef<HTMLButtonElement>(null);
  const mapId = useId();
  const here = wingFor(pathname ?? "/", "");
  const found = key.roomsVisited.length;

  const setOpen = (v: boolean) => setOpened({ on: pathname ?? "", open: v });
  const toggle = () => {
    if (!open) track("house_map_open", { from: here?.slug ?? "unknown", rooms: found });
    setOpen(!open);
  };

  return (
    <>
      <div className={s.dock}>
        {note && (
          <p className={s.note} role="status">
            {note}
          </p>
        )}
        <button
          ref={button}
          type="button"
          className={s.key}
          aria-expanded={open}
          aria-controls={mapId}
          aria-label={open ? "Close the house map" : "Open the house map"}
          onClick={toggle}
        >
          <KeyGlyph />
          <span className={s.label}>
            <span className={s.labelTop}>{here ? here.plaque : "The House"}</span>
            {ready && (
              <span className={s.labelSub}>
                {found} of {OPEN_WINGS.length} rooms
              </span>
            )}
          </span>
        </button>
      </div>
      <HouseMap
        id={mapId}
        open={open}
        onClose={() => {
          setOpen(false);
          button.current?.focus();
        }}
        here={here?.slug ?? null}
        found={key.roomsVisited}
      />
    </>
  );
}

/* A key drawn in strokes, not the F-key monogram — the board bars redrawing
   the monogram, and a key beside a plaque needs to read as hardware. */
function KeyGlyph() {
  return (
    <svg viewBox="0 0 28 14" aria-hidden className={s.glyph}>
      <circle cx="6" cy="7" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10.2 7h16M22 7v3.4M25.4 7v2.4M18.6 7v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}
