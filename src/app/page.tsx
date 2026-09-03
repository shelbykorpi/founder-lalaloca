import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EmailSignup } from "@/components/site/EmailSignup";
import { Reveal } from "@/components/house/Reveal";
import { HouseShell } from "@/components/house/HouseShell";
import { EnterTheHouse } from "@/components/house/RoomTransition";
import { AmbientLighting } from "@/components/house/AmbientLighting";
import { getRoom } from "@/lib/rooms";
import { DoorFrame } from "@/components/house/DoorFrame";
import { RoomHero } from "@/components/house/RoomHero";
import { BRAND } from "@/lib/brand";
import { FOUNDER_COLLECTION } from "@/lib/founderCollection";
import { NEXT_MOVE } from "@/lib/nextMove";
import { products, formatPrice, SET } from "@/lib/products";

/**
 * THE HOUSE — the homepage. Seven rooms, one threshold.
 *
 * IT BUILT ON /after-hours FIRST, and that was worth the three days. The
 * direction went through three iterations in a week and every one arrived
 * with factual errors in the product data — a product dropped, a fill
 * invented, a sunscreen claim on something with no SPF test — so it went up
 * beside the real homepage, on the real domain, against the real catalogue,
 * and was walked before it took the front door. It took the front door on
 * 30 August. The old campaign homepage is in the history at 19951ab if any
 * of it is wanted back.
 *
 * WHAT IS TAKEN FROM THE REVIEW BUILD — the structure, and it is good:
 * seven numbered rooms, a full-bleed threshold, captions living inside the
 * photographs, hairline links in place of buttons, alternating full-bleed
 * fields, scroll reveals, and a rail that names the room you are standing in.
 *
 * WHAT IS REFUSED, AND WHY:
 *
 *   · #08130f as the ground. Founder Green #164d49 is the master brand field
 *     with an exact hex and every door photograph is graded to it. The
 *     after-hours depth comes from --color-emerald-deep #0a2523, which is
 *     already the token for the room behind the door.
 *   · #b8955e as the brass. Antique Gold is #b08a64. The third variant in
 *     three weeks; see the gold rule in globals.css for what carries small
 *     text on which ground.
 *   · The lockup in two colours across four lines, the second in italic.
 *     Brand board: always two lines. One face, one colour.
 *   · The review build's catalogue. It drops Clean Break — a real product with
 *     finished artwork and a verified label — and replaces it with product
 *     pages for Opening Line and Sign Here, which have no formula. It also
 *     still captions Hold the Room "Peptide moisturizer · 50 mL" (it is a
 *     moisturizing cream, 30 ml) and invents "150 mL" for Opening Line, which
 *     is a regulated declaration for a product that does not exist. Every
 *     figure on this page is read from the repo.
 *   · Calling the three LALALOCA serums "the archive". They are the products
 *     on sale.
 */

/* The seven rooms are in src/lib/rooms.ts now; the rail reads them there. */

/* No `title` — the root layout's template would render "FOUNDER | FOUNDER".
   The homepage takes SITE.title from the layout default, which is the one
   place the site's name is written. */
export const metadata: Metadata = {
  description:
    "FOUNDER after dark. A private world for women who already know what they bring. Beauty for what you're building.",
  alternates: { canonical: "/" },
};

/* The line and the fill, read from the repo rather than retyped. */
const holdTheRoom = FOUNDER_COLLECTION[0];
const threshold = getRoom(1);
const bySlug = Object.fromEntries(NEXT_MOVE.map((p) => [p.slug, p]));

