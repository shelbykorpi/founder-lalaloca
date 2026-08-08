import { BRAND } from "@/lib/brand";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og";

/** The default card, used by any route that does not supply its own. */
export const alt = `${BRAND.display} — ${BRAND.tagline}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    eyebrow: BRAND.structure,
    title: BRAND.campaign,
    footnote: "Three serums. 50 ml each. Free US shipping.",
  });
}
