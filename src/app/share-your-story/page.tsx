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
      <PageIntro
        eyebrow="Share your story"
        title="I found her when …"
        lede={STORY_INTRO}
        tone="rose"
        media={
          /* Found Her in the Mirror — the campaign image for this page. The
             sentence on the glass is the same one the form asks her to finish. */
          <figure className="relative mx-auto w-full max-w-[26rem] lg:mx-0">
            <div className="relative aspect-[1122/1402] overflow-hidden">
              <Image
                src="/editorial/found-her-mirror.webp"
                alt="Four women gathered at a mirror in an ornate green-and-gold frame, writing on the glass in rose. Their sentences read: I found her when I decided my worth is non-negotiable. When I stopped shrinking for comfort. When I chose peace over proving. When I became my own safe place."
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 26rem"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-xs uppercase tracking-[0.16em] text-charcoal/60">
              Found her in the mirror
            </figcaption>
          </figure>
        }
      />

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
            <p className="mt-8 border-l-2 border-bronze/50 py-1 pl-4 text-xs leading-relaxed text-charcoal/70">
              Heads up: the form isn’t wired to an inbox yet. It will tell you so rather
              than showing a thank-you screen over a message that went nowhere.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
