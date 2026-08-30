import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NEXT_MOVE } from "@/lib/nextMove";
import { ProductPlate, plateMetadata } from "@/components/house/ProductPlate";

/* One of three routes over the shared after-hours plate. The record in
   nextMove.ts is the single source of truth; this file only names it. */
const product = NEXT_MOVE.find((p) => p.slug === "double-take");

export const metadata: Metadata = product
  ? plateMetadata(product)
  : { title: "Not found" };

export default function Page() {
  if (!product) notFound();
  return <ProductPlate product={product} />;
}
