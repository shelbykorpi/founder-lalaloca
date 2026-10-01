import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EmailSignup } from "@/components/site/EmailSignup";
import { Reveal } from "@/components/house/Reveal";
import { HouseShell } from "@/components/house/HouseShell";
import { AmbientLighting } from "@/components/house/AmbientLighting";
import { getRoom } from "@/lib/rooms";
import { DoorFrame } from "@/components/house/DoorFrame";
import { RoomHero } from "@/components/house/RoomHero";
import { Vanity } from "@/components/house/Vanity";
import { ThresholdDoors } from "@/components/house/ThresholdDoors";
import { GrandHall } from "@/components/house/GrandHall";
import { ConciergeLauncher } from "@/components/concierge/ConciergeLauncher";
import { CONCIERGE_ENABLED } from "@/lib/concierge/enabled";
import { BRAND, CONTACT_MAILTO } from "@/lib/brand";
import { FOUNDER_COLLECTION } from "@/lib/founderCollection";
import { NEXT_MOVE, availabilityLine, type Availability } from "@/lib/nextMove";
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
 *     invented "150 mL" for Opening Line before that product existed — a
 *     regulated declaration for a product that did not exist. Every figure on
 *     this page is read from the repo. (16 Sept 2026: Hold the Room IS now the
 *     50 ml peptide cream — the Selfnamed cart settled it; founderCollection.ts
 *     was retranscribed from that listing.)
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
/* The card's verb follows the record's sale state (17 Sept 2026, F-02):
   a preorder says Preorder, the way Hold the Room's card always has. */
const actionWord = (a: Availability) => (a === "preorder" ? "Preorder" : "Shop");

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
    state: availabilityLine(bySlug["opening-line"].availability),
    action: `${actionWord(bySlug["opening-line"].availability)} · ${formatPrice(bySlug["opening-line"].price)}`,
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
    state: availabilityLine(bySlug["clean-break"].availability),
    action: `${actionWord(bySlug["clean-break"].availability)} · ${formatPrice(bySlug["clean-break"].price)}`,
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
    state: availabilityLine("in-stock"),
    action: `Shop · ${formatPrice(holdTheRoom.price)}`,
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
    state: availabilityLine(bySlug["double-take"].availability),
    action: `${actionWord(bySlug["double-take"].availability)} · ${formatPrice(bySlug["double-take"].price)}`,
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
    state: `${availabilityLine(bySlug["smooth-talker"].availability)} · 3 shades`,
    action: `${actionWord(bySlug["smooth-talker"].availability)} · ${formatPrice(bySlug["smooth-talker"].price)}`,
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

