"use client";

import { AddToBagButton } from "@/components/bag/AddToBagButton";
import { useSelectedShade } from "./PlateShades";
import type { NextMoveProduct } from "@/lib/nextMove";

/**
 * THE PLATE'S BUY BUTTON.
 *
 * A thin client wrapper so the plate — a server component — can put a real
 * add-to-bag under the copy. For a shaded SKU it reads the shade the shopper
 * is looking at (the same context the picture and chips read) and adds THAT
 * variant, so the bag matches the frame. For a single-variant SKU there is no
 * provider, `useSelectedShade` returns null, and the product's own variant is
 * used. It never renders a button without a variant to sell.
 */
export function PlateBuyButton({
  product,
  className = "btn btn-primary mt-5 w-full max-w-[20rem]",
}: {
  product: NextMoveProduct;
  className?: string;
}) {
  const shade = useSelectedShade();
  const variantId = shade?.variantId ?? product.variantId;
  if (!variantId) return null;

  const name = shade ? `${product.name} · ${shade.code} ${shade.name}` : product.name;

  return (
    <AddToBagButton
      product={{
        slug: variantId,
        name,
        category: product.category,
        price: product.price,
        size: product.size,
        bottle: shade?.hero.src ?? product.pack.src,
      }}
      href={`/products/${product.slug}`}
      className={className}
      showPrice
    />
  );
}
