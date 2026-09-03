# The house — one continuous room, hero to footer

_3 September 2026. Local only: nothing here is committed, pushed or deployed.
Preview it with `npm run build && npm run start` and walk `/` → `/shop` →
`/founder-collection` → `/our-story` → `/found-her` → `/young-founders-room`
and through the last doors back to the lounge._

## The floor plan

`src/lib/rooms.ts` is the single source: seven rooms, their routes, their
frames (wide + purpose-built phone crop), the alt text, and what the doors
at the foot of each page open onto. Room 02 is a beat on the homepage, not a
route; Room 07's doors return to it.

| # | Room | Route | Frame |
|---|---|---|---|
| 01 | The Threshold | `/` | `rooms/threshold-doors` — emerald F doors open onto the firelit lounge |
| 02 | Inside FOUNDER | `/#room-house` | `rooms/inside-founder-lounge` — fireplace, sofa, blazer, the salon glowing through the doors |
| 03 | The Serum Salon | `/shop` | `rooms/serum-salon-doors` — three lit alcoves, mirrors through the doors |
| 04 | The FOUNDER Collection | `/founder-collection` | `rooms/collection-study` — boardroom, doors onto the study |
| 05 | Our Story | `/our-story` | `rooms/our-story-desk-portraits` — the study, doors onto the gallery |
| 06 | Found Her | `/found-her` | `rooms/found-her-hall-doors` — the gallery, doors onto the workroom |
| 07 | The Young Founders’ Room | `/young-founders-room` | `rooms/young-founders-fireplace` — the table, doors back to the fire |

The entrance beat uses `rooms/entrance-vanity` (the dressing-room reference).

## The shared room system (`src/components/house/`)

- **HouseShell** — wraps a room page: `data-room`, the rail, dark ground,
  and the doors into the next room at the foot.
- **RoomHero** — one frame, full bleed, copy on the room's own shadow (left
  ≈35–42%), purpose-built phone crop, ambient light. `room={getRoom(n)}`
  fills src/alt/crop/label from the floor plan.
- **EmeraldDoorPortal** — the one door, drawn once: emerald leaves, brass
  beading and hardware, the gold F painted from `/brand/founder-f-monogram.svg`
  through a CSS mask. A real link; stands ajar so the next room shows,
  eases on hover/focus, swings open (1.4 s) on press, then navigates.
  Reduced motion: navigates at once.
- **NextRoomInvitation** — the end of every page: the next room's number,
  name and doors; a full-width button on phones.
- **RoomProgress** — the rail. Desktop: seven hairline links on the right with
  the current room named vertically. Phones: a pill (“03 · The Serum Salon”)
  that opens an accessible menu of the seven rooms. Escape closes it.
- **RoomTransition / EnterTheHouse** — the entrance beat. Doors part (1.6 s),
  the camera drifts into the dressing room, the three lines arrive (700–900 ms
  each), the scene dissolves into the lounge, the overlay clears on `#room-house`.
  Skip button and Escape; reduced motion jumps straight to the lounge.
- **AmbientLighting** — screen-blended fire flicker and a slow breath of
  desert pink; static under reduced motion.
- **EditorialRoomSection** — the room below the fold: `marble` (default),
  `panel` (emerald paneling with brass lines), `paper` (a cream page lying on
  the marble, for long reading and forms), `scene` (a photograph, darkened).

Colour, type and buttons are the existing tokens (`--color-founder-green`,
`--color-emerald-deep`, `--color-bronze`, `--color-champagne`, `--color-rose`,
Cormorant Garamond / Jost). New CSS lives at the foot of `globals.css` under
“THE HOUSE”.

## What each route now does

- **/** — Threshold hero (SHOP THE SERUMS · ENTER THE HOUSE) → entrance beat
  → Room 02 lounge with the three lines and FOLLOW THE LIGHT ↓ → Collection
  boardroom band → the six-pack shelf → the serum salon (arches) → the three
  serums → Anchor → Found Her (gallery hall) → Notes → the pledge → the
  invitation → the doors into the Serum Salon.
- **/shop** — Salon hero (“Three serums. Three energies.” / “One woman
  building what’s next.”) → the three doors → House Trio parlour (mobile card
  is a paper page) → the tariff card (paper) → StandUp band → the close →
  shipping/returns/plainly on paneling → Founding List → doors into the
  Collection. Bag, prices, add-to-bag and the set button untouched.
