import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RoomHero } from "@/components/house/RoomHero";
import { HouseShell } from "@/components/house/HouseShell";
import { EditorialRoomSection } from "@/components/house/EditorialRoomSection";
import { getRoom } from "@/lib/rooms";
import { EmailSignup } from "@/components/site/EmailSignup";
import { StoryForm } from "@/components/story/StoryForm";
import { BRAND } from "@/lib/brand";
import { PROFILE_QUESTIONS, STORY_INTRO, STORY_STANDARD } from "@/lib/content";
import { profiles } from "@/lib/profiles";
import { JsonLd, breadcrumbSchema, editorialListSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Found Her",
  description:
    "Stories from women about what they started, survived, changed, finished, and finally gave themselves credit for — and the place to tell yours.",
  alternates: {
    canonical: "/found-her",
    /* Advertises the feed in the document head, which is how aggregators,
       newsletter platforms and feed-reading crawlers find it without being
       told the URL. */
    types: { "application/rss+xml": "/feed/found-her.xml" },
  },
};

export default function FoundHerPage() {
  /* The first two profiles hang on the gallery wall itself; everyone after
     them joins the grid below. The wall is a composited photograph —
     found-her-wall.webp — so hanging the next frame means regenerating that
     image (and its mobile crop) and adjusting the click-overlay widths, not
     just adding data. */
  return (
    <>
      {/* Declares the archive as a list of real articles, so the section itself
          can accrue topical authority instead of each story fending for
          itself. Profiles only — they are the original reporting. */}
      <JsonLd
        schema={[
          editorialListSchema(
            profiles.map((profile) => ({
              title: `${profile.name} — ${profile.building}`,
              path: `/found-her/${profile.slug}`,
              description: profile.standfirst,
            })),
          ),
          breadcrumbSchema([{ name: BRAND.editorial, path: "/found-her" }]),
        ]}
      />
      {/* This is the first thing on the page after the (dark) header, so it
          opens in a dark room rather than defaulting to the intro's cream —
          a bright band right under a dark header is exactly the pale-island
          bug this pass exists to remove. The profiles section right below
          is the deliberate lit panel it hands off to. */}
      <HouseShell room={6}>
      <RoomHero
        room={getRoom(6)}
        height="min-h-[78svh]"
        priority
        title={BRAND.campaign}
        lede="Stories from women who built before anyone applauded."
      >
        <Link href="#profiles-heading" className="btn btn-primary">
          Read the stories
        </Link>
        <Link href="#share" className="hairline text-cream">
          Write yours
        </Link>
      </RoomHero>

      {/* ---------------- Profiles ---------------- */}
      {/* ---------------- The gallery: the profiles ----------------
          3 Sept 2026, to Shelby's mock-up: the desert-pink portrait hall is
          the hero above; the profiles are a dark band directly beneath it,
          split two-up with a rose diamond between. Each band is one link to
          her story — portrait, name, her line, "Read her story". Portraits
          are the profiles' own (Julie's is the painting made for her story,
          and her note still says so). One markup for every width. */}
      <section aria-labelledby="profiles-heading" className="house-marble">
        <h2 id="profiles-heading" className="sr-only">
          The profiles
        </h2>
        {profiles.length === 0 ? (
          <div className="shell py-16">
            <div className="paper-page max-w-3xl p-8 md:p-12">
              <p className="headline max-w-[16ch] text-balance text-charcoal">
                The first one hasn’t been published yet.
              </p>
              <p className="mt-6 max-w-xl text-[1.0625rem] leading-[1.8] text-charcoal/85">
                There’s nothing here because nobody has approved her story yet. We
                could have filled this page with names and quotes nobody said, and
                you’d probably never know. We’d know.
              </p>
              <p className="mt-5 max-w-xl leading-[1.8] text-charcoal/85">
                The first profile will be the founder’s, in her own words. After that
                it’s women who wrote in — one at a time, slowly, each of them reading
                the final text before it goes anywhere.
              </p>
              <div className="mt-8">
                <Link href="#share" className="btn btn-dark">
                  I found her when…
                </Link>
              </div>
              <h3 className="eyebrow mt-10 text-bronze-ink">What we ask</h3>
              <ul className="mt-5 space-y-3">
                {PROFILE_QUESTIONS.map((question) => (
                  <li
                    key={question}
                    className="border-b border-charcoal/10 pb-3 font-serif text-xl leading-snug text-charcoal last:border-0"
                  >
                    {question}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <ul role="list" className="grid md:grid-cols-2">
            {profiles.map((profile, i) => (
              <li
                key={profile.slug}
                className="relative border-t border-rose/20 md:border-t-0 md:border-l md:border-rose/20 md:first:border-l-0"
              >
                {/* The rose diamond that sits on the seam between the two, as
                    in the mock-up. Desktop only, on the left border of the
                    second card. */}
                {i > 0 && (
                  <span
                    aria-hidden
                    className="absolute left-0 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 text-rose md:block"
                  >
                    ◇
                  </span>
                )}
                <Link
                  href={`/found-her/${profile.slug}`}
                  aria-label={`Read ${profile.name}’s story`}
                  className="group flex min-h-[13rem] items-stretch focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-rose"
                >
                  {profile.portrait && (
                    <span className="relative block w-[38%] max-w-[13rem] shrink-0 overflow-hidden bg-night-deep">
                      <Image
                        src={profile.portrait.src}
                        alt={profile.portrait.alt}
                        fill
                        loading="lazy"
                        sizes="(max-width: 768px) 40vw, 13rem"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        style={{ objectPosition: profile.portrait.position ?? "center" }}
                      />
                      <span
                        aria-hidden
                        className="absolute inset-0 bg-[linear-gradient(90deg,transparent_60%,rgba(7,19,15,0.85))]"
                      />
                    </span>
                  )}
                  <span className="flex flex-1 items-center justify-between gap-4 px-6 py-6 md:px-8">
                    <span className="min-w-0">
                      <span className="block font-serif text-[clamp(1.75rem,3vw,2.5rem)] uppercase leading-none tracking-[0.02em] text-champagne transition-colors group-hover:text-rose">
                        {profile.name.split(" ")[0]}
                      </span>
                      <span className="mt-3 block text-sm leading-relaxed text-cream/75">
                        {profile.tagline ?? profile.building}
                      </span>
                      {profile.portrait?.note ? (
                        <span className="mt-2 block text-xs leading-relaxed text-cream/45">
                          {profile.portrait.note}
                        </span>
                      ) : null}
                    </span>
                    <span className="hidden shrink-0 items-center gap-2 text-[0.6875rem] uppercase tracking-[0.22em] text-cream/80 transition-colors group-hover:text-rose sm:flex">
                      Read her story
                      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      {/* ---------------- The invitation ----------------
          A call to action, not reading, so it is a dark room between the two
          lit panels either side of it — the profiles above, the share form
          below. The photograph already sits on its own near-black ground, so
          the room reads as one continuous surface with it rather than a
          cream field the photo's bg-ink used to interrupt. */}
      <EditorialRoomSection surface="marble" aria-labelledby="invitation-heading">
        <div className="shell grid items-center gap-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-16">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden bg-ink lg:mx-0 lg:max-w-none">
            <Image
              src="/editorial/the-room-is-yours.webp"
              alt="A sheet of paper in a vintage typewriter, typed with the words “The room is yours.”"
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 90vw, 26rem"
              className="object-cover"
            />
          </div>

          <div>
            <p className="eyebrow text-champagne">Your turn</p>
            <h2 id="invitation-heading" className="headline mt-4 max-w-[14ch] text-balance text-cream">
              Write yours.
            </h2>
            <p className="mt-6 max-w-md text-[1.0625rem] leading-[1.8] text-cream/85">
              This archive isn’t ours to fill. Tell us what you started, what it took,
              and the part you’ve never said out loud at a dinner party.
            </p>
            <p className="mt-5 max-w-md leading-[1.8] text-cream/80">
              As long or as short as you like — there’s no format and no word count. If
              you know the moment you found her, that’s the one we want.
            </p>
            <div className="mt-8">
              <Link href="#share" className="btn btn-primary">
                Write yours
              </Link>
            </div>
          </div>
        </div>
      </EditorialRoomSection>

      {/* ---------------- Share your story ----------------
          This was its own page at /share-your-story, with its own tab in the
          bar. It lives here now — the invitation above and the form it invites
          you to are one page, and the old URL 301s to this anchor so every
          link anyone ever shared still lands on the form. The dark "how we
          handle what you send us" band that used to sit between them is gone:
          the same four points arrive as the aside beside the form, and one
          page should not recite them twice. */}
      <section id="share" aria-labelledby="share-heading" className="scroll-mt-24">
        {/* ---- The writing desk ----
            The gallery hands off to a private desk: the typewriter frame the
            house already owns, the invitation as live text beside it, and
            the form itself on a page of paper lying on the marble below. One
            form, one heading, every width — the two-breakpoint intro and the
            separate phone figure are gone (3 Sept 2026). */}
        <EditorialRoomSection
          surface="scene"
          scene="/editorial/the-room-is-yours.webp"
          sceneAlt=""
          scenePosition="center 35%"
          tight
        >
          <div className="shell grid items-center gap-10 lg:grid-cols-[minmax(0,30rem)_1fr] lg:gap-16">
            <div>
              <p className="room-label">Your turn at the desk</p>
              <h2 id="share-heading" className="headline-house mt-5 text-balance text-cream">
                I found her when …
              </h2>
              <p className="mt-6 max-w-[40ch] text-[1.0625rem] leading-relaxed text-cream/80">
                {STORY_INTRO}
              </p>
            </div>
          </div>
        </EditorialRoomSection>
        <EditorialRoomSection surface="paper" ambient={false}>
          <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,22rem)] lg:gap-16">
            <StoryForm />

            <aside className="lg:pt-2">
              <h3 className="eyebrow text-charcoal/70">Before you write</h3>
              <ul className="mt-6 space-y-6 border-t border-charcoal/12 pt-6">
                {STORY_STANDARD.map((item) => (
                  <li key={item.title}>
                    <h4 className="font-serif text-xl leading-tight text-charcoal">
                      {item.title}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-charcoal/80">
                      {item.detail}
                    </p>
                  </li>
                ))}
              </ul>
              {/* This note used to say the form wasn't wired to anything. It is
                  now — so the note says what is still true instead, which is
                  that the form will admit a failure rather than fake a success.
                  Left in place deliberately: it is the sentence that makes the
                  thank-you screen worth believing. */}
              <p className="mt-8 border-l-2 border-bronze/50 py-1 pl-4 text-xs leading-relaxed text-charcoal/70">
                If anything goes wrong when you send this, we’ll tell you plainly
                rather than showing a thank-you screen over a message that went
                nowhere.
              </p>
            </aside>
          </div>
        </EditorialRoomSection>
      </section>

      {/* Kept on paper rather than pushed into a dark room: texture-stone's
          blush/rose wash is built to sit on cream (it's the same pairing
          PageIntro and Our Story's founder section use) and would barely
          register against night — and this is a quiet closing note, not the
          kind of call to action the dark rooms are for. */}
      <EditorialRoomSection surface="panel" tight>
        <div className="shell max-w-xl">
          <h2 className="headline text-balance text-cream">
            New stories, as they’re published.
          </h2>
          <EmailSignup tone="green" source="found-her" />
        </div>
      </EditorialRoomSection>
      </HouseShell>
    </>
  );
}
