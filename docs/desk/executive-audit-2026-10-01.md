# FOUNDER Executive Audit, 1 October 2026

**Led by Founder Chief.**

Specialist audits were run by:
- Creative Director, with Image & Film
- UX/CRO
- Copy & Brand Voice, with Claims
- Product & Merchandising, with Growth and CRM
- FOUND HER Executive Editor
- Frontend Engineering, covering SEO, accessibility, performance and technical health

An independent Brand Council red team then reviewed this document. Its first verdict was *do not release*: two blockers (the evidence base was out of date, and Aly's composited portrait was missing) and ten important notes. All of them are corrected below. A re-review found no blockers, and its one remaining note has been applied.

**Read-only.** Nothing was edited, committed, sent or published.

**What this is based on**
- **Production:** commit `23aee69`, live on founderbeauty.co this afternoon.
  - 22 commits from another agent landed between 05:03 and 14:25 UTC today, while this audit ran: FOUND HER, Our Story, the Young Founders' Room and the home page were rebuilt, and two FOUND HER approvals were recorded.
  - The specialists first read `ec57ee4`. Every finding below was then re-checked against `23aee69` and the live site, and findings that production had already fixed were removed.
- **Live captures:** 29 routes at 1440 and 390, plus the door overlay, the bag and the Shopify checkout. The six rebuilt pages were re-captured after 14:25.
- **Live Shopify:** catalogue, inventory, metafields and orders.
- **Brand sources:** Master Brand Board v2.14, the Brand OS, the agent and workflow files, `FOUNDER_AUDIT.md`, `WORKLOG.md`.
- **Project docs:** this morning's team audit, the launch checklist, the shot list, the Etsy history and the FOUND HER kit.

**Not measured this pass** (marked *[unmeasured]* where it matters):
- no automated accessibility sweep (axe);
- no LCP/CLS measurement;
- no click-through of the serum quiz.

---

## The verdict in one paragraph

The world is real. FOUNDER has what most beauty brands never get:
- a protected line people remember;
- a door and a room to hang it on;
- product names with narrative and social power;
- a founder whose story is unusual and true;
- a community idea, FOUND HER, that can become the moat.

What makes it feel smaller than it is, four things:
- **The people.** Most of the women on the commercial path are generated, on a site that promises "no composite women".
- **Crowding.** The house is crowded enough that the mystery thins instead of deepening.
- **Two companies.** The two product lines look like two companies, and the main shop is titled for the sub-collection.
- **Generic edges, and one live contradiction:**
  - an unbranded Shopify checkout;
  - keyword-string Shopify listings;
  - an empty bag;
  - no measurement or follow-up;
  - a ship-date contradiction between the site and Shopify.

None of this needs a redesign. It needs truth, real faces, editing and a working commercial spine.

---

## 1. The 15 highest-impact opportunities (ranked)

| # | Opportunity | Why it matters | Owner |
|---|---|---|---|
| 1 | **Make the shipping promise true everywhere.** Shopify carries a "Ships October 12" badge (metafield `founder.badge`) on all five FOUNDER Collection products, read today. The site says "In stock · Ships within one business day" in three places: the announcement bar, the Collection PDPs and the schema. One of those is false. | A shipping promise the house can't keep breaks trust at the first order. In the US it is also a Mail Order Rule exposure. Highest-risk item in the audit. | product-merchandising → frontend-engineer, crm-retention-sales |
| 2 | **Replace generated women with real ones.** <br>• *Now:* take the remaining generated women off commercial and FOUND HER pages and use the empty-room frames already in the library. <br>• *Next:* one real shoot with Shelby and consenting FOUND HER women (shot list frames 01 threshold, 05 brass light, 09 ritual, 03 vanity). | It is the charter's central promise and the source of the house's humanity. | visual-content-director, creative-director |
| 3 | **Make FOUND HER the casting pipeline.** <br>• A third optional consent: a photography/casting invitation. <br>• A signed per-use grant with a no-AI-alteration clause. <br>• Two tiers: an Archive and numbered features. <br>• Written approval records kept for every woman. | This is how FOUND HER women legitimately become the faces and the cultural proof of FOUNDER. | found-her-community |
| 4 | **Brand the checkout.** <br>• Wordmark, house colours, square corners. <br>• A checkout subdomain. <br>• Untick the pre-selected "Email me with news and offers". | The private room ends in a white, blue-button Shopify till on founderbeauty.myshopify.com: the most generic screen in the journey, at the moment of trust. | frontend-engineer, crm-retention-sales |
| 5 | **One house, one shop.** <br>• FOUNDER leads. <br>• All 8 products reachable in two taps. <br>• Fixed line labels. <br>• /shop holds both lines. <br>• Footer lists all 8. <br>• The LALALOCA Brand node stops describing the house as "three serums". | "Shop" is titled "Shop the LALALOCA Collection" and shows 3 of 8 products; the anchor product is not on it. **Note:** Shelby reverted a "one name" pass on 11 Sep (`862fc02`). This reopens that decision now that two lines are live; it does not reverse it. | ux-cro-director, copy-brand-voice, frontend-engineer |
| 6 | **Bring LALALOCA inside the house.** <br>• Restage the serums in the same night-vanity world as the Collection. <br>• Add the "FOUNDER presents the LALALOCA Collection" eyebrow (the board's own line). <br>• Replace the ice-cream sundae (`collection-still.webp`), which is the House Trio's product image on the site and in the Merchant feed, with the three real bottles. | The serums read as a different brand, and a dessert stands in for a product. **Note:** the board sanctions parlour cues for serum imagery, so retiring the sweet-shop `trio-parlor` scene is Shelby's call (v2.15). | creative-director, visual-content-director |
| 7 | **One routine across both lines.** <br>• Serums at a "Treat" step between Wash and Moisturise. <br>• Hold the Room as "where to begin". <br>• Cross-line pairing on PDPs, in the bag and in the quiz. | Turns two shops into one house and gives the first purchase an obvious entry. | product-merchandising |
| 8 | **Make the bag and PDPs the easiest luxury purchase online.** <br>• Bag: a routine-completion suggestion and a delivery/returns line. <br>• One shared buy block on all 8 PDPs. <br>• Sticky add-to-bag on phones. <br>• "How to use" on every Collection PDP, transcribed and never written. | The highest-intent screens add nothing and reassure little. The bag shows one line, then about 370px of empty green. | ux-cro-director, frontend-engineer |
| 9 | **Sets and gifting at full price.** <br>• "Serum + Hold the Room" and the full routine. <br>• Value comes from presentation (a note, a box), never a discount. <br>• Shopify bundle inventory behind them. | Raises order value without cheapening. Holiday is the next calendar moment. | product-merchandising |
| 10 | **Turn measurement on.** <br>• GA4 is not live: `NEXT_PUBLIC_GA_ID` is unset and there is no tag in the live HTML. <br>• Install it on the site and in Shopify, with cross-domain tracking and UTMs. <br>• One add-to-bag path still hard-codes `item_brand: "LALALOCA"` (`AddToBagButton.tsx:133`). | Launch traffic can't be attributed. Nothing else on this list can be judged without it. | growth-marketing, frontend-engineer |
| 11 | **Commercial truth in the code.** <br>• Prices are hand-copied in four files. Hold the Room has drifted once ($34 on site vs $36 charged). <br>• The Merchant feed (`route.ts:71`) and the trio's set schema (`seo.tsx:414`) hard-code in-stock. Product schema already takes the live sold-out state, but the serum pages need checking to confirm they pass it through. <br>• Read price and `availableForSale` from Shopify. <br>• Confirm whether the 149-unit trio stock is linked to the singles. <br>• Confirm the status of order #1001 (6 Aug, shown unfulfilled). | Prevents a price shown that differs from the price charged, and a "sold out" that the site never shows. | frontend-engineer, product-merchandising |
| 12 | **Finish the Shopify catalogue clean-up before Google sees it.** Descriptions were corrected today. Still left: <br>• keyword-string titles ("Plumping Glow Drops… Dry Skin Hydration"); <br>• Bounce Back's "Firming… Face Neck Lifting" title, and its tags anti_aging, wrinkle_serum, skin_tightening; <br>• the `the_closer` tag on Thirst Trap and the Trio; <br>• ChatGPT and Etsy images as the serum and trio featured images. | These listings are what strangers see first in Shop and Google. | product-merchandising, claims-compliance |
| 13 | **A retention spine with an access promise.** <br>• The Founding List delivers real early entry: a 48-hour private link to each release or set. <br>• A three-email welcome. <br>• Set `MAILING_ADDRESS`. <br>• Post-purchase: shipping, then how-to-use, then a reviews request (no incentive), then a day-21 FOUND HER invitation, then replenishment timed per product. | "Be first through the door" has nothing behind it yet. This is where "I am part of the room" happens. | crm-retention-sales |
| 14 | **Edit the house to deepen the mystery.** <br>• Home from about 15 phone screens (12,106px at 390) to 8 or fewer. <br>• One invitation per destination. <br>• Hold the Room no longer twice in a row. <br>• The "Walk on. Every door here opens for you." band runs on seven room pages; keep it on one or two. <br>• Bring a lit cream room back to home, shop, collection and FOUND HER. Our Story and the Young Founders' Room now have them, and they read better for it. <br>• Carry the packaging stripe into the site. | Restraint is the luxury signal. Repetition makes a world feel templated. | creative-director, ux-cro-director |
| 15 | **FOUND HER as a publication, and truth hygiene.** <br>• FOUND HER No. 001+ with a masthead and a monthly cadence. <br>• "WHEN DID YOU FIND HER?" as the closing headline. <br>• A "From the wall" band, Shelby first, on PDPs and home. <br>• Settle the founder revenue line. It now appears on Our Story as well as in Shelby's FOUND HER profile. <br>• Written confirmation for COSMOS/ECOCERT and "dermatologically tested". <br>• Remove borrowed-science INCI from the Library. | Rhythm and reasons to return. Trust is the house's only advertising until reviews exist. | found-her-community, claims-compliance |

---

## 2. What is weakening the luxury perception

- **Generated women where real ones should be.** Current production still shows:
  - the woman in a rose gown by the fire, home Room 02 "The elevator is waiting";
  - the gallery halls of framed generated portraits: the /found-her hero, the house map's Found Her door, home Room 06;
  - the framed portrait in the /our-story hero;
  - the two women on the Salon door;
  - the cream-suited torso in the Hold the Room vanity image, on home and on the Hold the Room page;
  - **Julie's tile:** a collage built around a famous film-icon styling (tiara, beehive, oversized sunglasses, pearls) above her name. Production now shows a disclosure that it isn't Julie, which is honest, but it is still a celebrity-style likeness on a real woman's profile;
  - **Aly's portrait:** her real face composited onto a generated outfit and room. Her approval was recorded on 30 Sept. Confirm she approved the image as well as the text. Future FOUND HER portraits should be photographed, not restyled.

  The real, approved photographs today are Shelby's portraits (including `founder-collection-door.webp`, which WORKLOG identifies as Shelby) and the Young Founders' Room documentary images. No approved real-model or Lightroom library exists in the repo or the project.
- **Off-world imagery:**
  - the dessert as the House Trio product image;
  - candles, roses and pink satin as the default "luxury" set dressing;
  - buttons painted into the Young Founders' Room image;
  - a StandUp social graphic over a documentary photo;
  - non-FOUNDER dropper bottles in the Library;
  - products on a thin ledge in empty green.
- **Template sameness on the commercial pages.**
  - Dark green on darker green, with the same "Walk on" band and the same footer.
  - The repetition of the Icon Door band, not its design, flattens it. The board says to default to the Icon Door, and that door is right; it just appears too often.
  - The new cream rooms on Our Story and the Young Founders' Room show the fix.
- **Two-line nav labels at 1440** ("SHOP / THE SERUMS", "YOUNG FOUNDERS' / ROOM") crowd a small wordmark.
- **The generic edges:**
  - an unbranded Shopify checkout (Arial "FOUNDER", purple and blue buttons, white page, myshopify domain);
  - keyword-string Shopify titles;
  - a dead-end bag.
- **The two-company problem.** Jewel-toned script-logo flacons sit beside striped apothecary tubes, and the serums take the first nav slot.
- **Three lighting worlds per product:**
  - a candlelit grid card;
  - a flat green studio hero;
  - a daylight vanity setting.

  One world per product would read as one house.

## 3. What is hurting conversion or usability

1. **Findability.**
   - No page lists all 8 products.
   - The serum line goes by several names across header, footer, bag and /shop.
   - Search and Account are hidden on phones.
   - Tablets from 1024 to 1279px get a hamburger.
2. **Home length.** About 15 phone screens with several navigation devices competing:
   - hero CTAs, including "Ring the concierge";
   - the "Tonight in the house" strip;
   - DoorFrame bands;
   - the Grand Hall elevator carousel;
   - the Vanity tabs;
   - the anchor band;
   - "Walk on".

   Hold the Room appears twice back to back.
3. **First seconds on phones.** The door overlay carries the price and shipping line. Once inside, the home hero shows no product or price.
4. **Three PDP templates with no shared buy block.**
   - Product-name casing differs.
   - Collection PDPs have no "How to use".
   - Serums carry no INCI (TA#2).
   - Trust lines differ; the Collection's is 11px at cream/55.
   - Serum cross-sell never bridges to the Collection.
   - There is no sticky add-to-bag on phones, and the serum button sits about 1,000px down.
5. **The bag.**
   - No routine completion.
   - No delivery or returns reassurance.
   - Shade not shown for Smooth Talker.
   - A pale thumbnail on night.
6. **Checkout.**
   - Brand break.
   - Marketing consent pre-ticked.
   - A "create a Shop account" prompt above Pay.
7. **Smooth Talker shade choice.** Three shades, no swatches on real skin, and opened products can't be returned, so a wrong shade can't come back.
8. **The quiz recommends serums only.** No "your routine" result, and no quiz tracking. *[unmeasured: flow not clicked through]*
9. **No proof near the button.** No reviews (correctly none faked), no human presence, no founder line.
10. **Account dead end.** /account has no order lookup.
11. **Readability.** 60–138 elements under 12px per page, and the trust-critical lines are the hardest to read. *[contrast unmeasured]*
12. **Performance.** *[unmeasured]*
    - Every page loads about 28 site-chrome images; even the 404 does.
    - Home loads 91 images, about 850 KB.
    - Phone hero images are oversized.
    - Two slow loads in one capture run (home 1440 at 11.5 s, with a JS chunk the browser refused; /found-her 390 at 11.1 s) did not reproduce on retest. Likely a deploy-time stall; worth watching.
13. **Reveal animations.** Sections start hidden until scrolled. Content renders on a normal scroll (verified), but a visible-by-default fail-safe removes any blank-screen risk on slow devices.

## 4. What is inconsistent with the FOUNDER Brand OS and Master Brand Board

- **"Real women first" and "no composite women":** generated portrait halls, the lounge woman, the Our Story portrait, the Salon door, Julie's collage, Aly's composite.
- **Dark default vs a Cream canvas.**
  - Board v2.14 says Cream is the default canvas and dark fields are "deliberate anchors, not default decoration".
  - The site has been night by default since Shelby's after-hours direction of 27 Aug.
  - The board also says the live website controls digital colour, so the site is overriding the board through the board's own clause.
  - The ground `#0e211b` is not a board token.
  - The header wordmark sits on a field none of the eight colourways specify.
  - Ratify it in a v2.15 so the team stops working from two systems.
- **FOUNDER leads.** Broken by:
  - /shop's title, "Shop the LALALOCA Collection";
  - the LALALOCA Brand node ("three serums, 50 ml each"), which is the only brand entity the Collection's schema points near;
  - the footer and Terms line "LALALOCA is the name of the collection", now that there are two collections (TA#13).
- **Typography.** "No all-caps Cormorant for interface labels" is broken by:
  - Collection PDP h1s ("HOLD THE ROOM");
  - the FOUND HER name plates ("SHELBY KORPI", "JULIE SCHOENER").
- **Products sit on surfaces.** Broken by the ledge-in-a-void renders and the dessert image.
- **Desert Rose warms the room; it isn't the room.** It is used well on the home band. The board-mandated rose "I found her when ______" field is not used on /found-her.
- **Voice.**
  - "Ritual" appears six times, and it is on the board's filler list.
  - The "For when…" template is back in three archetype lines.
  - Door lines repeated site-wide strain the "one room line in circulation" rule.
  - Unattributed first person in policy copy.
  - Two archetype systems plus routine steps stack labels over the product names.
- **"Every feature ends with: WHEN DID YOU FIND HER?"** It is a section heading on /found-her, but not the closing line of each profile.
- **The board itself is stale** and needs a v2.15 rather than quiet overrides:
  - $39.99 prices;
  - "three serums, no spreadsheet" as the product system;
  - SIGN HERE in the pre-sale architecture;
  - the old Home template.

  The team OS and the FOUND HER promotion kit still list SIGN HERE as current.
- **Coordination.** Two agent teams edited production in parallel today, and an earlier push was rejected because of it. AGENTS.md rule 1 exists for exactly this. One integrator per batch would prevent overwrites.

## 5. Making FOUND HER a stronger acquisition and retention engine

**Strengthen the foundation**
- Keep written records of each woman's yes: the date, what she approved (text, image, or both), and the consent version.
- Replace the generated halls with frames holding only approved women, plus empty brass plates for the rest. The new `FramedPortrait` overlay makes this cheap, and each new approval adds a face to the wall.
- Reword Shelby's confirmation email for her approval. Her current line, "Every story submitted to FOUND HER will be prepared for publication… as long as it meets our standard editorial and publishing guidelines", promises more than a one-woman house can deliver. Promise every woman a reply instead.

**The consent ladder** (how readers become faces)
- **P1 Reply** (required) and **P2 Consider for publication:** keep as they are.
- **P3, new and optional:** "You may contact me about being photographed or cast for FOUNDER."
- **After selection, a signed per-use grant covering:**
  - each use: site and organic social / paid / PDP / packaging / partner;
  - the term;
  - fee or gift;
  - her approval of final images;
  - no AI alteration of her face or body;
  - withdrawal from future uses.
- Record consent version and dates in Airtable.

**Two tiers and a rhythm**
- **The Archive:** short, approved, text-led entries. These scale.
- **FOUND HER No. 001+:** one selected, photographed feature a month, with masthead and issue date. Shelby's letter is No. 001.
- Every feature closes with WHEN DID YOU FIND HER? as the headline and "Write yours" as the button.

**Bridge to commerce without using her**
- A quiet "From the wall" band after the product details, never inside the buy block. Shelby first; other women only under their grant.
- Stories never credit a product.
- Profile pages link to both collections.

**Loops**
- **Reader → contributor:** the open form after every feature.
- **Buyer → contributor:** a separate day-21 "When did you find her?" email, explicitly not a review.
- **Contributor → referrer:** featured women share their page with a profile-specific UTM.
- **Recognition:** the wall, the key, invitations. Never orders ("purchase never decides inclusion").

**Distribution**
- Weekly "I found her when…" quote cards on Desert Rose.
- A 15-second portrait reveal for each feature, tagging her.
- Instagram Story question boxes that invite people to the form. Nothing is reposted without P2.

**Events.** A FOUND HER Dinner twice a year, Tucson first, alongside StandUp for Kids, with the pledge kept verbatim and separate. Film, Book, Podcast, Awards and Grants wait until there are at least 12 features and a budget.

**Metrics**
- submissions per week, by source;
- P2 and P3 opt-in rates;
- days to first reply, and days to approval;
- withdrawals;
- profile → form clicks;
- profile → shop clicks;
- `found-her` signups;
- visits from profile links.

## 6. What the team can safely execute autonomously

These follow the approval matrix: non-destructive UI, accessibility, SEO, performance, internal docs, drafts.

Every item goes through the same route: built on current `origin/main` → verified at 390 and 1440 → Brand Council → logged.

**(preview → Shelby)** means staged but not deployed to production until she says yes, because it visibly changes a key page or the site's look.

**Imagery and visual**
- Swap generated women on commercial routes for existing empty-room frames (threshold-hall, library-shelves, boardroom, vanity-console). *(preview → Shelby)*
- Replace the dessert House Trio image with the three bottles on marble, on the site and in the feed.
- Move unreferenced generated-people files out of `public/` into an archive folder. This is not a deletion.
- Title-case the Collection PDP h1s and the FOUND HER name plates.
- The rose "I found her when" field, the stripe section-join, and cream rooms on home, shop and collection. *(preview → Shelby)*

**Commerce UX**
- **Bag:** a routine-completion block using existing prices only, a delivery/returns line, and the shade on the line item.
- **PDPs:**
  - one shared buy block;
  - sticky add-to-bag on phones;
  - a trust row at 13px or larger and cream/75 or brighter;
  - "How to use" accordions, transcribed verbatim from supplier listings.
- **Navigation:** the footer lists all 8; a search icon in the phone header.
- **Quiz:** a "your routine" result, plus quiz tracking.
- **Routine numbering:** serums at "Treat". Label only.
- **/account:** "Track an order" and returns steps.

**Copy (no new claims)**
- Trim the "Walk on" band to one or two room pages.
- Give Thirst Trap and C Me Glow separate moments.
- Replace "ritual" and the "For when…" lines.
- Attribute or convert first person in policy copy.
- Retire the dormant "Reserve" strings in `nextMove.ts`.
- SEO titles and descriptions with product words and prices.

**Claims hygiene on the site** (soften or remove, never strengthen)
- Bounce Back "feels firmer".
- Hold the Room "stays comfortably hydrated".
- C Me Glow's undocumented "warm finish".
- The Library's unverified INCI names and "supports the skin's own barrier".

**Technical and SEO**
- **Live Shopify reads:** read price and `availableForSale` through the existing catalogue path. No price changes. Pass sold-out state to the serum and trio buttons, the trio schema and the feed.
- **Schema and analytics:**
  - fix the last hard-coded `item_brand`;
  - add a FOUNDER Brand entity;
  - one Product @id for Hold the Room;
  - remove the site-wide canonical in the layout.
- **Performance:** lazy-mount the house-map, door and concierge images, keep only the hero image eager, then take an LCP/CLS baseline.
- **Security and housekeeping:**
  - remove the revalidate webhook's client-secret fallback and add HMAC verification;
  - require `OWNER_EMAIL` from the environment. Both only after confirming the environment variables exist in Vercel, so story submissions, concierge escalation and revalidation don't break;
  - CSP in report-only mode;
  - sitemap priorities and lastModified dates;
  - the Reveal fail-safe;
  - stale "reservations/preorder" code comments.

**Drafts for Shelby** (written, not sent)
- welcome, post-purchase and day-21 emails;
- P3 consent and grant wording;
- the two-tier confirmation email;
- Instagram formats and a FOUND HER No. 001 layout;
- a Board v2.15 redline;
- a home cut list;
- a shoot brief for frames 01, 05, 09 and 03.

## 7. Decisions that need Shelby

### The five that unblock the most
Each takes a one-line answer.

1. **Shipping truth.** Do the FOUNDER Collection products ship within one business day, or on 12 October? → *"One day"* or *"Oct 12"*. The team then makes the site, Shopify, the schema and the Shopify descriptions say the same thing.
2. **Real women only.** Replace every generated woman with real or empty frames, including Room 02, the halls, the Our Story portrait, the Salon door and Julie's collage? → *"Yes"*, or name exceptions.
3. **Checkout.** Untick pre-selected marketing consent, brand the checkout, and add a checkout subdomain (DNS at GoDaddy)? → *"Yes to all"*, or pick.
4. **Measurement.** Create the GA4 property and paste the ID. Account access only. → *the G-ID*.
5. **One integrator.** Two agent teams edited production in parallel today. Name one lane per batch. → *"Cowork leads"* or *"the other agent leads"*.

### Everything else
TA# = this morning's team audit list.

6. **Dark default.** Ratify night as the official canvas in a Board v2.15 (night token plus wordmark colourway), or return to a Cream default with dark anchors. Also retire or keep the parlour/sweet-shop serum imagery.
7. **Shop structure and line names.** Reopens the 11 Sep "one name" revert in light of two live lines:
   - fixed labels: "LALALOCA Serums" / "The FOUNDER Collection";
   - /shop becomes the house shop;
   - which line gets the primary hero CTA.
8. **Hero product.** Is Hold the Room "where to begin"?
9. **Sets and prices.** Which sets, at what prices, and with what gift presentation.
10. **Stock truth.** Is the trio pre-packed or assembled? Is order #1001 a test, and does it need fulfilling or cancelling?
11. **Shopify catalogue.** Approve the cleaned titles and tags, and settle the Bounce Back "Firming" label (TA#5).
12. **Retention.**
    - the mailing address (a PO box is fine);
    - the welcome and post-purchase sequences;
    - a reviews app (no incentives);
    - the Founding List's real early-entry promise.
13. **FOUND HER consent.**
    - P3 wording;
    - grant terms: term, fee or gift, whether any styling is ever allowed;
    - the two-tier confirmation email (your own paragraph);
    - numbered features, and whether your piece is No. 001;
    - a monthly cadence.
14. **Aly's image.** Confirm in writing that Aly approved the composited portrait as well as her text, or restore her own photograph unaltered. Confirm whether `founder-collection-door.webp` is a photograph of you or a restyle.
15. **The real shoot.** Budget, photographer, date, casting from consenting FOUND HER women, and you on camera for frames 01 and 08.
16. **Your portrait and a quote on product pages and home** ("From the wall").
17. **Home cut list** (TA#7) and **whether the door overlay runs on phones** (TA#8).
18. **Founder revenue line.** It appears in your FOUND HER profile and now on Our Story as "just under one million dollars in its first year". The Etsy export shows $724,850 in the first twelve months and $861,471 over its whole life. Keep the line if other channels close the gap, and keep the receipts. Otherwise: "$725K in its first twelve months; more than 35,000 orders over its life."
19. **Claims evidence** (TA#2, #4):
    - serum INCI;
    - the source for "8-layer" hyaluronic acid;
    - ECOCERT certificates, with written permission to use them under the FOUNDER label;
    - the dermatological test report;
    - Clean Break's pH;
    - the Hold the Room carton's "Firming".
20. **Terms.** Align "no clinical or regulatory claims" with the certification claims on the PDPs. This is legal text.
21. **Salon promises** (TA#10). Keep only events that have dates.
22. **Invitation-only referral terms, and founder-story PR.** Both are public commitments.
23. **Etsy list.** Confirm it stays closed to marketing, and supply the `sameAs` profile URLs.

---

## Execution sequence (Founder Chief)

**Release route for every batch:**
1. frontend-engineer builds on current `origin/main` (re-fetched immediately before work, per AGENTS.md rule 1);
2. tsc, eslint and build pass;
3. screenshots at 390 and 1440;
4. Brand Council clears it with zero blockers;
5. commit on Shelby's Mac and a WORKLOG entry;
6. Shelby pushes.

Material page changes go to a preview first.

### Batch 0: protect trust and start seeing (this week; about an hour of Shelby's time)

| Action | Owner | Gate |
|---|---|---|
| Decide the shipping truth, then align the site bar, PDPs, schema, feed and Shopify badge/descriptions | product-merchandising → frontend-engineer | SHELBY decides; team executes |
| Name one integrator lane; agree branch discipline | founder-chief | SHELBY |
| Untick checkout marketing pre-selection; stage checkout branding | crm-retention-sales + frontend-engineer | SHELBY |
| GA4 property → env var + Shopify + cross-domain; UTM convention | growth-marketing + frontend-engineer | SHELBY (ID) |
| Trio linkage; order #1001; set `MAILING_ADDRESS` | product-merchandising, crm-retention-sales | SHELBY |
| Shopify titles, tags and featured images | product-merchandising + claims-compliance | SHELBY approves copy |

### Batch 1: truth, findability and the commercial spine (autonomous; about a week)

| Action | Owner |
|---|---|
| Live price and stock reads; sold-out on serums, trio, schema and feed; last `item_brand`; FOUNDER Brand entity; Hold the Room @id; layout canonical; secret fallback and `OWNER_EMAIL` (after the env check) | frontend-engineer |
| Shared PDP buy block, sticky add-to-bag, trust row, "How to use" (transcribed) | ux-cro-director → frontend-engineer; copy-brand-voice transcribes |
| Bag routine completion and reassurance line; shade on line | product-merchandising → frontend-engineer |
| Routine numbering; quiz routine result and tracking; footer lists all 8; phone search; /account order tracking | product-merchandising + ux-cro-director → frontend-engineer |
| Copy fixes and claims softening per the claims table; dessert image replaced | copy-brand-voice + claims-compliance; visual-content-director |
| Title-case h1s and name plates; small-text floor; Reveal fail-safe; image lazy-mounting; LCP/CLS baseline; axe sweep | frontend-engineer |
| Release review | brand-council-auditor |

### Batch 2: real faces and one house (preview → Shelby; 2–3 weeks)

| Action | Owner |
|---|---|
| Remove generated women from commercial and FOUND HER routes; empty-room frames; halls rebuilt with `FramedPortrait` showing only approved women plus empty plates; serums restaged in the night vanity with the "FOUNDER presents" eyebrow; archive unreferenced files | creative-director → visual-content-director → frontend-engineer |
| Home to 8 screens or fewer (Shelby's cut list); "Walk on" on one or two pages; cream rooms on commercial pages; stripe join; single-line nav | creative-director + ux-cro-director → frontend-engineer |
| House shop with both lines and fixed labels; schema and Terms wording (Shelby approves the Terms) | ux-cro-director + copy-brand-voice → frontend-engineer |
| Board v2.15 redline (dark default, night token and colourway, current prices and products, parlour imagery, SIGN HERE out of current architecture) | creative-director → Shelby |
| Brand Council → Shelby approves → production | brand-council-auditor |

### Batch 3: FOUND HER engine and retention (draft now, launch on approval; 30 days)

| Action | Owner |
|---|---|
| Consent ladder (P3 and grant); Airtable fields; two-tier confirmation email; pipeline doc fixed (states, 7-day reply, 48-hour takedown) | found-her-community + claims-compliance |
| FOUND HER No. 001 format, profile closing headline, "From the wall" band (Shelby first), Instagram formats | found-her-community + growth-marketing → frontend-engineer |
| Welcome sequence (day 0 / 3 / 7); post-purchase (shipping, how-to-use, day-14 review request, day-21 FOUND HER, replenishment); reviews app | crm-retention-sales (Shelby approves sends and the app) |
| Sets at full price with gift presentation; Shopify bundles; Smooth Talker shade guide | product-merchandising (Shelby approves prices) |

### Batch 4: the first real shoot and the room membership (60–90 days)

| Action | Owner | Gate |
|---|---|---|
| Shoot frames 01 (threshold, Shelby), 05 + 02 (wall and mirror, consenting FOUND HER women), 09 (ritual, hands with Hold the Room), 03 (vanity, both lines), 08 (direct gaze, used once); Smooth Talker swatches on real skin | visual-content-director | SHELBY (budget, casting, grants) |
| Interim empty frames become real women as approvals and grants land | found-her-community + creative-director | SHELBY per woman |
| "The Room": early entry by private link; invitation-only referral ("bring her in", never cash off); first FOUND HER Dinner when dated | crm-retention-sales + found-her-community | SHELBY |
| Founder-story PR on verified figures; Barn to Boardroom and The Ten Minutes Before franchises | growth-marketing | SHELBY |

## Protect, and don't break

**Experience and brand**
- The door overlay: its two-line protected statement with the F-key above, and its price and shipping line.
- The empty-room photography library.
- The new framed-portrait wall and the "Yours" frame.
- The product names.
- The striped Collection packaging, and FOUNDER over BEAUTY.
- The gold primary buttons.
- The truth-first panels:
  - fragrance disclosures;
  - Smooth Talker's not-a-sunscreen note;
  - "Shown: renders";
  - the portrait disclosure note;
  - no faked ratings.
- The two separate story permissions and the honest failure paths.
- The welcome email's no-discount tone.
- The verbatim pledge, now consistent on the Young Founders' Room.
- Live sold-out on the Collection.
- Legacy redirects.
- Security headers.
- Guest checkout.

**Protected mechanisms**
- The Shopify cart permalink and its hard-coded variant ids. Drafting a product breaks checkout.
- Admin API catalogue reads with null fallbacks.
- `/api/subscribe`, `/api/story`, `/api/unsubscribe`, `/api/concierge`, and their guard.
- Resend email.
- The `track()` analytics layer.
- Per-page canonicals, schema builders, sitemap, robots, llms.txt, feeds, OG routes.
