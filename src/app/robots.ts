import type { MetadataRoute } from "next";
import { SITE } from "@/lib/brand";

/**
 * Crawler policy.
 *
 * Two audiences now, not one. Traditional crawlers index pages for a results
 * list; AI answer engines read pages to compose an answer that may never send
 * a click. For a new brand the second group is arguably the more valuable —
 * being the source ChatGPT or Perplexity quotes when someone asks "which
 * hyaluronic acid serum should I buy" beats page two of Google.
 *
 * A blanket `User-agent: *` already permits all of them, so these entries
 * change no behaviour today. They are here as a deliberate, legible record of
 * a decision — the next person to touch this file should have to actively
 * remove a named bot to block it, rather than block it by accident with a
 * careless wildcard.
 *
 * Named on purpose:
 *   OAI-SearchBot   ChatGPT search results and citations
 *   ChatGPT-User    a user asking ChatGPT to visit this page right now
 *   GPTBot          OpenAI model training
 *   PerplexityBot   Perplexity's index
 *   ClaudeBot       Anthropic
 *   Google-Extended controls Gemini and AI Overviews grounding — note this is
 *                   SEPARATE from Googlebot. Disallowing it removes the brand
 *                   from AI Overviews while leaving normal Search untouched.
 *
 * /account stays out of every index: it is a personal order-lookup page with
 * nothing crawlable and no reason to appear in a result.
 */

const AI_AGENTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "PerplexityBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  /* Previews and local builds must never be indexed — only the production
     deployment invites crawlers in. */
  if (!SITE.indexable) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/account"] },
      ...AI_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/account"],
      })),
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
