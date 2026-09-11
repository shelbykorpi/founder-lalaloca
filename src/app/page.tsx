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
import { Vanity } from "@/components/house/Vanity";
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
    image: "/products/opening-line-cut.webp",
    alt: "Opening Line: the oil-to-milk cleanser bottle, Founder Green label with cream and green stripes and a white pump.",
    href: "/products/opening-line",
    hook: bySlug["opening-line"].hook,
    state: "In stock · Ships in one business day",
    action: `Shop · ${formatPrice(bySlug["opening-line"].price)}`,
    ready: true,
  },
  {
    n: "02",
    archetype: "The Reset",
    name: bySlug["clean-break"].name,
    descriptor: `${bySlug["clean-break"].category} · ${bySlug["clean-break"].size}`,
    image: "/products/clean-break-cut.webp",
    alt: "Clean Break: the purifying face wash bottle, Founder Green label with cream and green stripes and a white pump.",
    href: "/products/clean-break",
    hook: bySlug["clean-break"].hook,
    state: "In stock · Ships in one business day",
    action: `Shop · ${formatPrice(bySlug["clean-break"].price)}`,
    ready: true,
  },
  {
    n: "03",
    archetype: "The Anchor",
    name: holdTheRoom.name,
    descriptor: `${holdTheRoom.category} · ${holdTheRoom.size}`,
    image: "/products/hold-the-room-cut.webp",
    alt: "Hold the Room: the airless bottle and its carton, Desert Pink with a cream cartouche and gold crest.",
    href: "/products/hold-the-room",
    hook: holdTheRoom.hero,
    state: "Preorder · Ships from the first run",
    action: `Preorder · ${formatPrice(holdTheRoom.price)}`,
    ready: true,
  },
  {
    n: "04",
    archetype: "The Second Look",
    name: bySlug["double-take"].name,
    descriptor: `${bySlug["double-take"].category} · ${bySlug["double-take"].size}`,
    image: "/products/double-take-cut.webp",
    alt: "Double Take: the small eye-cream bottle and its carton, Desert Pink with a cream cartouche and gold crest.",
    href: "/products/double-take",
    hook: bySlug["double-take"].hook,
    state: "In stock · Ships in one business day",
    action: `Shop · ${formatPrice(bySlug["double-take"].price)}`,
    ready: true,
  },
  {
    n: "05",
    archetype: "The Closer",
    name: bySlug["smooth-talker"].name,
    descriptor: `${bySlug["smooth-talker"].category} · ${bySlug["smooth-talker"].size} · 3 shades`,
    image: "/products/smooth-talker-cut.webp",
    alt: "Smooth Talker: the tinted stick in 25 Medium and its brass carton, with a cream cartouche and gold crest.",
    href: "/products/smooth-talker",
    hook: bySlug["smooth-talker"].hook,
    state: "In stock · 3 shades",
    action: `Shop · ${formatPrice(bySlug["smooth-talker"].price)}`,
    ready: true,
  },
];

/* Named on the board, not made. No photograph, no price, no product page and
   no Reserve — a reservation implies something to reserve. The review build
   gives both of these their own product page with a Reserve button; board
   v2.14 bars them from the site as products in any form. */
/* Empty since 4 Sep 2026. Opening Line left on 30 Aug (it became a reservation,
   now a live SKU); Sign Here was removed from the site entirely at Shelby's
   direction. Every piece in the collection is now priced, stocked and Active,
   so there is nothing "in the making" to tile. Kept typed so the grid below
   simply renders nothing rather than needing its markup pulled. */

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
      {/* ══ FOUND HER — the note on the vanity ══════════════════════════════
          10 Sept 2026. The three-tile gallery that used to follow this hero
          (The mirror · The note · The company) came out at Shelby's
          direction, and this band took its place: Desert Rose at full voice,
          the one ground the board reserves for FOUND HER, between the lounge
          and the collection. Same construction as the pledge band further
          down — label, one serif line, one hairline — so the two rose moments
          on the page read as the same gesture. The campaign line is
          BRAND.campaign, never retyped. The hero above keeps the #room-house
          anchor that "Enter the house" and Room 07's doors resolve to. */}
      <section
        aria-labelledby="found-her-band"
        className="section-tight bg-rose py-14 text-charcoal md:py-16"
      >
        <div className="shell flex flex-col items-center gap-4 text-center">
          <p className="room-label" style={{ color: "#5a2f2c" }}>
            Found Her
          </p>
          <p
            id="found-her-band"
            className="max-w-[22ch] font-serif text-[clamp(1.6rem,3.4vw,2.75rem)] leading-tight text-balance"
          >
            {BRAND.campaign}
          </p>
          <p className="max-w-[34ch] text-charcoal/75">
            The story begins where the performance ends.
          </p>
          <Link href="/found-her" className="hairline mt-2 text-charcoal">
            Read their stories
          </Link>
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
      {/* THE VANITY — 11 Sept 2026, replacing the gallery walk. The corridor
          was a rendered photograph with the products inside it: small, far
          apart, one legible at a time, and wrong the moment the packaging
          changed. Now the five stand on the console of a real room, sharp,
          at true relative scale, never dimmed; the mirror light follows
          whichever one you look at. Data is still LINE above. See Vanity.tsx
          and the note at the head of vanity.module.css. */}
      <Vanity
        items={LINE}
        title="The twenty minutes before you walk in."
        lede="Five pieces on the vanity, in the order you use them. Light one."
      />

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
                alt="Hold the Room and its Desert Pink carton on a marble dressing table in front of a gilt mirror, a woman fastening her cuff in the reflection."
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
