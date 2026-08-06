import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/site/PageIntro";
import { policies, type PolicySlug } from "@/lib/content";

export function generateStaticParams() {
  return Object.keys(policies).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/policies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const policy = policies[slug as PolicySlug];
  if (!policy) return { title: "Policy not found" };
  return { title: policy.title, description: policy.intro };
}

export default async function PolicyPage({ params }: PageProps<"/policies/[slug]">) {
  const { slug } = await params;
  const policy = policies[slug as PolicySlug];
  if (!policy) notFound();

  return (
    <>
      <PageIntro eyebrow="Care" title={policy.title} lede={policy.intro} />
      <section className="section bg-cream pt-0">
        <div className="shell-narrow">
          <div className="max-w-[38rem] border-t border-charcoal/12">
            {policy.sections.map((section) => (
              <div key={section.heading} className="border-b border-charcoal/12 py-8">
                <h2 className="font-serif text-2xl leading-tight text-charcoal">
                  {section.heading}
                </h2>
                <p className="mt-3 text-pretty leading-[1.8] text-charcoal/80">
                  {section.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
