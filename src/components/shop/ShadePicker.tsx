"use client";

import { useId, useState } from "react";
import Image from "next/image";

type Shade = {
  code: string;
  name: string;
  handle: string;
  hero: { src: string; alt: string };
};

/**
 * The shade picker for SMOOTH TALKER.
 *
 * Three shades of ONE product. The carton's stripe shifts with the shade, so
 * choosing a shade has to change the picture — a static hero beside a shade
 * list would show the customer the wrong pack.
 *
 * WHAT THIS DOES NOT DO: reach checkout. No Shopify variant exists for any of
 * these shades, and the reservation on this page is one email capture for the
 * whole campaign rather than a per-SKU basket. So the picker records a
 * preference and nothing carries it onward — deliberately, because a selector
 * that pretends to reserve a specific shade would be promising something the
 * plumbing cannot keep. When variants exist, map them by `handle`
 * (20-light · 25-medium · 35-deep) and wire the selection into the payload
 * here.
 *
 * Built as radios rather than buttons: this is a single choice from a small
 * set, which is what a radio group is for, and it gets arrow-key navigation
 * and screen-reader semantics for free instead of re-implementing them.
 */
export function ShadePicker({
  shades,
  accent,
  defaultHandle = "25-medium",
}: {
  shades: Shade[];
  /** The SKU's stripe colour, for the rule under the image and the swatch ring. */
  accent: string;
  defaultHandle?: string;
}) {
  const groupId = useId();
  const initial = shades.find((s) => s.handle === defaultHandle) ?? shades[0];
  const [selected, setSelected] = useState<Shade>(initial);

  return (
    <div>
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-shell">
        {/* Every shade is rendered and cross-faded rather than swapped, so
            switching never shows an empty frame while the next file loads. */}
        {shades.map((shade) => (
          <Image
            key={shade.handle}
            src={shade.hero.src}
            alt={shade.handle === selected.handle ? shade.hero.alt : ""}
            aria-hidden={shade.handle !== selected.handle}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 90vw, 30vw"
            className={`object-cover transition-opacity duration-500 ${
              shade.handle === selected.handle ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1"
          style={{ background: accent }}
        />
      </div>

      <fieldset className="mt-5">
        <legend className="eyebrow text-bronze-ink">
          Shade
          <span className="sr-only"> — choose one of three</span>
        </legend>

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
                  onChange={() => setSelected(shade)}
                  className="peer sr-only"
                />
                <label
                  htmlFor={id}
                  className={`inline-flex min-h-11 cursor-pointer items-center gap-2 border px-4 text-[0.6875rem] uppercase tracking-[0.16em] transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-bronze ${
                    active
                      ? "border-charcoal bg-charcoal text-cream"
                      : "border-charcoal/25 text-charcoal hover:border-charcoal/60"
                  }`}
                >
                  {shade.code} · {shade.name}
                </label>
              </span>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
