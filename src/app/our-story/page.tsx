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
  "The story behind FOUNDER: from being bullied for her looks to a modeling career, the cover of Maxim, entrepreneurship, beauty, technology, and a brand built around the whole woman.";

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
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,17,14,0.16)_0%,rgba(6,17,14,0.2)_34%,rgba(6,17,14,0.82)_76%,rgba(6,17,14,0.97)_100%)] md:bg-[linear-gradient(90deg,rgba(6,17,14,0.94)_0%,rgba(6,17,14,0.82)_34%,rgba(6,17,14,0.34)_58%,rgba(6,17,14,0.06)_78%)]"
          />
          <div className="shell relative flex min-h-[70svh] items-end pb-12 pt-24 md:min-h-[76svh] md:items-center md:py-20">
            <div className="max-w-[34rem]">
              <p className="room-label">Room 05 · Our Story</p>
              <span aria-hidden className="mt-4 block h-px w-10 bg-rose" />
              <h1 className="mt-5 max-w-[13ch] font-serif text-[clamp(2.15rem,7.2vw,4rem)] font-light leading-[0.99] tracking-[-0.025em] text-cream">
                I know what it feels like to be judged by how you look.
              </h1>
              <p className="mt-6 max-w-[32rem] text-[0.98rem] leading-[1.75] text-cream/80 md:text-[1.05rem]">
                I was picked on and bullied for my looks in school. I honestly never imagined I
                would grow up to be considered beautiful, much less build a career around being
                photographed. Years later, I was on the cover of Maxim. Life has a funny way of
                showing you its version of karma.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                <Link href="#beginning" className="btn btn-primary">
                  Read our story
                </Link>
                <Link href="/found-her" className="hairline text-cream">
                  Meet FOUND HER
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="beginning" className="scroll-mt-24 bg-cream py-16 text-charcoal md:py-24">
          <div className="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-20">
            <Reveal>
              <p className="eyebrow text-bronze-ink">Before the brand</p>
              <h2 className="mt-5 max-w-[12ch] font-serif text-[clamp(2rem,5vw,3.4rem)] font-light leading-[1.03] tracking-[-0.02em]">
                Beauty was never simple for me.
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <div className="max-w-[44rem]">
                <p className="font-serif text-[clamp(1.4rem,2.7vw,2.1rem)] leading-[1.32] text-charcoal">
                  I grew up knowing what it felt like to be made to feel like I was not enough.
                </p>
                <div className="mt-7 space-y-5 text-[1rem] leading-[1.85] text-charcoal/76">
                  <p>
                    I was the girl who got made fun of for how I looked. At that age, I never
                    thought I would be the pretty girl. I definitely never thought my face would
                    become part of my career.
                  </p>
                  <p>
                    But it did. Modeling took me into a completely different world. I shot
                    catalogs, swimwear and high-fashion editorials. I worked as a ring girl for
                    professional sports, worked alongside Kevin Hart, and eventually appeared on
                    the cover of Maxim.
                  </p>
                  <p>
                    There is something surreal about growing up being picked apart for your looks
                    and then being paid to be photographed for them. I can laugh about the karma in
                    that now, but it also taught me something early: attention does not automatically
                    give you confidence, and being considered beautiful does not tell anyone who you are.
                  </p>
                  <p>
                    Modeling taught me how powerful an image can be. It also taught me how easy it
                    is for people to stop at the image. FOUNDER comes from wanting to hold both
                    truths at once — beauty can be fun, glamorous and powerful, but there should
                    always be more to the woman than the picture.
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
              <p className="eyebrow text-champagne">Then I started building</p>
              <h2 className="mt-5 max-w-[13ch] font-serif text-[clamp(2rem,5vw,3.4rem)] font-light leading-[1.03] tracking-[-0.02em] text-cream">
                Modeling taught me image. Business taught me everything underneath it.
              </h2>
              <div className="mt-7 max-w-[42rem] space-y-5 text-[1rem] leading-[1.85] text-cream/76">
                <p>
                  My first real business was built from my kitchen and did just under one million
                  dollars in its first year. After that, my path took a hard turn into technology
                  and agriculture.
                </p>
                <p>
                  BitThermal took me into commercial poultry barns. That work eventually grew into
                  EcoYield.ai. I went from beauty shoots and product photography to dust, equipment,
                  operators, data, patents, and long days inside an industry I had never expected
                  to enter.
                </p>
                <p>
                  None of it felt like a clean career story while I was living it. Looking back,
                  that is exactly the point. Women do not live in neat categories. I did not want
                  to build a brand that expected them to.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="bg-shell py-16 text-charcoal md:py-24">
          <div className="shell grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-20">
            <Reveal>
              <p className="eyebrow text-bronze-ink">Why FOUNDER</p>
              <h2 className="mt-5 max-w-[11ch] font-serif text-[clamp(2rem,5vw,3.35rem)] font-light leading-[1.03]">
                The name came from a much bigger idea than starting a company.
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <div className="max-w-[44rem] space-y-5 text-[1rem] leading-[1.85] text-charcoal/76">
                <p>
                  I believe every woman is the founder of something. Maybe it is a business.
                  Maybe it is a family, a new direction, a second chance, or a version of herself
                  she had to fight to get back.
                </p>
                <p>
                  FOUNDER is the title because building something changes you. It asks you to make
                  decisions, take risks, start over, and keep going before there is any guarantee
                  that it will work.
                </p>
                <p>
                  FOUND HER is the other half. It is the moment you realize the woman you thought
                  you were trying to become has already been showing up for you for years.
                </p>
                <p className="border-l border-bronze pl-5 font-serif text-[clamp(1.45rem,2.7vw,2rem)] italic leading-[1.35] text-charcoal">
                  FOUNDER is what she builds. FOUND HER is when she recognizes herself.
                </p>
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
              <p className="eyebrow text-champagne">Why beauty came first</p>
              <h2 className="mt-5 max-w-[12ch] font-serif text-[clamp(2rem,5vw,3.35rem)] font-light leading-[1.03] text-cream">
                I came back to beauty, but on my own terms.
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <div className="max-w-[44rem]">
                <p className="font-serif text-[clamp(1.4rem,2.6vw,2.05rem)] leading-[1.32] text-cream">
                  LALALOCA was the first collection.
                </p>
                <p className="mt-7 text-[1rem] leading-[1.85] text-cream/76">
                  It started with three serums: Thirst Trap, C Me Glow and Bounce Back.
                  The FOUNDER Collection followed with the rest of the routine: Opening Line,
                  Clean Break, Hold the Room, Double Take and Smooth Talker.
                </p>
                <p className="mt-5 text-[1rem] leading-[1.85] text-cream/76">
                  The products are not here to promise a new identity. They are the few minutes
                  before the meeting, the school run, the flight, the pitch, the date, the hard
                  conversation, or whatever else is waiting on the other side of the door.
                </p>
                <p className="mt-5 text-[1rem] leading-[1.85] text-cream/76">
                  Beauty is the first door into FOUNDER because it was part of my story long before
                  I knew what the house would become.
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
          <div className="shell grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-20">
            <Reveal>
              <div className="relative aspect-[4/5] overflow-hidden bg-night-deep">
                <Image
                  src={founder.portrait!.src}
                  alt={founder.portrait!.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 90vw, 42vw"
                  className="object-cover"
                  style={{ objectPosition: founder.portrait!.position ?? "center" }}
                />
              </div>
            </Reveal>

            <Reveal delay={100}>
              <p className="eyebrow text-bronze-ink">The difference between this page and FOUND HER</p>
              <h2 className="mt-5 max-w-[12ch] font-serif text-[clamp(2rem,5vw,3.25rem)] font-light leading-[1.03]">
                This is the story of the brand. FOUND HER is the story of the woman.
              </h2>
              <div className="mt-7 max-w-[40rem] space-y-5 text-[1rem] leading-[1.85] text-charcoal/74">
                <p>
                  Our Story is about how all of those chapters became FOUNDER — modeling,
                  entrepreneurship, beauty, technology, agriculture, and the belief that women
                  should never have to shrink themselves into one identity to make other people
                  comfortable.
                </p>
                <p>
                  My FOUND HER profile is more personal. It goes into the setbacks, the money,
                  the miles, the moments I nearly quit, and the parts of the story that happened
                  when nobody was watching.
                </p>
              </div>
              <Link href={`/found-her/${founder.slug}`} className="btn btn-dark mt-8">
                Read my FOUND HER story
              </Link>
            </Reveal>
          </div>
        </section>

        <section className="bg-founder-green py-16 text-cream md:py-24">
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
              <p className="eyebrow text-champagne">Why FOUND HER belongs here</p>
              <h2 className="mt-5 max-w-[12ch] font-serif text-[clamp(2rem,5vw,3.3rem)] font-light leading-[1.03] text-cream">
                I do not want the products to be the most interesting thing about this brand.
              </h2>
              <div className="mt-7 max-w-[40rem] space-y-5 text-[1rem] leading-[1.85] text-cream/76">
                <p>
                  FOUND HER gives women room to tell their own stories — what they built,
                  what it took, what changed, and what they are proud of now.
                </p>
                <p>
                  They tell those stories in their own words, and we publish them only after
                  they approve the final version. Because the point of FOUNDER was never to tell
                  women who to be. It was to make more room for who they already are.
                </p>
              </div>
              <Link href="/found-her" className="btn btn-primary mt-8">
                Enter FOUND HER
              </Link>
            </Reveal>
          </div>
        </section>

        <section className="border-t border-bronze/15 bg-night-deep py-16 text-cream md:py-20">
          <div className="shell grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <Reveal>
              <p className="eyebrow text-champagne">Still building</p>
              <h2 className="mt-5 max-w-[14ch] font-serif text-[clamp(2rem,5vw,3.3rem)] font-light leading-[1.03]">
                FOUNDER is not a finished story. I do not want it to be.
              </h2>
              <p className="mt-6 max-w-[38rem] text-[1rem] leading-[1.8] text-cream/72">
                Beauty is the first door. The women, the stories, and everything we build next
                are what make it a house.
              </p>
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
