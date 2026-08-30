import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/house/Reveal";
import { LineRail } from "@/components/house/LineRail";
import {
  PlateShades,
  PlateShadeImage,
  PlateShadeChips,
} from "@/components/house/PlateShades";
import { CAMPAIGN, type NextMoveProduct } from "@/lib/nextMove";
import { SITE } from "@/lib/brand";
import { JsonLd, breadcrumbSchema } from "@/lib/seo";

/**
 * THE PLATE — the after-hours product page, for the three campaign SKUs.
 *
 * The layout is Shelby's, built first on Hold the Room and rolled onto Clean
 * Break, Smooth Talker and Double Take here: one dark room running the full
 * width, the product lit inside it, and the copy sitting in the room's own
 * shadow rather than on a panel bolted beside it. Name in spaced serif
 * capitals — engraved, not shouted. A rail across the foot steps sideways
 * through the line.
 *
 * ONE TEMPLATE, THREE PRODUCTS, FOR THE SAME REASON AS `shop/ProductDetail`:
 * the differences between these three are facts, not design. Three hand-built
 * pages drift — a 24-word hook on one and none on the next — and that drift is
 * what the copy cut of 23 Aug existed to undo.
 *
 * ── WHAT THIS PAGE MAY NOT DO ────────────────────────────────────────────
 *
 * NO PRICE AND NO BUY PATH. `RESERVING` is still true in nextMove.ts:
 * Selfnamed's unit cost was never visible in the studio, and the house rule is
 * "no price, no slot". Nothing is charged here, so the FTC Mail Order Rule's
 * 30-day clock never starts against a ship date nobody can name. The CTA goes
 * to the campaign's own reservation form — the same one, not a second capture.
 *
 * NO PRODUCT SCHEMA. A schema.org Offer wants a price and an availability.
 * These have neither, and publishing an Offer with an invented price is
 * precisely the class of error the price guard exists to catch. Breadcrumbs
 * only until a real price exists.
 *
 * THE PACK SHOTS ARE RENDERS. Every one of the three concept docs records it,
 * and every one says reshoot when a physical sample exists. A page this
 * atmospheric is exactly where a customer would assume she is looking at a
 * photograph of a real bottle, so the split section says so outright.
 *
 * THE SUN NOTE RIDES ON THE PLATE, NOT IN THE FOOTNOTES. Smooth Talker leads
 * its INCI with zinc oxide and carries titanium dioxide, and this frame shows
 * it being blended over a cheekbone in daylight. A shopper could reasonably
 * infer sun protection. There is no SPF test and an SPF claim would make it an
 * OTC drug in the US. So the disclaimer sits under the reserve block, above
 * the fold, where the assumption would be formed.
 */
