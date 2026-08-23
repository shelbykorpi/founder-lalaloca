# The brand board

**FOUNDER Master Brand Board v2.14 — SOURCE OF TRUTH.**
Lives in the Claude project *Founder*, at `claude/founder-master-brand-board.md`.

v2.14 arrived on 11 August 2026, first as a 61-page PDF and then as an HTML
edition of the same board. Project docs can only be text, so the project holds
the board's words — searchable, taken from the HTML because the PDF extraction
broke its multi-column layout — and Shelby holds the visual document. **The
brand system did not change in v2.14:** that section is still headed "Master
Wordmark · v2.13". What v2.14 adds is a pre-sale product appendix, covered at
the foot of this file.

That file is the reference. This one exists so the codebase has something
diffable to check itself against, because a 61-page board is not something a
code review can read.

**When the two disagree, the board wins** — except where the board itself
defers to the site, which it does explicitly for colour hierarchy, navigation,
photography and customer-facing facts: *"www.founderbeauty.co controls the
current theme, digital experience, public mission language, photography system,
navigation, product presentation, and customer-facing facts."*

Superseded: **v2.7** and `founder-monogram-lattice-board.pdf` (9 August), then
the **v2.13 HTML** (11 August).

---

## What the board locks

### The master wordmark

FOUNDER over BEAUTY. Not FOUNDER alone, and not FOUNDER with the monogram.

| | |
|---|---|
| FOUNDER | Cormorant Garamond Regular 400, uppercase, natural kerning |
| BEAUTY | Jost Regular 400, uppercase, tracked ~`.48em`, centred beneath, 38–42% of the FOUNDER width |
| Retina master | 600 × 224 px |
| Display | 150 × 56 px desktop · 130 × 49 px mobile |
| Clear space | the cap height of the F, every side |
| Below 110 px wide | one-colour lockup, and check BEAUTY is still legible |

Prohibited: stretch, condense, tilt, outline, bevel, emboss, drop shadow ·
substituting a generic luxury serif · changing the word BEAUTY, its case or its
tracking · placing it on a vivid LALALOCA SKU colour without a Cream or Founder
Green holding field · **attaching the F-key emblem, a crown, circle, door icon
or any flourish to the wordmark** · the retired wide-tracked Jost-only FOUNDER.

### The F-key monogram

A **secondary** identifier, for compact use. Eight approved
foreground-and-field pairings; geometry is fixed and proprietary.

Prohibited: redraw, simplify, widen, rotate, mirror, crop, outline · adding a
crown, ring, second key, doorway, flourish, shadow, bevel or glow · typesetting
an F and adding key teeth · metallic gradients at small size · **fusing the
monogram to FOUNDER, BEAUTY, FOUND HER or LALALOCA** · any repeat, lattice or
all-over pattern.

### Colour

Nine tokens, eight wordmark colourways. **Do not invent a ninth colourway.**

| Token | Hex | In the codebase |
|---|---|---|
| Founder Green | `#164D49` | yes |
| Champagne Cream | `#F7EFE8` | yes |
| Desert Pink / Rose | `#D8A7A0` | yes |
| Charcoal | `#2A2928` | yes |
| Black | `#000000` | yes |
| Deep Emerald (web surface) | `#0A2523` | yes |
| Champagne Gold | `#D6BE9A` | yes, as of 11 Aug |

Two notes carried from the board: `#164F4C` appears in photographed doors after
grading and is a photographic outcome, **not a new token**; and *"do not turn
every section green."*

### Type

Cormorant Garamond and Jost only. Cormorant for editorial emotion and product
naming, Jost for navigation, commerce, explanation and trust. Body standard is
**Jost Regular 400, not Light**. No all-caps Cormorant for interface labels —
the protected wordmark is the only all-caps Cormorant lockup. Italic Cormorant
is for selective emphasis, not the default subhead.

### Protected language

`OPEN THE DOOR. / THE ROOM IS YOURS.` is a protected central campaign lockup and
is always set on two lines. *"Open the Door. Own the Room."* survives only as an
alternate exploratory line — it is not the master statement.

### Brand layers, unchanged

