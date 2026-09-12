"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { WINGS } from "@/lib/house";
import { useHouseKey } from "@/components/house/HouseKeyProvider";
import { useWalkThrough } from "@/components/house/WalkThrough";
import { track } from "@/lib/analytics";
import s from "./grand-hall.module.css";

/**
 * THE GRAND HALL — a hall you stand in, not a wall you read (brief §4).
 *
 * 12 September 2026, third pass. The first was six engraved plaques on
 * panelling. Shelby: "this is not giving the immersive feeling of being
 * located in each room or that you're navigating yourself to each room."
 * Right — a plaque tells you a room exists; it does not put you in front of
 * its door. So the hall is now the house's own doors, at standing height,
 * along a marble floor: the brass-framed emerald double doors from
 * /door/edoor-scene.webp with each wing's own room photographed through the
 * opening. You look along the hall; the door in front of you stands open and
 * lit; the others wait in shadow further down. Hover or focus and a door
 * swings open. Press it and you WALK THROUGH — the room grows out of the
 * doorway until it is the whole frame, and then you are on its page
 * (WalkThrough.tsx). On a phone the hall is a corridor you slide along.
 *
 * SAME DOORS AS THE MAP, ON PURPOSE. The House Map became a hall of doors
 * earlier today, at 15rem. This is the same construction at the scale of a
 * room, in the page rather than over it — the map is the pocket plan, this is
 * the hall. The leaf geometry is the map's: measured by matching leaf pixels
 * to the scene.
 *
 * NO NEW PHOTOGRAPHY WAS COMPOSITED. Every image here is one the house
 * already has — the door plate and the room plates from rooms.ts. A door
 * with a room behind it is two photographs in a frame, not a montage, and
 * the leaves swinging are the leaves the entrance uses.
 *
 * WHAT DOES NOT CHANGE: every door is a real <Link>. A modifier-click, a
 * crawler, no JavaScript or reduced motion gets a plain navigation. The hall
 * itself is not in the row — a door back into the room you are standing in
 * is furniture.
 */
const OPENING = { left: "22.556%", top: "9.406%", width: "54.78%", height: "87.433%" } as const;

export function GrandHall() {
  const { key } = useHouseKey();
  const doors = WINGS.filter((w) => w.slug !== "hall");
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLUListElement>(null);
  const bays = useRef<(HTMLLIElement | null)[]>([]);
  const openings = useRef<(HTMLElement | null)[]>([]);
  const { walk, layer } = useWalkThrough();
  const phone = () => typeof window !== "undefined" && window.matchMedia("(max-width: 820px)").matches;

  /* On a phone the lit door is whichever one you have slid in front of. */
  useEffect(() => {
    if (!("IntersectionObserver" in window) || !trackRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!phone()) return;
        entries.forEach((en) => {
          if (en.isIntersecting && en.intersectionRatio > 0.6) {
            setActive(Number((en.target as HTMLElement).dataset.i));
          }
        });
      },
      { root: trackRef.current, threshold: [0.6] },
    );
    bays.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = useCallback(
    (i: number) => {
      const n = ((i % doors.length) + doors.length) % doors.length;
      setActive(n);
      bays.current[n]?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        inline: phone() ? "center" : "start",
        block: "nearest",
      });
    },
    [doors.length],
  );

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { go(active + 1); e.preventDefault(); }
    if (e.key === "ArrowLeft") { go(active - 1); e.preventDefault(); }
  };

  return (
    <section className={s.hall} aria-labelledby="hall-doors" onKeyDown={onKey}>
      <div className={s.words}>
        <p className="room-label">The Grand Hall</p>
        <h2 id="hall-doors" className={`${s.title} font-serif font-light text-cream`}>
          Six doors off the hall.
        </h2>
        <p className={s.lede}>
          Walk along. The door in front of you is open. The house keeps a light on
          in the rooms you have already found.
        </p>
      </div>

      <div className={s.corridor}>
        <ul ref={trackRef} className={s.track} aria-label="The doors off the Grand Hall">
          {doors.map((wing, i) => {
            const found = key.roomsVisited.includes(wing.slug);
            const isActive = i === active;
            const cls = [s.bay, isActive ? s.bayOn : "", found ? s.bayFound : "", wing.locked ? s.bayLocked : ""].join(" ");
            const label = `${wing.plaque} · ${wing.locked ? "By invitation" : wing.line}`;
            return (
              <li
                key={wing.slug}
                ref={(el) => { bays.current[i] = el; }}
                data-i={i}
                className={cls}
                onMouseEnter={() => { if (!phone()) setActive(i); }}
              >
                <Link
                  href={wing.href}
                  className={s.door}
                  aria-label={`${wing.plaque}${wing.locked ? ", by invitation" : ""}. Enter this room.`}
                  onFocus={() => setActive(i)}
                  onClick={(e) => {
                    track("hall_plaque", { to: wing.slug, found });
                    walk(e, openings.current[i], {
                      href: wing.href,
                      image: wing.door,
                      alt: wing.plaque,
                      label,
                    });
                  }}
                >
                  <span className={s.frame} aria-hidden>
                    <Image
                      src="/door/edoor-scene.webp"
                      alt=""
                      fill
                      sizes="(max-width: 820px) 72vw, 30vw"
                      className={s.surround}
                      priority={i < 2}
                    />
                    <span
                      ref={(el) => { openings.current[i] = el; }}
                      className={s.opening}
                      style={OPENING}
                    >
                      <Image
                        src={wing.door}
                        alt=""
                        fill
                        sizes="(max-width: 820px) 40vw, 17vw"
                        className={s.room}
                      />
                      <span className={s.glow} />
                      <span className={`${s.leaf} ${s.leafL}`}>
                        <Image src="/door/edoor-leaf-left.webp" alt="" fill sizes="10vw" />
                      </span>
                      <span className={`${s.leaf} ${s.leafR}`}>
                        <Image src="/door/edoor-leaf-right.webp" alt="" fill sizes="10vw" />
                      </span>
                    </span>
                  </span>

                  {/* The floor. The door's own reflection in the marble,
                      upside down, dim, and dissolving — what puts the door
                      ON something rather than floating over a colour. */}
                  <span className={s.reflection} aria-hidden>
                    <Image src="/door/edoor-scene.webp" alt="" fill sizes="30vw" className={s.surround} />
                  </span>

                  <span className={s.plaque}>
                    <span className={s.plaqueName}>{wing.plaque}</span>
                    <span className={s.plaqueLine}>{wing.locked ? "By invitation" : wing.line}</span>
                    <span className={s.plaqueFoot}>
                      {wing.locked ? (
                        <>
                          <svg viewBox="0 0 12 14" className={s.lock} aria-hidden>
                            <rect x="1.5" y="6" width="9" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="1" />
                            <path d="M3.5 6V4a2.5 2.5 0 015 0v2" fill="none" stroke="currentColor" strokeWidth="1" />
                          </svg>
                          Shut
                        </>
                      ) : (
                        "Walk in →"
                      )}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className={s.controls}>
          <button type="button" className={s.arrow} onClick={() => go(active - 1)} aria-label="Previous door">
            <svg viewBox="0 0 24 24" aria-hidden><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <span className={s.count} aria-live="polite">
            {String(active + 1).padStart(2, "0")} · {doors[active].plaque}
          </span>
          <button type="button" className={s.arrow} onClick={() => go(active + 1)} aria-label="Next door">
            <svg viewBox="0 0 24 24" aria-hidden><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>

      {layer}
    </section>
  );
}
