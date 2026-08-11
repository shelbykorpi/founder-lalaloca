import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/found-her/ArticleView";
import { getNote, notes } from "@/lib/content";
import { getProfile, profiles } from "@/lib/profiles";
import { ProfileStory } from "@/components/found-her/ProfileStory";
import { BRAND } from "@/lib/brand";
import { JsonLd, articleSchema, breadcrumbSchema, personSchema } from "@/lib/seo";

export function generateStaticParams() {
  return [
    ...profiles.map((profile) => ({ slug: profile.slug })),
    ...notes.map((note) => ({ slug: note.slug })),
  ];
}

export async function generateMetadata({
  params,
}: PageProps<"/found-her/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const profile = getProfile(slug);
  if (profile) {
    return {
      title: `${profile.name} — ${BRAND.editorial}`,
      description: profile.standfirst,
      alternates: { canonical: `/found-her/${profile.slug}` },
      openGraph: {
        title: `${profile.name} — ${BRAND.editorial}`,
        description: profile.standfirst,
        images: profile.portrait ? [{ url: profile.portrait.src }] : undefined,
        type: "article",
      },
    };
  }
  const note = getNote(slug);
  if (!note) return { title: "Not found" };
  return {
    title: note.title,
    description: note.excerpt,
    alternates: { canonical: `/found-her/${note.slug}` },
  };
}

export default async function NotePage({ params }: PageProps<"/found-her/[slug]">) {
  const { slug } = await params;

  const profile = getProfile(slug);
  if (profile) {
    return (
      <>
        <JsonLd
          schema={[
            articleSchema({
              title: `${profile.name} — ${BRAND.editorial}`,
              standfirst: profile.standfirst,
              path: `/found-her/${profile.slug}`,
              image: profile.portrait?.src,
              published: profile.approvedOn,
            }),
            personSchema({
              name: profile.name,
              role: profile.role,
              path: `/found-her/${profile.slug}`,
              image: profile.portrait?.src,
              description: profile.standfirst,
            }),
            breadcrumbSchema([
              { name: BRAND.editorial, path: "/found-her" },
              { name: profile.name, path: `/found-her/${profile.slug}` },
            ]),
          ]}
        />
        <ProfileStory profile={profile} />
      </>
    );
  }

  const note = getNote(slug);
  if (!note) notFound();

  const next = notes[(notes.indexOf(note) + 1) % notes.length];

  return (
    <>
      {/* Notes are bylined to the team on the page itself, so the schema says
          the same thing rather than inventing an author. */}
      <JsonLd
        schema={[
          articleSchema({
            title: note.title,
            standfirst: note.standfirst,
            path: `/found-her/${note.slug}`,
          }),
          breadcrumbSchema([
            { name: BRAND.editorial, path: "/found-her" },
            { name: note.title, path: `/found-her/${note.slug}` },
          ]),
        ]}
      />
      <ArticleView slug={note.slug} />

      <article className="bg-cream">
        <header className="shell-narrow pb-8 pt-8 md:pt-14">
          <nav aria-label="Breadcrumb" className="mb-6">
            <Link
              href="/found-her"
              className="inline-flex min-h-11 items-center text-[0.6875rem] uppercase tracking-[0.16em] text-charcoal/70 hover:text-charcoal"
            >
              ← Found Her
            </Link>
          </nav>
          <p className="eyebrow text-bronze-ink">
            Written by {BRAND.display} · {note.readingTime} read
          </p>
          <h1 className="headline mt-5 text-balance text-charcoal">{note.title}</h1>
          <p className="mt-4 font-serif text-2xl italic text-bronze-ink">
            {note.standfirst}
          </p>
        </header>

        <div className="shell-narrow pb-14">
          <div className="max-w-[38rem] border-t border-charcoal/12 pt-8">
            {note.body.map((paragraph, index) => (
              <p
                key={paragraph.slice(0, 24)}
                className={`text-pretty text-[1.0625rem] leading-[1.85] text-charcoal/85 ${
                  index === 0 ? "" : "mt-6"
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </article>

      <section className="section-tight bg-shell">
        <div className="shell-narrow grid gap-8 sm:grid-cols-2">
          <div>
            <p className="eyebrow text-charcoal/70">Read next</p>
            <Link href={`/found-her/${next.slug}`} className="group mt-3 block">
              <span className="block font-serif text-[clamp(1.5rem,3vw,2rem)] leading-tight text-charcoal">
                {next.title}
              </span>
              <span className="mt-1 block font-serif text-lg italic text-bronze-ink">
                {next.standfirst}
              </span>
            </Link>
          </div>
          <div className="sm:border-l sm:border-charcoal/12 sm:pl-8">
            <p className="eyebrow text-charcoal/70">{BRAND.question}</p>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/80">
              If you’ve got an answer to that, we’d like to read it.
            </p>
            <Link href="/found-her#share" className="btn btn-outline mt-5">
              Share your story
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
