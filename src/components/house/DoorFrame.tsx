/**
 * The threshold between two rooms.
 *
 * A brass hairline with a sliver of Desert Pink light under it — the glow
 * from whatever is lit on the other side. It replaces the ordinary hard join
 * between full-bleed sections and gives the scroll a sense of passing through
 * something rather than simply arriving at the next block.
 *
 * Decoration with no semantics, so aria-hidden: a screen reader gets the
 * section headings, which is the same information without the theatre. It is
 * a server component — nothing here needs the client.
 *
 * The brief's rule holds: Desert Pink is emitted, never painted. It appears
 * as a two-pixel line of light, not as a field.
 */
export function DoorFrame({ label }: { label?: string }) {
  return (
    <div aria-hidden className="relative bg-emerald-deep">
      <span className="block h-px w-full bg-bronze/35" />
      <span
        className="block h-[2px] w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 4%, rgba(216,167,160,0.55) 26%, rgba(216,167,160,0.9) 50%, rgba(216,167,160,0.55) 74%, transparent 96%)",
        }}
      />
      {label && (
        <span className="room-label absolute left-1/2 top-3 -translate-x-1/2 whitespace-nowrap text-cream/35">
          {label}
        </span>
      )}
      <span className="block h-8" />
    </div>
  );
}
