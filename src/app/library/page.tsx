import type { Metadata } from "next";
import Link from "next/link";
import { EditorialRoomSection } from "@/components/house/EditorialRoomSection";
import { EmeraldDoorPortal } from "@/components/house/EmeraldDoorPortal";
import { RoomHero } from "@/components/house/RoomHero";
import { Shelf } from "@/components/library/Shelf";
import { EvidenceMark } from "@/components/library/EvidenceMark";
import { JsonLd, breadcrumbSchema } from "@/lib/seo";
import { LIBRARY, LIBRARY_HERO, libraryByProduct } from "@/lib/library";
import { getRoom } from "@/lib/rooms";

/**
 * THE LIBRARY — the reading room.
 *
 * 11 September 2026, second pass: it became a room. You arrive through the
 * library's own frame — Shelby's render of the green shelves, the brass
 * lamp, the marble desk with the journal and the key — the copy laid over it
 * like every other room in the house. The A–Z index is the shelf itself:
 * every ingredient a book you pull, colour-coded by kind. Below it, the
 * bottles you own, each with its ingredients. At the foot, the emerald doors
 * into the FOUNDER Collection, because a reading room should let you out
 * somewhere.
 *
 * Not a room in the loop: the rail counts seven and this is a door off the
 * hall, so it takes the house surfaces without HouseShell. Everything here
 * renders on the server; the shelf's pull is CSS and the doors are a link.
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
  const collection = getRoom(4);

  return (
    <div className="room-dark">
      <JsonLd schema={[breadcrumbSchema([{ name: TITLE, path: "/library" }])]} />

      <RoomHero
        src={LIBRARY_HERO.src}
        mobileSrc={LIBRARY_HERO.mobileSrc}
        alt={LIBRARY_HERO.alt}
        position="50% center"
        height="min-h-[82svh]"
        priority
        label="The Library · Off the hall"
        title="Read what you’re wearing."
        lede="Every ingredient on a FOUNDER label has a page here — what it is, what it does in the bottle, and one peer-reviewed study on the ingredient, cited as research, never as a promise."
      >
        <a href="#the-shelf" className="btn btn-primary">
          Pull a book from the shelf <span aria-hidden>↓</span>
        </a>
        <a href="#by-product" className="btn btn-ghost-light">
          Start with a product
        </a>
      </RoomHero>

      {/* ---- The shelf ----
          The index, as the room shelves it. Panel surface: emerald and brass
          like the joinery in the frame above, so the shelf reads as the same
          wall continuing below the fold. */}
      <EditorialRoomSection surface="panel" id="the-shelf" className="scroll-mt-24">
        <div className="shell">
          <p className="eyebrow text-champagne">The shelf</p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-cream md:text-5xl">
            Every ingredient in the house.
          </h2>
          <p className="mt-4 max-w-prose text-cream/75">
            Fifteen books, one per ingredient, in alphabetical order. Green cloth for the
            water-holders and barrier lipids, Desert Rose for the antioxidants, cream for the
            botanicals. Pull one.
          </p>
          <div className="mt-10">
            <Shelf entries={index} />
          </div>
          <p className="mt-6 text-[0.6875rem] uppercase tracking-[0.2em] text-cream/45">
            Hover to pull · click to open the reading
          </p>
        </div>
      </EditorialRoomSection>

      {/* ---- By product ---- */}
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
                          <span className="mt-1">
                            <EvidenceMark evidence={entry.study.evidence} tone="room" />
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>

          <p className="mt-12 max-w-prose text-[0.8125rem] leading-relaxed text-cream/55">
            The mark beside each entry says what kind of study is cited — a randomised human
            trial is the strongest; a laboratory study is a mechanism, not a result on people.
            Studies are cited as research on an ingredient. None of them tested a FOUNDER
            product, and the concentration in any product is the supplier’s. These are
            cosmetics, not medicine: nothing here treats, prevents or protects against anything,
            and none of our products is a sunscreen.
          </p>
        </div>
      </EditorialRoomSection>

      {/* ---- The doors out ---- */}
      <EditorialRoomSection surface="marble" tight>
        <div className="shell grid items-center gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          <div>
            <p className="room-label">Next door</p>
            <h2 className="headline-house mt-5 text-balance text-cream">
              Now go and hold the room.
            </h2>
            <p className="mt-4 max-w-prose text-cream/75">
              You’ve read the ingredients. The boardroom is through the doors, and the
              collection is on the table.
            </p>
          </div>
          <EmeraldDoorPortal
            href={collection.href}
            through={collection.hero.src}
            throughAlt={collection.hero.alt}
            label="Enter the FOUNDER Collection"
            eyebrow={`Room 04 · ${collection.name}`}
          />
        </div>
      </EditorialRoomSection>
    </div>
  );
}
