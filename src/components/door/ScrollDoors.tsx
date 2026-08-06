"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./useMotionPrefs";

/**
 * Opens every door inside it at the same moment, driven by scroll position.
 *
 * The doors part as the collection scrolls into view, stay open the whole
 * time any of it is on screen, and shut again once it has climbed out of the
 * top. One shared measurement drives all of them, so they move together
 * rather than firing one by one as each card crosses its own line.
 *
 * Thresholds are on the group's EDGES, not its centre. On a phone the cards
 * stack into one very tall column, and a centre-based trigger doesn't fire
 * until you are halfway down the list — the first elevator sat shut while
 * you looked straight at it, then everything closed again while the last
 * card was still on screen. Edge-based thresholds behave identically on a
 * one-row desktop grid and a stacked mobile column.
 *
 * The open and close points are deliberately apart — without that gap a
 * door sitting exactly on the line would flicker on every pixel of scroll.
 *
 * With reduced motion the doors simply start open and stay there.
 */

const OPEN_ENTER = 0.85; // open once the group's top rises above this line…
const OPEN_EXIT = 0.30; // …while its bottom is still below this one
const SHUT_ABOVE = 0.92; // once open, shut only if scrolled back above here…
const SHUT_EXIT = 0.22; // …or once the group has almost left through the top

const ScrollDoorsContext = createContext<boolean | null>(null);

/** null when there is no scroll driver above — the caller keeps its own state. */
export function useScrollDoors() {
  return useContext(ScrollDoorsContext);
}

export function ScrollDoors({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (reduced) return; // nothing to drive — the value below is forced open

    const el = ref.current;
    if (!el) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const top = rect.top / vh;
      const bottom = rect.bottom / vh;

      setOpen((wasOpen) =>
        wasOpen
          ? top < SHUT_ABOVE && bottom > SHUT_EXIT
          : top < OPEN_ENTER && bottom > OPEN_EXIT,
      );
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    onScroll(); // first measurement on the next frame, after layout settles
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  return (
    <div ref={ref} className={className}>
      <ScrollDoorsContext.Provider value={reduced ? true : open}>
        {children}
      </ScrollDoorsContext.Provider>
    </div>
  );
}
