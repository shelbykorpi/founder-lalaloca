import type { Metadata } from "next";
import { SerumFinder } from "@/components/quiz/SerumFinder";
import { PageIntro } from "@/components/site/PageIntro";
import { JsonLd, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Which serum?",
  description:
    "Three questions about your skin and your routine, and we’ll point you at one of the three serums.",
  alternates: { canonical: "/find-your-serum" },
};

export default function FindYourSerumPage() {
  return (
    <>
      <JsonLd
        schema={breadcrumbSchema([{ name: "Which serum?", path: "/find-your-serum" }])}
      />
      <PageIntro
        eyebrow="Which serum?"
        title="Three questions. One answer."
        lede="No diagnosis, no list of things to fix. Just what your skin does, when you’d use it, and how much you’re willing to do."
      />
      <section className="section bg-cream pt-4">
        <SerumFinder />
      </section>
    </>
  );
}
