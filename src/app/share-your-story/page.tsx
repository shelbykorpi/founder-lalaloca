import type { Metadata } from "next";
import Image from "next/image";
import { PageIntro } from "@/components/site/PageIntro";
import { StoryForm } from "@/components/story/StoryForm";
import { STORY_INTRO, STORY_STANDARD } from "@/lib/content";

export const metadata: Metadata = {
  title: "I found her when …",
  description:
    "Finish the sentence. Tell us when you found her, and what you’re building. A person reads every submission, and nothing is published without your permission.",
  alternates: { canonical: "/share-your-story" },
};

export default function ShareYourStoryPage() {
  return (
    <>
      {/* ---- The gallery wall ----
          One photographed room: an ivory panelled wall over a Founder Green
          wainscot, the mirror hung in its green-and-gold frame under a brass
          picture light. On large screens the page text sits directly on the
          wall; the photograph was cleaned of its mocked-in type so the live,
          translated, screen-readable text is the only text. */}
      <div className="relative hidden lg:block">
        <div className="relative aspect-[1913/729] w-full">
          <Image
            src="/editorial/story-wall.webp"
            alt="A sunlit ivory panelled wall above a deep green wainscot. A mirror in an ornate green-and-gold frame hangs under a brass picture light; four women are reflected in it, writing on the glass in rose."
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center">
            <div className="shell w-full">
              <div className="max-w-xl">
                <p className="eyebrow text-charcoal/60">Share your story</p>
                <h1 className="headline mt-5 text-balance text-charcoal">
                  I found her when …
                </h1>
                <p className="lede mt-6 text-charcoal/80">{STORY_INTRO}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Small screens: the text on cream, then the framed mirror on its wall */}
      <div className="lg:hidden">
        {/* Both breakpoints are in the DOM at once (CSS-hidden, not conditionally
            rendered), so this must render an h2 — two h1 elements on one page is
            an accessibility failure and an ambiguous signal to crawlers. The
            desktop block above owns the h1. */}
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

      <section className="section bg-cream pt-4">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_minmax(0,22rem)] lg:gap-16">
          <StoryForm />

          <aside className="lg:pt-2">
            <h2 className="eyebrow text-charcoal/70">Before you write</h2>
            <ul className="mt-6 space-y-6 border-t border-charcoal/12 pt-6">
              {STORY_STANDARD.map((item) => (
                <li key={item.title}>
                  <h3 className="font-serif text-xl leading-tight text-charcoal">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/80">
                    {item.detail}
                  </p>
                </li>
              ))}
            </ul>
            {/* This note used to say the form wasn't wired to anything. It is
                now — so the note says what is still true instead, which is that
                the form will admit a failure rather than fake a success. Left
                in place deliberately: it is the sentence that makes the
                thank-you screen worth believing. */}
            <p className="mt-8 border-l-2 border-bronze/50 py-1 pl-4 text-xs leading-relaxed text-charcoal/70">
              If anything goes wrong when you send this, we’ll tell you plainly rather
              than showing a thank-you screen over a message that went nowhere.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
