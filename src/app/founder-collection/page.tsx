import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AddToBagButton } from "@/components/bag/AddToBagButton";
import { PageIntro } from "@/components/site/PageIntro";
import { EmailSignup } from "@/components/site/EmailSignup";
import { BRAND, CONTACT_EMAIL, CONTACT_MAILTO } from "@/lib/brand";
import { FOUNDER_COLLECTION } from "@/lib/founderCollection";
import { formatPrice } from "@/lib/products";
import {
  JsonLd,
  breadcrumbSchema,
  faqSchema,
  founderProductSchema,
} from "@/lib/seo";

/**
 * THE FOUNDER COLLECTION.
 *
 * A quieter page than /shop on purpose. The LALALOCA serums earn the door
 * treatment because there are three of them and choosing between them is the
 * whole interaction. This line is one product; a door you can only walk
 * through one way is a corridor. So: editorial column, the facts in full, and
 * no theatre.
 *
 * ON SALE AS A PREORDER since 19 Aug 2026, per Shelby. Hold the Room has a
 * Shopify variant wired in shopifyLinks.ts and `sellable: true`, so the buy
 * module renders in place of the old "Not on sale yet" block.
 *
 * Both branches are kept. OPENING LINE and SIGN HERE will land here with
 * `sellable: false` and must still get the honest waiting-room treatment
 * rather than a dead button.
 *
 * THE PREORDER NOTE IS NOT DECORATION. Shopify holds 0 on hand and sells
 * anyway, while /policies/shipping promises dispatch within one business day.
 * `product.preorder` is the only thing on the page correcting that. If it
 * ever renders empty, the button must not render either.
 */

export const metadata: Metadata = {
  title: "The FOUNDER Collection",
  description:
    "The FOUNDER Collection. Hold the Room — a moisturizing cream with chamomile and witch hazel, 30 ml. The last step, after your serums.",
  alternates: { canonical: "/founder-collection" },
};

