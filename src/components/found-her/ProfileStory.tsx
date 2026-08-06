import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import type { FoundHerProfile } from "@/lib/profiles";

/** The published-profile template: her portrait, then her answers, in her words. */
export function ProfileStory({ profile }: { profile: FoundHerProfile }) {
  return (
    <>
      <header className="bg-cream">
        <div className="shell pb-10 pt-8 md:pt-12">
          <nav aria-label="Breadcrumb" className="mb-6">
            <Link
              href="/found-her"
              className="inline-flex min-h-11 items-center text-[0.6875rem] uppercase tracking-[0.16em] text-charcoal/70 hover:text-charcoal"
            >
              ← {BRAND.editorial}
            </Link>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,30rem)_1fr] lg:gap-16">
            {profile.portrait && (
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-shell">
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
              <p className="eyebrow text-bronze-ink">
                {profile.role}
                {profile.location ? ` · ${profile.location}` : ""}
              </p>
              <h1 className="headline mt-4 text-balance text-charcoal">{profile.name}</h1>
              <p className="mt-6 max-w-md font-serif text-2xl leading-snug text-charcoal/90">
                {profile.standfirst}
              </p>
              <p className="mt-8 max-w-md text-sm leading-relaxed text-charcoal/70">
                Told in her own words, and published after she read and approved the
                final text.
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

      {profile.closing && (
        <section className="bg-charcoal py-16 text-shell md:py-20">
          <div className="shell text-center">
            <p className="font-serif text-[clamp(2rem,5vw,3rem)] tracking-[0.06em]">
              {profile.closing}
            </p>
          </div>
        </section>
      )}

      <section className="section-tight bg-cream">
        <div className="shell-narrow grid gap-8 sm:grid-cols-2">
          <div>
            <p className="eyebrow text-charcoal/70">{BRAND.question}</p>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/80">
              Hers is the first. The next ones belong to women who wrote in.
            </p>
            <Link href="/share-your-story" className="btn btn-dark mt-5">
              Share your story
            </Link>
          </div>
          <div className="sm:border-l sm:border-charcoal/12 sm:pl-8">
            <p className="eyebrow text-charcoal/70">{BRAND.collectionFull}</p>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/80">
              Three serums. The part of this that pays for the rest of it.
            </p>
            <Link href="/shop" className="btn btn-outline mt-5">
              Shop the collection
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
