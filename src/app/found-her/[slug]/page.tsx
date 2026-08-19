import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProfile, profiles, publicationDate } from "@/lib/profiles";
import { ProfileStory } from "@/components/found-her/ProfileStory";
import { BRAND } from "@/lib/brand";
import { JsonLd, articleSchema, breadcrumbSchema, personSchema } from "@/lib/seo";

/* Profiles only. The team-written notes that used to share this route were
   removed with their section on /found-her; their slugs redirect to the
   archive in next.config.ts. */
export function generateStaticParams() {
  return profiles.map((profile) => ({ slug: profile.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/found-her/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const profile = getProfile(slug);
  if (!profile) return { title: "Not found" };
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

export default async function ProfilePage({ params }: PageProps<"/found-her/[slug]">) {
  const { slug } = await params;

  const profile = getProfile(slug);
  if (!profile) notFound();

  return (
    <>
      <JsonLd
        schema={[
          articleSchema({
            title: `${profile.name} — ${BRAND.editorial}`,
            standfirst: profile.standfirst,
            path: `/found-her/${profile.slug}`,
            image: profile.portrait?.src,
            published: publicationDate(profile),
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
