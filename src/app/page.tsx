import Image from "next/image";
import Link from "next/link";
import { EntranceDoor } from "@/components/door/EntranceDoor";
import { EmailSignup } from "@/components/site/EmailSignup";
import { BRAND, HERO } from "@/lib/brand";
import { notes } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      {/* ---------------- Hero ----------------
          Tuned to the campaign composition: subject on the right, black on the
          left. The scrim is deliberately light on wide screens so nothing sits
          over her face; small screens crop in on her, so they get a flat wash
          behind the type instead. */}
      <section className="relative isolate bg-ink text-shell">
        {/* Below md the photograph is its own block and the copy sits beneath it,
            so the frame is never cropped down to an extreme close-up. From md up
            it becomes the background and the copy sits on the black side of it. */}
        <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] md:absolute md:inset-0 md:aspect-auto md:h-full">
          <Image
            src={HERO.src}
            alt={HERO.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[78%_25%] md:object-[70%_35%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_55%,rgba(0,0,0,0.85)_88%,#000_100%)] md:hidden" />
          {/* Wide screens: the wash clears before her face, so it is never veiled. */}
          <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,#000_0%,#000_26%,rgba(0,0,0,0.55)_40%,rgba(0,0,0,0)_56%)] md:block" />
        </div>

        <div className="shell relative flex flex-col justify-end pb-14 pt-8 md:min-h-[36rem] md:py-16 lg:min-h-[40rem]">
          <div className="max-w-[34rem]">
            <p className="eyebrow text-blush/90">{BRAND.display}</p>
            <h1 className="display mt-5 max-w-[13ch] text-balance">{BRAND.tagline}</h1>
            <p className="mt-6 font-serif text-[clamp(1.5rem,3vw,2.125rem)] leading-snug text-blush">
              Three serums. No spreadsheet.
            </p>
            <p className="lede mt-4 text-shell/85">
              Stories from women who built before anyone applauded.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="btn btn-primary">
                Shop the LALALOCA Collection
              </Link>
              <Link href="/found-her" className="btn btn-ghost-light">
                Read Found Her
              </Link>
            </div>
          </div>

          {!HERO.approved && (
            <p className="mt-10 text-[0.625rem] uppercase tracking-[0.2em] text-shell/50">
              {HERO.placeholderNote}
            </p>
          )}
        </div>
      </section>

      {/* ---------------- The entrance ----------------
          The lobby photograph runs edge to edge — no shell — so the marble
          floor and the mirrored walls read as the room you are standing in. */}
      <section className="section bg-cream" aria-labelledby="entrance-heading">
        <div className="shell">
          <div className="mx-auto max-w-[30rem] text-center">
            <p className="eyebrow text-bronze-ink">{BRAND.collectionFull}</p>
            <h2 id="entrance-heading" className="headline mt-4 text-balance">
              Come in.
            </h2>
            <p className="mt-5 text-charcoal/80">
              Three serums on the other side of this door. Nobody is checking names.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <EntranceDoor />
        </div>
      </section>

      {/* ---------------- Brand belief ---------------- */}
      <section className="section-tight bg-charcoal py-16 text-shell md:py-20">
        <div className="shell-narrow">
          <h2 className="headline max-w-[16ch] text-balance">{BRAND.belief}</h2>
          <p className="mt-6 max-w-xl text-shell/80">
            A company. A family. A body of work. A comeback. A louder voice. A life she
            chose for herself.
          </p>
          <p className="mt-6 font-serif text-2xl text-bronze">
            Whatever you’re building, begin with you.
          </p>
        </div>
      </section>

      {/* ---------------- Found Her ---------------- */}
      <section className="section bg-shell" aria-labelledby="found-her-heading">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-16">
            <div>
              <p className="eyebrow text-bronze-ink">{BRAND.editorial}</p>
              <h2 id="found-her-heading" className="headline mt-4 text-balance">
                {BRAND.campaign}
              </h2>
              <p className="mt-6 max-w-md text-charcoal/80">
                Stories from women about what they started, survived, changed, finished,
                and finally gave themselves credit for.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/share-your-story" className="btn btn-dark">
                  I found her when…
                </Link>
                <Link href="/found-her" className="btn btn-outline">
                  Read Found Her
                </Link>
              </div>
            </div>

            <ul className="border-t border-charcoal/12">
              {notes.map((note) => (
                <li key={note.slug} className="border-b border-charcoal/12">
                  <Link
                    href={`/found-her/${note.slug}`}
                    className="group flex items-baseline justify-between gap-6 py-5 transition-colors hover:bg-cream md:px-3"
                  >
                    <span>
                      <span className="block font-serif text-2xl leading-tight text-charcoal">
                        {note.title}
                      </span>
                      <span className="mt-1 block text-sm text-charcoal/75">
                        {note.standfirst}
                      </span>
                    </span>
                    <span className="shrink-0 text-[0.6875rem] uppercase tracking-[0.16em] text-charcoal/70">
                      {note.readingTime}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------------- Email ---------------- */}
      <section className="section-tight texture-stone bg-cream py-14 md:py-16">
        <div className="shell">
          <div className="max-w-xl">
            <h2 className="headline text-balance text-charcoal">Come build this with us.</h2>
            <EmailSignup tone="light" />
          </div>
        </div>
      </section>
    </>
  );
}
