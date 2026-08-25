import Image from "next/image";
import Link from "next/link";
import { CAMPAIGN, type NextMoveProduct } from "@/lib/nextMove";
import { SITE } from "@/lib/brand";
import { JsonLd, breadcrumbSchema } from "@/lib/seo";
import { ShadePicker } from "@/components/shop/ShadePicker";

/**
 * One template, three products.
 *
 * Until 25 August every collection card pointed at /the-next-move, so a
 * shopper who clicked Clean Break landed on a page about three products and
 * had to find hers again. Each SKU now has its own route and this renders it.
 *
 * A SHARED TEMPLATE, NOT THREE LAYOUTS: the differences between these
 * products are facts, not design. Three hand-built pages would drift the way
 * the hand-built LALALOCA pages did — 24-word hook on one, none on another —
 * which is the whole reason the copy cut happened.
 *
 * NO SCHEMA.ORG PRODUCT MARKUP HERE, deliberately. A Product offer wants a
 * price and availability; these have neither, and publishing an Offer with
 * an invented price is exactly the class of error the price guard exists to
 * catch. Breadcrumbs only until a real price exists.
 *
 * NOTHING IS CHARGED. The CTA scrolls to the campaign page's reservation
 * form. No card is taken, so the FTC Mail Order Rule's 30-day clock never
 * starts against a ship date nobody can name.
 */
export function ProductDetail({ product }: { product: NextMoveProduct }) {
  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "The FOUNDER Collection", path: "/founder-collection" },
            { name: product.name, path: `/products/${product.slug}` },
          ]),
        ]}
      />

      <section className="bg-cream pt-6 md:pt-10">
        <div className="shell">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.16em] text-charcoal/70">
              <li>
                <Link
                  href="/founder-collection"
                  className="inline-flex min-h-11 items-center hover:text-charcoal"
                >
                  The FOUNDER Collection
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-charcoal">
                {product.name}
              </li>
            </ol>
          </nav>

          <div className="grid gap-12 pb-14 pt-4 md:pb-20 lg:grid-cols-[1fr_minmax(0,26rem)] lg:gap-16">
            {/* ── The product, alone ────────────────────────────────────
                A shade range gets the picker, which shows the SELECTED
                shade — never the family shot. A shopper who chose one
                product should not land on a picture of three. */}
            <div>
              {product.shades ? (
                <ShadePicker
                  shades={product.shades}
                  accent={product.stripes.b}
                  priority
                />
              ) : (
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-shell">
                  <Image
                    src={product.detailHero.src}
                    alt={product.detailHero.alt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-1"
                    style={{ background: product.stripes.b }}
                  />
                </div>
              )}
            </div>

            <div className="lg:pt-2">
              <p className="eyebrow text-bronze-ink">{CAMPAIGN.name}</p>
              <h1 className="mt-3 font-serif text-[clamp(2.25rem,5vw,3.25rem)] leading-none text-charcoal">
                {product.name}
              </h1>
              <p className="mt-3 text-sm uppercase tracking-[0.16em] text-charcoal/70">
                {product.category}
              </p>

              <hr className="my-7 h-px w-16 border-0 bg-bronze" />

              <p className="font-serif text-2xl leading-snug text-charcoal">
                {product.hook}
              </p>
              <p className="mt-6 max-w-prose text-[1.0625rem] leading-relaxed text-charcoal/85">
                {product.description}
              </p>

              <ul className="mt-7 space-y-2 border-t border-charcoal/12 pt-6 text-sm text-charcoal/85">
                {product.benefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>

              <dl className="mt-7 grid gap-x-8 gap-y-4 border-t border-charcoal/12 pt-6 sm:grid-cols-2">
                <div>
                  <dt className="eyebrow text-charcoal/60">Size</dt>
                  <dd className="mt-1 text-charcoal">{product.size}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-charcoal/60">Key ingredients</dt>
                  <dd className="mt-1 text-charcoal">
                    {product.keyIngredients.join(" · ")}
                  </dd>
                </div>
                {product.shades && (
                  <div>
                    <dt className="eyebrow text-charcoal/60">Shades</dt>
                    <dd className="mt-1 text-charcoal">
                      {product.shades.map((s) => `${s.code} ${s.name}`).join(" · ")}
                    </dd>
                  </div>
                )}
                {product.facts && (
                  <div>
                    <dt className="eyebrow text-charcoal/60">Also</dt>
                    <dd className="mt-1 text-charcoal">
                      {product.facts.join(" · ")}
                    </dd>
                  </div>
                )}
              </dl>

              {/* ── Reserve ──────────────────────────────────────────────
                  Says what a reservation is before the button, not after. */}
              <div className="mt-9 max-w-md">
                <div className="border-l-2 border-bronze bg-shell/60 py-4 pl-5">
                  <p className="text-sm text-charcoal/85">
                    {product.reservationStatus}
                  </p>
                </div>
                <Link
                  href="/the-next-move#reserve"
                  className="btn btn-dark mt-5 w-full"
                >
                  {product.detailCta}
                </Link>
                <p className="mt-3 text-xs leading-relaxed text-charcoal/70">
                  We&rsquo;ll write to you with the price and a ship date before
                  anything is sold, and you can walk away at that point.
                </p>
              </div>

              {/* The thing she would otherwise have to assume. */}
              {product.sunNote && (
                <p className="mt-7 max-w-md border-l-2 border-bronze bg-shell/60 py-4 pl-5 text-xs leading-relaxed text-charcoal/85">
                  {product.sunNote}
                </p>
              )}

              <p className="mt-6 max-w-md text-xs leading-relaxed text-charcoal/70">
                {product.plainly}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Meet the shades ───────────────────────────────────────────────
          The family shot has a home here rather than as the hero, so the
          range is still visible without displacing the chosen shade. */}
      {product.shades && (
        <section className="bg-shell py-14 md:py-16" aria-labelledby="shades-heading">
          <div className="shell">
            <h2 id="shades-heading" className="eyebrow text-charcoal/70">
              Meet the shades
            </h2>
            <div className="relative mt-6 aspect-[3/2] w-full overflow-hidden">
              <Image
                src={product.scene.src}
                alt={product.scene.alt}
                fill
                loading="lazy"
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* ── Back to the campaign ─────────────────────────────────────────── */}
      <section className="bg-cream py-14 md:py-16">
        <div className="shell max-w-3xl">
          <p className="text-charcoal/85">
            {product.name} is one of three in {CAMPAIGN.name}.
          </p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:gap-8">
            <Link href="/the-next-move" className="link-underline text-charcoal">
              See all three in {CAMPAIGN.name} <span aria-hidden>↗</span>
            </Link>
            <Link
              href="/founder-collection"
              className="link-underline text-charcoal"
            >
              The whole line <span aria-hidden>↗</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/** Shared metadata builder, so three routes cannot describe themselves differently. */
export function productMetadata(product: NextMoveProduct) {
  return {
    title: `${product.name} — ${product.category}`,
    description: product.description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.name} — ${product.category}`,
      description: product.description,
      images: [{ url: `${SITE.url}${product.detailHero.src}` }],
      type: "website" as const,
    },
  };
}
