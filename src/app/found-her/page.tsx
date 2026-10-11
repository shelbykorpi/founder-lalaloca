import type { Metadata } from "next";
import { withShare } from "@/lib/shareMeta";
import Image from "next/image";
import Link from "next/link";
import { HouseShell } from "@/components/house/HouseShell";
import { FramedPortrait } from "@/components/found-her/FramedPortrait";
import { EmailSignup } from "@/components/site/EmailSignup";
import { StoryForm } from "@/components/story/StoryForm";
import { BRAND } from "@/lib/brand";
import { STORY_STANDARD } from "@/lib/content";
import { approvedProfiles } from "@/lib/profiles";
import { JsonLd, breadcrumbSchema, editorialListSchema } from "@/lib/seo";

export const metadata: Metadata = withShare({
  title: "Found Her",
  description:
    "FOUND HER is FOUNDER's community of real women telling their own stories: what they built, what it took, and who they became. Share yours, and be considered as a face of FOUNDER.",
  alternates: {
    canonical: "/found-her",
    types: { "application/rss+xml": "/feed/found-her.xml" },
  },
}, "/found-her");

/** "The women of FOUNDER", Shelby's words, verbatim (1 Oct 2026). */
const WOMEN_OF_FOUNDER = {
  who: [
    "The woman who started over.",
    "Who built something from nothing.",
    "Who was underestimated and kept going.",
    "Who lost herself and found her way back.",
    "Who survived the chapter she thought would break her.",
    "Who chose herself.",
    "Who began again.",
  ],
  stories: ["The wins.", "The failures.", "The risks.", "The rebuilds.", "The moments that changed everything."],
  you: ["Your story.", "What you built.", "What you survived.", "What you are still becoming."],
};

/** How FOUND HER works (clarity brief, Phase 5). Each line matches what the
    story form, the privacy policy and the confirmation email already say. */
const HOW_IT_WORKS = [
  {
    title: "What FOUND HER is",
    body: "FOUNDER’s storytelling community: real women, in their own words, on what they built, survived, changed and became.",
  },
  {
    title: "Who can take part",
    body: "Any woman with a story. You don’t need a company, a title or a big win, and you never need to buy anything.",
  },
  {
    title: "Why women are featured",
    body: "Because the woman behind the beauty is the point. We look for stories that are honest, specific and yours, not polished.",
  },
  {
    title: "How to share",
    body: "Answer the questions in the form below. Only the first two are required; the rest are there if you want them.",
  },
  {
    title: "Features and the faces of FOUNDER",
    body: "Some women are invited into editorial features, product photography or future collections. It is selective, never guaranteed, and only with your separate written permission. Tick the third box on the form to be considered.",
  },
  {
    title: "What happens next",
    body: "A person reads every story and you get an email saying it arrived. If we’d like to publish, you see the final text first, and nothing goes live until you approve it.",
  },
];

