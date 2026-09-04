"use client";

import Image from "next/image";
import Link from "next/link";
import { AddToBagButton } from "@/components/bag/AddToBagButton";
import { toTrackItem, track } from "@/lib/analytics";
import { formatPrice, type Product } from "@/lib/products";

/**
 * THE SERUM ALCOVE — a bottle in its lit niche, the salon continued.
 *
 * The Serum Salon hero is three lit alcoves; the shop below it is the same
 * three, closer. Each is a marble niche with an arched top, its own energy
 * colour glowing behind the bottle (teal / amber / red, from `product.accent`),
 * the real bottle photograph lit inside, and the copy and the buy path
 * underneath. No card on a flat ground — the alcove sits in the same dark
 * marble the hero does, so the page flows down from the counter rather than
 * switching to a grid.
 */
export function SerumAlcove({ product, index }: { product: Product; index: number }) {
  return (
    <article className="flex flex-col">
      <Link
        href={`/products/${product.slug}`}
        onClick={() =>
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
          })
        }
        className="group relative block"
      >
        {/* The niche: an arched marble recess, lit from within by the
            product's own colour. */}
        <span
          className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-t-[999px] border border-bronze/25"
          style={{
            background: `radial-gradient(120% 90% at 50% 42%, ${product.accent}59 0%, ${product.accent}1f 34%, rgba(3,8,6,0.9) 78%)`,
            boxShadow:
              "inset 0 0 60px rgba(0,0,0,0.65), inset 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        >
          {/* The product name etched on the back wall of the niche, as in the
              hero alcoves. */}
          <span className="pointer-events-none absolute left-1/2 top-[22%] -translate-x-1/2 whitespace-nowrap font-serif text-[0.8125rem] uppercase tracking-[0.28em] text-cream/85">
            {product.name}
          </span>
          <Image
            src={product.bottle}
            alt={`The ${product.name} bottle.`}
            width={140}
            height={280}
            loading={index === 0 ? "eager" : "lazy"}
            className="relative z-10 h-[62%] w-auto translate-y-[14%] object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.6)] transition-transform duration-700 group-hover:-translate-y-[10%] group-hover:scale-[1.03]"
          />
          {/* The pool of light on the shelf beneath the bottle. */}
          <span
            aria-hidden
            className="absolute inset-x-[18%] bottom-0 h-[14%]"
            style={{
              background: `radial-gradient(60% 100% at 50% 100%, ${product.accent}55, transparent 72%)`,
            }}
          />
        </span>
      </Link>

      <div className="mt-6 flex flex-1 flex-col">
        <span aria-hidden className="block h-[2px] w-10" style={{ background: product.accent }} />
        <p className="eyebrow mt-3 text-champagne">{product.archetype}</p>
        <h3 className="mt-2 font-serif text-[1.75rem] leading-none text-cream">
          <Link href={`/products/${product.slug}`} className="hover:text-rose">
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
