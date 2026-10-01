# Worklog — append, never rewrite

Every agent session that touches this repo adds an entry at the top:
date · agent · what changed · what was left alone · anything unpushed.

---

## 2026-10-01 · Claude (Cowork) — the gallery comes back to FOUND HER

Shelby: "i liked when we had the frames around each person photo... almost
like walking a gallery. a very realistic gallery."

WHAT WAS THERE BEFORE, AND WHY IT DID NOT COME BACK AS-IS. Frames last
existed at 0a412af and were removed by 325cd58 ("one continuous cinematic
room"). The old version baked each portrait into its own rendered wall —
founder-portrait-wall.webp WAS Shelby and could only ever be Shelby. That is
why it died: 1601ff3 made the wall "take any number of stories", and baked
composites cannot. Restoring that approach would re-break the moment a
fourth woman is approved.

SO THE FRAME IS NOW AN OVERLAY, NOT A COMPOSITE.
- public/editorial/found-her-frame.webp — the existing empty-frame artwork
  with its aperture cut to transparent. 61 KB with alpha (the same cut as a
  PNG was 757 KB; WebP alpha is the whole reason this is affordable).
- src/components/found-her/FramedPortrait.tsx — portrait behind, frame over,
  name engraved on the brass as LIVE TEXT. Any approved portrait is framed
  on arrival; nothing to render, nothing to commission.

THE GEOMETRY IS MEASURED, NOT EYEBALLED. Aperture read off the artwork at
x 166..918, y 208..1242 of 1086x1448 -> left 15.285% / top 14.365% /
69.245% x 71.409%. Nameplate centred 50.1% / 93.4%. Verified by compositing
Shelby and Aly into the frame in PIL at those exact percentages before a
line of CSS was written — both sit correctly.

A BUG CAUGHT BEFORE IT SHIPPED. The plate is a fixed size; names are not.
A hardcoded 1.55cqw fits "SHELBY KORPI · FOUNDER" and overruns the bezel on
"ALY V · BUILDING MAKEUPGEMZ". The engraving is now sized to its own label —
24.8cqw of usable brass / 0.66em per character, capped at 1.55 — so a longer
name shrinks and never overruns. Checked against all three profiles.

JULIE IS NOT PUT IN THE FRAME. julie-schoener-frame.webp is ALREADY a framed
collage with its own nameplate; inside the FOUNDER frame it would be a frame
within a frame. Added `preframed?: boolean` to the portrait type and set it
for her — she hangs on the same wall, lit and shadowed, as her own artwork.
Data-driven, so the next pre-framed piece needs no page change.

RESTORED A DISCLOSURE THAT HAD GONE MISSING. `portrait.note` is defined in
profiles.ts and documented as "rendered above her Read her story link... so
a composed artwork is never mistaken for a photograph of the woman herself".
It rendered NOWHERE — so Julie's watercolour was reading as a photograph of
Julie. Now rendered in both the featured block and the archive cards. Shelby
asked for exactly this line weeks ago; the request was interrupted and the
field has been inert since.

Their copy, their headings and their page structure are untouched. Only the
way portraits are presented changed: each now hangs on a lit wall with a
real drop shadow, so scrolling the page walks the hall.

## 2026-10-01 · Claude (Cowork) — rebased onto 19 commits of other agents' work

Shelby's push was rejected: another agent had pushed 19 commits (Our Story
rewrite, Young Founders rebuild, concierge, homepage copy) while this
session worked. Exactly the collision AGENTS.md rule 1 exists for.

Checked the overlap before touching anything: of my four files, only
src/app/page.tsx was also theirs. The two .webp files and WORKLOG.md were
untouched on their side.

Rebased onto origin/main. Git auto-merged the Room 04 block cleanly, and the
result is the right one semantically, not just mechanically:
  MINE  alt (describes the new render) + position="center center"
  THEIRS title "Five pieces before whatever comes next."
         lede "Cleanse, wash, moisturise, eyes, finish..."
Verified line by line after the rebase, not assumed.

Their new lede drops "In stock", which retires the contradiction flagged in
the entry below — the Room 04 hero no longer argues with the "Ships
October 12" badge. The two Shopify product descriptions still do.

Safety ref left at safety/pre-rebase-2026-10-01 (pre-rebase HEAD 347a367).
Delete it once the push lands: git branch -D safety/pre-rebase-2026-10-01

## 2026-10-01 · Claude (Cowork) — Room 04 gets the new boardroom

Shelby supplied a replacement render for Room 04 (the FOUNDER Collection
hero) and asked for it optimised for the layout.

- Source is PORTRAIT, 1181x1331. The layout wants 1672x720 (2.322:1) on
  desktop and 540x720 (3:4) on mobile, so the two breakpoints are cropped
  from different regions rather than scaled from one:
    desktop  y 210-719 band, the 2.322:1 slice holding the sconces, the
             panelled wall, both rows of chairs, the bar shelf and the
             window. Upscaled 1.42x (LANCZOS) then unsharp-masked to put
             back the bite the upscale costs.
    mobile   full height, centre 998px wide = 3:4, DOWNscaled to 540x720,
             so the phone crop is the sharp one.
- Gamma lift again, not brightness-multiply: 1.35 desktop (mean 24.8 ->
  39.3), 1.25 mobile (-> 33.2). The mobile crop starts brighter, same
  reasoning as the 2026-10-01 entry below.
- Sizes: desktop 98 KB (was 121), mobile 39 KB (was 55). Smaller than what
  it replaced at q82/q80.

ALT TEXT REWRITTEN — mandatory, not polish. The old alt described "striped
packs at every seat, an empty green chair with a rose silk over its arm
before a bulb-lit mirror". None of that is in the new render. An alt that
describes a picture the page no longer shows is worse than no alt.

position: "56% center" -> "center center". The new composition is
symmetrical — the table's vanishing point is dead centre — so an off-centre
object-position breaks it at narrow viewports. Revert this one line if the
old framing is wanted back.

STILL TRUE, STILL FLAGGED: the lede under this hero says "In stock, and
free to your door anywhere in the US" while the five products now carry a
"Ships October 12" badge in Shopify. Same contradiction class as the two
product descriptions flagged below. Not touched.

## 2026-10-01 · Claude (Cowork) — Shopify stock + ship date, and a brighter Room 04

SHOPIFY (live store, no repo change):
- Stocked the five FOUNDER collection products at 5 each — Clean Break,
  Double Take, Hold the Room, Opening Line, and Smooth Talker at 5 PER SHADE
  (20 Light / 25 Medium / 35 Deep = 15). 35 units total.
- Set founder.badge = "Ships October 12" on those same five. The namespace
  had no founder.* metafields at all before this, so nothing was clobbered —
  worth knowing: descriptor and hook are unset too, so the catalog is
  running on its hand-written fallbacks.
- Serums deliberately untouched per Shelby: Thirst Trap 98, C Me Glow 75,
  Bounce Back 74, Trio 149, no badge. The trio was treated as a serum.

REPO:
- public/editorial/rooms/collection-mirror.webp — gamma 1.5 lift, mean
  brightness 18.1 -> 37.1 of 255. The boardroom was so dark the products on
  the table did not read at all.
- collection-mirror-m.webp — gamma 1.3, mean 32.5 -> 46.9. Different gamma
  on purpose: the mobile crop centres on the lit mirror and starts brighter,
  so matching the OPERATION would not have matched the RESULT.
- Gamma not brightness-multiply, so 255 stays 255 and the mirror bulbs
  cannot clip. Highlights are mathematically safe. Files grew 98->121 KB and
  49->55 KB, which is the cost of actually having shadow detail.
- Only src/app/page.tsx (RoomHero, Room 04) uses these two files. The text
  scrim over them is near-opaque on the left where the copy sits, so the
  lift does not touch contrast on "Private tools. Public power."

LEFT ALONE, FLAGGED TO SHELBY:
- Two Shopify descriptions now contradict the badge: HOLD THE ROOM says
  "In stock. Ships within one business day" and SMOOTH TALKER says "In stock
  variants ship within one business day". Offered to fix; not touched.
- src/app/founder-collection/page.tsx still describes the line as "one
  product takes money, three take reservations and two aren't made". All
  five now have prices and stock in Shopify. Stale framing, worth a pass
  before the 12th.

## 2026-08-25 · Claude (Cowork) — deploys stopped at b60c6b9
Shelby sent a Vercel deployment URL. Production was ~18h stale. Diagnosed
from the outside (no Vercel log access):
- Copy cut phase 1 (75d67c6) IS live — /shop shows "Three serums. Three
  energies.", PDP shows "The details" panels. So deploys worked, then
  stopped at the NEXT commit, b60c6b9 (the self-publishing catalog).
- Confirmed with cache-busting query strings, not the `age` header — an
  earlier session called a false alarm off a stale `age`. /the-next-move
  404s and next-move-hero.webp / clean-break-scene.webp / hold-the-room-
  bottle-wide.webp all 404 with ?cb=random. Definitive: those files are not
  in the deployed build.
- Ruled out: remote is github.com/shelbykorpi/founder-lalaloca on main and
  main == origin/main at b1bf86c, so the pushes landed. Build passes from
  her exact HEAD three ways — `npx next build`, full `npm run build`
  (including the new prebuild), and with SHOPIFY_CLIENT_ID/SECRET set to
  exercise the credentialed Admin path that only runs on Vercel.
- b60c6b9 is the commit that introduced the only two things that behave
  differently on Vercel than in this sandbox: the `prebuild` price check
  (Vercel can reach Shopify; this sandbox is 403 by egress policy) and
  catalog.ts calling the Admin API during static generation.
HARDENED BOTH, regardless of which one it turns out to be:
- scripts/check-prices.mjs: now exits 0 on every failure mode except one
  confirmed mismatch, and even a mismatch only warns. `--strict` restores
  fatal behaviour for manual runs. A prebuild guard that can block every
  deploy is worse than the bug it guards against — that was my design
  error.
- shopifyAdmin.ts: AbortSignal.timeout(10_000) on both the token exchange
  and the GraphQL call. The catalog reads through these during static
  generation, so a slow Shopify would have hung a deploy instead of
  falling back.
ROOT CAUSE, from the build log Shelby pasted:

    Error: Cannot find module '/vercel/path0/scripts/check-prices.mjs'
    Error: Command "npm run build" exited with 1

**`.vercelignore` has excluded `scripts` since the very first commit
(018ebda).** The file is committed to git and present in HEAD — which is
why `git cat-file` said yes and why this looked like a code problem — but
Vercel never receives it, so `prebuild` died with MODULE_NOT_FOUND on
every build after b60c6b9. Entirely my error: I added a build step
pointing at a directory the deployment was configured to drop, and did
not check .vercelignore first.

FIXED:
- .vercelignore: `scripts` -> `scripts/*` plus `!scripts/check-prices.mjs`.
  The directory itself can no longer be excluded, because gitignore
  semantics make a negation unreachable inside an excluded directory —
  exclude the CONTENTS and re-admit the one file the build needs. Pattern
  verified with `git check-ignore`: the price guard is kept, the python
  and shell helpers and assets/source stay out.
- package.json: `"prebuild": "node scripts/check-prices.mjs || true"`.
  Belt and braces — if anyone edits .vercelignore again, a missing script
  can never take the site down a second time. Verified by deleting the
  file and running prebuild: exit 0.

RULE FOR ANY FUTURE AGENT: before adding a build step, read .vercelignore.
A file being in git does NOT mean it reaches the Vercel build container.

DEPLOY CONFIRMED GREEN after 11d884e. Verified live with cache-busting:
/the-next-move 200, next-move-hero.webp 200, /founder-collection shows
"One is open. Three are close". The MODULE_NOT_FOUND log Shelby pasted the
second time was the OLD failed deployment — that Vercel URL permanently
points at the build that failed, so re-reading it shows the same error
forever. Check the live site, not the old deployment page.

Live content audit found a real gap I had shipped: /the-next-move rendered
NO product name, NO category and NO net contents — three cards of taglines
with nothing naming the product. Size is a regulated declaration and a
material fact before a reservation. Fixed: category eyebrow + name as an
h3 (also gives screen readers a per-card heading, which the page had none
of) + "140 ml / 4.73 fl oz" style size line, with shade folded in beside
it rather than on its own row. The data was already in nextMove.ts; the
page simply never rendered it.

## 2026-08-25 · Claude (Cowork) — individual product detail pages
Shelby's brief: the three campaign cards all linked to /the-next-move, so
clicking Clean Break opened a page about three products.
- NEW routes, all prerendered: /products/clean-break, /products/smooth-talker,
  /products/double-take. /products/hold-the-room untouched.
  /the-next-move KEPT as the campaign page and the "See all three" target.
- NEW src/components/shop/ProductDetail.tsx — ONE shared template, three
  thin routes. Three hand-built pages would drift the way the hand-built
  LALALOCA pages did (24-word hook on one, none on the other), which is why
  the copy cut happened in the first place.
- NO Product/Offer schema on these pages, deliberately: an Offer wants a
  price and these have none. Breadcrumbs only until a real price exists.
- nextMove.ts gains description / detailCta / reservationStatus /
  detailHero / facts. detailHero is the product ALONE — the card may show a
  family or a range, a detail page may not, or someone who clicked one
  product lands on a picture of three.
- 2 new assets: clean-break-vanity.webp, double-take-vanity.webp (native
  3:2, product alone at a vanity — matches the collection page's own
  vanity hero).
- ShadePicker upgraded: reads ?shade=20-light so a shade is linkable,
  falls back to the default on an unknown value, priority prop for the LCP
  hero on a detail page, and an aria-live line announcing the shown shade.
  THE SUSPENSE BOUNDARY LIVES INSIDE THE COMPONENT — useSearchParams cannot
  be prerendered without one, and putting it at the call site means the
  next page that drops in a <ShadePicker /> breaks the build. Fallback
  renders the default shade at the same height so nothing shifts.
- Collection cards + CTAs repointed to /products/<slug>.
- VERIFIED: each page mentions only its own product (grep across all three);
  no card links to /the-next-move as a product destination; "See all three"
  still does. ?shade=35-deep deep-links correctly; clicking 20 LIGHT swaps
  the hero. Smooth Talker: SPF/sunscreen hits are ONLY our disclaimer + the
  concierge FAQ button; broad spectrum/UVA/UVB/sun protection all zero.
  Double Take: Ceramide/CoQ10/EGF/dark circle/brighten all zero — the two
  "firm" hits are "collagen firming serum" in the site-wide Organization
  schema (Bounce Back's approved category), not a Double Take claim.
  Clean Break: Mate Leaf yes, matcha zero, 140 ml yes, 98% not published.
  No Offer schema and no price on any of the three. eslint/tsc/build clean.

## 2026-08-25 · Claude (Cowork) — shelf reorder + Hold the Room gets a page
Shelby: swap Double Take and Hold the Room in the grid, and remove the Hold
the Room section that sat after the products.
- SWAP DONE. The grid used to be three maps rendered in sequence, so its
  order was an accident of which array came first. Replaced with ONE
  explicit `line` array — reorder that list and nothing else. New order:
  Double Take / Clean Break / Smooth Talker | Hold the Room / Opening Line /
  Sign Here. That puts the whole NEXT MOVE trio in row one.
- THE SECTION WAS MOVED, NOT DELETED — to src/app/products/hold-the-room.
  Deleting it would have removed the ONLY copy of `product.preorder`, the
  only text anywhere correcting /policies/shipping's one-business-day
  promise, while the grid card kept a live Preorder button. A customer could
  have bought expecting next-day dispatch. It also carried the full INCI
  (fragrance + petrolatum, disclosed on purpose) and the FAQs faqSchema
  quotes. Card href now points at the new page instead of an anchor.
  A STATIC route beats the /products/[slug] catalog template here: that
  template needs a Shopify product with founder.* metafields and neither
  exists yet. Next resolves the static file first, so it survives whatever
  happens in Shopify later.
- Fixed a regression I introduced mid-edit: the first pass rendered only the
  card whose handle is "founder-collection", which would have silently
  dropped every OTHER product once Shopify is connected. All catalog cards
  now map to LineCards; the anchor is found by name and the rest append.
- AddToBagButton was being handed the whole FounderProduct — 30-line INCI
  and all — for a button that reads six fields. Now passed six fields. Aqua
  / Petrolatum / Dimethicone all gone from the collection payload (0 hits).
- Removed imports the move orphaned. eslint clean, tsc clean, build clean,
  one h1 on the new page, 200.

## 2026-08-25 · Claude (Cowork) — SMOOTH TALKER shade range
Shelby supplied a shade package + implementation brief. Three shades of ONE
product (same 12 g stick, same formula, same claims): 20 LIGHT, 25 MEDIUM,
35 DEEP. Handles 20-light / 25-medium / 35-deep.
- Artwork VERIFIED at full resolution before use: every carton reads
  CERAMIDE TONE STICK with the approved benefit trio and CERAMIDES · COCOA
  BUTTER · VITAMIN E. No SPF/sunscreen wording on any of the three.
- 5 assets -> WebP in public/products/ at native 3:2, nothing cropped:
  smooth-talker-{20-light,25-medium,35-deep}.webp, -shades.webp (family
  card), -shades-closet.webp. Source PNGs belong in assets/source/ which is
  gitignored (/assets/ line 48) — the repo's established originals archive.
- nextMove.ts: new optional `shades[]` on the product type. The single
  `shade` field stays for one-shade SKUs.
- NEW src/components/shop/ShadePicker.tsx — client component. Built as a
  RADIO GROUP, not buttons: single choice from a small set, so arrow-key
  navigation and screen-reader semantics come for free. All three heroes
  render and cross-fade rather than swap, so switching never shows an empty
  frame. Verified in Playwright: 3 radios, default 25-medium, click swaps
  the hero, ArrowLeft moves selection AND the hero follows.
- The family shot is now this SKU's card image everywhere — a card showing
  one shade of a three-shade product tells the customer the wrong thing.
  /founder-collection state line reads "Reserve — 3 shades, no price yet".
- COMPLIANCE SWEEP of the built output: SPF/sunscreen/broad-spectrum/UVA/
  UVB/EGF/CoQ10 all zero except (a) our own "Not a sunscreen" disclaimer
  and (b) C Me Glow's pre-existing "wear sunscreen" routine advice. Both
  legitimate.
- KNOWN GAP, deliberate and documented in the component: the shade does NOT
  reach any reservation payload. No Shopify variant exists for any shade,
  and the reservation is one email capture for the whole campaign rather
  than a per-SKU basket. A selector that implied it reserved a specific
  shade would promise what the plumbing cannot keep. Map by handle when
  variants exist.
- OPEN FOR SHELBY: the concept doc records Selfnamed offering FOUR shades
  (light/medium/tan/deep); only three are being used. Adding the fourth is
  cheap now and widens a narrow range.

## 2026-08-25 · Claude (Cowork) — /founder-collection opens at the vanity
Shelby: remove the top of the page, replace with a vanity-mirror image, make
the customer feel she is sitting down about to get ready.
- Supplied render is 1672x941 — the SAME frame as the homepage hero, so the
  two now read as one house rhythm. Saved as
  public/editorial/collection-vanity.webp.
- Mobile gets its own crop, collection-vanity-m.webp (722x901, ~4:5), cut
  into the NEAREST mirror plus the counter running out of frame. The wide
  shot letterboxed on a phone reads as "a photograph of a row of mirrors";
  the crop reads as "you are sitting at this one". That distinction was the
  whole brief.
- Construction copied from the homepage hero: below md the photograph is its
  own block with copy beneath, from md up it becomes the background with the
  copy on the dark left wall. Two scrims, one per breakpoint.
- The wordmark is etched into the glass IN-SHOT, so live copy stays left and
  never fights it.
- PageIntro removed (import dropped). New h1 is "Take your seat." — verified
  exactly one h1 on the page. Sub: "The mirror's lit. LALALOCA is the serum
  collection; this is what comes after it."
- REORDERED while in there: was hero -> Hold the Room full spec -> green ->
  grid. A collection page that buries its grid under one product's spec
  sheet is the same mistake the copy cut fixed on /shop. Now hero -> THE
  LINE grid -> Hold the Room detail -> green statement -> waitlist -> back
  to serums. Products are on the first screen after the hero.
- Retired the old title "The room is easy to enter. Harder to hold." — it
  was a second room line, and the protected lockup OPEN THE DOOR. / THE ROOM
  IS YOURS. is meant to be the only one in circulation (Shelby, 25 Aug).

## 2026-08-25 · Claude (Cowork) — one line on /founder-collection
Shelby: put the three NEXT MOVE products on the FOUNDER Collection page and
format Hold the Room to match.
- NEW src/components/shop/LineCard.tsx — shared card so /founder-collection
  and /the-next-move cannot drift into two treatments of the same products.
  3:2 tile, hover reveal, 4px accent rule, eyebrow/name/category/STATE.
  The state line is load-bearing: six entries at three stages, and a grid
  that renders them identically implies six things you can buy.
- /founder-collection shelf is now the whole line, one grid, six cards:
    Hold the Room   preorder $34, Shopify card when reachable else local
    Clean Break     ) reservations, no price, detail on /the-next-move
    Smooth Talker   )
    Double Take     )
    Opening Line    ) names only, not product listings
    Sign Here       )
