# Worklog — append, never rewrite

Every agent session that touches this repo adds an entry at the top:
date · agent · what changed · what was left alone · anything unpushed.

---

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
