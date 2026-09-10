import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EditorialRoomSection } from "@/components/house/EditorialRoomSection";
import { EvidenceMark } from "@/components/library/EvidenceMark";
import { JsonLd, articleSchema, breadcrumbSchema } from "@/lib/seo";
import { LIBRARY, LIBRARY_PUBLISHED, getLibraryEntry, pubmedUrl } from "@/lib/library";

/**
 * A READING — one ingredient.
 *
 * Opens on the night ground with the name, the INCI and the one line, then
 * moves onto paper for the reading itself: three paragraphs, the products
 * that carry it, and the study set apart at the foot like a footnote. The
 * study block always says what kind of study it is and always carries the
 * line that it is research on the ingredient, not a test of the product.
 */

export function generateStaticParams() {
  return LIBRARY.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getLibraryEntry(slug);
  if (!entry) return {};
  const title = `${entry.name} — The Library`;
  return {
    title,
    description: entry.standfirst,
    alternates: { canonical: `/library/${entry.slug}` },
    openGraph: {
      title: `${title} | FOUNDER Beauty`,
      description: entry.standfirst,
      url: `/library/${entry.slug}`,
      type: "article",
    },
    twitter: { card: "summary_large_image", title, description: entry.standfirst },
  };
}

export default async function LibraryEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getLibraryEntry(slug);
  if (!entry) notFound();

  const i = LIBRARY.findIndex((e) => e.slug === entry.slug);
  const prev = LIBRARY[(i - 1 + LIBRARY.length) % LIBRARY.length];
  const next = LIBRARY[(i + 1) % LIBRARY.length];
  const path = `/library/${entry.slug}`;

  return (
    <div className="room-dark">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "The Library", path: "/library" },
            { name: entry.name, path },
          ]),
          articleSchema({
            title: entry.name,
            standfirst: entry.standfirst,
            path,
            published: LIBRARY_PUBLISHED,
          }),
        ]}
      />

      {/* ---- Opening: night ground ---- */}
      <section className="section-tight bg-night text-cream">
        <div className="shell pb-2 pt-6 md:pb-4 md:pt-10">
          <nav aria-label="Breadcrumb" className="eyebrow text-cream/60">
            <Link href="/library" className="hover:text-rose">
              The Library
            </Link>
            <span aria-hidden className="mx-2 text-rose">
              ◆
            </span>
            <span className="text-champagne">{entry.kind}</span>
          </nav>
          <h1 className="mt-6 font-serif text-5xl leading-[0.95] text-cream md:text-7xl">
            {entry.name}
          </h1>
          <p className="mt-3 text-[0.75rem] uppercase tracking-[0.2em] text-cream/55">
            {entry.inci}
          </p>
          <p className="mt-6 max-w-2xl font-serif text-2xl leading-snug text-cream/90 md:text-3xl">
            {entry.standfirst}
          </p>
          <div className="mt-6">
            <EvidenceMark evidence={entry.study.evidence} tone="room" />
          </div>
        </div>
      </section>

      {/* ---- The reading: paper ---- */}
      <EditorialRoomSection surface="paper">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] lg:gap-16">
          <div className="max-w-prose space-y-5 text-[1.0625rem] leading-relaxed text-charcoal/85">
            {entry.body.map((para, n) => (
              <p key={n} className={n === 0 ? "first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-founder-green" : undefined}>
                {para}
              </p>
            ))}
          </div>

          <aside className="lg:pt-2">
            <p className="eyebrow text-bronze-ink">In the house</p>
            <ul className="mt-4 divide-y divide-bronze/30 border-y border-bronze/30">
              {entry.products.map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className="group flex items-baseline justify-between gap-4 py-3"
                  >
                    <span>
                      <span className="font-serif text-xl text-charcoal group-hover:text-founder-green">
                        {p.name}
                      </span>
                      {p.as && p.as.toLowerCase() !== entry.name.toLowerCase() && (
                        <span className="block text-[0.75rem] text-charcoal/55">
                          on the label: {p.as}
                        </span>
                      )}
                    </span>
                    <span aria-hidden className="text-bronze-ink transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        {/* ---- The study: a footnote set apart ---- */}
        <div className="mt-12 border-t border-bronze pt-8 md:mt-16">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="eyebrow text-bronze-ink">The study</p>
            <EvidenceMark evidence={entry.study.evidence} tone="paper" />
          </div>
          <p className="mt-4 max-w-prose text-charcoal/85">{entry.study.finding}</p>
          <p className="mt-4 max-w-prose text-[0.875rem] leading-relaxed text-charcoal/65">
            {entry.study.authors}{" "}
            <em className="italic">{entry.study.title}</em> {entry.study.journal},{" "}
            {entry.study.year};{entry.study.ref}.{" "}
            <a
              href={pubmedUrl(entry.study.pmid)}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap border-b border-bronze/50 text-bronze-ink hover:border-rose hover:text-founder-green"
            >
              PubMed {entry.study.pmid}
            </a>
          </p>
          <p className="mt-6 max-w-prose text-[0.8125rem] leading-relaxed text-charcoal/55">
            Research on the ingredient, not a test of any FOUNDER product. Cosmetic benefits only,
            and skin varies. These are cosmetics, not medicine.
          </p>
        </div>
      </EditorialRoomSection>

      {/* ---- Next reading ---- */}
      <EditorialRoomSection surface="marble" tight>
        <div className="shell flex flex-wrap items-center justify-between gap-6">
          <Link href={`/library/${prev.slug}`} className="group text-cream/70 hover:text-cream">
            <span className="eyebrow block text-cream/50">Previous</span>
            <span className="font-serif text-2xl">
              <span aria-hidden className="mr-2 inline-block transition-transform group-hover:-translate-x-1">←</span>
              {prev.name}
            </span>
          </Link>
          <Link href="/library" className="eyebrow text-champagne hover:text-rose">
            All readings
          </Link>
          <Link href={`/library/${next.slug}`} className="group text-right text-cream/70 hover:text-cream">
            <span className="eyebrow block text-cream/50">Next</span>
            <span className="font-serif text-2xl">
              {next.name}
              <span aria-hidden className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>
        </div>
      </EditorialRoomSection>
    </div>
  );
}