export default function HomePage() {
  return (
    <div className="bg-emerald-deep text-cream">
      {/* THE FRONT DOOR — 12 Sept 2026, brief §3. An overlay, never a gate:
          client-mounted only, once a session, skipped entirely under reduced
          motion, and carrying SHOP DIRECTLY from the first frame. Everything
          below is in the server HTML whether it mounts or not. */}
      <ThresholdDoors />
      <HouseShell room={2}>

      {/* ══ 01 · THE THRESHOLD ══════════════════════════════════════════════
          Full bleed, the doors centred, the copy on the hall's left wall.

          30 Sept 2026, new frame (Shelby's): the front hall — the Founder
          Green double doors standing open on the rose-lit salon, black
          marble and candlelight either side. The doors are the subject, so
          the picture is centred and the left wall is the ground for the
          copy. That wall is busy with candle flames, so it carries a shade
          (90% → 0 by the left door's edge from xl; wider between md and xl,
          where the copy's fixed measure reaches further across the frame); there is no face in this frame
          for a scrim to cover. Below md the phone crop (705×941, centred on
          the doorway) keeps the F and the chandelier above the copy; its
          fade is measured in px from the bottom, because the copy block is a
          fixed height pinned to the bottom, so the shade follows the copy
          (the label included) on short phones instead of a % of the frame. */}
      <section id="room-threshold" className="relative isolate min-h-[calc(100svh-4rem)] overflow-hidden">
        <Image
          src={threshold.hero.src}
          alt={threshold.hero.alt}
          fill
          priority
          sizes="100vw"
          className="hidden object-cover object-center md:block"
        />
        <Image
          src={threshold.heroMobile.src}
          alt={threshold.hero.alt}
          fill
          loading="eager"
          sizes="100vw"
          className="object-cover object-center md:hidden"
        />
        <AmbientLighting />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(0deg,#0a2523_0,rgba(10,37,35,0.93)_240px,rgba(10,37,35,0.8)_460px,rgba(10,37,35,0)_620px)] md:bg-[linear-gradient(90deg,rgba(10,37,35,0.92)_0%,rgba(10,37,35,0.82)_40%,rgba(10,37,35,0.4)_56%,rgba(10,37,35,0)_68%)] xl:bg-[linear-gradient(90deg,rgba(10,37,35,0.9)_0%,rgba(10,37,35,0.78)_28%,rgba(10,37,35,0.35)_42%,rgba(10,37,35,0)_52%)]"
        />
        <div className="shell relative flex min-h-[calc(100svh-4rem)] flex-col justify-end pb-16 pt-24 md:justify-center md:py-24">
          <div className="max-w-[44rem]">
            <p className="room-label">{BRAND.display} · Welcome inside</p>
            <h1 className="mt-6 max-w-[12ch] font-serif text-[clamp(2.6rem,7vw,5rem)] font-light leading-[0.92] tracking-[-0.03em] text-cream">
              Come for the beauty.
              <span className="block italic text-blush">Stay for everything behind it.</span>
            </h1>
            <p className="mt-7 max-w-[35rem] text-[1.02rem] leading-[1.75] text-cream/82">
              Skincare is the first door. Inside: the FOUNDER Collection, the LALALOCA serums,
              FOUND HER stories, and a house built to hold more than one version of a woman.
            </p>
            <p className="mt-4 font-serif text-[1.45rem] text-blush">{BRAND.tagline}</p>
            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-4">
              <Link href="/founder-collection" className="btn btn-primary w-full sm:w-auto">
                Enter the FOUNDER Collection
              </Link>
              <Link href="/found-her" className="btn btn-ghost-light w-full sm:w-auto">
                Meet FOUND HER
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-[0.7rem] uppercase tracking-[0.18em] text-cream/60">
              <span>Not sure where to start?</span>
              {/* Concierge off until it's fixed (lib/concierge/enabled.ts):
                  the serum finder answers "where to start" meanwhile. */}
              {CONCIERGE_ENABLED ? (
                <ConciergeLauncher
                  source="home-hero"
                  className="hairline text-champagne"
                >
                  Ring the concierge
                </ConciergeLauncher>
              ) : (
                <Link href="/find-your-serum" className="hairline text-champagne">
                  Find your serum
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-bronze/15 bg-night-deep py-7 text-cream md:py-8" aria-label="Inside FOUNDER">
        <div className="shell">
          <p className="mb-5 text-[0.58rem] uppercase tracking-[0.24em] text-champagne/75">
            Tonight in the house
          </p>
          <div className="grid gap-px overflow-hidden border border-bronze/15 bg-bronze/15 md:grid-cols-3">
            <Link href="/founder-collection" className="group bg-night-deep px-5 py-5 no-underline transition-colors hover:bg-founder-green/35 md:px-6">
              <span className="block text-[0.56rem] uppercase tracking-[0.22em] text-champagne/70">01 · The collection</span>
              <span className="mt-2 block font-serif text-[1.35rem] text-cream">Five pieces. One routine.</span>
              <span className="mt-2 block text-sm text-cream/55 group-hover:text-cream/75">Walk in →</span>
            </Link>
            <Link href="/found-her" className="group bg-night-deep px-5 py-5 no-underline transition-colors hover:bg-founder-green/35 md:px-6">
              <span className="block text-[0.56rem] uppercase tracking-[0.22em] text-champagne/70">02 · FOUND HER</span>
              <span className="mt-2 block font-serif text-[1.35rem] text-cream">Real women. Their own words.</span>
              <span className="mt-2 block text-sm text-cream/55 group-hover:text-cream/75">Read the stories →</span>
            </Link>
            <Link href="/shop" className="group bg-night-deep px-5 py-5 no-underline transition-colors hover:bg-founder-green/35 md:px-6">
              <span className="block text-[0.56rem] uppercase tracking-[0.22em] text-champagne/70">03 · LALALOCA</span>
              <span className="mt-2 block font-serif text-[1.35rem] text-cream">Three serums. Three kinds of day.</span>
              <span className="mt-2 block text-sm text-cream/55 group-hover:text-cream/75">Choose yours →</span>
            </Link>
          </div>
          {/* NOW PLAYING (Shelby, 2 Oct 2026): "Spin In The Dark" by The Bela
              Vibe, through Spotify's own embed, which is licensed for sites,
              so no audio file and no music licence of ours is involved.
              Signed-in Spotify listeners hear the full track; everyone else
              gets Spotify's 30-second preview. Nothing auto-plays. Lazy, so
              it costs nothing until the visitor scrolls near it. The privacy
              policy names it, because Spotify may set its own cookies. */}
          <div className="mt-5 grid gap-4 border-t border-bronze/10 pt-5 md:grid-cols-[minmax(0,1fr)_26rem] md:items-center md:gap-8">
            <div>
              <span className="block text-[0.56rem] uppercase tracking-[0.22em] text-champagne/70">
                Now playing in the house
              </span>
              <span className="mt-2 block font-serif text-[1.35rem] text-cream">Spin In The Dark</span>
              <span className="mt-1 block text-sm text-cream/55">The Bela Vibe</span>
            </div>
            <iframe
              title="Spin In The Dark by The Bela Vibe, on Spotify"
              src="https://open.spotify.com/embed/track/7dY2Gy12KLH8LkxcneRKce?utm_source=generator&theme=0"
              width="100%"
              height="80"
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="block w-full rounded-[12px] border-0"
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-bronze/10 pt-5">
            <p className="text-sm text-cream/55">
              Need a recommendation, an order answer, or help finding your way through the house?
            </p>
            {CONCIERGE_ENABLED ? (
              <ConciergeLauncher
                source="home-house-rail"
                className="btn btn-ghost-light"
              >
                Ring for service
              </ConciergeLauncher>
            ) : (
              <a href={CONTACT_MAILTO} className="btn btn-ghost-light">
                Email us
              </a>
            )}
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
        title="The elevator is waiting."
        lede={
          <>
            Pick a floor. Beauty, stories, the library, or the room we keep by invitation.
            <br />
            There is no wrong first stop.
          </>
        }
      >
        <a href="#hall-doors" className="hairline text-cream">
          Choose your floor ↓
        </a>
      </RoomHero>
      {/* THE GRAND HALL — brief §4. Third pass, 12 Sept: the house’s own doors at
          standing height, each with its room through the opening; press one and
          you walk through. Was a wall of engraved plaques for an hour — Shelby:
          "not the immersive feeling of being located in each room". The hall was
          a dead end before that: one hairline
          and a very long scroll before anything else was a door. Six doors,
          read from lib/house.ts so the map and the hall can never disagree
          about what the house contains. */}
      <GrandHall />
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
          {/* Not BRAND.campaign: that line is Room 06's own headline further
              down this page, and one page says a thing once (17 Sept 2026,
              audit F-10). This is the Found Her note from the NOTES bank. */}
          <p
            id="found-her-band"
            className="max-w-[22ch] font-serif text-[clamp(1.6rem,3.4vw,2.75rem)] leading-tight text-balance"
          >
            There’s always more to the woman than the photograph.
          </p>
          <p className="max-w-[34ch] text-charcoal/75">
            FOUND HER is where she tells the rest herself.
          </p>
          <Link href="/found-her" className="hairline mt-2 text-charcoal">
            Read their stories
          </Link>
        </div>
      </section>

      {/* ══ 03 · THE SERUM SALON ════════════════════════════════════════════
          The products taking money get a room of their own, and it comes
          before the collection because that is its number in the house —
          Room 03 in lib/rooms.ts — and because these are the three that ship
          today (17 Sept 2026, audit F-09: one numbering, the house's). */}
      <RoomHero
        as="h2"
        src="/editorial/rooms/serum-salon-arches.webp"
        mobileSrc="/editorial/rooms/serum-salon-arches-m.webp"
        alt="The serum salon: three lit marble niches in teal, gold and red, one bottle in each, over a black marble counter, pink desert sky through the arches either side."
        position="center center"
        height="min-h-[64svh]"
        label="Room 03 · The Serum Salon"
        title="Three serums. Three kinds of day."
        lede="Some days you give nothing away. Some days you glow. Some days you start again."
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
              <p className="room-label">Ships now · The LALALOCA Collection</p>
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

      {/* ══ 04 · THE COLLECTION ═════════════════════════════════════════════
          Five on the vanity, all in stock from launch (30 Sept 2026); the
          state line under each name follows the record. */}
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
        alt="The FOUNDER Collection boardroom at night: a long polished marble table running to a panelled dark green wall between two brass sconces, green velvet chairs down both sides, white flowers on a lit shelf at the left and city lights through the window at the right."
        position="center center"
        height="min-h-[68svh]"
        label="Room 04 · The FOUNDER Collection"
        title="Five pieces before whatever comes next."
        lede="Cleanse, wash, moisturise, eyes, finish. A complete routine designed to get you ready and get out of the way."
      >
        <Link href="/founder-collection" className="btn btn-primary">
          Explore the collection
        </Link>
      </RoomHero>
      {/* THE VANITY — launch edit. The five products now read as a luxury
          campaign sequence rather than a literal shelf simulation: one large
          editorial frame, one active piece, one controlled detail panel. */}
      <Vanity
        items={LINE}
        title="The twenty minutes before you walk in."
        lede="Five pieces. One sequence. Choose the piece that gets you ready for what comes next."
      />

      {/* ══ 06 · FOUND HER ══════════════════════════════════════════════════ */}
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
            <p className="room-label">Room 06 · Found Her</p>
            <p className="mt-5 font-serif text-[1.35rem] leading-snug text-blush">
              The titles are the least interesting part.
            </p>
            <h2 className="mt-4 max-w-[12ch] font-serif text-[clamp(2.25rem,5vw,4rem)] font-light leading-[0.98] text-cream">
              She was there all along.
            </h2>
            <p className="mt-6 max-w-[40ch] text-[0.95rem] leading-relaxed text-cream/80">
              Shelby. Julie. Aly. Three very different stories about what it took, what changed,
              and the woman each one found on the other side.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link href="/found-her" className="btn btn-primary">
                Read the stories
              </Link>
              <Link href="/found-her#share" className="hairline text-cream">
                Tell yours
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ THE PLEDGE ══════════════════════════════════════════════════════
          Absent from the review build and from the creative deck. It is the
          house's largest truth claim and the wording never changes. */}
      {/* 1 Oct 2026 (team audit): Desert Rose type on the night ground, so the
          page has one rose room (Found Her), not two, and the pledge keeps its
          own room before the green invitation. */}
      <section className="section-tight bg-night-deep py-14 text-cream md:py-16">
        <div className="shell flex flex-col items-center gap-4 text-center">
          <p className="room-label">
            LALALOCA × StandUp for Kids
          </p>
          <p className="max-w-[26ch] font-serif text-[clamp(1.35rem,2.6vw,2rem)] leading-snug text-rose">
            20% of LALALOCA net profits. Every month. Directly to StandUp for Kids Tucson.
          </p>
          <Link href="/young-founders-room" className="hairline mt-2 text-cream">
            How the giving works
          </Link>
        </div>
      </section>

      {/* ══ THE INVITATION ══════════════════════════════════════════════════ */}
      <section id="room-invitation" className="section-tight bg-founder-green py-16 md:py-20">
        <div className="shell">
          <Reveal className="max-w-xl">
            <p className="room-label">The invitation</p>
            <h2 className="headline-house mt-5 text-balance text-cream">
              Leave your name at the door.
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
