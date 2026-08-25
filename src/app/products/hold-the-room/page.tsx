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

      {/* The room the product lives in, at the width the homepage and the
          campaign use — same 1672×941 frame, composed with its copy space on
          the left so the product sits where the eye lands last. This is the
          LCP element, hence priority. */}
      <section className="bg-cream pt-6 md:pt-8">
        <div className="relative aspect-[1672/941] w-full overflow-hidden">
          <Image
            src="/products/hold-the-room-vanity-hero.webp"
            alt="Hold the Room and its carton on a marble dressing table — deep green doors with brass F monograms stand open onto a lit vanity beyond, a cream jacket on the rail, a gold compact, watch and pen beside the bottle."
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="bg-cream">
        <div className="shell grid gap-12 py-14 md:py-20 lg:grid-cols-[0.95fr_1fr] lg:gap-16">
          <div>
            {/* The vanity set, supplied 25 Aug 2026, replacing the peach
                studio sweep the supplier shipped with. That sweep had a
                palm-frond gobo on it — the stock white-label mockup ground,
                used nowhere else here — so beside Clean Break and Double
                Take, both shot in the atelier, Hold the Room read as
                somebody else's product. Now all four are in one world.

                THE CARTON'S TYPO. As supplied, the wide frame's box read
                EXTEEME MOISTURE BLEND. scripts/fix-carton-typo.py transfers
                the R from MOISTURE on the line below onto the wrong E and
                touches nothing else. The corrected spelling is the real
                box's, so this makes the image more accurate, not less; the
                as-supplied frame is kept beside the script's output in
                assets/source/hold-the-room (gitignored, local only).

                WHAT THESE ARE. Styled images, not studio photographs of the
                packed product, so the small print below says what actually
                ships. The carton still carries the supplier's own product
                name, because that is what the first run's box says and no
                photograph is the place to fix it.

                The Antique Gold rule is Hold the Room's accent on the
                collection grid. It has no stripe colourway, because the
                pack genuinely does not have one. */}
            <div className="mb-6">
              <Image
                src="/products/hold-the-room-vanity.webp"
                alt="Hold the Room lying on a marble vanity seen from above, among a gold watch, twisted hoop earrings, a brass key, a cream handbag and a nude heel."
                width={1254}
                height={1254}
                sizes="(max-width: 1024px) 90vw, 30rem"
                className="w-full"
              />
              <span aria-hidden className="block h-1 w-full bg-bronze" />
            </div>

            <p className="mb-8 max-w-prose text-xs leading-relaxed text-charcoal/70">
              Styled imagery. The carton that ships is plain, printed FOUNDER
              BEAUTY above the supplier&rsquo;s product name, Extreme Moisture
              Blend, 30 ml / 1 US fl oz.
            </p>

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

          {/* The mirror frame, supplied 25 Aug 2026. It took the slot the
              campaign door held (still at /editorial/founder-collection-door
              .webp, now unused) — same 1003×1568, same bottom alignment
              (lg:self-end) so its lower edge lands level with the purchase
              module opposite. The door was an editorial image of the brand;
              this is the same moment with the product actually in it, which
              is what a product page's second image is for.
              No caption: the page's headline already carries the line. */}
          <figure className="max-w-[26rem] lg:self-end">
            <Image
              src="/products/hold-the-room-vanity-mirror.webp"
              alt="Hold the Room standing on a marble dressing table in front of a gilt mirror, a woman in a cream suit fastening her cuff in the reflection, a green leather folio and gold watch beside it."
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
