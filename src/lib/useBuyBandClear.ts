"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * True while a product name or a button sits in the bottom band of a phone
 * screen on the shop and product pages — the band where the Founder Key
 * (bottom-left) and the service bell (bottom-right) are fixed.
 *
 * 1 Oct 2026 audit: at 390 both controls sat on the edges of every full-width
 * "Add to bag" as it scrolled past, and on serum names. Padding cannot fix
 * that for a fixed control over a scrolling page, so the controls step aside
 * whenever one of those elements is under them, and return when it has gone.
 *
 * Phones (<768px) on /shop and /products/* only; everywhere else this is
 * always false and the controls behave exactly as before.
 */
const BAND = 76; /* px from the bottom: the bell (~51px + 8) and key (44 + 12) */
const TARGETS = "main h1, main h2, main h3, main .btn";

function applies(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname === "/shop" || pathname.startsWith("/products/");
}

export function useBuyBandClear(): boolean {
  const pathname = usePathname();
  const [blocked, setBlocked] = useState(false);

  const enabled = applies(pathname);

  useEffect(() => {
    if (!enabled) return;
    const phone = window.matchMedia("(max-width: 767px)");
    let observer: IntersectionObserver | null = null;
    let frame = 0;
    const inBand = new Set<Element>();

    /* An observer's first callback reports every target, so the state is
       always re-derived from scratch when it is rebuilt. */
    const build = () => {
      frame = 0;
      observer?.disconnect();
      observer = null;
      inBand.clear();
      if (!phone.matches) {
        setBlocked(false);
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) inBand.add(entry.target);
            else inBand.delete(entry.target);
          }
          setBlocked(inBand.size > 0);
        },
        /* The root shrinks to the bottom BAND pixels of the viewport. */
        { rootMargin: `-${Math.max(0, window.innerHeight - BAND)}px 0px 0px 0px` },
      );
      document.querySelectorAll(TARGETS).forEach((el) => observer?.observe(el));
    };

    /* Rebuilt on resize (a phone's toolbar changes innerHeight as it
       scrolls), at most once a frame. */
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(build);
    };
    schedule();
    window.addEventListener("resize", schedule);
    phone.addEventListener("change", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("resize", schedule);
      phone.removeEventListener("change", schedule);
    };
  }, [enabled, pathname]);

  return enabled && blocked;
}
