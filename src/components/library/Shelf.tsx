import Link from "next/link";
import type { CSSProperties } from "react";
import type { LibraryEntry } from "@/lib/library";
import s from "./shelf.module.css";

/**
 * THE SHELF — every ingredient as a book on the library's own shelf.
 *
 * Server-rendered, no JavaScript: each spine is a plain link into its
 * reading, so the index is crawlable and works without hydration. The pull
 * on hover is CSS. Heights vary a little by position so a row reads as a
 * real shelf rather than a bar chart; the order is alphabetical.
 */

const CLOTH: Record<string, string> = {
  Humectant: s.humectant,
  "Film-forming humectant": s.humectant,
  "Humectant · skin conditioner": s.humectant,
  Antioxidant: s.antioxidant,
  "Antioxidant botanical": s.antioxidant,
  "Soothing botanical": s.botanical,
  "Astringent botanical": s.botanical,
  "Nourishing botanical": s.botanical,
  "Arctic botanical": s.botanical,
  "Plant-cell botanical": s.botanical,
  "Barrier lipid": s.lipid,
  Emollient: s.lipid,
  "Signal peptide": s.peptide,
};

const HEIGHTS = ["15rem", "13.75rem", "15.5rem", "13.25rem", "14.5rem", "15.25rem", "14rem"];
/* Thickness varies the way a real run of books does — a slim monograph beside
   a thick one — and one in eleven leans a degree against its neighbour (a lean at the end of a wrapped row hangs off the ledge, so it is only ever one, early).
   Both are position-based, like the heights, so the shelf is the same on
   every visit. */
const WIDTHS = ["3.3rem", "2.7rem", "3.7rem", "2.5rem", "3.1rem", "3.5rem", "2.9rem", "3.2rem"];
const LEANS = ["0deg", "0deg", "0deg", "-1.4deg", "0deg", "0deg", "0deg", "0deg", "0deg", "0deg", "0deg"];
/* Gilt stamps on the dark cloths; a blind, dark stamp on cream and rose,
   where foil would not read. */
const GILT = new Set([s.humectant, s.lipid, s.peptide]);

export function Shelf({ entries }: { entries: LibraryEntry[] }) {
  return (
    <div className={s.shelfWrap}>
      <ul className={s.row} aria-label="Ingredients, A to Z">
        {entries.map((e, i) => (
          <li key={e.slug}>
            <Link
              href={`/library/${e.slug}`}
              className={`${s.book} ${CLOTH[e.kind] ?? s.botanical} ${GILT.has(CLOTH[e.kind] ?? s.botanical) ? s.gilt : ""}`}
              style={
                {
                  "--h": HEIGHTS[i % HEIGHTS.length],
                  "--w": WIDTHS[i % WIDTHS.length],
                  "--lean": LEANS[i % LEANS.length],
                } as CSSProperties
              }
              aria-label={`${e.name} — ${e.kind}. Open the reading.`}
            >
              <span className={s.title} aria-hidden>
                {e.name}
              </span>
              <span className={s.kind} aria-hidden>
                {e.kind}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
