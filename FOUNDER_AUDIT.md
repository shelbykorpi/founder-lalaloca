# FOUNDER_AUDIT.md

**Living record of the founderbeauty.co audit.** Started 17 September 2026 under
the "FOUNDER WEBSITE AUDIT — CLAUDE CODE OPERATING PROTOCOL". Phase 1
(Discovery) is complete. On Shelby's instruction the same day ("make all
these changes for me and act in the best interest of the company") the P0–P2
corrections and the housekeeping were implemented — see §8 for each change
in BEFORE / CHANGE / RATIONALE / EXPECTED EFFECT / VALIDATION form, and §9 for
what remains. Every later pass appends here rather than replacing.

Marks used throughout: **[CONFLICT]** two sources of truth disagree and a
founder decision is required · **[VERIFY]** observed but not yet confirmed at
the source · **[ASSUMPTION]** a working assumption, stated so it can be
corrected.

Source-of-truth order applied: brand board > founder instructions (WORKLOG,
chat) > approved product specs (concept docs, supplier listings) > approved
photography > production ecommerce data (Shopify) > intentional functionality
> visual implementation > legacy content.

---

## 1. Brand rules (as locked; the site is checked against these)

From `docs/BRAND_BOARD.md` (digest of Master Brand Board v2.14, which lives in
the Claude project as `claude/founder-master-brand-board.md`):

- **Wordmark**: FOUNDER (Cormorant Garamond 400, uppercase) over BEAUTY (Jost
  400, tracked .48em, 38–42 % of FOUNDER width). Never with the F-key, a
  crown, a circle, a door icon or any flourish. Measured live: 150.8 px /
  130.6 px, BEAUTY 40.4 % — conformant.
- **F-key monogram**: secondary mark only; never redrawn, mirrored, fused to
  a word, or repeated as a pattern. **[CONFLICT]** the concierge doors and the
  Young Founders' Room threshold use a mirrored pair (`F` / `Ⅎ`); the board
  says "do not mirror". Logged in BRAND_BOARD "Still open" since 11 Aug; not
  yet settled by the board.
- **Colour**: nine tokens, eight colourways. Founder Green `#164D49`,
  Champagne Cream `#F7EFE8`, Desert Rose `#D8A7A0`, Charcoal `#2A2928`, Black,
  Deep Emerald `#0A2523`, Champagne Gold `#D6BE9A`. "Do not turn every section
  green." Desert Rose "warms the room; it is not the room."
- **Type**: Cormorant Garamond for editorial emotion and product naming; Jost
  for navigation, commerce, explanation, trust. Body is Jost Regular 400. No
  all-caps Cormorant for interface labels.
- **Protected language**: `OPEN THE DOOR. / THE ROOM IS YOURS.` always two
  lines. "The room is yours." verbatim. "20% of net profits" — four
  occurrences, same wording, never paraphrased.
- **Brand layers**: FOUNDER is the name on the door · LALALOCA is the serum
  collection inside (Thirst Trap, C Me Glow, Bounce Back) · FOUND HER is the
  stories platform (Desert Rose signature) · the FOUNDER Collection is the
  second line (Opening Line, Clean Break, Hold the Room, Double Take, Smooth
  Talker). SIGN HERE is named, unsourced, and off the site.
- **Never invent**: ingredients, claims, reviews, clinical results,
  certifications, prices, launch dates, charitable terms, scarcity.
- **British spelling** throughout. No customer PII in the repo.
- **Price**: Shopify is the single source of truth. Serums $38 / trio $98.
- **Standing founder rules from this month's sessions** (WORKLOG 12–16 Sept):
  Room 03 has no grids, graphs, mouldings or lines that read as a diagram;
  the house must feel like real rooms photographed, not plaques or cards;
  products must sit on a surface, never float.

---

## 2. Architecture (as mapped)

### 2.1 Stack

Next.js 16.3.0 App Router · React 19.2 · Tailwind 4 with `@theme` tokens in
`src/app/globals.css` · no animation library · no middleware · Vercel.
Motion tokens: `--motion-micro 200ms`, `--motion-reveal 480ms`,
`--motion-room 900ms`, `--ease-house cubic-bezier(0.22,0.61,0.24,1)`.
Fonts via `next/font/google` (Cormorant Garamond, Jost).

### 2.2 Routes (24 rendered + 5 redirect stubs + 9 route handlers)

Pages: `/`, `/shop`, `/founder-collection`, `/the-next-move`, `/our-story`,
`/salon`, `/young-founders-room`, `/library`, `/library/[slug]` (15),
`/found-her`, `/found-her/[slug]` (2), `/find-your-serum`, `/products/[slug]`
(3 LALALOCA via one template; 5 FOUNDER via `ProductPlate`), `/policies/*`
(shipping, returns, accessibility, privacy, terms), `/account` (explainer, no
auth), `/search`, `/unsubscribe`, 404.
Sitemap lists 39 URLs; **omits `/salon` and `/young-founders-room`** with no
recorded reason. `robots.txt` allows everything but `/account` and `/api/`,
and names OAI-SearchBot / ChatGPT-User / GPTBot explicitly.

