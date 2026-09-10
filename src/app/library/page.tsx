import type { Metadata } from "next";
import Link from "next/link";
import { EditorialRoomSection } from "@/components/house/EditorialRoomSection";
import { PageIntro } from "@/components/site/PageIntro";
import { JsonLd, breadcrumbSchema } from "@/lib/seo";
import { LIBRARY, libraryByProduct } from "@/lib/library";
import { EvidenceMark } from "@/components/library/EvidenceMark";

/**
 * THE LIBRARY — the reading room.
 *
 * One page, two ways in. The shelf at the top is by product: pick the bottle
 * you own and see what is in it. The index below is A–Z: every ingredient in
 * the house, one line each, into its own reading at /library/<slug>.
 *
 * Not a room in the loop. The house has seven rooms and a rail that counts
 * them; the library is a door off the hall, so it takes the night ground and
 * the house surfaces without HouseShell, the rail, or the next-room doors.
 */

const TITLE = "The Library";
const DESCRIPTION =
  "Every ingredient named on a FOUNDER label, one short reading each — what it is, what it does, which products carry it, and one peer-reviewed study on the ingredient.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/library" },
  openGraph: {
    title: `${TITLE} | FOUNDER Beauty`,
    description: DESCRIPTION,
    url: "/library",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function LibraryPage() {
  const shelves = libraryByProduct();
  const index = [...LIBRARY].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="room-dark">
      <JsonLd schema={[breadcrumbSchema([{ name: TITLE, path: "/library" }])]} />

      <PageIntro
        tone="dark"
        eyebrow="The Library"
        title={
          <>
            Read what you’re wearing.
          </>
        }
        lede="Every ingredient named on a FOUNDER label has a page here: what it is, what it does in the bottle, and one peer-reviewed study on the ingredient — cited as research, never as a promise. Cosmetic benefits only, and skin varies."
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#by-product" className="btn btn-primary">
            Start with a product <span aria-hidden>→</span>
          </a>
          <a href="#a-to-z" className="btn btn-ghost-light">
            Browse A–Z
          </a>
        </div>
      </PageIntro>

      {/* ---- The shelf: by product ----
          Each product is one shelf. The bottle's name is the heading and links
          to its page; the ingredients under it link to their readings. The
          label wording (`as`) is shown where it differs, because "marine
          collagen" on a carton and "Collagen" in the index should be
          recognisably the same thing. */}
      <EditorialRoomSection surface="marble" id="by-product" className="scroll-mt-24">
        <div className="shell">
          <p className="eyebrow text-champagne">By product</p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-cream md:text-5xl">
            What’s in the bottle you own.
          </h2>
          <hr className="my-8 h-px w-16 border-0 bg-bronze" />

          <ul className="grid gap-x-12 gap-y-10 md:grid-cols-2 xl:grid-cols-4">
            {shelves.map((shelf) => (
              <li key={shelf.href} className="border-t border-bronze/30 pt-5">
                <h3 className="font-serif text-2xl text-cream">
                  <Link href={shelf.href} className="hover:text-rose">
                    {shelf.name}
                  </Link>
                </h3>
                <ul className="mt-4 space-y-2">
                  {shelf.entries.map((entry) => {
                    const ref = entry.products.find((p) => p.href === shelf.href);
                    const labelled = ref?.as && ref.as.toLowerCase() !== entry.name.toLowerCase();
                    return (
                      <li key={entry.slug}>
                        <Link
                          href={`/library/${entry.slug}`}
                          className="group inline-flex flex-col text-cream/85 hover:text-cream"
                        >
                          <span className="border-b border-transparent group-hover:border-rose/60">
                            {entry.name}
                          </span>
                          {labelled && (
                            <span className="text-[0.75rem] text-cream/50">
                              on the label: {ref?.as}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </EditorialRoomSection>

      {/* ---- The index: A–Z ----
          Paper, because this is the reading surface of the house. One row per
          ingredient: name, what kind of thing it is, the standfirst, and the
          evidence mark that says honestly what the cited study is. */}
      <EditorialRoomSection surface="paper" id="a-to-z" className="scroll-mt-24">
        <p className="eyebrow text-bronze-ink">A to Z</p>
        <h2 className="mt-4 font-serif text-3xl leading-tight text-charcoal md:text-5xl">
          Every ingredient in the house.
        </h2>
        <p className="mt-4 max-w-prose text-charcoal/75">
          The mark beside each entry says what kind of study is cited. A randomised human trial
          is the strongest; a laboratory study is a mechanism, not a result on people. We show the
          weaker ones too, because leaving them out would be its own kind of claim.
        </p>
        <hr className="my-8 h-px w-16 border-0 bg-bronze" />

        <ol className="divide-y divide-bronze/30 border-t border-bronze/30">
          {index.map((entry) => (
            <li key={entry.slug}>
              <Link
                href={`/library/${entry.slug}`}
                className="group grid gap-2 py-5 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)_auto] md:items-baseline md:gap-8"
              >
                <span>
                  <span className="font-serif text-2xl leading-none text-charcoal group-hover:text-founder-green">
                    {entry.name}
                  </span>
                  <span className="mt-1 block text-[0.6875rem] uppercase tracking-[0.18em] text-bronze-ink">
                    {entry.kind}
                  </span>
                </span>
                <span className="text-charcoal/80">
                  {entry.standfirst}
                  <span className="mt-1 block text-[0.8125rem] text-charcoal/55">
                    In{" "}
                    {entry.products.map((p, i) => (
                      <span key={p.href}>
                        {i > 0 && (i === entry.products.length - 1 ? " and " : ", ")}
                        {p.name}
                      </span>
                    ))}
                  </span>
                </span>
                <span className="md:justify-self-end">
                  <EvidenceMark evidence={entry.study.evidence} tone="paper" />
                </span>
              </Link>
            </li>
          ))}
        </ol>

        <p className="mt-10 max-w-prose text-[0.8125rem] leading-relaxed text-charcoal/60">
          Studies are cited as research on an ingredient. None of them tested a FOUNDER product,
          and the concentration in any product is the supplier’s. These are cosmetics, not
          medicine: nothing here treats, prevents or protects against anything, and none of our
          products is a sunscreen.
        </p>
      </EditorialRoomSection>
    </div>
  );
}