FOUNDER is the name on the door · LALALOCA is the collection inside (Thirst
Trap, C Me Glow, Bounce Back) · FOUND HER is the stories platform, and takes
Desert Rose as its signature. *"Desert Rose never replaces Founder Green as the
primary brand field. It warms the room; it is not the room."*

---

## Conformance

Brought into line on 11 August 2026.

**The master lockup is now FOUNDER over BEAUTY.** `src/components/site/Wordmark.tsx`,
used by the header and the footer. Both halves are live type: FOUNDER in
Cormorant Garamond 400 uppercase at `.005em`, BEAUTY in Jost 400 at `.48em`.
Both faces are already loaded through `next/font/google` in `layout.tsx`, so
this costs nothing.

**The letterforms were wrong until 11 August.** FOUNDER was being painted from
`public/brand/founder-wordmark.svg` — outlines lifted from
`founder-horizontal-cream.svg` — on the reasoning that live text would be
"substituting a generic luxury serif". That reasoning was backwards. Those
outlines are the wide-tracked, low-contrast treatment the board retires by name:
*"Do not use the retired widely tracked Jost-only FOUNDER treatment as the master
logo."* The generic-serif prohibition is about substituting some **other** serif
for Cormorant Garamond; Cormorant Garamond is the specification itself.

`founder-wordmark.svg`, `founder-horizontal-*.svg` and `founder-stacked-*.svg`
are all that retired treatment. Nothing references them now and nothing should
paint the master logo from them again.

Measured in the browser, not asserted:

| | Board | Built |
|---|---|---|
| Lockup width, desktop | 150 px | 150.8 px |
| Lockup width, mobile | 130 px | 130.6 px |
| BEAUTY as a share of FOUNDER | 38–42% | **40.4% / 40.3%** |

The header and footer no longer carry a hand-tuned height. They ask for the
board's width and divide by `FOUNDER_ASPECT`, the wordmark's own measured
6.878:1 ink ratio, so a change of typeface moves the sizes with it rather than
leaving three magic numbers behind.

Every ratio in that file — cap height, ink width, the invisible slack inside each
line box — was read off Chromium's text metrics for the two loaded webfonts, not
estimated. An earlier attempt at BEAUTY measured 37.3%, outside the range and
invisible unless measured. Change a typeface, weight or tracking value and they
have to be re-measured, not recalculated.

**The F-key stacked above FOUNDER is gone**, from the header and the footer. It
was prohibited twice in the board. The F-key remains the secondary mark and is
still used at full size on the concierge doors, which is what it is for.
`founder-stacked-cream.svg` and `founder-stacked-ink.svg` are now unreferenced;
they are left in `public/brand/` rather than deleted, but nothing should call
them again.

**The lockup now uses approved colourways, not one flat colour.** Six of the
board's eight are two-tone, so `Wordmark` takes a separate `beautyClassName`.
The header is **03 · Editorial**, the board's preferred light-background
alternate: Founder Green FOUNDER over Desert Rose BEAUTY on Cream. The footer is
**05 · Evening**: Champagne Gold over Champagne Cream on Charcoal.

The footer had read `text-charcoal` on `bg-charcoal` since the lockup landed —
an invisible logo, and the kind of thing that survives because nobody looks for
a mark they assume is there. It was found by screenshotting the footer rather
than the header.

**Champagne Gold** `#D6BE9A` is now a token, `--color-champagne`. It was the one
board colour with no counterpart in the codebase, and it is in colourway 01, the
default master.

**`BRAND.monogram`** read `"L"` with a comment describing a mirrored door pair.
It is `"F"`.

### Still open

- Desert Rose BEAUTY on Cream is roughly 1.9:1 against its field. Logotypes are
  exempt from WCAG 1.4.3 and the lockup is `aria-hidden` inside a labelled link,
  so this is not a conformance failure — but it is the board's own pairing, and
  worth a look at 130 px on a phone before launch.
- The site's golds are a metallic ramp (`#C79B5B` → `#8A6335`) rather than the
  flat `#D6BE9A`. The token exists now; whether the ramp should be replaced by
  it anywhere is a design decision, not a conformance one.
- No approved Open Graph image for `/young-founders-room`.
- The board says of the F-key: *"Do not … mirror"*. The concierge doors use a
  mirrored pair, specified in the build brief and matching the door system
  already on the site. The two documents disagree; the board is the one to
  settle it.