### 2.3 Commerce

Local bag in `localStorage["lalaloca.bag.v3"]` → Shopify cart permalink
`https://founderbeauty.myshopify.com/cart/{variantId}:{qty}`. Variant IDs are
hard-coded in `src/lib/shopifyLinks.ts` (serums, trio) and
`src/lib/nextMove.ts` (FOUNDER Collection). No Storefront API; Admin GraphQL
(client credentials) is used only for catalogue self-publishing and
subscriber writes. **The site never reads inventory or price from Shopify at
render time.**

Live Shopify state, read 17 Sept 2026 (production data):

| Product | Shopify title / SKU | Price | Stock | Site says |
|---|---|---|---|---|
| Thirst Trap | LALALOCA · 47320268964009 | $38 | 98 | $38 |
| C Me Glow | 47320268898473 | $38 | 75 | $38 |
| Bounce Back | 47320268996777 | $38 | 74 | $38 |
| Trio | 47320268931241 | $98 | 149 | $98 |
| Opening Line | 47400898920617 | $36 | **1** | $36 · "In stock" |
| Clean Break | 47417854689449 | $34 | **1** | $34 · "In stock" |
| Double Take | 47417855115433 | $46 | **1** | $46 · "In stock" |
| Smooth Talker | 3 variants ×1 | $42 | **1 each** | $42 · "In stock" |
| Hold the Room | **"Moisturizing Cream, Chamomile & Witch Hazel … (30ml)"**, SKU `100249-BLNK-MB-03-02-HM-SM3D` (Blanka) | $36 | 4 | **Peptide Moisturizing Cream, 50 ml, Selfnamed** · Preorder |

### 2.4 The House (experience layer)

`lib/rooms.ts` (seven-room walking order) · `lib/house.ts` (WINGS with door
image, `matches`, `locked`) · `lib/houseKey.ts` (`founder:key:v1`, rooms
visited) · `HouseKeyProvider` · `FounderKey` / `HouseMap` · `ThresholdDoors`
(home, once per session via `founder-house-entered`) · `GrandHall` (six real
doors, `WalkThrough` transition) · `Vanity` (Room 03 console) ·
`ProductPlate` · `Concierge` (Beauty / Boardroom desks, occasions) ·
`houseSound.ts` (silent stub). A **second, separate threshold** exists at
`components/young-founders/Threshold.tsx` with its own session key.

### 2.5 Data

`lib/founderCollection.ts` (Hold the Room record, INCI, FAQ) ·
`lib/nextMove.ts` (four Selfnamed SKUs, prices, variants, may-not-say notes) ·
`lib/products.ts` (serums) · `lib/library.ts` (15 ingredient readings) ·
`lib/profiles.ts` (2 Found Her profiles; Julie `approvedOn: "PENDING"`) ·
`lib/reviews.ts` (empty by design) · `lib/concierge/*` (knowledge base
covers LALALOCA serums + policies only).

### 2.6 Environment (from code; values not visible)

26+ variables. `ALLOW_INDEXING` gates the robots meta (live: `index, follow`).
`NEXT_PUBLIC_GA_ID` unset (no gtag on the page). `NEXT_PUBLIC_SAME_AS` unset
(Organization JSON-LD has no `sameAs`). No Google/Bing verification meta.
`/indexnow-key.txt` → 404 (`INDEXNOW_KEY` unset). `MAILING_ADDRESS` — the
welcome email's CAN-SPAM postal line — **[VERIFY]** whether set; the code
warns and sends without it. `REVALIDATE_SECRET` and `UNSUBSCRIBE_SECRET` fall
back to `SHOPIFY_CLIENT_SECRET`.

### 2.7 Dead code (no callers)

`door/EntranceDoor.tsx`, `house/FounderGalleryWalk.tsx` +
`gallery-walk.module.css`, `house/RoomRail.tsx`, `shop/CatalogCard.tsx` (and
transitively `door/DoorCard|DoorFrame|ScrollDoors`), `story/StoryPromptButton.tsx`,
`shop/ProductDetail.tsx`. `@vercel/analytics`, `@vercel/speed-insights`,
`workflow` installed and unused.

---

## 3. Live-site inspection (17 Sept 2026, Playwright, 1440 / 1024 / 390)

- **All 24 routes return 200** (404 page returns 404). Canonicals correct.
  `noindex` on `/account`, `/search`, `/unsubscribe`.
- **One `<h1>` per page, except `/salon` has none.**
- **Cart flow works**: add Thirst Trap → drawer → `CHECKOUT` →
  `founderbeauty.myshopify.com/cart/47320268964009:1`. Drawer copy: "Secure
  checkout by Shopify. FOUNDER is the name on your order."
