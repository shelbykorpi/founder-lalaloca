"use client";

import { useEffect, useRef } from "react";
import { itemBrandFor, track } from "@/lib/analytics";

/**
 * GA4 view_item for a product page rendered on the server (clarity audit,
 * 11 Oct 2026: the five FOUNDER Collection pages fired no product view, so
 * their funnel started at add_to_cart). Renders nothing; runs once.
 */
export function TrackProductView({
  id,
  name,
  category,
  price,
}: {
  id: string;
  name: string;
  category: string;
  price: number;
}) {
  const sent = useRef<string | null>(null);
  useEffect(() => {
    if (sent.current === id) return;
    sent.current = id;
    track("product_view", {
      value: price,
      currency: "USD",
      items: [{ item_id: id, item_name: name, item_category: category, item_brand: itemBrandFor(id), price, quantity: 1 }],
    });
  }, [id, name, category, price]);
  return null;
}
