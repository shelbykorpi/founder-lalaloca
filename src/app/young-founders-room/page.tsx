import type { Metadata } from "next";
import Image from "next/image";
import { JsonLd, breadcrumbSchema } from "@/lib/seo";
import { Threshold } from "@/components/young-founders/Threshold";
import { RoomHero } from "@/components/house/RoomHero";
import { HouseShell } from "@/components/house/HouseShell";
import { EditorialRoomSection } from "@/components/house/EditorialRoomSection";
import { Reveal } from "@/components/house/Reveal";
import { getRoom } from "@/lib/rooms";
import { TrackedLink } from "@/components/young-founders/TrackedLink";
import { DocumentaryImage } from "@/components/young-founders/DocumentaryImage";

const TITLE = "The Young Founders’ Room";
const DESCRIPTION =
  "How young people at StandUp for Kids Tucson helped shape the first LALALOCA Collection — and why 20% of LALALOCA net profits goes directly to the Tucson chapter each month.";

const STANDUP_TUCSON = "https://www.standupforkids.org/tucson/";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/young-founders-room" },
  openGraph: {
    title: `${TITLE} | FOUNDER Beauty`,
    description: DESCRIPTION,
    url: "/young-founders-room",
    type: "article",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const PHOTO = {
  shelbyVolunteer: "/editorial/young-founders/shelby-volunteer.webp",
  respect: "/editorial/young-founders/respect-outreach-center.webp",
} as const;

const MOMENTS = [
  {
    n: "01",
    title: "Try it.",
    body: "Early product samples came to the Outreach Center first. Young people used them, reacted to them, and told us what felt worth keeping.",
  },
  {
    n: "02",
    title: "Question it.",
    body: "Packaging, colour, texture, names — nothing was too small to challenge. The point was not to be polite. The point was to be honest.",
  },
  {
    n: "03",
    title: "Shape it.",
    body: "Their feedback changed real choices in the first LALALOCA Collection. Their contribution belongs in the history of the line.",
  },
] as const;

export default function YoungFoundersRoomPage() {
  return (
    <>
      <JsonLd schema={[breadcrumbSchema([{ name: TITLE, path: "/young-founders-room" }])]} />

      <Threshold focusTargetId="young-founders-heading" />

      <HouseShell room={7}>
        <RoomHero
          room={getRoom(7)}
          height="min-h-[84svh]"
          priority
          headingId="young-founders-heading"
          title="Before there was a collection, there was a table."
          lede={
            <>
              At the StandUp for Kids Tucson Outreach Center, young people tried early
              LALALOCA products, compared packaging, and told us exactly what they thought.
              <span className="mt-6 block border-t border-rose/35 pt-5 text-[0.75rem] uppercase tracking-[0.2em] text-rose">
                20% of LALALOCA net profits · Every month · Directly to StandUp for Kids Tucson
              </span>
            </>
          }
        >
          <a href="#the-table" className="btn btn-primary">
            Come to the table <span aria-hidden>→</span>
          </a>
          <TrackedLink href={STANDUP_TUCSON} event="young_founders_learn_click" external variant="ghost">
            Meet StandUp for Kids Tucson
          </TrackedLink>
        </RoomHero>

        <section id="the-table" className="scroll-mt-24 border-y border-bronze/15 bg-night-deep py-20 md:py-28">
          <div className="shell grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-20">
            <Reveal>
              <p className="eyebrow text-champagne">How it started</p>
              <h2 className="mt-5 max-w-[10ch] font-serif text-[clamp(3.3rem,7vw,6.5rem)] font-light leading-[0.9] text-cream">
                This room existed before the brand partnership did.
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <div className="max-w-[44rem] lg:pt-3">
                <p className="font-serif text-[clamp(1.55rem,2.7vw,2.35rem)] leading-[1.28] text-cream/95">
                  FOUNDER did not arrive with a cause and go looking for a story.
                </p>
                <p className="mt-7 text-[1rem] leading-[1.85] text-cream/72">
                  Shelby had already been volunteering with StandUp for Kids Tucson for years.
                  Twice a week, the work meant showing up, listening, following through, and
                  returning often enough for trust to become real.
                </p>
                <p className="mt-5 text-[1rem] leading-[1.85] text-cream/72">
                  When LALALOCA began to take shape, the Outreach Center became one of the places
                  where early ideas were tested. Not as a focus group. Not as a campaign prop.
                  As people whose opinions were worth asking for.
                </p>
                <blockquote className="mt-10 border-l border-rose/60 pl-6 font-serif text-[clamp(1.7rem,3vw,2.6rem)] italic leading-[1.22] text-rose">
                  “What do you think?”
                </blockquote>
                <p className="mt-4 text-sm leading-relaxed text-cream/55">
                  Sometimes the most powerful invitation is being asked the question and knowing
                  the answer will actually matter.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <EditorialRoomSection surface="panel" ambient={false}>
          <div className="shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
            <Reveal>
              <DocumentaryImage
                src={PHOTO.shelbyVolunteer}
                alt="Shelby Korpi in a StandUp for Kids volunteer shirt outside the Tucson Outreach Center."
                ratio="1179 / 964"
                focal="50% 30%"
                sizes="(min-width: 1024px) 42vw, 100vw"
              />
            </Reveal>

            <Reveal delay={100}>
              <p className="eyebrow text-champagne">A note from Shelby</p>
              <h2 className="mt-5 max-w-[12ch] font-serif text-[clamp(3rem,6vw,5.4rem)] font-light leading-[0.92] text-cream">
                Showing up came first.
              </h2>
              <div className="mt-8 max-w-[42rem] space-y-5 text-[1rem] leading-[1.85] text-cream/78">
                <p>
                  Trust is rarely built in one conversation. It comes from returning.
                  Remembering a name. Following up. Listening without judgment.
                </p>
                <p>
                  The young people I met through StandUp for Kids changed how I understand
                  resilience, honesty, and what it means to make someone feel seen.
                </p>
                <p>
                  When I began building LALALOCA, I wanted their opinions in the room because
                  they had already changed the way I listened.
                </p>
                <p className="font-serif text-2xl italic text-cream">
                  Their ideas changed the collection, too.
                </p>
              </div>
              <p className="mt-8 text-[0.625rem] uppercase tracking-[0.22em] text-champagne">
                Shelby Korpi · Founder
              </p>
            </Reveal>
          </div>
        </EditorialRoomSection>

        <section className="bg-cream py-20 text-charcoal md:py-28">
          <div className="shell">
            <Reveal className="max-w-4xl">
              <p className="eyebrow text-bronze-ink">At the table</p>
              <h2 className="mt-5 max-w-[12ch] font-serif text-[clamp(3.2rem,6vw,5.6rem)] font-light leading-[0.94]">
                They did more than try the products.
              </h2>
              <p className="mt-7 max-w-2xl text-[1rem] leading-[1.8] text-charcoal/72">
                They reacted, questioned, compared, and helped shape what made it into the first collection.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-px bg-charcoal/12 md:grid-cols-3">
              {MOMENTS.map((moment, i) => (
                <Reveal key={moment.n} delay={i * 90} className="bg-shell p-7 md:p-9">
                  <p className="text-[0.6rem] uppercase tracking-[0.22em] text-bronze-ink/70">
                    {moment.n}
                  </p>
                  <h3 className="mt-5 font-serif text-[clamp(2rem,3.5vw,3.2rem)] font-light leading-none text-charcoal">
                    {moment.title}
                  </h3>
                  <p className="mt-5 text-sm leading-[1.8] text-charcoal/72">{moment.body}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={120} className="mt-14 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
              <DocumentaryImage
                src={PHOTO.respect}
                alt="An afternoon at the StandUp for Kids Tucson Outreach Center: a young person playing acoustic guitar at the table while a volunteer listens. The organization's RESPECT graphic reads: We StandUp for every individual, listening, honoring their voices and treating them with dignity."
                ratio="1094 / 1062"
                focal="50% 50%"
                sizes="(min-width: 1024px) 52vw, 100vw"
              />

              <div>
                <p className="eyebrow text-bronze-ink">The point</p>
                <p className="mt-5 font-serif text-[clamp(2rem,4vw,3.8rem)] font-light leading-[1.08] text-charcoal">
                  Your ideas have value.
                  <br />
                  Your voice can shape something real.
                </p>
                <p className="mt-7 max-w-md text-[1rem] leading-[1.8] text-charcoal/72">
                  For young people who have spent too much time being spoken about instead of
                  listened to, being asked for an opinion can carry more weight than it appears to.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="relative isolate overflow-hidden bg-night-deep">
          <Image
            src="/editorial/rooms/young-founders-window.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center opacity-45"
          />
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,17,14,0.98)_0%,rgba(6,17,14,0.9)_46%,rgba(6,17,14,0.45)_100%)]" />
          <div className="shell relative py-24 md:py-32">
            <Reveal className="max-w-[46rem]">
              <p className="eyebrow text-champagne">The commitment</p>
              <div className="mt-4 font-serif text-[clamp(6rem,16vw,13rem)] font-light leading-[0.78] tracking-[-0.06em] text-rose">
                20%
              </div>
              <h2 className="mt-7 max-w-[12ch] font-serif text-[clamp(2.6rem,5vw,4.8rem)] font-light leading-[0.96] text-cream">
                of LALALOCA net profits. Every month. Directly to StandUp for Kids Tucson.
              </h2>
              <p className="mt-8 max-w-[40rem] text-[1rem] leading-[1.8] text-cream/72">
                This is not a launch-week donation and not a limited campaign. Each calendar
                month, FOUNDER will donate an amount equal to 20% of the net profits earned
                from sales of the LALALOCA Collection directly to the Tucson chapter.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <TrackedLink href="/shop" event="young_founders_shop_click">
                  Shop LALALOCA
                </TrackedLink>
                <TrackedLink href={STANDUP_TUCSON} event="young_founders_donate_click" external variant="ghost">
                  Give directly
                </TrackedLink>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="bg-shell py-20 text-charcoal md:py-28">
          <div className="shell grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow text-bronze-ink">What a purchase can do</p>
              <h2 className="mt-5 max-w-[10ch] font-serif text-[clamp(3rem,6vw,5.2rem)] font-light leading-[0.94]">
                It does not buy someone’s story.
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <div className="max-w-[44rem]">
                <p className="font-serif text-[clamp(1.5rem,2.7vw,2.25rem)] leading-[1.28] text-charcoal">
                  It helps keep support moving toward the people doing the work.
                </p>
                <p className="mt-7 text-[1rem] leading-[1.85] text-charcoal/72">
                  One skincare purchase will not end youth homelessness. What it can do is become
                  part of a consistent monthly commitment to an organization providing street
                  outreach, mentoring, guidance, referrals, and drop-in support.
                </p>
                <div className="mt-9 border-l border-bronze pl-6 text-[1rem] leading-[1.9] text-charcoal/76">
                  <p>The volunteer who returns.</p>
                  <p>The mentor who listens.</p>
                  <p>The Outreach Center door that opens.</p>
                  <p>The moment someone asks, “What do you think?” — and waits for the answer.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="border-y border-bronze/15 bg-founder-green py-20 md:py-28">
          <div className="shell grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20">
            <Reveal>
              <p className="eyebrow text-champagne">What comes next</p>
              <h2 className="mt-5 max-w-[11ch] font-serif text-[clamp(3rem,6vw,5.4rem)] font-light leading-[0.94] text-cream">
                The work continues after the launch.
              </h2>
              <div className="mt-8 max-w-[42rem] space-y-5 text-[1rem] leading-[1.85] text-cream/76">
                <p>
                  The next chapter is not another campaign image. It is continuing to show up:
                  outreach, mentorship, fundraising, introductions, and community support.
                </p>
                <p>
                  FOUNDER is also helping support the upcoming Grit &amp; Gratitude Gala for
                  StandUp for Kids Tucson — another way to bring people, resources, and attention
                  into the room.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="border border-bronze/25 bg-night-deep/55 p-7 md:p-9">
                <p className="text-[0.6rem] uppercase tracking-[0.22em] text-champagne">The next invitation</p>
                <p className="mt-5 font-serif text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.08] text-cream">
                  Care is not the finish line.
                  <br />
                  Showing up is.
                </p>
                <div className="mt-8">
                  <TrackedLink href={STANDUP_TUCSON} event="young_founders_learn_click" external variant="ghost">
                    Learn about StandUp for Kids Tucson
                  </TrackedLink>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <EditorialRoomSection surface="marble">
          <div className="shell max-w-4xl text-center">
            <Reveal>
              <p className="eyebrow text-champagne">The Young Founders’ Room</p>
              <h2 className="mt-5 font-serif text-[clamp(3.4rem,7vw,6rem)] font-light leading-[0.9] text-cream">
                They helped shape the first collection.
                <span className="mt-3 block italic text-rose">The promise is to keep showing up.</span>
              </h2>
              <p className="mx-auto mt-8 max-w-2xl text-[1rem] leading-[1.8] text-cream/70">
                Shop the collection they helped influence, support the Tucson chapter directly,
                or simply spend a few minutes learning about the work.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <TrackedLink href="/shop" event="young_founders_shop_click">
                  Shop LALALOCA
                </TrackedLink>
                <TrackedLink href={STANDUP_TUCSON} event="young_founders_donate_click" external variant="ghost">
                  Give directly
                </TrackedLink>
              </div>
            </Reveal>
          </div>
        </EditorialRoomSection>
      </HouseShell>
    </>
  );
}
