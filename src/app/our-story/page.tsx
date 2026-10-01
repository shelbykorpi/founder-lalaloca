import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HouseShell } from "@/components/house/HouseShell";
import { Reveal } from "@/components/house/Reveal";
import { AmbientLighting } from "@/components/house/AmbientLighting";
import { getRoom } from "@/lib/rooms";
import { profiles } from "@/lib/profiles";
import { JsonLd, aboutPageSchema, breadcrumbSchema } from "@/lib/seo";

const TITLE = "Our Story";
const DESCRIPTION =
  "The story behind FOUNDER: the businesses, setbacks, beauty, barns and women that shaped the brand.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/our-story" },
};


export default function OurStoryPage() {
  const room = getRoom(5);
  const founder = profiles[0];

  return (
    <>
      <JsonLd
        schema={[
          aboutPageSchema(DESCRIPTION),
          breadcrumbSchema([{ name: TITLE, path: "/our-story" }]),
        ]}
      />

      <HouseShell room={5}>
        {/* A restrained hero: the story should feel expensive on a phone,
            not like oversized campaign type fighting the photograph. */}
        <section className="relative isolate min-h-[70svh] overflow-hidden bg-night text-cream md:min-h-[76svh]">
          <Image
            src={room.hero.src}
            alt={room.hero.alt}
            fill
            priority
            sizes="100vw"
            className="hidden object-cover md:block"
            style={{ objectPosition: room.hero.position ?? "60% center" }}
          />
          <Image
            src={room.heroMobile.src}
            alt={room.hero.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover md:hidden"
            style={{ objectPosition: "center 42%" }}
          />
          <AmbientLighting />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,17,14,0.18)_0%,rgba(6,17,14,0.18)_34%,rgba(6,17,14,0.82)_76%,rgba(6,17,14,0.97)_100%)] md:bg-[linear-gradient(90deg,rgba(6,17,14,0.94)_0%,rgba(6,17,14,0.82)_34%,rgba(6,17,14,0.34)_58%,rgba(6,17,14,0.06)_78%)]"
          />
          <div className="shell relative flex min-h-[70svh] items-end pb-12 pt-24 md:min-h-[76svh] md:items-center md:py-20">
            <div className="max-w-[34rem]">
              <p className="room-label">Room 05 · Our Story</p>
              <span aria-hidden className="mt-4 block h-px w-10 bg-rose" />
              <h1 className="mt-5 max-w-[12ch] font-serif text-[clamp(2.15rem,7.5vw,4.2rem)] font-light leading-[0.98] tracking-[-0.025em] text-cream">
                I built FOUNDER because my life never fit into one box.
              </h1>
              <p className="mt-6 max-w-[32rem] text-[0.98rem] leading-[1.75] text-cream/78 md:text-[1.05rem]">
                I have built beauty brands, worked inside commercial poultry barns, filed patents,
                packed orders from my kitchen, and delivered Uber Eats when I needed to keep going.
                I got tired of acting like those versions of me had nothing to do with each other.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                <Link href="#why-founder" className="btn btn-primary">
                  Start at the beginning
                </Link>
                <Link href="/found-her" className="hairline text-cream">
                  Meet the women
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="why-founder" className="scroll-mt-24 bg-cream py-16 text-charcoal md:py-24">
          <div className="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-20">
            <Reveal>
              <p className="eyebrow text-bronze-ink">Where it came from</p>
              <h2 className="mt-5 max-w-[12ch] font-serif text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1.02] tracking-[-0.02em]">
                For a long time, my life looked like a bunch of unrelated chapters.
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <div className="max-w-[44rem]">
                <p className="font-serif text-[clamp(1.4rem,2.7vw,2.15rem)] leading-[1.32] text-charcoal">
                  Looking back, they were all teaching me the same thing.
                </p>
                <div className="mt-7 space-y-5 text-[1rem] leading-[1.85] text-charcoal/76">
                  <p>
                    I built my first business from my kitchen. Later, BitThermal took me into
                    commercial poultry barns. That work eventually grew into EcoYield.ai.
                  </p>
                  <p>
                    In between were the less polished parts: running out of money, driving across
                    the country for opportunities, packing boxes, and making deliveries so I could
                    keep paying my bills while I kept building.
                  </p>
                  <p>
                    At some point I stopped trying to separate the beauty founder, the inventor,
                    the woman in the barns, and the woman doing whatever work she had to do to keep
                    moving. They were all me. FOUNDER came from that realization.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="border-y border-bronze/15 bg-founder-green py-16 text-cream md:py-24">
          <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20">
            <Reveal>
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[28rem] overflow-hidden border border-bronze/20 bg-night-deep shadow-[0_28px_70px_rgba(0,0,0,0.28)] lg:mx-0">
                <Image
                  src="/editorial/our-story-journal.webp"
                  alt="An open journal and fountain pen in the FOUNDER study."
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 88vw, 34vw"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={100}>
              <p className="eyebrow text-champagne">Why the name FOUNDER</p>
              <h2 className="mt-5 max-w-[13ch] font-serif text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1.02] tracking-[-0.02em] text-cream">
                I do not think being a founder only means starting a company.
              </h2>
              <div className="mt-7 max-w-[42rem] space-y-5 text-[1rem] leading-[1.85] text-cream/76">
                <p>
                  Every woman has founded something: a business, a family, a new direction,
                  a life after loss, or a version of herself she had to fight to find again.
                </p>
                <p>
                  Sometimes that is a company. Sometimes it is {BUILDING.slice(0, -1).join(", ")},
                  or {BUILDING[BUILDING.length - 1]}.
                </p>
                <p>
                  FOUND HER came from the other side of that idea. There are moments when you
                  realize the woman you were trying to become has already been showing up for you
                  for years. You just finally recognize her.
                </p>
              </div>
              <p className="mt-8 max-w-[34rem] border-l border-rose/55 pl-5 font-serif text-[clamp(1.45rem,2.6vw,2rem)] italic leading-[1.35] text-rose">
                FOUNDER is what she built. FOUND HER is when she finally sees herself.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="bg-shell py-16 text-charcoal md:py-24">
          <div className="shell">
            <Reveal className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
              <div>
                <p className="eyebrow text-bronze-ink">My story</p>
                <h2 className="mt-5 max-w-[10ch] font-serif text-[clamp(2rem,5vw,3.4rem)] font-light leading-[1.02]">
                  Most of it happened while I was still figuring things out.
                </h2>
              </div>
              <div className="max-w-[44rem] text-[1rem] leading-[1.85] text-charcoal/76">
                <p>
                  My first real business was built from my kitchen and did just under one million
                  dollars in its first year. After that came BitThermal, years spent inside
                  commercial poultry barns, and eventually EcoYield.ai.
                </p>
                <p className="mt-5">
                  There were also the years that looked a lot less impressive from the outside.
                  I ran out of money. I drove across the country alone because I believed being in
                  the room mattered. I delivered Uber Eats while trying to keep my company alive.
                </p>
                <p className="mt-5">
                  I am proud of the things I built, but I am even more proud that I kept going
                  when quitting would have made sense to almost everyone around me. FOUNDER is
                  the brand I wish had existed through all of those chapters.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100} className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
              <div className="relative aspect-[4/5] overflow-hidden bg-night-deep">
                <Image
                  src={founder.portrait!.src}
                  alt={founder.portrait!.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 90vw, 38vw"
                  className="object-cover"
                  style={{ objectPosition: founder.portrait!.position ?? "center" }}
                />
              </div>
              <div>
                <p className="eyebrow text-bronze-ink">Shelby Korpi · Founder</p>
                <blockquote className="mt-5 max-w-[30ch] font-serif text-[clamp(1.55rem,3.2vw,2.6rem)] font-light leading-[1.25] text-charcoal">
                  “I didn’t suddenly become her. I finally recognized the woman who had
                  been fighting for me the entire time.”
                </blockquote>
                <p className="mt-6 max-w-[40rem] text-[0.96rem] leading-[1.8] text-charcoal/70">
                  I wrote the full version for FOUND HER, including the parts I normally would
                  have left out.
                </p>
                <Link href={`/found-her/${founder.slug}`} className="btn btn-dark mt-8">
                  Read Shelby’s story
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="relative isolate overflow-hidden bg-night-deep py-16 text-cream md:py-24">
          <Image
            src="/editorial/collection-still.webp"
            alt="The FOUNDER and LALALOCA collections arranged in the dark, cinematic FOUNDER house."
            fill
            loading="lazy"
            sizes="100vw"
            className="object-cover object-center opacity-35"
          />
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,17,14,0.98)_0%,rgba(6,17,14,0.9)_48%,rgba(6,17,14,0.48)_100%)]" />
          <div className="shell relative grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
            <Reveal>
              <p className="eyebrow text-champagne">Why beauty</p>
              <h2 className="mt-5 max-w-[12ch] font-serif text-[clamp(2rem,5vw,3.45rem)] font-light leading-[1.02] text-cream">
                Beauty was always part of my life, even when the rest of it was messy.
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <div className="max-w-[44rem]">
                <p className="font-serif text-[clamp(1.4rem,2.6vw,2.1rem)] leading-[1.32] text-cream">
                  LALALOCA came first with three serums.
                </p>
                <p className="mt-7 text-[1rem] leading-[1.85] text-cream/75">
                  Thirst Trap, C Me Glow and Bounce Back were the beginning. Later I built the
                  FOUNDER Collection around the rest of the routine: Opening Line, Clean Break,
                  Hold the Room, Double Take and Smooth Talker.
                </p>
                <p className="mt-5 text-[1rem] leading-[1.85] text-cream/75">
                  I do not think skincare changes your life. But I do believe the few minutes
                  you take for yourself before a long day matter. The products are made for those
                  minutes — before you go back out and do whatever is waiting for you.
                </p>
                <div className="mt-9 flex flex-wrap gap-4">
                  <Link href="/founder-collection" className="btn btn-primary">
                    The FOUNDER Collection
                  </Link>
                  <Link href="/shop" className="btn btn-ghost-light">
                    The LALALOCA Collection
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="bg-cream py-16 text-charcoal md:py-24">
          <div className="shell grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden bg-night-deep">
                <Image
                  src="/editorial/founder-portrait-wall.webp"
                  alt="A portrait wall inside the FOUNDER house."
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 90vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={100}>
              <p className="eyebrow text-bronze-ink">Why FOUND HER exists</p>
              <h2 className="mt-5 max-w-[12ch] font-serif text-[clamp(2rem,5vw,3.4rem)] font-light leading-[1.02]">
                I did not want FOUNDER to only show the polished version of women.
              </h2>
              <div className="mt-7 max-w-[40rem] space-y-5 text-[1rem] leading-[1.85] text-charcoal/74">
                <p>
                  I wanted a place for the part people usually do not see: what she was building,
                  what it cost her, what changed, and what she is proud of now.
                </p>
                <p>
                  So the women featured in FOUND HER tell their own stories. We publish them in
                  their own words and only after they approve the final version.
                </p>
              </div>
              <Link href="/found-her" className="btn btn-dark mt-8">
                Enter FOUND HER
              </Link>
            </Reveal>
          </div>
        </section>

        <section className="border-t border-bronze/15 bg-founder-green py-16 text-cream md:py-20">
          <div className="shell grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <Reveal>
              <p className="eyebrow text-champagne">Where we are now</p>
              <h2 className="mt-5 max-w-[14ch] font-serif text-[clamp(2rem,5vw,3.4rem)] font-light leading-[1.02]">
                We are still building this. That is part of the story too.
              </h2>
            </Reveal>
            <Reveal delay={80} className="flex flex-wrap gap-4 md:justify-end">
              <Link href="/founder-collection" className="btn btn-primary">
                Shop FOUNDER
              </Link>
              <Link href="/found-her#share" className="btn btn-ghost-light">
                Tell your story
              </Link>
            </Reveal>
          </div>
        </section>
      </HouseShell>
    </>
  );
}
