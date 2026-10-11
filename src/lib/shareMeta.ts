import type { Metadata } from "next";
import { BRAND, SITE } from "./brand";

/**
 * Each page's own link preview (clarity audit, 11 Oct 2026). The root
 * layout's openGraph carried the homepage's title and url, and Next.js
 * hands a parent's openGraph to any page that does not set its own, so
 * /shop, /founder-collection, /found-her and others all previewed as the
 * homepage when shared. Wrap a page's metadata in this and its preview
 * uses its own title, description and address. The image still comes from
 * the opengraph-image files, as before.
 */
export function withShare(meta: Metadata, path: string): Metadata {
  const own = typeof meta.title === "string" ? `${meta.title} | ${BRAND.display}` : SITE.title;
  const description = typeof meta.description === "string" ? meta.description : SITE.description;
  return {
    ...meta,
    openGraph: { siteName: BRAND.display, type: "website", url: path, title: own, description },
    twitter: { card: "summary_large_image", title: own, description },
  };
}
