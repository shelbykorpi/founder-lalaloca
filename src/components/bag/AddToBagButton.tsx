"use client";

import { useBag } from "./BagProvider";
import { track } from "@/lib/analytics";
import { formatPrice, SET } from "@/lib/products";

/**
 * Structural, not `Pick<Product, ...>`: the FOUNDER Collection lives in its
 * own file with its own type, and both lines put things in the same bag. The
 * button only ever needed these six fields.
 */
type BagProduct = {
  slug: string;
  name: string;
  category: string;
  price: number;
  size: string;
  bottle: string;
};

type Props = {
  product: BagProduct;
  className?: string;
  showPrice?: boolean;
  label?: string;
  /** Shopify says this variant cannot be sold. Pass availableForSale === false. */
  soldOut?: boolean;
  /**
   * Where the bag drawer links this line. Defaults to the LALALOCA product
   * route; the FOUNDER Collection has no per-product page, so it passes its
   * own path rather than pointing at a 404.
   */
  href?: string;
};

export function AddToBagButton({
  product,
  className = "btn btn-dark",
  showPrice = false,
  label = "Add to bag",
  soldOut = false,
  href,
}: Props) {
  const { add } = useBag();

  if (soldOut) {
    return (
      <button type="button" className={className} disabled aria-disabled>
        Sold out
        <span className="sr-only"> — {product.name}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        add({
          id: product.slug,
          name: product.name,
          category: product.category,
          price: product.price,
          size: product.size,
          image: product.bottle,
          href: href ?? `/products/${product.slug}`,
        });
        track("add_to_cart", {
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
      }}
    >
      {showPrice ? `${label} · ${formatPrice(product.price)}` : label}
      <span className="sr-only"> — {product.name}</span>
    </button>
  );
}

export function AddSetButton({
  className = "btn btn-dark",
  price = SET.price,
  soldOut = false,
}: {
  className?: string;
  /** Live Shopify price for the set. Falls back to the catalogue price. */
  price?: number;
  soldOut?: boolean;
}) {
  const { add } = useBag();

  if (soldOut) {
    return (
      <button type="button" className={className} disabled aria-disabled>
        Sold out
      </button>
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        add({
          id: "all-three",
          name: "All three serums",
          category: SET.detail,
          price,
          size: "3 × 50 ml",
          image: SET.image,
          href: "/shop",
        });
        track("add_to_cart", {
          value: price,
          currency: "USD",
          items: [
            {
              item_id: "all-three",
              item_name: "All three serums",
              item_category: SET.detail,
              price,
              quantity: 1,
            },
          ],
        });
      }}
    >
      Add all three · {formatPrice(price)}
    </button>
  );
}
