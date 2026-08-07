import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDoor } from "@/components/door/ProductDoor";
import { AddToBagButton } from "@/components/bag/AddToBagButton";
import { BRAND } from "@/lib/brand";
import { JsonLd, breadcrumbSchema, faqSchema, productSchema } from "@/lib/seo";
import { formatPrice, getProduct, otherProducts, products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Not found" };
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
  if (!product) notFound();

  return (
    <>
      {/* Product, the breadcrumb trail rendered below, and the FAQs further
          down the page — all three are eligible for rich results, and give
          answer engines quotable facts rather than prose to paraphrase. */}
      <JsonLd
        schema={[
          productSchema(product),
          breadcrumbSchema([
            { name: "Shop", path: "/shop" },
            { name: product.name, path: `/products/${product.slug}` },
          ]),
          faqSchema(product.faqs),
        ]}
      />

      {/* ---------------- Buy ---------------- */}
      <section className="bg-cream pt-6 md:pt-10">
        <div className="shell">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.16em] text-charcoal/70">
              <li>
                <Link href="/shop" className="inline-flex min-h-11 items-center hover:text-charcoal">
                  Shop
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-charcoal">
                {product.name}
              </li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <ProductDoor product={product} />

            <div className="lg:pt-4">
              <h1 className="font-serif text-[clamp(2.5rem,6vw,3.75rem)] leading-none text-charcoal">
                {product.name}
              </h1>
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-charcoal/70">
                {product.category}
              </p>

              <p className="mt-6 max-w-md text-[1.0625rem] leading-relaxed text-charcoal/85">
                {product.what}
              </p>

              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-charcoal/12 py-6 text-sm">
                <div>
                  <dt className="eyebrow text-charcoal/70">Size</dt>
                  <dd className="mt-1 text-charcoal">{product.size}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-charcoal/70">Price</dt>
                  <dd className="mt-1 text-charcoal">{formatPrice(product.price)}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-charcoal/70">When</dt>
                  <dd className="mt-1 text-charcoal">{product.timing}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-charcoal/70">In your routine</dt>
                  <dd className="mt-1 text-charcoal">{product.routine}</dd>
                </div>
              </dl>

              <div className="mt-7 max-w-md">
                <AddToBagButton product={product} className="btn btn-dark w-full" showPrice />
                <p className="mt-3 text-xs leading-relaxed text-charcoal/70">
                  You’ll finish your order on Shopify’s secure checkout. Cosmetic
                  product. {BRAND.legal.name} is the seller of record.
                </p>
              </div>


            </div>
          </div>
        </div>
      </section>

      {/* ---------------- What it's for ---------------- */}
      <section className="section bg-shell">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          <h2 className="subhead text-charcoal">Who it’s for</h2>
          <div className="max-w-[38rem]">
            <p className="text-[1.0625rem] leading-[1.8] text-charcoal/85">{product.need}</p>
            <p className="mt-5 leading-[1.8] text-charcoal/80">{product.who}</p>
            <p className="mt-5 border-l-2 border-bronze/40 pl-5 font-serif text-xl leading-snug text-charcoal">
              {product.moment}
            </p>
            <p className="mt-6 text-xs text-charcoal/70">
              Cosmetic benefits only, and skin varies. No clinical results are claimed.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- How to use ---------------- */}
      <section className="section bg-cream">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          <div>
            <h2 className="subhead text-charcoal">How to use it</h2>
            <p className="mt-4 max-w-sm text-sm text-charcoal/80">
              {product.timing}. {product.routine}
            </p>
          </div>
          <ol className="grid gap-px bg-charcoal/10 sm:grid-cols-3">
            {product.howToUse.map((step, index) => (
              <li key={step.step} className="bg-cream p-6">
                <span className="eyebrow text-bronze-ink">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-serif text-2xl leading-tight text-charcoal">
                  {step.step}
                </h3>
                <p className="mt-2 text-sm text-charcoal/80">{step.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- What's in it ---------------- */}
      <section className="section bg-charcoal text-shell">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          <h2 className="subhead">What’s in it</h2>
          <div className="max-w-[38rem]">
            <p className="eyebrow text-bronze">On the label</p>
            <p className="mt-3 text-[1.0625rem] leading-relaxed">{product.keyActive}</p>

            <p className="eyebrow mt-8 text-bronze">Full ingredient list</p>
            {product.ingredients ? (
              <p className="mt-3 text-sm leading-relaxed text-shell/80">
                {product.ingredients.join(", ")}
              </p>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-shell/80">
                Every batch ships with its full INCI list on the carton. Ask us and
                we’ll send you the one for the batch you’d be buying — we quote it from
                the supplier sheet rather than from memory.
              </p>
            )}

            {product.texture && (
              <>
                <p className="eyebrow mt-8 text-bronze">Texture</p>
                <p className="mt-3 text-sm leading-relaxed text-shell/80">
                  {product.texture}
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ---------------- Photography ---------------- */}
      {product.gallery.length > 0 && (
        <section className="section-tight bg-cream">
          <div className="shell grid gap-6 sm:grid-cols-2">
            {product.gallery.map((shot) => (
              <figure key={shot.src}>
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-shell">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, 44vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-3 text-xs uppercase tracking-[0.16em] text-charcoal/70">
                  {shot.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- FAQs ---------------- */}
      <section className="section bg-shell">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          <h2 className="subhead text-charcoal">Questions</h2>
          <div className="border-t border-charcoal/12">
            {product.faqs.map((faq) => (
              <details key={faq.q} className="group border-b border-charcoal/12">
                <summary className="flex min-h-[3.5rem] cursor-pointer list-none items-center justify-between gap-6 py-4 font-serif text-xl text-charcoal marker:content-none">
                  {faq.q}
                  <span
                    aria-hidden
                    className="shrink-0 text-bronze-ink transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-5 pr-10 text-sm leading-relaxed text-charcoal/80">
                  {faq.a}
                </p>
              </details>
            ))}
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

      {/* ---------------- The other two ---------------- */}
      <section className="section-tight bg-cream pb-16">
        <div className="shell">
          <h2 className="eyebrow text-charcoal/70">The other two</h2>
          <div className="mt-6 grid gap-px border border-charcoal/10 bg-charcoal/10 sm:grid-cols-2">
            {otherProducts(product.slug).map((other) => (
              <Link
                key={other.slug}
                href={`/products/${other.slug}`}
                className="group flex items-center gap-5 bg-cream p-6 transition-colors hover:bg-shell"
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
                  <span className="block font-serif text-2xl leading-none text-charcoal">
                    {other.name}
                  </span>
                  <span className="mt-2 block text-sm text-charcoal/80">
                    {other.benefit}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="text-bronze-ink transition-transform duration-300 group-hover:translate-x-1"
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
