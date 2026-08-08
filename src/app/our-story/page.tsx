import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/site/PageIntro";
import { BRAND } from "@/lib/brand";
import { profiles } from "@/lib/profiles";
import { JsonLd, aboutPageSchema, breadcrumbSchema } from "@/lib/seo";

const ABOUT_DESCRIPTION =
  "FOUNDER is for women building something — and finding themselves along the way. The LALALOCA Collection is where it started.";

export const metadata: Metadata = {
  title: "Our Story",
  description: ABOUT_DESCRIPTION,
  alternates: { canonical: "/our-story" },
};

const BUILDING = [
  "A business",
  "A family",
  "A body of work",
  "A second chance",
  "A stronger boundary",
  "A creative life",
  "A future that feels like her own",
];

export default function OurStoryPage() {
  const founder = profiles[0];

  return (
    <>
      {/* The page an engine reads to answer "who is behind this brand" — typed
          as such, and pointed at the Organization node rather than repeating it. */}
      <JsonLd
        schema={[
          aboutPageSchema(ABOUT_DESCRIPTION),
          breadcrumbSchema([{ name: "Our Story", path: "/our-story" }]),
        ]}
      />
      <PageIntro
        eyebrow="Our story"
        title="FOUNDER is for women building something — and finding themselves along the way."
        lede="We make skincare. Three serums, sold under the name they’ve always had. The rest of what we do is about the women who buy it."
      />

      {/* ---------------- Not only entrepreneurs ---------------- */}
      <section className="section bg-cream">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-16">
          <div>
            <h2 className="headline text-balance text-charcoal">
              Not every woman has a company.
            </h2>
            <p className="mt-4 font-serif text-2xl text-bronze-ink">
              Every woman is building something.
            </p>
          </div>
          <div className="max-w-[38rem]">
            <p className="text-[1.0625rem] leading-[1.8] text-charcoal/85">
              When we say founder, we don’t mean a business registration. We mean the
              woman who started the thing, kept it going, or began again after it fell
              over. Sometimes that’s a company. Usually it isn’t.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {BUILDING.map((item) => (
                <li
                  key={item}
                  className="border border-bronze/40 px-4 py-2 text-sm text-charcoal/85"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 leading-[1.8] text-charcoal/85">
              The other half of the name is the part people notice second. Founder.
              Found her. There’s usually a moment somewhere in the building where a
              woman looks up and recognises who she’s become. We named the brand after
              that moment rather than after ourselves.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- The collection ---------------- */}
      <section className="section bg-charcoal text-shell">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-16">
          <div>
            <p className="eyebrow text-bronze">{BRAND.collectionFull}</p>
            <h2 className="subhead mt-4">Where it started, and what we sell.</h2>
          </div>
          <div className="max-w-[38rem]">
            <p className="leading-[1.8] text-shell/85">
              LALALOCA came first: three serums — Thirst Trap, C Me Glow and Bounce
              Back — in the bottles they’re still sold in today. FOUNDER is the name on
              the door now. LALALOCA is the collection inside, and the name on your
              receipt.
            </p>
            <p className="mt-5 leading-[1.8] text-shell/85">
              We didn’t reformulate anything to launch a new brand, and we haven’t
              redesigned a single bottle. The products are what they were. What changed
              is what we’re building around them.
            </p>
            <p className="mt-8 font-serif text-2xl leading-snug text-bronze">
              {BRAND.supporting}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="btn btn-primary">
                See the three serums
              </Link>
              <Link href="/found-her" className="btn btn-ghost-light">
                Read Found Her
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- The founder ---------------- */}
      <section className="section texture-stone bg-cream">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-16">
          <div className="relative mx-auto aspect-[3/2] w-full max-w-md overflow-hidden bg-shell lg:mx-0 lg:max-w-none">
            <Image
              src={founder.portrait!.src}
              alt={founder.portrait!.alt}
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 90vw, 26rem"
              className="object-cover"
              style={{ objectPosition: founder.portrait!.position }}
            />
          </div>

          <div>
            <p className="eyebrow text-bronze-ink">The founder</p>
            <h2 className="headline mt-4 text-balance text-charcoal">{founder.name}</h2>
            <p className="mt-6 max-w-md text-[1.0625rem] leading-[1.8] text-charcoal/85">
              {founder.standfirst}
            </p>
            <blockquote className="mt-8 max-w-md border-l-2 border-bronze/50 pl-6">
              <p className="font-serif text-[clamp(1.5rem,3vw,2rem)] leading-snug text-charcoal">
                “I didn’t suddenly become her. I finally recognized the woman who had
                been fighting for me the entire time.”
              </p>
            </blockquote>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={`/found-her/${founder.slug}`} className="btn btn-dark">
                Read her story
              </Link>
              <Link href="/share-your-story" className="btn btn-outline">
                Tell us what you’re building
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
