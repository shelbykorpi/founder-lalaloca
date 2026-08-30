import type { Metadata } from "next";
import { PageIntro } from "@/components/site/PageIntro";
import { SiteSearch } from "@/components/search/SiteSearch";

export const metadata: Metadata = {
  title: "Search",
  description: "Search serums, stories and pages.",
  alternates: { canonical: "/search" },
  /**
   * Internal search results must not be indexed. Google's own quality
   * guidelines name "search results within a search result" as something to
   * keep out, and the practical problem is worse than the guideline: `?q=`
   * generates an unbounded set of URLs, every one of them a thin page assembled
   * from content that already has a home. Left open, a crawler spends its
   * budget on permutations of the same three products.
   *
   * `follow` stays on deliberately — the links out of a results page are real
   * links to real pages, and there is no reason to waste them.
   */
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <>
      {/* Opens dark under the dark header; the search form and its results
          list are the reading/typing surface below, built to sit on the
          cream this section supplies — a form belongs on paper. */}
      <PageIntro eyebrow="Search" title="What are you after?" tone="dark" />
      <section className="section bg-cream pt-4">
        <SiteSearch />
      </section>
    </>
  );
}
