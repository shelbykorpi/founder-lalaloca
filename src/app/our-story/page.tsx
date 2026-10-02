import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { HouseShell } from "@/components/house/HouseShell";
import { Reveal } from "@/components/house/Reveal";
import { AmbientLighting } from "@/components/house/AmbientLighting";
import { getRoom } from "@/lib/rooms";
import { profiles } from "@/lib/profiles";
import { JsonLd, aboutPageSchema, breadcrumbSchema } from "@/lib/seo";

/*
 * Our Story is Shelby's letter on why she started FOUNDER, in her own words
 * (Shelby, 1 Oct 2026: "our story needs to tell the story of why i started
 * founder", with the full text). Every sentence below is hers, verbatim and in
 * her order, except that "My vision for FOUNDER" now follows the opening
 * (Shelby, 2 Oct 2026: "put the my vision for founder under the first
 * section"). Only the layout is ours: her capitalised section titles became
 * the h2s, and her one-sentence lines are grouped into stanzas so the rhythm
 * she wrote survives on screen. Her biography (the bullying, Maxim, the
 * kitchen business, BitThermal) moved off this page; it lives in full on her
 * FOUND HER profile, which this page links to. "The room is yours." is a
 * protected line and closes the letter exactly as she wrote it.
 */

const TITLE = "Our Story";
const DESCRIPTION =
  "Why Shelby Korpi started FOUNDER: for every woman who has been underestimated and kept going, and why FOUND HER exists to tell her story.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/our-story" },
};

type Block =
  /** An ordinary sentence or paragraph. */
  | { kind: "p"; text: string }
  /** Her short lines, kept one per line. `voice` sets them in serif italic. */
  | { kind: "lines"; lines: string[]; voice?: boolean; columns?: boolean }
  /** A line that turns the section, set larger in serif. */
  | { kind: "lead"; text: string }
  /** A pull line with the bronze rule. */
  | { kind: "quote"; text: string };

type Tone = "light" | "dark";

const BODY: Record<Tone, string> = {
  light: "text-charcoal/80",
  dark: "text-cream/78",
};
const STRONG: Record<Tone, string> = {
  light: "text-charcoal",
  dark: "text-cream",
};