export default function FounderCollectionPage() {
  const product = FOUNDER_COLLECTION[0];

  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "The FOUNDER Collection", path: "/founder-collection" },
          ]),
          faqSchema(product.faqs),
          ...(product.sellable ? [founderProductSchema(product)] : []),
        ]}
      />

      <PageIntro
        eyebrow="The FOUNDER Collection"
        title="The room is easy to enter. Harder to hold."
      >
        <p className="lede mt-6 max-w-prose text-charcoal/80">
          A second line, under FOUNDER itself. LALALOCA is the serum collection;
          this is what comes after it.
        </p>
      </PageIntro>

      {/* ---- The product ---- */}
      <section className="bg-cream" aria-labelledby="anchor-heading">
        <div className="shell grid gap-12 py-14 md:py-20 lg:grid-cols-[0.95fr_1fr] lg:gap-16">
          <div>
            {/* The product as it photographs: bottle and carton, side by
                side, supplied 19 Aug 2026. These replace the lone cutout
                (still in founderCollection.ts as `bottle` for the bag).
                The carton prints the supplier's own product name — EXTREME
                MOISTURE BLEND — because that is what the first run's box
                says; the alt text reads it out rather than papering over
                it. */}
            <div className="mb-8 grid grid-cols-2 gap-3">
              <Image
                src="/products/hold-the-room-bottle-studio.webp"
                alt="The Hold the Room airless pump bottle — black cap and base, frosted body printed FOUNDER BEAUTY — standing in warm side light."
                width={1254}
                height={1254}
                priority
                sizes="(max-width: 1024px) 50vw, 24rem"
                className="w-full"
              />
              <Image
                src="/products/hold-the-room-carton-studio.webp"
                alt="The carton: FOUNDER BEAUTY above the supplier’s product name, Extreme Moisture Blend, net 30 ml / 1 US fl oz."
                width={1254}
                height={1254}
                sizes="(max-width: 1024px) 50vw, 24rem"
                className="w-full"
              />
            </div>

            <p className="eyebrow text-bronze-ink">02 · {product.archetype}</p>
            <h2
              id="anchor-heading"
              className="mt-4 font-serif text-4xl leading-tight text-charcoal md:text-5xl"
            >
              {product.name}
            </h2>
            <p className="mt-3 text-sm uppercase tracking-[0.16em] text-charcoal/70">
              {product.category}
            </p>
            <hr className="my-7 h-px w-16 border-0 bg-bronze" />
            <p className="font-serif text-2xl leading-snug text-charcoal">
              {product.hero}
            </p>
            <p className="mt-6 max-w-prose text-charcoal/85">{product.what}</p>
            <p className="mt-4 max-w-prose text-charcoal/85">{product.benefit}</p>

            <dl className="mt-8 grid gap-x-8 gap-y-4 border-t border-charcoal/12 pt-6 sm:grid-cols-2">
              <div>
                <dt className="eyebrow text-charcoal/60">Size</dt>
                <dd className="mt-1 text-charcoal">{product.size}</dd>
              </div>
              <div>
                <dt className="eyebrow text-charcoal/60">Price</dt>
                <dd className="mt-1 text-charcoal">{formatPrice(product.price)}</dd>
              </div>
              <div>
                <dt className="eyebrow text-charcoal/60">When</dt>
                <dd className="mt-1 text-charcoal">{product.timing}</dd>
              </div>
              <div>
                <dt className="eyebrow text-charcoal/60">Where it sits</dt>
                <dd className="mt-1 text-charcoal">{product.routine}</dd>
              </div>
              <div>
                <dt className="eyebrow text-charcoal/60">On the label</dt>
                <dd className="mt-1 text-charcoal">{product.keyActive}</dd>
              </div>
              <div>
                <dt className="eyebrow text-charcoal/60">Made</dt>
                <dd className="mt-1 text-charcoal">{product.origin}</dd>
              </div>
            </dl>

            {/* Buy. The preorder line sits above the button, not under it —
                a customer should read the exception before they commit, not
                after. */}
            {product.sellable && product.preorder && (
              <div className="mt-9 max-w-md">
                <div className="border-l-2 border-bronze bg-shell/60 py-5 pl-5">
                  <p className="eyebrow text-bronze-ink">Preorder</p>
                  <p className="mt-3 text-charcoal/85">{product.preorder}</p>
                </div>
                <AddToBagButton
                  product={product}
                  href="/founder-collection"
                  className="btn btn-dark mt-6 w-full"
                  label="Preorder"
                  showPrice
                />
                <p className="mt-3 text-xs leading-relaxed text-charcoal/70">
                  You’ll finish your order on Shopify’s secure checkout. Free US
                  shipping. Cosmetic product. {BRAND.legal.name} is the seller
                  of record. See{" "}
                  {/* Plain inline underline, not .link-underline — that class
                      is a 44px-tall uppercase CTA and breaks inside a
                      sentence. */}
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
            )}

            {/* The honest state of things, for anything in the line that has
                no checkout behind it yet. */}
            {!product.sellable && (
              <div className="mt-9 border-l-2 border-bronze bg-shell/60 py-5 pl-5">
                <p className="eyebrow text-bronze-ink">Not on sale yet</p>
                <p className="mt-3 max-w-prose text-charcoal/85">
                  {product.name} is sourced and named, and the full ingredient
                  list is published below. It goes on sale once the paperwork
                  behind it is finished — stability documentation, packaging
                  testing, label artwork. We would rather show you the product
                  and the timeline than take money against a date we cannot
                  promise.
                </p>
                <p className="mt-4 text-charcoal/85">
                  The founding list hears first.
                </p>
                <EmailSignup
                  tone="light"
                  heading="Enter the Founding List."
                  source="page"
                />
              </div>
            )}
          </div>

          {/* The campaign door — same doors as the homepage hero, blush
              with a brass F on each leaf, seen from inside the atelier.
              Supplied 19 Aug 2026. It sits in the first grid row beside
              the product column, bottom-aligned (lg:self-end) so its
              lower edge lands level with the purchase module opposite.
              No caption: the page's headline already carries the line. */}
          <figure className="max-w-[26rem] lg:self-end">
            <Image
              src="/editorial/founder-collection-door.webp"
              alt="A woman in a cream suit with a deep green belt pushes open tall blush-pink double doors, a brass F on each leaf, into a dark atelier of shelved bottles under warm lamps."
              width={1003}
              height={1568}
              loading="lazy"
              sizes="(max-width: 1024px) 90vw, 26rem"
              className="w-full"
            />
          </figure>

          {/* ---- How to use, ingredients, questions ----
              Explicitly second row, second column: the door holds the
              first row, and the left column's empty run-out below the
              buy module is the same white space the old layout had. */}
          <div className="max-w-prose lg:col-start-2">
            <h3 className="eyebrow text-bronze-ink">How to use it</h3>
            <ol className="mt-5 space-y-5 border-t border-charcoal/12 pt-5">
              {product.howToUse.map((step, i) => (
                <li key={step.step} className="grid grid-cols-[2rem_1fr] gap-4">
                  <span className="font-serif text-xl text-bronze-ink">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block font-serif text-lg text-charcoal">
                      {step.step}
                    </span>
                    <span className="mt-1 block text-charcoal/80">{step.detail}</span>
                  </span>
                </li>
              ))}
            </ol>

            <h3 className="eyebrow mt-12 text-bronze-ink">Ingredients</h3>
            {product.ingredients ? (
              <p className="mt-5 border-t border-charcoal/12 pt-5 text-sm leading-relaxed text-charcoal/80">
                {product.ingredients.join(", ")}.
              </p>
            ) : (
              <p className="mt-5 border-t border-charcoal/12 pt-5 text-sm text-charcoal/80">
                The full INCI list has not been published here yet. Email{" "}
                <a className="link-underline" href={CONTACT_MAILTO}>
                  {CONTACT_EMAIL}
                </a>{" "}
                and we will send the supplier sheet.
              </p>
            )}

            <h3 className="eyebrow mt-12 text-bronze-ink">Questions</h3>
            <dl className="mt-5 space-y-6 border-t border-charcoal/12 pt-5">
              {product.faqs.map((faq) => (
                <div key={faq.q}>
                  <dt className="font-serif text-lg text-charcoal">{faq.q}</dt>
                  <dd className="mt-2 text-charcoal/80">{faq.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ---- The rest of the line ---- */}
      <section className="bg-founder-green py-16 text-cream md:py-20">
        <div className="shell max-w-3xl">
          <p className="eyebrow text-blush">The FOUNDER Collection</p>
          <h2 className="mt-5 font-serif text-3xl leading-tight md:text-4xl">
            Three named steps. One of them exists.
          </h2>
          <p className="mt-6 max-w-prose text-cream/85">
            The collection is written as three: an opener, an anchor, a
            signature. {product.name} is the anchor, and the first to be
            sourced. The other two are named and not yet made, which is a
            different thing from coming soon.
          </p>
          <p className="mt-6 font-serif text-xl text-blush">
            Named. Not yet promised.
          </p>
        </div>
      </section>

      {/* ---- Back to the serums ---- */}
      <section className="bg-shell py-14 md:py-16">
        <div className="shell max-w-3xl">
          <p className="text-charcoal/85">
            Looking for the serums? Those are LALALOCA — three of them, 50 ml
            each, and part of every order goes to StandUp for Kids Tucson.
          </p>
          <Link href="/shop" className="link-underline mt-4 inline-flex text-charcoal">
            The LALALOCA Collection <span aria-hidden>↗</span>
          </Link>
        </div>
      </section>
    </>
  );
}
