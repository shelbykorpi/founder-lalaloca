"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./useMotionPrefs";

/**
 * Opens every door inside it at the same moment, driven by scroll position.
 *
 * The doors swing wide as the collection rises into the middle of the screen,
 * stay open while you're reading it, and shut again as it climbs out of the
 * top. One shared measurement drives all of them, so they move together rather
 * than firing one by one as each card crosses its own line.
 *
 * Thresholds are on the group's centre, as a fraction of viewport height, and
 * the open and close points are deliberately apart — without that gap a door
 * sitting exactly on the line would flicker on every pixel of scroll.
 *
 * With reduced motion the doors simply start open and stay there.
 */

const OPEN_ABOVE = 0.90; // centre must be above this to swing open
const OPEN_BELOW = 0.14; // ...and below this
const SHUT_ABOVE = 0.96; // once open, only shut past these
const SHUT_BELOW = 0.06;

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
      const centre = (rect.top + rect.height / 2) / vh;

      setOpen((wasOpen) =>
        wasOpen
          ? centre < SHUT_ABOVE && centre > SHUT_BELOW
          : centre < OPEN_ABOVE && centre > OPEN_BELOW,
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