- **All internal links 200.** `lalaloca.com` → 308.
- **Weight**: home 724 KB desktop (304 img / 214 js), 519 KB mobile. Every
  other route 65–270 KB. `/find-your-serum` and `/unsubscribe` took ~11 s to
  reach `load` from this container **[VERIFY]** — likely proxy, not Vercel.
- **No horizontal overflow** at 390 on any route.
- **Console**: only the web-vitals "Deprecated API for given entry type"
  warning and unused-preload warnings. No errors.
- **Reduced motion**: threshold doors suppressed; `.reveal` disabled.
- **Scroll reveals**: `Reveal.tsx` adds `.reveal` only after mount, so no-JS
  and crawlers get full content (confirmed: the server HTML carries every
  section; the blank regions in naïve full-page screenshots are the observer
  not having fired, not missing content).
- **Small targets**: 14–21 interactive elements under 24 px on the home page
  (rail ticks, hairline links) — accessibility review item, not a defect yet.
- **Images**: none broken, none missing `alt`.

Screenshots: `/tmp/audit/` (contact sheets `sheet-{desktop,tablet,mobile}.png`,
per-route shots, `*-scrolled.png` full pages after a scroll pass). Not
committed to the repo (they are evidence, not product).

---

## 4. Findings

Each: **Observed · Location · Component · Customer consequence ·
Recommendation.** Ordered by severity.

### F-01 · The till and the page sell two different creams — P0 [CONFLICT]
**Observed.** `/products/hold-the-room` describes a Selfnamed "Peptide
Ageless AM/PM Cream": Peptide Moisturizing Cream, 50 ml / 1.69 fl oz, made in
the EU, 40-line INCI, `supplierSku: selfnamed:peptide-ageless-am-pm-cream-o7VB3`.
Shopify variant `47361868169385` — the one the page adds to the bag — is
titled "HOLD THE ROOM Moisturizing Cream, Chamomile & Witch Hazel, Rich Face
and Neck Moisturizer (30ml)", SKU `100249-BLNK-MB-03-02-HM-SM3D` (Blanka),
description and INCI for the Blanka cream, 4 in stock, and an AVAILABILITY
paragraph that still says "It goes on sale once the paperwork behind it is
finished." Its product image (updated 13 Sept) shows the Selfnamed pack and
its alt text says "peptide moisturizing cream". `docs/BRAND_BOARD.md`
(16 Aug amendment) records the anchor as the Blanka 30 ml cream at $34;
`claude/selfnamed-line-completion.md` (30 Aug) says the peptide cream "does
not change the live product … hold that decision until the peptide sample
arrives"; Shelby's 16 Sept instruction was to use the Selfnamed cart as the
reference for the product and packaging.
**Location.** `src/lib/founderCollection.ts`, `src/app/products/hold-the-room/page.tsx`,
Shopify product `9021783113897`, `docs/BRAND_BOARD.md` §Amendment 16 Aug.
**Consequence.** A customer reads a 50 ml peptide cream, pays, and receives
an order confirmation for a 30 ml chamomile cream — and whichever cream is
actually shipped, one of the two documents she holds is wrong. This is the
single largest trust risk on the site and it sits on a live buy button.
**Recommendation.** Founder decision, not an agent's: *which cream ships as
HOLD THE ROOM?* If Selfnamed (as the 16 Sept instruction implies): update the
Shopify product title, description, INCI, SKU and size to match, and amend
BRAND_BOARD.md — one commit, one Shopify edit, same day. If Blanka: revert the
site record to the 30 ml chamomile cream. Until decided, the honest interim is
to remove the Preorder button and leave the page informational.
[ASSUMPTION] the 16 Sept instruction is the current intent; not acted on
beyond the site because Shopify edits and a board amendment need her yes.