const LINE = [
  {
    n: "01",
    archetype: "The Opener",
    name: bySlug["opening-line"].name,
    descriptor: `${bySlug["opening-line"].category} · ${bySlug["opening-line"].size}`,
    image: "/products/opening-line-tall.webp",
    alt: "Opening Line in rose and green stripes, alone under a single light on dark stone.",
    href: "/products/opening-line",
    state: "Reserve · Nothing charged today",
    action: "Reserve",
    ready: false,
  },
  {
    n: "02",
    archetype: "The Reset",
    name: bySlug["clean-break"].name,
    descriptor: `${bySlug["clean-break"].category} · ${bySlug["clean-break"].size}`,
    image: "/products/clean-break-tall.webp",
    alt: "Clean Break beside a running brass tap on a cream marble basin.",
    href: "/products/clean-break",
    state: "Reserve · Nothing charged today",
    action: "Reserve",
    ready: false,
  },
  {
    n: "03",
    archetype: "The Anchor",
    name: holdTheRoom.name,
    descriptor: `${holdTheRoom.category} · ${holdTheRoom.size}`,
    image: "/products/hold-the-room-tall.webp",
    alt: "Hold the Room on a marble dressing table, green doors open onto a lit vanity beyond.",
    href: "/products/hold-the-room",
    state: "Preorder · Ships from the first run",
    action: `Preorder · ${formatPrice(holdTheRoom.price)}`,
    ready: true,
  },
  {
    n: "04",
    archetype: "The Second Look",
    name: bySlug["double-take"].name,
    descriptor: `${bySlug["double-take"].category} · ${bySlug["double-take"].size}`,
    image: "/products/double-take-tall.webp",
    alt: "Double Take and its striped carton on a marble vanity by a lit mirror.",
    href: "/products/double-take",
    state: "Reserve · Nothing charged today",
    action: "Reserve",
    ready: false,
  },
  {
    n: "05",
    archetype: "The Closer",
    name: bySlug["smooth-talker"].name,
    descriptor: `${bySlug["smooth-talker"].category} · ${bySlug["smooth-talker"].size} · 3 shades`,
    image: "/products/smooth-talker-tall.webp",
    alt: "Smooth Talker in 25 Medium beside its striped carton on a brass table.",
    href: "/products/smooth-talker",
    state: "Reserve · Nothing charged today",
    action: "Reserve",
    ready: false,
  },
];

/* Named on the board, not made. No photograph, no price, no product page and
   no Reserve — a reservation implies something to reserve. The review build
   gives both of these their own product page with a Reserve button; board
   v2.14 bars them from the site as products in any form. */
const IN_THE_MAKING = [
  /* OPENING LINE LEFT THIS LIST ON 30 AUGUST. It has a supplier, a verified
     fill, a certification and finished artwork, so it is a reservation in
     LINE above rather than a name here.

     SIGN HERE STAYS, and is likely to stay a while. Two suppliers have now
     failed it: neither Blanka nor Selfnamed stocks a conditioning lip
     treatment, and the board wants a fountain-pen silhouette with a visible
     chamber, which is custom tooling rather than a catalogue component. */
  { n: "06", archetype: "The Signature", name: "Sign Here", descriptor: "Lip treatment" },
];

