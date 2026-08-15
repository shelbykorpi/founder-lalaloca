# Worklog — append, never rewrite

Every agent session that touches this repo adds an entry at the top:
date · agent · what changed · what was left alone · anything unpushed.

---

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
