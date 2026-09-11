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

export function Shelf({ entries }: { entries: LibraryEntry[] }) {
  return (
    <div className={s.shelfWrap}>
      <ul className={s.row} aria-label="Ingredients, A to Z">
        {entries.map((e, i) => (
          <li key={e.slug}>
            <Link
              href={`/library/${e.slug}`}
              className={`${s.book} ${CLOTH[e.kind] ?? s.botanical}`}
              style={{ "--h": HEIGHTS[i % HEIGHTS.length] } as CSSProperties}
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
