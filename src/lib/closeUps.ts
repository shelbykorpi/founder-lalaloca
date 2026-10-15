/**
 * Real-life close-ups for each product page (15 Oct 2026).
 *
 * Source: Shelby's Lightroom album "shelby/natalie" — two 2025 beach shoots,
 * Shelby and Natalie. Shelby confirmed both women are cleared for commercial
 * use on product pages. No FOUNDER or LALALOCA product appears in any frame,
 * so these are mood and skin, never a result: the band says so in plain
 * words, and no caption ties a photograph to an ingredient or an outcome.
 * Cropped to 3:4 only (no retouching, no colour work beyond the album's own).
 * The Lightroom frame numbers are kept so a swap can be traced back.
 */
export type CloseUp = { src: string; alt: string; caption: string };

const SHELBY = "Shelby, founder";
const NATALIE = "Natalie, model";

export const CLOSE_UPS: Record<string, [CloseUp, CloseUp]> = {
  // DSCF2517 · DSCF1507
  "opening-line": [
    { src: "/editorial/close-ups/opening-line-1.webp", alt: "Shelby in close-up in late sun, blonde waves loose around her face, looking just past the camera.", caption: SHELBY },
    { src: "/editorial/close-ups/opening-line-2.webp", alt: "Natalie in close-up, dark hair pinned back, fingertips resting at her jaw, turned toward the light.", caption: NATALIE },
  ],
  // DSCF1503 · DSCF2522
  "clean-break": [
    { src: "/editorial/close-ups/clean-break-1.webp", alt: "Natalie in close-up, one hand against her cheek, looking straight into the camera.", caption: NATALIE },
    { src: "/editorial/close-ups/clean-break-2.webp", alt: "Shelby in close-up on the beach, a hand lifting her hair, sea and sky behind her.", caption: SHELBY },
  ],
  // DSCF2520 · DSCF2828
  "hold-the-room": [
    { src: "/editorial/close-ups/hold-the-room-1.webp", alt: "Shelby in three-quarter close-up, fingertips at her jaw, warm late light on her skin.", caption: SHELBY },
    { src: "/editorial/close-ups/hold-the-room-2.webp", alt: "Shelby's face striped with the shadow of palm fronds, looking into the camera.", caption: SHELBY },
  ],
  // DSCF1325 · DSCF2987
  "double-take": [
    { src: "/editorial/close-ups/double-take-1.webp", alt: "Natalie holding a white conch shell over one eye, the other eye looking straight into the camera.", caption: NATALIE },
    { src: "/editorial/close-ups/double-take-2.webp", alt: "Shelby with her eyes closed, face tilted into the sun.", caption: SHELBY },
  ],
  // DSCF2524 · DSCF2821
  "smooth-talker": [
    { src: "/editorial/close-ups/smooth-talker-1.webp", alt: "Shelby in a tight close-up, a hand in her hair, looking down the lens.", caption: SHELBY },
    { src: "/editorial/close-ups/smooth-talker-2.webp", alt: "Shelby in close-up under the striped shade of palm fronds, lips parted.", caption: SHELBY },
  ],
  // DSCF1233 · DSCF1262
  "c-me-glow": [
    { src: "/editorial/close-ups/c-me-glow-1.webp", alt: "Natalie framed by two orange halves, one at her brow and one at her cheek.", caption: NATALIE },
    { src: "/editorial/close-ups/c-me-glow-2.webp", alt: "A close-up of Natalie's lips biting into a slice of orange.", caption: NATALIE },
  ],
  // DSCF2985 · DSCF1338
  "thirst-trap": [
    { src: "/editorial/close-ups/thirst-trap-1.webp", alt: "Shelby in profile in low sun, light catching her cheekbone, palm shadows at her neck.", caption: SHELBY },
    { src: "/editorial/close-ups/thirst-trap-2.webp", alt: "Natalie holding a white conch shell beside her face, rocks and surf behind her.", caption: NATALIE },
  ],
  // DSCF1517 · DSCF2830
  "bounce-back": [
    { src: "/editorial/close-ups/bounce-back-1.webp", alt: "Natalie in profile, looking over her shoulder, the line of her jaw and neck in the light.", caption: NATALIE },
    { src: "/editorial/close-ups/bounce-back-2.webp", alt: "Shelby in close-up through the shadow of palm fronds, looking into the camera.", caption: SHELBY },
  ],
};
