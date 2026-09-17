import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NEXT_MOVE } from "@/lib/nextMove";
import { ProductPlate, plateMetadata } from "@/components/house/ProductPlate";

/* One of three routes over the shared plate. The record in nextMove.ts is the
   single source of truth; this file only names it.

   It rendered `shop/ProductDetail` — the cream template — until 30 August,
   when the plate was promoted over it. ProductDetail and ShadePicker were
   deleted on 17 Sept 2026 once nothing rendered them. */
const product = NEXT_MOVE.find((p) => p.slug === "clean-break");

/* The plate asks Shopify whether its variants can still be sold, and the
   answer is cached sixty seconds; the page revalidates on the same clock so
   a sold-out button is never more than a minute behind the till. */
export const revalidate = 60;

export const metadata: Metadata = product
  ? plateMetadata(product)
  : { title: "Not found" };

export default function Page() {
  if (!product) notFound();
  return <ProductPlate product={product} />;
}
