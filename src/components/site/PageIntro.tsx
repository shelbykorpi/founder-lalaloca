import type { ReactNode } from "react";

/** One page-opening pattern, so header height and headline scale stay consistent. */
export function PageIntro({
  eyebrow,
  title,
  lede,
  children,
  media,
  tone = "cream",
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: string;
  children?: ReactNode;
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
  const dark = tone === "dark";
  const rose = tone === "rose";
  const field = dark
    ? "bg-charcoal text-shell"
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
            className={`eyebrow ${dark ? "text-bronze" : rose ? "text-charcoal/70" : "text-bronze-ink"}`}
          >
            {eyebrow}
          </p>
          <h1 className="headline mt-5 max-w-[20ch] text-balance">{title}</h1>
          {lede && (
            <p
              className={`lede mt-6 ${dark ? "text-shell/75" : rose ? "text-charcoal/85" : "text-charcoal/80"}`}
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

/** Marks something we are waiting on rather than something we invented. */
export function PendingNote({ children }: { children: ReactNode }) {
  return (
    <p className="mt-6 border-l-2 border-bronze/50 py-1 pl-4 text-xs leading-relaxed text-charcoal/70">
      {children}
    </p>
  );
}
