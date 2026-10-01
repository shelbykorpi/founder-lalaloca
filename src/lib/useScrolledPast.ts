"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * True once the page has been scrolled past a share of the first screen, or
 * when the page is too short to scroll that far at all.
 *
 * 30 Sept 2026 (launch crawl): the Founder Key (bottom-left) and the service
 * bell (bottom-right) are fixed to the foot of the screen, which on the first
 * screen is exactly where every hero puts its buttons — on a 390px phone
 * they sat on "Enter the House" and over a product's own name, and on a
 * 1440 desktop plate the key's plaque sat on Smooth Talker's "not a
 * sunscreen" note. Both controls now wait until she has moved past the hero,
 * so the first screen is only the page. A page too short to scroll that far
 * shows them at once, so they are never unreachable.
 *
 * `share` is a fraction of the viewport height.
 */
export function useScrolledPast(share = 0.45): boolean {
  const [past, setPast] = useState(false);
  /* Re-measured on every route: a new page starts at the top, and may be short. */
  const pathname = usePathname();

  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const threshold = window.innerHeight * share;
      const room = document.documentElement.scrollHeight - window.innerHeight;
      setPast(window.scrollY > threshold || room < threshold);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    frame = requestAnimationFrame(check);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [share, pathname]);

  return past;
}
