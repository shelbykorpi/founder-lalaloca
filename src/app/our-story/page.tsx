import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RoomHero } from "@/components/house/RoomHero";
import { HouseShell } from "@/components/house/HouseShell";
import { EditorialRoomSection } from "@/components/house/EditorialRoomSection";
import { getRoom } from "@/lib/rooms";
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
      {/* ---- The study ----
          Room 05. One frame at every width — the desk, the journal, the brass
          lamp, her portrait, and the emerald doors at the back open onto the
          FOUND HER gallery. The type is live; nothing readable is in the
          photograph. */}
      <HouseShell room={5}>
      <RoomHero
        room={getRoom(5)}
        height="min-h-[78svh]"
        priority
        title="Every woman is building something."
        lede={OUR_STORY_TITLE}
      >
        <Link href="#story" className="btn btn-ghost-light">
          Read the story
        </Link>
      </RoomHero>

      {/* ---------------- Not only entrepreneurs ---------------- */}
      {/* THIS WAS PAPER AND SHOULD NOT HAVE BEEN. The rule is that long
          reading gets a lit panel; this is roughly two hundred words and a row
          of chips — a statement, not an essay — and on the cream ground it
          made two thirds of Our Story read as the old site with a dark header
          bolted on. The founder's own story below stays lit, and it is the
          only thing on the page that earns it. */}
      <EditorialRoomSection surface="paper" id="story" className="scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-16">
          <div>
            <p className="eyebrow text-rose-deep">Written down, so it counts.</p>
            <h2 className="headline mt-4 text-balance text-charcoal">
              Not every woman has a company.
            </h2>
            {/* Bronze Ink is the gold that carries on cream; on this ground
                it is 1.7:1. Champagne is its dark-room counterpart. */}
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
                  className="border border-bronze/50 px-4 py-2 text-sm text-charcoal/85"
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
      </EditorialRoomSection>

      {/* ---------------- The collection ----------------
          Was bg-charcoal/text-shell: a standalone dark card rather than the
          house's own night ground. Moved onto bg-night/text-cream so it
          reads as the same room as the header and the other dark sections,
          not a different dark. The buttons below were already primary/
          ghost-light, so this was the one piece of the section not yet on
          the current vocabulary. */}
      <EditorialRoomSection surface="panel">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-16">
          <div>
            <p className="eyebrow text-champagne">{BRAND.collectionFull}</p>
            <h2 className="subhead mt-4">Where it started, and what we sell.</h2>
          </div>
          <div className="max-w-[38rem]">
            <p className="font-serif text-2xl leading-snug text-cream">{OUR_STORY_LEDE}</p>
            <p className="mt-6 leading-[1.8] text-cream/85">
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
      </EditorialRoomSection>

      {/* ---------------- The founder ----------------
          Kept on paper rather than a dark room: it's a portrait, a standfirst
          and a blockquote — reading, not a call to action — and texture-
          stone's blush/rose wash is built for a cream ground, the same
          pairing used everywhere else it appears. */}
      <EditorialRoomSection surface="paper">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-16">
          <div className="relative mx-auto aspect-[3/2] w-full max-w-md overflow-hidden bg-shell shadow-[0_0_0_1px_var(--color-bronze),0_0_0_6px_var(--color-night-deep),0_0_0_7px_var(--color-bronze)] lg:mx-0 lg:max-w-none">
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
      </EditorialRoomSection>
      </HouseShell>
    </>
  );
}
