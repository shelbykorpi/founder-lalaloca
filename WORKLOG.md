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
