import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DoorCard } from "@/components/door/DoorCard";
import { ScrollDoors } from "@/components/door/ScrollDoors";
import { AddSetButton } from "@/components/bag/AddToBagButton";
import { PageIntro } from "@/components/site/PageIntro";
import { formatPrice, products, SET } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop the LALALOCA Collection",
  description:
    "Three serums — Thirst Trap, C Me Glow and Bounce Back. 50 ml, $39.99 each, free US shipping. What each one does, and how to pick.",
};

export default function ShopPage() {
  return (
    <>
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

      {/* ---------------- All three ---------------- */}
      <section className="section bg-charcoal text-shell">
        <div className="shell grid items-center gap-10 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-16">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden bg-ink lg:mx-0 lg:max-w-none">
            <Image
              src={SET.image}
              alt="A glass sculpture of a three-colour swirl — orange, teal and red — melting in a silver coupe."
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 90vw, 24rem"
              className="object-cover"
            />
          </div>
          <div>
            <p className="eyebrow text-bronze">All three</p>
            <h2 className="headline mt-4 max-w-[14ch] text-balance">
              Treat Yourself to All Three
            </h2>
            <p className="mt-6 max-w-md text-shell/85">
              C Me Glow in the morning. Bounce Back at night. Thirst Trap whenever your
              skin asks for it. {SET.detail} — one of each, which is how you’d have
              ordered it anyway.
            </p>
            <p className="mt-5 max-w-md text-shell/80">
              You spend most of the week deciding what everyone else gets. This is the
              one order where you don’t have to choose.
            </p>
            <p className="mt-6 text-sm text-shell/80">
              {formatPrice(SET.price)} for all three, instead of{" "}
              {formatPrice(products.reduce((sum, p) => sum + p.price, 0))}.
            </p>
            <div className="mt-8">
              <AddSetButton className="btn btn-primary w-full sm:w-auto" />
            </div>
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