- **/founder-collection** — Boardroom hero (“Take your seat.” / “Private
  tools. Public power.” / EXPLORE THE COLLECTION) → the numbered six-slot
  rail (Sign Here → waitlist) → the shelf → the vanity band → the reckoning →
  waitlist → the serums → doors into the study.
- **/our-story** — Study hero (“Every woman is building something.”) →
  the manifesto as a journal page → the LALALOCA panel → the founder as a
  framed portrait on a page → doors into the gallery.
- **/found-her** — Gallery hero (READ THE STORIES · WRITE YOURS) → the
  profiles as illuminated gallery panels on the darkened hall (Shelby's
  photograph, Julie's painting with its note; one markup, every width) →
  “Write yours.” → the writing desk (typewriter frame) → the story form on a
  paper page with “Before you write” beside it → newsletter on paneling →
  doors into the workroom. The form, its fields, the two consent controls,
  the publication language and the honest failure note are the existing
  `StoryForm`, unchanged; there is one form, not one per breakpoint.
- **/young-founders-room** — the existing door overlay plays first, then the
  workroom hero (“A room built with young voices.” / collaborators / the
  giving sentence / SEE HOW IT BEGAN · SHOP LALALOCA) → “How it began”
  (formerly the h1 block) → the note from Shelby (paneling) → three paper
  pages → the commitment (paneling) → the close → doors back to the lounge.

## Preserved, deliberately

Shopify variant wiring, the bag and checkout permalink, `AddToBagButton`,
the catalog fallbacks, `EmailSignup` → `/api/subscribe`, `StoryForm` →
`/api/story`, the concierge, search, account, analytics events (the
`TrackedLink` events on the Young Founders' Room included), JSON-LD, metadata,
canonicals, the sitemap, policies, and every product page. The protected
lines are verbatim: the lockup, the tagline, the giving sentence.

## Verification (3 Sept, local)

`tsc` clean · `eslint` clean on every file touched (two pre-existing
`react-hooks/set-state-in-effect` errors remain in `PlateShades.tsx` and
`ThresholdDoors.tsx`, both untouched) · `next build` prerenders every route ·
`scripts/house-walk.py` (Playwright): 11 routes × 2 widths all 200, zero
console errors, one door portal on each of the six room pages, portal on
/shop navigates to /founder-collection, add-to-bag opens the drawer with the
line and subtotal, the story form has 1 form / 5 required fields / 2 consent
checkboxes / the permissions legend and “Before you write” visible, the
newsletter input accepts a value (not submitted), the entrance beat shows at
2.6 s and is gone by 6.1 s landing on `#room-house`, reduced motion shows no
dialog and lands on `#room-house`, the phone room menu lists 7 rooms.
Screenshots in `/tmp/house-shots` on the build machine.

## Still wanting photography or a decision

- Every room frame is 1672 px wide; the phone crops are 540–650 px wide and
  will read soft on a 3× phone. Higher-resolution exports of the same renders
  drop in with the same names.
- The Young Founders' workroom frame still carries the mock-up's two cream
  buttons under the site's own dark panel (they are hidden at every width
  tested); a re-render without them is cleaner.
- `rooms/young-founders-window` (the pink-window variant) is in the repo and
  unused.
- The pre-existing Young Founders' Room door overlay (`young-founders/
  Threshold.tsx`) is its own drawing of the doors; it still matches the
  emerald/brass/F rule but is not the shared `EmeraldDoorPortal`.
- `ThresholdDoors.tsx` and `RoomRail.tsx` are no longer used by any page and
  can be deleted.
- The giving sentence now appears five times on the Young Founders' Room
  (the hero added one, verbatim); AGENTS.md records four.
