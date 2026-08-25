import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AddToBagButton } from "@/components/bag/AddToBagButton";
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
 * HOLD THE ROOM — its own page.
 *
 * This was the top two thirds of /founder-collection until 25 Aug, when the
 * collection page was reordered to open at the vanity and lead with the line.
 * Shelby asked for the spec sheet to come off that page; it moved here rather
 * than being deleted, because it was carrying three things nothing else does:
 *
 *   1. THE PREORDER NOTICE. Shopify holds 0 on hand and sells anyway, while
 *      /policies/shipping promises dispatch within one business day.
 *      `product.preorder` is the only text anywhere that corrects it, and the
 *      collection card has a live buy button. Delete this and a customer can
 *      preorder having been told she will get it tomorrow.
 *   2. The full INCI — including fragrance and petrolatum, disclosed on
 *      purpose. The board's note: do not soften it.
 *   3. The FAQs, and the schema that quotes them.
 *
 * A static route beats the /products/[slug] catalog template here: that
 * template reads a Shopify product with founder.* metafields, and neither
 * exists for this SKU yet. Next resolves this file first, so it keeps working
 * whatever happens in Shopify later.
 *
 * IF THE PREORDER NOTICE EVER RENDERS EMPTY, THE BUY BUTTON MUST NOT RENDER
 * EITHER — on this page and on the collection card. They ship together.
 */

export const metadata: Metadata = {
  title: "Hold the Room — Moisturizing Cream",
  description:
    "Hold the Room, the anchor of the FOUNDER Collection. A rich cream with chamomile and witch hazel, 30 ml. Preorder against the first run.",
  alternates: { canonical: "/products/hold-the-room" },
};

export default function HoldTheRoomPage() {
  const product = FOUNDER_COLLECTION[0];

  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "The FOUNDER Collection", path: "/founder-collection" },
            { name: product.name, path: "/products/hold-the-room" },
          ]),
          faqSchema(product.faqs),
          ...(product.sellable ? [founderProductSchema(product)] : []),
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
        </div>
      </section>

      <section className="bg-cream">
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
            <h1 className="mt-4 font-serif text-4xl leading-tight text-charcoal md:text-5xl">
              {product.name}
            </h1>
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

      {/* ---- Back to the line ---- */}
      <section className="bg-shell py-14 md:py-16">
        <div className="shell max-w-3xl">
          <p className="text-charcoal/85">
            {product.name} is the anchor of the FOUNDER Collection — the only
            one you can order today.
          </p>
          <Link
            href="/founder-collection"
            className="link-underline mt-4 inline-flex text-charcoal"
          >
            See the whole line <span aria-hidden>↗</span>
          </Link>
        </div>
      </section>
    </>
  );
}
