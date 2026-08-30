import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/site/PageIntro";
import { BRAND } from "@/lib/brand";
import { profiles } from "@/lib/profiles";
import { JsonLd, aboutPageSchema, breadcrumbSchema } from "@/lib/seo";

const OUR_STORY_TITLE =
  "FOUNDER is for women building something — and finding themselves along the way.";

const OUR_STORY_LEDE =
  "We make skincare. Three serums, sold under the name they’ve always had. The rest of what we do is about the women who buy it.";

/* The meta description is the headline plus one clause, rather than a second
   piece of copy that can drift away from it. */
const ABOUT_DESCRIPTION = `${OUR_STORY_TITLE} The LALALOCA Collection is where it started.`;

export const metadata: Metadata = {
  title: "Our Story",
  description: ABOUT_DESCRIPTION,
  alternates: { canonical: "/our-story" },
};

const BUILDING = [
  "A business",
  "A family",
  "A body of work",
  "A second chance",
  "A stronger boundary",
  "A creative life",
  "A future that feels like her own",
];

export default function OurStoryPage() {
  const founder = profiles[0];

  return (
    <>
      {/* The page an engine reads to answer "who is behind this brand" — typed
          as such, and pointed at the Organization node rather than repeating it. */}
      <JsonLd
        schema={[
          aboutPageSchema(ABOUT_DESCRIPTION),
          breadcrumbSchema([{ name: "Our Story", path: "/our-story" }]),
        ]}
      />
      {/* ---- The desk ----
          One photographed scene: the journal open on a green leather desk under
          a brass lamp, "I found her in the woman who refused to quit." written
          across the left page. The photograph carries its own cream field on
          the left, so the page text sits directly on it with no scrim.

          The mocked-in type was cleaned off that field — the live text below is
          the only text in the layout, so it translates, scales, reflows and is
          read aloud by a screen reader. The handwriting in the journal is part
          of the photograph and is described in the alt text instead. */}
      <div className="relative hidden lg:block">
        <div className="relative aspect-[2105/747] w-full">
          <Image
            src="/editorial/our-story-desk.webp"
            alt="An open journal on a green leather desk beside a brass lamp and a dark green fountain pen. Written across the left page in script: I found her in the woman who refused to quit."
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center">
            <div className="shell w-full">
              {/* max-w-md holds the headline to the five lines the photograph's
                  cream field was composed around. Wider and it runs into the
                  desk; narrower and it stacks too tall for the band. */}
              <div className="max-w-md">
                <p className="eyebrow text-bronze-ink">Our story</p>
                {/* Not the global .headline. That scales at 5.2vw, which is
                    tuned for a section that grows as tall as its text needs.
                    This band cannot: its height is fixed by the photograph's
                    aspect ratio, so at 1024px the type outgrew the cream field
                    and the last line of the lede sat on the desk. 3.4vw keeps
                    five lines inside the band at every width from the lg
                    breakpoint up, and still reaches the same 3.5rem ceiling. */}
                <h1 className="mt-5 text-balance font-serif text-[clamp(1.75rem,3.4vw,3.5rem)] leading-[1.05] text-charcoal">
                  {OUR_STORY_TITLE}
                </h1>
                <p className="lede mt-6 text-charcoal/80">{OUR_STORY_LEDE}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Small screens: the text on cream, then the journal on its own.
          Both breakpoints are in the DOM at once — CSS-hidden, not
          conditionally rendered — so this must render an h2. Two h1 elements on
          one page is an accessibility failure and an ambiguous outline for a
          crawler. The desktop block above owns the h1. */}
      <div className="lg:hidden">
        {/* On this breakpoint the desktop hero above is display:none, so this
            is the first thing under the dark header — same reasoning as the
            Found Her archive's hero, dark rather than the default cream. */}
        <PageIntro
          eyebrow="Our story"
          title={OUR_STORY_TITLE}
          lede={OUR_STORY_LEDE}
          headingLevel="h2"
          tone="dark"
        />
        <div className="bg-cream pb-2">
          <figure>
            <div className="relative aspect-[1255/747] w-full">
              <Image
                src="/editorial/our-story-journal.webp"
                alt="An open journal on a green leather desk beside a brass lamp and a dark green fountain pen. Written across the left page in script: I found her in the woman who refused to quit."
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="shell mt-3 text-xs uppercase tracking-[0.16em] text-charcoal/60">
              I found her in the woman who refused to quit
            </figcaption>
          </figure>
        </div>
      </div>

      {/* ---------------- Not only entrepreneurs ---------------- */}
      <section className="section bg-cream">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-16">
          <div>
            <h2 className="headline text-balance text-charcoal">
              Not every woman has a company.
            </h2>
            <p className="mt-4 font-serif text-2xl text-bronze-ink">
              Every woman is building something.
            </p>
          </div>
          <div className="max-w-[38rem]">
            <p className="text-[1.0625rem] leading-[1.8] text-charcoal/85">
              When we say founder, we don’t mean a business registration. We mean the
              woman who started the thing, kept it going, or began again after it fell
              over. Sometimes that’s a company. Usually it isn’t.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {BUILDING.map((item) => (
                <li
                  key={item}
                  className="border border-bronze/40 px-4 py-2 text-sm text-charcoal/85"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 leading-[1.8] text-charcoal/85">
              The other half of the name is the part people notice second. Founder.
              Found her. There’s usually a moment somewhere in the building where a
              woman looks up and recognizes who she’s become. We named the brand after
              that moment rather than after ourselves.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- The collection ----------------
          Was bg-charcoal/text-shell: a standalone dark card rather than the
          house's own night ground. Moved onto bg-night/text-cream so it
          reads as the same room as the header and the other dark sections,
          not a different dark. The buttons below were already primary/
          ghost-light, so this was the one piece of the section not yet on
          the current vocabulary. */}
      <section className="section bg-night text-cream">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-16">
          <div>
            <p className="eyebrow text-bronze">{BRAND.collectionFull}</p>
            <h2 className="subhead mt-4">Where it started, and what we sell.</h2>
          </div>
          <div className="max-w-[38rem]">
            <p className="leading-[1.8] text-cream/85">
              LALALOCA came first: three serums — Thirst Trap, C Me Glow and Bounce
              Back — in the bottles they’re still sold in today. FOUNDER is the name on
              the door now. LALALOCA is the collection inside, and the name on your
              receipt.
            </p>
            <p className="mt-5 leading-[1.8] text-cream/85">
              We didn’t reformulate anything to launch a new brand, and we haven’t
              redesigned a single bottle. The products are what they were. What changed
              is what we’re building around them.
            </p>
            <p className="mt-8 font-serif text-2xl leading-snug text-bronze">
              {BRAND.supporting}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="btn btn-primary">
                See the three serums
              </Link>
              <Link href="/found-her" className="btn btn-ghost-light">
                Read Found Her
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- The founder ----------------
          Kept on paper rather than a dark room: it's a portrait, a standfirst
          and a blockquote — reading, not a call to action — and texture-
          stone's blush/rose wash is built for a cream ground, the same
          pairing used everywhere else it appears. */}
      <section className="section texture-stone bg-cream">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-16">
          <div className="relative mx-auto aspect-[3/2] w-full max-w-md overflow-hidden bg-shell lg:mx-0 lg:max-w-none">
            <Image
              src={founder.portrait!.src}
              alt={founder.portrait!.alt}
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 90vw, 26rem"
              className="object-cover"
              style={{ objectPosition: founder.portrait!.position }}
            />
          </div>

          <div>
            <p className="eyebrow text-bronze-ink">The founder</p>
            <h2 className="headline mt-4 text-balance text-charcoal">{founder.name}</h2>
            <p className="mt-6 max-w-md text-[1.0625rem] leading-[1.8] text-charcoal/85">
              {founder.standfirst}
            </p>
            <blockquote className="mt-8 max-w-md border-l-2 border-bronze/50 pl-6">
              <p className="font-serif text-[clamp(1.5rem,3vw,2rem)] leading-snug text-charcoal">
                “I didn’t suddenly become her. I finally recognized the woman who had
                been fighting for me the entire time.”
              </p>
            </blockquote>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={`/found-her/${founder.slug}`} className="btn btn-dark">
                Read her story
              </Link>
              <Link href="/found-her#share" className="btn btn-outline">
                Tell us what you’re building
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
