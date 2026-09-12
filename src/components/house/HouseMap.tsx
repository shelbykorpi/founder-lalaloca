"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { WINGS, OPEN_WINGS } from "@/lib/house";
import { track } from "@/lib/analytics";
import s from "./founder-key.module.css";

/**
 * THE HOUSE MAP — an editorial floor plan, not a drafting drawing.
 *
 * Seven plaques on a hairline plan: the hall at the centre, the vanity and
 * the boardroom across the front, the gallery and the library across the
 * back, the young founders' room and the salon between. Each plaque is a
 * real link. The room she is standing in carries the rose mark and "You are
 * here"; rooms she has found are lit; the Salon shows its door and its
 * plaque but stays shut.
 *
 * It is a dialog: Escape closes, focus is trapped while open, the standard
 * header navigation is never removed — this is a second way in, not the
 * only one.
 */
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
    const first = panel.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const nodes = panel.current.querySelectorAll<HTMLElement>("a, button");
        const list = Array.from(nodes);
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
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        className={s.panel}
      >
        <header className={s.head}>
          <p className="eyebrow text-champagne">The House</p>
          <h2 id={`${id}-title`} className={`${s.title} font-serif font-light text-cream`}>
            Where would you like to go?
          </h2>
          <p className={s.found}>
            {found.length} of {OPEN_WINGS.length} rooms found
          </p>
          <button type="button" className={s.close} onClick={onClose} aria-label="Close the map">
            <svg viewBox="0 0 20 20" aria-hidden><path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.2" fill="none" /></svg>
          </button>
        </header>

        <div className={s.plan} aria-label="Floor plan of the house">
          {/* the walls */}
          <span aria-hidden className={s.wallH} style={{ top: "35%" }} />
          <span aria-hidden className={s.wallH} style={{ top: "65%" }} />
          <span aria-hidden className={s.wallV} style={{ left: "31%" }} />
          <span aria-hidden className={s.wallV} style={{ left: "69%" }} />
          {WINGS.map((w) => {
            const isHere = w.slug === here;
            const isFound = found.includes(w.slug);
            const cls = [s.room, isHere ? s.roomHere : "", isFound ? s.roomFound : "", w.locked ? s.roomLocked : ""].join(" ");
            const style = { left: `${w.plan.x}%`, top: `${w.plan.y}%`, width: `${w.plan.w}%`, height: `${w.plan.h}%` };
            return (
              <Link
                key={w.slug}
                href={w.href}
                className={cls}
                style={style}
                aria-current={isHere ? "location" : undefined}
                onClick={() => {
                  track("house_map_go", { to: w.slug, from: here ?? "unknown" });
                  onClose();
                }}
              >
                <span className={s.plaque}>
                  <span className={s.plaqueName}>{w.plaque}</span>
                  <span className={s.plaqueLine}>{w.locked ? "By invitation" : w.line}</span>
                </span>
                {isHere && <span className={s.here}>You are here</span>}
                {w.locked && (
                  <span className={s.lock} aria-hidden>
                    <svg viewBox="0 0 12 14"><rect x="1.5" y="6" width="9" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="1" /><path d="M3.5 6V4a2.5 2.5 0 015 0v2" fill="none" stroke="currentColor" strokeWidth="1" /></svg>
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <ol className={s.list}>
          {WINGS.map((w) => (
            <li key={w.slug}>
              <Link href={w.href} onClick={onClose} className={w.slug === here ? s.listHere : ""}>
                {w.plaque}
                {w.locked && <span className={s.listLock}> · by invitation</span>}
                {w.slug === here && <span className={s.listLock}> · you are here</span>}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
