import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DoorCard } from "@/components/door/DoorCard";
import { ScrollDoors } from "@/components/door/ScrollDoors";
import { AddSetButton } from "@/components/bag/AddToBagButton";
import { PageIntro } from "@/components/site/PageIntro";
import { formatPrice, products, SET } from "@/lib/products";
import { JsonLd, breadcrumbSchema, collectionSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Shop the LALALOCA Collection",
  description:
    "Three serums — Thirst Trap, C Me Glow and Bounce Back. 50 ml, $39.99 each, free US shipping. What each one does, and how to pick.",
  /* Without this the root layout's canonical is inherited and this page tells
     Google the homepage is the real version of it — the fastest way to get a
     commercial page dropped from the index. */
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <>
      {/* The collection as a ranked list, so the three serums can surface
          together rather than competing as three unrelated pages. */}
      <JsonLd
        schema={[
          collectionSchema(products),
          breadcrumbSchema([{ name: "Shop", path: "/shop" }]),
        ]}
      />
      <PageIntro
        eyebrow="The LALALOCA Collection"
        title="Open the doors. You’re already in the room."
        lede="Three serums behind three doors, and nothing standing in front of them. Start with the one that matches what your skin actually does — not the one with the best story."
      >
        <Link href="/find-your-serum" className="link-underline mt-4 text-charcoal">
          Answer three questions instead <span aria-hidden>↗</span>
        </Link>
      </PageIntro>

      <section className="section bg-cream pt-4" aria-label="Serums">
        <ScrollDoors className="shell grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <DoorCard
              key={product.slug}
              product={product}
              index={index}
              priority={index === 0}
            />
          ))}
        </ScrollDoors>
      </section>

      {/* ---------------- Comparison ---------------- */}
      <section className="section-tight bg-shell" aria-labelledby="compare-heading">
        <div className="shell">
          <h2 id="compare-heading" className="subhead text-charcoal">
            Side by side
          </h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
              <caption className="sr-only">
                The three LALALOCA serums compared by what they are for, when to use
                them, where they sit in a routine, size and price.
              </caption>
              <thead>
                <tr className="border-b border-charcoal/20">
                  <th scope="col" className="py-4 pr-6 eyebrow font-normal text-charcoal/70">
                    Serum
                  </th>
                  <th scope="col" className="py-4 pr-6 eyebrow font-normal text-charcoal/70">
                    Use it if
                  </th>
                  <th scope="col" className="py-4 pr-6 eyebrow font-normal text-charcoal/70">
                    When
                  </th>
                  <th scope="col" className="py-4 pr-6 eyebrow font-normal text-charcoal/70">
                    Key active on the label
                  </th>
                  <th scope="col" className="py-4 eyebrow font-normal text-charcoal/70">
                    Size · price
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.slug} className="border-b border-charcoal/12 align-top">
                    <th scope="row" className="py-5 pr-6 font-serif text-2xl font-normal">
                      <Link
                        href={`/products/${product.slug}`}
                        className="text-charcoal hover:text-bronze-ink"
                      >
                        {product.name}
                      </Link>
                      <span className="mt-1 block text-xs uppercase tracking-[0.14em] text-charcoal/70">
                        {product.category}
                      </span>
                    </th>
                    <td className="py-5 pr-6 text-charcoal/80">{product.need}</td>
                    <td className="py-5 pr-6 text-charcoal/80">{product.timing}</td>
                    <td className="py-5 pr-6 text-charcoal/80">{product.keyActive}</td>
                    <td className="py-5 text-charcoal/80">
                      {product.size}
                      <br />
                      {formatPrice(product.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-charcoal/70">
            Key actives are listed exactly as they appear on the approved label. Full
            INCI lists ship with every carton and are available on request.
          </p>
        </div>
      </section>

      {/* ---------------- All three: the FOUNDER parlour ----------------
          One photographed room — the serum counters like a gelateria, the
          three bottles on marble, and a gold-framed marble tariff board. The
          board's text and button are LIVE, laid over the cleaned photograph,
          so the price comes from products.ts and the button really adds the
          trio to the bag. */}
      <section aria-labelledby="set-heading" className="bg-cream">
        {/* Desktop: the full parlour, live copy set into the tariff board */}
        <div className="relative hidden lg:block">
          <div className="relative aspect-[1915/821] w-full">
            <Image
              src="/editorial/trio-parlor.webp"
              alt="The FOUNDER parlour: three serum counters under glass like a gelateria — turquoise, red and orange — with the three LALALOCA bottles standing on a marble table."
              fill
              loading="lazy"
              sizes="100vw"
              className="object-cover"
            />
            <div
              className="absolute flex flex-col items-center justify-center text-center"
              style={{ left: "67.9%", width: "28.2%", top: "14%", height: "73.9%" }}
            >
              <p className="eyebrow text-bronze-ink">The House Trio</p>
              <h2
                id="set-heading"
                className="mt-[0.6em] font-serif text-[clamp(1.5rem,2.7vw,3.25rem)] leading-[1.05] text-charcoal"
              >
                Treat Yourself
                <br />
                to All Three
              </h2>
              <div className="mt-[1.2em] h-px w-16 bg-bronze/70" aria-hidden />
              <p className="mt-[1.2em] max-w-[24ch] text-[clamp(0.8rem,1.05vw,1.125rem)] leading-relaxed text-charcoal/85">
                Three full-size serums. Hydrate, firm, brighten. One order. No
                choosing.
              </p>
              <p className="mt-[1em] text-[clamp(0.8rem,1.05vw,1.125rem)] text-charcoal/85">
                {formatPrice(SET.price)} for all three · valued at{" "}
                {formatPrice(products.reduce((sum, p) => sum + p.price, 0))}
              </p>
              <AddSetButton className="mt-[1.4em] inline-flex min-h-11 w-full max-w-[22rem] items-center justify-center border border-bronze/40 bg-founder-green px-6 text-[clamp(0.6875rem,0.85vw,0.875rem)] uppercase tracking-[0.18em] text-cream transition-colors hover:bg-teal" />
            </div>
          </div>
        </div>

        {/* Small screens: the counters as a banner, the board as a card */}
        <div className="lg:hidden">
          <div className="relative aspect-[1215/821] w-full">
            <Image
              src="/editorial/trio-parlor-counter.webp"
              alt="The FOUNDER parlour: three serum counters under glass like a gelateria — turquoise, red and orange — with the three LALALOCA bottles standing on a marble table."
              fill
              loading="lazy"
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="shell py-12 text-center">
            <p className="eyebrow text-bronze-ink">The House Trio</p>
            <h2 className="headline mt-4 text-balance text-charcoal">
              Treat Yourself to All Three
            </h2>
            <div className="mx-auto mt-6 h-px w-16 bg-bronze/70" aria-hidden />
            <p className="mx-auto mt-6 max-w-md text-charcoal/85">
              Three full-size serums. Hydrate, firm, brighten. One order. No choosing.
            </p>
            <p className="mt-4 text-charcoal/85">
              {formatPrice(SET.price)} for all three · valued at{" "}
              {formatPrice(products.reduce((sum, p) => sum + p.price, 0))}
            </p>
            <AddSetButton className="btn mt-8 w-full border border-bronze/40 bg-founder-green text-cream hover:bg-teal sm:w-auto" />
          </div>
        </div>
      </section>

      {/* ---------------- Shipping and returns ---------------- */}
      <section className="section-tight bg-cream">
        <div className="shell grid gap-8 border-t border-charcoal/12 pt-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h2 className="font-serif text-2xl text-charcoal">Shipping</h2>
            <p className="mt-2 text-sm text-charcoal/80">
              Free US shipping on every order, 3–5 business days. Express is $15 and
              takes 1–2. Packed and sent from Arizona.
            </p>
            <Link href="/policies/shipping" className="link-underline mt-2 text-charcoal">
              Details <span aria-hidden>↗</span>
            </Link>
          </div>
          <div>
            <h2 className="font-serif text-2xl text-charcoal">Returns</h2>
            <p className="mt-2 text-sm text-charcoal/80">
              Damaged or not what you expected? Write to us and we’ll sort it out.
              Opened cosmetics have rules; a genuine problem is still our problem.
            </p>
            <Link href="/policies/returns" className="link-underline mt-2 text-charcoal">
              Details <span aria-hidden>↗</span>
            </Link>
          </div>
          <div>
            <h2 className="font-serif text-2xl text-charcoal">What these are</h2>
            <p className="mt-2 text-sm text-charcoal/80">
              Cosmetic products, not medicine. No clinical claims, no before-and-afters,
              no reviews we wrote ourselves.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
