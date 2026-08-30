import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/site/PageIntro";
import { EmailSignup } from "@/components/site/EmailSignup";
import { BRAND } from "@/lib/brand";
import { CAMPAIGN, NEXT_MOVE, RESERVING } from "@/lib/nextMove";
import { JsonLd, breadcrumbSchema } from "@/lib/seo";
import { ShadePicker } from "@/components/shop/ShadePicker";

/**
 * THE NEXT MOVE — presale.
 *
 * TWO THINGS THIS PAGE DELIBERATELY DOES NOT DO.
 *
 * It does not take money. No price exists for any of the three SKUs and no
 * ship window has been set, and charging a card starts the FTC Mail Order
 * Rule's 30-day clock against a date nobody can name. So it reserves. Flip
 * RESERVING in nextMove.ts when both exist, and the buy path can be added
 * here in one commit.
 *
 * PHOTOGRAPHY, as of 25 August. The corrected render set replaced the drawn
 * stripe placeholders. Every label was read at full resolution before use —
 * no SPF wording on the stick, MATE LEAF and 140 ml on the wash, and the
 * documented actives on the eye cream. The stripe colourways survive as the
 * ground each pack shot sits on, so the cards still carry the packaging
 * system's own colour logic.
 *
 * These remain renders of packaging, not photographs of a physical sample.
 * Reshoot when a sample exists — every concept doc asks for one first.
 */

export const metadata: Metadata = {
  title: "The Next Move — Presale",
  description:
    "Three new FOUNDER essentials: Clean Break, Smooth Talker and Double Take. Reserve your place — nothing is charged today.",
  alternates: { canonical: "/the-next-move" },
};

