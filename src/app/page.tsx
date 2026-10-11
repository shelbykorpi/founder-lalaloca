import type { Metadata } from "next";
import { withShare } from "@/lib/shareMeta";
import Image from "next/image";
import Link from "next/link";
import { EmailSignup } from "@/components/site/EmailSignup";
import { Reveal } from "@/components/house/Reveal";
import { HomeCta } from "@/components/home/HomeCta";
import { NowPlaying } from "@/components/home/NowPlaying";
import { SkincareGrid } from "@/components/shop/SkincareGrid";
import { AddSetButton } from "@/components/bag/AddToBagButton";
import { BRAND, CONTACT_MAILTO } from "@/lib/brand";
import { CONCIERGE_ENABLED } from "@/lib/concierge/enabled";
import { ConciergeLauncher } from "@/components/concierge/ConciergeLauncher";
import { FOUNDER_LINE, LALALOCA_LINE, allVariantIds } from "@/lib/skincare";
import { fetchVariantAvailability } from "@/lib/catalog";
import { VARIANT_ID } from "@/lib/shopifyLinks";
import { formatPrice, SET } from "@/lib/products";
import { approvedProfiles } from "@/lib/profiles";

/**
 * THE HOMEPAGE — 11 October 2026, the clarity brief.
 *
 * Shelby: "people are confused what my site is." The audit found the same:
 * a full-screen door, "Open the door. The room is yours.", and no product,
 * price, menu or the word "skincare" until the second screen; the first
 * price five phone screens down; about fifteen names before one product.
 *
 * So the page now says what FOUNDER is first and lets the house follow, in
 * the order the brief sets:
 *   1 The hero: "Beauty for what you're building." with real products,
 *     Shop the skincare first, Discover FOUND HER second.
 *   2 The skincare: all eight products with a real buy button on each.
 *   3 FOUND HER: the women behind the beauty, with their approved portraits.
 *   4 Our models have stories: how the community becomes the brand's faces,
 *     with the terms said plainly.
 *   5 Two collections, one house.
 *   6 The house, explained room by room (the full walk-through, doors and
 *     elevator included, lives on at /house).
 *   7 The invitation: tell your story, join the Founding List, and the
 *     protected close, "The room is yours."
 *
 * Everything shoppable reads the live catalogue records (lib/skincare.ts)
 * and asks Shopify which variants can be sold, so a sold-out card says so.
 */

export const metadata: Metadata = withShare({
  description: `${BRAND.oneLine} Shop the five-piece FOUNDER Collection and the LALALOCA serums, with free US shipping, and meet the women of FOUND HER.`,
  alternates: { canonical: "/" },
}, "/");

const HOUSE_ROOMS = [
  {
    name: "The Boardroom",
    purpose: "Shop the FOUNDER Collection",
    href: "/founder-collection",
    image: "/editorial/rooms/collection-boardroom-open-m.webp",
  },
  {
    name: "The Serum Salon",
    purpose: "Explore the LALALOCA serums",
    href: "/shop",
    image: "/editorial/rooms/serum-salon-alcoves-m.webp",
  },
  {
    name: "FOUND HER",
    purpose: "Meet the women and read their stories",
    href: "/found-her",
    image: "/editorial/rooms/found-her-hall-pink-m.webp",
  },
  {
    name: "The Library",
    purpose: "Ingredients and skincare education",
    href: "/library",
    image: "/editorial/rooms/library-shelves-m.webp",
  },
  {
    name: "Young Founders’ Room",
    purpose: "The next generation, and our giving",
    href: "/young-founders-room",
    image: "/editorial/rooms/young-founders-fireplace-m.webp",
  },
  {
    name: "The Salon",
    purpose: "The invitation-only experience",
    href: "/salon",
    image: "/editorial/salon/salon-lounge.webp",
  },
] as const;

