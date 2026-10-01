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
 * THE GRAND HALL — the elevator lobby of the house.
 *
 * The imagery reads as a bank of emerald elevator doors, so the narrative
 * now follows that architecture instead of describing a corridor of rooms.
 * Each elevator is a destination inside FOUNDER: choose where you are going
 * next, the doors part, and the next room fills the frame. On a phone, the
 * elevator bank becomes a horizontal selector.
 *
 * Every destination remains a real <Link>, so modifier-clicks, crawlers,
 * reduced motion and no-JavaScript navigation still work normally.
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
        <p className="room-label">The Grand Hall · Elevator Lobby</p>
        <h2 id="hall-doors" className={`${s.title} font-serif font-light text-cream`}>
          Choose your floor.
        </h2>
        <p className={s.lede}>
          Five destinations are open. One remains private. Step in and choose
          where FOUNDER takes you next.
        </p>
      </div>

      <div className={s.corridor}>
        <ul ref={trackRef} className={s.track} aria-label="Elevators to the rooms of FOUNDER">
          {doors.map((wing, i) => {
            const found = key.roomsVisited.includes(wing.slug);
            const isActive = i === active;
            const cls = [s.bay, isActive ? s.bayOn : "", found ? s.bayFound : "", wing.locked ? s.bayLocked : ""].join(" ");
            const label = `${wing.plaque} · ${wing.locked ? "Private floor" : wing.line}`;
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
                  aria-label={wing.locked ? `${wing.plaque}. Private floor.` : `Take the elevator to ${wing.plaque}.`}
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
                    <span className={s.plaqueLine}>{wing.locked ? "Private floor · By invitation" : wing.line}</span>
                    <span className={s.plaqueFoot}>
                      {wing.locked ? (
                        <>
                          <svg viewBox="0 0 12 14" className={s.lock} aria-hidden>
                            <rect x="1.5" y="6" width="9" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="1" />
                            <path d="M3.5 6V4a2.5 2.5 0 015 0v2" fill="none" stroke="currentColor" strokeWidth="1" />
                          </svg>
                          Private floor
                        </>
                      ) : (
                        "Take me there →"
                      )}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className={s.controls}>
          <button type="button" className={s.arrow} onClick={() => go(active - 1)} aria-label="Previous elevator">
            <svg viewBox="0 0 24 24" aria-hidden><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <span className={s.count} aria-live="polite">
            Next stop · {doors[active].plaque}
          </span>
          <button type="button" className={s.arrow} onClick={() => go(active + 1)} aria-label="Next elevator">
            <svg viewBox="0 0 24 24" aria-hidden><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>

      {layer}
    </section>
  );
}
