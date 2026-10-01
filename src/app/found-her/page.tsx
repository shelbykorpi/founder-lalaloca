import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HouseShell } from "@/components/house/HouseShell";
import { EmailSignup } from "@/components/site/EmailSignup";
import { StoryForm } from "@/components/story/StoryForm";
import { BRAND } from "@/lib/brand";
import { STORY_STANDARD } from "@/lib/content";
import { approvedProfiles } from "@/lib/profiles";
import { JsonLd, breadcrumbSchema, editorialListSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Found Her",
  description:
    "Stories from women about what they started, survived, changed, finished, and finally gave themselves credit for — and the place to tell yours.",
  alternates: {
    canonical: "/found-her",
    types: { "application/rss+xml": "/feed/found-her.xml" },
  },
};

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
              <p className="room-label">FOUND HER · The private room</p>
              <h1 className="mt-6 font-serif text-[clamp(4rem,10vw,8.5rem)] font-light leading-[0.82] tracking-[-0.045em] text-cream">
                You didn’t become her.
                <span className="block italic text-rose">You found her.</span>
              </h1>
              <p className="mt-8 max-w-[36rem] text-[clamp(1rem,1.5vw,1.25rem)] leading-[1.7] text-cream/78">
                Portraits of women building consequential things — in their own words,
                with their final approval, and without turning their lives into a slogan.
              </p>
              <div className="mt-9 flex flex-wrap gap-5">
                <Link href="#stories" className="btn btn-primary">
                  Enter the archive
                </Link>
                <Link href="#share" className="hairline text-cream">
                  Tell your story
                </Link>
              </div>
            </div>
          </div>
        </section>

        {featured ? (
          <section id="stories" className="bg-night-deep py-0" aria-labelledby="featured-story-heading">
            <Link
              href={`/found-her/${featured.slug}`}
              className="group grid min-h-[78svh] lg:grid-cols-[1.08fr_0.92fr]"
            >
              <div className="relative min-h-[58svh] overflow-hidden bg-night">
                {featured.portrait && (
                  <Image
                    src={featured.portrait.src}
                    alt={featured.portrait.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 54vw"
                    className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.02]"
                    style={{ objectPosition: featured.portrait.position ?? "center" }}
                  />
                )}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(6,17,14,0.28)_100%)]"
                />
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-[0.625rem] uppercase tracking-[0.24em] text-cream/70 md:bottom-8 md:left-8 md:right-8">
                  <span>FOUND HER / 001</span>
                  <span>FOUNDER Editorial</span>
                </div>
              </div>

              <div className="flex items-center border-l border-bronze/15 bg-[linear-gradient(180deg,#102821_0%,#0b1c18_100%)] px-6 py-14 md:px-10 lg:px-14">
                <div className="max-w-xl">
                  <p className="eyebrow text-champagne">The featured profile</p>
                  <h2
                    id="featured-story-heading"
                    className="mt-6 font-serif text-[clamp(3.5rem,7vw,7rem)] font-light uppercase leading-[0.84] tracking-[-0.04em] text-cream"
                  >
                    {featured.name}
                  </h2>
                  <p className="mt-6 max-w-[28ch] font-serif text-[clamp(1.4rem,2.3vw,2rem)] italic leading-snug text-rose">
                    {featured.tagline ?? featured.building}
                  </p>
                  <p className="mt-7 max-w-[42rem] text-[1rem] leading-[1.8] text-cream/74">
                    {featured.standfirst}
                  </p>
                  <div className="mt-10 flex items-center justify-between border-t border-bronze/20 pt-6">
                    <span className="text-[0.625rem] uppercase tracking-[0.2em] text-cream/45">
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
                  <p className="eyebrow text-champagne">The archive</p>
                  <h2 className="mt-4 font-serif text-[clamp(2.8rem,5.5vw,5rem)] font-light leading-none text-cream">
                    More women. More rooms.
                  </h2>
                </div>
                <p className="hidden max-w-sm text-right text-sm leading-relaxed text-cream/55 md:block">
                  Each profile is published only after the woman has approved the final text.
                </p>
              </div>

              <div className="grid gap-px bg-bronze/20 md:grid-cols-2">
                {rest.map((profile, index) => (
                  <Link
                    key={profile.slug}
                    href={`/found-her/${profile.slug}`}
                    className="group grid min-h-[34rem] grid-rows-[1fr_auto] bg-night-deep"
                  >
                    <div className="relative min-h-[26rem] overflow-hidden">
                      {profile.portrait && (
                        <Image
                          src={profile.portrait.src}
                          alt={profile.portrait.alt}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.025]"
                          style={{ objectPosition: profile.portrait.position ?? "center" }}
                        />
                      )}
                      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(7,19,15,0.35)_100%)]" />
                      <span className="absolute left-5 top-5 text-[0.58rem] uppercase tracking-[0.22em] text-cream/72">
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
              <p className="eyebrow text-champagne">FOUND HER manifesto</p>
              <h2 className="mt-5 max-w-[10ch] font-serif text-[clamp(3rem,6vw,5.5rem)] font-light leading-[0.92] text-cream">
                Recognize her, then invite her in.
              </h2>
            </div>
            <div className="max-w-[46rem] lg:pt-3">
              <p className="font-serif text-[clamp(1.5rem,2.8vw,2.4rem)] leading-[1.25] text-cream/95">
                FOUND HER is not a community page bolted onto commerce. It is the room where the women become the subject.
              </p>
              <p className="mt-7 text-[1rem] leading-[1.85] text-cream/72">
                The work comes first: what she built, what it took, what changed, and the version of herself she finally recognized. Beauty sits around that work — never in place of it.
              </p>
              <p className="mt-5 text-[1rem] leading-[1.85] text-cream/72">
                No audition. No invented quotes. No publication without explicit final approval.
              </p>
            </div>
          </div>
        </section>

        <section id="share" className="scroll-mt-24 bg-night-deep py-20 md:py-28" aria-labelledby="share-heading">
          <div className="shell grid gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="eyebrow text-champagne">The invitation</p>
              <h2 id="share-heading" className="mt-5 max-w-[9ch] font-serif text-[clamp(3.4rem,7vw,6.5rem)] font-light leading-[0.9] text-cream">
                Your story belongs here.
              </h2>
              <p className="mt-7 max-w-md text-[1rem] leading-[1.8] text-cream/72">
                Tell us what you started, survived, changed, finished, or finally gave yourself credit for.
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
              <p className="eyebrow text-bronze-ink">Write it down</p>
              <p className="mt-4 max-w-2xl font-serif text-[clamp(1.8rem,3vw,2.6rem)] leading-snug text-charcoal">
                As long or as short as it needs to be. If there is one moment you found her, start there.
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
                <p className="eyebrow text-champagne">The next profile</p>
                <h2 className="mt-4 max-w-[12ch] font-serif text-[clamp(2.7rem,5vw,4.8rem)] font-light leading-none text-cream">
                  New stories, as they’re approved.
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
