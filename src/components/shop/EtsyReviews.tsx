import type { Review } from "@/lib/reviews";

/**
 * Real customer reviews carried over from the Etsy shop, shown word for word.
 *
 * Paper surface, because these are read. The source is said up front, the
 * purchase is named on every quote, and the note says these are all of them,
 * not a selection: the honest framing is what makes two reviews worth more
 * than none. No rating markup is emitted (see lib/reviews.ts, `source`).
 */
function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5 text-bronze-ink" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-4 w-4" aria-hidden fill={i < rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.2">
          <path d="M10 1.8l2.5 5.2 5.7.8-4.1 4 1 5.6L10 14.7l-5.1 2.7 1-5.6-4.1-4 5.7-.8z" />
        </svg>
      ))}
    </span>
  );
}

function monthYear(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

export function EtsyReviews({
  reviews,
  tone = "paper",
  scope = "all",
}: {
  reviews: Review[];
  tone?: "paper" | "marble";
  /** "all": the full set (/shop). "product": only those that include this serum. */
  scope?: "all" | "product";
}) {
  if (reviews.length === 0) return null;
  return (
    <section
      aria-labelledby="etsy-reviews-heading"
      className={tone === "paper" ? "section-tight bg-shell" : "section-tight bg-cream"}
    >
      <div className="shell grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
        <div>
          <h2 id="etsy-reviews-heading" className="subhead text-charcoal">
            From our Etsy shop
          </h2>
          <p className="mt-4 max-w-[22rem] text-sm leading-relaxed text-charcoal/75">
            {scope === "all"
              ? "LALALOCA sold on Etsy before this site. These are every review the serums received there, copied word for word."
              : "LALALOCA sold on Etsy before this site. Every review there that includes this serum, copied word for word."}
          </p>
        </div>
        <ul className="max-w-[38rem] space-y-8">
          {reviews.map((r) => (
            <li key={r.id} className="border-t border-charcoal/12 pt-6">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <Stars rating={r.rating} />
                <span className="text-[0.75rem] uppercase tracking-[0.16em] text-charcoal/70">
                  {r.item} · {monthYear(r.published)}
                </span>
              </div>
              <blockquote className="mt-4 font-serif text-[1.25rem] leading-snug text-charcoal">
                “{r.body}”
              </blockquote>
              <p className="mt-3 text-sm text-charcoal/70">
                {r.author}
                {r.verified ? ", Etsy buyer" : ""}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