export default async function HomePage() {
  const availability = await fetchVariantAvailability([
    ...allVariantIds([...FOUNDER_LINE, ...LALALOCA_LINE]),
    VARIANT_ID["all-three"],
  ]);
  const setSoldOut = availability?.[VARIANT_ID["all-three"]] === false;
  const women = approvedProfiles.filter((p) => p.portrait).slice(0, 3);

  return (
    <div className="bg-emerald-deep text-cream">
      {/* ══ 1 · THE HERO ═══════════════════════════════════════════════════
          Real FOUNDER products (Double Take, Smooth Talker, Clean Break) on
          marble in the house's green room, so the first frame shows what is
          sold as well as the world around it. One image for every width (a
          phone sees it as a band above the words, a desktop full-bleed), so
          only one hero downloads. On a phone the headline, the explanation
          and Shop the skincare all sit in the first screen. */}
      <section className="relative isolate overflow-hidden lg:min-h-[calc(100svh-5rem)]">
        <div className="relative h-[30svh] min-h-[13rem] md:h-[42svh] lg:absolute lg:inset-0 lg:h-auto">
          <Image
            src="/editorial/next-move-hero.webp"
            alt="FOUNDER skincare on a marble ledge in a dark green room: the Double Take eye cream carton and bottle, the Smooth Talker tone stick and the Clean Break face wash, a pink doorway behind."
            fill
            priority
            sizes="100vw"
            className="object-cover object-[80%_55%] md:object-[70%_55%] lg:object-[60%_50%]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,37,35,0)_40%,rgba(10,37,35,1)_100%)] lg:bg-[linear-gradient(90deg,rgba(10,37,35,0.97)_0%,rgba(10,37,35,0.9)_34%,rgba(10,37,35,0.45)_52%,rgba(10,37,35,0)_66%)]"
          />
        </div>
        <div className="shell relative flex flex-col pb-12 pt-5 md:pt-8 lg:min-h-[calc(100svh-5rem)] lg:justify-center lg:py-20">
          <div className="max-w-[38rem]">
            <p className="room-label">FOUNDER · Luxury skincare</p>
            <h1 className="mt-4 max-w-[13ch] font-serif text-[clamp(2.35rem,6.4vw,4.9rem)] font-light leading-[0.95] tracking-[-0.025em] text-cream md:mt-6">
              Beauty for what you’re building.
            </h1>
            <p className="mt-4 max-w-[32rem] text-[1rem] leading-[1.6] text-cream/85 md:mt-6 md:text-[1.08rem] md:leading-[1.7]">
              Luxury skincare for women building businesses, careers, families, new
              beginnings—and themselves.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center md:mt-8">
              <HomeCta href="#skincare" cta="shop_skincare" className="btn btn-primary w-full sm:w-auto">
                Shop the skincare
              </HomeCta>
              <HomeCta href="/found-her" cta="discover_found_her" className="btn btn-ghost-light w-full sm:w-auto">
                Discover FOUND HER
              </HomeCta>
            </div>
            <p className="mt-6 max-w-[32rem] text-[0.95rem] leading-[1.65] text-cream/70 md:mt-8">
              FOUNDER is more than the products on your vanity. It’s a place for women whose
              stories deserve to be seen.
            </p>
            <p className="mt-3 font-serif text-[1.15rem] italic text-blush">
              Welcome to FOUNDER. The room is yours.
            </p>
          </div>
        </div>
      </section>

      {/* ══ 2 · THE SKINCARE ═══════════════════════════════════════════════ */}
      <section id="skincare" className="scroll-mt-24 border-t border-bronze/15 bg-night py-16 md:py-24" aria-labelledby="skincare-heading">
        <div className="shell">
          <div className="max-w-[44rem]">
            <p className="room-label">Shop FOUNDER</p>
            <h2 id="skincare-heading" className="mt-4 font-serif text-[clamp(2.1rem,4.6vw,3.6rem)] font-light leading-[1] text-cream">
              Your next chapter starts here.
            </h2>
            <p className="mt-5 text-[1rem] leading-[1.75] text-cream/78">
              Skincare for the moments before everything else. The meeting. The date. The first
              day. The next beginning. Or simply a moment that belongs to you.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap items-end justify-between gap-3 border-b border-bronze/20 pb-4">
            <h3 className="font-serif text-[1.6rem] text-cream">
              The FOUNDER Collection
              <span className="ml-3 align-middle text-[0.65rem] uppercase tracking-[0.2em] text-champagne/80">
                Five pieces · one routine
              </span>
            </h3>
            <Link href="/founder-collection" className="hairline text-cream">
              Explore the collection
            </Link>
          </div>
          <SkincareGrid
            items={FOUNDER_LINE}
            availability={availability}
            listId="home_founder_collection"
            listName="Homepage · FOUNDER Collection"
            className="mt-6 lg:grid-cols-5"
          />

          <div className="mt-14 flex flex-wrap items-end justify-between gap-3 border-b border-bronze/20 pb-4">
            <h3 className="font-serif text-[1.6rem] text-cream">
              The LALALOCA Serums
              <span className="ml-3 align-middle text-[0.65rem] uppercase tracking-[0.2em] text-champagne/80">
                By FOUNDER · three serums
              </span>
            </h3>
            <Link href="/shop" className="hairline text-cream">
              Discover LALALOCA
            </Link>
          </div>
          <div className="mt-6 grid gap-3 sm:gap-4 lg:grid-cols-[3fr_1fr]">
            <SkincareGrid
              items={LALALOCA_LINE}
              availability={availability}
              listId="home_lalaloca"
              listName="Homepage · LALALOCA serums"
              className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-3"
            />
            <div className="flex flex-col justify-between border border-bronze/30 bg-[linear-gradient(160deg,rgba(214,190,154,0.12),rgba(9,23,18,0.6))] p-5">
              <div>
                <p className="text-[0.625rem] uppercase tracking-[0.2em] text-champagne/80">The set</p>
                <p className="mt-2 font-serif text-[1.6rem] leading-none text-cream">The House Trio</p>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-cream/75">
                  All three LALALOCA serums, full size, for every kind of day.
                </p>
              </div>
              <div className="mt-6">
                <p className="font-serif text-[1.25rem] text-cream">
                  {formatPrice(SET.price)}
                  <span className="ml-2 text-[0.75rem] text-cream/60">
                    instead of {formatPrice(LALALOCA_LINE.reduce((n, i) => n + i.price, 0))}
                  </span>
                </p>
                <AddSetButton className="btn btn-primary mt-4 w-full" soldOut={setSoldOut} />
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-bronze/15 pt-8 md:flex-row md:items-center">
            <ul className="flex flex-wrap gap-x-8 gap-y-2 text-[0.8125rem] text-cream/70">
              <li>Free US shipping on every order</li>
              <li>Returns within 14 days on unopened pieces</li>
              <li>Secure checkout by Shopify</li>
            </ul>
            <Link href="/skincare" className="btn btn-ghost-light">
              Shop all skincare
            </Link>
          </div>
        </div>
      </section>

      {/* ══ 3 · FOUND HER ══════════════════════════════════════════════════
          The approved FOUND HER women, with their own portraits. Where a
          portrait is a composition rather than her photograph, its note is
          shown with it, as profiles.ts requires wherever it stands in. */}
      <section className="bg-night-deep py-16 md:py-24" aria-labelledby="women-heading">
        <div className="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <Reveal>
            <p className="room-label">FOUND HER</p>
            <h2 id="women-heading" className="mt-4 max-w-[12ch] font-serif text-[clamp(2.1rem,4.6vw,3.6rem)] font-light leading-[1] text-cream">
              The women behind the beauty.
            </h2>
            <div className="mt-6 max-w-[34rem] space-y-4 text-[1rem] leading-[1.75] text-cream/78">
              <p className="font-serif text-[1.35rem] italic leading-snug text-blush">
                Behind every woman is a story you haven’t heard.
              </p>
              <p>
                The risks she took. The doors that closed. The things she built. The moments she
                almost gave up—and the moments she kept going.
              </p>
              <p>FOUND HER is where those stories are told.</p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <HomeCta href="/found-her" cta="meet_the_women" className="btn btn-primary w-full sm:w-auto">
                Meet the women
              </HomeCta>
              <HomeCta href="/found-her#share" cta="share_your_story" className="btn btn-ghost-light w-full sm:w-auto">
                Share your story
              </HomeCta>
            </div>
          </Reveal>

          <ul className="grid grid-cols-3 gap-3 sm:gap-4">
            {women.map((w) => (
              <li key={w.slug}>
                <Link href={`/found-her/${w.slug}`} className="group block">
                  <span className="relative block aspect-[3/4] overflow-hidden border border-bronze/25 bg-night">
                    <Image
                      src={w.portrait!.src}
                      alt={w.portrait!.alt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 1024px) 30vw, 16vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      style={{ objectPosition: w.portrait!.position ?? "center 30%" }}
                    />
                  </span>
                  <span className="mt-3 block font-serif text-[1.15rem] leading-tight text-cream group-hover:text-champagne md:text-[1.3rem]">
                    {w.name}
                  </span>
                  <span className="mt-1 block text-[0.75rem] leading-snug text-cream/60">{w.role}</span>
                </Link>
                {w.portrait!.note ? (
                  <p className="mt-2 text-[0.6875rem] leading-relaxed text-cream/65">{w.portrait!.note}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ 4 · OUR MODELS HAVE STORIES ════════════════════════════════════
          Shelby's copy (11 Oct 2026 brief). Inspiring, and transparent: the
          terms under it repeat what the story form and her confirmation email
          already promise, so the three never disagree. */}
      <section className="bg-rose py-16 text-charcoal md:py-24" aria-labelledby="models-heading">
        <div className="shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
          <Reveal>
            <p className="room-label !text-night">The faces of FOUNDER</p>
            <h2 id="models-heading" className="mt-4 max-w-[11ch] font-serif text-[clamp(2.1rem,4.6vw,3.6rem)] font-light leading-[1] text-night">
              Our models have stories.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="max-w-[38rem] space-y-4 text-[1.02rem] leading-[1.75] text-charcoal">
              <p className="font-serif text-[1.35rem] leading-snug text-night">
                The women of FOUND HER aren’t chosen because their lives look perfect.
              </p>
              <p>They’re women creating, building, rebuilding, and becoming.</p>
              <p>
                As FOUNDER grows, women from this community can be selected to represent the
                brand—through editorial features, product photography, and future product
                collections.
              </p>
              <p className="font-serif text-[1.35rem] italic leading-snug text-night">
                The next face of FOUNDER could be yours.
              </p>
            </div>
            <HomeCta
              href="/found-her#share"
              cta="become_part_of_found_her"
              className="btn mt-8 w-full bg-founder-green text-cream hover:bg-rose-deep hover:text-night sm:w-auto"
            >
              Become part of FOUND HER
            </HomeCta>
            <p className="mt-5 max-w-[36rem] text-[0.8125rem] leading-relaxed text-charcoal">
              Sharing your story is free and never requires a purchase. Being published, featured,
              photographed or placed on a product is selective and never guaranteed, and each is
              agreed with you separately, in writing, before anything is used.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══ 5 · TWO COLLECTIONS. ONE HOUSE. ════════════════════════════════ */}
      <section className="bg-night py-16 md:py-24" aria-labelledby="collections-heading">
        <div className="shell">
          <p className="room-label">The collections</p>
          <h2 id="collections-heading" className="mt-4 font-serif text-[clamp(2.1rem,4.6vw,3.6rem)] font-light leading-[1] text-cream">
            Two collections. One house.
          </h2>
          <p className="mt-4 max-w-[40rem] text-[1rem] leading-[1.7] text-cream/75">
            Both are FOUNDER: the same house, the same standards, two ways into your routine.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {[
              {
                label: "The FOUNDER Collection",
                line: "Five pieces. One routine.",
                body: "Skincare for the preparation before whatever comes next.",
                cta: "Explore the collection",
                href: "/founder-collection",
                image: "/editorial/collection-vanity.webp",
                alt: "A vanity in the FOUNDER house: a mirror lettered FOUNDER, ringed with bulbs, on a Desert Pink wall.",
                position: "60% 50%",
              },
              {
                label: "The LALALOCA Collection",
                line: "Three serums. Three kinds of day.",
                body: "The original serums that opened the door.",
                cta: "Discover LALALOCA",
                href: "/shop",
                image: "/editorial/trio-parlor.webp",
                alt: "The three LALALOCA serums, Thirst Trap, Bounce Back and C Me Glow, on a marble counter in the FOUNDER parlour.",
                position: "25% 50%",
              },
            ].map((c) => (
              <Link key={c.href} href={c.href} className="group relative isolate flex min-h-[26rem] flex-col justify-end overflow-hidden border border-bronze/20">
                <Image
                  src={c.image}
                  alt={c.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 92vw, 46vw"
                  className="-z-10 object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
                  style={{ objectPosition: c.position }}
                />
                <span aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(9,23,18,0.05)_20%,rgba(9,23,18,0.85)_70%,rgba(9,23,18,0.97)_100%)]" />
                <div className="p-6 md:p-8">
                  <p className="text-[0.625rem] uppercase tracking-[0.22em] text-champagne">A FOUNDER collection</p>
                  <h3 className="mt-3 font-serif text-[clamp(1.8rem,3vw,2.4rem)] font-light leading-none text-cream">{c.label}</h3>
                  <p className="mt-3 font-serif text-[1.2rem] italic text-blush">{c.line}</p>
                  <p className="mt-2 text-[0.95rem] text-cream/78">{c.body}</p>
                  <span className="btn btn-primary mt-6">{c.cta}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 6 · WELCOME INSIDE THE HOUSE ═══════════════════════════════════
          The architecture, after the business. Each room says what it is
          for. The full walk-through (doors, elevator, Grand Hall) is at
          /house; nothing on this page needs it to shop. */}
      <section className="border-t border-bronze/15 bg-night-deep py-16 md:py-24" aria-labelledby="house-heading">
        <div className="shell">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="room-label">The House</p>
              <h2 id="house-heading" className="mt-4 font-serif text-[clamp(2.1rem,4.6vw,3.6rem)] font-light leading-[1] text-cream">
                Welcome inside the house.
              </h2>
              <p className="mt-5 max-w-[40rem] text-[1rem] leading-[1.75] text-cream/78">
                There’s more to FOUNDER than what you put on your skin. Explore the collections,
                meet the women, discover the ingredients, and step into the rooms where our
                stories continue.
              </p>
            </div>
            <HomeCta href="/house" cta="enter_the_house" className="btn btn-ghost-light w-full sm:w-auto">
              Enter the house
            </HomeCta>
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {HOUSE_ROOMS.map((room) => (
              <li key={room.href + room.name}>
                <Link href={room.href} className="group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden border border-bronze/20 sm:aspect-[16/11]">
                  <Image
                    src={room.image}
                    alt=""
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 46vw, 30vw"
                    className="-z-10 object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
                  />
                  <span aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(9,23,18,0)_30%,rgba(9,23,18,0.9)_100%)]" />
                  <span className="p-4 md:p-5">
                    <span className="block font-serif text-[1.3rem] leading-tight text-cream md:text-[1.6rem]">{room.name}</span>
                    <span className="mt-1 block text-[0.75rem] leading-snug text-cream/75 md:text-[0.8125rem]">{room.purpose} →</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <NowPlaying />

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-bronze/10 pt-6">
            <p className="text-sm text-cream/60">
              Need a recommendation or an answer about an order?
            </p>
            {CONCIERGE_ENABLED ? (
              <ConciergeLauncher source="home-house" className="btn btn-ghost-light">
                Ask the concierge
              </ConciergeLauncher>
            ) : (
              <a href={CONTACT_MAILTO} className="btn btn-ghost-light">
                Email us
              </a>
            )}
          </div>
        </div>
      </section>

      {/* THE PLEDGE. The house's largest truth claim; the wording never changes. */}
      <section className="bg-night py-12 text-cream md:py-14">
        <div className="shell flex flex-col items-center gap-4 text-center">
          <p className="room-label">LALALOCA × StandUp for Kids</p>
          <p className="max-w-[26ch] font-serif text-[clamp(1.35rem,2.6vw,2rem)] leading-snug text-rose">
            20% of LALALOCA net profits. Every month. Directly to StandUp for Kids Tucson.
          </p>
          <Link href="/young-founders-room" className="hairline mt-2 text-cream">
            How the giving works
          </Link>
        </div>
      </section>

      {/* ══ 7 · THE INVITATION ═════════════════════════════════════════════ */}
      <section id="invitation" className="bg-founder-green py-16 md:py-24" aria-labelledby="invitation-heading">
        <div className="shell grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal>
            <p className="room-label">The invitation</p>
            <h2 id="invitation-heading" className="mt-4 max-w-[12ch] font-serif text-[clamp(2.1rem,4.6vw,3.6rem)] font-light leading-[1] text-cream">
              There’s room for you here.
            </h2>
            <p className="mt-6 space-y-1 font-serif text-[clamp(1.2rem,2vw,1.45rem)] leading-[1.5] text-cream/90">
              <span className="block">For the woman just beginning.</span>
              <span className="block">For the woman starting over.</span>
              <span className="block">For the woman who built something no one believed in.</span>
              <span className="block">For the woman still figuring out what comes next.</span>
            </p>
            <p className="mt-5 font-serif text-[1.5rem] italic text-blush">You belong here.</p>
            <HomeCta href="/found-her#share" cta="tell_your_story" className="btn btn-primary mt-8 w-full sm:w-auto">
              Tell your story
            </HomeCta>
          </Reveal>
          <Reveal delay={100} className="lg:pt-2">
            <EmailSignup tone="green" source="home" heading="Join the Founding List." />
          </Reveal>
        </div>
        <div className="shell mt-16 border-t border-cream/15 pt-12 text-center md:mt-20">
          <p className="font-serif text-[clamp(2rem,5vw,3.6rem)] font-light leading-[1] tracking-[0.02em] text-cream">
            FOUNDER. <span className="text-champagne">The room is yours.</span>
          </p>
        </div>
      </section>
    </div>
  );
}
