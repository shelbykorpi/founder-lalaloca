import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NEXT_MOVE } from "@/lib/nextMove";
import { ProductPlate, plateMetadata } from "@/components/house/ProductPlate";

/* Board slot 01, THE OPENER. A name with no supplier until 30 August; now the
   fourth route over the shared plate. The record in nextMove.ts is the single
   source of truth; this file only names it. */
const product = NEXT_MOVE.find((p) => p.slug === "opening-line");

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