const NOTES = [
  {
    src: "/editorial/our-story-desk.webp",
    w: 2105,
    h: 747,
    alt: "An open journal on a green leather desk, a fountain pen beside it.",
    line: "The note was left for you.",
  },
  {
    src: "/editorial/trio-parlor.webp",
    w: 1915,
    h: 821,
    alt: "The three LALALOCA serums on a counter in a dark panelled parlour.",
    line: "Nothing loud. Everything intentional.",
  },
  {
    src: "/editorial/next-move-dressing-room.webp",
    w: 1672,
    h: 941,
    alt: "A dressing room of green panelling and brass, warm lamps lit.",
    line: "A mirror, a ritual, a reminder.",
  },
  {
    src: "/editorial/collection-vanity.webp",
    w: 1672,
    h: 941,
    alt: "A row of bulb-lit gilt mirrors along a marble dressing counter.",
    line: "The house remembers.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-emerald-deep text-cream">
      <HouseShell room={2}>

      {/* ══ 01 · THE THRESHOLD ══════════════════════════════════════════════
          Full bleed, and the copy sits in the photograph's own dark half so
          it never needs a scrim over her face. */}
      <section id="room-threshold" className="relative isolate min-h-[calc(100svh-4rem)] overflow-hidden">
        <Image
          src={threshold.hero.src}
          alt={threshold.hero.alt}
          fill
          priority
          sizes="100vw"
          className="hidden object-cover object-[58%_center] md:block"
        />
        <Image
          src={threshold.heroMobile.src}
          alt={threshold.hero.alt}
          fill
          loading="eager"
          sizes="100vw"
          className="object-cover object-[center_40%] md:hidden"
        />
        <AmbientLighting />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,37,35,0)_38%,rgba(10,37,35,0.9)_82%,#0a2523_100%)] md:bg-[linear-gradient(90deg,#0a2523_0%,rgba(10,37,35,0.94)_26%,rgba(10,37,35,0.55)_44%,rgba(10,37,35,0)_62%)]"
        />
        <div className="shell relative flex min-h-[calc(100svh-4rem)] flex-col justify-end pb-16 pt-24 md:justify-center md:py-24">
          <div className="max-w-[44rem]">
            <p className="room-label">{BRAND.display} · The house after hours</p>
            {/* Two lines. One face. One colour. */}
            <h1 className="display-house mt-6 text-cream">
              <span className="block">{BRAND.campaignLines[0]}</span>
              <span className="block">{BRAND.campaignLines[1]}</span>
            </h1>
            <p className="mt-7 max-w-[34rem] text-[1.0625rem] leading-relaxed text-cream/80">
              Not a place to become someone else. A private world for women who already
              know what they bring.
            </p>
            <p className="mt-3 font-serif text-2xl text-blush">{BRAND.tagline}</p>
            {/* 3 Sept 2026: the primary action sells. A woman could read the
                whole threshold without a way to a product; now the gold button
                is the shop and the house is the hairline beside it. */}
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link href="/shop" className="btn btn-primary w-full sm:w-auto">
                Shop the serums
              </Link>
              <EnterTheHouse className="btn btn-ghost-light w-full sm:w-auto" />
            </div>
          </div>
        </div>
      </section>

      <DoorFrame label="Room 02 · Inside FOUNDER" />

      {/* ══ 02 · INSIDE FOUNDER ═════════════════════════════════════════════ */}
      <RoomHero
        id="room-house"
        as="h2"
        room={getRoom(2)}
        height="min-h-[78svh]"
        title="Come in. Stay awhile."
        lede={
          <>
            The door closes softly behind you.
            <br />
            The lights are low.
            <br />
            On the vanity, a note waits with your name on it.
          </>
        }
      >
        <a href="#room-collection" className="hairline text-cream">
          Follow the light ↓
        </a>
      </RoomHero>
      <section className="section bg-emerald-deep pt-10">
        <div className="shell">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                src: "/editorial/found-her-mirror.webp",
                alt: "A gilt mirror in the FOUNDER house catching low brass light.",
                cap: "The mirror",
              },
              {
                src: "/editorial/the-room-is-yours.webp",
                alt: "A green typewriter on velvet, a page reading THE ROOM IS YOURS, a candle lit beside it.",
                cap: "The note",
              },
              {
                src: "/editorial/hero-two-women.webp",
                alt: "Two women in the dark green hall, a warm-lit doorway behind them — one in a cream suit and rust silk blouse, one in a deep green wrap dress — both looking straight into the camera.",
                cap: "The company",
              },
            ].map((tile, i) => (
              <Reveal key={tile.cap} as="figure" delay={i * 90} className="m-0">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-emerald">
                  <Image
                    src={tile.src}
                    alt={tile.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 90vw, 30vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="room-label mt-4">{tile.cap}</figcaption>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10">
            <Link href="/our-story" className="hairline text-cream">
              Inside FOUNDER
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ══ 03 · THE COLLECTION ═════════════════════════════════════════════
          Six on the shelf at three stages, and the state line under each name
          is what stops a reservation reading as a sale. */}
      {/* THE COLLECTION ROOM IS DARK, and it was cream until 30 August.
          Two reasons it had to move. Every tile in it is already a dark
          object — a photograph under a near-black gradient with cream type —
          so a cream ground was a white mat around six dark pictures rather
          than a lit room. And a grid of products is browsing, not reading;
          `.paper` is for the things people read, which is why the ritual and
          the ingredient lists further in are still lit. */}
      <RoomHero
        id="room-collection"
        as="h2"
        src="/editorial/rooms/collection-mirror.webp"
        mobileSrc="/editorial/rooms/collection-mirror-m.webp"
        alt="The FOUNDER Collection boardroom: a long black marble table set with striped packs at every seat, an empty green chair with a rose silk over its arm before a bulb-lit mirror."
        position="56% center"
        height="min-h-[68svh]"
        label="Room 03 · The Collection"
        title="Private tools. Public power."
        lede="Six pieces for the twenty minutes before you walk in. The first ships now. The rest are yours to hold — nothing charged until they’re priced, and you hear first."
      >
        <Link href="/founder-collection" className="btn btn-primary">
          Explore the collection
        </Link>
      </RoomHero>
      <section className="section bg-night pt-10">
        <div className="shell">

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {LINE.map((item, i) => (
              <Reveal key={item.name} as="article" delay={(i % 3) * 90} className="m-0">
                <Link
                  href={item.href}
                  className="group relative block aspect-[2/3] overflow-hidden bg-emerald-deep"
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(to_top,rgba(10,37,35,0.97)_10%,rgba(10,37,35,0.86)_36%,rgba(10,37,35,0.35)_64%,transparent)]"
                  />
                  <span className="absolute inset-x-0 bottom-0 z-10 block p-6">
                    <span className="room-label block">
                      {item.n} · {item.archetype}
                    </span>
                    <span className="mt-2 block font-serif text-[1.75rem] font-light leading-none text-cream">
                      {item.name}
                    </span>
                    <span className="mt-2 block text-[0.8125rem] text-cream/75">
                      {item.descriptor}
                    </span>
                    <span className="mt-3 flex items-center gap-2 text-[0.5rem] uppercase tracking-[0.16em] text-cream/80">
                      <span
                        aria-hidden
                        className={`block h-[0.3rem] w-[0.3rem] rounded-full ${
                          item.ready ? "bg-champagne" : "bg-cream/35"
                        }`}
                      />
                      {item.state}
                    </span>
                    <span className="mt-4 flex items-center justify-between border-t border-cream/15 pt-3">
                      <span className="text-[0.5rem] uppercase tracking-[0.16em] text-cream">
                        See it
                      </span>
                      <span className="text-[0.5rem] uppercase tracking-[0.16em] text-champagne">
                        {item.action}
                      </span>
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}

            {IN_THE_MAKING.map((item, i) => (
              <Reveal key={item.name} as="article" delay={(i % 3) * 90} className="m-0">
                {/* An unfurnished room, not a blank card. This tile was cream —
                    which on a dark page made the two products nobody can buy
                    the brightest objects in the collection. */}
                <div className="relative flex aspect-[2/3] flex-col justify-end overflow-hidden border border-bronze/20 bg-night-deep p-6">
                  <span
                    aria-hidden
                    className="absolute inset-0 flex items-center justify-center font-serif text-4xl font-light text-cream/10"
                  >
                    {item.name}
                  </span>
                  <span className="relative">
                    <span className="room-label block">
                      {item.n} · {item.archetype}
                    </span>
                    <span className="mt-2 block font-serif text-[1.75rem] font-light leading-none text-cream">
                      {item.name}
                    </span>
                    <span className="mt-2 block text-[0.8125rem] text-cream/70">
                      {item.descriptor}
                    </span>
                    <span className="mt-3 flex items-center gap-2 text-[0.5rem] uppercase tracking-[0.16em] text-cream/70">
                      <span aria-hidden className="block h-[0.3rem] w-[0.3rem] rounded-full bg-bronze" />
                      In the making
                    </span>
                    <span className="mt-4 block border-t border-bronze/20 pt-3">
                      <Link href="#room-invitation" className="hairline text-cream">
                        Join the waitlist
                      </Link>
                    </span>
                  </span>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </section>

      {/* ══ THE SERUM SALON ═════════════════════════════════════════════════
          The products taking money get a room of their own, not a footnote
          under the collection. */}
      <RoomHero
        as="h2"
        src="/editorial/rooms/serum-salon-arches.webp"
        mobileSrc="/editorial/rooms/serum-salon-arches-m.webp"
        alt="The serum salon: three lit marble niches in teal, gold and red, one bottle in each, over a black marble counter, pink desert sky through the arches either side."
        position="center center"
        height="min-h-[64svh]"
        label="The serum salon · The LALALOCA Collection"
        title="Three serums. Three energies."
        lede="Some days you close. Some days you glow. Some days you start again."
      >
        <Link href="/shop" className="btn btn-primary">
          Shop the serums
        </Link>
        <Link href="/find-your-serum" className="hairline text-cream">
          Which one is yours?
        </Link>
      </RoomHero>
      <section className="section bg-night pt-10">
        <div className="shell">
          <Reveal>
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <p className="room-label">Ships now · The LALALOCA serums</p>
              <Link href="/shop#set-heading" className="hairline text-cream">
                All three for {formatPrice(SET.price)} — save{" "}
                {formatPrice(products.reduce((sum, p) => sum + p.price, 0) - SET.price)}
              </Link>
            </div>
            <ul className="mt-8 grid gap-10 sm:grid-cols-3">
              {products.map((product) => (
                <li key={product.slug}>
                  <Link href={`/products/${product.slug}`} className="group block text-center">
                    <span className="relative mx-auto block h-40 w-24 md:h-48 md:w-28">
                      <Image
                        src={product.bottle}
                        alt={`The ${product.name} bottle.`}
                        fill
                        loading="lazy"
                        sizes="112px"
                        className="object-contain transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    </span>
                    <span className="room-label mt-5 block">{product.archetype}</span>
                    <span className="mt-2 block font-serif text-2xl leading-none text-cream">
                      {product.name}
                    </span>
                    <span className="mt-2 block font-serif text-lg leading-snug text-cream/80">
                      {product.hero}
                    </span>
                    <span className="mt-3 block text-sm text-cream">
                      {formatPrice(product.price)} · {product.size.split(" /")[0]}
                    </span>
                    <span className="mt-4 inline-flex min-h-11 items-center text-[0.6875rem] uppercase tracking-[0.18em] text-champagne transition-colors group-hover:text-cream">
                      Shop {product.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <DoorFrame label="Room 04 · The Anchor" />

      {/* ══ 04 · THE ANCHOR ═════════════════════════════════════════════════ */}
      <section id="room-anchor" className="section bg-founder-green">
        <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1fr] lg:items-center lg:gap-20">
          <Reveal>
            <div className="relative aspect-[1003/1568] w-full overflow-hidden bg-emerald">
              <Image
                src="/products/hold-the-room-vanity-mirror.webp"
                alt="Hold the Room on a marble dressing table in front of a gilt mirror, a woman fastening her cuff in the reflection."
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 90vw, 34vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="room-label">Room 04 · The Anchor</p>
            <h2 className="headline-house mt-5 text-balance text-cream">Hold the room.</h2>
            <p className="mt-7 max-w-[42ch] text-[0.9375rem] leading-relaxed text-cream/80">
              {holdTheRoom.hero} A rich moisturizing cream with chamomile and witch hazel —
              the last step of the routine, and the one that stays comfortable all day.
            </p>
            <p className="mt-7 max-w-[40ch] border-l-2 border-bronze py-3 pl-5 text-[0.8125rem] leading-relaxed text-cream/70">
              {holdTheRoom.preorder}
            </p>
            <div className="mt-9">
              <Link href="/products/hold-the-room" className="btn btn-primary">
                Preorder · {formatPrice(holdTheRoom.price)}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ 05 · FOUND HER ══════════════════════════════════════════════════ */}
      <section id="room-found-her" className="relative isolate overflow-hidden">
        <Image
          src="/editorial/rooms/found-her-hall-sky.webp"
          alt="The FOUND HER gallery: gilt-framed portraits of women along a dark marble hall, a door at the end open onto a pink desert sky."
          fill
          loading="lazy"
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,37,35,0.86)_0%,rgba(10,37,35,0.7)_60%,rgba(10,37,35,0.94)_100%)] md:bg-[linear-gradient(90deg,rgba(10,37,35,0.97)_0%,rgba(10,37,35,0.9)_32%,rgba(10,37,35,0.5)_58%,rgba(10,37,35,0.1)_100%)]"
        />
        <div className="shell relative py-20 md:py-28">
          <Reveal className="max-w-[34rem]">
            <p className="room-label">Room 05 · Found Her</p>
            <p className="mt-5 font-serif text-2xl leading-snug text-blush">
              Stories from women who built before anyone applauded.
            </p>
            <h2 className="headline-house mt-4 text-balance text-cream">{BRAND.campaign}</h2>
            <p className="mt-6 max-w-[38ch] text-[0.9375rem] leading-relaxed text-cream/80">
              The woman. The cost. The turning point. The private truth beneath public success.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link href="/found-her#share" className="btn btn-primary">
                I found her when…
              </Link>
              <Link href="/found-her" className="hairline text-cream">
                Read Found Her
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <DoorFrame label="Room 06 · Notes from the house" />

      {/* ══ 06 · NOTES FROM THE HOUSE ═══════════════════════════════════════ */}
      <section id="room-notes" className="section bg-emerald-deep">
        <div className="shell">
          <Reveal>
            <p className="room-label">Room 06 · Notes from the house</p>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {NOTES.map((note, i) => (
              <Reveal key={note.line} as="figure" delay={(i % 4) * 80} className="m-0">
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-emerald">
                  <Image
                    src={note.src}
                    alt={note.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 90vw, (max-width: 1280px) 45vw, 22vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-4 font-serif text-lg leading-snug text-blush">
                  {note.line}
                </figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ THE PLEDGE ══════════════════════════════════════════════════════
          Absent from the review build and from the creative deck. It is the
          house's largest truth claim and the wording never changes. */}
      <section className="section-tight bg-rose py-14 text-charcoal md:py-16">
        <div className="shell flex flex-col items-center gap-4 text-center">
          <p className="room-label" style={{ color: "#5a2f2c" }}>
            LALALOCA × StandUp for Kids
          </p>
          <p className="max-w-[26ch] font-serif text-[clamp(1.35rem,2.6vw,2rem)] leading-snug">
            20% of LALALOCA net profits. Every month. Directly to StandUp for Kids Tucson.
          </p>
          <Link href="/young-founders-room" className="hairline mt-2 text-charcoal">
            How the giving works
          </Link>
        </div>
      </section>

      {/* ══ 07 · THE INVITATION ═════════════════════════════════════════════ */}
      <section id="room-invitation" className="section-tight bg-founder-green py-16 md:py-20">
        <div className="shell">
          <Reveal className="max-w-xl">
            <p className="room-label">Room 07 · The invitation</p>
            <h2 className="headline-house mt-5 text-balance text-cream">
              Be first through the door.
            </h2>
            {/* No standfirst here: EmailSignup already carries its own heading
                and explanation, and two of them read as a stutter. */}
            <EmailSignup tone="green" source="home" />
          </Reveal>
        </div>
      </section>
      </HouseShell>
    </div>
  );
}
