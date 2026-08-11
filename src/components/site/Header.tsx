"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BRAND, PRIMARY_NAV } from "@/lib/brand";
import { track } from "@/lib/analytics";
import { FOUNDER_ASPECT, Wordmark } from "./Wordmark";
import { useBag } from "@/components/bag/BagProvider";

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
    <header className="sticky top-0 z-30 border-b border-charcoal/10 bg-cream/95 backdrop-blur-md">
      <p className="bg-ink py-2 text-center text-[0.625rem] uppercase tracking-[0.24em] text-shell">
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
          className="-ml-3 flex h-11 w-11 items-center justify-center lg:hidden"
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
          <span className="text-founder-green md:hidden">
            <Wordmark
              height={130 / FOUNDER_ASPECT}
              beautyClassName="text-rose"
              label=""
            />
          </span>
          <span className="hidden text-founder-green md:block">
            <Wordmark
              height={150 / FOUNDER_ASPECT}
              beautyClassName="text-rose"
              label=""
            />
          </span>
        </Link>

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
                    className={`eyebrow inline-flex min-h-11 items-center whitespace-nowrap border-b transition-colors ${
                      active
                        ? "border-bronze text-bronze-ink"
                        : "border-transparent text-charcoal hover:border-charcoal/30"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1 md:gap-3">
          <Link
            href="/search"
            className="eyebrow hidden h-11 items-center px-2 text-charcoal hover:text-bronze-ink md:inline-flex"
          >
            Search
          </Link>
          <button
            type="button"
            onClick={openBag}
            className="eyebrow flex h-11 items-center px-2 text-charcoal hover:text-bronze-ink"
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
        className="border-t border-charcoal/10 bg-cream lg:hidden"
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
                  className="flex min-h-[3rem] items-center border-b border-charcoal/10 font-serif text-2xl text-charcoal"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-6">
            <Link
              href="/search"
              onClick={close}
              className="eyebrow flex min-h-11 items-center text-charcoal"
            >
              Search
            </Link>
            <Link
              href="/account"
              onClick={close}
              className="eyebrow flex min-h-11 items-center text-charcoal"
            >
              Account
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
