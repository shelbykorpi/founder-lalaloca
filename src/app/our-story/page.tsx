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
  "FOUNDER is a beauty house for women building something real. LALALOCA was the first collection. FOUND HER is where the women behind the work tell their stories.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/our-story" },
};

const BUILDING = [
  "a business",
  "a family",
  "a body of work",
  "a second chance",
  "a life that finally feels like hers",
] as const;

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
                A beauty brand for the woman with somewhere to be.
              </h1>
              <p className="mt-6 max-w-[32rem] text-[0.98rem] leading-[1.75] text-cream/78 md:text-[1.05rem]">
                Not just somewhere to go. Somewhere to lead, build, decide, begin again,
                or walk into before she feels completely ready.
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
              <p className="eyebrow text-bronze-ink">Why FOUNDER exists</p>
              <h2 className="mt-5 max-w-[12ch] font-serif text-[clamp(2rem,5vw,3.7rem)] font-light leading-[1.02] tracking-[-0.02em]">
                Beauty belongs around the work, not instead of it.
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <div className="max-w-[44rem]">
                <p className="font-serif text-[clamp(1.4rem,2.7vw,2.15rem)] leading-[1.32] text-charcoal">
                  I wanted a beauty brand that understood the twenty minutes before something real.
                </p>
                <div className="mt-7 space-y-5 text-[1rem] leading-[1.85] text-charcoal/76">
                  <p>
                    The meeting. The flight. The school run. The pitch. The first day back.
                    The dinner where you finally say what you mean.
                  </p>
                  <p>
                    FOUNDER is for the woman getting ready for that moment. She can care about
                    beautiful skin and still be thinking about everything she has to carry,
                    solve, build, protect, or become once she leaves the room.
                  </p>
                  <p>
                    That is the point. She never had to choose between ambition and beauty,
                    softness and credibility, or who she is and what she is building.
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
              <p className="eyebrow text-champagne">The name</p>
              <h2 className="mt-5 max-w-[13ch] font-serif text-[clamp(2rem,5vw,3.75rem)] font-light leading-[1.02] tracking-[-0.02em] text-cream">
                FOUNDER is the title. FOUND HER is the woman behind it.
              </h2>
              <div className="mt-7 max-w-[42rem] space-y-5 text-[1rem] leading-[1.85] text-cream/76">
                <p>
                  When I say founder, I do not mean a business registration. I mean the woman
                  who started the thing, kept it going, or began again when the first version
                  fell apart.
                </p>
                <p>
                  Sometimes that is a company. Sometimes it is {BUILDING.slice(0, -1).join(", ")},
                  or {BUILDING[BUILDING.length - 1]}.
                </p>
                <p>
                  The other half of the name took longer to see: founder. Found her.
                  Somewhere in all that building is a moment when you look up and recognize
                  the woman you have become.
                </p>
              </div>
              <p className="mt-8 max-w-[34rem] border-l border-rose/55 pl-5 font-serif text-[clamp(1.45rem,2.6vw,2rem)] italic leading-[1.35] text-rose">
                I named the brand after that moment, not after me.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="bg-shell py-16 text-charcoal md:py-24">
          <div className="shell">
            <Reveal className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
              <div>
                <p className="eyebrow text-bronze-ink">The founder</p>
                <h2 className="mt-5 max-w-[10ch] font-serif text-[clamp(2rem,5vw,3.6rem)] font-light leading-[1.02]">
                  The story did not happen in a beauty office.
                </h2>
              </div>
              <div className="max-w-[44rem] text-[1rem] leading-[1.85] text-charcoal/76">
                <p>
                  Before FOUNDER, there was a kitchen-table business that did just under one
                  million dollars in its first year. Then came BitThermal, years inside
                  commercial poultry barns, and the work that grew into EcoYield.ai.
                </p>
                <p className="mt-5">
                  There were also the parts that do not photograph as well: packing boxes,
                  driving across the country for opportunities, running out of money, and
                  delivering other people’s dinners while trying to keep a company alive.
                </p>
                <p className="mt-5">
                  FOUNDER comes from all of it. The polished rooms and the unglamorous work.
                  Beauty and barns. Femininity and infrastructure. The version of a woman people
                  see, and the one doing the work when no one is looking.
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
                  Her full FOUND HER profile goes deeper into the businesses, the barns, the
                  setbacks, and the part nobody saw.
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
              <p className="eyebrow text-champagne">Beauty was the first door</p>
              <h2 className="mt-5 max-w-[12ch] font-serif text-[clamp(2rem,5vw,3.7rem)] font-light leading-[1.02] text-cream">
                FOUNDER is the house. Beauty is where you enter.
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <div className="max-w-[44rem]">
                <p className="font-serif text-[clamp(1.4rem,2.6vw,2.1rem)] leading-[1.32] text-cream">
                  Three serums came first. Five more pieces followed.
                </p>
                <p className="mt-7 text-[1rem] leading-[1.85] text-cream/75">
                  LALALOCA began with Thirst Trap, C Me Glow and Bounce Back. The FOUNDER
                  Collection expanded the ritual from cleanse to finish: Opening Line,
                  Clean Break, Hold the Room, Double Take and Smooth Talker.
                </p>
                <p className="mt-5 text-[1rem] leading-[1.85] text-cream/75">
                  The products are the first expression of the house — useful, beautiful
                  things for the moments before she goes back to building everything else.
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
              <p className="eyebrow text-bronze-ink">FOUND HER</p>
              <h2 className="mt-5 max-w-[12ch] font-serif text-[clamp(2rem,5vw,3.6rem)] font-light leading-[1.02]">
                The brand is not complete if only the products get the frame.
              </h2>
              <div className="mt-7 max-w-[40rem] space-y-5 text-[1rem] leading-[1.85] text-charcoal/74">
                <p>
                  FOUND HER is where women tell the part behind the title: what they built,
                  what it took, what changed, and the moment they recognized themselves.
                </p>
                <p>
                  Their stories are published in their own words and with their final approval.
                  The point is not to turn anyone into a campaign. It is to make room for the
                  woman doing the work.
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
              <p className="eyebrow text-champagne">The house is open</p>
              <h2 className="mt-5 max-w-[14ch] font-serif text-[clamp(2rem,5vw,3.7rem)] font-light leading-[1.02]">
                Whatever you are building, come as the woman already doing the work.
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