function Blocks({ blocks, tone }: { blocks: Block[]; tone: Tone }) {
  return (
    <div className={`space-y-6 text-[1rem] leading-[1.85] md:text-[1.05rem] ${BODY[tone]}`}>
      {blocks.map((b, i) => {
        switch (b.kind) {
          case "p":
            return <p key={i}>{b.text}</p>;
          case "lead":
            return (
              <p
                key={i}
                className={`font-serif text-[clamp(1.45rem,2.7vw,2.05rem)] leading-[1.28] ${STRONG[tone]}`}
              >
                {b.text}
              </p>
            );
          case "quote":
            return (
              <p
                key={i}
                className={`border-l border-bronze pl-5 font-serif text-[clamp(1.45rem,2.7vw,2rem)] italic leading-[1.35] ${STRONG[tone]}`}
              >
                {b.text}
              </p>
            );
          case "lines":
            if (b.columns) {
              return (
                <ul key={i} className="grid gap-x-10 gap-y-1.5 sm:grid-cols-2">
                  {b.lines.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              );
            }
            return (
              <p
                key={i}
                className={
                  b.voice
                    ? `space-y-1 font-serif text-[clamp(1.25rem,2.2vw,1.6rem)] italic leading-[1.4] ${STRONG[tone]}`
                    : "space-y-2 leading-[1.7]"
                }
              >
                {b.lines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </p>
            );
        }
      })}
    </div>
  );
}

/* ── The letter, section by section ─────────────────────────────────────── */

const OPENING: Block[] = [
  {
    kind: "lines",
    lines: [
      "To have something important to say and feel unheard.",
      "To know you’re capable of more than people can see.",
      "To work harder, dream bigger, keep going—and still feel like you have to prove that you belong.",
    ],
  },
  { kind: "lead", text: "For a long time, I thought the answer was to prove myself." },
  { kind: "lines", lines: ["To work harder.", "Be stronger.", "Say less.", "Take up less space."] },
  { kind: "p", text: "Eventually, I realized something:" },
  {
    kind: "quote",
    text: "I was never supposed to make myself smaller just to fit inside someone else’s idea of who I should be.",
  },
  { kind: "lead", text: "And neither are you." },
  { kind: "p", text: "That realization became FOUNDER." },
];

const KEPT_GOING: Block[] = [
  {
    kind: "lines",
    lines: [
      "Maybe you’re building a company.",
      "Maybe you’re building a family.",
      "Maybe you’re rebuilding yourself.",
      "Maybe you’re starting over after something you thought would last forever ended.",
      "Maybe you’re chasing something no one around you understands yet.",
      "Maybe you’re standing in the middle of the hardest chapter of your life and you don’t even know what comes next.",
    ],
  },
  {
    kind: "p",
    text: "Or maybe you’ve finally reached the moment you prayed for—and you’re learning how to let yourself be proud of it.",
  },
  { kind: "p", text: "Whatever you’re building, I want you to know this:" },
  { kind: "quote", text: "You don’t need anyone else’s permission to become her." },
  { kind: "p", text: "The woman you know you’re capable of becoming." },
];

const OWNERSHIP = [
  "Ownership of your voice.",
  "Your choices.",
  "Your mistakes.",
  "Your dreams.",
  "Your next chapter.",
  "Your life.",
];

const SEEN: Block[] = [
  { kind: "p", text: "There are so many extraordinary women whose stories will never make the headlines." },
  { kind: "p", text: "Women quietly doing impossible things every day." },
  {
    kind: "lines",
    lines: [
      "Women working while raising children.",
      "Women starting companies with no idea if they’ll succeed.",
      "Women leaving relationships and rebuilding their lives.",
      "Women caring for everyone around them while trying not to lose themselves.",
      "Women walking into rooms where nobody expects them to be the decision-maker.",
      "Women failing privately and showing up again the next morning.",
    ],
  },
  { kind: "lines", lines: ["Women starting over at 25.", "Or 35.", "Or 55."] },
  {
    kind: "p",
    text: "Women accomplishing something enormous and being afraid to talk about it because they don’t want to sound like they’re bragging.",
  },
  { kind: "lead", text: "I want to change that." },
  { kind: "p", text: "You should be allowed to be proud of yourself." },
  { kind: "p", text: "You should be able to say:" },
  {
    kind: "lines",
    voice: true,
    lines: [
      "I worked for this.",
      "I survived this.",
      "I built this.",
      "I earned this.",
      "I did something I once wasn’t sure I could do.",
    ],
  },
  {
    kind: "p",
    text: "And the women around you should be able to celebrate that without comparison.",
  },
  {
    kind: "lines",
    lines: ["Without competition.", "Without making themselves smaller because someone else is shining."],
  },
  { kind: "quote", text: "There is room for all of us." },
];

const MORE_THAN_BEAUTY: Block[] = [
  { kind: "lead", text: "I love beauty." },
  { kind: "p", text: "I love the feeling of getting ready for something that matters." },
  { kind: "p", text: "That moment before you walk out the door." },
  {
    kind: "lines",
    lines: [
      "Before the meeting.",
      "Before the pitch.",
      "Before the interview.",
      "Before the date.",
      "Before the event.",
      "Before you step into the room and become the version of yourself the world is about to meet.",
    ],
  },
  {
    kind: "p",
    text: "Sometimes putting yourself together on the outside reminds you of the strength that’s already inside you.",
  },
  {
    kind: "p",
    text: "But FOUNDER will never be about telling women they need something to become beautiful enough, polished enough, successful enough or worthy enough.",
  },
  { kind: "quote", text: "You were worthy before you opened the bottle." },
  {
    kind: "p",
    text: "The product is simply there for the moment you look in the mirror and remember:",
  },
  { kind: "lead", text: "There she is." },
];

const FOUND_HER: Block[] = [
  { kind: "p", text: "There’s another reason I created FOUNDER." },
  { kind: "p", text: "I don’t just want women to see themselves in this brand." },
  { kind: "lead", text: "I want them to see each other." },
  {
    kind: "p",
    text: "I want to create a community where we tell the stories behind the woman everyone else sees.",
  },
  { kind: "lines", lines: ["Not only the polished version.", "The real version."] },
  {
    kind: "lines",
    lines: [
      "The nights you cried.",
      "The door that closed.",
      "The person who told you no.",
      "The mistake you thought ruined everything.",
      "The moment you almost stopped.",
      "The risk you took anyway.",
    ],
  },
  { kind: "p", text: "And then the moment something finally changed." },
  {
    kind: "lines",
    lines: [
      "The first customer.",
      "The promotion.",
      "The degree.",
      "The investment.",
      "The new beginning.",
      "The day you left.",
      "The day you started.",
      "The day you finally looked at yourself and realized how far you’d come.",
    ],
  },
  { kind: "lead", text: "That is FOUND HER." },
  { kind: "p", text: "A place to tell those stories." },
  {
    kind: "lines",
    lines: [
      "Because somewhere there is another woman going through the chapter you already survived.",
      "And your story might be the reason she keeps going.",
    ],
  },
  { kind: "quote", text: "Sometimes all we need is proof that someone else made it through." },
];

const CELEBRATING: Block[] = [
  { kind: "p", text: "I want women to share their wins loudly." },
  { kind: "lines", voice: true, lines: ["Big ones.", "Small ones.", "Messy ones."] },
  {
    kind: "lines",
    lines: [
      "The million-dollar company and the first $100 sale.",
      "The promotion and the first résumé sent after years away from work.",
      "The award and the decision to finally try.",
    ],
  },
  {
    kind: "lines",
    columns: true,
    lines: [
      "Starting the company.",
      "Leaving the job.",
      "Becoming a mother.",
      "Choosing not to become one.",
      "Getting out.",
      "Starting over.",
      "Going back to school.",
      "Buying the house.",
      "Walking away.",
      "Healing.",
      "Speaking up.",
      "Learning to love yourself again.",
    ],
  },
  { kind: "p", text: "There isn’t one definition of success here." },
  { kind: "lead", text: "There is only the life you choose to build." },
  { kind: "p", text: "And when another woman wins, I want us to clap for her." },
  {
    kind: "lines",
    lines: [
      "Not because her journey looks like ours.",
      "Because we know what it takes to keep going when nobody can see the finish line yet.",
    ],
  },
];

const VISION: Block[] = [
  { kind: "lead", text: "I want FOUNDER to become a place women come to feel something." },
  {
    kind: "lines",
    lines: [
      "Yes, I want you to discover products you love.",
      "But I also want you to discover a woman whose story stays with you.",
    ],
  },
  { kind: "p", text: "I want you to see someone who reminds you of yourself." },
  { kind: "p", text: "Someone who makes you think:" },
  {
    kind: "lines",
    voice: true,
    lines: [
      "If she can start again, maybe I can too.",
      "If she can build it, maybe I can build mine.",
      "If she can survive that, maybe this isn’t the end of my story.",
    ],
  },
  {
    kind: "p",
    text: "And one day, maybe someone else will look at your story and think the exact same thing.",
  },
  { kind: "p", text: "That’s the community I want to build." },
  {
    kind: "quote",
    text: "Women opening doors for themselves—and then holding them open for the woman behind them.",
  },
];

const YOURS_TOO: Block[] = [
  { kind: "lead", text: "It’s yours, too." },
  { kind: "p", text: "FOUNDER belongs to the woman who hasn’t figured everything out yet." },
  {
    kind: "lines",
    lines: [
      "The woman who’s afraid and doing it anyway.",
      "The woman who has been underestimated.",
      "The woman who has fallen apart and rebuilt herself differently.",
      "The woman with an idea scribbled in a notebook that she hasn’t told anyone about yet.",
      "The woman who finally understands that wanting more doesn’t make her ungrateful.",
      "The woman who is learning to stop apologizing for her ambition.",
    ],
  },
  { kind: "lead", text: "The woman becoming HER." },
  { kind: "p", text: "So tell us your story." },
  {
    kind: "lines",
    lines: [
      "Tell us what you built.",
      "Tell us what you survived.",
      "Tell us what you’re dreaming about.",
      "Tell us about the moment you almost gave up.",
      "Tell us about the moment you didn’t.",
      "Tell us what you’re proud of.",
    ],
  },
  { kind: "p", text: "Because you never know which woman needs to hear it." },
];

const CLOSING: Block[] = [
  { kind: "p", text: "And when something beautiful happens for another woman, celebrate her." },
  {
    kind: "lines",
    voice: true,
    lines: [
      "Her light does not dim yours.",
      "Her seat does not take yours.",
      "Her success does not make your dream less possible.",
    ],
  },
  { kind: "lines", lines: ["There is room for both of you.", "There is room for all of us."] },
  { kind: "p", text: "And maybe that’s what I needed to hear years ago, too." },
  {
    kind: "lines",
    lines: [
      "I wasn’t in the wrong room.",
      "I didn’t need to become smaller.",
      "I didn’t need to wait until someone invited me in.",
    ],
  },
  { kind: "lead", text: "I could open the door myself." },
  { kind: "lead", text: "And so can you." },
];

/** Her section title, set as the h2 with the rose rule above it. */
function Heading({ children, tone, id }: { children: ReactNode; tone: Tone; id?: string }) {
  return (
    <>
      <span aria-hidden className="block h-px w-10 bg-rose" />
      <h2
        id={id}
        className={`mt-5 max-w-[14ch] font-serif text-[clamp(2rem,5vw,3.35rem)] font-light leading-[1.03] tracking-[-0.02em] ${
          tone === "dark" ? "text-cream" : "text-night"
        }`}
      >
        {children}
      </h2>
    </>
  );
}

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
        {/* ── Our Story: the opening lines ── */}
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
            <div className="max-w-[36rem]">
              <p className="room-label">Room 05 · Our Story</p>
              <span aria-hidden className="mt-4 block h-px w-10 bg-rose" />
              <h1 className="mt-5 max-w-[17ch] font-serif text-[clamp(2.05rem,6.4vw,3.6rem)] font-light leading-[1.02] tracking-[-0.025em] text-cream">
                I started FOUNDER because I know what it feels like to be underestimated.
              </h1>
              <p className="mt-6 max-w-[32rem] text-[0.98rem] leading-[1.75] text-cream/80 md:text-[1.05rem]">
                I know what it feels like to walk into a room and wonder if people have already
                decided who you are before you’ve even had the chance to speak.
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
          <div className="shell">
            <Reveal className="mx-auto max-w-[44rem]">
              <Blocks blocks={OPENING} tone="light" />
            </Reveal>
          </div>
        </section>

        {/* ── My vision for FOUNDER ── */}
        <section className="border-t border-bronze/15 bg-shell py-16 text-charcoal md:py-24">
          <div className="shell grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-20">
            <Reveal className="lg:sticky lg:top-36">
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
              <Heading tone="light">My vision for FOUNDER</Heading>
              <div className="mt-8 max-w-[40rem]">
                <Blocks blocks={VISION} tone="light" />
              </div>
              <Link href={`/found-her/${founder.slug}`} className="btn btn-dark mt-10">
                Read my FOUND HER story
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ── FOUNDER is for the woman who kept going ── */}
        <section className="border-y border-bronze/15 bg-founder-green py-16 text-cream md:py-24">
          <div className="shell grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-16">
            <Reveal className="lg:sticky lg:top-36">
              {/* The journal keeps its own landscape shape (1255 × 747) so the
                  handwriting on the left page is never cropped. */}
              <div className="relative mx-auto aspect-[1255/747] w-full max-w-[40rem] overflow-hidden border border-bronze/20 bg-night-deep shadow-[0_28px_70px_rgba(0,0,0,0.28)] lg:mx-0">
                <Image
                  src="/editorial/our-story-journal.webp"
                  alt="An open journal and fountain pen in the FOUNDER study, the left page handwritten: I found her in the woman who refused to quit."
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 92vw, 40rem"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={100}>
              <Heading tone="dark">FOUNDER is for the woman who kept going.</Heading>
              <div className="mt-8 max-w-[40rem]">
                <Blocks blocks={KEPT_GOING} tone="dark" />
              </div>
            </Reveal>
          </div>

          <div className="shell mt-16 md:mt-20">
            <Reveal className="grid gap-10 border-t border-cream/15 pt-12 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-16 md:pt-16">
              <div>
                <p className="text-[1rem] leading-[1.85] text-cream/78 md:text-[1.05rem]">
                  That’s what being a FOUNDER means to me.
                </p>
                <p className="mt-5 font-serif text-[clamp(1.9rem,4.4vw,3.1rem)] font-light leading-[1.08] text-cream">
                  It isn’t a job title.
                  <span className="block text-champagne">It’s ownership.</span>
                </p>
              </div>
              <p className="font-serif text-[clamp(1.3rem,2.4vw,1.75rem)] leading-[1.5] text-cream">
                {OWNERSHIP.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── Because women deserve to be seen ── */}
        <section className="bg-shell py-16 text-charcoal md:py-24">
          <div className="shell grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-20">
            <Reveal className="lg:sticky lg:top-36">
              <Heading tone="light">Because women deserve to be seen.</Heading>
            </Reveal>
            <Reveal delay={100} className="max-w-[44rem]">
              <Blocks blocks={SEEN} tone="light" />
            </Reveal>
          </div>
        </section>

        {/* ── That's why FOUNDER is more than beauty ── */}
        <section className="relative isolate overflow-hidden bg-night-deep py-16 text-cream md:py-24">
          <Image
            src="/editorial/collection-still.webp"
            alt="The FOUNDER and LALALOCA collections arranged in the dark, cinematic FOUNDER house."
            fill
            loading="lazy"
            sizes="100vw"
            className="object-cover object-center opacity-35"
          />
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,17,14,0.98)_0%,rgba(6,17,14,0.92)_52%,rgba(6,17,14,0.6)_100%)]" />
          <div className="shell relative grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-20">
            <Reveal className="lg:sticky lg:top-36">
              <Heading tone="dark">That’s why FOUNDER is more than beauty.</Heading>
            </Reveal>
            <Reveal delay={100} className="max-w-[44rem]">
              <Blocks blocks={MORE_THAN_BEAUTY} tone="dark" />
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/founder-collection" className="btn btn-primary">
                  The FOUNDER Collection
                </Link>
                <Link href="/shop" className="btn btn-ghost-light">
                  The LALALOCA Collection
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── FOUND HER ── */}
        <section className="bg-rose py-16 text-charcoal md:py-24">
          {/* Desert Rose ground (Shelby, 2 Oct 2026), FOUND HER's colour. Pink
              is a light ground, so the type is ink and green rather than cream
              and champagne: charcoal 6.88:1, Founder Green ~4.6:1. Every
              button's hover is Desert Rose, which would vanish here, so this
              one is Founder Green and deepens to Desert Rose in shadow. */}
          <div className="shell grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-20">
            <Reveal className="lg:sticky lg:top-36">
              {/* The FOUND HER frame on the wall: several women in a gilt frame
                  with "I found her when…" handwritten across the picture. Shown
                  in its own shape (833 × 729) so the frame is never cropped.
                  The women are composed artwork, not contributors, and the
                  lines read like quotes, so the caption says so. */}
              <figure>
                <div className="relative aspect-[833/729] overflow-hidden bg-night-deep">
                  <Image
                    src="/editorial/story-frame.webp"
                    alt="A gilt green frame on a cream wall under a brass picture light, holding a picture of several women with lines handwritten across it: I found her when I decided my worth is non-negotiable; I found her when I stopped shrinking for comfort; I found her when I chose peace over proving; I found her when I became my own safe place."
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 90vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-3 text-[0.75rem] leading-relaxed text-charcoal">
                  An artwork for the FOUND HER wall, not a photograph of contributors.
                </figcaption>
              </figure>
            </Reveal>

            <Reveal delay={100}>
              <Heading tone="light">FOUND HER</Heading>
              <div className="mt-8 max-w-[40rem]">
                <Blocks blocks={FOUND_HER} tone="light" />
              </div>
              <Link
                href="/found-her"
                className="btn mt-10 bg-founder-green text-cream hover:bg-rose-deep hover:text-night"
              >
                Enter FOUND HER
              </Link>
              <p className="mt-4 max-w-[30rem] text-[0.8rem] leading-relaxed text-charcoal">
                Every FOUND HER story is told in the woman’s own words and published only after she
                approves it.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── I want us to get better at celebrating each other ── */}
        <section className="bg-cream py-16 text-charcoal md:py-24">
          <div className="shell grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-20">
            <Reveal className="lg:sticky lg:top-36">
              <Heading tone="light">I want us to get better at celebrating each other.</Heading>
            </Reveal>
            <Reveal delay={100} className="max-w-[44rem]">
              <Blocks blocks={CELEBRATING} tone="light" />
            </Reveal>
          </div>
        </section>

        {/* ── So this isn't only my story ── */}
        <section className="bg-founder-green py-16 text-cream md:py-24">
          <div className="shell grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-20">
            <Reveal className="lg:sticky lg:top-36">
              <Heading tone="dark">So this isn’t only my story.</Heading>
            </Reveal>
            <Reveal delay={100} className="max-w-[44rem]">
              <Blocks blocks={YOURS_TOO} tone="dark" />
              <Link href="/found-her#share" className="btn btn-primary mt-10">
                Tell your story
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ── The close of the letter ── */}
        <section className="border-t border-bronze/15 bg-night-deep py-20 text-cream md:py-28">
          <div className="shell">
            <Reveal className="mx-auto max-w-[44rem]">
              <Blocks blocks={CLOSING} tone="dark" />
              <p className="mt-14 font-serif text-[clamp(2.3rem,6vw,4rem)] font-light leading-[1.02] tracking-[-0.02em] text-cream">
                Welcome to FOUNDER.
                <span className="block text-champagne">The room is yours.</span>
              </p>
              <p className="mt-6 text-[0.8rem] uppercase tracking-[0.18em] text-cream/70">
                Shelby Korpi, Founder
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/founder-collection" className="btn btn-primary">
                  Shop FOUNDER
                </Link>
                <Link href="/found-her#share" className="btn btn-ghost-light">
                  Tell your story
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </HouseShell>
    </>
  );
}
