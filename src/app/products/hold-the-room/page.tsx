import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AddToBagButton } from "@/components/bag/AddToBagButton";
import { Reveal } from "@/components/house/Reveal";
import { LineRail } from "@/components/house/LineRail";
import { BRAND } from "@/lib/brand";
import { FOUNDER_COLLECTION } from "@/lib/founderCollection";
import { formatPrice } from "@/lib/products";
import {
  JsonLd,
  breadcrumbSchema,
  faqSchema,
  founderProductSchema,
} from "@/lib/seo";

/**
 * HOLD THE ROOM — the product page, built to Shelby's mock-up of 27 August
 * and promoted over the cream page on 30 August.
 *
 * THE LAYOUT IS HERS AND IT IS BETTER THAN THE REVIEW BUILD'S. One dark room
 * running the full width, the product lit inside it, and the copy sitting in
 * the room's own shadow on the left rather than on a panel bolted beside it —
 * so the space continues behind the words instead of stopping at a seam. The
 * name is set in spaced serif capitals, engraved rather than shouted, which
 * leaves the huge tight display type to the lockup alone. A rail across the
 * foot steps sideways through the line.
 *
 * WHAT IS NOT TAKEN FROM THE MOCK-UP: THE JAR.
 *
 * The mock shows a deep green jar with a brushed gold lid, captioned
 * PEPTIDE MOISTURIZER, 50 mL / 1.69 FL. OZ. Hold the Room is a frosted white
 * airless pump bottle with a black cap and base; it is a moisturizing cream
 * with chamomile extract and witch hazel; it is 30 ml / 1 fl oz; and it ships
 * in a plain supplier carton printed EXTREME MOISTURE BLEND. Four differences,
 * on a page with a live $34 button — a customer would open the box and find a
 * different object in a different format at a different size.
 *
 * So the layout is built and the photograph is ours. The frame this design
 * really wants — the pack alone, centred, spotlit on dark stone — does not
 * exist yet; it is shot 12 on the list. Until it does, the dressing-table
 * frame runs full width and the copy sits in its dark half.
 *
 * COMMERCE STAYS. The review build's footer reads "COMMERCE NOT CONNECTED",
 * so neither mock had to carry the preorder notice, the full INCI, the FAQs or
 * the seller-of-record line. This page takes money, so it carries all four.
 * IF THE PREORDER NOTICE EVER RENDERS EMPTY, THE BUTTON MUST NOT RENDER EITHER.
 */

const product = FOUNDER_COLLECTION[0];

export const metadata: Metadata = {
  title: `${product.name} — ${product.category}`,
  description:
    "Hold the Room, the anchor of the FOUNDER Collection. A rich cream with chamomile and witch hazel, 30 ml. Preorder against the first run.",
  alternates: { canonical: "/products/hold-the-room" },
};

