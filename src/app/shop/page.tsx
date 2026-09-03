import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DoorCard } from "@/components/door/DoorCard";
import { ScrollDoors } from "@/components/door/ScrollDoors";
import { AddSetButton } from "@/components/bag/AddToBagButton";
import { PageIntro } from "@/components/site/PageIntro";
import { EmailSignup } from "@/components/site/EmailSignup";
import { TrackListView } from "@/components/site/TrackListView";
import { BRAND, CONTACT_EMAIL, CONTACT_MAILTO } from "@/lib/brand";
import { formatPrice, products, SET } from "@/lib/products";
import { JsonLd, breadcrumbSchema, collectionSchema, setSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Shop the LALALOCA Collection",
  description:
    "Three serums — Thirst Trap, C Me Glow and Bounce Back. 50 ml, $38 each, free US shipping. What each one does, and how to pick.",
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
          /* The trio is the highest-value order in the store and had no
             machine-readable existence at all — it has no page of its own, so
             nothing described it as a purchasable thing. */
          setSchema(SET, products),
          breadcrumbSchema([{ name: "Shop", path: "/shop" }]),
        ]}
      />
      {/* Four words above the grid (copy-cut spec, 23 Aug 2026 — category
          median is five). Everything that used to sit here still exists:
          StandUp for Kids moved below the trio, the identity band collapsed
          into the title and the cards. A shopper sees a product on the first
          screen. */}
      <PageIntro
        eyebrow="The LALALOCA Collection"
        title="Three serums. Three energies."
      >
        <Link href="/find-your-serum" className="link-underline mt-4 text-charcoal">
          Not sure which? Three questions, one answer <span aria-hidden>↗</span>
        </Link>
      </PageIntro>

      <TrackListView
        items={products}
        listId="collection"
        listName="The LALALOCA Collection"
      />

      {/* Browsing, not reading — the elevator doors are the room now, not a
          card laid on paper. The long INCI/policy reading stays below on
          paper; this is the dark room a shopper walks through first. */}
      <section className="section bg-night pt-2" aria-label="Serums">
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

      {/* ---------------- All three: the FOUNDER parlour ----------------
          One photographed room — the serum counters like a gelateria, the
          three bottles on marble, and a gold-framed marble tariff board. The
          board's text and button are LIVE, laid over the cleaned photograph,
          so the price comes from products.ts and the button really adds the
          trio to the bag.

          Left on the light marble the photograph is shot on, deliberately:
          the tariff-board text and the counter card beneath it are reading a
          lit surface that exists in the room, not a cream section standing
          in for one. bg-cream here is only the fallback behind the image. */}
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
                No Woman Is Only
                <br />
                One Version
                <br />
                of Herself
              </h2>
              <div className="mt-[1em] h-px w-16 bg-bronze/70" aria-hidden />
              {/* The trio is a wardrobe, not a discount. The order of the three
                  verbs matches the order of the three identities above it, so
                  the set reads as the same argument the collection page just
                  made rather than an unrelated upsell. */}
              <p className="mt-[1em] max-w-[26ch] text-[clamp(0.8rem,1.05vw,1.125rem)] leading-relaxed text-charcoal/85">
                The Closer, The Entrance, The Comeback. Three full-size serums —
                hydrate, brighten, firm — for three different kinds of days.
              </p>
              <p className="mt-[1em] text-[clamp(0.8rem,1.05vw,1.125rem)] text-charcoal/85">
                {formatPrice(SET.price)} for all three · valued at{" "}
                {formatPrice(products.reduce((sum, p) => sum + p.price, 0))} · save{" "}
                {formatPrice(products.reduce((sum, p) => sum + p.price, 0) - SET.price)}
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
              No Woman Is Only One Version of Herself
            </h2>
            <div className="mx-auto mt-6 h-px w-16 bg-bronze/70" aria-hidden />
            <p className="mx-auto mt-6 max-w-md text-charcoal/85">
              The Closer, The Entrance, The Comeback. Three full-size serums —
              hydrate, brighten, firm — for three different kinds of days.
            </p>
            <p className="mt-4 text-charcoal/85">
              {formatPrice(SET.price)} for all three · valued at{" "}
              {formatPrice(products.reduce((sum, p) => sum + p.price, 0))} · save{" "}
              {formatPrice(products.reduce((sum, p) => sum + p.price, 0) - SET.price)}
            </p>
            <AddSetButton className="btn mt-8 w-full border border-bronze/40 bg-founder-green text-cream hover:bg-teal sm:w-auto" />
          </div>
        </div>
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
            Key actives are listed exactly as they appear on the label. The full
            ingredient list ships in every carton — email us for the supplier sheet.
          </p>
        </div>
      </section>

      {/* ---------------- The collaboration ----------------
          Why the nav calls this page LALALOCA × StandUp for Kids. The words
          are the Young Founders' Room's own — the collection copy and the
          commitment line are reused verbatim from that page, not rewritten,
          because the 20%-of-net-profits wording is approved as written and
          must be identical everywhere it appears. */}
      <section
        id="standup-for-kids"
        className="bg-founder-green py-16 text-shell md:py-20"
        aria-labelledby="standup-heading"
      >
        <div className="shell grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="eyebrow text-champagne">LALALOCA × StandUp for Kids</p>
            <h2
              id="standup-heading"
              className="mt-4 max-w-[24ch] font-serif text-[clamp(1.5rem,3vw,2.25rem)] leading-snug"
            >
              Part of this collection was built inside the StandUp for Kids
              Tucson Outreach Center.
            </h2>
            <div className="mt-5 max-w-prose space-y-4 text-shell/85">
              <p>
                At the Tucson Outreach Center, young people tried products,
                compared packaging, gave honest opinions, and made real
                decisions. They helped shape LALALOCA from the beginning.
              </p>
            </div>
            <Link
              href="/young-founders-room"
              className="mt-7 inline-flex min-h-11 items-center border-b border-champagne/60 text-[0.6875rem] uppercase tracking-[0.22em] text-champagne transition-colors hover:border-champagne"
            >
              Step into the Young Founders&rsquo; Room
            </Link>
          </div>

          <p className="font-serif text-2xl leading-snug text-rose md:text-3xl">
            20% of LALALOCA net profits.
            <br />
            Every month.
            <br />
            Directly to StandUp for Kids Tucson.
          </p>
        </div>
      </section>

      {/* ---------------- The close ----------------
          The last thing said about the collection, and the only place on this
          page the campaign line appears. Set stacked on two lines because the
          Master Brand Board prohibits a single-line setting, and taken from
          BRAND so it can never drift out of sync with the homepage. */}
      {/* A closing line, not a policy — it belongs in a room, not on paper.
          night-deep so it reads as a distinct beat from the green rooms on
          either side of it rather than a repeat of one of them. */}
      <section className="bg-night-deep py-16 text-center md:py-20" aria-label="The room is yours">
        <div className="shell">
          <p className="mx-auto max-w-[34rem] font-serif text-[clamp(1.375rem,2.6vw,2rem)] leading-snug text-cream">
            Some days you close. Some days you glow. Some days you start again.
          </p>
          <p className="mt-10 text-[0.6875rem] uppercase tracking-[0.24em] text-champagne">
            <span className="block">{BRAND.campaignLines[0]}</span>
            <span className="mt-2 block">{BRAND.campaignLines[1]}</span>
          </p>
        </div>
      </section>

      {/* ---------------- Shipping and returns ---------------- */}
      <section className="section-tight bg-cream">
        <div className="shell grid gap-8 border-t border-charcoal/12 pt-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h2 className="font-serif text-2xl text-charcoal">Shipping</h2>
            <p className="mt-2 text-sm text-charcoal/80">
              Free US shipping, 3–5 business days. Express $15, 1–2 days. Ships
              from Arizona within one business day.
            </p>
            <Link href="/policies/shipping" className="link-underline mt-2 text-charcoal">
              Details <span aria-hidden>↗</span>
            </Link>
          </div>
          <div>
            <h2 className="font-serif text-2xl text-charcoal">Returns</h2>
            <p className="mt-2 text-sm text-charcoal/80">
              Damaged or not what you expected? Write to{" "}
              <a href={CONTACT_MAILTO} className="link-underline text-charcoal">
                {CONTACT_EMAIL}
              </a>{" "}
              and we’ll make it right. A real problem is our problem.
            </p>
            <Link href="/policies/returns" className="link-underline mt-2 text-charcoal">
              Details <span aria-hidden>↗</span>
            </Link>
          </div>
          <div>
            <h2 className="font-serif text-2xl text-charcoal">Plainly</h2>
            <p className="mt-2 text-sm text-charcoal/80">
              Cosmetics, not medicine. No clinical claims, no before-and-afters, and
              no review we didn’t earn.
            </p>
          </div>
        </div>
      </section>
      {/* ---------------- Founding List ---------------- */}
      <section className="section-tight bg-founder-green py-14 md:py-16">
        <div className="shell">
          <div className="max-w-xl">
            <h2 className="headline text-balance text-cream">Enter the Founding List.</h2>
            <EmailSignup tone="green" source="shop" />
          </div>
        </div>
      </section>

    </>
  );
}
