import type { LibraryEvidence } from "@/lib/library";

/**
 * EVIDENCE MARK — what kind of study sits under an entry, said in three words.
 *
 * Three marks, three strengths, no colour coding: a traffic light would rank
 * the ingredients, and the point is to be honest about the paper, not to
 * grade the botanical. Rose diamond for a human trial, so the strongest reads
 * at a glance; a plain diamond for the rest. Two tones, because the mark sits
 * on both the paper index and the dark reading pages, and Antique Gold fails
 * as small type on either — Bronze Ink on paper, Champagne on night.
 */
export function EvidenceMark({
  evidence,
  tone = "paper",
}: {
  evidence: LibraryEvidence;
  tone?: "paper" | "room";
}) {
  const strongest = evidence === "Randomised human trial";
  const ink = tone === "room" ? "text-champagne" : "text-bronze-ink";
  const diamond = strongest ? "text-rose" : tone === "room" ? "text-cream/40" : "text-charcoal/30";
  return (
    <span className={`inline-flex items-center gap-2 whitespace-nowrap text-[0.6875rem] uppercase tracking-[0.18em] ${ink}`}>
      <span aria-hidden className={`text-[0.55rem] ${diamond}`}>
        ◆
      </span>
      {evidence}
    </span>
  );
}
