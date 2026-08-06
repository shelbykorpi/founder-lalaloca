"use client";

import { useEffect, useState } from "react";

function useMediaQuery(query: string, initial = false) {
  const [matches, setMatches] = useState(initial);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/** True when the visitor has asked the system to reduce motion. */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/**
 * True only for genuine hover pointers. Touch devices never open the doors on
 * "hover" — they get an explicit control instead.
 */
export function useHasHover() {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}
