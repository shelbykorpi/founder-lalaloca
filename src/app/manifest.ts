import type { MetadataRoute } from "next";
import { BRAND, SITE } from "@/lib/brand";

/**
 * Web app manifest.
 *
 * Two jobs, only one of which is about installing anything.
 *
 * The obvious one: a phone that adds the site to a home screen gets the right
 * name and the right colour instead of a screenshot and a URL.
 *
 * The one that matters here: `name` and `short_name` are another machine-
 * readable statement of what this brand is called. Google reads the manifest,
 * and for a brand with two names in play — FOUNDER the company, LALALOCA the
 * collection — every additional place the hierarchy is stated unambiguously is
 * one less place an engine can guess wrong.
 */

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BRAND.display} — ${BRAND.collectionFull}`,
    short_name: BRAND.display,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    /* Founder Green and the ivory ground, per the brand palette. */
    background_color: "#faf7f2",
    theme_color: "#164d49",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    categories: ["shopping", "lifestyle", "health"],
  };
}
