# The Young Founders' Room

`/young-founders-room` · nav label **Young Founders' Room** · built 9 August 2026.

The page tells how young people at the StandUp for Kids Tucson Outreach Center
helped shape the first LALALOCA Collection, and carries the monthly commitment:
**20% of net profits, every month, directly to StandUp for Kids Tucson.**

---

## Photographs still needed

**Nothing in this page invents a picture of a young person, and nothing should.**
Four slots are wired and empty. Each checks for its file at build time; a
missing one renders nothing and the column it would have filled collapses, so
the page reads correctly today and improves the moment a file lands. Drop the
named file in and rebuild — no code change.

| File | What it should show | Shape |
|---|---|---|
| `public/editorial/young-founders/outreach-team.webp` | Hero. Shelby with the outreach team outside the Outreach Center. | landscape, 4:3 |
| `public/editorial/young-founders/shelby-volunteer.webp` | Shelby's note. The volunteer portrait. | portrait, 3:4 |
| `public/editorial/young-founders/collaboration-table.webp` | Samples and packaging on the table during a feedback session. | landscape, 4:3 |
| `public/editorial/young-founders/grit-and-gratitude-gala.webp` | The Grit & Gratitude Gala. | landscape, 4:3 |

Alt text is already written for each and describes what is happening in general
terms. **No young person is named anywhere on this page and none should be
added.** If a photograph shows a young person's face, that is a release
question before it is a code question.

---

## The threshold

`src/components/young-founders/Threshold.tsx` + `threshold.module.css`.

Two Founder Green leaves hinged on their outer edges, each carrying the
approved F-key — normal on the left, mirrored on the right, both facing the
brass seam. The marks are children of the leaves, so they swing with the doors.

**The monogram is not redrawn.** It is painted through a CSS mask over
`/brand/founder-f-monogram.svg`, so the geometry comes from the approved file at
runtime and Antique Gold `#B08A64` is applied as colour only. Replace the file
and the doors follow it.

| | |
|---|---|
| First visit, desktop | 2600 ms |
| First visit, mobile | 1800 ms, shallower perspective, less camera travel |
| Repeat visit in the same session | 700 ms — the doors open, nothing settles |
| `prefers-reduced-motion` | the overlay never mounts. Immediate reveal. |
| Session key | `founder_young_founders_threshold_seen_v1` |

Session storage, not local storage: someone returning next week is arriving
again and should see the door. The flag dies with the tab.

The whole sequence is one CSS animation run driven by a `--dur` custom
property, with keyframe percentages set to the storyboard, so the phases cannot
drift apart. Only `transform` and `opacity` animate.

### Two things worth knowing before editing it

**Do not `return null` on the server.** It did, and the CSS module was then
never linked into the page — the overlay mounted after hydration with no styles
at all, a bare "Skip entrance" button shoving the hero down the page for 2.6
seconds on every first visit. It now always renders at least a `display:none`
element. Found by probing the built page every 150 ms, not by a screenshot.

**The opening curve is not the shared `--ease`.** That curve is front-loaded,
which is right for a dissolve and wrong for a hinge: it put the leaves edge-on
in the first third of their travel and the swing read as a snap.

---

## Accessibility

- Visible **Skip entrance** control, focused as soon as the overlay opens, so
  the first Tab or Enter reaches it.
- `Escape` also skips.
- Focus moves to the page `h1` when the entrance ends, however it ends.
- Doors and light are `aria-hidden`; the overlay is `role="presentation"`.
- Focus is **not** trapped — the page behind stays reachable.
- Body scroll is locked only while the entrance is running and restored in the
  effect cleanup, so it comes back on navigation, error or unmount too.
- The overlay unmounts; it never lingers as an invisible click target.
- No sound.

---

## Analytics

Through the existing `track()` in `src/lib/analytics.ts`. Seven events, none
carrying anything about a visitor or about a young person:

`young_founders_nav_click` · `young_founders_door_started` ·
`young_founders_door_completed` · `young_founders_door_skipped` ·
`young_founders_shop_click` · `young_founders_learn_click` ·
`young_founders_donate_click`

`door_completed` also fires for reduced-motion visitors, so the numbers are not
quietly missing everyone who never sees the doors.

---

## Links

| CTA | Destination |
|---|---|
| Shop LALALOCA / Shop the LALALOCA Collection | `/shop` |
| Give directly · Donate directly · Learn about StandUp for Kids Tucson | `https://www.standupforkids.org/tucson/` |

External links open in a new tab with `rel="noopener noreferrer"` and a
visually hidden "(opens in a new tab)". No donation URL was invented; the
Tucson chapter page is the only external destination on the page.

---

## Wording that is not ours to edit

The section copy is Shelby's, supplied verbatim. Two rules:

1. **20% of net profits.** It appears four times and must be the same number in
   all four. An earlier draft said 10%.
2. **"Net profits" is not defined here**, and no legal or accounting language
   has been added around it. That wording is approved as written; a gloss added
   in a commit is a claim nobody signed off.

---

## Open

- The four photographs above.
- An approved Open Graph image for this page; it currently inherits the site
  default.
- **A note on the brand board.** v2.13 says of the F-key: *"Do not redraw,
  simplify, modernize, widen, shorten, rotate, mirror, crop, outline, or stretch
  the F-key."* The mirrored pair on these doors was explicitly specified in the
  build brief and matches the existing FOUNDER door system elsewhere on the site
  — but it does sit against that line as written. Worth reconciling in the board
  rather than leaving the two documents disagreeing.
