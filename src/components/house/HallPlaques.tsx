"use client";

import Link from "next/link";
import { WINGS } from "@/lib/house";
import { useHouseKey } from "@/components/house/HouseKeyProvider";
import { track } from "@/lib/analytics";
import s from "./hall.module.css";

/**
 * THE GRAND HALL — the doors off it, 12 September 2026 (brief §4).
 *
 * The lounge was the room "Enter the house" resolved to, and then it was a
 * dead end: one hairline reading "Follow the light ↓" and a very long scroll
 * before anything else was a door. A hall you can only leave by scrolling is
 * a corridor, not a hall. This is the wall of doors that makes it one.
 *
 * IT IS A WALL, NOT A LEVEL SELECT. Every plaque is engraved the way the
 * house engraves things — name in Cormorant, one line in tracked micro-caps,
 * a brass hairline running the whole wall behind them. No cards, no
 * thumbnails, no icons, no counters. The only thing that changes between one
 * plaque and the next is how much light is on it:
 *
 *   a room she has stood in   lit — full cream, brass edge
 *   a room she has not        unlit — the plaque is there, the light is not
 *   the Salon                 shut, with its lock, and it says why
 *
 * That is the whole of the recognition (brief §11): the house remembers where
 * she has been and shows it as light. No badges, no percentages, no points.
 * The count of rooms found lives in the Founder Key, once, and not here.
 *
 * THE HALL ITSELF IS NOT ON THE WALL. `WINGS` includes it, because the map
 * needs somewhere to put "You are here"; a door back into the room you are
 * standing in is furniture, so it is filtered out.
 *
 * WHY IT IS A CLIENT COMPONENT. Only for the light — `useHouseKey` reads the
 * external store. The plaques, their copy and their hrefs are in the server
 * HTML either way (the store's server snapshot is an empty key), so this is
 * navigable with no JavaScript at all and a crawler sees six real links.
 */
export function HallPlaques() {
  const { key } = useHouseKey();
  const doors = WINGS.filter((w) => w.slug !== "hall");

  return (
    <section aria-labelledby="hall-doors" className="section bg-night-deep">
      <div className="shell">
        <p className="room-label">The Grand Hall</p>
        <h2 id="hall-doors" className="headline-house mt-4 text-balance text-cream">
          Six doors off the hall.
        </h2>
        <p className="mt-5 max-w-[40ch] text-[0.9375rem] leading-relaxed text-cream/75">
          Take them in any order. The house keeps the light on in the rooms you have
          already found.
        </p>

        <div className={s.wall}>
          <span aria-hidden className={s.rail} />
          <ul className={s.doors}>
            {doors.map((wing) => {
              const found = key.roomsVisited.includes(wing.slug);
              return (
                <li key={wing.slug}>
                  <Link
                    href={wing.href}
                    onClick={() => track("hall_plaque", { to: wing.slug, found })}
                    className={[
                      s.door,
                      found ? s.doorFound : "",
                      wing.locked ? s.doorLocked : "",
                    ].join(" ")}
                  >
                    <span aria-hidden className={s.glow} />
                    <span className={s.plaque}>
                      <span className={s.name}>{wing.plaque}</span>
                      <span className={s.line}>{wing.line}</span>
                    </span>
                    <span className={s.foot}>
                      {wing.locked ? (
                        <>
                          <LockMark />
                          <span>Shut</span>
                        </>
                      ) : (
                        <span>Enter →</span>
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

function LockMark() {
  return (
    <svg viewBox="0 0 12 14" className={s.lock} aria-hidden>
      <rect x="1.5" y="6" width="9" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M3.5 6V4a2.5 2.5 0 015 0v2" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
