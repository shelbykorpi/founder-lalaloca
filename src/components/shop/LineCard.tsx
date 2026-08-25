import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * One card in the FOUNDER line.
 *
 * Shared by /founder-collection and /the-next-move so the two can never
 * drift into two different treatments of the same products. The pattern:
 * a 3:2 image tile with a hover reveal, a rule in the SKU's own accent, and
 * beneath it eyebrow · name · category · state.
 *
 * THE STATE LINE IS LOAD-BEARING. Every product in this line is at a
 * different stage — one takes money, three take reservations, two are only
 * names — and a grid that renders them identically is a grid that implies
 * six things you can buy. `state` says which is which, in words, on every
 * card.
 *
 * A card with no image is a named-but-unmade step: by the board's rule that
 * is not a product listing, so it gets the name, a purely categorical
 * descriptor and a way to hear when it is real. No price, no formula, no
 * claim, no ingredient.
 */
export function LineCard({
  name,
  category,
  character,
  image,
  hoverImage,
  accent,
  href,
  state,
  action,
}: {
  name: string;
  category: string;
  /** Slot identity — "02 · The Anchor". */
  character?: string;
  image?: { src: string; alt: string };
  hoverImage?: { src: string; alt: string };
  /** The rule under the image. The SKU's own colour, not a house default. */
  accent: string;
  href: string;
  /** Plain words: "Preorder · $34.00", "Reserve — no price yet", "In the making". */
  state: string;
  action?: ReactNode;
}) {
  return (
    <article className="flex flex-col">
      <Link href={href} className="group/card block" aria-label={name}>
        <div className="relative aspect-[3/2] w-full overflow-hidden bg-shell">
          {image ? (
            <>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 90vw, 30vw"
                className={`object-cover ${
                  hoverImage
                    ? "transition-opacity duration-500 group-hover/card:opacity-0"
                    : ""
                }`}
              />
              {hoverImage && (
                <Image
                  src={hoverImage.src}
                  alt=""
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 90vw, 30vw"
                  className="object-cover opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                />
              )}
            </>
          ) : (
            /* Named, not made. The name itself is the image. */
            <span className="absolute inset-0 flex items-center justify-center px-8 text-center font-serif text-[clamp(1.5rem,2.4vw,2rem)] leading-tight text-charcoal/35">
              {name}
            </span>
          )}
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1"
            style={{ background: accent }}
          />
        </div>

        {character && (
          <p className="eyebrow mt-5 text-bronze-ink">{character}</p>
        )}
        <h3 className="mt-2 font-serif text-2xl font-light leading-none text-charcoal transition-colors group-hover/card:text-bronze-ink">
          {name}
        </h3>
        <p className="mt-2 text-sm text-charcoal/80">{category}</p>
        <p className="mt-2 text-sm text-charcoal">{state}</p>
      </Link>

      {action && <div className="mt-4">{action}</div>}
    </article>
  );
}
