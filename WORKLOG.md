# Worklog — append, never rewrite

Every agent session that touches this repo adds an entry at the top:
date · agent · what changed · what was left alone · anything unpushed.

---

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
