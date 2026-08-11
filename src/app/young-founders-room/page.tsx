import type { Metadata } from "next";
import { JsonLd, breadcrumbSchema } from "@/lib/seo";
import { Threshold } from "@/components/young-founders/Threshold";
import { TrackedLink } from "@/components/young-founders/TrackedLink";
import { DocumentaryImage, assetExists } from "@/components/young-founders/DocumentaryImage";

/**
 * THE YOUNG FOUNDERS' ROOM.
 *
 * ── THE ONE NUMBER ──────────────────────────────────────────────────────────
 *
 * 20% of net profits. Every month. It appears four times on this page and it
 * is the same number in all four. An earlier draft of this commitment said
 * 10%; if that figure ever reappears here it is a regression, not an edit.
 *
 * ── WHAT IS DELIBERATELY NOT HERE ───────────────────────────────────────────
 *
 * No definition of "net profits" — the supplied wording is the approved
 * wording, and an accounting gloss added by a developer is a legal claim.
 * No impact statistics. No young person's name, circumstance or story beyond
 * what Shelby wrote. No stock photography standing in for people who are real.
 *
 * ── THE DOORS ───────────────────────────────────────────────────────────────
 *
 * Everything below renders on the server and is in the HTML. `Threshold` is a
 * decoration layered on top after hydration; it can fail, be skipped, be
 * turned off by a motion preference or never run at all, and the page is
 * unchanged. That is the only arrangement under which an entrance animation is
 * allowed to sit in front of a charity commitment.
 */

const TITLE = "The Young Founders’ Room";
const DESCRIPTION =
  "Meet the young collaborators who helped shape the first LALALOCA Collection and learn how 20% of its net profits supports StandUp for Kids Tucson each month.";

/** The Tucson chapter's own page. Supplied and verified — do not substitute. */
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

/* Where the approved photographs go. Named for what they show, so a missing
   one is obvious in a directory listing. See docs/YOUNG_FOUNDERS_ROOM.md. */
const PHOTO = {
  outreachTeam: "/editorial/young-founders/outreach-team.webp",
  shelbyVolunteer: "/editorial/young-founders/shelby-volunteer.webp",
  collaboration: "/editorial/young-founders/collaboration-table.webp",
  gala: "/editorial/young-founders/grit-and-gratitude-gala.webp",
} as const;

function Rule() {
  return <hr className="my-8 h-px w-16 border-0 bg-bronze" />;
}

function Eyebrow({ children }: { children: string }) {
  return <p className="eyebrow text-bronze-ink">{children}</p>;
}

