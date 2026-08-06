import type { Metadata } from "next";
import { PageIntro } from "@/components/site/PageIntro";
import { SiteSearch } from "@/components/search/SiteSearch";

export const metadata: Metadata = {
  title: "Search",
  description: "Search serums, stories and pages.",
  alternates: { canonical: "/search" },
};

export default function SearchPage() {
  return (
    <>
      <PageIntro eyebrow="Search" title="What are you after?" />
      <section className="section bg-cream pt-4">
        <SiteSearch />
      </section>
    </>
  );
}
