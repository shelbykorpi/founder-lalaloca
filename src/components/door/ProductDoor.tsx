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
 */
export function ProductDoor({ product }: { product: Product }) {
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState(false);

  /* Guarded so React's development double-invoke doesn't count the view twice. */
  const viewed = useRef<string | null>(null);
  useEffect(() => {
    if (viewed.current === product.slug) return;
    viewed.current = product.slug;
    track("product_view", { product: product.slug, value: product.price });
  }, [product.slug, product.price]);

  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(true), reduced ? 0 : 420);
    return () => window.clearTimeout(timer);
  }, [reduced]);

  return (
    <div className="mx-auto w-full max-w-[32rem] lg:mx-0">
      <DoorFrame
        product={product}
        open={open}
        priority
        className={`${DOOR_ASPECT} w-full`}
      />
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 border border-charcoal/15 text-[0.6875rem] uppercase tracking-[0.18em] text-charcoal/75 transition-colors hover:border-charcoal/40 hover:text-charcoal"
      >
        {open ? "Close the doors" : "Open the doors"}
        <span className="sr-only"> to {product.name}</span>
      </button>
    </div>
  );
}
