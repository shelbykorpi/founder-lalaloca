"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";

export type Shade = {
  code: string;
  name: string;
  handle: string;
  /** Shopify variant id for this shade — the bag line id for the plate. */
  variantId: string;
  hero: { src: string; alt: string };
};

/** Exposes the selected shade to a sibling client component (the buy button),
 *  so adding to the bag uses the variant the shopper is actually looking at.
 *  Returns null outside the provider, so a single-shade caller can fall back. */
export function useSelectedShade(): Shade | null {
  const ctx = useContext(ShadeCtx);
  return ctx ? ctx.selected : null;
}

/**
 * THE SHADE PICKER, FOR THE PLATE.
 *
 * Two things have to move together when a shade is chosen: the full-bleed
 * photograph behind everything, and the chips sitting in the copy column
 * halfway down the words. They are in different places in the DOM and the
 * copy between them is server-rendered, so the state lives in a context and
 * the two consumers read it. Children passed through the provider stay
 * server components — nothing about the copy becomes client-side because the
 * chips are.
 *
 * THE FIRST BUILD PUT THE CHIPS OVER THE PICTURE, bottom right, and they
 * landed on the brass tray and the mirror: 35 · DEEP was effectively
 * invisible and the row collided with the concierge button. Controls belong
 * where the reading happens — in the shadow, above the reserve block, in the
 * order a person actually decides: which shade, then reserve it.
 *
 * WHY IT IS NOT `shop/ShadePicker`. That one is built for the cream page — a
 * 3:2 framed image with a stripe under it and charcoal-on-cream chips. This
 * one is a full-bleed plate with chips that must read on a night ground.
 * Threading a tone flag through every class of a component that is live on a
 * converting page, to serve a track that will replace it, is the wrong trade.
 * Both are live: this one on /products/smooth-talker, that one on
 * /the-next-move, which is still a cream campaign page.
 *
 * NO `useSearchParams`, DELIBERATELY. It opts the tree into client rendering
 * and demands a Suspense boundary, which here would wrap the whole plate and
 * cost the page its prerendered copy. `?shade=` is honoured in an effect
 * instead: the default shade renders, then a deep link switches to its shade
 * on hydration. A one-frame change on an uncommon entry is cheaper than an
 * unprerendered hero.
 *
 * WHAT IT STILL DOES NOT DO: reach checkout. No Shopify variant exists for
 * any shade. The picker records a preference; the reservation below it is one
 * email capture for the whole campaign. A selector implying it had reserved
 * 25 MEDIUM would promise something the plumbing cannot keep.
 */

type Ctx = {
  shades: Shade[];
  selected: Shade;
  select: (s: Shade) => void;
  groupId: string;
};

const ShadeCtx = createContext<Ctx | null>(null);

function useShades(): Ctx {
  const ctx = useContext(ShadeCtx);
  if (!ctx) throw new Error("PlateShades components must sit inside <PlateShades>");
  return ctx;
}

export function PlateShades({
  shades,
  defaultHandle = "25-medium",
  children,
}: {
  shades: Shade[];
  defaultHandle?: string;
  children: ReactNode;
}) {
  const groupId = useId();
  const fallback =
    shades.find((s) => s.handle === defaultHandle) ?? shades[0];
  const [selected, setSelected] = useState<Shade>(fallback);

  /* ?shade=20-light stays linkable. Read after mount rather than through
     useSearchParams — see the note above. An unknown value is ignored rather
     than erroring; a bad query string should never break the page. */
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("shade");
    if (!wanted) return;
    const match = shades.find((s) => s.handle === wanted);
    if (match) setSelected(match);
  }, [shades]);

  return (
    <ShadeCtx.Provider value={{ shades, selected, select: setSelected, groupId }}>
      {children}
    </ShadeCtx.Provider>
  );
}

/** The full-bleed plate. Every shade is mounted and cross-faded rather than
 *  swapped, so switching never shows an empty frame while a file loads. */
export function PlateShadeImage() {
  const { shades, selected } = useShades();
  return (
    <>
      {shades.map((shade, i) => (
        <Image
          key={shade.handle}
          src={shade.hero.src}
          alt={shade.handle === selected.handle ? shade.hero.alt : ""}
          aria-hidden={shade.handle !== selected.handle}
          fill
          {...(i === 0 ? { priority: true } : { loading: "lazy" as const })}
          sizes="100vw"
          className={`object-cover object-[70%_center] transition-opacity duration-700 ${
            shade.handle === selected.handle ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </>
  );
}

/**
 * The chips, in the copy column. Radios rather than buttons: this is one
 * choice from a small set, which is what a radio group is for, and it gets
 * arrow-key navigation and screen-reader semantics for free.
 */
export function PlateShadeChips({ className = "" }: { className?: string }) {
  const { shades, selected, select, groupId } = useShades();
  return (
    <fieldset className={className}>
      <legend className="room-label">Shade</legend>

      <p className="sr-only" aria-live="polite">
        Showing {selected.code} {selected.name}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {shades.map((shade) => {
          const active = shade.handle === selected.handle;
          const id = `${groupId}-${shade.handle}`;
          return (
            <span key={shade.handle}>
              {/* The input is the real control — visually hidden, not
                  display:none, so it stays focusable and the label's ring
                  follows the focus. */}
              <input
                type="radio"
                id={id}
                name={groupId}
                value={shade.handle}
                checked={active}
                onChange={() => select(shade)}
                className="peer sr-only"
              />
              <label
                htmlFor={id}
                className={`inline-flex min-h-11 cursor-pointer items-center border px-4 text-[0.625rem] uppercase tracking-[0.2em] transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-bronze ${
                  active
                    ? "border-bronze bg-bronze/30 text-cream"
                    : "border-cream/25 text-cream/70 hover:border-cream/60 hover:text-cream"
                }`}
              >
                {shade.code} · {shade.name}
              </label>
            </span>
          );
        })}
      </div>
    </fieldset>
  );
}