export default function FoundHerPage() {
  const [featured, ...rest] = approvedProfiles;

  return (
    <>
      <JsonLd
        schema={[
          editorialListSchema(
            approvedProfiles.map((profile) => ({
              title: `${profile.name} — ${profile.building}`,
              path: `/found-her/${profile.slug}`,
              description: profile.standfirst,
            })),
          ),
          breadcrumbSchema([{ name: BRAND.editorial, path: "/found-her" }]),
        ]}
      />

      <HouseShell room={6}>
        <section className="relative isolate min-h-[82svh] overflow-hidden bg-night-deep">
          <Image
            src="/editorial/rooms/found-her-hall-sky.webp"
            alt="The FOUND HER gallery: portraits along a dark marble hall, a door at the end open onto a pink desert sky."
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,17,14,0.96)_0%,rgba(6,17,14,0.88)_32%,rgba(6,17,14,0.56)_58%,rgba(6,17,14,0.15)_100%)]"
          />
          <div className="shell relative flex min-h-[82svh] items-end pb-16 pt-28 md:items-center md:py-24">
            <div className="max-w-[46rem]">
              {/* The opening from the clarity brief (11 Oct 2026): it says what
                  FOUND HER is and that its women are the faces of FOUNDER,
                  where "She was there all along." left that to be guessed. */}
              <p className="room-label">FOUND HER · The FOUNDER community</p>
              <h1 className="mt-6 max-w-[16ch] font-serif text-[clamp(2.7rem,6.4vw,5.4rem)] font-light leading-[0.94] tracking-[-0.03em] text-cream">
                Real women. Real stories.
                <span className="block italic text-rose">The faces of FOUNDER.</span>
              </h1>
              <p className="mt-7 max-w-[36rem] text-[clamp(1rem,1.5vw,1.2rem)] leading-[1.7] text-cream/82">
                FOUND HER celebrates the women behind the work, the wins, the reinventions, and the
                moments that changed everything.
              </p>
              <p className="mt-3 max-w-[36rem] font-serif text-[1.3rem] italic leading-snug text-blush">
                Their stories deserve more than a caption. They deserve to be seen.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
                <Link href="#stories" className="btn btn-primary w-full sm:w-auto">
                  Read the stories
                </Link>
                <Link href="#share" className="btn btn-ghost-light w-full sm:w-auto">
                  Share your story
                </Link>
                <Link href="#how-it-works" className="hairline self-start text-cream sm:self-auto">
                  How it works
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* THE WOMEN OF FOUNDER (Shelby, 1 Oct 2026: "add this message to the
            top of the main page … revise format as necessary"). Her words,
            verbatim and in her order; only the layout is ours. Cream ground so
            it reads as a letter between the dark hero and the dark featured
            portrait. On desktop the title and opening stay in view beside the
            longer column. */}
        <section className="bg-cream py-20 text-charcoal md:py-28" aria-labelledby="women-heading">
          <div className="shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-20">
            <div className="lg:sticky lg:top-36 lg:self-start">
              <span aria-hidden className="block h-px w-10 bg-rose" />
              <h2
                id="women-heading"
                className="mt-5 max-w-[9ch] font-serif text-[clamp(3rem,6vw,5.5rem)] font-light leading-[0.92] tracking-[-0.02em] text-night"
              >
                The women of FOUNDER
              </h2>
              <p className="mt-8 max-w-[24rem] text-[1.05rem] leading-[1.7] text-charcoal/80">
                The women you see here do not represent perfection.
              </p>
              <p className="mt-3 font-serif text-[clamp(2rem,3.6vw,3rem)] italic leading-[1.05] text-night">
                They represent becoming.
              </p>
            </div>

            <div className="max-w-[40rem] space-y-8 text-[1.02rem] leading-[1.75] text-charcoal/80 lg:pt-3">
              <p className="space-y-2">
                {WOMEN_OF_FOUNDER.who.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </p>
              <div>
                <p className="font-serif text-[clamp(1.6rem,2.8vw,2.3rem)] leading-[1.2] text-night">
                  These are the women of FOUNDER.
                </p>
                <p className="mt-3 space-y-1">
                  <span className="block">Not because their stories are perfect.</span>
                  <span className="block font-serif text-[1.4rem] italic text-night">Because they are real.</span>
                </p>
              </div>
              <div>
                <p>FOUND HER exists to share those stories.</p>
                <p className="mt-3 space-y-1 font-serif text-[clamp(1.25rem,2.2vw,1.6rem)] italic leading-[1.45] text-night">
                  {WOMEN_OF_FOUNDER.stories.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </p>
              </div>
              <p className="border-l border-bronze pl-5 font-serif text-[clamp(1.35rem,2.4vw,1.8rem)] italic leading-[1.4] text-night">
                Because sometimes another woman’s story is exactly what you need to keep going.
              </p>
              <div>
                <p>
                  And as this community grows, the women representing FOUNDER will come from this
                  community.
                </p>
                <p className="mt-3 font-serif text-[clamp(1.6rem,2.8vw,2.3rem)] leading-[1.2] text-night">
                  From you.
                </p>
                <p className="mt-3 space-y-1">
                  {WOMEN_OF_FOUNDER.you.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </p>
              </div>
              <div>
                <p>Because FOUNDER was never meant to show women what they should look like.</p>
                <p className="mt-3 font-serif text-[clamp(1.6rem,2.8vw,2.3rem)] leading-[1.2] text-night">
                  It was built to show the world what women are capable of.
                </p>
              </div>
              <div className="border-t border-charcoal/12 pt-10">
                <p className="font-serif text-[clamp(2rem,4.4vw,3.4rem)] font-light leading-[1.05] text-night">
                  And maybe the next woman someone needs to see—
                  <span className="block italic text-bronze-ink">is you.</span>
                </p>
                <Link href="#share" className="btn btn-dark mt-10">
                  Tell your story
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* HOW FOUND HER WORKS (clarity brief, 11 Oct 2026, Phase 5): the six
            things a woman needs to know before she writes. Every promise here
            is one the form and its confirmation email already make. */}
        <section id="how-it-works" className="scroll-mt-24 border-y border-bronze/15 bg-night py-16 md:py-24" aria-labelledby="how-heading">
          <div className="shell">
            <p className="room-label">How FOUND HER works</p>
            <h2 id="how-heading" className="mt-4 max-w-[18ch] font-serif text-[clamp(2rem,4.4vw,3.4rem)] font-light leading-[1] text-cream">
              Your story, your words, your say.
            </h2>
            <ol className="mt-10 grid gap-px overflow-hidden border border-bronze/15 bg-bronze/15 sm:grid-cols-2 lg:grid-cols-3">
              {HOW_IT_WORKS.map((step, i) => (
                <li key={step.title} className="bg-night px-6 py-7">
                  <span className="text-[0.625rem] uppercase tracking-[0.22em] text-champagne/80">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-serif text-[1.45rem] leading-tight text-cream">{step.title}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-cream/75">{step.body}</p>
                </li>
              ))}
            </ol>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <Link href="#share" className="btn btn-primary w-full sm:w-auto">
                Share your story
              </Link>
              <p className="text-[0.8125rem] text-cream/60">No purchase, ever. Only two questions are required.</p>
            </div>
          </div>
        </section>

        {featured ? (
          <section id="stories" className="bg-night-deep py-0" aria-labelledby="featured-story-heading">
            <Link
              href={`/found-her/${featured.slug}`}
              className="group grid min-h-[78svh] lg:grid-cols-[1.08fr_0.92fr]"
            >
              {/* HER PORTRAIT, HUNG. The wall is the page's own dark green,
                  the light falls from above the frame the way a picture light
                  does, and the frame carries a real shadow so it sits off the
                  wall rather than printed on it. */}
              <div className="relative flex min-h-[58svh] items-center justify-center overflow-hidden bg-[#0c1f1a] px-10 py-16 md:px-14 md:py-20">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-[70%] bg-[radial-gradient(58%_84%_at_50%_-6%,rgba(255,228,176,0.24)_0%,rgba(255,228,176,0.07)_46%,transparent_74%)]"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_52%,rgba(4,12,10,0.6)_100%)]"
                />
                {featured.portrait && (
                  <FramedPortrait
                    src={featured.portrait.src}
                    alt={featured.portrait.alt}
                    position={featured.portrait.position}
                    name={featured.name}
                    role={featured.role}
                    priority
                    sizes="(max-width: 1024px) 78vw, 30vw"
                    className="relative z-10 max-w-[23rem] drop-shadow-[0_30px_64px_rgba(0,0,0,0.6)] md:max-w-[26rem]"
                  />
                )}
                <div className="absolute bottom-5 left-5 right-5 z-10 flex items-center justify-between text-[0.625rem] uppercase tracking-[0.24em] text-cream/70 md:bottom-8 md:left-8 md:right-8">
                  <span>FOUNDER Editorial</span>
                  <span>In her own words</span>
                </div>
              </div>

              <div className="flex items-center border-l border-bronze/15 bg-[linear-gradient(180deg,#102821_0%,#0b1c18_100%)] px-6 py-14 md:px-10 lg:px-14">
                <div className="max-w-xl">
                  <p className="eyebrow text-champagne">FOUND HER / 001</p>
                  <h2
                    id="featured-story-heading"
                    className="mt-6 font-serif text-[clamp(3.5rem,7vw,7rem)] font-light uppercase leading-[0.84] tracking-[-0.04em] text-cream"
                  >
                    {featured.name}
                  </h2>
                  {featured.cardIntro?.headline ? (
                    <p className="mt-6 max-w-[30ch] font-serif text-[clamp(1.45rem,2.3vw,2.05rem)] leading-[1.22] text-rose">
                      {featured.cardIntro.headline.map((line) => (
                        <span key={line} className="block italic">
                          {line}
                        </span>
                      ))}
                    </p>
                  ) : (
                    <p className="mt-6 max-w-[28ch] font-serif text-[clamp(1.4rem,2.3vw,2rem)] italic leading-snug text-rose">
                      {featured.tagline ?? featured.building}
                    </p>
                  )}
                  {featured.cardIntro ? (
                    <div className="mt-7 max-w-[42rem] space-y-4 text-[0.98rem] leading-[1.7] text-cream/78">
                      {featured.cardIntro.stanzas.map((stanza, i) => (
                        <p key={i}>
                          {/* Her opening line ends on a dash and runs on, so
                              the first stanza flows as one sentence rather
                              than leaving "entering—" alone on a line. */}
                          {i === 0
                            ? stanza.join("")
                            : stanza.map((line) => (
                                <span key={line} className="block">
                                  {line}
                                </span>
                              ))}
                        </p>
                      ))}
                      <p className="pt-1 font-serif text-[clamp(1.25rem,2vw,1.6rem)] font-semibold leading-snug text-cream">
                        {featured.cardIntro.belief}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-7 max-w-[42rem] text-[1rem] leading-[1.8] text-cream/74">
                      {featured.standfirst}
                    </p>
                  )}
                  {/* Said plainly wherever a composed artwork stands in for
                      a photograph of her. Restored 1 Oct 2026 — the field
                      existed and rendered nowhere, so the artwork was reading
                      as her own photograph. */}
                  {featured.portrait?.note && (
                    <p className="mt-8 max-w-[44ch] text-[0.6875rem] leading-relaxed text-cream/65">
                      {featured.portrait.note}
                    </p>
                  )}
                  <div className="mt-10 flex items-center justify-between border-t border-bronze/20 pt-6">
                    <span className="text-[0.625rem] uppercase tracking-[0.2em] text-cream/65">
                      {featured.role}
                    </span>
                    <span className="hairline text-cream">Read her story →</span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        ) : (
          <section id="stories" className="house-marble py-20">
            <div className="shell max-w-3xl">
              <p className="eyebrow text-champagne">The archive</p>
              <h2 className="headline-house mt-5 text-cream">The first approved profile is still being written.</h2>
            </div>
          </section>
        )}

        {rest.length > 0 && (
          <section className="house-marble border-t border-bronze/15 py-20 md:py-28" aria-label="More FOUND HER stories">
            <div className="shell">
              <div className="mb-10 flex items-end justify-between gap-6">
                <div>
                  <p className="eyebrow text-champagne">Inside FOUND HER</p>
                  <h2 className="mt-4 font-serif text-[clamp(2.8rem,5.5vw,5rem)] font-light leading-none text-cream">
                    More stories worth knowing.
                  </h2>
                </div>
                <p className="hidden max-w-sm text-right text-sm leading-relaxed text-cream/55 md:block">
                  Real stories. Their words. Their names on every line.
                </p>
              </div>

              <div className="grid gap-px bg-bronze/20 md:grid-cols-2">
                {rest.map((profile, index) => (
                  <Link
                    key={profile.slug}
                    href={`/found-her/${profile.slug}`}
                    className="group grid min-h-[34rem] grid-rows-[1fr_auto] bg-night-deep"
                  >
                    {/* The same wall, further down the hall. */}
                    <div className="relative flex min-h-[26rem] items-center justify-center overflow-hidden bg-[#0c1f1a] px-8 py-12">
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 top-0 h-[70%] bg-[radial-gradient(58%_84%_at_50%_-6%,rgba(255,228,176,0.2)_0%,rgba(255,228,176,0.06)_46%,transparent_74%)]"
                      />
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_52%,rgba(4,12,10,0.55)_100%)]"
                      />
                      {profile.portrait &&
                        (profile.portrait.preframed ? (
                          /* Already framed artwork — hung as it is, never a
                             frame inside a frame. */
                          <div
                            className="relative z-10 w-full max-w-[19rem]"
                            style={{ aspectRatio: profile.portrait.aspect ?? "3 / 4" }}
                          >
                            <Image
                              src={profile.portrait.src}
                              alt={profile.portrait.alt}
                              fill
                              sizes="(max-width: 768px) 70vw, 22vw"
                              className="object-contain drop-shadow-[0_26px_56px_rgba(0,0,0,0.6)] transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02]"
                            />
                          </div>
                        ) : (
                          <FramedPortrait
                            src={profile.portrait.src}
                            alt={profile.portrait.alt}
                            position={profile.portrait.position}
                            name={profile.name}
                            role={profile.role}
                            sizes="(max-width: 768px) 70vw, 24vw"
                            className="relative z-10 max-w-[19rem] drop-shadow-[0_26px_56px_rgba(0,0,0,0.6)]"
                          />
                        ))}
                      <span className="absolute left-5 top-5 z-10 text-[0.58rem] uppercase tracking-[0.22em] text-cream/72">
                        FOUND HER / {String(index + 2).padStart(3, "0")}
                      </span>
                    </div>
                    <div className="border-t border-bronze/15 px-6 py-7">
                      <h3 className="font-serif text-[clamp(2rem,3.8vw,3.5rem)] font-light uppercase leading-none text-cream">
                        {profile.name}
                      </h3>
                      <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-cream/65">
                        {profile.tagline ?? profile.building}
                      </p>
                      {profile.portrait?.note && (
                        <p className="mt-5 max-w-[46ch] text-[0.6875rem] leading-relaxed text-cream/65">
                          {profile.portrait.note}
                        </p>
                      )}
                      <p className="mt-6 text-[0.625rem] uppercase tracking-[0.2em] text-champagne">
                        Read her story →
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="border-y border-bronze/15 bg-founder-green py-20 md:py-28">
          <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-20">
            <div>
              <p className="eyebrow text-champagne">What FOUND HER is</p>
              <h2 className="mt-5 max-w-[10ch] font-serif text-[clamp(3rem,6vw,5.5rem)] font-light leading-[0.92] text-cream">
                The part of the story people usually leave out.
              </h2>
            </div>
            <div className="max-w-[46rem] lg:pt-3">
              <p className="font-serif text-[clamp(1.5rem,2.8vw,2.4rem)] leading-[1.25] text-cream/95">
                FOUND HER is about the woman before the title, behind the work, and after the moment that changed everything.
              </p>
              <p className="mt-7 text-[1rem] leading-[1.85] text-cream/72">
                Not polished biographies. Not perfect endings. Just the truth about what it took, what it cost, what she kept going through, and who she became on the other side.
              </p>
              <p className="mt-5 text-[1rem] leading-[1.85] text-cream/72">
                No audition. No performance. No need to make the story prettier than it was.
              </p>
            </div>
          </div>
        </section>

        <section id="share" className="scroll-mt-24 bg-night-deep py-20 md:py-28" aria-labelledby="share-heading">
          <div className="shell grid gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="eyebrow text-champagne">Your turn</p>
              <h2 id="share-heading" className="mt-5 max-w-[9ch] font-serif text-[clamp(3.4rem,7vw,6.5rem)] font-light leading-[0.9] text-cream">
                When did you find her?
              </h2>
              <p className="mt-7 max-w-md text-[1rem] leading-[1.8] text-cream/72">
                Tell us about the version of you that kept going before anyone else knew her name.
              </p>
              <div className="mt-10 space-y-5 border-t border-bronze/20 pt-7">
                {STORY_STANDARD.slice(0, 3).map((item) => (
                  <div key={item.title}>
                    <h3 className="font-serif text-xl text-cream">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-cream/58">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-cream p-6 text-charcoal shadow-[0_35px_90px_rgba(0,0,0,0.35)] md:p-10 lg:p-12">
              <p className="eyebrow text-bronze-ink">Start where it changed</p>
              <p className="mt-3 text-[0.8125rem] leading-relaxed text-charcoal/80">
                Only the first two questions are required · No purchase needed · You approve every
                word before anything is published
              </p>
              <p className="mt-4 max-w-2xl font-serif text-[clamp(1.8rem,3vw,2.6rem)] leading-snug text-charcoal">
                You do not need the polished version. Start with the moment that still feels true.
              </p>
              <div className="mt-10">
                <StoryForm />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-night-deep pb-24 pt-4">
          <div className="shell border-t border-bronze/20 pt-12">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="eyebrow text-champagne">Stay in the room</p>
                <h2 className="mt-4 max-w-[12ch] font-serif text-[clamp(2.7rem,5vw,4.8rem)] font-light leading-none text-cream">
                  The next story is already being written.
                </h2>
              </div>
              <div className="w-full max-w-md">
                <EmailSignup tone="green" source="found-her" />
              </div>
            </div>
          </div>
        </section>
      </HouseShell>
    </>
  );
}