export function ProductPlate({ product }: { product: NextMoveProduct }) {
  const shades = product.shades?.length ? product.shades : null;

  /* The plate, written once. When the product has shades the whole section is
     wrapped in the picker's provider so the photograph and the chips halfway
     down the copy share one selection; the copy between them stays a server
     component either way. */
  const plate = (
    <section className="relative isolate flex min-h-[calc(100svh-7rem)] flex-col justify-end overflow-hidden">
      {shades ? (
        <PlateShadeImage />
      ) : (
        <Image
          src={product.detailHero.src}
          alt={product.detailHero.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center]"
        />
      )}

      {/* Deep on the left where the words go, clear on the right where the
          product is. Two gradients rather than one, so the copy never sits
          over the lit part of the frame at any width. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,19,15,0.55)_0%,rgba(7,19,15,0.25)_30%,rgba(7,19,15,0.95)_86%,#07130f_100%)] md:bg-[linear-gradient(90deg,#07130f_0%,rgba(7,19,15,0.95)_28%,rgba(7,19,15,0.6)_44%,rgba(7,19,15,0.05)_66%)]"
      />

      <div className="shell relative flex w-full flex-1 items-end pb-16 pt-28 md:items-center md:py-24">
        <div className="max-w-[26rem]">
          <p className="room-label">{CAMPAIGN.name}</p>

          <h1 className="display-product mt-5 text-cream">{product.name}</h1>

          <p className="mt-4 text-[0.75rem] uppercase tracking-[0.22em] text-cream/70">
            {product.category}
          </p>
          <span aria-hidden className="plate-rule mt-7" />

          <p className="mt-7 font-serif text-[clamp(1.35rem,2.2vw,1.6rem)] leading-snug text-blush">
            {product.hook}
          </p>

          <p className="mt-8 text-[0.8125rem] uppercase tracking-[0.18em] text-cream/70">
            {product.size}
          </p>

          {/* Choose, then reserve — the order a person actually decides in. */}
          {shades && <PlateShadeChips className="mt-7" />}

          {/* What a reservation is, said before the button rather than
              after it. There is no price line above this on purpose. */}
          <div className="mt-7 max-w-[24rem] border-l-2 border-bronze py-3 pl-4">
            <p className="room-label">Reserve</p>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-cream/75">
              {product.reservationStatus}
            </p>
          </div>

          <Link
            href="/the-next-move#reserve"
            className="btn btn-ghost-light mt-6 w-full max-w-[20rem]"
          >
            {product.detailCta}
          </Link>

          {/* The thing she would otherwise have to assume — above the fold,
              because this is where the assumption gets made. */}
          {product.sunNote && (
            <p className="mt-6 max-w-[26rem] border-l-2 border-rose-deep py-3 pl-4 text-[0.75rem] leading-relaxed text-cream/75">
              {product.sunNote}
            </p>
          )}

          <p className="mt-5 max-w-[26rem] text-[0.6875rem] leading-relaxed text-cream/55">
            Nothing is charged today. We&rsquo;ll write to you with the price and a
            ship date before anything is sold, and you can walk away at that
            point.
          </p>
        </div>
      </div>

      <div className="relative">
        <LineRail current={product.slug} />
      </div>
    </section>
  );

  return (
    <div className="bg-night text-cream">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "The FOUNDER Collection", path: "/founder-collection" },
            { name: product.name, path: `/products/${product.slug}` },
          ]),
        ]}
      />

      {shades ? (
        <PlateShades shades={shades}>{plate}</PlateShades>
      ) : (
        plate
      )}

      {/* ══ WHAT IT IS ══════════════════════════════════════════════════════
          The split reverses: photograph left, cream panel right. Reading
          happens on paper; the room is for looking at. */}
      <section className="grid lg:grid-cols-[52%_48%]">
        <div className="relative min-h-[60svh] lg:min-h-[46rem]">
          <Image
            src={product.scene.src}
            alt={product.scene.alt}
            fill
            loading="lazy"
            sizes="(max-width: 1024px) 100vw, 52vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center bg-cream px-[var(--shell-pad)] py-16 text-charcoal lg:py-24">
          <Reveal className="mx-auto w-full max-w-[34rem] lg:mx-0">
            <p className="room-label room-label-dk">What it is</p>
            <h2 className="headline-house mt-5 text-balance text-charcoal">
              {product.what}
            </h2>

            <p className="mt-7 text-[1.0625rem] leading-relaxed text-charcoal/80">
              {product.description}
            </p>

            <ul className="mt-10">
              {product.benefits.map((benefit, i) => (
                <li
                  key={benefit}
                  className="grid grid-cols-[2.5rem_1fr] gap-5 border-t border-charcoal/12 py-6"
                >
                  <span className="font-serif text-2xl font-light text-bronze-ink">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-xl leading-snug text-charcoal">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>

            {/* Said here rather than nowhere. The packaging exists as approved
                artwork and these frames are built from it; no filled sample
                has been photographed yet. A customer reading an atmospheric
                page would otherwise assume the opposite. */}
            <p className="mt-8 border-t border-charcoal/12 pt-6 text-xs leading-relaxed text-charcoal/70">
              Styled imagery, built from the approved packaging artwork rather
              than photographed from a filled sample. We&rsquo;ll reshoot with the
              real thing before it ships.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══ WHAT IS IN IT ═══════════════════════════════════════════════════
          A product being reserved discloses on the same terms as a product
          being sold. Fragrance and allergens are on the page, not in a PDF. */}
      <section className="section bg-shell text-charcoal">
        <div className="shell grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="room-label room-label-dk">What is in it</p>
            <h3 className="mt-5 font-serif text-3xl font-light text-charcoal">
              The parts worth knowing before you decide.
            </h3>
            <dl className="mt-8 grid gap-x-8 gap-y-5 border-t border-charcoal/12 pt-6 sm:grid-cols-2">
              <div>
                <dt className="room-label room-label-dk">Key ingredients</dt>
                <dd className="mt-2 text-[0.9375rem] leading-relaxed text-charcoal">
                  {product.keyIngredients.join(" · ")}
                </dd>
              </div>
              <div>
                <dt className="room-label room-label-dk">Size</dt>
                <dd className="mt-2 text-[0.9375rem] text-charcoal">{product.size}</dd>
              </div>
              {product.shades && (
                <div>
                  <dt className="room-label room-label-dk">Shades</dt>
                  <dd className="mt-2 text-[0.9375rem] text-charcoal">
                    {product.shades.map((s) => `${s.code} ${s.name}`).join(" · ")}
                  </dd>
                </div>
              )}
              {product.facts && (
                <div>
                  <dt className="room-label room-label-dk">Also</dt>
                  <dd className="mt-2 text-[0.9375rem] leading-relaxed text-charcoal">
                    {product.facts.join(" · ")}
                  </dd>
                </div>
              )}
            </dl>
          </Reveal>

          <Reveal delay={120}>
            <p className="room-label room-label-dk">Plainly</p>
            <h3 className="mt-5 font-serif text-3xl font-light text-charcoal">
              Said here rather than found at home.
            </h3>
            <p className="mt-6 border-t border-charcoal/12 pt-6 text-[0.9375rem] leading-relaxed text-charcoal/80">
              {product.plainly}
            </p>
            {product.sunNote && (
              <p className="mt-6 border-l-2 border-bronze bg-cream/70 py-4 pl-5 text-[0.9375rem] leading-relaxed text-charcoal/80">
                {product.sunNote}
              </p>
            )}
            <p className="mt-8 border-t border-charcoal/12 pt-6 text-xs leading-relaxed text-charcoal/70">
              The full ingredient list is printed on the carton and will be
              published here before the first order ships.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══ THE RANGE ═══════════════════════════════════════════════════════
          Smooth Talker only. The family shot has a home here rather than as
          the hero, so the range stays visible without displacing the shade
          the shopper actually chose. */}
      {product.shades && (
        <section className="relative isolate overflow-hidden bg-night-deep">
          <div className="shell py-16 md:py-20">
            <Reveal>
              <p className="room-label">Meet the shades</p>
              {/* `pack`, not `scene`: for this SKU the record's "pack shot"
                  is the dressing-closet frame with all three sticks and all
                  three cartons in the room, and `scene` is the flatter
                  line-up already used by the split above. Using scene twice
                  put the same photograph on the page twice. */}
              <div className="relative mt-6 aspect-[3/2] w-full overflow-hidden">
                <Image
                  src={product.pack.src}
                  alt={product.pack.alt}
                  fill
                  loading="lazy"
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-5 text-[0.8125rem] leading-relaxed text-cream/60">
                {product.shades.map((s) => `${s.code} ${s.name}`).join(" · ")} — one
                stick, one formula, three shades.
              </p>
            </Reveal>
          </div>
        </section>
      )}

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
            <p className="mt-6 max-w-[26rem] text-[0.9375rem] leading-relaxed text-cream/70">
              {product.name} is one of three in {CAMPAIGN.name}.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link href="/the-next-move" className="hairline text-cream">
                See all three
              </Link>
              <Link href="/founder-collection" className="hairline text-cream">
                The whole line
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

/**
 * Shared metadata builder, so three routes cannot describe themselves
 * differently. Indexable since 30 August: the plate IS `/products/<slug>` now,
 * not a second copy of it, so the noindex that kept the after-hours track out
 * of the results went with the promotion.
 */
export function plateMetadata(product: NextMoveProduct) {
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
