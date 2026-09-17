import type { MetadataRoute } from "next";
import { SITE } from "@/lib/brand";
import { products } from "@/lib/products";
import { FOUNDER_COLLECTION } from "@/lib/founderCollection";
import { NEXT_MOVE } from "@/lib/nextMove";
import { profiles, publicationDate } from "@/lib/profiles";
import { policies } from "@/lib/content";
import { LIBRARY, LIBRARY_PUBLISHED } from "@/lib/library";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/shop",
    "/founder-collection",
    "/our-story",
    "/found-her",
    "/find-your-serum",
    "/library",
    /* Added 17 Sept 2026 (audit F-13): both are real, indexable rooms.
       /the-next-move left the list the same day — it now redirects to
       /founder-collection. */
    "/young-founders-room",
    "/salon",
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
    /* The FOUNDER line. It was missing from here entirely — four indexable
       product pages, one of them taking money since 19 August, none of them
       submitted. `products` above is the LALALOCA array only, and nothing
       ever added the second line to it.

       Hold the Room is priority 0.9 with the serums because it sells. The
       three campaign SKUs sit at 0.6: they are real pages with real content,
       but they take reservations rather than orders, so they should not
       outrank a page a customer can buy from. */
    ...FOUNDER_COLLECTION.map((product) => ({
      url: `${SITE.url}/products/${product.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...NEXT_MOVE.map((product) => ({
      url: `${SITE.url}/products/${product.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    /* The Library: one reading per ingredient. Reference pages that change
       only when an entry is rewritten, so yearly, and below the products. */
    ...LIBRARY.map((entry) => ({
      url: `${SITE.url}/library/${entry.slug}`,
      lastModified: LIBRARY_PUBLISHED,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    /* Real approval dates, not build timestamps — a lastModified that changes
       on every deploy teaches crawlers to ignore the field. */
    ...profiles.map((profile) => ({
      url: `${SITE.url}/found-her/${profile.slug}`,
      lastModified: publicationDate(profile),
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
