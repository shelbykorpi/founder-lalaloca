"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BRAND, PRIMARY_NAV } from "@/lib/brand";
import { track } from "@/lib/analytics";
import { FOUNDER_ASPECT, Wordmark } from "./Wordmark";
import { useBag } from "@/components/bag/BagProvider";

/**
 * THE HEADER IS DARK EVERYWHERE, as of 30 August.
 *
 * It ran route-aware for three days — cream over the shop, night over the
 * after-hours rooms — because a dark bar pinned above a cream page is a worse
 * interruption than the one the directive was fixing. That reasoning expired
 * the moment the whole site went dark: there is no cream page left for it to
 * sit above, so the check and its light branch went with it.
 *
 * Colourway 03 (Founder Green over Desert Rose) is the board's LIGHT-ground
 * alternate and cannot survive here, so the bar carries Champagne over Desert
 * Rose instead — the same two-tone structure, both halves legible on night.
 */

export function Header() {
  const pathname = usePathname();
  const { count, openBag } = useBag();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <header
      className="sticky top-0 z-30 border-b backdrop-blur-md border-bronze/25 bg-night/85"
    >
      <p
        className="py-2 text-center text-[0.625rem] uppercase tracking-[0.24em] bg-night-deep text-cream/80"
      >
        {BRAND.bar}
      </p>

      {/* The FOUNDER/BEAUTY lockup is far shorter than the stacked mark it
          replaced, so the bar comes back down: 72/80 leaves clear space equal
          to the cap height of the F on every side, which is what v2.13 asks
          for. */}
      <div className="shell flex h-18 items-center justify-between gap-4 md:h-20">
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((v) => !v)}
          className="-ml-3 flex h-11 w-11 items-center justify-center lg:hidden text-cream"
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          <svg viewBox="0 0 20 14" aria-hidden className="h-3.5 w-5">
            {menuOpen ? (
              <path d="M2 1l16 12M18 1L2 13" stroke="currentColor" strokeWidth="1.2" fill="none" />
            ) : (
              <path d="M0 1h20M0 7h20M0 13h20" stroke="currentColor" strokeWidth="1.2" fill="none" />
            )}
          </svg>
        </button>

        <Link href="/" aria-label="FOUNDER — home" className="inline-flex min-h-11 items-center">
          {/* The v2.13 master: FOUNDER over BEAUTY, at the board's display
              widths — 150px desktop, 130px mobile. Those are widths, so the
              FOUNDER height is derived from them through the wordmark's own
              6.878:1 ratio rather than guessed. The link carries the accessible
              name, so the mark itself is silent to a screen reader. */}
          {/* Wrapped rather than given `hidden`/`md:inline-flex` directly: the
              component already sets `inline-flex`, and two display utilities on
              one element are decided by stylesheet order, not by the order they
              are written in. That collision rendered a zero-size lockup. */}
          {/* Colourway 03, the board's preferred light-background alternate:
              Founder Green FOUNDER over Desert Rose BEAUTY on a Cream field. */}
          {/* Colourway 03 — Founder Green over Desert Rose — is the board's
              light-background alternate. It cannot survive on a night ground,
              so the dark rooms take Champagne over Desert Rose instead: the
              same two-tone structure, both halves legible on #07130f. */}
          <span className="md:hidden text-champagne">
            <Wordmark
              height={130 / FOUNDER_ASPECT}
              beautyClassName="text-rose"
              label=""
            />
          </span>
          <span className="hidden md:block text-champagne">
            <Wordmark
              height={150 / FOUNDER_ASPECT}
              beautyClassName="text-rose"
              label=""
            />
          </span>
        </Link>

        {/* The tabs moved out to xl when the collaboration lockup arrived —
            five tabs plus a three-line lockup overflowed a 1024px window.
            Share Your Story folding into Found Her gave that width back:
            measured in a browser, the four-tab run is 587px, which sits
            beside the wordmark and the actions with slack at 1024. So the
            bar starts at lg again. */}
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-6 xl:gap-9">
            {PRIMARY_NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => {
                      if (item.href === "/young-founders-room") track("young_founders_nav_click", { from: "desktop" });
                    }}
                    aria-label={item.stack ? item.label : undefined}
                    className={`eyebrow inline-flex min-h-11 items-center whitespace-nowrap border-b text-center transition-colors ${
                      active
                        ? "border-bronze text-champagne"
                        : "border-transparent text-cream/70 hover:border-rose/60 hover:text-cream"
                    }`}
                  >
                    {item.stack ? (
                      /* Three centred lines. Hidden from the accessible name
                         above, so this is decoration as far as a screen reader
                         is concerned. */
                      <span aria-hidden className="flex flex-col items-center">
                        {item.stack.map((line) => (
                          <span key={line}>{line}</span>
                        ))}
                      </span>
                    ) : (
                      item.label
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1 md:gap-3">
          <Link
            href="/search"
            className="eyebrow hidden h-11 items-center px-2 md:inline-flex text-cream/70 hover:text-rose"
          >
            Search
          </Link>
          <button
            type="button"
            onClick={openBag}
            className="eyebrow flex h-11 items-center px-2 text-cream/70 hover:text-rose"
          >
            Bag<span aria-hidden> ({count})</span>
            <span className="sr-only">
              , {count} {count === 1 ? "item" : "items"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      <div
        id="mobile-nav"
        hidden={!menuOpen}
        className="border-t lg:hidden border-bronze/20 bg-night"
      >
        <nav aria-label="Primary mobile" className="shell py-4">
          <ul className="flex flex-col">
            {PRIMARY_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => {
                    if (item.href === "/young-founders-room") track("young_founders_nav_click", { from: "mobile" });
                    close();
                  }}
                  aria-label={item.stack ? item.label : undefined}
                  className="flex min-h-[3rem] items-center border-b font-serif text-2xl border-bronze/15 text-cream"
                >
                  {/* One line here rather than three: at this size the stack
                      would run half the panel. Same words, same order. */}
                  {item.stack ? (
                    <span aria-hidden>{item.stack.join(" ")}</span>
                  ) : (
                    item.label
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-6">
            <Link
              href="/search"
              onClick={close}
              className="eyebrow flex min-h-11 items-center text-cream/70"
            >
              Search
            </Link>
            <Link
              href="/account"
              onClick={close}
              className="eyebrow flex min-h-11 items-center text-cream/70"
            >
              Account
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
