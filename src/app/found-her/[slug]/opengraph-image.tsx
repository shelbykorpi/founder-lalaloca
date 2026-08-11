import { BRAND } from "@/lib/brand";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og";
import { getProfile, profiles } from "@/lib/profiles";

/**
 * A card per story.
 *
 * These are the pages most likely to be shared by someone other than us — a
 * woman sending her own profile to people she knows. It should look like
 * something she is pleased to send.
 */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return profiles.map((profile) => ({ slug: profile.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const profile = getProfile(slug);
  return ogCard({
    eyebrow: BRAND.editorial,
    title: profile?.name ?? BRAND.campaign,
    footnote: profile?.building,
  });
}
