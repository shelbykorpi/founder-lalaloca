# The brand board

**FOUNDER Master Brand Board v2.13 — SOURCE OF TRUTH.**
Lives in the Claude project *Founder*, at `claude/founder-master-brand-board.html`.

That file is the reference. This one exists so the codebase has something
diffable to check itself against, because a 2 MB HTML board with fourteen
embedded images is not something a code review can read.

**When the two disagree, the board wins** — except where the board itself
defers to the site, which it does explicitly for colour hierarchy, navigation,
photography and customer-facing facts: *"www.founderbeauty.co controls the
current theme, digital experience, public mission language, photography system,
navigation, product presentation, and customer-facing facts."*

Superseded on 9 August 2026: **v2.7**, which was the project doc until now, and
`founder-monogram-lattice-board.pdf`, which was the repeat-pattern board. The
lattice is retired by name in v2.13.

---

## What v2.13 locks

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
| **Champagne Gold** | **`#D6BE9A`** | **no — see below** |

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

## Where the shipped site does not match

Recorded, not fixed. Each of these is a visible design decision and belongs to
Shelby, not to a commit.

**1. The header lockup.** `Header.tsx` renders
`/brand/founder-stacked-cream.svg` — the F monogram centred above FOUNDER. v2.13
prohibits that construction twice, in two different sections: *"Do not attach
the F-key emblem … to this wordmark"* and *"Do not … fuse the monogram to
FOUNDER, BEAUTY, FOUND HER, or LALALOCA."* The approved master is FOUNDER over
BEAUTY.

This one is awkward on purpose: the stacked mark was built to a direct
instruction on 8 August, and the board that supersedes it is dated after. It
needs a decision, not a patch.

**2. No FOUNDER/BEAUTY asset exists.** `public/brand/` has the stacked and
horizontal FOUNDER lockups, the F-key and the icons. Nothing in it sets BEAUTY
beneath FOUNDER, so the approved master cannot currently be rendered.

**3. Logo display size.** The header shows the mark at 64 px mobile / 80 px
desktop. The spec is 56 px desktop / 49 px mobile at the locked aspect ratio.
The current mark is a different shape, so the numbers are not directly
comparable — but they will need setting once the lockup is right.

**4. Champagne Gold is missing.** `#D6BE9A` is in the wordmark system —
including colourway 01, the default master — and appears nowhere in the
codebase. The site's golds are `#C79B5B`, `#B08A64`, `#A37C53`, `#8A6335` and
`#EAD3C3`, a metallic ramp rather than the flat token.

**5. `BRAND.monogram` is stale.** `src/lib/brand.ts` still reads `monogram: "L"`
with a comment describing a mirrored door pair. The mark is the F-key.

---

## Rules of use

Read the board before changing anything visual: a colour, the logo, type,
campaign language, or photography direction.

If a change genuinely requires departing from it, the board is updated first and
a new version replaces `claude/founder-master-brand-board.html`. There is one
board. Superseded versions are not kept alongside it — that is how a team ends
up building from v2.7.