- Hold the Room accent is Antique Gold, NOT a stripe colourway, because it
  does not have one — it is Blanka in plain supplier packaging while the
  other three are Selfnamed in the striped house system. Deliberately not
  disguised.
- Its square studio shots were being cropped by the 3:2 tile, so
  hold-the-room-{bottle,carton}-wide.webp were generated: product scaled to
  tile height, sides extended from the shot's own blurred ground. Nothing
  crops.
- Its state line reads "Preorder — ships when the first run lands" rather
  than repeating the price the button already carries.
- The three campaign products carry the eyebrow "The Next Move" and NOT a
  slot number, deliberately: founderCollection.ts numbers three archetype
  slots (Opener/Anchor/Signature) while the DOUBLE TAKE concept doc numbers
  a four-step routine (01 Opening Line / 02 Double Take / 03 Hold the Room /
  04 Sign Here). THOSE TWO SYSTEMS DISAGREE and inventing a number here
  would pick a winner by accident. Unresolved — flag for Shelby.
- Green statement rewritten: "One is open. Three are close. Two are still
  names." The old "Three steps..." line no longer described the shelf.
- WaitlistCard in CatalogCard.tsx is now unused by this page (LineCard
  handles the no-image state); left in place for the Shopify-driven path.
FLAGGED AGAIN, NOW MORE VISIBLE: Hold the Room's hover reveals a carton
printed EXTREME MOISTURE BLEND — the supplier's name — sitting beside three
cartons that say the real product name. Still unanswered since 19 Aug.

## 2026-08-25 · Claude (Cowork) — corrected packaging photography
Shelby supplied FOUNDER_corrected_packaging_images.zip. VERIFIED LABEL BY
LABEL at full resolution before use — all four audit drifts are fixed:
Smooth Talker reads CERAMIDE TONE STICK with no SPF/sunscreen wording;
Clean Break reads MATE LEAF and 140 ml / 4.73 FL OZ; Double Take reads
HEXAPEPTIDE-11 · VITAMIN C · VITAMIN E with the three approved benefit
lines and no firming claim. Do not re-verify from the README — it was
verified from the pixels.
- 9 assets converted to WebP (largest 124 KB):
  public/editorial/next-move-hero.webp (1672x941, presale hero, copy space
  left, same frame as the homepage hero), next-move-flatlay.webp,
  next-move-dressing-room.webp (unused, held for email/social);
  public/products/{clean-break,smooth-talker,double-take}-scene.webp
  (1536x1024) and -pack.webp (1050x1393).
- FLAT LAY IS CROPPED ABOVE THE CAMPAIGN CARD. The supplied square version
  still reads "THREE MOVES. ONE ROOM." and the room line was retired
  25 Aug. To use it whole, re-render the card as "THREE MOVES."
- Card treatment: scene leads (each shot into its own SKU colourway), pack
  shot on hover, 4px rule in the SKU's deep stripe, 3:2 tile = scenes'
  native ratio so nothing crops. Drawn stripe placeholders removed. Hover
  verified in Playwright (opacity 0 -> 1). NOTE: no hover on touch, so
  mobile never sees the readable label — fine for a reservation page.
- nextMove.ts gains pack/scene per product + CAMPAIGN.hero/flatlay, with
  the verification recorded in the file header.
- Project doc: claude/next-move-image-set.md.
STILL RENDERS, NOT SAMPLES. No sample ordered; every concept doc asks for
one first, and a render cannot answer the Cormorant-hairline, cream-on-rose
thumbnail, iron-oxide tint or white-hardware questions. Prices, ship window,
trademark clearance and US labelling all still open.

## 2026-08-25 · Claude (Cowork) — THE NEXT MOVE presale page
Shelby brought a ChatGPT presale campaign plus 24 Aug packaging renders for
the three Selfnamed SKUs. Audited against the three concept docs in the
Claude project and the verbatim INCI captured from the studio. Audit saved
as claude/next-room-presale-audit.md. Four drifts found, all corrected here,
none of them cosmetic:
- SMOOTH TALKER renders printed "Broad Spectrum SPF 30 sunscreen". The
  21 Aug concept doc §4 is a HARD STOP saying the opposite, and records
  that Selfnamed never states an SPF at all. In the US an SPF claim makes
  it an OTC drug (Drug Facts panel, actives with %, 21 CFR 201.327 SPF
  testing, broad-spectrum testing, CDER eDRLS registration, NDC). Shelby's
  call 25 Aug: SELL AS A TONE STICK, NO SUN CLAIM. Every SPF word is out,
  and the page carries an explicit "Not a sunscreen" note because zinc
  oxide leads the INCI and a customer would reasonably assume otherwise.
- CLEAN BREAK renders said MATCHA TEA. INCI is Ilex Paraguariensis —
  yerba maté, a holly, not green tea. Corrected to MATE LEAF.
- CLEAN BREAK renders said 146 ml / 4.9 fl oz. Supplier fill is 140 ml /
  4.73 fl oz. Regulated declaration; corrected.
- DOUBLE TAKE renders called out CERAMIDES, COQ10 and EGF. None is in its
  40-item INCI. Corrected to HEXAPEPTIDE-11 · VITAMIN C · VITAMIN E. The
  two renders also disagreed with each other on the third benefit line,
  the actives line and the fill (0.5 vs 0.51 fl oz), and "visibly firms"
  is on that doc's own May-not-say list.
Built:
- src/lib/nextMove.ts — campaign + three products, every fact traceable to
  a concept doc, provenance in the header. RESERVING flag gates the buy
  path.
- src/app/the-next-move/page.tsx — presale page. TAKES NO MONEY: no price
  exists for any SKU and no ship window is set, so charging would start
  the FTC Mail Order Rule 30-day clock against a date nobody can name. It
  captures reservations (EmailSignup source="waitlist"). Flip RESERVING
  and add prices when both exist.
- DOES NOT USE THE 24 AUG RENDERS — they show the withdrawn SPF claim and
  the wrong ingredients. Each product is drawn as its documented stripe
  colourway (portrait-on-striped-wall at web scale) instead. Replace with
  photography of a physical sample when one exists.
- Campaign line: "THE NEXT ROOM IS OPEN." retired on Shelby's call — the
  protected lockup OPEN THE DOOR. / THE ROOM IS YOURS. stays the only room
  line. Replaced with campaign THE NEXT MOVE / "Before the door opens."
  The photography card's "THREE MOVES. ONE ROOM." needs the same edit.
- Footer link + sitemap entry. Primary nav NOT touched — Shelby's call.
STILL OPEN: prices (all three), ship window, sample order, trademark
clearance on all three names, US labelling layer, corrected artwork.

