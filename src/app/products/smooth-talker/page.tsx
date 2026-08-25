import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NEXT_MOVE } from "@/lib/nextMove";
import { ProductDetail, productMetadata } from "@/components/shop/ProductDetail";

/* One of three routes over the shared FOUNDER product-detail template.
   The record is the single source of truth; this file only names it. */
const product = NEXT_MOVE.find((p) => p.slug === "smooth-talker");

export const metadata: Metadata = product
  ? productMetadata(product)
  : { title: "Not found" };

export default function Page() {
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
