import { BRAND } from "@/lib/brand";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og";
import { formatPrice, getProduct, products } from "@/lib/products";

/**
 * A card per serum, carrying the name, the category as printed on the label,
 * and the price. Someone forwarding a product link in a message is usually
 * answering "which one is it and what does it cost" — the card should answer
 * that before the page loads.
 */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/* One image per product. Deliberately NOT using generateImageMetadata: it adds
   a second dynamic segment ([__metadata_id__]) to the route for the sake of a
   per-image alt string, and one card per slug is all this needs. */
export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export const alt = `${BRAND.collectionFull} — a serum from ${BRAND.display}`;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return ogCard({ eyebrow: BRAND.collectionFull, title: BRAND.campaign });
  }

  return ogCard({
    eyebrow: BRAND.collectionFull,
    title: product.name,
    footnote: `${product.category} · ${product.size} · ${formatPrice(product.price)}`,
  });
}
