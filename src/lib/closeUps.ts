/**
 * Real-life close-ups for each product page (15 Oct 2026).
 *
 * Source: Shelby's Lightroom album "shelby/natalie" (2025 beach shoots).
 * Natalie only: Shelby asked on 15 Oct for every photograph of herself to be
 * taken out, so none of her frames appear here. Do not add them back.
 * Natalie is cleared for commercial use on product pages (Shelby, 15 Oct).
 * No FOUNDER or LALALOCA product appears in any frame, so these are mood and
 * skin, never a result: the band says so in plain words, and no caption ties
 * a photograph to an ingredient or an outcome. Cropped to 3:4 only (no
 * retouching, no colour work beyond the album's own). The Lightroom file
 * names are kept so a swap can be traced back. The album holds a second
 * import of the same shoot with repeated file names, so check a new pick's
 * name against these before using it.
 */
export type CloseUp = { src: string; alt: string; caption: string };

const NATALIE = "Natalie, model";

export const CLOSE_UPS: Record<string, [CloseUp, CloseUp]> = {
  // DSCF1146 · DSCF1507
  "opening-line": [
    { src: "/editorial/close-ups/opening-line-1b.webp", alt: "Natalie in close-up in late sun, wind lifting her hair, a pale pink dress at one shoulder.", caption: NATALIE },
    { src: "/editorial/close-ups/opening-line-2.webp", alt: "Natalie in close-up, dark hair pinned back, fingertips resting at her jaw, turned toward the light.", caption: NATALIE },
  ],
  // DSCF1503 · DSCF1312
  "clean-break": [
    { src: "/editorial/close-ups/clean-break-1.webp", alt: "Natalie in close-up, one hand against her cheek, looking straight into the camera.", caption: NATALIE },
    { src: "/editorial/close-ups/clean-break-2b.webp", alt: "Natalie on the rocks holding a white conch shell beside her face, the shore behind her.", caption: NATALIE },
  ],
  // DSCF1163 · DSCF1519
  "hold-the-room": [
    { src: "/editorial/close-ups/hold-the-room-1b.webp", alt: "Natalie with her eyes half closed, face turned into warm late light.", caption: NATALIE },
    { src: "/editorial/close-ups/hold-the-room-2b.webp", alt: "Natalie in close-up, fingertips at her neck, glancing to one side.", caption: NATALIE },
  ],
  // DSCF1325 · DSCF1500
  "double-take": [
    { src: "/editorial/close-ups/double-take-1.webp", alt: "Natalie holding a white conch shell over one eye, the other eye looking straight into the camera.", caption: NATALIE },
    { src: "/editorial/close-ups/double-take-2b.webp", alt: "Natalie glancing over her shoulder, a hand at her ear, a gold cuff on her wrist.", caption: NATALIE },
  ],
  // DSCF1147 · DSCF1515
  "smooth-talker": [
    { src: "/editorial/close-ups/smooth-talker-1b.webp", alt: "Natalie in close-up looking straight into the camera, loose strands of hair in the breeze.", caption: NATALIE },
    { src: "/editorial/close-ups/smooth-talker-2b.webp", alt: "Natalie in three-quarter profile, a hand at her hairline.", caption: NATALIE },
  ],
  // DSCF1233 · DSCF1262
  "c-me-glow": [
    { src: "/editorial/close-ups/c-me-glow-1.webp", alt: "Natalie framed by two orange halves, one at her brow and one at her cheek.", caption: NATALIE },
    { src: "/editorial/close-ups/c-me-glow-2.webp", alt: "A close-up of Natalie's lips biting into a slice of orange.", caption: NATALIE },
  ],
  // DSCF1192 · DSCF1338
  "thirst-trap": [
    { src: "/editorial/close-ups/thirst-trap-1b.webp", alt: "Natalie looking back over her shoulder, the surf behind her.", caption: NATALIE },
    { src: "/editorial/close-ups/thirst-trap-2.webp", alt: "Natalie holding a white conch shell beside her face, rocks and surf behind her.", caption: NATALIE },
  ],
  // DSCF1517 · DSCF1166
  "bounce-back": [
    { src: "/editorial/close-ups/bounce-back-1.webp", alt: "Natalie in profile, looking over her shoulder, the line of her jaw and neck in the light.", caption: NATALIE },
    { src: "/editorial/close-ups/bounce-back-2b.webp", alt: "Natalie in close-up, chin lifted, hair blowing across her face in the late sun.", caption: NATALIE },
  ],
};