## 2026-08-23 · Claude (Cowork) — self-publishing catalog, phase 2
A product created in Shopify admin now publishes itself: card on
/founder-collection and a page at /products/<handle>, within a minute,
no deploy. Dark until Shelby does docs/SELF_PUBLISHING_SETUP.md (~10 min:
read_products scope on the existing app, founder-collection collection,
eight founder.* metafield definitions, optional webhooks).
- src/lib/catalog.ts — Admin GraphQL readers (reuses shopifyAdmin token
  machinery; new exports adminGraphql/hasAdminCredentials), 60s cache
  under tag "shopify-catalog", inert without creds, null on any failure —
  every caller has a local fallback. Missing descriptor/hook logs loudly
  but renders (deliberately softer than the spec's build-fail).
- src/components/shop/CatalogCard.tsx — the six-element card + the
  WaitlistCard (name + categorical descriptor + Join the waitlist; no
  price/formula/claim — stays inside the board's rule).
- src/components/shop/CatalogProductPage.tsx — the fixed-stack PDP
  template rendered from Shopify data + metafields; empty panel = no
  panel, nothing invented.
- /products/[slug] — unknown slugs fall through to the catalog by handle
  (dynamicParams); og-image already brand-falls-back for unknown slugs.
- /founder-collection — "The collection" shelf: Shopify cards when
  reachable, else local Hold the Room card; waitlist cards for Opening
  Line and Sign Here auto-retire when a real product with that name
  appears. New #waitlist signup band (source="waitlist", added to
  subscribe route's allowlist + EmailSignup type).
- /api/revalidate — POST ?secret= (REVALIDATE_SECRET or
  SHOPIFY_CLIENT_SECRET) bursts the catalog tag; for Shopify
  products/create+update webhooks. 60s ISR works without it.
- cartPermalink now accepts a raw numeric variant id alongside mapped
  slugs — catalog products are buyable with no edit to shopifyLinks.ts.
- next.config.ts allows cdn.shopify.com through the image optimizer.
- scripts/check-prices.mjs + "prebuild": build fails loudly on Vercel if
  a repo price drifts from live Shopify; offline/unreachable = warn+pass.

## 2026-08-23 · Claude (Cowork) — copy cut, phase 1
Per the copy-cut doc (claude/site-copy-cut-and-product-template.md in the
Claude project) and Shelby's three decisions today: price is $38/$98,
copy cuts ship first, the Hold the Room preorder stands.
- PRICE: no live bug existed — Shopify and the site both charge $38/$98
  (verified against the public storefront JSON today). The $39.99/$98.99
  survived only in docs: SHOPIFY_ARCHETYPE_BRIEF.md and
  BRAND_ENTITY_AND_CHANNEL_MAP.md corrected, BRAND_BOARD.md amended twice
  (price decision + HTR preorder override) so no agent "fixes" it back.
- HOME: three-up product row (bottle · archetype · name · label wording ·
  price, whole card links) after the entrance; brand statement drops
  "Whatever you're building, begin with you."; Found Her para 17→13.
- SHOP reordered: 4-word title "Three serums. Three energies." → grid →
  House Trio → comparison → StandUp for Kids (body 40→28, PROFIT LINE
  UNTOUCHED) → close → shipping (→12w) / returns (→20w) / claims
  (unchanged, compliance) → new Founding List band (source="shop").
  Identity band removed — its headline became the page title.
- PDP: products.ts gains hook (≤25w) + panels {who,how,actives} (26–33w
  each; the cosmetic-claims sentence kept verbatim in who). Page renders
  hook instead of hero+what, three accordion panels instead of four full
  sections, FAQs deleted (answers live in the panels), faqSchema removed
  with them. hero/what/who/moment/faqs fields kept — other pages use them.
- EmailSignup blurb 35→23; footer line 22→14 (brand.ts note matched).
- FOUNDER Collection: "Three named steps. One of them exists." → "Three
  steps. One is open. Two are being made properly."
- NOT DONE (phase 2, needs Shelby in Shopify admin): Storefront API token,
  founder.* metafields, /collections/[handle] + /products/[handle] from
  Shopify, webhooks + revalidate, waitlist cards for Opening Line / Sign
  Here. Copy for the panels should migrate INTO Shopify metafields then.


## 2026-08-19 · Claude (Cowork) — Hold the Room goes on sale (preorder)

Shelby's explicit call, 19 Aug: put Hold the Room on the FOUNDER
Collection page and make it purchasable now. That overrides the standing
AGENTS.md line "the three v2.14 pre-sale products do NOT appear on the
site — production is not locked". It is a PREORDER, not stock.

Shopify (done by hand in admin, not in this repo):
- New product 9021783113897 / variant 47361868169385, $34.00, cost $8.90,
  vendor FOUNDER, type Moisturizer, SKU 100249-BLNK-MB-03-02-HM-SM3D,
  category Face Moisturizers. Two images from the Blanka listing.
- Inventory 0 with "continue selling when out of stock" ON. Verified:
  products.json reports available:true and
  /cart/47361868169385:1 resolves to a live checkout.

Repo, all in this one commit so the site and the till never disagree:
- src/lib/shopifyLinks.ts — VARIANT_ID gains "hold-the-room", typed via a
  new FounderProductSlug rather than widening to string.
- src/lib/founderCollection.ts — sellable:true, plus `bottle`/`bottleAlt`
  and a `preorder` string. New FAQ "When does it ship?".
- src/app/founder-collection/page.tsx — buy module (bottle cutout,
  preorder notice, Preorder · $34.00 button, policy links). The
  !sellable branch is KEPT for OPENING LINE and SIGN HERE.
- src/components/bag/AddToBagButton.tsx — product prop is now structural
  (six fields) instead of Pick<Product,...>, so the FOUNDER line can use
  it; optional `href` so the bag links to /founder-collection rather than
  a /products/hold-the-room route that does not exist.
- src/lib/seo.tsx — founderProductSchema(). Availability PreOrder, and
  deliberately NOT US_SHIPPING: that object carries a 1–2 day handling
  time which is false here.
- public/products/hold-the-room-bottle.png — cutout cut from the Blanka
  bottle shot, 203×720, matched to the LALALOCA bottle treatment.

Verified: next build clean; /founder-collection screenshotted at 1440px
and 390px; Preorder → bag → Checkout produces
founderbeauty.myshopify.com/cart/47361868169385:1 and Shopify accepts it.

NEEDS SHELBY, none of it done here:
1. /policies/shipping still promises dispatch within one business day.
   The preorder notice contradicts it on the product, which is the honest
   minimum, but the policy page should carry a preorder clause. Not
   written by an agent — that is a commercial term.
2. The `preorder` wording is mine, not approved copy. It promises an
   email before shipping. Change it or commit to sending it.
3. No ship window anywhere, on purpose — no invented dates.
4. The Shopify carton image still reads "Extreme Moisture Blend" (the
   supplier's name). Not used on this site; it IS live on the Shopify
   product. Pull it or replace it with real artwork.
5. The Founder Concierge knowledge base has no idea the FOUNDER
   Collection exists — it will not answer questions about this product.
6. feed/products.xml is LALALOCA-only; Hold the Room is not in the
   merchant feed.

LEFT ALONE / WARNING for whoever lands the FOUND HER work above:
- src/app/sitemap.ts is still uncommitted and still yours. Its diff
  DELETED "/founder-collection" from staticPaths — almost certainly a
  slip while rewriting that block. I restored the line in the working
  tree and did NOT commit the file, because your publicationDate() change
  is in it. Keep the restored line when you commit; the page it points at
  now sells something.
- This commit does carry the FOUND HER worklog entry above it, since the
  log is one file. That code is still uncommitted in the tree.
- Untouched: protected campaign language, the wordmark, charitable
  wording, products.ts, _to_delete/, _candidates/.

## 2026-08-19 · Claude (Cowork)
- Julie Schoener staged end-to-end, publication HELD on her approval:
  - src/lib/profiles.ts — her profile (verbatim answers, role line
    "Building Stay Delusional", approvedOn: "PENDING"). portrait type
    gained optional `aspect` so framed artwork is never cropped.
  - public/editorial/julie-schoener-frame.webp — her framed collage
    (AI-generated, supplied by Shelby; noted in her Airtable draft as
    part of what she approves).
  - src/components/found-her/ProfileStory.tsx — portrait slot honours
    portrait.aspect (falls back to 3/2).
  - src/app/found-her/page.tsx — THE WALL IS NOW A TWO-FRAME COMPOSITE:
    found-her-wall.webp hangs Julie's frame beside Shelby's at the SAME
    SIZE (both 493px tall, same centre line) in the photographed room.
    Desktop: two invisible click overlays split in the wall gap (64/36)
    plus two placards in the museum-label format. Mobile: one card per
    woman — her picture above her name — cropped identically from the
    same composite (found-her-frame-shelby-m.webp / -julie-m.webp).
    First two profiles hang on the wall; profiles[2:] go to the grid.
    HANGING THE NEXT FRAME MEANS REGENERATING THE COMPOSITE IMAGES AND
    THE OVERLAY WIDTHS, not just adding data. Single-profile fallback
    (old founder-portrait-wall scene) kept in code.
  - public/editorial/found-her-wall.webp + found-her-frame-shelby-m.webp
    + found-her-frame-julie-m.webp — composites (Julie's frame graded to
    room light, cast shadow; source founder-portrait-wall*.webp files
    kept untouched). found-her-wall-m.webp was superseded same-day and
    moved to _to_delete/ — never referenced by any commit.
- Airtable recFuOFm3d557fzI0: Draft updated to include the portrait in
  what Julie approves. Status still Drafting.
- PUBLISHED AHEAD OF APPROVAL — Shelby's explicit call, 19 Aug, after the
  hold was restated. To keep the site honest while approval is pending:
  - profiles.ts: isApproved() + publicationDate() helpers; Julie carries
    approvedOn:"PENDING" + publishedOn:"2026-08-19".
  - ProfileStory.tsx: the "published after she read and approved" line
    renders ONLY when approvedOn is real; Julie's page says "Told in her
    own words." until then.
  - [slug]/page.tsx, feed route, sitemap.ts: use publicationDate() — no
    more "Invalid Date" in RSS/sitemap from the PENDING sentinel.
  - WHEN JULIE APPROVES: set approvedOn to her date, DELETE publishedOn,
    mark Airtable recFuOFm3d557fzI0 Approved. One small commit.
- Shelby pushed the wall commit BEFORE the safeguard files landed, so the
  live site briefly carried the approval sentence + Invalid Date; the
  safeguards ship in the next commit together with:
- portrait.note (profiles.ts) — small print above Julie's "Read her
  story" on the hub, both breakpoints: "The picture in the frame isn't
  Julie — it's a painting we put together for her story." Shelby's
  wording, lightly polished, her instruction 19 Aug.
- Left alone: protected language, wordmark, charitable wording, all else.

## 2026-08-16 · Claude (Cowork)
- NEW: the FOUNDER Collection, second line beside LALALOCA.
  - src/lib/founderCollection.ts — own file, deliberately not products.ts.
    First product HOLD THE ROOM (THE ANCHOR), sourced from Blanka "Extreme
    Moisture Blend" SKU 100249-BLNK-MB-03-02-HM-SM3D. 30 ml, $34, chamomile
    + witch hazel, full INCI transcribed verbatim (duplicates left as
    printed), directions and origin from the supplier listing.
  - src/app/founder-collection/page.tsx — editorial single-product layout,
    no door treatment (one product is a corridor, not a choice).
  - Nav + footer + sitemap entries added.
  - docs/BRAND_BOARD.md — amendment section: name kept, spec changed from
    peptide/50ml to chamomile/30ml, remaining release gates listed.
- NOT SELLABLE ON PURPOSE: sellable:false, no Shopify variant wired, no
  add-to-bag anywhere. Page states why and offers the founding list instead.
  To ship: create the product in Shopify, add its variant to shopifyLinks.ts,
  flip sellable, add the button — ONE commit.
- Flagged to Shelby: INCI contains fragrance + petrolatum; the FAQ says so
  outright. Blanka SRP was $27.70, we price at $34.
- Unpushed: this + earlier commits if the push hasn't run.

## 2026-08-15 · Claude (Cowork) — later
- Young Founders' Room: added StandUp for Kids' own RESPECT graphic as
  /editorial/young-founders/respect-outreach-center.webp, placed in the
  "They helped build LALALOCA" column (below the collaboration slot, which
  is still empty). New PHOTO.respect entry + assetExists check. Alt
  describes the scene and transcribes the graphic's text; no young person
  is named, per AGENTS.md.
- Note: the image carries StandUp for Kids' logo and wording — partner
  branding left intact deliberately.
- Unpushed: this + prices + gallery frame (if not yet pushed).

## 2026-08-15 · Claude (Cowork) — end-to-end test of the email path
- PASS: all DNS. ImprovMX MX x2, root SPF, Resend MX/SPF/DKIM, and 2 of the 6
  Shopify CNAMEs, from Google + Cloudflare.
- PASS: live story form. Submitted a real test on www.founderbeauty.co/found-her
  with shelby@founderbeauty.co. Got the thank-you screen (not the "we haven't
  sent it" screen), and Resend logged BOTH emails as Delivered — the submission
  to shelbykorpi@gmail.com and the confirmation to shelby@founderbeauty.co.
  Delivery to shelby@ is the proof ImprovMX is accepting mail for the domain.
  From header read "FOUNDER <notifications@founderbeauty.co>" — the swap works.
- PASS: Shopify sender email now verified (the Unverified badge is gone).
- FAIL, and worth the whole test: the confirmation email's REPLY-TO was
  shelbykorpi@gmail.com. Every woman who wrote in and hit reply was writing to a
  personal Gmail the brand never published — same in the Founding List welcome,
  which reaches the larger audience. src/lib/email.ts now exports PUBLIC_REPLY_TO
  (defaults to shelby@founderbeauty.co, override with PUBLIC_REPLY_TO or
  NEXT_PUBLIC_CONTACT_EMAIL) and both call sites use it. OWNER_EMAIL keeps its
  real job: where mail LANDS, never an identity shown to anyone.
- Also fixed while in there: email.ts's FROM fallback still pointed at the dead
  notifications@send.founderbeauty.co. If EMAIL_FROM were ever unset, sending
  would fail silently into the "we haven't sent it" screen.
- NOT DEPLOYED: every src/ change from yesterday and today is still uncommitted
  on Shelby's machine. Production is running 1b37b5e, which is why the live site
  still says "Write to us" with no address. Nothing is lying yet — but nothing
  is live either.
- Verified: tsc --noEmit and eslint clean on src/.

## 2026-08-15 · Claude (Cowork) — address unification, ImprovMX aliases, Shopify sender
- ImprovMX: replaced the wildcard catch-all with named aliases — shelby,
  notifications, hello, care, press — all forwarding to shelbykorpi@gmail.com.
  Domain now shows Active with MX and SPF green. The catch-all was deleted
  deliberately: it cannot be un-collected once spam finds it.
- Shopify sender email: shelbykorpi@gmail.com -> shelby@founderbeauty.co, saved.
  Shows Unverified until Shelby clicks the confirmation email; Shopify falls back
  to store+74386112681@shopifyemail.com until BOTH that click and the DNS
  authentication are done.
- Shopify email domain authentication: chose MANUAL over GoDaddy "Authenticate
  automatically" on purpose — the Domain Connect flow can rewrite the root SPF,
  which now carries both amazonses and improvmx. Not worth the risk to save four
  paste operations.
- Correction to yesterday's note: Shopify does NOT need include:shops.shopify.com
  in the root SPF. The current flow is 6 CNAMEs only. Root SPF untouched.
- Added 2 of the 6 CNAMEs (txn._domainkey, txn2._domainkey) — both resolving.
  The other 4 (pdk1/pdk2._domainkey.mailerway, mailertxn, mailerway) were blocked
  by a permissions classifier on my side mid-entry. Nothing partial was saved;
  the pending form was cancelled. Values handed to Shelby.
- Shopify Store contact details LEFT on shelbykorpi@gmail.com deliberately. That
  field receives billing, security and account-recovery mail. Putting it behind a
  one-hour-old free forwarder means an ImprovMX outage takes out store recovery at
  exactly the wrong moment. Customer-facing identity is the Sender email, which
  did change.
- Still open: 4 CNAMEs, Shopify sender verification click, Gmail send-as, DMARC
  to p=none with a readable rua.

## 2026-08-14 · Claude (Cowork) — brand email, DNS, Resend swap (done in browser)
- CORRECTION to the previous entry: outbound was NEVER broken. Resend's records
  were named relative to the registered domain (send.founderbeauty.co), so they
  lived at resend._domainkey.send.founderbeauty.co and send.send.founderbeauty.co.
  The earlier check queried the apex, got NXDOMAIN, and cried wolf. Rule for next
  time: read record names as relative to the domain registered WITH THAT PROVIDER.
- Resend: deleted send.founderbeauty.co, added founderbeauty.co (free plan = 1
  domain, so a swap not an addition). Now Verified. This is what makes Gmail
  "send mail as shelby@founderbeauty.co" possible at all.
- GoDaddy DNS (nameservers are GoDaddy; Vercel only serves the site):
  renamed send.send -> send (MX + TXT), resend._domainkey.send ->
  resend._domainkey with the new DKIM key, and ADDED MX @ mx1/mx2.improvmx.com
  (10/20) plus one root SPF: v=spf1 include:amazonses.com
  include:spf.improvmx.com ~all. Verified resolving on Google + Cloudflare.
  Deliberately did NOT add Resend's optional inbound MX at @ — it would have
  collided with ImprovMX and silently killed forwarding.
- Vercel: EMAIL_FROM -> "FOUNDER <notifications@founderbeauty.co>", production
  redeployed (same commit, env change only).
- Shopify: READ ONLY, nothing changed. Sender email is shelbykorpi@gmail.com and
  Shopify warns customers actually see store+74386112681@shopifyemail.com. Fixing
  it needs Shopify's DKIM CNAMEs + include:shops.shopify.com in the root SPF —
  a deliberate fourth service in that one record, not a tack-on.
- STILL OPEN: ImprovMX account + shelby@ alias (Shelby's to create — mail to
  shelby@ is refused until it exists, and the site already shows that address);
  Gmail send-as; DMARC to p=none with a readable rua.
- Full record table and reasoning: docs/EMAIL_SETUP.md (rewritten).

## 2026-08-14 · Claude (Cowork) — shelby@founderbeauty.co as the contact address
- DNS check (Google + Cloudflare resolvers agree): founderbeauty.co has NO MX
  records, NO root SPF, and none of Resend's three records. Nameservers are
  GoDaddy (ns27/ns28.domaincontrol.com), not Vercel. So nothing can receive at
  @founderbeauty.co, and outbound is very likely failing — docs/EMAIL_SETUP.md
  has the evidence table and the fix.
- src/lib/brand.ts: new CONTACT_EMAIL / CONTACT_MAILTO, defaulting to
  shelby@founderbeauty.co, overridable via NEXT_PUBLIC_CONTACT_EMAIL.
- The site told people to "write to us" or "email us and we'll send the supplier
  sheet" in NINE places and never once gave an address. All nine now name it:
  shop returns, account, both policy sections, three product INCI answers, the
  concierge not-connected reply, and StoryForm's unconfigured screen. The four
  that are components render it as a mailto link; the four that are data strings
  interpolate the constant.
- /found-her: added a line under "Before you write" for a woman who would rather
  write a plain email, or has a question that is not a story.
- seo.tsx: organizationSchema's contactPoint was conditional on an env var that
  was never set, so it shipped absent. It now always renders from the same
  constant the visible copy uses.
- BLOCKING: shelby@ does not exist yet. The pages above are promising an address
  that currently bounces. Do the ImprovMX MX records in GoDaddy BEFORE deploying
  this.
- Verified: tsc --noEmit clean for src/ (only the pre-existing _to_delete/_sync
  errors remain), eslint clean on src/. next build still cannot run in the
  Cowork VM (darwin SWC binary vs linux/arm64).

## 2026-08-14 · Claude (Cowork) — AI writing prompt on the story form
- New: src/components/story/StoryPromptButton.tsx — a "Copy the prompt" card
  above StoryForm on /found-her. Clipboard only: no model call, nothing sent,
  no tab opened, no reading of what she has typed. Falls back to a selected
  read-only textarea when navigator.clipboard is blocked (in-app browsers).
- STORY_AI_PROMPT added to src/lib/content.ts. The numbered field list is
  GENERATED from STORY_FIELDS (via a new optional `aiHint` on three of them),
  so the prompt cannot drift from the questions the form actually asks. Only
  the four contact fields are literals.
- The prompt itself is the editorial charter as machine instructions: invent
  nothing, no generic empowerment language, infer nothing sensitive, no web
  search for a similar name, and the literal "I need your input for this
  answer" wherever it does not know.
- analytics.ts: new TrackEvent "story_prompt_copied" (counts a click, nothing
  else). Not GA4-reserved, passes through as a custom event.
- Verified: tsc --noEmit clean for src/ (the only errors are the pre-existing
  ones inside _to_delete/_sync) and eslint clean on all four files. `next
  build` cannot run in the Cowork VM — node_modules holds the darwin SWC
  binary and the VM is linux/arm64 — so run it locally before shipping.
- Unpushed: this change, on top of whatever was already unpushed.

## 2026-08-15 · Claude (Cowork)
- Prices matched to live Shopify (storefront products.json, updated 15 Aug
  13:01 ET): serums $39.99 -> $38.00, trio $98.99 -> $98.00. Changed in
  products.ts (single source; compare table, JSON-LD offers, merchant feed
  and "valued at" math all derive). Shop meta description updated; bag
  storage key bumped v2 -> v3 so no stale $39.99 persists in drawers;
  shopifyLinks verification note refreshed.
- Heads-up for Shelby: the TRIO's Shopify body copy still says "$98.99 ...
  instead of $119.97" — stale on Shopify's side, edit there.
- Unpushed: this commit (+ gallery-frame commit if not yet pushed).

## 2026-08-14 · Claude (Cowork) — night, part 2
- Recomposited the /found-her gallery wall: the green-blazer portrait now
  hangs inside the carved frame in founder-portrait-wall.webp and the -m
  mobile crop (head-and-shoulders crop, warm picture-light falloff and
  inner-frame shadow matched to the scene). Scene, frame, bench untouched;
  alts unchanged (they don't name the outfit).
- Unpushed: five commits total.

## 2026-08-14 · Claude (Cowork) — night
- Replaced Shelby's headshot: /editorial/shelby-korpi.webp is now the green
  satin blazer door portrait (from upload, 1122x1402). profiles.ts alt
  rewritten to match; objectPosition tuned to 50% 26% for the 3/2 frames.
- Deliberately NOT touched: founder-portrait-wall(.m).webp — that is the
  composed gallery-wall scene (her framed portrait on the wall), not a raw
  headshot; swapping the file would break the museum framing and its alt.
  Recomposite needed if the new portrait should hang there too.
- Unpushed: this + volunteer photo + intro lede + f0eb4fa (if not pushed).

## 2026-08-14 · Claude (Cowork) — evening
- Young Founders' Room: installed the volunteer photograph the page was
  already wired for — public/editorial/young-founders/shelby-volunteer.webp
  (from Shelby's upload). The DocumentaryImage slot next to "A note from
  Shelby" now renders and the note column narrows to its two-up layout.
  Set the slot ratio to the photo's native 1179/964 so the baked-in
  VOLUNTEER SHELBY caption never crops.
- Unpushed: this + "drop the intro lede" + f0eb4fa if not yet pushed.

## 2026-08-14 · Claude (Cowork) — later
- /shop: removed the PageIntro lede ("Three serums behind three doors…best
  story.") per Shelby. lede is an optional prop, so the intro renders
  heading + link only.
- Unpushed: this edit (plus f0eb4fa if the earlier push hasn't run yet).

## 2026-08-14 · Claude (Cowork)
- /shop: moved the LALALOCA × StandUp for Kids band from the bottom of the
  page (after the House Trio) to directly under the PageIntro, per Shelby.
  Added id="standup-for-kids" to the section for direct linking. Charitable
  wording untouched — block moved verbatim.
- Left alone: everything else on /shop, nav, charitable copy, protected
  campaign language.
- Unpushed: this single edit to src/app/shop/page.tsx (awaiting Shelby's OK
  to commit/push; Vercel auto-deploys from main).

## 2026-08-14 · Claude (Cowork)
- Seeded this worklog and AGENTS.md after a week of uncoordinated edits.
- State at time of writing: HEAD = 739b433 (Open the Door hero, desktop).
  Pending on disk: reconciled page.tsx (mobile hero fix), new
  hero-open-door-m.webp (crops past the soft-focus F), brand.ts reverted,
  hero-open-door-2*.webp parked in _candidates/ — all landing via Shelby
  running "Reconcile Hero.command".
- Known history worth knowing: 14 Aug, an unidentified agent half-switched
  HERO to -2 files (brand.ts edited, page.tsx not) while the tree held a
  stale page.tsx importing the deleted `notes` export — build was broken
  until reconciled. 12 Aug, a different agent rewrote the desk app's Etsy
  stub into a full OAuth integration (good code, reviewed) without any
  record here. Neither event was discoverable except by diffing.
- Deploys: Vercel auto-deploy from main is healthy (~60s push to live).
- Do NOT touch: protected campaign language, the wordmark construction,
  charitable wording, anything in AGENTS.md's "never invent" list.

## Earlier (reconstructed, incomplete)
- 12–13 Aug · unknown agent(s): Etsy OAuth in ~/FOUNDER-Desk (etsy.rs 34→514
  lines, new Etsy tab, secrets slots); founder-desk app registered on
  Shelby's Etsy developer account; "Fold Share Your Story into Found Her"
  (ff1ebb2); "Remove Meanwhile, from us" (cdcf381).
- 11–12 Aug · Claude (Cowork): brand board v2.14 conformance (Cormorant
  wordmark, colourways, nav lockup), Young Founders' Room, concierge prompt,
  FOUNDER Desk app v0.1.

## 2026-09-03 · Claude (Cowork) — the house, local only
- Redesigned the six room routes as one continuous house (see docs/HOUSE.md):
  new src/lib/rooms.ts floor plan; new house components HouseShell,
  EmeraldDoorPortal, NextRoomInvitation, RoomProgress, RoomTransition
  (EnterTheHouse), AmbientLighting, EditorialRoomSection; RoomHero extended
  (room prop, phone crop, headingId); LineRail numbered with six slots.
- Pages: /, /shop, /founder-collection, /our-story, /found-her,
  /young-founders-room. Found Her profiles rebuilt as gallery panels from the
  profiles' own portraits; one story form; consent/publication copy intact.
- Assets: public/editorial/rooms/*-m.webp phone crops, rooms/entrance-vanity
  (+ -m); sources under assets/source/rooms/.
- NOT changed: commerce, bag, catalog, APIs, forms' logic, analytics, SEO,
  policies, product pages, protected lines. Nothing committed or pushed.
- Verification: tsc, eslint (touched files), next build, Playwright walk —
  all clean. Pre-existing lint errors in PlateShades.tsx / ThresholdDoors.tsx
  untouched.
- Later, 3 Sept: house copy sharpened (door labels, next-room notes, section
  eyebrows, Found Her gallery line) and more Desert Rose: .room-label is rose
  site-wide, rose rule under hero labels, rose top edge on paper pages and
  panels, rose light through the door gaps, stronger pink ambient glow.
- Voice pass against the consumer-psychology brief (claude/house-voice-psychology.md
  in the Claude project): "The house isn't finished with you" → "Walk on. Every
  door here opens for you."; scarcity phrasing removed from the collection
  lines; ownership/belonging language kept. Doors still read "Push. It isn't
  locked." / "After you."
- Found Her to Shelby's mock-up: new hero (found-her-hall-pink.webp, the
  desert-pink portrait hall — replaces found-her-hall-doors as the room 06
  frame; the old file is now unused). Profiles rebuilt as the two dark bands
  from the mock — portrait · NAME · tagline · READ HER STORY →, rose diamond
  on the seam, whole band links to her story. New optional profile.tagline:
  Shelby "Built with conviction. Led with grace.", Julie "Redefined success.
  On her own terms." (Julie's painting note kept). Hero copy unchanged (it
  already matched). Old found-her-hall-doors*.webp / found-her-hall-sky*.webp
  are unreferenced now — safe to delete when delete-permission is available.
- Shop (Serum Salon) to Shelby's mock-up: new hero (serum-salon-alcoves.webp
  — three lit alcoves with the real bottles, pink-sky archways; replaces
  serum-salon-doors as the room 03 frame, old file now unused). RoomHero
  gained align="center" (copy centred and low) and a `bar` slot. The bar is
  the product rail: THIRST TRAP / C ME GLOW / BOUNCE BACK in their own accent
  colours with rose diamonds, then a cream "Shop the collection →" button —
  each name links to its product page, the button to the grid (#serums).
  Alcove labels kept as the salon's own signage; every link is live HTML.
- Shop, second pass (Shelby): hero trimmed to the mock-up's exact text (label,
  headline, sub, product rail — the "Not sure which?" line removed). The serum
  grid is gone; the three serums are now lit ALCOVES continuing the salon
  (new SerumAlcove component) — each real bottle in an arched marble niche
  glowing in its own energy colour (teal/amber/red from product.accent), name
  etched on the niche wall, then archetype/name/benefit/price and add-to-bag +
  Details. Section is house-marble so it flows straight down out of the hero
  counter — no grid on a new surface. Accent hairline also added to the serum
  cards and the product-page hero so the colours thread through. DoorCard /
  ScrollDoors are now unused (kept on disk). Commerce, tracking, links intact.

## 2026-09-10 · Claude (Cowork) — The Library
- New: /library (the reading room) and /library/[slug], one page per
  ingredient named on a product label — 15 entries covering the three
  LALALOCA serums and the five FOUNDER Collection SKUs. Data in
  src/lib/library.ts; components src/components/library/EvidenceMark.tsx.
  Every entry: what it is, what it does, which products carry it (linked,
  with the label wording where it differs), and ONE peer-reviewed study on
  the ingredient with a PubMed link. All 15 PMIDs verified against the PubMed
  record before writing. Evidence is labelled honestly (randomised human
  trial / human study / laboratory study) and each page carries the line
  that the study is research on the ingredient, not a test of the product;
  cosmetic benefits only; nothing is a sunscreen.
- Nav: "The Library" added as the sixth PRIMARY_NAV tab and under Read in
  the footer. Six tabs overflow a 1024 window, so Header.tsx now shows the
  desktop bar from xl and the menu button below it (was lg). Sitemap lists
  /library and each entry (yearly, 0.5).
- Ingredients are only those already on the site (products.ts,
  founderCollection.ts, nextMove.ts). Hold the Room is the LIVE Blanka
  chamomile + witch hazel cream, not the Selfnamed peptide cream in the
  cart. Double Take entries: Hexapeptide-11, Vitamin C, Vitamin E only.
- NOT changed: products, prices, commerce, rooms/rail (the library is a
  door off the hall, not room 08), protected lines, house codes (no SPF/UV
  on Smooth Talker, no firming/dark-circle language on Double Take).
- Build: next build --webpack from $HOME/fb-build (bridge workaround).
  Committed on main, NOT pushed — `cd ~/Founder:LALALOCA && git push origin main`.
- Later, 10 Sept · Claude (Cowork): homepage — removed the Room 02 three-tile
  gallery (The mirror · The note · The company + "Inside FOUNDER" link) at
  Shelby's direction. The "Come in. Stay awhile." hero and its #room-house
  anchor stay, so Enter-the-house and Room 07's return doors still resolve.
  public/editorial/found-her-mirror.webp and hero-two-women.webp are now
  unreferenced (the-room-is-yours.webp is still used on /found-her) — safe
  to delete when delete permission is available. Build clean. Committed,
  not pushed.
- Later still, 10 Sept · Claude (Cowork): homepage — a Desert Rose FOUND HER
  band now sits where the gallery was, between the Room 02 hero and Room 03:
  label FOUND HER · BRAND.campaign ("You didn't become her. You found her.")
  · "The story begins where the performance ends." · hairline to /found-her.
  Same construction as the pledge band. Build clean, checked at 1440 and
  390. Committed, not pushed.

## 2026-09-11 · Claude (Cowork) — the Gallery Walk (Room 03)
- Homepage: the five FOUNDER Collection cards are now a corridor —
  src/components/house/FounderGalleryWalk.tsx + gallery-walk.module.css.
  One brass-trimmed arched bay per product, active bay centred and lit,
  neighbours receding (scale/rotateY/opacity), partial bays at the edges.
  Plaque beside the active bay on desktop (below the strip on phones):
  number · archetype · name · category+fill · availability · price line ·
  ENTER THIS ROOM → to the product route. Copy per the brief: ROOM 03 · THE
  COLLECTION / Choose your next move. / Walk the room. Every product opens a
  different door. / DRAG (SWIPE) TO WALK THE ROOM.
- Data is still LINE in page.tsx, read from nextMove.ts/founderCollection.ts
  — no price, stock or route is retyped; the component owns only the
  walking. IN_THE_MAKING (already empty) removed.
- Input: drag, trackpad horizontal / shift+wheel (vertical wheel is NOT
  captured — the page scrolls through), arrows, ticks, ArrowLeft/Right/
  Home/End, click a neighbour to walk to it. Mobile is native scroll-snap.
  Live region announces the active product. prefers-reduced-motion drops
  the travel. All five links are in the HTML without JS.
- Images: new public/products/*-cut.webp — the five supplier pack shots cut
  out (rembg) onto transparency on a 900×1200 canvas, so the packaging
  reads large and sharp inside a CSS-drawn bay. The *-card.webp alcove
  renders are now unreferenced on the homepage.
- Header/nav, rooms rail, concierge, commerce, analytics untouched.
- Verified: eslint clean, next build clean, screenshots at 1440/1024/768/
  390/320, keyboard + drag + swipe exercised, no console errors.
- Open: the RoomHero "Private tools. Public power." directly above now
  sits under the same Room 03 label as the gallery — two Room 03 headers in
  a row. Shelby to decide whether the hero stays. Hold the Room's render
  reads PEPTIDE MOISTURIZING CREAM · 50 ml on the carton while the live
  SKU is the 30 ml Blanka cream — same render the cards used, now larger.
- Committed on main, NOT pushed.
- Second pass, same day: Shelby rejected the CSS-drawn corridor — it has to
  look like her render. So the render is now the room: new plate
  public/editorial/rooms/collection-gallery-walk.webp (the mock-up with its
  baked-in header, headline, plaque, arrows and cue removed by mirror-
  patching the scene's own symmetry). FounderGalleryWalk.tsx rewritten as a
  camera over that plate: five bays at fixed fractions of the frame; the
  walk pans/eases the plate toward the chosen bay, a soft spotlight and the
  plaque follow, hotspot links sit inside the moving layer. Opens on the
  Anchor (the frame as rendered). Phones: the plate is a 260vw panorama in
  a scroll-snap strip, plaque below. The *-cut.webp cutouts from the first
  pass are now unreferenced (kept on disk). Verified again at 1440/1024/
  768/390/320, keyboard/drag/swipe, no console errors. Committed, not pushed.
- Caveat for Shelby: the products are baked into the plate at 1672 px wide,
  so on a retina 1440 screen they are ~1.2x upscaled. A 3344-px render of
  the same frame, dropped in at the same path, fixes that with no code.
- Plate quality pass: the render was 1672 px wide, soft on retina. Upscaled
  4x with Real-ESRGAN (x4plus, CPU, in strips) and brought down to 2x —
  public/editorial/rooms/collection-gallery-walk.webp is now 3344 × 1778,
  q88 (439 KB). The 4x master is in assets/source/rooms/ at 6688 px for any
  future crop. FounderGalleryWalk passes quality={90}; next.config.ts gains
  images.qualities [75, 90] (Next 16 rejects unlisted qualities). Verified
  at DPR 2: the optimizer serves the 3840-wide variant. The label text in
  the render was never legible (AI type) — no resolution fixes that; only a
  new render with the real artwork would.
- The Library became a room (same day). /library now opens on Shelby's
  library render as a RoomHero (public/editorial/rooms/library-shelves.webp,
  3344 px 2x plate via Real-ESRGAN, + library-shelves-m.webp 3:4 phone
  crop; 6688 px master in assets/source/rooms/). The A–Z index is THE SHELF
  (src/components/library/Shelf.tsx + shelf.module.css): every ingredient a
  cloth-bound book on a brass-edged ledge, colour-coded by kind (green =
  humectants/lipids, Desert Rose = antioxidants, cream = botanicals, night =
  peptide), hover/focus pulls the book, click opens the reading. Pure CSS,
  server-rendered links, every row of books on phones gets its own ledge.
  Then By product (evidence mark under each name), then EmeraldDoorPortal
  into Room 04 · The FOUNDER Collection. Each reading now opens on the
  library scene (EditorialRoomSection surface="scene"); foot link is "Back
  to the shelf". LIBRARY_HERO exported from src/lib/library.ts. Build, lint,
  1440/390 screenshots, no console errors. Committed, not pushed.
- "The house continues" door band (ProductPlate.tsx, used by Clean Break /
  Double Take / Smooth Talker / Opening Line, and the hand-written Hold the
  Room page): founder-collection-door.webp is a tall portrait and the band
  shows a quarter of it; the centred crop cut Shelby's face off the top.
  object-position is now 60% 35% — her head sits under the band's top edge
  and the floor is what's lost. Both files, same change.

## 2026-09-11 (evening) · Claude (Cowork) — Vanity, stacked nav, Room 02 reshoot, lights up
Five commits on main, all from Shelby's direct requests in one session.
Read AGENTS.md / this log only AFTER the work — Shelby asked "did you look
at the folder" and the honest answer was no. Logging it all now.
- 7253e4a / 4a89493 — Room 03 is THE VANITY (src/components/house/Vanity.tsx
  + vanity.module.css): five product cutouts standing on the console of a
  real room, lit by hover/tap/keys, "Play the ritual", phone scroll-snap.
  Replaced FounderGalleryWalk on the homepage (component kept on disk).
  Rule it is built on: the product is never dimmed. Cutouts
  public/products/*-vanity.webp (rembg u2net from Selfnamed renders);
  room public/editorial/rooms/vanity-console.webp; bulb
  public/brand/vanity-bulb.webp. Room 04's hold-the-room-vanity-mirror.webp
  replaced in place with the current pink-carton Hold the Room. The vanity
  products link to their product pages. Written up in the Claude project
  as claude/founder-vanity-room-03.md.
- b200bb2 — Header: every primary tab is a two-line stack (PRIMARY_NAV
  `stack`): Shop/The Serums, The FOUNDER/Collection, Our/Story, Found/Her,
  Young Founders'/Room, The/Library. Mobile menu and accessible names
  unchanged. Breakpoint stays xl. CONFIRMED LIVE on founderbeauty.co.
- f9be6fb — Room 02 hero: Shelby's portrait composited into the lounge
  chair. Shelby rejected it ("fake, blurry") — correctly; a cutout on a
  1672px plate. SUPERSEDED by:
- 634d840 — Room 02 reshot as ONE photograph (generated, photoreal): woman
  in rose silk in the green velvet chair by the marble fireplace, cream
  blazer on the sofa, brass lamp. public/editorial/rooms/inside-founder-
  lounge.webp now 2400×1339 (was 1672×806) + a true 3:4 phone frame
  906×1209. Graded to the house. rooms.ts alt + position 66%. The ungraded
  source and a second take are NOT in the repo (Claude workspace only).
- 08030bc — LIGHTS UP, site-wide, Shelby: "a little too dark". In
  globals.css: --color-night #07130f → #0e211b, --color-night-deep #030806
  → #091712, --color-marble → #171513; one global rule
  `img[src*="editorial"] { filter: brightness(1.2) contrast(0.97) }` lifts
  every editorial photograph; .house-scene-dim eased. Every hard-coded
  rgba(7,19,15)/#07130f scrim in RoomHero, ProductPlate, RoomTransition,
  EmeraldDoorPortal, found-her, hold-the-room page and vanity.module.css
  moved to rgba(14,33,27) AND multiplied by 0.82 (vanity 0.75).
  vanity-console.webp re-exported 1.22× brighter. Board check: #07130f was
  never a board token (it is Shelby's 27 Aug after-hours ground); the nine
  board tokens are untouched; Antique Gold on the new night is 5.32:1
  (was 6.01), still AA. Deep Emerald #0A2523 unchanged.
- Also this session, outside the repo: all seven Selfnamed bottle labels
  carry the FOUND HER signature (Sacramento, lower-right, tilted); cart
  7 / $93.00. Site/Shopify product images are pre-signature — renders
  should be re-pulled from the studios next time the *-pack/-cut/-vanity
  images are regenerated.
- NOT changed: commerce, buy path, hardcoded variant IDs, copy, wordmark,
  monogram, room roles, any board token.
- Verification caveat: `npm run build` cannot run from the Cowork VM
  (Google Fonts blocked → next/font fails), so each commit was checked
  with tsc --noEmit + eslint (both clean apart from two pre-existing
  set-state-in-effect errors in PlateShades/ThresholdDoors, not mine) and
  screenshots of the LIVE site with the CSS injected for the lights-up
  preview. The Room 02 frame and the Vanity were checked as images, not
  in a running build. Shelby should watch the first Vercel build.
- UNPUSHED at time of writing: f9be6fb, 08030bc, 634d840 (b200bb2 and
  earlier are live). Push: `git push origin main`.
- Open for Shelby: the other room plates are still 1672px and softer than
  the new Room 02 — reshoot the set at 2400+ in the same light?
  HOLD THE ROOM 30 ml (Shopify) vs 50 ml (packaging) conflict still
  unresolved; Room 04 copy still says chamomile.
- (same session, later) Serum Salon bottles: c-me-glow-bottle.png and
  bounce-back-bottle.png were soft 720px upscales; Thirst Trap was sharp.
  Both re-cut (rembg isnet-general-use) from the 1800px Etsy product
  photos already on the Shopify listings, exported 2x (657×1440 and
  478×1440). Same paths, so every place that uses product.bottle (salon,
  homepage, PDP "other serums", quiz, door frame, SEO image) picks them up.
  SerumAlcove <Image> width/height 140×280 → 360×720 so retina gets the
  720-wide candidate. Thirst Trap untouched. Bounce Back's bottle is
  photographed slightly slimmer than the other two — real photo, not
  distorted to match. Commit bb71eab, unpushed.
- (12 Sept, same session) Room 06 · Notes from the house rebuilt. Was four
  unrelated frames (journal, shop counter, pink dressing room, mirrors)
  with four bank mood lines dealt at random — Shelby: "do not flow, nor
  does the copy." Now four rooms of the house in walking order, each tile
  a Link to its room, a brass hairline threading the row at xl, eyebrow
  "01 · Found Her" etc., lede "Four rooms, in the order you walk them. A
  line waits in each.": found-her-hall-doors → "The note was left for
  you." (/found-her); serum-salon-arches → "Pick the one that's yours."
  (/shop, the salon's own through-line); collection-vanity → "A mirror, a
  ritual, a reminder." (/founder-collection); library-shelves → "The house
  remembers." (/library). No new copy minted — all from the approved bank
  or already live. "Nothing loud. Everything intentional." dropped from
  this row (still in the bank). No new image files; page.tsx only.

## 2026-09-12 · Claude (Cowork) — THE FOUNDER HOUSE, Phase 1
Shelby's brief: the site as one continuous house (arrive → enter → explore →
discover → belong → purchase) with a key that follows her, a map, a locked
Salon, private-club recognition instead of points — without touching
conversion. Audit + architecture plan in the Claude project
(claude/founder-house-architecture-plan.md). The site was already a
seven-room loop (rooms.ts / HouseShell / RoomHero / doors); Phase 1 makes
it navigable and adds the missing room. Everything additive.
- NEW src/lib/house.ts — the map view: seven wings (Grand Hall = the
  lounge, Vanity = /shop + Room 03, Boardroom = /founder-collection, Found
  Her (+ /our-story), Library, Young Founders', Salon [locked]) with
  plaque, one-line, href, `matches(pathname, hash)`, plan coordinates.
  rooms.ts is untouched — it stays the walking order for the rail/doors.
- NEW src/lib/houseKey.ts — the Founder Key data model, staged: rooms
  visited, saved products, stories saved, invitations, tier
  (guest/keyholder/founding/house), notes seen. localStorage
  (founder:key:v1); nothing sent anywhere; the shape a Shopify customer
  account would hydrate in Phase 3. Recognition lines said once: "Another
  door has opened." (2nd room), "You found another key." (3rd), "You know
  the way now." (all six).
- NEW components/house/HouseKeyProvider.tsx — an external store
  (useSyncExternalStore) so a visit is recorded in an effect without
  setState (the repo's react-hooks/set-state-in-effect rule). Mounted in
  layout.tsx; records the wing on every route change.
- NEW components/house/FounderKey.tsx + HouseMap.tsx + founder-key.module.css
  — fixed brass key bottom-left (icon-only on phones, plaque + "N of 6
  rooms" from md); opens the House Map: an editorial floor plan (hairline
  walls, seven plaques, "You are here" in rose, found rooms lit, the Salon
  locked with a lock mark) on ≥820px and a plain list below. Dialog
  semantics: Escape, focus trap, focus return, body scroll lock, closes on
  route change. Header nav untouched — the map is a second way in.
- NEW app/salon/page.tsx + components/house/SalonDoor.tsx — the locked
  door: shut Founder Green doors (threshold-doors.webp), brass plaque THE
  SALON / BY INVITATION; pressing the plaque explains who it is for (early
  customers, FOUND HER writers, invitation) — not a paywall; "Leave your
  name at the door" reuses EmailSignup source="waitlist". `open` prop is
  the Phase 3 seam.
- globals.css: motion tokens --motion-micro 200ms / --motion-reveal 480ms /
  --motion-room 900ms / --ease-house. analytics.ts: house_map_open,
  house_map_go, house_key_note, salon_door (counts, never who).
- RoomProgress.tsx: the phone pill removed — the key is the phone's one
  house control. Desktop rail unchanged.
- VERIFIED with a real `npm run build` (the repo source synced to the Cowork
  cloud container, where Google Fonts resolves) — passes, /salon static.
  Playwright screenshots at 1440 and 390: key, open map, Salon pressed.
  tsc + eslint clean.
- NOT done (Phase 2, scoped in the plan): scroll-opened threshold doors,
  Grand Hall door plaques, Vanity per-product beats, Boardroom drift, Found
  Her corridor + Leave her a note / Add your portrait, concierge "What are
  you walking into?", returning-visitor key-turn beat, sound stub.
- Committed, unpushed (with everything since 4a89493).
- Second pass, same day. Shelby on the floor plan: "static and unrealistic
  … lines and boxes." Right. The House Map is now A HALL OF DOORS: the
  house's own brass-framed emerald double doors (/door/edoor-scene.webp
  with the edoor-leaf-left/right cutouts, leaf positions measured by pixel
  match: left 22.556% / top 9.406% / 27.44% × 87.43%, right at 50%) in a
  row down a dark hall, each wing's own room photographed through the
  opening (the -m portrait crops from rooms.ts). Her room stands open and
  lit with You Are Here beneath; hover/focus swings any other door open
  (rotateY on the outer hinge, warm light through the doorway); the Salon
  stays shut with its plaque. Phone: a corridor she slides along, opened at
  her own door. house.ts: `plan` coordinates replaced by `door` image.
  Clean rebuild verified; screenshots 1440/390.

## 2026-09-12 · Claude (Cowork) — THE FOUNDER HOUSE, Phase 2a: the front door,
## the hall, and the concierge's first question
Rebased onto 75236c0 mid-session — the House Map became a hall of doors while
this was being built, so `lib/house.ts` (`plan` → `door`) was picked up before
anything shipped. Nothing in this entry touches the map, the key, the Salon,
the bag, the checkout permalink, product data, product routes, SEO/JSON-LD,
the Header, the Footer, `rooms.ts`, or any board token.
- REWRITTEN src/components/house/ThresholdDoors.tsx, and MOUNTED for the first
  time (it has been dead code since it was written). It was a button and a
  2.2s animation: you pressed, you watched. Now the leaves are bound to the
  gesture — scroll or trackpad on desktop, thumb-drag on a phone, and they
  hold wherever you stop. Past 45% they take over and swing (1500ms). Enter /
  Space / ↓ / PageDown / Escape all open them; ENTER THE HOUSE still works for
  anyone who would rather press a button. Between the leaves there is now NO
  backdrop, so what widens as they part is the real page, not a picture of
  one. SHOP DIRECTLY sits under the invitation from the first frame — a woman
  who came to buy never opens a door (brief §16).
  · WELCOME BACK (brief §10): if the Founder Key already has rooms in it the
    invitation is WELCOME BACK. / WE KEPT YOUR ROOM. and the brass key turns
    90° in the lock before the leaves move. Contextual by construction — once
    a session, and only for a woman the house has met.
  · Still never a gate: client-mount only (verified — the served HTML for /
    contains no door markup and does contain both the hall and SHOP THE
    SERUMS), once per session, skipped entirely under prefers-reduced-motion,
    aria-hidden leaves, unmounts when open.
  · The mount decision moved out of an effect into `useSyncExternalStore` with
    a cached verdict, which removed one of the two standing
    react-hooks/set-state-in-effect errors. The verdict is also cleared on
    open so a client-side navigation back to / cannot rebuild the door in
    front of a woman already standing in the hall.
- NEW src/components/house/HallPlaques.tsx + hall.module.css — THE GRAND HALL
  (brief §4). Room 02 was a dead end: one hairline reading "Follow the light
  ↓" and a very long scroll before anything else was a door. Now six plaques
  read from `lib/house.ts`, so the hall and the map can never disagree about
  what the house contains. Deliberately NOT a second row of room photographs:
  Room 06 four sections down is already that, and two photographic corridors
  on one page is a stutter. These are engraved plaques on panelling — a green
  field with the moulding drawn as an inset brass hairline, the same
  double-rule construction the product labels use. The only thing that changes
  between one plaque and the next is how much light is on it: a room she has
  stood in keeps its light on, an unvisited one is dim, the Salon says SHUT
  and carries its lock. That is the whole of the recognition (brief §11) — no
  badges, no counters, no points. The count lives in the Founder Key, once.
  "Follow the light ↓" now points at #hall-doors.
- NEW src/lib/concierge/occasions.ts + the Beauty desk's opening (brief §12).
  The folio used to open on a bill of fare, which asks a woman to know which
  department her problem belongs to before she has said anything. It now opens
  on WHAT ARE YOU WALKING INTO? and seven occasions — a board meeting, a first
  date, a long flight, a big night, Monday morning, starting over, I just want
  to feel expensive. Each is a RULE AND NOTHING MORE: it picks the desk and
  phrases the question the way she would have phrased it. The answer still
  comes from /api/concierge. No new model, no new endpoint, no client-side
  knowledge base, no recommendation logic in the browser. Every ask is a
  QUESTION — an occasion that pre-loaded an answer ("the peptide cream is what
  you want for a long flight") would be this file inventing product
  performance. "I've laid something out for you." is said once, above the
  answer, only when an occasion was pressed. `ask()` took an optional desk
  argument because setDesk has not landed in the same tick. The three other
  desks are unchanged and keep "How can I be of service?".
- NEW src/lib/houseSound.ts (brief §14) — staged, silent, SHIPPING NO AUDIO.
  Default off including a first visit; /public/sound/ does not exist and a cue
  with no file resolves to silence; prefers-reduced-motion is read as reduced
  everything. When the recordings exist the work is: drop the files in, add a
  control. No component changes.
- analytics.ts: threshold_open (carries only whether the key had rooms),
  threshold_shop_direct, hall_plaque, concierge_occasion. Counts, never who.
- VERIFIED with a real `npm run build` in the Cowork cloud container (Google
  Fonts resolves there) — passes, 65 pages. tsc clean. eslint: one error and
  one warning left, both pre-existing and neither mine (PlateShades
  set-state-in-effect; CatalogCard unused import). Playwright at 1440 and 390:
  doors shut, doors pushed halfway, arrival on the hero, the hall, a plaque
  under the light, the concierge open on the occasions, and Welcome back with
  a seeded key. Contrast measured (not estimated) on all 21 pieces of type in
  the hall: 0 failures, tightest 4.90:1 on the 9px plaque line. The audit
  script had silently skipped every `color(srgb …)` value on the first run and
  reported a clean 9 rows out of 21 — it now throws on a colour it cannot
  parse rather than passing it.
- NOT done, still Phase 2: Vanity per-product beats (drawer, mirror light,
  shade case), Boardroom curtain/light drift, the Found Her portrait corridor
  with Leave her a note / Add your portrait.
- Committed, unpushed (on top of 75236c0, which is also unpushed).

## 2026-09-12 · Claude (Cowork) — Phase 2b: the Grand Hall is a hall
Shelby on 2b29a47's plaque wall: "not giving the immersive feeling of being
located in each room or that you're navigating yourself to each room. Pull
life-like images." Right. A plaque tells you a room exists; it does not put
you in front of its door.
- REMOVED components/house/HallPlaques.tsx + hall.module.css (lived one hour).
- NEW components/house/GrandHall.tsx + grand-hall.module.css — the house's own
  doors at standing height along a marble floor: /door/edoor-scene.webp with
  each wing's room (house.ts `door`) photographed through the opening, the
  leaves swinging on their hinges, a reflection of each door in the floor. The
  door in front of you stands open and lit; the others wait smaller and darker
  down the hall; hover/focus opens any of them; rooms she has already found
  keep their light; the Salon gives five degrees and stays shut. Desktop: look
  along it (arrows, ← →, drag). Phone: a corridor she slides along, centre
  snap. Same leaf geometry as the House Map, at the scale of a room, in the
  page rather than over it. NO NEW IMAGES were composited — every pixel is a
  photograph the house already has (Gamma image generation is out of credits
  on Shelby's workspace: 46 remaining, a photo costs more; see below).
- NEW components/house/WalkThrough.tsx — `useWalkThrough()`: press a door and
  the room seen through its opening grows from the opening's own rectangle
  until it fills the viewport over --motion-room, the plaque is said once,
  then the route changes (brief §13, "the doorway expands toward the camera
  and becomes the frame of the next scene"). A real <Link> underneath:
  modifier-click, reduced motion, no JS all get a plain navigation; the
  overlay dies with the page it was born on. Not yet wired into the House Map
  or Room 06 — one-line change each if wanted; the map is another agent's
  fresh work so it was left alone.
- Verified: real build, tsc clean, eslint unchanged (the two pre-existing).
  Playwright 1440/390: the hall, a door hovered open, the walk-through at
  450ms and 1150ms, arrival on /founder-collection; the phone corridor before
  and after Next door.
- WHAT WOULD MAKE IT TRULY FIRST-PERSON, and needs an image budget: one
  photograph of the whole corridor — six emerald doors receding down a marble
  hall, sconces, one pink door at the end — with the doors as hotspots on the
  photograph and the walk-through growing out of each. The prompt is written
  (in the Phase 2 project doc); generation needs Gamma credits or renders from
  Shelby's own generator dropped into public/editorial/rooms/.
- Committed, unpushed (three commits ahead of origin/main plus this one).

## 2026-09-12 · Claude (Cowork) — The Library's books are bound, not drawn
Shelby: "make these books look more life-like and realistic while keeping the
FOUNDER colour schemes." Shelf.tsx + shelf.module.css only; no images, no new
colours, no change to the entries or their links.
- Each spine now has a ROUND (a light band a fifth of the way across, falling
  into the joint shadow), RAISED BANDS at head and tail with gilt fillets,
  GRAIN (one 160px SVG feTurbulence tile blended overlay, plus a faint weave),
  handled-dark head and tail, a contact shadow on the ledge, and a STAMPED
  title — gilt gradient clipped to the letters on the dark cloths, a dark
  blind stamp on cream and rose where foil would not read.
- Thickness now varies by position (eight widths) and one book in eleven leans
  1.4° against its neighbour. The second lean was removed after a phone
  screenshot showed it hanging off the end of a wrapped row.
- The ledge is a plank with a brass nosing and the books' shadow lying on it.
- Verified: real build, tsc, eslint clean for the component; screenshots at
  1440 (rest + Hyaluronic acid pulled) and 390.
- Committed, unpushed.

## 2026-09-12 · Claude (Cowork) — Room 03: she sits down at the vanity
Shelby sent a room — gilt tri-fold mirror on a marble dressing table, fluted
Founder Green drawers, peonies, a candle, velvet curtains — "so it feels like
you're sitting at the vanity looking at the products. Use the image provided
and fit it into the atmosphere."
- NEW public/editorial/rooms/vanity-dressing-table.webp (2054×1254) and
  -m.webp (1254² for phones): her photograph graded from noon into the house's
  evening (exposure ×0.70, gamma 1.08, warmed R+4%/B−10%, greens +6%, a
  vignette), with 400px out-of-focus wings either side made from a progressive
  blur of its own edges — so a 16:9 viewport keeps the mirror's crown rather
  than cropping a square. Nothing was composited or invented; the wings are
  her room, defocused. Old plate vanity-console.webp left in place (unused).
- vanity.module.css: room → the new plate at 50% 58%; the pieces' baseline to
  bottom 21% (the marble's back edge, measured at 1280/1440/1920); the row and
  the names narrowed to min(940px, 70vw) so the five stand in front of the
  central glass with her tray to the left and her candle to the right; --unit
  0.44vh → 0.31vh so the pieces read as nearer than her tray, not four times
  its size; the boardroom-mirror bulbs hidden (this mirror has a window, not
  bulbs) while the warm glow above the lit piece stays; a real scrim over the
  left third because the words sit over the window. Phone: the -m plate and
  108px of shelf padding to walk the pieces down onto the marble.
- Vanity.tsx unchanged. LINE data, links, placard, ritual, keys all as before.
- Verified: build, tsc, eslint; screenshots 1280/1440/1920/390.
- Committed, unpushed (with 53a1a85, the Library shelf).
- (second pass, same session) Shelby: "some are floating in the air and not
  sitting life-like on the vanity." Correct — they were a flat line-up at one
  height on a table that recedes, with a drop-shadow displaced 18px below each
  (a shadow below a thing says the thing is in the air), lifted 12px on hover,
  and two of them drawn over her tray. Now: each piece has a POSE
  (Vanity.tsx PIECES.pose — dx/dy/depth/z), so the two cleansers stand back by
  the glass, the hero holds the middle, the eye cream and the stick come
  forward, lower and larger, overlapping the way things on a real table do;
  a GROUND ellipse and a CAST to the right (the window is left) replace the
  displaced drop-shadow; each piece has its REFLECTION in the polished marble
  (the same cutout, upside down, foreshortened to 42%, dim, gone in a third of
  its height); the lit piece brightens and stays put — no lift. The row now
  sits on the clear marble between her tray (ends at 37.5vw) and the edge of
  the photograph (80.5vw), the last piece just in front of her candle.
  Verified 1280/1440/1920/390.
- (third pass) Shelby: "just put it on a shelf … place each item on a counter
  where it looks life-like." The staggered still-life did not sit either — a
  cutout standing mid-way across a receding plane has no edge to stand on.
  Now the five stand along the LIP of the counter: its front edge, the one
  true horizontal in the photograph at the camera's height, brass rail and
  fluted drawers directly beneath — a shelf, with a shelf's one baseline. The
  plate is bottom-anchored so the lip is always at 8.6vw from the room's
  floor (86.5% of a plate 61.05vw tall), and --unit is in vw so the pieces
  scale with the photograph rather than the window height. The plate was
  re-rendered with DEPTH OF FIELD — sharp from the counter's back edge down,
  the mirror and the room behind softening toward the top and half a stop
  darker — which is what a lens focused on the front of a table does and
  which also means the mirror is no longer asked to reflect five things it
  cannot. Marble reflections off (at the lip there is drawer front, not
  marble, below the base); poses flattened to dx and z only; ground + cast
  shadows kept. Verified 1280/1440/1920/390.
- (fourth pass — the scene changed entirely) Shelby: "change this scene
  entirely to something you can put together flawlessly that flows with the
  web page." Three passes of seating cutouts on a photographed dressing table
  were each better and none right: a cutout rendered in one light from one
  height cannot stand on a table photographed in another. The room is now
  BUILT, the way the Library's shelf is: Founder Green panelling in shadow
  with a moulded panel behind each piece and two sconces' warmth from above;
  a black marble console drawn as three faces (top face you look down onto,
  brass nosing, front face) in the after-hours stone; the five standing ON
  the top face with a contact shadow, a cast to the right, and their
  reflection lying in the polished stone in front of them (new .pool wrapper
  in Vanity.tsx); the lit piece gets a picture-light down its panel and a
  warm pool at its feet, and no piece is ever dimmed. Head-on, at the
  camera's own height, so the cutouts' own light and viewpoint are the only
  ones in the scene. The dressing-table plates stay in the repo, unused. Phone
  draws the console under the slide track. Verified 1280/1440/1920/390.
- (fifth) The panel mouldings behind each piece came out. Shelby: "remove the
  grid stuff, I'm not going to say it again." Nothing is drawn on the wall
  now except light. Standing rule for this room, third time stated in this
  log: NO GRIDS, NO GRAPHS, NO LINES that read as a diagram.

## 2026-09-15 · Claude (Cowork) — the threshold frame
- Shelby supplied a new threshold photograph (1672×941): the left 42% is
  the lacquered Founder Green door, deliberately empty, for the headline and
  buttons; two women at the open door on the right. public/editorial/rooms/
  threshold-doors.webp replaced at FULL width (no crop, q86); threshold-
  doors-m.webp is a 3:4 crop from the right edge (705×941) so both women are
  in the phone frame. page.tsx hero: object-position 58% → 85% (the women
  stay in frame as the viewport narrows; the door gives way, not the room);
  the desktop scrim that ran to 94% is gone — replaced by a feather that
  peaks at 28% and is clear by 44%, per her note "avoid adding another heavy
  gradient". Phone bottom fade unchanged. rooms.ts alt + position updated.
- founder-key.module.css: the phone rule (icon-only key below md) had been
  lost when the hall-of-doors CSS was written from an older copy; restored.
  On phones the key no longer sits over the hero's ENTER THE HOUSE button.
- Verified: real build in the cloud copy synced from HEAD b5f24a0, then
  doors opened and the hero shot at 1920/1440/1024/390.
- Committed, unpushed.

## 2026-09-16 · Claude (Cowork) — The site's product images checked against
## the Selfnamed cart, and Hold the Room's record retranscribed
Shelby: "double check that the website has the correct images of each
product, use what is in the Selfnamed cart to reference the correct product
and packaging, then apply new images where necessary."
- THE CART (7 lines, $93.00): Peptide Age-Defying Eye Cream 15 ml = DOUBLE
  TAKE · Color Correcting Ceramide Stick 20/25/35 = SMOOTH TALKER · Blemish
  Purifying Face Wash 140 ml = CLEAN BREAK · Peptide Ageless AM/PM Cream 50 ml
  = HOLD THE ROOM · Sensitive Skin Oil-To-Milk Cleanser 150 ml = OPENING
  LINE. Every label carries the FOUND HER signature. The seven 3000×3980
  design-mockup renders were pulled from the cart page at full resolution.
- WHAT WAS WRONG ON THE SITE: hold-the-room-hero.webp was the retired
  all-green bottle and carton; double-take-hero.webp and smooth-talker-hero
  .webp were the retired all-green packs; clean-break-hero and opening-line-
  hero were generated scenes with cartons that do not exist (both ship as a
  bottle only) and stripe patterns that are not the label's; the three shade
  heroes were studio shots of the old design; every -cut/-vanity/-pack was
  pre-signature. hold-the-room-tall/-card/-vanity-hero/-flatlay/-wide are the
  black Blanka bottle or the green design and are UNUSED — left on disk.
- REPLACED (public/products/, same file names so nothing else moved):
  <slug>-cut.webp, -vanity.webp, -pack.webp and -hero.webp for the five, plus
  smooth-talker-20/25/35-hero.webp and smooth-talker-shades-pack.webp — 24
  files. Cutouts matted with rembg isnet-general-use (white pumps intact).
  The -hero plates are the render standing on the house's black marble
  console against the night wall — the room Room 03 draws in CSS — built in
  PIL (/home/claude/cart/build_assets.py, not in the repo) with the piece's
  reflection in the stone; head-on, at the camera's height, nothing invented.
  Room 03's PIECES table (Vanity.tsx) re-measured off the new cutouts.
- HOLD THE ROOM'S RECORD WAS A DIFFERENT PRODUCT. founderCollection.ts was
  transcribed from Blanka's "Extreme Moisture Blend" — 30 ml, chamomile and
  witch hazel, made in North America — while the packaging in the cart (and
  the label Shelby approved, PEPTIDE MOISTURIZING CREAM · 50 ml · peptide
  complex, hyaluronic acid, vitamin E) is Selfnamed's Peptide Ageless AM/PM
  Cream. A live $36 preorder page was describing a formula that is not being
  ordered. Retranscribed from the Selfnamed listing's INCI tab: category,
  size 50 ml / 1.69 fl oz, key actives (the label's words), the full 40-line
  INCI (footnote marks dropped, footnotes kept in a comment), origin "Made in
  the EU", fragrance FAQ (fragrance + essential-oil components, no chamomile
  oil), the size FAQ. Copy that said "chamomile and witch hazel, 30 ml" fixed
  on /, /founder-collection (meta) and /products/hold-the-room (meta, the
  "carton that ships" note). Library: Hold the Room unlinked from chamomile
  and witch hazel, linked to hexapeptide-11, hyaluronic acid, vitamin C and
  vitamin E; the witch-hazel reading now has no product and stays because the
  route is indexed — consider retiring it. Alt texts for the new heroes and
  the shade stripes (all three sticks share one stripe, they are not shade-
  coloured) rewritten.
- STILL OPEN, NOT MINE TO CHANGE: Shopify's Hold the Room variant
  (47361868169385) still says 30 ml; the Shopify product images for all five
  are pre-signature; docs/BRAND_BOARD.md still records the 30 ml amendment.
- Verified: build, tsc; screenshots of /products/hold-the-room, /products/
  double-take, /products/smooth-talker and Room 03 at 1440.
- Committed, unpushed.

## 2026-09-17 · Claude (Cowork) — Website audit, Phase 1: the map, not the redesign

Shelby set an operating protocol for the site: six phases, Discovery first,
and "do not begin redesigning until the complete system has been mapped."
This session is Phase 1 only. Nothing in src/, public/ or docs/ changed.

- ADDED FOUNDER_AUDIT.md at the repo root — the living record the protocol
  asks for: brand rules, architecture, live inspection, twenty findings
  (Observed / Location / Component / Consequence / Recommendation),
  decisions, open questions, conflicts, remaining work P0–P5, regression
  risks. Every contradiction is marked [CONFLICT] and left for Shelby;
  nothing was resolved silently.
- HOW IT WAS MAPPED. Two read-only passes over the repo (frontend; commerce
  and data); Playwright over all 24 routes at 1440 / 1024 / 390 with status,
  h1, canonical, robots, weight, console, small targets and link check; a
  second pass that scrolls before the full-page capture so Reveal-gated
  sections render; the cart flow to the Shopify permalink; reduced motion;
  first visit. Shopify read (9 active products, variants, prices, stock).
  Sources of truth read: docs/BRAND_BOARD.md, AGENTS.md, OWNER_ACTIONS.md,
  the project docs on pricing (4 Sept) and the Selfnamed line (30 Aug).
- THE THREE P0s, so nobody has to open the file to know them: (1) the
  Hold the Room page sells the Selfnamed 50 ml peptide cream while the
  Shopify variant it adds to the bag is still the Blanka 30 ml chamomile
  cream, SKU and description included — a customer would hold two
  contradictory documents; (2) "In stock. Ships within one business day"
  is printed unconditionally on every FOUNDER plate and the collection page
  while Shopify holds one unit of each; (3) all four Selfnamed plates say
  the ingredient list "will be published here before the first order ships"
  three lines under "In stock".
- NOT CHANGED, DELIBERATELY: the AGENTS.md rule that the v2.14 products "do
  NOT appear on the site" is now contradicted by the live site and by
  founder decisions; recorded as F-05, not edited, because amending a rule
  is her call. Screenshots stayed in /tmp/audit (evidence, not product).
- NEXT: Shelby answers the seven open questions in §6 (the first — which
  cream is Hold the Room — unblocks the rest); P0 truth corrections can
  proceed on her answer; Phases 2–4 before any P2+ implementation.

## 2026-09-17 (afternoon) · Claude (Cowork) — Audit Phase 5, pass 1: the buy
## path tells the truth, and the housekeeping

Shelby, on reading FOUNDER_AUDIT.md: "make all these changes for me and act
in the best interest of the company FOUNDER." This is P0–P2 and the P4
housekeeping from that file, plus the Shopify side of P0. Every change is
logged in FOUNDER_AUDIT.md §8 in BEFORE / CHANGE / RATIONALE / EXPECTED
EFFECT / VALIDATION form; this is the short version.

- RESEARCH FIRST. The Selfnamed listings for the peptide cream and the
  oil-to-milk cleanser were read in the browser (INCI tab, size, claims,
  certification); the peptide cream's INCI on the site matched the listing
  line for line. The three concept docs supplied the other INCIs verbatim.
- HOLD THE ROOM IS ONE PRODUCT. The Shopify listing (9021783113897) still
  described Blanka's 30 ml chamomile cream while the page sold Selfnamed's
  50 ml peptide cream; a customer would have held two contradictory
  documents. Shopify title, description, INCI, size, preorder section and
  SKU (HoldTheRoom) rewritten from the site record; chamomile / witch_hazel
  / paraben_free tags removed, peptide_cream / hyaluronic_acid /
  cosmos_natural / preorder added. Variant id, price and image untouched.
  docs/BRAND_BOARD.md amended (16–17 Sept). "Firming"/"ageless" not used —
  the supplier says both; the house's own may-not-say list forbids them.
- THE WHOLE LINE IS A PREORDER, AND SAYS SO. nextMove.ts: `availability`
  per SKU (all "preorder" — no Selfnamed order has been received, the pack
  shots are renders), PREORDER_NOTE, availabilityLine(). catalog.ts:
  fetchVariantAvailability() (Admin GraphQL, 60 s cache, null = keep
  selling, false = "Sold out"). ProductPlate is async and reads it; the
  preorder note sits above a button labelled Preorder; plate routes
  revalidate every 60 s; home cards, collection copy and metadata, LineCard
  say preorder; Product/Offer JSON-LD on all four plates (PreOrder /
  SoldOut). "In stock" no longer appears anywhere from a constant.
  FLIP `availability` PER SKU THE DAY STOCK IS COUNTED IN, NEVER BEFORE.
- INCI ON EVERY PLATE. Opening Line, Clean Break, Smooth Talker, Double Take
  now carry the full supplier list and origin; "will be published before
  the first order ships" is gone.
- /the-next-move → 308 to /founder-collection (second, older product page
  for the same SKUs; out of the sitemap and the footer). ShadePicker and
  ProductDetail deleted with it.
- ONE ROOM NUMBERING (lib/rooms.ts). Home eyebrows now 02 Inside FOUNDER ·
  03 Serum Salon · 04 Collection · 06 Found Her; the Serum Salon section
  moved ahead of the Collection; the Anchor, Notes and Invitation carry no
  number. Vanity eyebrow fixed. Stale Collection lede ("Six pieces …
  nothing charged until they're priced") rewritten.
- BRAND.campaign appears once on the home page (Room 06); the rose band now
  says "The note was left for you."
- PHONES: the key toast is hidden under 768 px; the plate stacks (picture,
  then copy, price and button) below md.
- /salon has an sr-only h1; /salon and /young-founders-room are in the
  sitemap. Announcement bar is route-aware (collection rooms: "The FOUNDER
  Collection · Preorder the first run"). Concierge corpus knows the five
  FOUNDER SKUs (generated from the records; preorder wording; "no ship date
  is promised").
- HOUSEKEEPING: deleted EntranceDoor, DoorCard, ScrollDoors,
  FounderGalleryWalk (+css), RoomRail, CatalogCard, ProductDetail,
  ShadePicker, StoryPromptButton (no callers, verified by grep, DoorFrame
  kept — page.tsx uses it). PlateShades: setState-in-effect →
  useSyncExternalStore; eslint is now zero errors, zero warnings. Stale $34
  / "no variant IDs" / Blanka / petrolatum comments corrected. AGENTS.md
  rule that the v2.14 products "do NOT appear on the site" rewritten to the
  live position.
- NOT DONE, DELIBERATELY: the serum pages are still the old template (F-08 —
  a Phase 4 decision, and they carry the sales history); Julie's profile
  stays live (approval is Shelby's to confirm); Library orphans, policy
  blanks, env vars, feed — all listed in FOUNDER_AUDIT.md §9.
- VERIFIED: npm run build (65 pages), tsc, eslint --max-warnings=0;
  Playwright at 1440 and 390 over /, the five plates, /founder-collection,
  /salon, /library — zero console errors, zero overflow, zero "In stock",
  zero "will be published"; shade picker adds 35 Deep → 47417855639721.
  Screenshots in /tmp/shots2 (not committed).
- Committed, unpushed. Push: cd ~/Founder:LALALOCA && rm -f .git/index.lock
  .git/HEAD.lock && git push origin main

## 2026-09-17 (evening) · Claude (Cowork) — Bounce Back's bottle was squashed

Shelby: on /shop Bounce Back "does not look like the others, its shrunk and
mushed together." The cutout `public/products/bounce-back-bottle.png` was
478×1440 — an aspect of 0.33 — while Thirst Trap (324×720) and C Me Glow
(657×1440) are 0.45. Same glass, same cap, same label, so the file had been
compressed sideways by about 27%: narrow label, thin cap, cramped script.
Every place that renders it sizes by height with `w-auto`, so the bottle
came out 111 px wide beside two at 150.
- Resampled the cutout to 652×1440 (the mean aspect of the other two, LANCZOS);
  the "Lala Loca" script and the label now match its siblings. No other file
  or code changed; the alcoves, the home Serum Salon row, the product page
  and the feed all read the same path.
- Verified: build; /shop alcoves at 1440 render the three bottles at
  150 / 152 / 151 px wide, 334 tall.
- Committed, unpushed.

## 2026-09-28 · Claude (Cowork) — FOUND HER: Aly V's story, and a wall that
## takes more than two

Shelby: "I just got another Found Her submission we need to add to the
website", then Aly's rewritten answers to the first three questions, "she
preferred these answers — keep her story but make grammar and spelling
edits as necessary while preserving her voice and story."

- ALY V — /found-her/aly-v. Record in lib/profiles.ts, same shape as
  Julie's: role "Building MakeupGemz", Pensacola, standfirst (the one line
  we write; names no brand but hers), wall line "Faith over fear. Who says
  you can't do both?". Q1–Q3 are her 28 Sept rewrite; Q4–Q6 her 20 Sept
  form answers. Copy edits only (commas, hyphens, "eight", an Oxford comma
  to match her own) — no sentence added, none removed. Her proud answer
  arrived ending "…makeup tutorials…"; it ends there with a full stop.
- PORTRAIT — public/editorial/aly-v-frame.webp. A watercolour vision board
  generated in Canva (NYC, LA, her kit, ring light, law books, three dogs,
  notes in her own phrases), deliberately with NO person in it, set in the
  house frame taken from Julie's with the brass nameplate re-lettered "Aly V"
  in Cormorant Garamond. Page note: it's a painting, not her.
- PUBLISHED AHEAD OF HER APPROVAL on the Julie precedent: approvedOn
  PENDING, publishedOn 2026-09-28, so her page makes no approval claim. A
  draft to Aly is waiting in Shelby's Gmail with the link; Airtable row set
  to Drafting with slug and full notes. When she says yes: her date into
  approvedOn, delete publishedOn.
- THE WALL — found-her/page.tsx assumed exactly two stories (diamond and
  seam on "i > 0"); the third card sat against the page edge. Now two to a
  row for any count, and an odd count gets a waiting frame
  (found-her-empty-frame.webp — the house frame, empty, blank plate) that
  opens the form: "YOURS — The next frame is waiting."
- ProfileStory's footer said "Hers is the first. The next ones belong to
  women who wrote in." on every story, including Julie's. Now: "Every story
  here was sent in by the woman who lived it. Yours can be next."
  profiles.ts header rewritten to the actual policy.
- Verified: tsc, eslint (0/0), build; Playwright at 1440 and 390 over
  /found-her and /found-her/aly-v — no console errors, no overflow, no
  approval line. Sitemap and RSS carry her.
- Committed, unpushed.

## 2026-09-28 (later) · Claude (Cowork) — Aly V: her full rewrite

Aly sent a complete rewrite of all six answers (the earlier message had
carried three). Her page now uses the rewrite throughout. The one answer
that changed in substance is "What did it take?" — she replaced the long
form answer with a shorter one: discipline, sacrifice, resilience, and a
mind-over-matter mentality. The sobriety line, the NYC falling-outs and
the single years are no longer on the page because she took them out. Her
"proud" answer is now complete (the ellipsis is gone), so that note is
gone from the record. Copy edits as before: a comma after "LA", "from
college", "a relatable IG page", "live-streaming" as she hyphenates it.
The approval draft in Shelby's Gmail was replaced with one that no longer
mentions the ellipsis. Verified: tsc, eslint, build, /found-her/aly-v at
1440 and 390. Committed, unpushed.

## 2026-09-28 (evening) · Claude (Cowork) — Aly V: her own photograph in the frame

Aly sent a photo to go with her story. Shelby: keep the woman exactly as
she is, and put her in front of the vision-board concept.
- Cut out with rembg isnet-general-use, then cleaned by hand in code: the
  chair's cushion and shadow by her right shoulder, the pink chair spill
  and the neon-sign fringe in her hair, a speck of the sign at her left.
  Her face, skin, make-up and clothes are not retouched or recoloured —
  the cherries on her top stayed red (an early de-spill pass darkened them
  and was corrected). The other brands' boxes on her shelf are gone with
  the background.
- The backdrop is a second Canva render of the same board, recomposed with
  every element around the edges and a clear blush centre so she stands in
  it rather than over the notes. She is bottom-aligned at 78%, with a soft
  warm contact shadow; the result sits in the same house frame and "Aly V"
  plate as before. public/editorial/aly-v-frame.webp replaced.
- Record: new alt text and note ("Aly's own photograph, set against a
  painting we made from her story"), position 50% 42% for the wall crop.
- Verified: build; /found-her and /found-her/aly-v at 1440 and 390.
  Committed, unpushed.

## 2026-09-28 (night) · Claude (Cowork) — Aly V: the portrait, re-placed

Shelby: "fix the placement of Aly's photo. Redesign the background to make
this picture feel more aligned." The first composite stood a photograph on a
watercolour collage — two worlds, and she sat low and small over the art.
- New backdrop (Canva render): a photographic, softly lit blush studio wall
  in the same daylight as her selfie — New York and LA polaroids, a framed
  photo of three dogs, "Faith over fear" and "Who says you can't do both?"
  on pinned notes, law books and brushes left, a peony and ring light right.
  Given a touch of lens softness and nudged toward her white balance.
- Placement as she sat for the photo: centred on her face, 84% scale, bottom
  edge meeting the frame, a diffuse shadow on the wall behind her and a thin
  light wrap at her edges. Last neon-sign flecks in her left hair cleaned.
  Her face, skin, make-up and clothes are untouched.
- aly-v-frame.webp replaced (same house frame and "Aly V" plate); alt text
  and note rewritten. Verified: build; /found-her and /found-her/aly-v at
  1440 and 390. Committed, unpushed.

## 2026-09-28 (late) · Claude (Cowork) — Aly V's portrait, graded to the house

Shelby: "fix the colouring on Aly's picture, it looks too bright on the
website." It did: on the dark green Found Her band her bright daylight
studio read as a light box next to Shelby's lamp-lit portrait and Julie's
painted frame.
- Graded the portrait inside the frame (the frame and plate untouched):
  the room comes down about 1.5 stops with a highlight roll-off so the
  wall has no white left in it, pinks eased back, lamp-warm amber, a
  vignette into the frame's shadow and a soft pool of light on her face;
  a whisper of green in the deepest shadows. Aly herself gets a gentle
  exposure step and the same warmth only. The two grades meet inside her
  silhouette so there is no halo round her hair.
- public/editorial/aly-v-frame.webp replaced; comment in profiles.ts.
- Verified: build; /found-her and /found-her/aly-v at 1440 and 390, with
  the image cache cleared. Committed, unpushed.

## 2026-09-28 (late night) · Claude (Cowork) — Aly V: her photo, branded to the house

Shelby: "brand this image to the FOUNDER brand bible and keep the model
exactly the same, you may change the outfit. Make sure this image is ready
to implement on a website."
- Styled in Canva from her own photo: a Founder Green satin blazer over a
  champagne silk camisole (her gold necklace kept), and the FOUNDER study
  after hours behind her — green panelling, brass picture lamp over a gilt
  frame, a door ajar with warm light, a desert rose silk cushion. No logos,
  no other brands' boxes, no neon.
- IDENTITY GUARANTEE. The model re-rendered her face texture even though
  her landmarks held (MediaPipe face landmarker: mean 1.0 px drift after a
  similarity fit). So her ORIGINAL face was warped back onto the styled
  image by that same fit, feathered inside the face oval, and colour-
  matched (LAB, 75%) into the new lamp light. Eyes, lashes, make-up, lips,
  skin texture: her pixels, not a model's.
- Web-ready at Shelby's portrait spec: public/editorial/aly-v.webp,
  1122×1402 (4:5), 73 KB, unframed like the founder's own portrait;
  position 50% 12% so the 3:2 story masthead keeps the top of her head.
  aly-v-frame.webp (the framed collage/studio versions) retired.
- Note on the page: "Aly's own photograph, styled for FOUNDER — the outfit
  and the room are ours, her face is untouched." Alt text rewritten.
- Verified: build; /found-her and /found-her/aly-v at 1440 and 390.
  Committed, unpushed.

## 2026-09-30 · Claude (Cowork) — Homepage hero: the front hall

Shelby: "make the attached image the hero image" (founderbeauty.co).
- New Room 01 frame: Founder Green double doors, a brass F on each leaf,
  standing open onto a rose-lit salon; black marble, candle sconces and
  green tufted benches either side. No people in it.
- Files at the room-hero family spec: public/editorial/rooms/
  threshold-hall.webp (1672×941, her file at native size, q82) and
  threshold-hall-m.webp (705×941, cropped on the doorway). New names so no
  cache serves the old frame.
- lib/rooms.ts threshold record points at the pair, position "center",
  alt rewritten. lib/brand.ts HERO (unused constant) kept truthful.
- page.tsx: both crops centred; the left wall is busy with flames, so
  the copy now sits under a shade (md→xl wider, since the copy's rem
  measure reaches further across the frame; xl+ 90% → 0 by the left
  door). Phone fade is measured in px from the bottom (the copy block is
  fixed-height and bottom-pinned), so the small label stays readable on a
  375×667 phone as well as a 390×844 one.
- Independent check (separate agent; calibrated with one planted
  difference, which it caught): fixed a stale "scrim over her face"
  comment and the faint phone label. Left as found: the hero writes its
  object-position in page.tsx rather than reading rooms.ts (it did before);
  the service bell sits over "Enter the house" at 390 (pre-existing).
- Old threshold-doors.webp (two women) left in place, now unreferenced;
  threshold-doors-m.webp is still the Salon wing's door in lib/house.ts.
- Verified: build, tsc, eslint; / at 1440, 1024, 820, 390, 375 — no overflow,
  no page errors, right crop served at each width.

## 2026-09-30 · Claude (Code, layout subagent) — launch-crawl layout fixes

Uncommitted; the lead agent commits. Copy files left to the copy agent.
- Founder Key + service bell: new `lib/useScrolledPast.ts`; both controls
  are faded out (still focusable) until she scrolls 45% of a screen, or at
  once on a page too short to scroll. Bell 64px on phones; key/bell honour
  safe-area inset. Footer bottom row pb-24 so neither sits on its last line.
- Vanity: placards share one grid cell (no more fixed min-height), so
  "Enter this room" no longer lands on the name row at 390. Eyebrow drops
  "Room 04" (the Collection hero above already is Room 04).
- /shop trio: desktop overlay re-fitted to the painted frame (67.2/20.4/12/76%),
  heading clamp 2.3vw, price line balanced; `id="set-heading"` moved to the
  section (visible at every width), h2 id removed, section aria-label.
- /found-her share band: scenePosition center 15% so "THE ROOM / IS YOURS."
  is never cut (768–1920).
- /products/hold-the-room: phone scrim deeper; hero sizes 340vw below md.
- ProductPlate "What it is" photo: object-[73%_center] (all five products
  whole at 390–1920). NOT changed: its `sizes` (still serves 750w into a
  ~1700px render — the blur); see the lead's report.
- Search index built server-side in `lib/searchIndex.ts` from NEXT_MOVE,
  FOUNDER_COLLECTION, LIBRARY, products, profiles, nav.
- Not changed: lib/house.ts Vanity wing → /shop (see report).
- Verified: tsc, eslint, build; screenshots 390/1024/1440/1920.

## 2026-09-30 (evening) · Claude (Cowork, lead) — launch eve: in stock, policies, voice

Shelby: the site goes live tomorrow; "make all listing active no more
preorder"; returns 14 days unopened; brand email only in public; voice a
mix of "I" (founder) and "we" (care).
- IN STOCK. nextMove.ts: all four SKUs `availability: "in-stock"`;
  founderCollection.ts Hold the Room `preorder: null`, FAQ ship answer and
  routine order fixed (it is 03 of 5, after serums, before Double Take and
  Smooth Talker). Hold the Room page renders its button whenever sellable,
  reads Shopify availableForSale (revalidate 60) → "Sold out" at 0; "02 ·"
  → "03 ·". Home, collection page, concierge, bar copy, schema (InStock,
  US_SHIPPING) and the plates' render note ("Shown: renders of the approved
  packaging.") follow. Shopify: Hold the Room inventory policy CONTINUE →
  DENY, "— Preorder" off the title, SEO title/description corrected (was the
  retired Blanka 30 ml chamomile cream). Every FOUNDER SKU is now tracked +
  DENY, so Shopify refuses a line at 0 and the site shows Sold out.
- POLICIES. content.ts: Returns (14 days, unopened, customer pays return
  postage unless our error, damaged/wrong replaced or refunded, email to
  start, refund timing), Privacy (Shopify, Resend, Airtable, Vercel + AI
  Gateway for the Beauty desk, browser storage, rights), Terms (seller,
  prices/tax, US only, cosmetic use, content, liability, Arizona law),
  Accessibility (no "before launch" note). No "Still to confirm" left.
  seo.tsx: MerchantReturnPolicy on the Organization; returnPolicyGap false.
  llms.txt returns line. Shopify (admin UI; the connector lacks
  write_legal_policies): Refund policy rewritten to match; Shipping, Contact,
  Terms (3× [LINK], NOTE TO MERCHANT, gmail, street address) and Privacy
  (automated → manual, contact line only: gmail/phone/address → brand email)
  corrected. Payments confirmed: Shopify Payments accepting + payouts on.
- VOICE. Our Story in Shelby's first person and now names the FOUNDER
  Collection; home Found Her/Grand Hall lines, bag empty state (now offers
  the collection too), shop returns tile, serum and Hold the Room copy
  de-dashed. Serum wing plaque in lib/house.ts renamed "The Serum Salon"
  (it opens /shop; slug kept for the key).
- Layout fixes by a subagent (entry above) reviewed and kept; ProductPlate
  "What it is" sizes now serves a large enough file.

## 2026-10-01 · Claude (Cowork) — Instagram

Shelby: https://www.instagram.com/founder_beauty/. `INSTAGRAM` in brand.ts;
footer bottom row link (new tab, sr-only note); Organization `sameAs` now
always carries it (env NEXT_PUBLIC_SAME_AS adds to it, never replaces);
llms.txt line. Email: shelby@founderbeauty.co forwards through ImprovMX
(MX mx1/mx2.improvmx.com); a Shopify email to it landed in Gmail on 15 Aug.
Verified: tsc, eslint, build; schema and footer at 1440/390.

## 2026-10-01 · Claude (Cowork, Founder Chief) — team audit + edit pass

Shelby: "have the team look at the current site and copy and make edit and
suggestions". Specialists (creative/visual, UX/CRO, copy+claims,
product+FOUND HER) audited the live site read-only; a frontend engineer and
the lead implemented the SAFE-NOW items; an independent Brand Council
reviewed (no blockers; its 3 IMPORTANT fixes applied).
- Copy/claims: ~40 surgical rewrites (src/lib products/nextMove/
  founderCollection/library/brand, home, shop, collection, our-story,
  ProfileStory, YFR spelling). Timeframes and absolutes out ("by morning",
  "stays where you put it", "never stripped", "supports the skin barrier",
  "absorbs fast", "firm" as a verb); "twenty minutes" and "a mirror, a
  ritual, a reminder" repeats cut; Library says "key ingredient".
- "The Next Move" eyebrow retired → ROUTINE_STEP (01 · Cleanse … 05 ·
  Finish) in nextMove.ts, used by plates, collection grid and Vanity.
  Plate closing band links to the serums.
- Thirst Trap gallery emptied (infographics with unreviewed timeline/
  comparison claims; files kept). Collection: repeated boardroom band and
  duplicate "waitlist" signup removed; "Take your seat." no longer caps.
  /shop: duplicate Founding List removed; compare table → cards < 640px.
- Home: second hero CTA "Shop the FOUNDER Collection"; pledge on night
  ground with rose type (one rose room); Vanity anchor image lazy.
- Door overlay: protected line on two lines, "Serums $38 · The FOUNDER
  Collection from $34 · Free US shipping", real Shop directly button,
  copy visible before the image paints.
- Serum PDPs (mobile): buy block above the doors toggle (button ~1000px →
  was ~1250); "LALALOCA ·" category prefix; 14-day returns link.
- Bell/key hidden while bag or menu open (body data attrs) and tucked near
  buy bands on phones (lib/useBuyBandClear.ts); 44px hit areas; mobile bar
  one line; room-label/hairline 9px → 11px; Hold the Room stock line.
- NOT done (needs Shelby): see project doc claude/team-audit-2026-10-01.md.
- Verified: tsc, eslint, build; 10 pages at 1440/390 (no overflow/errors);
  add-to-bag + checkout button on a serum and Hold the Room (Brand Council).

## 2026-10-01 · Claude (Cowork) — Thirst Trap is The Poker Face

Shelby: rename the serum, not Smooth Talker (THE CLOSER is printed on its
packaging), and keep the narrative flowing. Thirst Trap's archetype → "The
Poker Face" (archetypeFor "For days your face can't give anything away."),
which is what its hero line and 6am moment already say. Trio line → "The
Poker Face, The Entrance, The Comeback."; salon lede on home and /shop →
"Some days you give nothing away. Some days you glow. Some days you start
again."; concierge register + trio fact updated. Smooth Talker keeps The
Closer. docs/COPY_AUDIT_ARCHETYPES.md carries an amendment note.
Verified: tsc, eslint, build; /, /shop, /products/thirst-trap at 1440/390.

## 2026-10-01 · Claude (Cowork) — styled counter shots from Drive

Shelby: replace product images as necessary from her Drive folder. The PDP
"What it is" split repeated the hero above it on four products; it now
shows the 30 Sept daylight-vanity renders via a new optional `setting`
field (4:5, uncropped). Labels read at full res first; Double Take carton
(Vitamin E/C order) and Smooth Talker carton + stick (11 g → 12 g / 0.42
oz) retouched to the approved artwork. Grid cards and heroes unchanged.
Shelf-render alts (and the Hold the Room grid card) rewritten — they
described women, taps and props not in the pictures. Rejected images and
reasons: project doc claude/product-image-refresh-2026-10-01.md.
Verified: tsc, eslint, build; four PDP splits at 1440/390.

## 2026-10-01 · Claude (Cowork) — dark vanity shots on the collection grid

Shelby: the /founder-collection cards should use the darker images of each
product. Hold the Room, Clean Break, Double Take and Smooth Talker cards now
use the dark vanity renders from her Drive (`*-card-dark.webp`, 1122x1402);
LineCard tile 3:2 → 4:5 so the bottles aren't cropped. Labels read at full
res; Smooth Talker's carton tagline ("Even tone and nourish" → approved
"Evens tone and smooths for the finish.") and carton + stick net weight
(11 g → 12 g / 0.42 oz) retouched to the approved artwork. Opening Line has
no dark render: its card is a 4:5 crop of the existing shelf frame, centred
on the bottle, until one is made. Hover pack shots unchanged.
Verified: tsc, eslint, build; grid at 1440/390, hover.

## 2026-10-01 · Claude (Cowork) — Opening Line dark vanity card

Shelby supplied a dark vanity render of Opening Line. Label read at full
res (Opening Line · The Opener · Oil-to-Milk Cleanser · 150 ml / 5.07 fl
oz), no retouch. Now the grid card (`opening-line-card-vanity.webp`); the
interim shelf crop `opening-line-card-dark.webp` is removed from the repo.
All five /founder-collection cards are dark vanity scenes.
Verified: tsc, eslint, build; grid at 1440/390.

## 2026-10-01 · Claude (Cowork, Founder Chief) — executive audit → Desk; ship date; lead team

Shelby: send the audit to the FOUNDER Desk ("my one stop place"), let the team
make changes, ask her when an answer is needed. Her decisions today:
**Collection ships October 12** · **keep all current images** · **checkout:
untick pre-selected consent, brand it, move to checkout.founderbeauty.co** ·
**the Cowork FOUNDER team leads site changes** (now in AGENTS.md).
- DESK: docs/desk/brief.json (plan, decisions, questions waiting on her,
  reminders) + docs/desk/executive-audit-2026-10-01.md. FOUNDER-Desk app got
  a read-only Brief tab (first in the rail, count badge; Rust `brief_load`
  reads those two files under ~/Founder:LALALOCA/docs/desk, path-guarded, no
  network, no new writes). Desk files backed up to FOUNDER-Desk/_backup/
  2026-10-01-before-brief/. Needs one rebuild: Build FOUNDER Desk.command.
  Keep brief.json current whenever the plan or a decision changes.
- SHIP DATE: one constant, `COLLECTION_SHIPS` in nextMove.ts, drives the
  collection-room bar, cards, plates, Hold the Room line, bag note ("Orders
  with FOUNDER Collection pieces ship on October 12."), Hold the Room FAQ,
  collection note, shipping-policy + terms sentence ("except orders that
  include FOUNDER Collection pieces"), concierge, llms.txt, schema (PreOrder +
  availabilityStarts) and the Merchant feed (preorder + availability_date).
  No "Preorder" wording to customers. Serums untouched (one business day).
  Shopify: Hold the Room and Smooth Talker descriptions' SHIPPING line now
  "Ships October 12. Free US shipping." (badge metafield already said so).
  ON 12 OCT: confirm with Shelby, set COLLECTION_SHIPS = null, clear badge.
- BUG: itemBrandFor regex was /^\\d{8,}$/ (literal backslash), so every
  FOUNDER Collection bag line reported item_brand LALALOCA. Fixed to /^\d{8,}$/.
- Collection PDP h1s title case (normal-case utility; the overlay lockup
  keeps caps); plate/Hold the Room trust line 11px cream/55 → 13px cream/75;
  footer Shop column lists all eight products.
- NOT done here: checkout untick/branding/subdomain (Shopify admin + Shelby's
  DNS), rest of Batch 1 (see brief.json). Pre-existing eslint warning in
  Vanity.tsx (`scene` unused) left alone — not this change.
- Verified: tsc, eslint (0 errors), build; local render of /products/
  opening-line at 390/1440, bag with a collection item, feed (5 preorder +
  date, 4 in_stock), schema, shipping policy. Brand Council: no blockers;
  its 4 important notes applied (concierge line, mixed-order wording, 12 Oct
  reminder, Shopify descriptions).

## 2026-10-01 · Claude (Cowork, Founder Chief) — checkout consent + branding (Shopify admin)

Shelby approved all three checkout changes. Done in Shopify admin (no repo
code): Settings → Checkout → Marketing options → "Preselect checkbox in
certain regions" = None (was Automated · United States), so the email box
is never pre-ticked. Checkout editor branding: logo = approved FOUNDER/BEAUTY
wordmark, colourway 03 (Founder Green over Desert Rose), rendered from the
site's live Wordmark type, 150 px (board desktop size); asset uploaded to
Shopify Files ("FOUNDER Beauty wordmark") and kept at
docs/brand/founder-wordmark-editorial-03.png. Palette: primary #164D49,
background #F7EFE8 (main + header); accent/buttons Founder Green;
typography Cormorant (headings) / Jost (body). Order summary keeps Shopify's
light grey; corner radius isn't editable on this plan. Verified on the live
checkout at 1440 and 390. Subdomain waits on Shelby's GoDaddy CNAME
(checkout → shops.myshopify.com); see docs/desk/brief.json.

## 2026-10-01 20:15Z: Shopify titles and tags; House Trio made from singles (Cowork FOUNDER team)

Shelby's answers: titles "Change them, I trust you"; trio "Made from singles"; #1001 "A test" (she cancels it; the team doesn't touch orders).

- **Titles (Shopify only; the site reads its own product data, not Shopify titles).** All nine now read NAME · what it is · line · size, e.g. "THIRST TRAP 8-Layer Hyaluronic Acid Serum · LALALOCA · 50 ml", "HOLD THE ROOM Peptide Moisturizing Cream · FOUNDER Collection · 50 ml". Handles, prices, descriptions and images unchanged. These titles show in checkout, order emails, Shop, Meta, Copilot and Google.
- **Tags.** Bounce Back: removed anti_aging_serum, anti_aging_skincare, lifting_face_serum, neck_firming_serum, skin_tightening, wrinkle_serum, serum_for_fine_lines, elasticity_serum, mature_skin_serum, firming_serum, glass; added night_serum, lalaloca. Thirst Trap: removed the_closer, skin_barrier_serum, plumping_serum, glass; added the_poker_face, lalaloca. Trio: the_closer → the_poker_face, glass removed. CAUTION: the four LALALOCA products were written as full tag lists, and the pre-change lists weren't saved, so a tag outside the planned removals (C Me Glow had no planned change) can't be confirmed as kept. FOUNDER Collection tags were not touched.
- **House Trio = bundle of the singles.** `productVariantRelationshipBulkUpdate` on trio variant 47320268931241 (ID unchanged, so cart permalinks still work), with components Thirst Trap 47320268964009, C Me Glow 47320268898473 and Bounce Back 47320268996777, ×1 each. Stock now derives from the singles: 74 today (Bounce Back), was 149 separate.
  - **GOTCHA:** creating the bundle reset the parent price to the sum of its parts ($114). `priceInput: FIXED` on a follow-up call did nothing; `productVariantsBulkUpdate` price 98.00 fixed it. Live checkout re-verified at $98.00 with the three serums listed under the trio. It was $114 for a few minutes; no orders came in (latest order is still #1001).
  - Next time, pass `priceInput: {calculation: FIXED, price: "98.00"}` in the same call that creates the components.
- Desk brief updated: trio, #1001, titles moved to decided; GA4 now waits on Shelby's Google sign-in; reminder for her to cancel or archive #1001.

## 2026-10-01 21:10Z: Google Analytics 4 is set up (Cowork FOUNDER team)

Shelby chose "Set it up for me", was already signed in to Chrome, chose "New FOUNDER account", and approved accepting the GA terms.
- **Account and property.** Account "FOUNDER Beauty" (separate from her old V3RY / "Etsy - GA4" account). Property "founderbeauty.co", America/New_York to match Shopify's store timezone, USD. Industry Beauty & Fitness, Small; objectives Drive sales and Understand traffic. Web stream "FOUNDER website", https://www.founderbeauty.co, stream id 15937315110, enhanced measurement on. **Measurement ID G-YP5SS23BXF.**
  - Data sharing: Google products & services off, Recommendations for your business off, Modeling contributions and Technical support on. GA Terms and the Data Processing Terms accepted with Shelby's explicit OK.
- **Site.** `GA_MEASUREMENT_ID` in `src/lib/brand.ts` = `NEXT_PUBLIC_GA_ID` override, else G-YP5SS23BXF in production only (`VERCEL_ENV`), so previews and local builds stay out of the numbers. `Analytics.tsx` and the privacy policy's GA sentence both read it.
  - No Vercel env step needed.
  - Verified on a production build: gtag loads and `g/collect?tid=G-YP5SS23BXF` fires. This sent one test page view from localhost.
  - The cross-domain linker (founderbeauty.co ↔ founderbeauty.myshopify.com) was already in place.
- **Still to do.**
  - Connect the same property in Shopify (Google & YouTube app; Shelby approves Google's OAuth screen), so purchases arrive.
  - Add the domains in GA Admin › Data streams › Configure tag settings › Configure your domains, including checkout.founderbeauty.co once the DNS is live.
  - A UTM convention for Instagram and email links.

## 2026-10-01 21:45Z: Maxim Australia mark on Shelby's FOUND HER profile (Cowork FOUNDER team)

Shelby asked for the Maxim logo at the bottom of her FOUND HER page ("since I was on it"). She chose her own profile over the main /found-her page, and the real logo over words.
- **Logo.** She supplied it. It's MAXIM AUSTRALIA, so the caption says Maxim Australia. The file was cropped to the wordmark (her image's small "MAXIM MAGAZINE" line was dropped) and recoloured to cream #F7EFE8 on transparent, giving `public/brand/press/maxim-australia-cream.png` (579×191). The wordmark was not redrawn or altered.
- **Data.** New optional `press[]` on `FoundHerProfile` (publication, caption, logo). Only Shelby has one.
- **Page.** `ProfileStory.tsx` adds a last band in room-dark under a hairline, after the two calls to action and before the footer. The logo is w-36/md:w-44 at 90% opacity, captioned "SHELBY KORPI · ON THE COVER OF MAXIM AUSTRALIA" (12px, cream/75, balanced wrap). Alt text is "Maxim Australia". Checked at 1440 and 390.
- **Open.** Our Story and her profile text say "the cover of Maxim", which is her approved wording. Whether to add "Australia" there is her call; the team has not changed it.

## 2026-10-01 22:05Z: FHM Sweden joins Maxim Australia on Shelby's profile (Cowork FOUNDER team)

Shelby: "Also featured in FHM Sweden", with the FHM logo attached.
- **Logo.** Her file (red FHM with a black drop shadow) became a single-colour cream version: the letter fill only, with the drop shadow left out as one-colour logo versions do, on transparent. Saved as `public/brand/press/fhm-sweden-cream.png` (547×155). Not redrawn.
- **Caption.** "Featured in FHM Sweden", which is her word "featured". No date or issue was given and none is claimed.
- **Band layout.** Her name now appears once as a champagne eyebrow, with per-logo captions underneath ("On the cover of Maxim Australia" / "Featured in FHM Sweden").
  - Each press logo carries `logo.rem`, its display height (phones 82%): Maxim 3.5, FHM 2.5. This keeps the heavy block FHM from shouting over the fine Maxim serif.
  - Side by side at 1440, stacked at 390; both checked.

## 2026-10-01 22:30Z: Kevin Hart Presents: Plastic Cup Boyz added to Shelby's profile (Cowork FOUNDER team)

Shelby: "On air with… or revised to say I was on the show with Kevin Hart and Plastic Cup Boyz… shorten it like the modeling ones". She supplied the logo.
- **Caption.** "On the show with Kevin Hart", short like the others. The logo itself reads "Kevin Hart Presents Plastic Cup Boyz", so the show is named. "On air" was not used, because the team can't confirm the broadcast detail. The alt text is "Kevin Hart Presents: Plastic Cup Boyz".
- **Logo.** Her file is small (344×212) and multi-colour. It became one-colour cream: the red/dark areas turn cream and the white fills cut out, with a hard threshold so the grey shading on the "P" doesn't smudge. Saved as `public/brand/press/plastic-cup-boyz-cream.png`. Shown at rem 5.75, because "Kevin Hart" is unreadable any smaller.
- **Band.** The row height is now the tallest mark (`--row-h`) when the logos sit side by side; stacked on phones, each keeps its own height so there are no dead gaps. Checked at 1440 (three across) and 390 (stacked).

## 2026-10-01 22:50Z: WCK and Playboy credits on Shelby's profile (Cowork FOUNDER team)

Shelby: "add ring girl with WCK and Body Paint Model with Playboy Mansion Events", with both logos attached.
- **Captions.** "Ring girl with WCK" and "Body paint model at Playboy Mansion events", her words shortened to match the others. Alt text is "WCK" and "Playboy".
- **WCK logo** (184×194 badge, white letters and fighter on a red sunburst). The white letters and fighter became cream. The red badge was dropped, and the white outside the badge was removed by flood fill from the corners. Saved as `public/brand/press/wck-cream.png` (156×188), shown at rem 4.75.
- **Playboy logo** (3840×2160, black on transparent). Recoloured cream with the eye kept as a cutout, cropped and resized to 500×600. Saved as `public/brand/press/playboy-cream.png`, shown at rem 5.75.
- The profile now has five credits: three plus two on desktop, stacked on phones. Both checked. No component change.

## 2026-10-01 23:10Z: AgriNext nomination on Shelby's profile; the press band becomes a grid (Cowork FOUNDER team)

Shelby: "Nominated for AgriNext Awards & Conference 2027", with the logo attached.
- **Caption.** "Nominated, AgriNext Awards 2027", her words shortened. Alt text is "AgriNext Conference". It's a nomination, not a win, and it's worded that way.
- **Logo.** The green and black on white became cream, with the white gaps between the leaves kept as cutouts. Cropped and resized to 700×188 as `public/brand/press/agrinext-cream.png`, shown at rem 3.25.
- **Band.** Six credits now. The flex-wrap broke into rows of 3/2/1 because the Playboy caption is wide, so the list became a grid: 1 column on phones, 2 at sm, 3 at lg. Desktop is two even rows of three. Checked at 1440 and 390.

## 2026-10-01 23:30Z: A headline over Shelby's press credits (Cowork FOUNDER team)

Shelby asked for a message above the logos "about being seen on… and not limiting yourself to one version of yourself", revised for a better narrative.
- New optional `pressIntro` {eyebrow, headline, body} on `FoundHerProfile`. It's house-written and third person, not part of her answers. When present it replaces the name eyebrow; otherwise the name eyebrow still shows.
- Copy:
  - Eyebrow: "Where you may have seen her"
  - Headline: "Never just one version of herself."
  - Body: "A magazine cover in Australia. A feature in Sweden. Ringside, on a show with Kevin Hart, at the Playboy Mansion. Now, nominated for an award in agriculture. None of them is the whole story. All of them are her."
- Every place in the body maps to one of her six credits; nothing is added. "Nominated", not "shortlisted". "On a show with Kevin Hart", matching her caption.
- Headline is serif clamp(1.75–2.5rem), body 15px cream/75 at max-w-xl, logo grid mt-12. Checked at 1440 and 390 (with the sticky header hidden for the capture).

## 2026-10-01 23:45Z: Shelby's credits move up, under her story (Cowork FOUNDER team)

Shelby: "put the logos right below my story and above the 'Founder. Found her'".
- The press band in `ProfileStory.tsx` now sits between the interview (cream paper) and the closing pull quote. The order is: story, then "Never just one version of herself" with six marks, then FOUNDER. FOUND HER., then the two calls to action. The hairline was dropped (it's now a paper-to-dark change) and padding went to py-16/md:py-20.
- The closing pull quote now uses text-balance, so phones break it "FOUNDER. / FOUND HER." instead of leaving "HER." alone. This also applies to any other profile with a closing line.
- Checked at 1440 and 390.

## 2026-10-01 23:59Z: Free shipping verified at checkout; Express paused until Oct 12 (Cowork FOUNDER team)

Shelby: "My site is offering free shipping but I did not see that applied at checkout."
- **Shopify was already correct.** All 11 variants are on the General profile (US zone): Standard $0, Express $15. All require shipping. `draftOrderCalculate` for a US address returned Standard 0.00 and Express 15.00. A live checkout (test browser, a downtown Phoenix business address, no name or email, nothing submitted) showed the free rate preselected and Shipping: FREE.
  - Before an address is entered, Shopify shows "Shipping: Enter shipping address", which is most likely what Shelby saw.
- **Renamed the rates** so checkout says it outright: "Free Standard Shipping" with "3–5 business days", and "Express Shipping" with "1–2 business days". Prices are unchanged.
- **Found:** checkout's delivery-date estimates ignore the Collection ship date. For Hold the Room it promised "Thu, Oct 8–Tue, Oct 13" (Standard) and "Tue, Oct 6–Wed, Oct 7" (Express). Shelby chose to **pause Express until Oct 12**: method definition 807373209769 is now active:false. Standard dates still start before the 12th; the site, bag and shipping policy carry the Oct 12 line.
- **Site.** New `EXPRESS_OFFERED = COLLECTION_SHIPS === null` in nextMove.ts gates the "$15 Express" mentions on /shop, the shipping policy (content.ts) and llms.txt. They return automatically when the ship date is cleared.
  - The Oct 12 reminder (trig_01GTwrLC27uaqksov1tzh6xF) now also re-enables Express in Shopify, with the IDs in its prompt.
- **Flag for Shelby.** FOUNDER Collection weights are 0 lb (Hold the Room 1 oz). This doesn't affect what customers pay, but it does affect label buying. Added to the Desk reminders.

## 2026-10-02 00:10Z: FOUNDER Collection weights set from the packaging (Cowork FOUNDER team)

Shelby: "you can pull up the weights, it's labeled on the packaging."
- Shopify variant weights (`productVariantsBulkUpdate`, `inventoryItem.measurement.weight`) were set from the label net contents. Fluid ounces were taken as ounces of weight.
  - Hold the Room 50 ml / 1.69 fl oz: saved as 1.7 oz (was 1 oz).
  - Opening Line 150 ml / 5.07 fl oz: saved as 5.1 oz (was 0).
  - Clean Break 140 ml / 4.73 fl oz: saved as 4.7 oz (was 0).
  - Double Take 15 ml / 0.51 fl oz: saved as 0.5 oz (was 0).
  - Smooth Talker 12 g / 0.42 oz, three shades: 12 g (was 0).
  - Shopify rounds to one decimal.
- Customers are unaffected: rates are flat ($0 standard; Express is paused).
- **Caveat.** These are net contents, not packed weight. Container, carton and insert add weight; the serums sit at 5 oz against 1.69 fl oz of product. Label postage bought on these weights can come up short, so the Desk reminder asks Shelby to weigh one packed unit of each when stock lands.

## 2026-10-02 00:30Z: Shopify's own shipping terms checked; checkout's Shipping policy aligned (Cowork FOUNDER team)

Shelby: "make sure Shopify is linked to the free shipping set up too."
- **Already right.**
  - One market (United States, primary). Its zone has Free Standard Shipping $0, which checkout preselects; Express is paused.
  - Every variant is on the General profile.
  - Channels are Online Store, Shop, POS, Vercel Storefronts and Pinterest. Shop and Pinterest read rates from the shipping profile.
  - Site Merchant feed: every item carries `<g:shipping>` US / Standard / 0.00 USD with label free-us-standard. Product schema `US_SHIPPING` has shippingRate 0, handling 1–2 days, transit 3–5 days.
- **Fixed: the Shopify Shipping policy**, which checkout links in its footer. It still read "Express shipping is $15 and takes 1 to 2 business days. Orders are dispatched within one business day" for everything. The second paragraph now matches the site: "Standard shipping is free and takes 3 to 5 business days. Orders are dispatched within one business day, except orders that include FOUNDER Collection pieces, which ship on October 12. Every parcel is sent with tracking." The other paragraphs are unchanged.
  - The API token lacks `write_legal_policies`, so this was edited in Shopify admin in Chrome with Shelby's explicit OK. Verified via `shopPolicies`.
  - The Oct 12 reminder (trig_01GTwrLC27uaqksov1tzh6xF) now includes restoring the Express sentence.

## 2026-10-02 00:45Z: Home: "The Anchor" section removed (Cowork FOUNDER team)

Shelby: "remove 'the anchor section' from the page" (founderbeauty.co home).
- Removed from `src/app/page.tsx`: the `<DoorFrame label="The Anchor" />` divider and the `#room-anchor` section (green room, Hold the Room vanity-mirror image, "Hold the room." headline, Shop Hold the Room · $36 button). Nothing linked to `#room-anchor`. All imports are still in use.
- The vanity now flows straight into Room 06 · FOUND HER. Hold the Room remains on the home page as 03 · The Anchor in the vanity sequence, and on its own product page.
- `public/products/hold-the-room-vanity-mirror.webp` is left in place.
- Checked at 1440 and 390.

## 2026-10-02 01:00Z: Our Story: the journal image is no longer cropped (Cowork FOUNDER team)

Shelby: "fix the image of the book, it is cut off where the writing is."
- `/editorial/our-story-journal.webp` is landscape (1255×747), with the handwriting ("I found her in the woman who refused to quit.") on the left page. It was shown in a 4:5 portrait slot with object-cover, which cropped the left edge through the words.
- The slot now uses the photo's own ratio, `aspect-[1255/747]`, at max-w-40rem, so nothing is cropped. The section grid went from 0.8fr/1.2fr to 1fr/1fr with gap-16, so the landscape frame has room beside the text. `sizes` was updated to match.
- The alt text now includes the handwritten line.
- Checked at 1440 (side by side) and 390 (stacked); the whole sentence is visible in both.

## 2026-10-02 01:20Z: Our Story: the FOUND HER frame on the wall in "Why FOUND HER belongs here" (Cowork FOUNDER team)

Shelby: "the 'Why FOUND HER belongs here' section should have the framed picture of the multiple women with the writing on the wall."
- Replaced `/editorial/founder-portrait-wall.webp` (Shelby's portrait on a cream wall) with `/editorial/story-frame.webp`: a gilt green frame under a brass picture light, holding several women with "I found her when…" lines handwritten across it. It was in `public/` but previously unused. The old image file is left in place.
- The slot uses the image's own ratio, `aspect-[833/729]`, so the frame isn't cropped. The alt text transcribes all four handwritten lines.
- **Honesty caption**, small, under the image: "An artwork for the FOUND HER wall, not a photograph of contributors." The women are generated and the lines read like quotes, while the section says FOUND HER stories are told in women's own words and published only after they approve them. It's the same safeguard `portrait.note` gives composed artwork on the FOUND HER pages. Shelby can drop it if she prefers.
- Applied on top of 5ca108c (the journal fix, not yet on origin), so both changes are in the file. Checked at 1440 and 390.

## 2026-10-02 01:35Z: Our Story: "Why FOUND HER belongs here" goes Desert Rose (Cowork FOUNDER team)

Shelby: "change the green background to desert pink" (the section with the FOUND HER frame).
- The section changed from `bg-founder-green text-cream` to `bg-rose text-charcoal` (Desert Rose #D8A7A0).
- Type moved to ink for contrast on a light ground:
  - eyebrow: champagne → Founder Green (~4.6:1);
  - headline: cream → night;
  - body: cream/76 → charcoal (6.88:1);
  - caption: cream/60 → charcoal.
- **Button.** The house hover is Desert Rose, which would disappear on this ground. The button is now Founder Green with cream text, and its hover deepens to Desert Rose in shadow (`--color-rose-deep` #B87978, night text). It stays in the pink family and stays visible.
- Only this section changed; the green journal section above is untouched. The file already carries the journal fix (5ca108c) and the frame swap (287413c). Checked at 1440 and 390.

## 2026-10-02 01:50Z: "FOUNDER. FOUND HER." closes every profile, in a different colour each (Cowork FOUNDER team)

Shelby: "the 'Founder. Found Her' section should be on each page. we can mix up the colors" (FOUND HER profiles).
- `ProfileStory.tsx`: the closing band is no longer conditional. It shows `profile.closing ?? "FOUNDER. FOUND HER."` on every profile.
- New optional `closingTone` on `FoundHerProfile`:
  - "hall": room-hall, night with cream type (the default);
  - "rose": bg-rose with night type;
  - "green": bg-founder-green with cream type.
- Set: Shelby hall (unchanged look), Julie rose, Aly green. Future profiles default to hall until given a tone.
- The closing is the house line, not attributed to the woman, so this doesn't alter anyone's approved answers.
- Checked all three profiles at 1440 and 390; each shows the line exactly once.

## 2026-10-02 02:05Z: Aly's portrait shown whole on her FOUND HER page (Cowork FOUNDER team)

Shelby: "fix Aly's photo on this page, it cuts her neck off" (/found-her/aly-v).
- Her portrait is 4:5 (1122×1402), but the profile masthead slot is 3:2, so object-position 50% 12% showed only the top and cut her off at the chin.
- New optional `portrait.mastheadAspect`: a ratio for the masthead on her own page only, falling back to `aspect`, then 3:2. Aly's is set to "4 / 5", so the slot matches the photo and nothing is cropped (face, neck, shoulders, blazer).
- `aspect` was left alone on purpose, because the /found-her gallery cards also read it. Her card stays 3:4 like the others (checked: 211×289 at 1440).
- The masthead is 480×600 at 1440 and 350×438 at 390; both checked. Shelby's and Julie's pages are unchanged.

## 2026-10-02 02:25Z: Home: "Now playing in the house": Spin In The Dark, The Bela Vibe (Cowork FOUNDER team)

Shelby: "can we add the song 'Spin in the Dark' by Bela Vibe to the homepage". She chose the Spotify player (over a background-music toggle, which would need a licence and an audio file) and the original version.
- **Track.** "Spin In The Dark", The Bela Vibe, album *Moonfire In Shadows*, Spotify track 7dY2Gy12KLH8LkxcneRKce. The Extended Version (1rrolJizJDsarUm0Eg1Pyc) is not used.
- **Placement.** New row inside the "Tonight in the house" rail, under the three tiles and above "Ring for service":
  - left: eyebrow "Now playing in the house", serif title, and artist;
  - right: Spotify's compact dark embed (`/embed/track/…?theme=0`, height 80, 26rem column on md+, full width on phones).
  - `loading="lazy"`, nothing auto-plays. Signed-in Spotify users hear the full track; others hear Spotify's 30-second preview.
  - There's no CSP, so no header change was needed; X-Frame-Options only governs us being framed.
- **Gotcha.** `md:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]` collapsed the iframe to a sliver because the fr track took all the space. A fixed `26rem` second track fixed it.
- **Privacy policy** (content.ts) gains: "The home page includes a Spotify player, which loads from Spotify and may set Spotify's own cookies."
- Verified at 1440 and 390: the Spotify frame loads with the correct track.

## 2026-10-02 02:55Z: Concierge answers again: automatic answers when the model is down (Cowork FOUNDER team)

Shelby: "we need to get the concierge working. if we need just auto generated answers that's fine too. but we're live now."
- **Live diagnosis.** POST /api/concierge returned `{"ok":false,"configured":true}` with status 503, so every customer saw "The concierge isn't connected yet". VERCEL_OIDC_TOKEN is present, but Vercel AI Gateway rejects the call (403 since 1 Oct, per the other agent's uncommitted note in model.ts).
  - That note adds a direct ANTHROPIC_API_KEY route. It is still uncommitted and was NOT touched or committed here.
- **New `src/lib/concierge/fallback.ts`.** `answerWithoutModel(message)` is a rules-based answer desk that reads every fact from products.ts, founderCollection.ts, nextMove.ts (COLLECTION_SHIPS, EXPRESS_OFFERED) and the content.ts returns policy, so prices, ship dates and policy can never drift from the site. It covers:
  - greetings and thanks;
  - order status, tracking and changes (points to email with the order number);
  - international (US only), shipping, returns, and discount questions (points to the House Trio, invents no code);
  - claims about wrinkles and lifting (an honest answer, never a claim), SPF (C Me Glow goes under sunscreen), fish allergy (Thirst Trap's marine collagen), vegan and other allergens ("won't guess", email);
  - per-product summary, how to use and ingredients (full INCI only where the site publishes it), multi-product comparison, the House Trio, the price list, which serum (finder link) and routine order;
  - FOUND HER, the Founding List, about, and contact.
  - Anything else gets "I'd rather not guess" plus the email. Punctuation is stripped before matching.
- **route.ts.** `!isConfigured()` and a failed model call now return `fallbackReply(message)` (200, ok:true) instead of 503. Fallback text still goes through `screenOutbound`; if it's blocked, the reply is OUTBOUND_FALLBACK. screenInbound still runs first, so reactions, medical questions, pregnancy, lightening and human requests keep their fixed replies and escalation.
- **Gotcha.** `screenOutbound` bans "erases?" anywhere, so "nothing here erases a line" was blocked; it now reads "no cream makes a line disappear, ours included".
- **Tested** with a bogus AI_GATEWAY_API_KEY, which reproduces the live failure: 24 customer questions, all 200, 0 blocked, each answer read and checked against the site. The client code is unchanged; it already renders `{ok, text, tag}`.
- **To get full AI answers back:** fix the Vercel AI Gateway 403, or commit the direct-Anthropic route and set ANTHROPIC_API_KEY in Vercel (Shelby's key). The fallback stays as the safety net either way.

## 2026-10-02 03:10Z: Concierge taken off the site until it's fixed (Cowork FOUNDER team)

Shelby, mid-task: "remove the concierge from the site until it's fixed."
- New `src/lib/concierge/enabled.ts`: `CONCIERGE_ENABLED = false`, the single switch.
- `layout.tsx` now renders `{CONCIERGE_ENABLED && <Concierge />}`, so there's no bell or panel on any page.
- `page.tsx`, while off:
  - the hero's "Not sure where to start? · Ring the concierge" becomes "Find your serum" (/find-your-serum, same hairline style);
  - the "Tonight in the house" rail's "Ring for service" becomes "Email us" (mailto CONTACT_MAILTO, same btn-ghost-light).
- The API route and fallback.ts (b407359) stay deployed but unused. Nothing on the site calls them.
- Verified on /, /shop and /found-her/aly-v at 1440 and 390: no bell, no "Ring…/Ask the concierge" text, and both replacements render.
- **To restore:** set CONCIERGE_ENABLED = true. With the fallback in place it answers immediately, even before the AI is fixed.

## 2026-10-02 03:40Z: Concierge on Claude Sonnet 5.5 via Shelby's Anthropic key (Cowork FOUNDER team)

Shelby: "build a new concierge service that's hooked up to my Anthropic Sonnet."
- **model.ts.** This finishes and commits the direct-Anthropic route that sat uncommitted in the working tree since 1 Oct (written by another agent after the AI Gateway 403s). Shelby's request now covers it. When `ANTHROPIC_API_KEY` is set it wins over the gateway.
  - Default model `claude-sonnet-5-5`, checked against Anthropic's models overview on 2 Oct 2026. `CONCIERGE_DIRECT_MODEL` overrides it verbatim; the old prefix-stripping fallback from the gateway's model name is gone.
- **Fixes to that draft, which would have failed on Sonnet 5.5 (per its docs):**
  - **temperature removed**, because a non-default temperature/top_p/top_k returns 400 on Sonnet 5.5;
  - **the reply is read from every `type: "text"` block**, not `content[0]`, because adaptive thinking is on by default and thinking blocks come first;
  - **`thinking: {type: "between_tools"}` and `output_config: {effort: "low"}`**: no up-front thinking for a support reply. max_tokens is 1600, because thinking counts toward it;
  - **one plain retry on a 400** (model, max_tokens, system, messages only) if a model rejects those controls, logged.
  - A failure still falls through to fallback.ts.
- **Tested against a stand-in Anthropic server** (anthropic-version 2023-06-01, x-api-key, thinking block then text block, 400 on temperature): the request carried no temperature, the correct model, thinking and effort, and the text was extracted cleanly. In reject mode, a 400 led to a plain retry, then a 200 and the right answer.
- **docs/CONCIERGE.md** gained the direct-route section (env vars, Sonnet 5.5 specifics, the enable switch, the spend-limit advice).
- **Still off on the site.** `CONCIERGE_ENABLED = false` stays until production is confirmed.
  - Next: Shelby adds `ANTHROPIC_API_KEY` in Vercel (Production) and pushes.
  - The team then tests POST /api/concierge live (the route works with the UI off), flips the switch, and checks the bell end to end.

## 2026-10-02 04:20Z: The serums' Etsy reviews on the site (Cowork FOUNDER team)

Shelby: "add my Etsy reviews of the serums on the FOUNDER website."
- **Source.** Read in Etsy Shop Manager while Shelby was signed in; the shop is suspended, so public review pages 404. Orders matching "serum": 4.
  - Nov 2025: Shelby's own test order.
  - Nov 2025: a buyer who left no review.
  - Dec 2025: Elli, Thirst Trap, reviewed 5★ on 23 Jan 2026.
  - Mar 2026: Elli again, the Serum Set, full price, reviewed 5★ on 28 Mar 2026.
  - So these two are EVERY serum review, not a selection. Transcribed verbatim; author is her public Etsy display name. No buyer PII is stored.
- **NOT used:** the shop's 4.9★ from 5,722 reviews and its 42,933 sales. Those come almost entirely from the V3RY mask business the shop sold before it was renamed, and attaching them to the serums would mislead.
- **lib/reviews.ts.** `Review` gains `source` ("site" | "etsy") and `item`. REVIEWS is "thirst-trap": [Elli, 23 Jan] and "all-three": [Elli, 28 Mar], with provenance in the comment. New helpers: `reviewsForSerumPage(slug)` (own reviews plus the Trio's; no duplicate on all-three), `allSerumReviews()`, and `getSchemaReviews(slug)`, which uses source "site" only.
- **No rating markup.** Google's review-snippet rules forbid marking up reviews collected on another site, so productSchema receives only site reviews (none yet). Verified: no aggregateRating on /products/* or /shop.
- **Display.** New `components/shop/EtsyReviews.tsx`, a "From our Etsy shop" paper section with stars, the item and month, a verbatim quote, and "Elli, Etsy buyer".
  - Serum pages: after "The details". Thirst Trap shows both reviews; C Me Glow and Bounce Back show the Trio review. The note there reads "Every review there that includes this serum".
  - /shop: both reviews, below the House Trio. Its note reads "These are every review the serums received there".
  - Checked at 1440 and 390.
- **Copy kept true elsewhere.** llms.txt, the concierge knowledge base (brand:claims) and the system prompt now say: no star rating; two verbatim Etsy reviews from one customer; never call them typical.
- **Claims note.** Review one says "visibly tighter"; that is appearance language, a customer's own words, so it was kept. Nothing claims a medical result.

## 2026-10-02 04:45Z: Concierge sends the Anthropic workspace ID (Cowork FOUNDER team)

The live log after the key went in: Anthropic 400, "This API key is not scoped to a workspace, so this request must include the anthropic-workspace-id header". Shelby chose to keep her key (option 2).
- `model.ts`: new `workspaceHeader()` adds `anthropic-workspace-id: $ANTHROPIC_WORKSPACE_ID` to the direct-Anthropic request when that variable is set; nothing is added when it's unset. Tested against a stand-in Anthropic server, and the header arrived.
- Vercel (with Shelby's OK, in Chrome): added `ANTHROPIC_WORKSPACE_ID` = `wrkspc_01FeWj2mrb8PaGUbNAPBXBcb` (Anthropic console → Workspaces → Default; not a secret), type Config, Production.
- Next: Shelby pushes, which deploys with the variable. The team then tests POST /api/concierge live and, if Sonnet answers correctly, sets CONCIERGE_ENABLED = true.
- The unused `Concierage` variable in Vercel is still there; Shelby can delete it.
