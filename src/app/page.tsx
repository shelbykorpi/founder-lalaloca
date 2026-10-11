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
import { VARIANT_ID } from "@/lib/shopifyLinks";
import { approvedProfiles } from "@/lib/profiles";
import { AddToBagButton } from "@/components/bag/AddToBagButton";

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
    "Luxury skincare for women building businesses, careers, families, new beginnings and themselves. Shop the FOUNDER Collection and the LALALOCA serums, and read FOUND HER.",
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
        <div className="shell relative flex min-h-[calc(100svh-4rem)] flex-col justify-end pb-10 pt-16 md:justify-center md:py-24">
          <div className="max-w-[44rem]">
            <p className="room-label">{BRAND.display} · Welcome inside</p>
            <h1 className="mt-4 max-w-[14ch] font-serif text-[clamp(2.3rem,7vw,5rem)] font-light leading-[0.95] tracking-[-0.03em] text-cream md:mt-6">
              BEAUTY FOR WHAT YOU’RE BUILDING.
            </h1>
            <p className="mt-5 max-w-[35rem] text-[1rem] leading-[1.65] text-cream/85 md:mt-7 md:text-[1.05rem]">
              Luxury skincare for women building businesses, careers, families, new
              beginnings—and themselves.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 md:mt-8">
              <Link href="#shop" className="btn btn-primary w-full sm:w-auto">
                Shop the skincare
              </Link>
              <Link href="/found-her" className="btn btn-ghost-light w-full sm:w-auto">
                Discover FOUND HER
              </Link>
            </div>
            <p className="mt-6 max-w-[35rem] text-[0.95rem] leading-[1.7] text-cream/75">
              FOUNDER is more than the products on your vanity. It’s a place for women whose
              stories deserve to be seen.
            </p>
            <p className="mt-4 font-serif text-[1.2rem] italic text-blush">
              Welcome to FOUNDER. The room is yours.
            </p>
          </div>
        </div>
      </section>

      {/* ══ SHOP · YOUR NEXT CHAPTER ═════════════════════════════════════════
          10 Oct 2026, homepage clarity: every product, directly under the hero,
          with price and a buy action. Every figure is read from the catalogue
          (nextMove.ts, founderCollection.ts, products.ts) — never retyped. */}
      <section id="shop" aria-labelledby="shop-heading" className="section scroll-mt-28 bg-night py-16 md:py-20">
        <div className="shell">
          <p className="room-label">Shop the skincare</p>
          <h2 id="shop-heading" className="headline-house mt-4 max-w-[18ch] text-balance text-cream">
            YOUR NEXT CHAPTER STARTS HERE.
          </h2>
          <p className="mt-5 max-w-[42rem] leading-relaxed text-cream/80">
            Skincare for the moments before everything else. The meeting. The date. The first
            day. The next beginning. Or simply a moment that belongs to you.
          </p>
          <p className="mt-4 text-[0.72rem] uppercase tracking-[0.18em] text-champagne">
            FOUNDER is the name on your order. LALALOCA is the name of the collection.
          </p>

          <div className="mt-12 flex flex-wrap items-baseline justify-between gap-3 border-b border-bronze/20 pb-3">
            <h3 className="font-serif text-2xl text-cream">The FOUNDER Collection</h3>
            <Link href="/founder-collection" className="hairline text-cream">
              The complete routine
            </Link>
          </div>
          <ul className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-5">
            {SHOP_FOUNDER.map((item) => (
              <ProductCard key={item.slug} item={item} />
            ))}
          </ul>

          <div className="mt-16 flex flex-wrap items-baseline justify-between gap-3 border-b border-bronze/20 pb-3">
            <h3 className="font-serif text-2xl text-cream">LALALOCA · Three signature serums</h3>
            <Link href="/shop#set-heading" className="hairline text-cream">
              All three for {formatPrice(SET.price)} — save{" "}
              {formatPrice(products.reduce((sum, p) => sum + p.price, 0) - SET.price)}
            </Link>
          </div>
          <ul className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-3">
            {SHOP_LALALOCA.map((item) => (
              <ProductCard key={item.slug} item={item} />
            ))}
          </ul>
        </div>
      </section>

      {/* ══ FOUND HER ═══════════════════════════════════════════════════════
          The brief's copy for this section ended after "The things she
          built." — nothing beyond it is invented here. */}
      <section id="found-her" aria-labelledby="found-her-heading" className="section bg-rose py-16 text-charcoal md:py-20">
        <div className="shell">
          <p className="room-label" style={{ color: "#5a2f2c" }}>FOUND HER</p>
          <h2 id="found-her-heading" className="mt-4 max-w-[20ch] font-serif text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[1] text-balance">
            THE WOMEN BEHIND THE BEAUTY.
          </h2>
          <p className="mt-5 max-w-[40rem] leading-relaxed text-charcoal/85">
            Behind every woman is a story you haven’t heard. The risks she took. The doors that
            closed. The things she built.
          </p>
          <p className="mt-3 max-w-[40rem] text-charcoal/75">Told in her own words.</p>
          <ul className="mt-10 grid gap-8 sm:grid-cols-3">
            {approvedProfiles.slice(0, 3).map((profile) => (
              <li key={profile.slug}>
                <Link href={`/found-her/${profile.slug}`} className="group block no-underline">
                  {profile.portrait && (
                    <span className="relative block aspect-[4/5] overflow-hidden bg-night">
                      <Image
                        src={profile.portrait.src}
                        alt={profile.portrait.alt}
                        fill
                        loading="lazy"
                        sizes="(min-width: 640px) 30vw, 100vw"
                        className={profile.portrait.fit === "contain" ? "object-contain" : "object-cover"}
                        style={{ objectPosition: profile.portrait.position }}
                      />
                    </span>
                  )}
                  <span className="mt-4 block font-serif text-2xl text-charcoal">{profile.name}</span>
                  <span className="mt-1 block text-sm text-charcoal/75">{profile.role}</span>
                  <span className="mt-3 inline-flex min-h-11 items-center text-[0.6875rem] uppercase tracking-[0.18em] text-charcoal underline-offset-4 group-hover:underline">
                    Read her story<span className="sr-only">: {profile.name}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link href="/found-her" className="btn btn-dark">
              Discover FOUND HER
            </Link>
            <Link href="/found-her#share" className="hairline text-charcoal">
              Share your story
            </Link>
          </div>
        </div>
      </section>

      {/* ══ TWO COLLECTIONS, ONE HOUSE ══════════════════════════════════════ */}
      <section aria-labelledby="collections-heading" className="section-tight bg-night-deep py-14 text-cream md:py-16">
        <div className="shell">
          <h2 id="collections-heading" className="room-label">Two collections</h2>
          <div className="mt-6 grid gap-px overflow-hidden border border-bronze/15 bg-bronze/15 md:grid-cols-2">
            <Link href="/founder-collection" className="group bg-night-deep px-6 py-7 no-underline transition-colors hover:bg-founder-green/35">
              <span className="block font-serif text-[1.6rem] text-cream">The FOUNDER Collection</span>
              <span className="mt-2 block text-cream/75">
                The complete routine. Five pieces: cleanse, wash, moisturise, eyes, finish.
              </span>
              <span className="mt-3 block text-sm text-champagne">Shop the routine →</span>
            </Link>
            <Link href="/shop" className="group bg-night-deep px-6 py-7 no-underline transition-colors hover:bg-founder-green/35">
              <span className="block font-serif text-[1.6rem] text-cream">LALALOCA</span>
              <span className="mt-2 block text-cream/75">
                Three signature serums. Three kinds of day.
              </span>
              <span className="mt-3 block text-sm text-champagne">Shop the serums →</span>
            </Link>
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
          Visit the Serum Salon
        </Link>
        <Link href="/find-your-serum" className="hairline text-cream">
          Which one is yours?
        </Link>
      </RoomHero>
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

/* ── The shop grid ─────────────────────────────────────────────────────── */

type ShopItem = {
  slug: string;
  name: string;
  type: string;
  does: string;
  price: number;
  size: string;
  image: string;
  alt: string;
  href: string;
  note?: string;
  /** Shopify variant to add; absent = choose on the product page (shades). */
  bag?: { slug: string; bottle: string };
  label: string;
};

const SHOP_FOUNDER: ShopItem[] = LINE.map((l) => {
  const nm = bySlug[l.href.replace("/products/", "")];
  const isHold = l.href === "/products/hold-the-room";
  const variant = isHold ? VARIANT_ID["hold-the-room"] : nm?.variantId;
  const price = isHold ? holdTheRoom.price : nm.price;
  const size = isHold ? holdTheRoom.size : nm.size;
  return {
    slug: l.href,
    name: l.name,
    type: isHold ? holdTheRoom.category : nm.category,
    does: isHold ? holdTheRoom.what : nm.what,
    price,
    size,
    image: l.image,
    alt: l.alt,
    href: l.href,
    note: l.state,
    bag: variant ? { slug: variant, bottle: l.image } : undefined,
    label: !isHold && nm.availability === "preorder" ? "Preorder" : "Add to bag",
  };
});

const SHOP_LALALOCA: ShopItem[] = products.map((p) => ({
  slug: p.slug,
  name: p.name,
  type: p.category,
  does: p.hero,
  price: p.price,
  size: p.size,
  image: p.bottle,
  alt: `The ${p.name} bottle.`,
  href: `/products/${p.slug}`,
  bag: { slug: p.slug, bottle: p.bottle },
  label: "Add to bag",
}));

function ProductCard({ item }: { item: ShopItem }) {
  return (
    <li className="flex flex-col">
      <Link href={item.href} className="group block">
        <span className="relative mx-auto block aspect-[4/5] w-full max-w-[14rem]">
          <Image
            src={item.image}
            alt={item.alt}
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 18vw, (min-width: 640px) 40vw, 80vw"
            className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </span>
        <span className="mt-5 block font-serif text-2xl leading-none text-cream">{item.name}</span>
        <span className="mt-2 block text-[0.66rem] uppercase tracking-[0.16em] text-champagne">
          {item.type}
        </span>
      </Link>
      <p className="mt-3 text-sm leading-relaxed text-cream/75">{item.does}</p>
      <p className="mt-3 text-sm text-cream">
        {formatPrice(item.price)} · {item.size.split(" /")[0]}
      </p>
      {item.note && <p className="mt-1 text-xs text-cream/60">{item.note}</p>}
      <div className="mt-auto pt-4">
        {item.bag ? (
          <AddToBagButton
            product={{
              slug: item.bag.slug,
              name: item.name,
              category: item.type,
              price: item.price,
              size: item.size,
              bottle: item.bag.bottle,
            }}
            href={item.href}
            label={item.label}
            className="btn btn-primary w-full"
          />
        ) : (
          <Link href={item.href} className="btn btn-primary w-full">
            Choose your shade<span className="sr-only"> — {item.name}</span>
          </Link>
        )}
      </div>
    </li>
  );
}
