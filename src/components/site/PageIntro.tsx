import type { ReactNode } from "react";

/** One page-opening pattern, so header height and headline scale stay consistent. */
export function PageIntro({
  eyebrow,
  title,
  lede,
  children,
  media,
  headingLevel = "h1",
  tone = "cream",
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: string;
  children?: ReactNode;
  /**
   * Almost every page wants the h1. The exception is a responsive layout that
   * renders two copies of the same heading and hides one with CSS — both are
   * still in the DOM, so the hidden one must step down to h2 or the page ships
   * two h1 elements.
   */
  headingLevel?: "h1" | "h2";
  /** Optional image column. Text keeps the left; the media sits beside it and
      drops below on small screens. */
  media?: ReactNode;
  /**
   * "rose" is reserved for the community invitation. Brand Bible §4 requires
   * "I found her when ______" to set in or on Desert Rose; on rather than in,
   * because rose type on cream does not carry at headline size.
   */
  tone?: "cream" | "dark" | "rose";
}) {
  const Heading = headingLevel;
  const dark = tone === "dark";
  const rose = tone === "rose";
  /* "dark" used to paint bg-charcoal/text-shell — a standalone dark card, not
     one of the house's three night grounds. Now that the body itself is
     night, this tone is what a page reaches for to open in a dark room
     instead of defaulting into a pale band under the (also dark) header, so
     it takes the same night ground everything else does. */
  const field = dark
    ? "bg-night text-cream"
    : rose
      ? "bg-rose text-charcoal"
      : "texture-stone bg-cream";
  return (
    <section className={`section-tight ${field}`}>
      <div
        className={`shell pb-2 pt-6 md:pb-4 md:pt-10 ${
          media
            ? "grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16"
            : ""
        }`}
      >
        <div>
          <p
            className={`eyebrow ${dark ? "text-champagne" : rose ? "text-charcoal/70" : "text-bronze-ink"}`}
          >
            {eyebrow}
          </p>
          <Heading className="headline mt-5 max-w-[20ch] text-balance">{title}</Heading>
          {lede && (
            <p
              className={`lede mt-6 ${dark ? "text-cream/75" : rose ? "text-charcoal/85" : "text-charcoal/80"}`}
            >
              {lede}
            </p>
          )}
          {children}
        </div>
        {media}
      </div>
    </section>
  );
}

/** Marks something we are waiting on rather than something we invented.
    Sets no ground of its own — it reads correctly wherever the caller
    already sits on a paper/light surface, and callers only ever drop it
    into one. */
export function PendingNote({ children }: { children: ReactNode }) {
  return (
    <p className="mt-6 border-l-2 border-bronze/50 py-1 pl-4 text-xs leading-relaxed text-charcoal/70">
      {children}
    </p>
  );
}
