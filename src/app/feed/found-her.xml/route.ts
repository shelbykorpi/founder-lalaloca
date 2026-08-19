import { BRAND, SITE } from "@/lib/brand";
import { profiles, publicationDate } from "@/lib/profiles";

/**
 * FOUND HER as an RSS feed.
 *
 * WHY BOTHER IN 2026. Not for readers with feed apps — there are few. Three
 * other things consume RSS and all of them matter to a brand this size:
 *
 *   1. Crawlers treat a feed as a change notification. New stories get picked
 *      up faster than by sitemap crawl alone.
 *   2. Every newsletter platform, Flipboard-style aggregator and syndication
 *      partner asks for a feed URL as the first step of any content deal.
 *   3. AI answer engines that build a corpus of a site's editorial use feeds to
 *      discover what is new without re-crawling the whole site. Original
 *      first-person interviews are the most quotable thing FOUNDER publishes;
 *      making them trivially discoverable is the cheapest possible distribution.
 *
 * DELIBERATELY NOT INCLUDED: full article bodies. The feed carries the
 * standfirst and a link. Publishing the whole piece in the feed hands the text
 * to scrapers with no reason for anyone to reach the page it lives on.
 */

export const dynamic = "force-static";

function xml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** RSS wants RFC-822. Profiles carry a real approval date. */
function rfc822(isoDate: string) {
  return new Date(`${isoDate}T12:00:00Z`).toUTCString();
}

export function GET() {
  const profileItems = profiles.map((profile) =>
    [
      "    <item>",
      `      <title>${xml(`${profile.name} — ${profile.building}`)}</title>`,
      `      <link>${xml(`${SITE.url}/found-her/${profile.slug}`)}</link>`,
      `      <guid isPermaLink="true">${xml(`${SITE.url}/found-her/${profile.slug}`)}</guid>`,
      `      <description>${xml(profile.standfirst)}</description>`,
      `      <pubDate>${rfc822(publicationDate(profile))}</pubDate>`,
      `      <category>Profiles</category>`,
      "    </item>",
    ].join("\n"),
  );

  const feed = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${xml(`${BRAND.editorial} — ${BRAND.display}`)}</title>`,
    `    <link>${xml(`${SITE.url}/found-her`)}</link>`,
    `    <atom:link href="${xml(`${SITE.url}/feed/found-her.xml`)}" rel="self" type="application/rss+xml"/>`,
    `    <description>${xml(
      "Women on what they built, in their own words. Profiles from FOUNDER.",
    )}</description>`,
    "    <language>en-US</language>",
    `    <copyright>${xml(BRAND.display)}</copyright>`,
    ...profileItems,
    "  </channel>",
    "</rss>",
  ].join("\n");

  return new Response(feed, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
