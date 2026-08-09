"use client";

import Link from "next/link";
import { useState } from "react";
import { DOOR_ASPECT, DoorFrame } from "./DoorFrame";
import { useScrollDoors } from "./ScrollDoors";
import { AddToBagButton } from "@/components/bag/AddToBagButton";
import { toTrackItem, track } from "@/lib/analytics";
import { formatPrice, type Product } from "@/lib/products";

/**
 * The product card on the shop page: one compact doorway, and everything you
 * need to buy sitting underneath it in plain text. Nothing important is hidden
 * behind the interaction.
 */
export function DoorCard({
  product,
  index,
  priority = false,
}: {
  product: Product;
  index: number;
  priority?: boolean;
}) {
  /* Scroll drives every door in the collection together. Pressing the button
     takes it back — once you've decided, we stop moving it for you. */
  const scrollOpen = useScrollDoors();
  const [manual, setManual] = useState<boolean | null>(null);
  const open = manual ?? scrollOpen ?? false;

  function reveal(next: boolean) {
    setManual(next);
    /* select_item needs the item array, not just a slug — without it the event
       lands but the product-performance report stays blank. */
    if (next)
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
  }

  return (
    <article className="mx-auto flex w-full max-w-[26rem] flex-col lg:max-w-none">
      <DoorFrame
        product={product}
        open={open}
        /* Riding the elevator: first serum glides down to this floor, the
           second rises up, the third comes down again. */
        arrive={index === 1 ? "up" : "down"}
        compact
        priority={priority}
        className={`${DOOR_ASPECT} w-full`}
      />

      <button
        type="button"
        onClick={() => reveal(!open)}
        onFocus={(event) => {
          /* Keyboard focus opens the doors; a mouse or touch press must not,
             or the click that follows would close them again. */
          if (event.target.matches(":focus-visible")) reveal(true);
        }}
        className="mt-3 flex min-h-11 items-center justify-center gap-2 border border-charcoal/15 text-[0.6875rem] uppercase tracking-[0.18em] text-charcoal/75 transition-colors hover:border-charcoal/40 hover:text-charcoal"
      >
        {open ? "Close the doors" : "Open the doors"}
        <span className="sr-only"> and see {product.name}</span>
      </button>

      <div className="mt-5 flex flex-1 flex-col">
        {/* The archetype replaces the 01/02/03 counter, which was decoration —
            the numbering told a shopper nothing and the identity tells her
            which day this bottle is for. Timing is not lost: it moves to the
            size and price line below, where the rest of the hard facts are. */}
        <p className="eyebrow text-bronze-ink">{product.archetype}</p>
        <h3 className="mt-2 font-serif text-[1.75rem] leading-none text-charcoal">
          <Link href={`/products/${product.slug}`} className="hover:text-bronze-ink">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-charcoal/70">
          {product.category}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-charcoal/80">{product.benefit}</p>
        <p className="mt-4 text-sm text-charcoal">
          {product.size} · {formatPrice(product.price)} · {product.timing}
        </p>

        <div className="mt-5 flex flex-col gap-3 pt-1 sm:flex-row">
          <AddToBagButton product={product} className="btn btn-dark flex-1" />
          <Link href={`/products/${product.slug}`} className="btn btn-outline flex-1">
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}