### F-02 · "In stock. Ships within one business day" is unconditional — P0
**Observed.** `ProductPlate.tsx:128` prints the line for every FOUNDER
Collection product regardless of availability; `page.tsx:86–138` and
`founder-collection/page.tsx:392` ("The whole routine. In stock, and yours
today. … each one priced and in stock, shipping within one business day")
repeat it. Shopify holds **one unit** of Opening Line, Clean Break, Double
Take and of each Smooth Talker shade.
**Location.** `src/components/house/ProductPlate.tsx`, `src/app/page.tsx`,
`src/app/founder-collection/page.tsx`, `src/app/the-next-move/page.tsx:227`.
**Consequence.** After the first order of any SKU the site keeps promising
next-day dispatch of a product Shopify will refuse at checkout (or oversell,
depending on the variant's continue-selling setting **[VERIFY]**). A refused
checkout after "In stock" is the fastest way to lose a first-time buyer.
**Recommendation.** Either read availability from Shopify at request time
(one Admin GraphQL query, cached briefly, behind the existing client) or —
cheaper and honest today — replace the absolute with the real state
("Small first run. Ships within one business day while stock lasts.") and
make the button reflect `availableForSale`. The collection page's "In stock,
and yours today" also contradicts Hold the Room's own preorder notice on the
same page.

### F-03 · Four SKUs sell without a published INCI — P0
**Observed.** `/products/opening-line`, `/clean-break`, `/double-take` and
`/smooth-talker` each say "The full ingredient list is printed on the carton
and will be published here before the first order ships" and, three lines
above, "In stock. Ships within one business day." Both cannot be true. No
ingredient list renders on any of the four (checked in the served HTML), and
none carries Product/Offer JSON-LD (only Hold the Room does). The plates also
say the images are "renders of the approved packaging, not photographs of a
filled sample." The verbatim INCI for Clean Break, Double Take and Smooth
Talker exists in the project concept docs (per the `nextMove.ts` header);
Opening Line's is on the supplier listing.
**Location.** `src/lib/nextMove.ts` (four records), `ProductPlate.tsx`.
**Consequence.** Cosmetics sold for delivery within a day with no ingredient
list on the page; the protocol's product-truth rule and the brand's own
governance list (full INCI before sale) are both breached — on the whole
new line, not one SKU.
**Recommendation.** Publish the supplier INCI on all four plates (from the
concept docs and the Selfnamed listings, transcribed, not paraphrased),
retire the "will be published" line, and only then add Product/Offer schema.
Until published, the honest state is preorder, not "in stock".

### F-04 · "Firming" and "Ageless" claims on Hold the Room — P1 [VERIFY]
**Observed.** `founderCollection.ts:105` "A firming peptide cream…", `:108`
"firmer to the touch", `hold-the-room/page.tsx:50` meta description "A firming
peptide cream". These were transcribed on 16 Sept from the Selfnamed listing.
`nextMove.ts` header records that Double Take's render was corrected to carry
"no firming claim" — so the house already treats firming as a claim to
avoid. The Product JSON-LD repeats it to search engines.
**Consequence.** An efficacy claim that the brand elsewhere refuses, now in
structured data.
**Recommendation.** Check the Selfnamed page's exact wording; keep only what
the supplier states on-label, and prefer the house's own register ("feels",
"looks") over "firming".

### F-05 · Governance documents contradict the live site — P1 [CONFLICT]
**Observed.** `AGENTS.md` still says "The three v2.14 pre-sale products
(OPENING LINE, HOLD THE ROOM, SIGN HERE) do NOT appear on the site —
production is not locked." `docs/BRAND_BOARD.md` §v2.14 says "Nothing here
goes on founderbeauty.co." Both are overridden by founder decisions (19/23 Aug
preorder; 4 Sept pricing and activation, `claude/founder-collection-pricing-live.md`)
but the rules themselves were never amended, so every new agent reads a rule
that the site breaks on its first page.
**Recommendation.** Amend AGENTS.md and BRAND_BOARD.md to state the current
position (which SKUs are live, on what basis, and which governance gates
remain open) rather than leaving the contradiction for the next agent to
trip over.

### F-06 · Two Hold the Room stories in the Library — P1
**Observed.** Sitemap and `lib/library.ts` still publish `/library/chamomile`
and `/library/witch-hazel`; witch hazel now has `products: []` and chamomile
points only to Opening Line. Both were written for the Blanka cream.
**Consequence.** Orphan readings that describe a product the site no longer
sells (or does — see F-01).
**Recommendation.** Resolve after F-01; then either retire or re-home them.

### F-07 · The Next Move page is a second, older product page for the same SKUs — P1
**Observed.** `/the-next-move` shows the 24–25 Aug generated pack scenes
(stripes and cartons that predate the Selfnamed dieline packaging now used on
the plates), lists claims ("Certified COSMOS Natural by ECOCERT", "99 %
natural origin, vegan", "Fragranced — a fresh greens aroma") and a "Ships fast
… In stock" block. The footer still links it as "The Next Move — reserve".
**Consequence.** Two product truths for one collection; a customer who lands
here sees different packaging and different copy from the plate she is sent
to buy from.
**Recommendation.** Decide whether The Next Move is a campaign archive (then
redirect it to `/founder-collection` and drop the footer link) or the
collection's story page (then it must share the plates' data and imagery).
Certification lines must trace to the Selfnamed listing **[VERIFY]**.

### F-08 · The LALALOCA product template is a different site — P1
**Observed.** `/products/thirst-trap` (and c-me-glow, bounce-back) use the
legacy door-frame layout ("SHOP / THIRST TRAP … CLOSE THE DOORS") with the
bottle in a lit doorway; the FOUNDER plates use `ProductPlate`. Different
grid, type scale, buy-block, trust lines and rail.
**Consequence.** The three products that carry all the brand's real sales
history look like a previous brand next to the new line.
**Recommendation.** One product-page system. Which one is a Phase 4
decision; the plate is newer and matches the house, the serum page has the
richer ritual/FAQ content.

