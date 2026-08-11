/**
 * The FOUNDER / BEAUTY master lockup.
 *
 * Master Brand Board v2.14, "The name is the mark":
 *
 *   FOUNDER   Cormorant Garamond Regular 400, uppercase, natural kerning and
 *             only restrained optical adjustment. "Do not substitute Jost, use
 *             Light 300, add artificial wide tracking, or alter the letterforms."
 *   BEAUTY    Jost Regular 400, uppercase, tracked ~.48em, centred beneath
 *             FOUNDER, sized to roughly 38–42% of the wordmark width.
 *
 * ── BOTH HALVES ARE TYPE. THAT IS THE CORRECTION. ───────────────────────────
 *
 * An earlier version of this file set FOUNDER as artwork — outlines lifted from
 * founder-horizontal-cream.svg and painted through a CSS mask — on the reasoning
 * that live text would be "substituting a generic luxury serif". That reasoning
 * was backwards, and the letterforms it shipped were wrong.
 *
 * Those outlines are the wide-tracked, low-contrast treatment the board retires
 * by name: "Do not use the retired widely tracked Jost-only FOUNDER treatment as
 * the master logo." The generic-serif prohibition is about substituting some
 * OTHER serif for Cormorant Garamond. Cormorant Garamond is not the substitute;
 * it is the specification. Setting it live is compliance, not a shortcut.
 *
 * So: `public/brand/founder-wordmark.svg`, `founder-horizontal-*.svg` and
 * `founder-stacked-*.svg` are all the retired treatment. Nothing should paint
 * the master logo from them again.
 *
 * ── WHY THE NUMBERS BELOW ARE MEASURED AND NOT DERIVED ──────────────────────
 *
 * The board specifies BEAUTY as a WIDTH — a share of FOUNDER's — and specifies a
 * display size in pixels. Neither is something you can set on tracked text and
 * have come out true. Every ratio here was read off Chromium's own text metrics
 * for the two loaded webfonts (canvas measureText, ink box, at 100px), so they
 * describe the fonts rather than an estimate of them. Change a typeface, a
 * weight or a tracking value and they have to be re-measured, not recalculated.
 *
 * ── WHAT THIS REPLACED ──────────────────────────────────────────────────────
 *
 * The F-key stacked above FOUNDER. The board prohibits that construction twice:
 * "Do not attach the F-key emblem … to this wordmark" and "Do not … fuse the
 * monogram to FOUNDER, BEAUTY, FOUND HER, or LALALOCA." The F-key is the
 * secondary mark, which is how the concierge doors use it.
 */

/**
 * Cormorant Garamond 400, uppercase. Measured ink box at font-size 100px:
 * 65px above the baseline (cap height) and 2px below it (the round overshoot on
 * O, D and C). So the visible height of the word is 0.67 of its font size, and
 * the remaining 0.33 sits as slack — symmetrically, at line-height 1 — above and
 * below it.
 */
const FOUNDER_INK = 0.67;
const FOUNDER_SLACK = 0.165;

/**
 * The board's tracking for FOUNDER: restrained optical adjustment, not tracking.
 * This is the value the board's own document renders the wordmark at.
 */
const FOUNDER_TRACKING = 0.005;

/** Jost 400 at .48em. Ink height is 0.74 of the font size; slack above it 0.105. */
const BEAUTY_SLACK = 0.105;
const BEAUTY_TRACKING = 0.48;

/**
 * BEAUTY's font size, as a multiple of FOUNDER's ink height.
 *
 * Measured ink widths at font-size 100px: FOUNDER 460.8px at .005em, BEAUTY
 * 576.9px at .48em. FOUNDER's ink is therefore 6.878 times as wide as it is
 * tall, and landing BEAUTY at the middle of the board's 38–42% window means
 *
 *     0.40 × 6.878 ÷ 5.769 = 0.477
 *
 * Verified in the browser after the fact, not trusted from the arithmetic.
 */
const BEAUTY_SIZE = 0.477;

/**
 * FOUNDER's ink width, as a multiple of its ink height. Exported because the
 * board sizes the lockup by width — 150px desktop, 130px mobile — and the header
 * and footer have to work back from that to a height.
 */
export const FOUNDER_ASPECT = 6.878;

/**
 * The visible gap between the underside of FOUNDER and the cap line of BEAUTY,
 * as a multiple of FOUNDER's ink height. Both words carry invisible slack inside
 * their own line boxes, so the margin that produces this gap is computed below
 * rather than being this number.
 */
const GAP = 0.356;

export function Wordmark({
  /** Visible height of the word FOUNDER — ink, not line box — in px. */
  height = 34,
  /** Any Tailwind text colour. FOUNDER takes it, and BEAUTY inherits it. */
  className = "",
  /**
   * BEAUTY's colour, when the colourway gives it its own. Six of the board's
   * eight approved colourways are two-tone — 03, the light-surface alternate,
   * is Founder Green over Desert Rose — so a single-colour lockup can only ever
   * be 02 or one of the reduced pairs. Leave unset to inherit `className`.
   */
  beautyClassName = "",
  /**
   * The accessible name. Set to "" when the lockup sits inside a link that is
   * already labelled, so a screen reader does not hear the brand twice.
   */
  label = "FOUNDER Beauty",
}: {
  height?: number;
  className?: string;
  beautyClassName?: string;
  label?: string;
}) {
  const founderSize = height / FOUNDER_INK;
  const beautySize = height * BEAUTY_SIZE;

  /* Close the two invisible gaps — the slack under FOUNDER and the slack over
     BEAUTY's caps — so what is left is the gap you can actually see. */
  const gap =
    GAP * height - FOUNDER_SLACK * founderSize - BEAUTY_SLACK * beautySize;

  return (
    <span
      className={`inline-flex flex-col items-center leading-none ${className}`}
      role="img"
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
    >
      <span
        aria-hidden
        style={{
          fontSize: founderSize,
          letterSpacing: `${FOUNDER_TRACKING}em`,
          /* Tracking is applied after the final letter too, which pushes the
             visible word left of centre. A matching pad puts it back. */
          paddingLeft: `${FOUNDER_TRACKING}em`,
          fontWeight: 400,
          lineHeight: 1,
        }}
        className="block font-serif uppercase"
      >
        Founder
      </span>

      <span
        aria-hidden
        style={{
          marginTop: gap,
          fontSize: beautySize,
          letterSpacing: `${BEAUTY_TRACKING}em`,
          paddingLeft: `${BEAUTY_TRACKING}em`,
          fontWeight: 400,
          lineHeight: 1,
        }}
        className={`block font-sans uppercase ${beautyClassName}`}
      >
        Beauty
      </span>
    </span>
  );
}