export default function TheNextMovePage() {
  return (
    <>
      <JsonLd
        schema={[breadcrumbSchema([{ name: CAMPAIGN.name, path: "/the-next-move" }])]}
      />

      {/* The wide campaign frame — same 1672×941 as the homepage hero, and
          composed with its copy space on the left, so the headline below it
          reads as the same gesture rather than competing with it. This is
          the first thing under the (dark) header and carries no text of its
          own, so it takes the night ground rather than cream — a beat of
          dark room before the intro's lit panel, not a pale flash while the
          image loads. */}
      <section className="bg-night">
        <div className="relative aspect-[1672/941] w-full overflow-hidden">
          <Image
            src={CAMPAIGN.hero.src}
            alt={CAMPAIGN.hero.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* PageIntro's default cream stays: this carries the reservation CTA and
          the "nothing is charged" disclaimer, both of which the campaign
          brief requires to stay prominent. Cream ground with charcoal ink is
          the highest-contrast reading surface the house has, so the lead
          decision copy gets that rather than cream type over night. */}
      <PageIntro eyebrow={`${BRAND.display} · ${CAMPAIGN.name}`} title={CAMPAIGN.headline}>
        <p className="lede mt-6 max-w-prose text-charcoal/80">{CAMPAIGN.standfirst}</p>
        <ul className="mt-6 space-y-1 font-serif text-xl text-charcoal">
          {CAMPAIGN.triad.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <div className="mt-8">
          <Link href="#reserve" className="btn btn-dark">
            Reserve your place
          </Link>
        </div>
        {RESERVING && (
          <p className="mt-5 max-w-md text-xs leading-relaxed text-charcoal/70">
            Nothing is charged today. We&rsquo;ll write to you with the price and a
            ship date before anything is sold, and you can walk away at that point.
          </p>
        )}
      </PageIntro>

      {/* ---------------- The three ---------------- */}
      <section className="section bg-cream pt-4" aria-labelledby="three-heading">
        <div className="shell">
          <h2 id="three-heading" className="eyebrow text-charcoal/70">
            {CAMPAIGN.card}
          </h2>

          <div className="mt-8 grid gap-12 md:grid-cols-3 md:gap-8">
            {/* The campaign's own three, not every reservation product —
                see CAMPAIGN.slugs. */}
            {NEXT_MOVE.filter((p) => CAMPAIGN.slugs.includes(p.slug as never)).map((product) => (
              <article key={product.slug} className="flex flex-col">
                {/* The architectural scene leads — each was shot into its own
                    SKU's colourway, so the grid carries the packaging system's
                    colour without a striped ground fighting a striped pack.
                    The pack shot is the hover reveal: scene for desire, pack
                    for the label. The tile is 3:2, the scenes' native ratio,
                    so nothing is cropped, and a 4px rule in the SKU's deep
                    stripe keeps the colourway explicit. */}
                {product.shades ? (
                  /* A shade range replaces the hover reveal: hover is not a
                     choice, and on a phone it does not exist at all. */
                  <ShadePicker
                    shades={product.shades}
                    accent={product.stripes.b}
                  />
                ) : (
                  <div className="group/card relative aspect-[3/2] w-full overflow-hidden bg-shell">
                    <Image
                      src={product.scene.src}
                      alt={product.scene.alt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 90vw, 30vw"
                      className="object-cover transition-opacity duration-500 group-hover/card:opacity-0"
                    />
                    <Image
                      src={product.pack.src}
                      alt=""
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 90vw, 30vw"
                      className="object-contain p-4 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                    />
                    <span
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-1"
                      style={{ background: product.stripes.b }}
                    />
                  </div>
                )}

                {/* Name and category first. Without them a shopper scanning
                    three cards reads three taglines and no products — and a
                    heading per card is what gives screen readers something to
                    navigate by. */}
                <p className="eyebrow mt-6 text-bronze-ink">{product.category}</p>
                <h3 className="mt-2 font-serif text-2xl font-light leading-none text-charcoal">
                  {product.name}
                </h3>

                <p className="mt-4 font-serif text-xl leading-snug text-charcoal">
                  {product.hook}
                </p>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-charcoal/85">
                  {product.what}
                </p>

                <ul className="mt-5 space-y-2 border-t border-charcoal/12 pt-5 text-sm text-charcoal/80">
                  {product.benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>

                <p className="eyebrow mt-6 text-bronze-ink">Key ingredients</p>
                <p className="mt-2 text-sm text-charcoal/80">
                  {product.keyIngredients.join(" · ")}
                </p>

                <p className="mt-4 text-sm text-charcoal/80">
                  {product.size}
                  {product.shade ? ` · Shade ${product.shade}` : ""}
                  {product.shades ? ` · ${product.shades.length} shades` : ""}
                </p>

                {/* The one thing a customer might otherwise assume. */}
                {product.sunNote && (
                  <p className="mt-6 border-l-2 border-bronze bg-shell/60 py-4 pl-4 text-xs leading-relaxed text-charcoal/85">
                    {product.sunNote}
                  </p>
                )}

                <p className="mt-5 text-xs leading-relaxed text-charcoal/70">
                  {product.plainly}
                </p>

                <div className="mt-auto pt-7">
                  <Link href="#reserve" className="link-underline text-charcoal">
                    {product.cta} <span aria-hidden>↗</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- The three together ----------------
          A photograph, not reading — the card grid above it already carries
          the ingredients and disclosures, so this is the dark room the house
          hands off to between two lit panels, per the alternating rhythm. */}
      <section className="bg-night pb-4">
        <div className="shell">
          <figure>
            <div className="relative aspect-[1254/900] w-full overflow-hidden">
              <Image
                src={CAMPAIGN.flatlay.src}
                alt={CAMPAIGN.flatlay.alt}
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 80rem"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-xs uppercase tracking-[0.16em] text-cream/70">
              {CAMPAIGN.card}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ---------------- What a reservation is ----------------
          The board's Truth Standard applied to a presale: say what is and
          isn't being promised, before the address is asked for. */}
      <section className="section-tight bg-shell" aria-labelledby="terms-heading">
        <div className="shell grid gap-8 border-t border-charcoal/12 pt-10 sm:grid-cols-3">
          <div>
            <h2 id="terms-heading" className="font-serif text-2xl text-charcoal">
              Nothing is charged
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/80">
              A reservation holds your place in the first run. No card, no deposit,
              no obligation.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl text-charcoal">No date yet</h2>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/80">
              These are made to order with our supplier and the first run has not
              been scheduled. We would rather tell you that than invent a month.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl text-charcoal">What these are</h2>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/80">
              Cosmetic products, not medicine. No clinical claims, no
              before-and-afters, no reviews we wrote ourselves.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- Reserve ---------------- */}
      <section
        id="reserve"
        className="section-tight scroll-mt-24 bg-founder-green py-14 md:py-16"
      >
        <div className="shell">
          <div className="max-w-xl">
            <h2 className="headline text-balance text-cream">
              Be first through the door.
            </h2>
            <EmailSignup tone="green" source="waitlist" />
          </div>
        </div>
      </section>

      {/* ---------------- Back to the collection ----------------
          A closing nav, not a reading panel — no texture-stone dependency
          holding it on cream the way found-her's does, so it takes the
          default dark room like the rest of the house's chrome. */}
      <section className="section-tight bg-night py-14">
        <div className="shell max-w-3xl">
          <p className="text-cream/85">
            On sale now: the LALALOCA serums, and Hold the Room in the FOUNDER
            Collection.
          </p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:gap-8">
            <Link href="/shop" className="link-underline text-cream">
              The LALALOCA Collection <span aria-hidden>↗</span>
            </Link>
            <Link href="/founder-collection" className="link-underline text-cream">
              The FOUNDER Collection <span aria-hidden>↗</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