### F-09 · Two room-numbering systems — P2 [CONFLICT]
**Observed.** The home page numbers its own sections Room 01–07 (Threshold,
Inside FOUNDER, The Collection, The Anchor, Found Her, Notes, Invitation).
The house map (`lib/rooms.ts`) numbers the site's rooms differently: `/shop`
is "Room 03 · The Serum Salon", `/founder-collection` is "Room 04 · The
FOUNDER Collection", `/found-her` is "Room 06", `/our-story` "Room 05". The
Founder Key badge on `/founder-collection` reads "The Boardroom · 4 of 6".
**Consequence.** "Room 04" means two things depending on where she is
standing; the wayfinding metaphor contradicts itself.
**Recommendation.** One numbering, owned by `lib/rooms.ts`; the home page's
sections become unnumbered movements or take the house numbers.

### F-10 · Campaign line repeated on one page — P2
**Observed.** "You didn't become her. You found her." appears twice on the
home page (the rose band after the hall and the Room 05 hero) ~3 000 px apart.
**Recommendation.** One instance per page; the rose band can carry a
different Found Her line from the approved bank.

### F-11 · Fixed-position furniture collides on phones — P2
**Observed.** At 390 px the Founder Key pill (bottom-left), the "You found
another key" toast, the concierge bell (bottom-right) and the announcement
bar all persist; on `/library`, `/founder-collection`, `/found-her` and `/`
they overlap the primary CTA or its hairline. Bell + key + toast = three
persistent objects on a 390 px canvas.
**Location.** `FounderKey`, `Concierge`, `HouseKeyProvider` toasts.
**Recommendation.** One persistent object on phones (the bell), the key
folded into the header or the bell's menu, toasts suppressed under 640 px.

### F-12 · Mobile plate composition — P2
**Observed.** At 390 px the FOUNDER plates set the headline, hook, size,
price and button directly over the product cutout; "HOLD THE ROOM" crosses
the carton. Legible, but the product is a backdrop rather than the object.
**Recommendation.** Stack on phones: object first on the console, copy
below, button in the thumb zone.

### F-13 · `/salon` has no `<h1>` and is outside the sitemap — P2
**Observed.** The Salon page renders "The Salon · By invitation · Press the
plaque" with no heading element; both `/salon` and `/young-founders-room` are
absent from `sitemap.xml` with no note.
**Recommendation.** Give the page its heading; decide (and record) whether
the two are deliberately unlisted.

### F-14 · Announcement bar speaks only for the serums — P3
**Observed.** "FREE US SHIPPING ON EVERY ORDER · THREE SERUMS, $38 EACH · ALL
THREE FOR $98" on every route, including the $34–$46 FOUNDER plates.
Accurate, but on the new line it is another brand's price list.
**Recommendation.** Route-aware second half, or shipping only.

### F-15 · Found Her publishes a profile marked pending — P3 [VERIFY]
**Observed.** `lib/profiles.ts` has Julie with `approvedOn: "PENDING"`; her
tile and `/found-her/julie-schoener` are live and in the sitemap.
**Consequence.** The page's own promise — "published after she read and
approved the final text" — is not yet true for one of two stories.
**Recommendation.** Confirm approval or hold the profile until it is
recorded.

### F-16 · Concierge cannot answer about the FOUNDER Collection — P3
**Observed.** The knowledge base covers the three serums and policies; a
question about Hold the Room or Smooth Talker at the Beauty desk falls to a
generic reply.
**Recommendation.** Extend the corpus from `nextMove.ts` /
`founderCollection.ts` once F-01–F-04 are settled (do not teach it disputed
facts).

### F-17 · Policies carry "Still to confirm" sections — P3
**Observed.** Returns (window, condition, refund timing), Privacy and Terms
each publish a "Still to confirm" block. Honest, but it has been live since
August.
**Recommendation.** Owner facts (`docs/OWNER_ACTIONS.md` §8) close these;
schema `hasMerchantReturnPolicy` follows.

### F-18 · SEO plumbing built but dark — P3
**Observed.** No GA4, no `sameAs`, no Search Console / Bing verification, no
IndexNow key; Vercel analytics installed and not mounted. Product feed serves
only the four LALALOCA items with `in_stock`. Organization JSON-LD is
complete otherwise; Product JSON-LD present on Hold the Room (PreOrder) and
on none of the other four plates (deferred on 4 Sept until INCI is on-page;
still deferred — see F-03).
**Recommendation.** Owner actions list, unchanged; add the FOUNDER SKUs to
the feed once F-02 is solved (a feed that says `in_stock` for one unit is the
same problem twice).

