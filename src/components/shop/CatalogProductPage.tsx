import Image from "next/image";
import Link from "next/link";
import { AddToBagButton } from "@/components/bag/AddToBagButton";
import { JsonLd, breadcrumbSchema } from "@/lib/seo";
import { SITE } from "@/lib/brand";
import { formatPrice } from "@/lib/products";
import type { CatalogProduct } from "@/lib/catalog";

/**
 * The self-publishing detail page — the copy-cut template's fixed stack:
 * breadcrumb · gallery · character + name · descriptor · price · hook ·
 * add to bag with the price inside · shipping line · three panels.
 * Nothing else, and nothing invented: a panel whose metafield is empty in
 * Shopify simply does not render.
 *
 * This template renders any Shopify product the hand-written pages don't
 * claim — /products/[slug] falls through to it — so a product created in
 * Shopify admin has a working page the minute it's published.
 */
export function CatalogProductPage({ product }: { product: CatalogProduct }) {
  const panels = [
    { title: "Who it’s for", body: product.who },
    { title: "How to use it", body: product.how },
    { title: "What’s in it", body: product.actives },
  ].filter((panel): panel is { title: string; body: string } => Boolean(panel.body));

  return (
    <>
      <JsonLd
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            description: product.hook ?? product.descriptor ?? undefined,
            image: product.image?.url,
            url: `${SITE.url}/products/${product.handle}`,
            offers: {
              "@type": "Offer",
              price: product.price.toFixed(2),
              priceCurrency: "USD",
              availability: product.available
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
              url: `${SITE.url}/products/${product.handle}`,
            },
          },
          breadcrumbSchema([
            { name: "The FOUNDER Collection", path: "/founder-collection" },
            { name: product.title, path: `/products/${product.handle}` },
          ]),
        ]}
      />

      {/* Dark room: browse and buy against the wall, same as the hand-built
          product page. The three panels (long reading — who it's for, how to
          use it, what's in it) move to their own paper section below rather
          than staying in this one, so the ingredient reading still happens on
          a lit surface instead of night. */}
      <section className="bg-night pt-6 md:pt-10">
        <div className="shell">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.16em] text-cream/70">
              <li>
                <Link
                  href="/founder-collection"
                  className="inline-flex min-h-11 items-center hover:text-cream"
                >
                  The FOUNDER Collection
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-cream">
                {product.title}
              </li>
            </ol>
          </nav>

          <div className="grid gap-10 pb-14 lg:grid-cols-[0.95fr_1fr] lg:gap-16">
            <div
              className="relative aspect-square w-full overflow-hidden"
              style={{ background: product.door ?? "var(--color-shell, #f4ece2)" }}
            >
              {product.image && (
                <Image
                  src={product.image.url}
                  alt={product.image.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              )}
              {product.badge && (
                <span className="absolute left-4 top-4 bg-cream/95 px-3 py-1 text-[0.625rem] uppercase tracking-[0.18em] text-charcoal">
                  {product.badge}
                </span>
              )}
            </div>

            <div className="lg:pt-4">
              {product.character && (
                <p className="eyebrow text-champagne">{product.character}</p>
              )}
              <h1 className="mt-3 font-serif text-[clamp(2.5rem,6vw,3.75rem)] leading-none text-cream">
                {product.title}
              </h1>
              {product.descriptor && (
                <p className="mt-3 text-sm uppercase tracking-[0.16em] text-cream/70">
                  {product.descriptor}
                </p>
              )}
              <p className="mt-4 text-cream">{formatPrice(product.price)}</p>

              {product.hook && (
                <p className="mt-6 max-w-md font-serif text-[clamp(1.375rem,2.4vw,1.75rem)] leading-snug text-blush">
                  {product.hook}
                </p>
              )}

              <div className="mt-7 max-w-md">
                <AddToBagButton
                  product={{
                    slug: product.variantId,
                    name: product.title,
                    category: product.descriptor ?? "",
                    price: product.price,
                    size: "",
                    bottle: product.image?.url ?? "",
                  }}
                  href={`/products/${product.handle}`}
                  className="btn btn-primary w-full"
                  soldOut={!product.available}
                  showPrice
                />
                <p className="mt-3 text-xs leading-relaxed text-cream/70">
                  Free US shipping · Secure checkout by Shopify · Cosmetic product.
                  See{" "}
                  <Link
                    className="underline underline-offset-2 hover:opacity-70"
                    href="/policies/shipping"
                  >
                    shipping
                  </Link>{" "}
                  and{" "}
                  <Link
                    className="underline underline-offset-2 hover:opacity-70"
                    href="/policies/returns"
                  >
                    returns
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The panels are the long reading on this page — INCI-adjacent detail
          a shopper reads for more than a sentence — so they get paper, same
          as "The details" on the hand-built product page. */}
      {panels.length > 0 && (
        <section className="section-tight bg-shell">
          <div className="shell">
            <div className="max-w-md border-t border-charcoal/12">
              {panels.map((panel, index) => (
                <details
                  key={panel.title}
                  open={index === 0}
                  className="group border-b border-charcoal/12"
                >
                  <summary className="flex min-h-[3.5rem] cursor-pointer list-none items-center justify-between gap-6 py-4 font-serif text-xl text-charcoal marker:content-none">
                    {panel.title}
                    <span
                      aria-hidden
                      className="shrink-0 text-bronze-ink transition-transform duration-300 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="pb-5 pr-10 text-[0.9375rem] leading-relaxed text-charcoal/85">
                    {panel.body}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
