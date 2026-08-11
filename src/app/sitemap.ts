import type { MetadataRoute } from "next";
import { SITE } from "@/lib/brand";
import { products } from "@/lib/products";
import { profiles } from "@/lib/profiles";
import { policies } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/shop",
    "/our-story",
    "/found-her",
    "/find-your-serum",
    /* Three deliberate absences:
       /account — robots.ts disallows it and the page carries noindex. A URL
         that is both submitted and blocked is a Search Console error.
       /search  — an internal search page carries noindex for the same reason
         it should not be submitted: `?q=` generates unbounded thin URLs.
       /unsubscribe — reachable only from a signed link in an email, carries
         noindex, and has nothing on it for anyone who arrived another way.
         Deliberately NOT added to robots.ts either: a disallowed page is one
         Google never fetches, so it never reads the noindex. Unlinked plus
         noindex is the stronger combination here. */
  ];

  return [
    ...staticPaths.map((path) => ({
      url: `${SITE.url}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...products.map((product) => ({
      url: `${SITE.url}/products/${product.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    /* Real approval dates, not build timestamps — a lastModified that changes
       on every deploy teaches crawlers to ignore the field. */
    ...profiles.map((profile) => ({
      url: `${SITE.url}/found-her/${profile.slug}`,
      lastModified: profile.approvedOn,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    ...Object.keys(policies).map((slug) => ({
      url: `${SITE.url}/policies/${slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