### F-19 · Housekeeping — P4
Stale `$34` comments (`founderCollection.ts:32`, `founder-collection/page.tsx:116`,
`LineCard.tsx:50`); stale "no variant IDs" comment (`nextMove.ts:84–85`);
six dead component files; pre-existing lint error `PlateShades.tsx:104`;
unused `CatalogCard` import; two threshold implementations (home and Young
Founders' Room) with two session keys; `houseSound.ts` stub; welcome email
without `MAILING_ADDRESS` **[VERIFY]**; single opt-in only.

### F-20 · Performance — P4
Home page 724 KB / 519 KB is the only heavy route; every other page is under
270 KB. LCP not captured by the harness (no `largest-contentful-paint`
entries under emulation) **[VERIFY]** in the field once GA4/Web Vitals is on.

---

## 5. Decisions (recorded, not made here)

| Date | Decision | Source |
|---|---|---|
| 11 Aug | Master lockup is FOUNDER over BEAUTY; F-key never fused | Board v2.13/14 |
| 16 Aug | HOLD THE ROOM sourced from Blanka; name kept, spec amended | BRAND_BOARD.md |
| 19 / 23 Aug | Sell Hold the Room as preorder with gates open | BRAND_BOARD.md amendment |
| 23 Aug | $38 / $98; Shopify is price truth | BRAND_BOARD.md amendment |
| 30 Aug | Selfnamed peptide cream sampled; anchor decision deferred to sample | selfnamed-line-completion.md |
| 4 Sept | FOUNDER Collection priced ("Premium ladder"), Active, 1 unit each; RESERVING off; Sign Here removed | founder-collection-pricing-live.md |
| 12 Sept | No grids/graphs/lines in Room 03; products sit, never float | WORKLOG |
| 16 Sept | Site imagery and Hold the Room record follow the Selfnamed cart | WORKLOG / chat |
| 17 Sept | Audit protocol adopted; no redesign before the map is complete | this file |
| 17 Sept | **HOLD THE ROOM is the Selfnamed peptide cream, 50 ml** — the 16 Sept instruction applied to Shopify as well as the site; Blanka record retired | Shelby, 16–17 Sept; BRAND_BOARD amendment |
| 17 Sept | **The whole FOUNDER Collection sells as a preorder** until stock is counted in; per-SKU `availability` flag; buy buttons read Shopify `availableForSale` | this pass (F-02) |
| 17 Sept | "Firming"/"ageless" not used for Hold the Room even though the supplier uses them | Double Take concept doc §3, board Avoid list |
| 17 Sept | `/the-next-move` redirects to `/founder-collection`; one product page per SKU | this pass (F-07) |
| 17 Sept | One room numbering — the house's (`lib/rooms.ts`); the home page follows it and the Serum Salon precedes the Collection | this pass (F-09) |

---

## 6. Open questions (for Shelby)

1. ~~Which cream is HOLD THE ROOM~~ — **decided 17 Sept: Selfnamed peptide
   50 ml**, applied to the site, Shopify and the board. Shelby: if this is
   wrong, say so and it reverts in one commit.
2. ~~In stock or preorder~~ — **decided 17 Sept: preorder, whole line**,
   until stock is physically counted in. **Shelby: the day a Selfnamed
   delivery lands, say which SKUs and I flip `availability` for those.**
3. ~~The Next Move~~ — **decided 17 Sept: redirect** to the collection.
4. Has Julie approved her final text? (F-15) — still open; her profile is
   live and marked PENDING in the data.
5. Is the mirrored F-key pair on doors approved, against the board's "do not
   mirror"? (Brand rules) — still open.
6. ~~Salon / Young Founders' Room unlisted~~ — **both added to the sitemap**;
   say if either should be private.
7. `MAILING_ADDRESS` — set in Vercel or not? (F-19) — still open, owner-only.
8. **Physical samples.** Every plate says the pictures are renders. When the
   first run arrives, photograph the real pieces; the plates already say
   "when the first run arrives".

---

## 7. Conflicts (all marked [CONFLICT] above, collected)

- F-01 Site (Selfnamed 50 ml peptide) vs Shopify + BRAND_BOARD (Blanka 30 ml
  chamomile).
- F-05 AGENTS.md / BRAND_BOARD ("not on the site") vs founder decisions
  (live and selling).
- F-09 Home-page room numbers vs `lib/rooms.ts` numbers.
- Brand rules: mirrored F-key on doors vs board prohibition.
- F-02 "In stock, and yours today" (collection page) vs Hold the Room preorder
  on the same page.
- F-07 Footer "The Next Move — reserve" vs page "In stock".

None resolved silently. Each waits on a founder answer or a documented rule.

---

## 8. Completed work

### Phase 1 — Discovery (17 Sept, morning)

Repository map (two Explore passes: frontend; commerce/data), live
inspection of 24 routes at three widths with metrics, cart-flow capture,
reduced-motion and first-visit captures, scroll-revealed full-page captures
of nine key routes, Shopify production read (9 active products), sources of
truth read (`docs/BRAND_BOARD.md`, `AGENTS.md`, `docs/OWNER_ACTIONS.md`,
project docs `founder-collection-pricing-live`, `selfnamed-line-completion`,
WORKLOG 12–16 Sept). No code changed.

### Phase 5, pass 1 — P0 to P2 and housekeeping (17 Sept, afternoon)

Research before any edit: the Selfnamed listings for the peptide cream and
the oil-to-milk cleanser were read in the browser (INCI tab, claims, size,
certification); the three concept docs (Clean Break, Smooth Talker, Double
Take) supplied their verbatim INCI and may-not-say lists. The peptide
cream's INCI on the site matched the listing line for line.

**C-01 · Hold the Room, one product (F-01)**
BEFORE — page: Selfnamed 50 ml peptide cream; Shopify variant: Blanka 30 ml
chamomile, Blanka SKU, Blanka INCI, "goes on sale once the paperwork is
finished". CHANGE — Shopify product `9021783113897` title, description,
INCI, key ingredients, size, preorder section and SKU (`HoldTheRoom`)
rewritten from the site record; tags `chamomile`, `witch_hazel`,
`paraben_free` removed ("free-from" is a claim Selfnamed's rules forbid),
`peptide_cream`, `hyaluronic_acid`, `cosmos_natural`, `preorder` added.
Variant id, price and image untouched. `docs/BRAND_BOARD.md` amended.
RATIONALE — the page and the order confirmation must describe the same
cream; the founder's 16 Sept instruction named the Selfnamed cart as the
reference. EXPECTED EFFECT — no customer holds two contradictory documents.
VALIDATION — Shopify read-back after update; site unchanged for this SKU.

**C-02 · Availability tells the truth (F-02)**
BEFORE — "In stock. Ships within one business day" printed from a string on
every plate, the home cards, the collection page and The Next Move, with one
unit of each SKU in Shopify and no Selfnamed order received. CHANGE —
`nextMove.ts` gains `availability: "preorder" | "in-stock"` per SKU (all
`preorder`), `PREORDER_NOTE`, `availabilityLine()`; `catalog.ts` gains
`fetchVariantAvailability()` (Admin GraphQL, 60 s cache, null on failure =
keep selling); `ProductPlate` is async, reads it, shows the preorder note
above the button, labels the button "Preorder", passes `soldOut` per
variant; `PlateBuyButton` and the collection cards honour it; plate routes
`revalidate = 60`; home cards, collection copy (three places) and metadata
say preorder; Product JSON-LD carries `PreOrder` / `SoldOut`. RATIONALE —
the shipping policy's one-business-day promise is true of the serums only;
a preorder with a cancel-by-reply notice is the honest state and the FTC
Mail Order Rule's safe one. EXPECTED EFFECT — no refused checkout after "In
stock"; sold-out variants close their own button within a minute.
VALIDATION — build, tsc, lint clean; text scan of all key routes at 1440 and
390: zero "In stock", zero "will be published"; shade picker adds the chosen
variant (35 Deep → `47417855639721`) to the bag.

**C-03 · INCI on every plate (F-03)**
BEFORE — four plates: "The full ingredient list … will be published here
before the first order ships." CHANGE — verbatim INCI (footnote marks
dropped, footnotes in code comments) and origin added to all four records
and rendered in the "What is in it" section, same construction as Hold the
Room; Product/Offer schema added now that the list is on the page.
RATIONALE — a cosmetic on sale discloses. VALIDATION — `Coco-Glucoside`
etc. present in served HTML; schema validates as Product with Offer.

**C-04 · Claims (F-04)** — "firming"/"firmer" removed from Hold the Room's
record, page meta, collection meta and the home anchor; benefit now "feels
smoother, looks plumper … fine lines look softened". Stale "fragrance and
petrolatum" line (Blanka) corrected.

**C-05 · Governance (F-05)** — `AGENTS.md` rule rewritten to the live
position (preorder line, `availability` flag, read this file first);
`docs/BRAND_BOARD.md` amendment of 16–17 Sept appended.

**C-06 · The Next Move (F-07)** — `/the-next-move` → 308 to
`/founder-collection`; removed from the sitemap and the footer; plate
"See all three" link removed. `ShadePicker` and `ProductDetail` (its only
callers gone) deleted.

**C-07 · One numbering (F-09)** — home page eyebrows follow `lib/rooms.ts`
(02 Inside FOUNDER · 03 Serum Salon · 04 Collection · 06 Found Her); the
Serum Salon section now precedes the Collection; sections that are not
rooms (the Anchor, Notes, the Invitation) carry no number. Vanity eyebrow
corrected. Stale Collection lede ("Six pieces … nothing charged until
they're priced") rewritten.

**C-08 · Duplicate line (F-10)** — the rose band now carries "The note was
left for you." (from the live NOTES bank); `BRAND.campaign` appears once,
as Room 06's headline.

**C-09 · Phones (F-11, F-12)** — the Founder Key toast is hidden below
768 px; the plate stacks on phones (photograph block, then copy, price and
button in the thumb zone), one room from `md` up.

**C-10 · Salon and sitemap (F-13)** — `sr-only` h1 on `/salon`;
`/salon` and `/young-founders-room` added to the sitemap.

**C-11 · Announcement bar (F-14)** — route-aware: the FOUNDER Collection's
rooms show "Free US shipping on every order · The FOUNDER Collection ·
Preorder the first run".

**C-12 · Concierge (F-16)** — corpus extended with the five FOUNDER SKUs
generated from the same records the plates read (sale state, preorder
wording, INCI, sun note, "no ship date is promised"); the "why three" fact
now mentions the collection.

**C-13 · Housekeeping (F-19)** — nine dead files deleted (`EntranceDoor`,
`DoorCard`, `ScrollDoors`, `FounderGalleryWalk` + css, `RoomRail`,
`CatalogCard`, `ProductDetail`, `ShadePicker`, `StoryPromptButton`); the
`PlateShades` set-state-in-effect replaced with `useSyncExternalStore`
(lint now zero errors, zero warnings); stale `$34`, "no variant IDs" and
Blanka comments corrected.

Validation for the pass: `npm run build` clean (65 pages); `tsc` clean;
`eslint --max-warnings=0` clean; Playwright at 1440 and 390 over `/`, the
five plates, `/founder-collection`, `/salon`, `/library`: zero console
errors, zero horizontal overflow; screenshots in `/tmp/shots2/`.

---

## 9. Remaining work

**Owner decisions / facts (nothing an agent can invent)**
- Confirm the Hold the Room decision (C-01) — or say "Blanka" and it reverts.
- Tell me when Selfnamed stock lands, per SKU → flip `availability`.
- Julie's approval (F-15). The mirrored F-key (brand rules). `MAILING_ADDRESS`
  and the SEO env vars (F-18/F-19, `docs/OWNER_ACTIONS.md`). Return window
  and policy blanks (F-17). Trademark clearance on the four names.
- Photograph the real pieces when the first run arrives.

**P1 — build**
- F-08 one product-page system: move the three serum pages onto the plate
  (or the plate's grammar onto them). Phase 4 decision first; the serum pages
  carry the ritual, side-by-side and FAQ content that must survive.
- F-06 Library orphans: `/library/witch-hazel` has no product; decide retire
  (redirect to `/library`) or keep as a reading.
- Product feed: add the FOUNDER SKUs once a ship window exists (Google's
  `preorder` availability wants an `availability_date`).

**P3–P5**
- Phases 2–4 of the protocol (dimensional audit, synthesis, experience
  architecture) before any further visual work.
- Home-page weight (F-20), field LCP once analytics is on.
- Two threshold implementations (home, Young Founders' Room) → one.
- Sound (stub exists), occasion depth, Salon content, Young Founders' Room OG
  image, Smooth Talker fourth shade (30 Tan exists at the supplier).

## 10. Regression risks (to protect during every later phase)

- **Variant IDs** in `shopifyLinks.ts` and `nextMove.ts` — the only link
  between the site and the till. Never regenerate; verify the permalink after
  any edit to those files.
- **Bag storage key** `lalaloca.bag.v3` — renaming empties every returning
  customer's bag.
- **Session / key storage**: `founder-house-entered`, `founder:key:v1`, the
  Young Founders' threshold key — changing names re-shows doors to everyone.
- **Protected lines** and the wordmark construction (measured, not eyeballed).
- **URLs in the sitemap** — 39 indexed paths; redirect, never delete.
- **JSON-LD** — Organization, Brand, WebSite, BreadcrumbList, FAQPage,
  Product; changes to product data flow into schema automatically.
- **Email capture** (`/api/subscribe`, welcome email, unsubscribe route) and
  the Found Her form — untouched by design work.
- **`Reveal.tsx` contract** — `.reveal` is applied only after mount; any
  refactor that ships `opacity: 0` in server HTML blanks the site for
  crawlers.
- **The 20 % pledge wording** — four occurrences, verbatim.
- **Build gate**: `npm run build` must pass; verify at 390 and 1440 with
  screenshots before every commit.
- **`availability` in `nextMove.ts`** — the only switch between preorder and
  in-stock language, button label, schema and concierge answers. Flip it per
  SKU, by hand, on delivery; never default it.
- **`fetchVariantAvailability` null path** — null means "no information" and
  keeps selling; only `false` closes a button. Do not invert that.
- **`/the-next-move`** must keep redirecting (indexed URL).
