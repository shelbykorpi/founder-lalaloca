"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AddToBagButton } from "@/components/bag/AddToBagButton";
import { toTrackItem, track } from "@/lib/analytics";
import { formatPrice, type Product } from "@/lib/products";

/**
 * THE SERUM ALCOVE — a bottle in its lit niche, and its own light switch.
 *
 * The Serum Salon hero is three lit alcoves; the shop below it is the same
 * three, closer, on the same dark marble so the page flows down out of the
 * counter. Each niche has a brass pull at its lintel: press it and the alcove
 * lights — its energy colour (teal / amber / red, from `product.accent`)
 * floods the recess and the bottle lifts into the light; press again and the
 * niche falls dark. The pull is a real button (aria-pressed); the light is
 * decorative, so a screen reader hears "Thirst Trap light: on/off" and the
 * bottle and buy path never depend on it.
 *
 * Default: lit, so the page arrives looking like the salon.
 */
export function SerumAlcove({ product, index }: { product: Product; index: number }) {
  const [lit, setLit] = useState(true);
  const a = product.accent; // e.g. "#48958D"

  const selectTrack = () =>
    track("product_select", {
      item_list_id: "collection",
      item_list_name: "The LALALOCA Collection",
      items: [
        toTrackItem(product, {
          index,
          item_list_id: "collection",
          item_list_name: "The LALALOCA Collection",
        }),
      ],
    });

  return (
    <article className="flex flex-col">
      <div className="relative">
        <Link
          href={`/products/${product.slug}`}
          onClick={selectTrack}
          aria-label={`${product.name} — view`}
          className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne"
        >
          {/* The niche: an arched marble recess. Its light is `lit`. */}
          <span
            className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-t-[999px] border border-bronze/25 transition-[box-shadow] duration-700"
            style={{
              background: lit
                ? `radial-gradient(120% 92% at 50% 40%, ${a}b3 0%, ${a}55 32%, rgba(3,8,6,0.92) 76%)`
                : `radial-gradient(120% 92% at 50% 40%, ${a}22 0%, ${a}0d 30%, rgba(3,8,6,0.98) 70%)`,
              boxShadow: lit
                ? `inset 0 0 70px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.05), 0 0 46px ${a}4d`
                : "inset 0 0 90px rgba(0,0,0,0.85), inset 0 0 0 1px rgba(255,255,255,0.03)",
            }}
          >
            {/* The name etched on the back wall — brightens with the light. */}
            <span
              className="pointer-events-none absolute left-1/2 top-[22%] -translate-x-1/2 whitespace-nowrap font-serif text-[0.8125rem] uppercase tracking-[0.28em] transition-colors duration-700"
              style={{ color: lit ? "rgba(247,239,232,0.9)" : "rgba(247,239,232,0.35)" }}
            >
              {product.name}
            </span>
            <Image
              src={product.bottle}
              alt={`The ${product.name} bottle.`}
              width={140}
              height={280}
              loading={index === 0 ? "eager" : "lazy"}
              className="relative z-10 h-[62%] w-auto translate-y-[14%] object-contain transition-all duration-700 group-hover:-translate-y-[10%] group-hover:scale-[1.03]"
              style={{
                filter: lit
                  ? "drop-shadow(0 18px 30px rgba(0,0,0,0.6)) brightness(1.06)"
                  : "drop-shadow(0 14px 22px rgba(0,0,0,0.7)) brightness(0.5) saturate(0.7)",
              }}
            />
            {/* The pool of light on the shelf under the bottle. */}
            <span
              aria-hidden
              className="absolute inset-x-[18%] bottom-0 h-[16%] transition-opacity duration-700"
              style={{
                opacity: lit ? 1 : 0,
                background: `radial-gradient(60% 100% at 50% 100%, ${a}66, transparent 72%)`,
              }}
            />
          </span>
        </Link>

        {/* The brass pull at the lintel — the switch. Sibling of the link, so
            it is never a button nested in an anchor. */}
        <button
          type="button"
          onClick={() => setLit((v) => !v)}
          aria-pressed={lit}
          aria-label={`${product.name} light`}
          title={lit ? "Turn the light off" : "Turn the light on"}
          className="group/sw absolute left-1/2 top-2 z-20 flex -translate-x-1/2 flex-col items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne"
        >
          <span aria-hidden className="block h-4 w-px bg-bronze/70" />
          <span
            aria-hidden
            className="block h-3 w-3 rounded-full border border-bronze transition-all duration-500"
            style={{
              background: lit ? a : "transparent",
              boxShadow: lit ? `0 0 12px 2px ${a}cc` : "none",
            }}
          />
          <span className="mt-1 text-[0.5rem] uppercase tracking-[0.2em] text-cream/55 transition-colors group-hover/sw:text-cream">
            {lit ? "On" : "Off"}
          </span>
        </button>
      </div>

      <div className="mt-6 flex flex-1 flex-col">
        <span aria-hidden className="block h-[2px] w-10" style={{ background: a }} />
        <p className="eyebrow mt-3 text-champagne">{product.archetype}</p>
        <h3 className="mt-2 font-serif text-[1.75rem] leading-none text-cream">
          <Link href={`/products/${product.slug}`} onClick={selectTrack} className="hover:text-rose">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-cream/70">{product.category}</p>
        <p className="mt-3 text-sm leading-relaxed text-cream/70">{product.benefit}</p>
        <p className="mt-4 text-sm text-cream">
          {product.size} · {formatPrice(product.price)} · {product.timing}
        </p>
        <div className="mt-5 flex flex-col gap-3 pt-1 sm:flex-row">
          <AddToBagButton product={product} className="btn btn-primary flex-1" showPrice />
          <Link href={`/products/${product.slug}`} className="btn btn-ghost-light flex-1">
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}
