import type { MetadataRoute } from "next";
import { SITE } from "@/lib/brand";

export default function robots(): MetadataRoute.Robots {
  /* Previews and local builds must never be indexed — only the production
     deployment invites crawlers in. */
  if (!SITE.indexable) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/account"] }],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
