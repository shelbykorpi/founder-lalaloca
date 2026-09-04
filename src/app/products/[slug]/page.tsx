import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDoor } from "@/components/door/ProductDoor";
import { AddToBagButton } from "@/components/bag/AddToBagButton";
import { BRAND } from "@/lib/brand";
import { JsonLd, breadcrumbSchema, productSchema } from "@/lib/seo";
import { formatPrice, getProduct, otherProducts, products, SET } from "@/lib/products";
import { getReviews } from "@/lib/reviews";
import { fetchCatalogProduct } from "@/lib/catalog";
import { CatalogProductPage } from "@/components/shop/CatalogProductPage";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

/* A slug the hand-written pages don't claim is tried against Shopify as a
   product handle, so a product created in Shopify admin has a working page
   at /products/<handle> the minute it's published — no deploy, no map entry.
   Re-checked every 60 seconds via the catalog cache. */
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) {
    const catalog = await fetchCatalogProduct(slug);
    if (!catalog) return { title: "Not found" };
    return {
      title: catalog.title,
      description: catalog.hook ?? catalog.descriptor ?? undefined,
      alternates: { canonical: `/products/${catalog.handle}` },
    };
  }
  return {
    title: `${product.name} — ${product.category}`,
    description: `${product.what} ${product.size}, ${formatPrice(product.price)}.`,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.name} — ${product.category}`,
      description: product.what,
      images: [{ url: product.bottle }],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) {
    const catalog = await fetchCatalogProduct(slug);
    if (!catalog) notFound();
    return <CatalogProductPage product={catalog} />;
  }

  /* Null until a review platform is connected. Everything downstream — the
     section below and the rating in the schema — is derived from this, so
     there is no path by which the page can show a rating nobody left. */
  const reviews = getReviews(slug);

  return (
    <>
      {/* Product, the breadcrumb trail rendered below, and the FAQs further
          down the page — all three are eligible for rich results, and give
          answer engines quotable facts rather than prose to paraphrase. */}
      <JsonLd
        schema={[
          productSchema(product, reviews),
          breadcrumbSchema([
            { name: "Shop", path: "/shop" },
            { name: product.name, path: `/products/${product.slug}` },
          ]),
        ]}
      />

      {/* ---------------- Buy ----------------
          The dark room, matching the after-hours plate: browsing and buying
          happen against the wall, not on paper. The long reading (the three
          panels below) is where the page switches to a lit surface. */}
      <section className="bg-night pt-6 md:pt-10">
        <div className="shell">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.16em] text-cream/70">
              <li>
                <Link href="/shop" className="inline-flex min-h-11 items-center hover:text-cream">
                  Shop
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-cream">
                {product.name}
              </li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <ProductDoor product={product} />

            <div className="lg:pt-4">
              {/* The product's energy colour — its alcove in the Serum
                  Salon (teal / amber / red) — as a hairline over the name,
                  so the page and the salon read as one room. */}
              <span
                aria-hidden
                className="mb-4 block h-[2px] w-12"
                style={{ background: product.accent }}
              />
              <h1 className="font-serif text-[clamp(2.5rem,6vw,3.75rem)] leading-none text-cream">
                {product.name}
              </h1>
              {/* Identity first, then the label. The archetype sits beside the
                  category rather than replacing it — the category is the
                  approved label wording and is what a shopper scanning for
                  "vitamin C serum" is actually looking for. */}
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-cream/70">
                <span className="text-champagne">{product.archetype}</span>
                <span aria-hidden> · </span>
                {product.category}
              </p>

              {/* The hero line runs first and the functional description
                  immediately under it, so the page answers "who am I when I
                  use this?" and "what does it do?" in the same glance. The
                  order matters: lifestyle copy that displaces the product
                  description reads as evasion. */}
              {/* One paragraph above the fold — identity and function in the
                  same breath (copy-cut spec, 23 Aug 2026). `hero` and `what`
                  still exist on the product for cards and metadata; the page
                  says it once. */}
              {/* text-blush, matching the hook line's treatment on the
                  after-hours plate — the one serif line that gets its own
                  voice against the room. */}
              <p className="mt-6 max-w-md font-serif text-[clamp(1.375rem,2.4vw,1.75rem)] leading-snug text-blush">
                {product.hook}
              </p>

              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-bronze/20 py-6 text-sm">
                <div>
                  <dt className="eyebrow text-champagne">Size</dt>
                  <dd className="mt-1 text-cream">{product.size}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-champagne">Price</dt>
                  <dd className="mt-1 text-cream">{formatPrice(product.price)}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-champagne">When</dt>
                  <dd className="mt-1 text-cream">{product.timing}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-champagne">In your routine</dt>
                  <dd className="mt-1 text-cream">{product.routine}</dd>
                </div>
              </dl>

              <div className="mt-7 max-w-md">
                {/* Lead action on a dark room is the gold fill, not the
                    charcoal block btn-dark was built for on paper. */}
                <AddToBagButton product={product} className="btn btn-primary w-full" showPrice />
                <p className="mt-3 text-xs leading-relaxed text-cream/70">
                  Free US shipping · Ships from Arizona within one business day ·
                  Secure checkout by Shopify · {BRAND.legal.name} is the seller of record.
                </p>
              </div>


            </div>
          </div>
        </div>
      </section>

      {/* ---------------- The three panels ----------------
          Everything the four old sections said, without saying anything
          twice. Routine position used to appear four times on this page; it
          now appears once, inside "How to use it". The cosmetic-claims
          sentence lives verbatim inside "Who it’s for". FAQs are gone —
          three of the four answers already existed higher on the page and
          the fourth (layering) moved into panel two. */}
      <section className="section bg-shell">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          <h2 className="subhead text-charcoal">The details</h2>
          <div className="max-w-[38rem] border-t border-charcoal/12">
            {[
              { title: "Who it’s for", body: product.panels.who },
              { title: "How to use it", body: product.panels.how },
              { title: "What’s in it", body: product.panels.actives },
            ].map((panel, index) => (
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
            {/* Said once, here, instead of inside every panel. */}
            <p className="pt-5 text-xs leading-relaxed text-charcoal/60">
              Cosmetic product. Results vary from person to person; no clinical
              claims are made.
            </p>
            <div className="flex flex-wrap gap-x-8 py-3 text-sm">
              {[
                { href: "/policies/shipping", label: "Shipping" },
                { href: "/policies/returns", label: "Returns" },
                { href: "/find-your-serum", label: "Which serum?" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex min-h-11 items-center text-charcoal underline underline-offset-4 hover:text-bronze-ink"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Photography ----------------
          Looking, not reading — stays in the room. The placeholder tile is
          night-deep rather than shell now, so a slow-loading shot doesn't
          flash a pale rectangle into the dark room while it comes in. */}
      {product.gallery.length > 0 && (
        <section className="section-tight bg-night">
          <div className="shell grid gap-6 sm:grid-cols-2">
            {product.gallery.map((shot) => (
              <figure key={shot.src}>
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-night-deep">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, 44vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-3 text-xs uppercase tracking-[0.16em] text-cream/60">
                  {shot.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- The other two ----------------
          A cross-sell, not a reading panel — stays in the room. The grid line
          trick (bg on the parent showing through a 1px gap) is rebuilt in
          bronze rather than charcoal, since charcoal-on-charcoal would show
          nothing on a night ground. */}
      <section className="section-tight bg-night pb-16">
        <div className="shell">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="eyebrow text-cream/60">Complete the trio</h2>
            <Link
              href="/shop#set-heading"
              className="inline-flex min-h-11 items-center text-sm text-champagne underline underline-offset-4 hover:text-cream"
            >
              All three for {formatPrice(SET.price)} — save{" "}
              {formatPrice(products.reduce((sum, p) => sum + p.price, 0) - SET.price)}
              <span aria-hidden> ↗</span>
            </Link>
          </div>
          <div className="mt-6 grid gap-px border border-bronze/20 bg-bronze/15 sm:grid-cols-2">
            {otherProducts(product.slug).map((other) => (
              <Link
                key={other.slug}
                href={`/products/${other.slug}`}
                className="group flex items-center gap-5 bg-night p-6 transition-colors hover:bg-cream/5"
              >
                <span className="relative h-24 w-16 shrink-0">
                  <Image
                    src={other.bottle}
                    alt=""
                    fill
                    loading="lazy"
                    sizes="64px"
                    className="object-contain"
                  />
                </span>
                <span className="flex-1">
                  {/* The archetype earns its place here specifically: this is
                      the one module on the page where she is choosing between
                      two products, and "The Entrance" separates them faster
                      than two cosmetic benefit lines can. */}
                  <span className="block text-[0.6875rem] uppercase tracking-[0.16em] text-champagne">
                    {other.archetype}
                  </span>
                  <span className="mt-1 block font-serif text-2xl leading-none text-cream">
                    {other.name}
                  </span>
                  <span className="mt-2 block text-sm text-cream/70">
                    {other.benefit}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="text-champagne transition-transform duration-300 group-hover:translate-x-1"
                >
                  ↗
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