export default function YoungFoundersRoomPage() {
  /* The approved photographs are not in the repository yet. Where one is
     missing its slot renders nothing, so the column it would have filled has to
     collapse too — otherwise the layout reserves half a screen of cream for an
     image that is not coming. Checked once here rather than guessed at in the
     class strings. */
  const has = {
    outreachTeam: assetExists(PHOTO.outreachTeam),
    shelbyVolunteer: assetExists(PHOTO.shelbyVolunteer),
    collaboration: assetExists(PHOTO.collaboration),
    gala: assetExists(PHOTO.gala),
  };
  const twoUp = (present: boolean, cols: string) => (present ? cols : "max-w-3xl");

  return (
    <>
      <JsonLd
        schema={[breadcrumbSchema([{ name: TITLE, path: "/young-founders-room" }])]}
      />

      <Threshold focusTargetId="young-founders-heading" />

      {/* ---- Hero: what the doors open onto ---- */}
      <section className="bg-cream">
        <div
          className={`shell grid gap-10 py-16 md:py-24 lg:items-center lg:gap-16 ${twoUp(has.outreachTeam, "lg:grid-cols-2")}`}
        >
          <div className="order-2 lg:order-1">
            <Eyebrow>A room built with young voices.</Eyebrow>
            <h1
              id="young-founders-heading"
              className="mt-5 font-serif text-4xl leading-[1.08] text-charcoal outline-none md:text-6xl"
            >
              THE YOUNG FOUNDERS’ ROOM
            </h1>
            <Rule />
            <div className="max-w-prose space-y-4 text-charcoal/85">
              <p>LALALOCA began with three serums.</p>
              <p>
                But part of the first collection was built somewhere far more important than a
                beauty office: inside the StandUp for Kids Tucson Outreach Center.
              </p>
              <p>
                Young people tried products, compared packaging, shared honest opinions, and helped
                make real decisions about what LALALOCA would become.
              </p>
              <p>
                From the very beginning, these young people helped shape the LALALOCA Collection.
              </p>
            </div>

            <p className="mt-8 font-serif text-2xl leading-snug text-rose md:text-3xl">
              20% of LALALOCA net profits.
              <br />
              Every month.
              <br />
              Directly to StandUp for Kids Tucson.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <TrackedLink href="/shop" event="young_founders_shop_click">
                Shop LALALOCA
              </TrackedLink>
              <TrackedLink
                href={STANDUP_TUCSON}
                event="young_founders_donate_click"
                external
                variant="secondary"
              >
                Give directly
              </TrackedLink>
            </div>
          </div>

          <div className="order-1 lg:order-2 empty:hidden">
            <DocumentaryImage
              src={PHOTO.outreachTeam}
              alt="Shelby with the StandUp for Kids Tucson outreach team outside the Outreach Center, in their volunteer shirts."
              ratio="4 / 3"
              focal="50% 35%"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
          </div>
        </div>
      </section>

      {/* ---- Shelby's note ---- */}
      <section className="bg-founder-green text-cream">
        <div
          className={`shell grid gap-10 py-16 md:py-24 lg:gap-16 ${twoUp(has.shelbyVolunteer, "lg:grid-cols-[1fr_0.85fr]")}`}
        >
          <div>
            <p className="eyebrow text-bronze">The Young Founders’ Room</p>
            <h2 className="mt-5 font-serif text-3xl leading-tight md:text-5xl">
              This began before the brand partnership.
            </h2>
            <p className="eyebrow mt-4 text-cream/70">A note from Shelby</p>
            <hr className="my-8 h-px w-16 border-0 bg-bronze" />

            <div className="max-w-prose space-y-4 text-cream/90">
              <p>For the past three years, I have volunteered with StandUp for Kids Tucson.</p>
              <p>
                Twice a week, our outreach team walked the streets looking for young people
                experiencing homelessness or instability. We brought practical resources, but the
                most important thing we carried was consistency.
              </p>
              <p>Trust is rarely built in one conversation.</p>
              <p>
                It comes from returning. Remembering a name. Following up. Listening without
                judgment. Becoming a person a young person recognizes—and eventually believes might
                still be there next week.
              </p>
              <p>
                At the Outreach Center, I spent time mentoring, listening, helping young people
                navigate difficult situations, and giving them a safe place to sit, talk, create, or
                simply be young for a while.
              </p>
              <p>
                I began volunteering because I believe every young person deserves to feel seen,
                valued, and capable of moving forward with hope and purpose.
              </p>
              <p>What I did not expect was how much they would change me.</p>
              <p>
                Their resilience changed the way I understand strength. Their honesty changed the
                way I listen. Their ideas changed the way I built LALALOCA.
              </p>
              <p>
                Being allowed into even a small part of their stories has profoundly changed my own.
              </p>
              <p className="eyebrow pt-2 text-bronze">— Shelby Korpi, Founder</p>
            </div>
          </div>

          <div className="lg:pt-24 empty:hidden">
            <DocumentaryImage
              src={PHOTO.shelbyVolunteer}
              alt="Shelby Korpi in a StandUp for Kids volunteer shirt outside the Tucson Outreach Center."
              ratio="3 / 4"
              focal="50% 30%"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
        </div>
      </section>

      {/* ---- They helped build LALALOCA ---- */}
      <section className="bg-shell">
        <div className="shell grid gap-10 py-16 md:py-24 lg:grid-cols-[0.9fr_1fr] lg:gap-16">
          <div>
            <Eyebrow>The Young Founders’ Room</Eyebrow>
            <h2 className="mt-5 font-serif text-3xl leading-tight text-charcoal md:text-5xl">
              They helped build LALALOCA.
            </h2>
            <Rule />
            <DocumentaryImage
              src={PHOTO.collaboration}
              alt="Serum samples and packaging options laid out on a table at the Outreach Center during a product feedback session."
              ratio="4 / 3"
              focal="50% 50%"
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="mt-2"
            />
          </div>

          <div className="max-w-prose space-y-4 text-charcoal/85">
            <p>
              There were samples on the table. Packaging options spread out in front of us.
              Questions about color, texture, names, and what felt exciting enough to pick up.
            </p>
            <p>
              I brought new products into the Outreach Center and asked the young people there to
              tell me the truth.
            </p>
            <p>They did.</p>
            <p>
              They tried products. They helped choose packaging. They shared ideas. They noticed
              things adults had overlooked. Their opinions shaped the first collection in real,
              visible ways.
            </p>
            <p>They were never treated like a charity project.</p>
            <p className="font-serif text-2xl text-charcoal">They were collaborators.</p>
            <p>
              For a young person who has spent too much time feeling overlooked, being asked, “What
              do you think?” can mean more than it appears to mean.
            </p>
            <p>It says:</p>

            {/* The three lines the section is really about. Desert Rose at full
                voice, which the board reserves for exactly this kind of moment. */}
            <div className="border-l border-bronze pl-5 font-serif text-xl leading-relaxed text-rose md:text-2xl">
              <p>Your ideas have value.</p>
              <p>Your voice can shape something real.</p>
              <p>There is a place for you on the team.</p>
            </div>

            <p>
              LALALOCA was built in creative partnership with young people from the StandUp for Kids
              Tucson Outreach Center.
            </p>
            <p>
              Their contribution is part of the collection’s history—and part of where it goes next.
            </p>
          </div>
        </div>
      </section>

      {/* ---- The gala ---- */}
      <section className="bg-cream">
        <div
          className={`shell grid gap-10 py-16 md:py-24 lg:items-center lg:gap-16 ${twoUp(has.gala, "lg:grid-cols-2")}`}
        >
          <div>
            <Eyebrow>The Young Founders’ Room</Eyebrow>
            <h2 className="mt-5 font-serif text-3xl leading-tight text-charcoal md:text-5xl">
              From street outreach to the gala.
            </h2>
            <Rule />
            <div className="max-w-prose space-y-4 text-charcoal/85">
              <p>Some nights were spent walking Tucson’s streets.</p>
              <p>Others were spent trying to fill a room.</p>
              <p>
                For the Grit &amp; Gratitude Gala, I helped host the event, pursue sponsorships,
                secure donations, and bring community members together in support of StandUp for
                Kids Tucson.
              </p>
              <p>A gala is one evening.</p>
              <p>
                The work it supports continues after the lights come down: outreach, mentorship,
                guidance, referrals, practical support, and a safe place for young people
                experiencing homelessness or at risk of it.
              </p>
              <p>
                The event taught me that meaningful change requires more than care. It requires
                people willing to turn that care into time, introductions, resources, and action.
              </p>
              <p>That is what we are asking LALALOCA to do now.</p>
            </div>
          </div>

          <DocumentaryImage
            src={PHOTO.gala}
            alt="The Grit and Gratitude Gala in support of StandUp for Kids Tucson."
            ratio="4 / 3"
            focal="50% 45%"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
      </section>

      {/* ---- What your purchase opens ---- */}
      <section className="bg-shell">
        <div className="shell py-16 md:py-24">
          <Eyebrow>The Young Founders’ Room</Eyebrow>
          <h2 className="mt-5 max-w-3xl font-serif text-3xl leading-tight text-charcoal md:text-5xl">
            What your purchase opens.
          </h2>
          <Rule />

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="max-w-prose space-y-4 text-charcoal/85">
              <p>One skincare purchase will not end youth homelessness.</p>
              <p>
                But it can become part of a consistent commitment to the people working directly
                with young people in Tucson.
              </p>
              <p>
                Every LALALOCA purchase helps grow the monthly profit pool from which FOUNDER
                donates 20% directly to StandUp for Kids Tucson.
              </p>
              <p>
                That contribution helps support an organization providing relationship-based street
                outreach, mentoring, guidance, referrals, and drop-in support.
              </p>
            </div>

            <div className="max-w-prose space-y-4 text-charcoal/85">
              <p className="font-serif text-2xl leading-snug text-charcoal md:text-3xl">
                You are not buying a young person’s story.
                <br />
                You are helping continue the relationship.
              </p>
              <div className="border-l border-bronze pl-5 text-charcoal/85">
                <p>The volunteer who returns.</p>
                <p>The mentor who listens.</p>
                <p>The Outreach Center door that opens.</p>
                <p>
                  The moment a young person is asked for an opinion—and realizes someone genuinely
                  wants to hear the answer.
                </p>
              </div>
              <p className="font-serif text-xl text-rose">
                Your bottle is not the story.
                <br />
                What it helps continue is.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- The commitment ---- */}
      <section className="bg-founder-green text-cream">
        <div className="shell py-16 md:py-24">
          <p className="eyebrow text-bronze">Our commitment</p>
          <h2 className="mt-5 max-w-4xl font-serif text-3xl leading-tight md:text-5xl">
            20% of net profits. Every month. Directly to Tucson.
          </h2>
          <hr className="my-8 h-px w-16 border-0 bg-bronze" />

          <div className="max-w-prose space-y-4 text-cream/90">
            <p>
              Each calendar month, FOUNDER will donate an amount equal to 20% of the net profits
              earned from sales of the LALALOCA Collection directly to StandUp for Kids Tucson.
            </p>
            <p>This is not a limited campaign or a one-time launch donation.</p>
            <p>
              It is part of the continuing purpose of the collection the young people helped create.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <TrackedLink href="/shop" event="young_founders_shop_click" variant="ghost">
              Shop the LALALOCA Collection
            </TrackedLink>
            <TrackedLink
              href={STANDUP_TUCSON}
              event="young_founders_learn_click"
              external
              variant="ghost"
            >
              Learn about StandUp for Kids Tucson
            </TrackedLink>
            <TrackedLink
              href={STANDUP_TUCSON}
              event="young_founders_donate_click"
              external
              variant="ghost"
            >
              Donate directly
            </TrackedLink>
          </div>
        </div>
      </section>

      {/* ---- Hold open their room ---- */}
      <section className="bg-cream">
        <div className="shell max-w-3xl py-16 text-center md:py-24">
          <h2 className="font-serif text-3xl leading-tight text-charcoal md:text-5xl">
            Hold open their room.
          </h2>
          <hr className="mx-auto my-8 h-px w-16 border-0 bg-bronze" />
          <div className="space-y-4 text-charcoal/85">
            <p>Some rooms are claimed.</p>
            <p>Some rooms are created.</p>
            <p>
              And some rooms matter because someone chose to hold the door open for the person
              coming next.
            </p>
            <p>
              LALALOCA started with young people who deserved to know that their ideas mattered.
              Every purchase helps us continue showing them that they do.
            </p>
          </div>
          <p className="mt-10 font-serif text-3xl leading-snug text-charcoal md:text-4xl">
            The room is yours.
            <br />
            <span className="text-rose">Hold the door.</span>
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <TrackedLink href="/shop" event="young_founders_shop_click">
              Shop LALALOCA
            </TrackedLink>
            <TrackedLink
              href={STANDUP_TUCSON}
              event="young_founders_donate_click"
              external
              variant="secondary"
            >
              Give directly
            </TrackedLink>
          </div>
        </div>
      </section>
    </>
  );
}
