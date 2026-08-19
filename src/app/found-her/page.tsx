import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/site/PageIntro";
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
  const [featured, second, ...otherProfiles] = profiles;
  const onWall = second ? [featured, second] : [featured];
  const ordinals = ["first", "second"];
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
      <PageIntro
        eyebrow={BRAND.editorial}
        title={BRAND.campaign}
        lede="Stories from women about what they started, survived, changed, finished, and finally gave themselves credit for."
      />

      {/* ---------------- Profiles ---------------- */}
      <section className="section bg-cream pt-4" aria-labelledby="profiles-heading">
        <div className="shell">
          <h2 id="profiles-heading" className="eyebrow text-charcoal/70">
            The profiles
          </h2>

          {profiles.length === 0 ? (
            <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_minmax(0,26rem)] lg:gap-16">
              <div>
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
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href="#share" className="btn btn-dark">
                    I found her when…
                  </Link>
                </div>
              </div>

              <div className="card-quiet p-7">
                <h3 className="eyebrow text-bronze-ink">What we ask</h3>
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
          ) : null}
        </div>

        {profiles.length > 0 && (
          <>
            {/* ---- The gallery wall ----
                One photographed room, two frames: the founder's portrait
                under its picture light, and Julie's framed collage hung
                beside it. Each half of the scene is its own click target —
                the invisible split falls in the wall space between the
                frames (64% on desktop, 57% on the tighter mobile crop) —
                and each woman gets her own placard beneath, the way museum
                labels sit under a group hang. Nothing readable is baked
                into the image — every word is live text. */}
            {second ? (
              <>
                {/* Desktop: the one photographed room, both frames the same
                    size on the same centre line. */}
                <div className="relative mt-8 hidden md:block">
                  <div className="relative aspect-[1779/884] w-full overflow-hidden">
                    <Image
                      src="/editorial/found-her-wall.webp"
                      alt="A gallery wall: Shelby Korpi’s portrait in a carved dark frame under a brass picture light, and beside it, hung at the same size, Julie Schoener’s framed watercolour collage in green and gold, on ivory panelling above a green wainscot, with a leather bench beneath."
                      fill
                      loading="lazy"
                      sizes="100vw"
                      className="object-cover"
                    />
                  </div>
                  <Link
                    href={`/found-her/${featured.slug}`}
                    aria-label={`Read ${featured.name}’s story`}
                    className="absolute inset-y-0 left-0 w-[64%] focus-visible:outline-offset-[-4px]"
                  />
                  <Link
                    href={`/found-her/${second.slug}`}
                    aria-label={`Read ${second.name}’s story`}
                    className="absolute inset-y-0 right-0 w-[36%] focus-visible:outline-offset-[-4px]"
                  />
                </div>

                {/* the placards — desktop only; on mobile each placard
                    travels with its own picture below */}
                <div className="shell mt-9 hidden md:block">
                  <div className="mx-auto grid max-w-3xl gap-10 text-center md:grid-cols-2">
                    {onWall.map((profile, i) => (
                      <Link
                        key={profile.slug}
                        href={`/found-her/${profile.slug}`}
                        className="group block"
                      >
                        {/* bottom-aligned so a two-line eyebrow (Julie's)
                            doesn't push her name below her neighbour's */}
                        <p className="eyebrow flex min-h-[2.6em] items-end justify-center text-bronze-ink">
                          <span>
                            The {ordinals[i]} profile · {profile.role}
                          </span>
                        </p>
                        <h3 className="mt-3 font-serif text-[clamp(1.75rem,3vw,2.5rem)] leading-none text-charcoal transition-colors group-hover:text-bronze-ink">
                          {profile.name}
                        </h3>
                        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-charcoal/80">
                          {profile.building}
                        </p>
                        <span className="link-underline mt-5 inline-block text-charcoal">
                          Read her story <span aria-hidden>↗</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Mobile: her picture above her name — one card per woman,
                    cropped identically from the same composited wall so the
                    frames stay the same size here too. */}
                <div className="mt-8 space-y-16 md:hidden">
                  {onWall.map((profile, i) => (
                    <Link
                      key={profile.slug}
                      href={`/found-her/${profile.slug}`}
                      className="group block"
                      aria-label={`Read ${profile.name}’s story`}
                    >
                      <div className="relative aspect-[510/655] w-full overflow-hidden">
                        <Image
                          src={
                            i === 0
                              ? "/editorial/found-her-frame-shelby-m.webp"
                              : "/editorial/found-her-frame-julie-m.webp"
                          }
                          alt={
                            i === 0
                              ? "Shelby Korpi’s portrait in a carved dark frame under a brass picture light, hung on an ivory gallery wall."
                              : "Julie Schoener’s framed watercolour collage in green and gold, hung on the same ivory gallery wall."
                          }
                          fill
                          loading="lazy"
                          sizes="100vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="shell mt-7 text-center">
                        <p className="eyebrow text-bronze-ink">
                          The {ordinals[i]} profile · {profile.role}
                        </p>
                        <h3 className="mt-3 font-serif text-[clamp(1.75rem,3vw,2.5rem)] leading-none text-charcoal">
                          {profile.name}
                        </h3>
                        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-charcoal/80">
                          {profile.building}
                        </p>
                        <span className="link-underline mt-5 inline-block text-charcoal">
                          Read her story <span aria-hidden>↗</span>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <Link
                href={`/found-her/${featured.slug}`}
                className="group mt-8 block focus-visible:outline-offset-4"
                aria-label={`Read ${featured.name}’s story`}
              >
                <div className="relative hidden aspect-[1779/884] w-full overflow-hidden md:block">
                  <Image
                    src="/editorial/founder-portrait-wall.webp"
                    alt="A gallery wall: Shelby Korpi’s portrait in a carved dark frame under a brass picture light, on ivory panelling above a green wainscot, with a leather bench beneath."
                    fill
                    loading="lazy"
                    sizes="100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                  />
                </div>
                <div className="relative aspect-[712/884] w-full overflow-hidden md:hidden">
                  <Image
                    src="/editorial/founder-portrait-wall-m.webp"
                    alt="Shelby Korpi’s portrait in a carved dark frame under a brass picture light, hung on a gallery wall above a leather bench."
                    fill
                    loading="lazy"
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>

                {/* the placard */}
                <div className="shell mt-9 text-center">
                  <p className="eyebrow text-bronze-ink">
                    The first profile · {featured.role}
                  </p>
                  <h3 className="mt-3 font-serif text-[clamp(2rem,4vw,3rem)] leading-none text-charcoal transition-colors group-hover:text-bronze-ink">
                    {featured.name}
                  </h3>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-charcoal/80">
                    {featured.building}
                  </p>
                  <span className="link-underline mt-5 inline-block text-charcoal">
                    Read her story <span aria-hidden>↗</span>
                  </span>
                </div>
              </Link>
            )}

            {otherProfiles.length > 0 && (
              <div className="shell">
                <ul className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                  {otherProfiles.map((profile) => (
                    <li key={profile.slug}>
                      <Link href={`/found-her/${profile.slug}`} className="group block">
                        {profile.portrait && (
                          <div
                            className="relative overflow-hidden bg-shell"
                            style={{ aspectRatio: profile.portrait.aspect ?? "4 / 5" }}
                          >
                            <Image
                              src={profile.portrait.src}
                              alt={profile.portrait.alt}
                              fill
                              loading="lazy"
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                              style={{
                                objectPosition: profile.portrait.position ?? "center",
                              }}
                            />
                          </div>
                        )}
                        <p className="eyebrow mt-5 text-bronze-ink">{profile.role}</p>
                        <h3 className="mt-2 font-serif text-[1.75rem] leading-none text-charcoal group-hover:text-bronze-ink">
                          {profile.name}
                        </h3>
                        <p className="mt-2 text-sm text-charcoal/80">{profile.building}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </section>

      {/* ---------------- The invitation ---------------- */}
      <section className="section bg-cream" aria-labelledby="invitation-heading">
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
            <p className="eyebrow text-bronze-ink">Your turn</p>
            <h2 id="invitation-heading" className="headline mt-4 max-w-[14ch] text-balance text-charcoal">
              Write yours.
            </h2>
            <p className="mt-6 max-w-md text-[1.0625rem] leading-[1.8] text-charcoal/85">
              This archive isn’t ours to fill. Tell us what you started, what it took,
              and the part you’ve never said out loud at a dinner party.
            </p>
            <p className="mt-5 max-w-md leading-[1.8] text-charcoal/80">
              As long or as short as you like — there’s no format and no word count. If
              you know the moment you found her, that’s the one we want.
            </p>
            <div className="mt-8">
              <Link href="#share" className="btn btn-dark">
                Write yours
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Share your story ----------------
          This was its own page at /share-your-story, with its own tab in the
          bar. It lives here now — the invitation above and the form it invites
          you to are one page, and the old URL 301s to this anchor so every
          link anyone ever shared still lands on the form. The dark "how we
          handle what you send us" band that used to sit between them is gone:
          the same four points arrive as the aside beside the form, and one
          page should not recite them twice. */}
      <section id="share" aria-labelledby="share-heading" className="scroll-mt-24">
        {/* ---- The gallery wall ----
            One photographed room: an ivory panelled wall over a Founder Green
            wainscot, the mirror hung in its green-and-gold frame under a brass
            picture light. On large screens the section text sits directly on
            the wall; the photograph was cleaned of its mocked-in type so the
            live, translated, screen-readable text is the only text. */}
        <div className="relative hidden lg:block">
          <div className="relative aspect-[1913/729] w-full">
            <Image
              src="/editorial/story-wall.webp"
              alt="A sunlit ivory panelled wall above a deep green wainscot. A mirror in an ornate green-and-gold frame hangs under a brass picture light; four women are reflected in it, writing on the glass in rose."
              fill
              loading="lazy"
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center">
              <div className="shell w-full">
                <div className="max-w-xl">
                  <p className="eyebrow text-charcoal/60">Share your story</p>
                  <h2 id="share-heading" className="headline mt-5 text-balance text-charcoal">
                    I found her when …
                  </h2>
                  <p className="lede mt-6 text-charcoal/80">{STORY_INTRO}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Small screens: the text on cream, then the framed mirror on its wall.
            Both breakpoints are in the DOM at once (CSS-hidden, not
            conditionally rendered), and the page's h1 is the archive's, so
            both render h2 here — the desktop block above carries the id. */}
        <div className="lg:hidden">
          <PageIntro
            eyebrow="Share your story"
            title="I found her when …"
            lede={STORY_INTRO}
            headingLevel="h2"
          />
          <div className="bg-cream px-0 pb-2">
            <figure>
              <div className="relative aspect-[833/729] w-full">
                <Image
                  src="/editorial/story-frame.webp"
                  alt="A mirror in an ornate green-and-gold frame under a brass picture light, on an ivory wall above a green wainscot. Four women are reflected in it, writing on the glass in rose."
                  fill
                  loading="lazy"
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="shell mt-3 text-xs uppercase tracking-[0.16em] text-charcoal/60">
                Found her in the mirror
              </figcaption>
            </figure>
          </div>
        </div>

        <div className="section bg-cream pt-4">
          <div className="shell grid gap-12 lg:grid-cols-[1fr_minmax(0,22rem)] lg:gap-16">
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
        </div>
      </section>

      <section className="section-tight texture-stone bg-cream py-14">
        <div className="shell max-w-xl">
          <h2 className="headline text-balance text-charcoal">
            New stories, as they’re published.
          </h2>
          <EmailSignup tone="light" source="found-her" />
        </div>
      </section>
    </>
  );
}