## Rules of use

Read the board before changing anything visual: a colour, the logo, type,
campaign language, or photography direction.

If a change genuinely requires departing from it, the board is updated first and
a new version replaces `claude/founder-master-brand-board.md`. There is one
board. Superseded versions are not kept alongside it — that is how a team ends
up building from v2.7.

---

## v2.14: the pre-sale product concepts, and why none of it is on the site

v2.14 adds three products beyond the LALALOCA serums:

| | | |
|---|---|---|
| 01 · THE OPENER | **OPENING LINE** | hydrating daily cleanser, 150 ml pump |
| 02 · THE ANCHOR | **HOLD THE ROOM** | peptide moisturizer, 50 ml airless pump |
| 03 · THE SIGNATURE | **SIGN HERE** | conditioning lip treatment, 5 ml, fountain-pen silhouette |

**Nothing here goes on founderbeauty.co.** The board says so in its own words —
*"DIRECTION APPROVED / PRODUCTION NOT YET LOCKED"* — and its governance page
lists what has to be closed first: final formula and full INCI, safety and
stability documentation, component and leakage testing, claims, directions,
warnings, net contents and regulatory artwork, trademark clearance, price,
fulfilment timing and pre-sale disclosures.

A cosmetic with no INCI and no stability data does not get a product page, a
price or a pre-order button, however finished the renders look. When that list
is closed, this is a real piece of work: three SKUs, a second collection
alongside LALALOCA, and a naming system that already reads.

THE FIRST MOVE, SOFT POWER and THE LAST WORD are archive naming and are
explicitly not current. Do not let them back into copy.

### Amendment · 16 Aug 2026 — THE ANCHOR is sourced, and its spec changed

**HOLD THE ROOM** has been sourced from Blanka ("Extreme Moisture Blend",
SKU 100249-BLNK-MB-03-02-HM-SM3D). The formula is not the peptide cream the
board imagined:

| | v2.14 spec | As sourced |
|---|---|---|
| Size | 50 ml airless pump | **30 ml / 1 fl oz** airless pump |
| Actives | peptides | **chamomile extract, witch hazel** |
| INCI | outstanding | **published** — transcribed in `src/lib/founderCollection.ts` |
| Origin | — | Made in North America |
| Retail | outstanding | **$34.00** |

**The name was kept and the spec was amended.** The v2.14 naming system
assigns a name to a slot — OPENER / ANCHOR / SIGNATURE — not to a formula, so
a different cream in the anchor slot is still HOLD THE ROOM. Renaming would
have broken a system that already reads, and invented a fourth name for no
gain.

**Still open before it can be sold**, from the governance list above:
stability documentation, component and leakage testing, regulatory artwork
(net contents, warnings, directions), trademark clearance, fulfilment timing.
Until every one is closed the product record carries `sellable: false`, the
page shows no buy path, and no Shopify variant is wired. Flip all three in a
single commit or the site and the till will disagree.

Note for copy: the INCI includes **fragrance** and **petrolatum**. The
brand's serum copy leans on gentleness and patch testing, so the moisturizer
says plainly that it is fragranced rather than leaving a customer to discover
it. That FAQ is deliberate — do not soften it.


## Amendment — one price, 23 August 2026

The board's $39.99 serum / $98.99 trio pricing is superseded. Shelby set the
price at **$38.00 per serum and $98.00 for the trio** on 23 August 2026 —
matching what Shopify has charged since at least 15 August and what every
customer has actually paid. Shopify is the single source of truth for price;
site copy and repo docs no longer carry their own figures, and any document
still showing $39.99/$98.99 is stale, not authoritative.

## Amendment — Hold the Room preorder, decided 19 August, reaffirmed 23 August 2026

The paragraph above ("Still open before it can be sold") is overridden by a
founder decision: Shelby chose on 19 August 2026 to sell Hold the Room as a
preorder with the verification gates still open, and reaffirmed that on
23 August when asked directly. The page carries a preorder notice above the
button correcting the shipping promise. The gates themselves remain open work,
not cancelled work: stability documentation, component and leakage testing,
regulatory artwork, trademark clearance, fulfilment timing.
