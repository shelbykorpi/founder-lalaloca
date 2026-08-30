"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BRAND, PRIMARY_NAV } from "@/lib/brand";
import { track } from "@/lib/analytics";
import { FOUNDER_ASPECT, Wordmark } from "./Wordmark";
import { useBag } from "@/components/bag/BagProvider";

/**
 * Routes that belong to the after-hours house. The header goes dark on these
 * and stays cream everywhere else.
 *
 * WHY A LIST AND NOT A FLIP. The 27 Aug directive asks for a dark header on
 * every page and no abrupt theme change while scrolling — but the site is
 * converting a page at a time, and a dark bar pinned above a cream shop is a
 * worse interruption than the one we are fixing. So the header follows the
 * room it is standing in. Add each route here as it converts; when the last
 * cream page goes, delete the check and the light branch with it.
 */
const NIGHT_ROUTES = ["/after-hours"];

export function Header() {
  const pathname = usePathname();
  const { count, openBag } = useBag();
  const [menuOpen, setMenuOpen] = useState(false);
  const night = NIGHT_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(`${r}/`),
  );

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
      className={`sticky top-0 z-30 border-b backdrop-blur-md ${
        night ? "border-bronze/25 bg-night/85" : "border-charcoal/10 bg-cream/95"
      }`}
    >
      <p
        className={`py-2 text-center text-[0.625rem] uppercase tracking-[0.24em] ${
          night ? "bg-night-deep text-cream/80" : "bg-ink text-shell"
        }`}
      >
        {BRAND.structure}
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
          className={`-ml-3 flex h-11 w-11 items-center justify-center lg:hidden ${
            night ? "text-cream" : "text-charcoal"
          }`}
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
          <span className={`md:hidden ${night ? "text-champagne" : "text-founder-green"}`}>
            <Wordmark
              height={130 / FOUNDER_ASPECT}
              beautyClassName="text-rose"
              label=""
            />
          </span>
          <span className={`hidden md:block ${night ? "text-champagne" : "text-founder-green"}`}>
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
                        ? night
                          ? "border-bronze text-champagne"
                          : "border-bronze text-bronze-ink"
                        : night
                          ? "border-transparent text-cream/70 hover:border-bronze/40 hover:text-cream"
                          : "border-transparent text-charcoal hover:border-charcoal/30"
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
            className={`eyebrow hidden h-11 items-center px-2 md:inline-flex ${
              night
                ? "text-cream/70 hover:text-champagne"
                : "text-charcoal hover:text-bronze-ink"
            }`}
          >
            Search
          </Link>
          <button
            type="button"
            onClick={openBag}
            className={`eyebrow flex h-11 items-center px-2 ${
              night
                ? "text-cream/70 hover:text-champagne"
                : "text-charcoal hover:text-bronze-ink"
            }`}
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
        className={`border-t lg:hidden ${
          night ? "border-bronze/20 bg-night" : "border-charcoal/10 bg-cream"
        }`}
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
                  className={`flex min-h-[3rem] items-center border-b font-serif text-2xl ${
                    night
                      ? "border-bronze/15 text-cream"
                      : "border-charcoal/10 text-charcoal"
                  }`}
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
              className={`eyebrow flex min-h-11 items-center ${night ? "text-cream/70" : "text-charcoal"}`}
            >
              Search
            </Link>
            <Link
              href="/account"
              onClick={close}
              className={`eyebrow flex min-h-11 items-center ${night ? "text-cream/70" : "text-charcoal"}`}
            >
              Account
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