export default function HoldTheRoomPage() {
  return (
    <div className="bg-night text-cream">
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

      {/* ══ THE PLATE ═══════════════════════════════════════════════════════
          One room, full width. The copy lives in the shadow on the left, so
          the wall behind it is the same wall the product is standing against. */}
      <section className="relative isolate flex min-h-[calc(100svh-7rem)] flex-col justify-end overflow-hidden">
        <Image
          src="/products/hold-the-room-vanity-hero.webp"
          alt="Hold the Room and its carton on a marble dressing table, green doors open onto a lit vanity beyond."
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_center]"
        />
        {/* Deep on the left where the words go, clear on the right where the
            product is. Two gradients rather than one so the copy never sits
            over the lit part of the frame at any width. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,19,15,0.55)_0%,rgba(7,19,15,0.25)_30%,rgba(7,19,15,0.95)_86%,#07130f_100%)] md:bg-[linear-gradient(90deg,#07130f_0%,rgba(7,19,15,0.95)_28%,rgba(7,19,15,0.6)_44%,rgba(7,19,15,0.05)_66%)]"
        />

        <div className="shell relative flex w-full flex-1 items-end pb-16 pt-28 md:items-center md:py-24">
          <div className="max-w-[26rem]">
            <p className="room-label">The line</p>
            <p className="mt-3 text-[0.75rem] uppercase tracking-[0.22em] text-cream/80">
              02 · {product.archetype}
            </p>

            <h1 className="display-product mt-5 text-cream">{product.name}</h1>

            <p className="mt-4 text-[0.75rem] uppercase tracking-[0.22em] text-cream/70">
              {product.category}
            </p>
            <span aria-hidden className="plate-rule mt-7" />

            <p className="mt-7 font-serif text-[clamp(1.35rem,2.2vw,1.6rem)] leading-snug text-blush">
              {product.hero}
            </p>

            <p className="mt-8 text-[0.8125rem] uppercase tracking-[0.18em] text-cream/70">
              {product.size}
            </p>
            <p className="mt-2 text-[0.9375rem] tracking-[0.06em] text-cream">
              {formatPrice(product.price)}
            </p>

            {/* The exception, then the button. Never the other way round. */}
            {product.sellable && product.preorder && (
              <>
                <div className="mt-7 max-w-[24rem] border-l-2 border-bronze py-3 pl-4">
                  <p className="room-label">Preorder</p>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-cream/75">
                    {product.preorder}
                  </p>
                </div>
                <AddToBagButton
                  product={product}
                  href="/founder-collection"
                  className="btn btn-ghost-light mt-6 w-full max-w-[20rem]"
                  label="Preorder"
                  showPrice
                />
              </>
            )}

            {/* Kept to one line so the line rail still lands on the first
                screen. Nothing is lost: shipping and returns are one tap away
                and both are restated in the bag before checkout. */}
            <p className="mt-5 max-w-[26rem] text-[0.6875rem] leading-relaxed text-cream/55">
              Secure checkout · Free US shipping · {BRAND.legal.name} is the seller of record ·{" "}
              <Link className="underline underline-offset-2 hover:opacity-70" href="/policies/shipping">
                Shipping
              </Link>{" "}
              ·{" "}
              <Link className="underline underline-offset-2 hover:opacity-70" href="/policies/returns">
                Returns
              </Link>
            </p>
          </div>
        </div>

        <div className="relative">
          <LineRail current="hold-the-room" />
        </div>
      </section>

      {/* ══ THE RITUAL ══════════════════════════════════════════════════════
          The split reverses: photograph left, cream panel right. */}
      <section className="grid lg:grid-cols-[52%_48%]">
        <div className="relative min-h-[60svh] lg:min-h-[46rem]">
          <Image
            src="/products/hold-the-room-vanity-mirror.webp"
            alt="Hold the Room on a marble dressing table in front of a gilt mirror, a woman in a cream suit fastening her cuff in the reflection."
            fill
            loading="lazy"
            sizes="(max-width: 1024px) 100vw, 52vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center bg-cream px-[var(--shell-pad)] py-16 text-charcoal lg:py-24">
          <Reveal className="mx-auto w-full max-w-[34rem] lg:mx-0">
            <p className="room-label room-label-dk">The ritual</p>
            <h2 className="headline-house mt-5 text-balance text-charcoal">
              Put it on before the room asks anything of you.
            </h2>

            <ol className="mt-10">
              {product.howToUse.map((step, i) => (
                <li
                  key={step.step}
                  className="grid grid-cols-[2.5rem_1fr] gap-5 border-t border-charcoal/12 py-6"
                >
                  <span className="font-serif text-2xl font-light text-bronze-ink">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block font-serif text-xl text-charcoal">{step.step}</span>
                    <span className="mt-2 block text-[0.9375rem] leading-relaxed text-charcoal/70">
                      {step.detail}
                    </span>
                  </span>
                </li>
              ))}
            </ol>

            <p className="mt-8 border-t border-charcoal/12 pt-6 text-xs leading-relaxed text-charcoal/70">
              Shown: styled imagery. The carton that ships is plain — FOUNDER BEAUTY over the
              supplier&rsquo;s product name, Extreme Moisture Blend, 30 ml / 1 US fl oz.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══ WHAT IS IN IT ═══════════════════════════════════════════════════
          Neither mock has this section. A product on sale discloses; it does
          not defer to "pending production approval". */}
      <section className="section bg-shell text-charcoal">
        <div className="shell grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="room-label room-label-dk">What is in it</p>
            <h3 className="mt-5 font-serif text-3xl font-light text-charcoal">
              The whole list, including the parts people avoid.
            </h3>
            <p className="mt-5 max-w-[44ch] text-[0.9375rem] leading-relaxed text-charcoal/70">
              Fragrance and petrolatum are both on it. We&rsquo;d rather you read that here
              than find it at home.
            </p>
            {product.ingredients && (
              <p className="mt-6 border-t border-charcoal/12 pt-6 text-[0.8125rem] leading-[1.9] text-charcoal/70">
                {product.ingredients.join(", ")}.
              </p>
            )}
            <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-charcoal/12 pt-6">
              <div>
                <dt className="room-label room-label-dk">What it does</dt>
                <dd className="mt-2 text-[0.9375rem] leading-relaxed text-charcoal">
                  {product.benefit}
                </dd>
              </div>
              <div>
                <dt className="room-label room-label-dk">Made</dt>
                <dd className="mt-2 text-[0.9375rem] text-charcoal">{product.origin}</dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={120}>
            <p className="room-label room-label-dk">Questions</p>
            <h3 className="mt-5 font-serif text-3xl font-light text-charcoal">
              Answered before you have to ask.
            </h3>
            <dl className="mt-8">
              {product.faqs.map((faq) => (
                <div key={faq.q} className="border-t border-charcoal/12 py-6">
                  <dt className="font-serif text-xl text-charcoal">{faq.q}</dt>
                  <dd className="mt-3 text-[0.9375rem] leading-relaxed text-charcoal/70">
                    {faq.a}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ══ THE HOUSE CONTINUES ═════════════════════════════════════════════ */}
      <section className="relative isolate overflow-hidden">
        <Image
          src="/editorial/founder-collection-door.webp"
          alt="A woman in a cream suit holding open one of two tall rose-pink doors, a brass F on each leaf, stepping into a dark atelier lined with product benches."
          fill
          loading="lazy"
          sizes="100vw"
          className="object-cover object-[60%_center]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,19,15,0.96)_0%,rgba(7,19,15,0.86)_34%,rgba(7,19,15,0.4)_62%,rgba(7,19,15,0.1)_100%)]"
        />
        <div className="shell relative py-24 md:py-32">
          <Reveal className="max-w-[30rem]">
            <p className="room-label">The house continues</p>
            <p className="headline-house mt-5 text-balance text-cream">
              Leave the door open behind you.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link href="/founder-collection" className="hairline text-cream">
                Return to the collection
              </Link>
              <Link href="/" className="hairline text-cream">
                Back to the house
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
