"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { WINGS, OPEN_WINGS } from "@/lib/house";
import { track } from "@/lib/analytics";
import s from "./founder-key.module.css";

/**
 * THE HOUSE MAP — a hall of doors, not a floor plan.
 *
 * 12 September 2026, second pass. The first map was hairlines and boxes;
 * Shelby: this house is photographed, not drawn. So the map is now the
 * house's own doors — the brass-framed emerald double doors from
 * /door/edoor-scene.webp, the same leaves the entrance uses — standing in a
 * row down a dark hall, one per wing, each showing its room through the
 * opening. The room she is in stands open and lit, with "You are here"
 * beneath it. Hover or focus and a door swings; press it and she goes
 * through. The Salon's doors stay shut, with the plaque.
 *
 * Geometry: the two leaf crops sit at exact fractions of the door
 * photograph (measured by matching the leaf pixels to the scene: left leaf
 * at 22.556% / 9.406%, 27.44% wide, 87.43% tall; right leaf at 50%). The
 * room photograph is painted into that opening under the leaves, so opening
 * them reveals the room, never the baked-in shut door.
 *
 * It is a dialog: Escape closes, focus is trapped, the header navigation
 * is never removed — this is a second way in, not the only one.
 */
const OPENING = { left: "22.556%", top: "9.406%", width: "54.78%", height: "87.433%" } as const;

export function HouseMap({
  id,
  open,
  onClose,
  here,
  found,
}: {
  id: string;
  open: boolean;
  onClose: () => void;
  here: string | null;
  found: string[];
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const hereLink = panel.current?.querySelector<HTMLElement>("[aria-current='location']");
    (hereLink ?? panel.current?.querySelector<HTMLElement>("a, button"))?.focus({ preventScroll: true });
    /* On a phone the hall is a corridor she slides along: open it standing
       in front of her own door. */
    hereLink?.scrollIntoView({ block: "nearest", inline: "center", behavior: "instant" as ScrollBehavior });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const list = Array.from(panel.current.querySelectorAll<HTMLElement>("a, button"));
        if (!list.length) return;
        const a = list[0];
        const z = list[list.length - 1];
        if (e.shiftKey && document.activeElement === a) { z.focus(); e.preventDefault(); }
        else if (!e.shiftKey && document.activeElement === z) { a.focus(); e.preventDefault(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div id={id} className={`${s.map} ${open ? s.mapOpen : ""}`} aria-hidden={!open}>
      <div className={s.scrim} onClick={onClose} />
      <div ref={panel} role="dialog" aria-modal="true" aria-labelledby={`${id}-title`} className={s.hall}>
        <header className={s.head}>
          <p className="eyebrow text-champagne">The House</p>
          <h2 id={`${id}-title`} className={`${s.title} font-serif font-light text-cream`}>
            Every door in the house.
          </h2>
          <p className={s.found}>
            {found.length} of {OPEN_WINGS.length} rooms found
          </p>
          <button type="button" className={s.close} onClick={onClose} aria-label="Close the map">
            <svg viewBox="0 0 20 20" aria-hidden><path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.2" fill="none" /></svg>
          </button>
        </header>

        <ol className={s.doors} aria-label="Rooms of the house">
          {WINGS.map((w) => {
            const isHere = w.slug === here;
            const isFound = found.includes(w.slug);
            const cls = [s.door, isHere ? s.doorHere : "", isFound ? s.doorFound : "", w.locked ? s.doorLocked : ""].join(" ");
            return (
              <li key={w.slug} className={cls}>
                <Link
                  href={w.href}
                  className={s.doorLink}
                  aria-current={isHere ? "location" : undefined}
                  aria-label={`${w.plaque}${w.locked ? ", by invitation" : ""}${isHere ? " — you are here" : ""}`}
                  onClick={() => {
                    track("house_map_go", { to: w.slug, from: here ?? "unknown" });
                    onClose();
                  }}
                >
                  <span className={s.frame} aria-hidden>
                    {/* the surround: brass frame, sconces, green panelling */}
                    <Image src="/door/edoor-scene.webp" alt="" fill sizes="(max-width: 820px) 70vw, 18vw" className={s.surround} />
                    {/* the opening, with the room behind the leaves */}
                    <span className={s.opening} style={OPENING}>
                      <Image src={w.door} alt="" fill sizes="(max-width: 820px) 40vw, 10vw" className={s.room} />
                      <span className={s.glow} />
                      <span className={`${s.leaf} ${s.leafL}`}>
                        <Image src="/door/edoor-leaf-left.webp" alt="" fill sizes="10vw" />
                      </span>
                      <span className={`${s.leaf} ${s.leafR}`}>
                        <Image src="/door/edoor-leaf-right.webp" alt="" fill sizes="10vw" />
                      </span>
                    </span>
                  </span>
                  <span className={s.plaque}>
                    <span className={s.plaqueName}>{w.plaque}</span>
                    <span className={s.plaqueLine}>{w.locked ? "By invitation" : w.line}</span>
                    {isHere && <span className={s.here}>You are here</span>}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
