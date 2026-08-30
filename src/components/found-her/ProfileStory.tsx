import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { isApproved, type FoundHerProfile } from "@/lib/profiles";

/** The published-profile template: her portrait, then her answers, in her words. */
export function ProfileStory({ profile }: { profile: FoundHerProfile }) {
  return (
    <>
      {/* The masthead is the page's hero, not its reading — a portrait, her
          name, one line of standfirst. It opens in the same dark room as the
          header above it; the interview itself, below, is what moves onto
          paper. */}
      <header className="room-dark">
        <div className="shell pb-10 pt-8 md:pt-12">
          <nav aria-label="Breadcrumb" className="mb-6">
            <Link
              href="/found-her"
              className="inline-flex min-h-11 items-center text-[0.6875rem] uppercase tracking-[0.16em] text-cream/70 hover:text-cream"
            >
              ← {BRAND.editorial}
            </Link>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,30rem)_1fr] lg:gap-16">
            {profile.portrait && (
              <div
                className="relative w-full overflow-hidden bg-night-deep"
                /* Framed artwork declares its own ratio so the frame is never
                   cropped; photographs fall back to the slot's 3:2. */
                style={{ aspectRatio: profile.portrait.aspect ?? "3 / 2" }}
              >
                <Image
                  src={profile.portrait.src}
                  alt={profile.portrait.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 30rem"
                  className="object-cover"
                  style={{ objectPosition: profile.portrait.position ?? "center" }}
                />
              </div>
            )}

            <div className="lg:pt-6">
              <p className="eyebrow text-champagne">
                {profile.role}
                {profile.location ? ` · ${profile.location}` : ""}
              </p>
              <h1 className="headline mt-4 text-balance text-cream">{profile.name}</h1>
              <p className="mt-6 max-w-md font-serif text-2xl leading-snug text-cream/90">
                {profile.standfirst}
              </p>
              {/* The approval sentence is a promise, so it only renders
                  once it's true. A story published ahead of her sign-off
                  says just the part that is already true. */}
              <p className="mt-8 max-w-md text-sm leading-relaxed text-cream/70">
                {isApproved(profile)
                  ? "Told in her own words, and published after she read and approved the final text."
                  : "Told in her own words."}
              </p>
            </div>
          </div>
        </div>
      </header>

      <article className="bg-cream pb-4">
        {profile.answers.map((answer, index) => (
          <section
            key={answer.question}
            className={index % 2 === 1 ? "bg-shell py-14 md:py-16" : "py-14 md:py-16"}
          >
            <div className="shell grid gap-8 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
              <h2 className="subhead text-charcoal lg:sticky lg:top-32 lg:self-start">
                {answer.question}
              </h2>
              <div className="max-w-[38rem]">
                {answer.body.map((paragraph, i) => (
                  <p
                    key={paragraph.slice(0, 28)}
                    className={`text-pretty text-[1.0625rem] leading-[1.85] text-charcoal/85 ${
                      i === 0 ? "" : "mt-5"
                    }`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </section>
        ))}
      </article>

      {/* The pull quote is a section break, not reading — its own room,
          one shade deeper than the masthead's, so it reads as a pause
          between the interview and what comes after it. */}
      {profile.closing && (
        <section className="room-hall py-16 md:py-20">
          <div className="shell text-center">
            <p className="font-serif text-[clamp(2rem,5vw,3rem)] tracking-[0.06em]">
              {profile.closing}
            </p>
          </div>
        </section>
      )}

      {/* The close is two calls to action, not reading, so it leaves paper
          and goes back to a dark room — .btn-dark/.btn-outline are
          paper-only, hence primary/ghost-light here. */}
      <section className="section-tight room-dark">
        <div className="shell-narrow grid gap-8 sm:grid-cols-2">
          <div>
            <p className="eyebrow text-champagne">{BRAND.question}</p>
            <p className="mt-3 text-sm leading-relaxed text-cream/80">
              Hers is the first. The next ones belong to women who wrote in.
            </p>
            <Link href="/found-her#share" className="btn btn-primary mt-5">
              Share your story
            </Link>
          </div>
          <div className="sm:border-l sm:border-cream/15 sm:pl-8">
            <p className="eyebrow text-champagne">{BRAND.collectionFull}</p>
            <p className="mt-3 text-sm leading-relaxed text-cream/80">
              Three serums. The part of this that pays for the rest of it.
            </p>
            <Link href="/shop" className="btn btn-ghost-light mt-5">
              Shop the collection
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
