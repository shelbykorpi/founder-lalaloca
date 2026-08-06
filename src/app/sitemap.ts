import type { MetadataRoute } from "next";
import { SITE } from "@/lib/brand";
import { notes } from "@/lib/content";
import { products } from "@/lib/products";
import { profiles } from "@/lib/profiles";
import { policies } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/shop",
    "/our-story",
    "/found-her",
    "/share-your-story",
    "/find-your-serum",
    "/search",
    "/account",
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
    ...profiles.map((profile) => ({
      url: `${SITE.url}/found-her/${profile.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    ...notes.map((note) => ({
      url: `${SITE.url}/found-her/${note.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    ...Object.keys(policies).map((slug) => ({
      url: `${SITE.url}/policies/${slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
