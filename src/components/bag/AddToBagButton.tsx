"use client";

import { useBag } from "./BagProvider";
import { track } from "@/lib/analytics";
import { formatPrice, SET, type Product } from "@/lib/products";

type Props = {
  product: Pick<Product, "slug" | "name" | "category" | "price" | "size" | "bottle">;
  className?: string;
  showPrice?: boolean;
  label?: string;
  /** Shopify says this variant cannot be sold. Pass availableForSale === false. */
  soldOut?: boolean;
};

export function AddToBagButton({
  product,
  className = "btn btn-dark",
  showPrice = false,
  label = "Add to bag",
  soldOut = false,
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
          href: `/products/${product.slug}`,
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
