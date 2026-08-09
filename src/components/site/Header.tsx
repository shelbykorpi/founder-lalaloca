"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BRAND, PRIMARY_NAV } from "@/lib/brand";
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

      {/* The bar is tall because the lockup is stacked. A vertical logo is
          roughly twice the height of a horizontal one at the same wordmark
          size, so holding FOUNDER at its previous reading size costs about
          40px of bar. 96/112 leaves a 16px margin above and below the mark at
          both breakpoints — below that the logo starts touching the rules. */}
      <div className="shell flex h-24 items-center justify-between gap-4 md:h-28">
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
          {/* Stacked lockup: the F monogram centred over the wordmark, 64px
              mobile / 80px desktop. The horizontal lockup is still in
              /public/brand if a wide, short space ever needs it.
              Clear space = full monogram width on all sides — keep nav off it. */}
          <img
            src="/brand/founder-stacked-cream.svg"
            alt="FOUNDER"
            className="h-16 w-auto md:h-20"
          />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {PRIMARY_NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`eyebrow inline-flex min-h-11 items-center border-b transition-colors ${
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
                  onClick={close}
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
