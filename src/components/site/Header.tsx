"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BRAND, PRIMARY_NAV, SHOP_NAV } from "@/lib/brand";
import { track } from "@/lib/analytics";
import { COLLECTION_SHIP_LINE } from "@/lib/nextMove";
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

/* The FOUNDER Collection's rooms: the shelf and its five plates. */
const COLLECTION_PLATES = ["opening-line", "clean-break", "hold-the-room", "double-take", "smooth-talker"];
function isCollectionRoom(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname.startsWith("/founder-collection")) return true;
  return COLLECTION_PLATES.some((slug) => pathname === `/products/${slug}`);
}

export function Header() {
  const pathname = usePathname();
  const { count, openBag } = useBag();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    /* The floating bell and house key step aside while the menu is open. */
    document.body.dataset.menuOpen = "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      delete document.body.dataset.menuOpen;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);
  const barText = isCollectionRoom(pathname)
    ? `${BRAND.barCollection} · ${COLLECTION_SHIP_LINE}`
    : BRAND.bar;

  return (
    <header
      className="luxury-header sticky top-0 z-30 border-b border-bronze/20 bg-night/78 backdrop-blur-xl"
    >
      {/* Phones get the first segment only, on one line: the full bar wrapped
          to two lines and made the sticky header 122px tall at 390. The
          strings stay in brand.ts; this only splits them. */}
      <p
        className="luxury-announcement py-2 text-center text-[0.625rem] uppercase tracking-[0.26em] text-cream/75"
      >
        <span className="md:hidden">{barText.split(" · ")[0]}</span>
        <span className="hidden md:inline">{barText}</span>
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
          className="-ml-3 flex h-11 w-11 items-center justify-center xl:hidden text-cream"
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
              same two-tone structure, both halves legible on #0e211b. */}
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
            bar started at lg again.

            10 Sept 2026: The Library is the sixth tab, and six tabs measure
            ~700px — with the 150px wordmark and the Search/Bag actions that
            is the whole of a 1024 window. The bar starts at xl now; lg gets
            the menu button.

            11 Sept 2026: every tab is now a two-line stack (see PRIMARY_NAV).
            That takes the run down to ~650px, but with the wordmark, the
            actions and the shell padding a 1024 window is still ~30px short,
            so the breakpoint stays at xl. */}
        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-6 xl:gap-9">
            <li className="group/shop relative">
              <button
                type="button"
                className={`eyebrow inline-flex min-h-11 items-center gap-2 border-b pb-1 transition-colors ${
                  pathname === "/shop" || pathname.startsWith("/shop/") || isCollectionRoom(pathname)
                    ? "border-bronze text-champagne"
                    : "border-transparent text-cream/70 hover:border-rose/60 hover:text-cream"
                }`}
                aria-haspopup="true"
              >
                Shop
                <span aria-hidden className="text-[0.55rem] transition-transform group-hover/shop:rotate-180 group-focus-within/shop:rotate-180">⌄</span>
              </button>
              <div className="pointer-events-none absolute left-1/2 top-[calc(100%+0.5rem)] w-[22rem] -translate-x-1/2 translate-y-2 border border-bronze/20 bg-night-deep/98 p-2 opacity-0 shadow-2xl backdrop-blur-xl transition-all duration-200 group-hover/shop:pointer-events-auto group-hover/shop:translate-y-0 group-hover/shop:opacity-100 group-focus-within/shop:pointer-events-auto group-focus-within/shop:translate-y-0 group-focus-within/shop:opacity-100">
                {SHOP_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block border-b border-bronze/10 px-4 py-4 last:border-0 hover:bg-cream/[0.04]"
                  >
                    <span className="block font-serif text-[1.35rem] leading-none text-cream">{item.label}</span>
                    <span className="mt-2 block text-[0.65rem] uppercase tracking-[0.16em] text-cream/50">{item.note}</span>
                  </Link>
                ))}
              </div>
            </li>
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
                    className={`eyebrow inline-flex min-h-11 items-center whitespace-nowrap border-b pb-1 text-center transition-colors ${
                      active
                        ? "border-bronze text-champagne"
                        : "border-transparent text-cream/70 hover:border-rose/60 hover:text-cream"
                    }`}
                  >
                    {item.stack ? (
                      /* Two centred lines, set tight so the pair reads as one
                         word-shape. Hidden from the accessible name above, so
                         this is decoration as far as a screen reader is
                         concerned. */
                      <span aria-hidden className="flex flex-col items-center gap-[3px] leading-none">
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
        className="border-t xl:hidden border-bronze/20 bg-night"
      >
        <nav aria-label="Primary mobile" className="shell py-4">
          <div className="border-b border-bronze/20 pb-3">
            <p className="eyebrow py-2 text-rose">Shop</p>
            {SHOP_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className="flex min-h-[3.25rem] items-center justify-between border-t border-bronze/10 font-serif text-xl text-cream"
              >
                <span>{item.label}</span>
                <span aria-hidden className="text-champagne">→</span>
              </Link>
            ))}
          </div>
          <ul className="mt-2 flex flex-col">
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
          </div>
        </nav>
      </div>
    </header>
  );
}
