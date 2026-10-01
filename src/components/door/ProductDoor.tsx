"use client";

import { useEffect, useRef, useState } from "react";
import { DOOR_ASPECT, DoorFrame } from "./DoorFrame";
import { usePrefersReducedMotion } from "./useMotionPrefs";
import { track } from "@/lib/analytics";
import type { Product } from "@/lib/products";

/**
 * The product page opening. The doors open once, on arrival — the reveal is not
 * repeated anywhere else on the page. With reduced motion the room simply
 * starts open.
 *
 * LAYOUT (1 Oct 2026 audit). It renders three grid items into the page's
 * buy grid — the elevator, `children` (the name/price/size/Add to bag block)
 * and the doors toggle — in that DOM order. On a phone they stack in that
 * order, so the buy block sits directly under a shortened elevator instead
 * of below the toggle (the button had been ~1250px down at 390×844). From lg
 * the elevator and toggle are pinned to column one and the buy block to
 * column two, exactly as before.
 */
export function ProductDoor({
  product,
  children,
}: {
  product: Product;
  children?: React.ReactNode;
}) {
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState(false);

  /* Guarded so React's development double-invoke doesn't count the view twice. */
  const viewed = useRef<string | null>(null);
  useEffect(() => {
    if (viewed.current === product.slug) return;
    viewed.current = product.slug;
    track("product_view", {
      value: product.price,
      currency: "USD",
      items: [
        {
          item_id: product.slug,
          item_name: product.name,
          item_category: product.category,
          price: product.price,
          quantity: 1,
        },
      ],
    });
  }, [product.slug, product.price, product.name, product.category]);

  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(true), reduced ? 0 : 420);
    return () => window.clearTimeout(timer);
  }, [reduced]);

  return (
    <>
      {/* Phones: the elevator is capped at ~46svh tall (its width follows
          from the slice's 620/844 aspect). Desktop: unchanged, 32rem wide. */}
      <div className="mx-auto w-full max-w-[min(32rem,calc(46svh*620/844))] lg:col-start-1 lg:row-start-1 lg:mx-0 lg:max-w-[32rem]">
        <DoorFrame
          product={product}
          open={open}
          priority
          className={`${DOOR_ASPECT} w-full`}
        />
      </div>
      {children}
      <div className="mx-auto w-full max-w-[32rem] lg:col-start-1 lg:row-start-2 lg:mx-0 lg:self-start">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-11 w-full items-center justify-center gap-2 border border-cream/20 text-xs uppercase tracking-[0.18em] text-cream/70 transition-colors hover:border-cream/45 hover:text-cream"
        >
          {open ? "Close the doors" : "Open the doors"}
          <span className="sr-only"> to {product.name}</span>
        </button>
      </div>
    </>
  );
}
