/**
 * AMBIENT LIGHTING — the fire and the candle, and the pink in the air.
 *
 * Two very faint radial washes over a section: a warm flicker low on the
 * right (the fire, the lamp) and a slow breath of desert pink high in the
 * frame (the sky through the next door, the silk). Pure CSS, screen-blended,
 * pointer-events off, and static under prefers-reduced-motion. Wrap it
 * around anything that should feel lit from inside the room.
 */
export function AmbientLighting({
  fire = true,
  glow = true,
  className = "",
}: {
  fire?: boolean;
  glow?: boolean;
  className?: string;
}) {
  return (
    <span aria-hidden className={`pointer-events-none absolute inset-0 block overflow-hidden ${className}`}>
      {fire && <span className="ambient-fire" />}
      {glow && <span className="ambient-glow" />}
    </span>
  );
}
