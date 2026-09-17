# Working in this repository — rules for every agent

This repo is edited by several AI agents (Claude/Cowork, Codex, Gemini, Warp)
and by Shelby herself. None of you can see the others. This file and
WORKLOG.md are how you coordinate. **Read WORKLOG.md before changing
anything. Append to it before you finish.** That is not optional; skipping it
is how this repo got a broken build, an overwritten page, and two half-
finished hero swaps in one week.

## The three rules that prevent disasters

1. **Git is the only source of truth.** Before editing any file, start from
   `git show HEAD:<file>` or a fresh checkout — never from a copy you made
   earlier, however recent it feels. A stale base overwrote a newer page.tsx
   here on 14 Aug and broke the build.
2. **Finish or revert.** Never leave the working tree half-switched (assets
   added but code not updated, or the reverse). If you cannot complete a
   change, `git checkout -- <files>` and write down what you intended in
   WORKLOG.md instead.
3. **Log it.** Append one entry to WORKLOG.md: date, which agent you are,
   what you changed, what you deliberately did NOT change, anything unpushed.

## What governs this codebase

- **The brand board wins.** The FOUNDER Master Brand Board v2.14 is the
  source of truth for all visual and brand decisions; the searchable text
  lives in the Claude project (`claude/founder-master-brand-board.md`) and a
  code-facing digest in `docs/BRAND_BOARD.md`. Read it before touching
  colour, type, logos, campaign language, or photography.
- **Protected, verbatim, never edited:** `OPEN THE DOOR. / THE ROOM IS
  YOURS.` (always two lines) · "The room is yours." · the FOUNDER/BEAUTY
  wordmark construction (Cormorant Garamond 400 over Jost 400 at .48em,
  38–42% width) · the F-key monogram geometry (never redrawn, never fused to
  the wordmark).
- **Never invent:** ingredients, claims, reviews, clinical results,
  certifications, prices, launch dates, ship dates, stock, or charitable
  terms.
- **The FOUNDER Collection is live, as a PREORDER.** Amended 17 Sept 2026;
  this line used to say the v2.14 products "do NOT appear on the site", and
  the site had been selling them since 4 Sept. Five SKUs — Opening Line,
  Clean Break, Hold the Room, Double Take, Smooth Talker — all Selfnamed,
  all priced in Shopify, all sold against the first run with the preorder
  notice in `lib/nextMove.ts` (`PREORDER_NOTE`). Each record carries
  `availability`; flip a SKU to `"in-stock"` only on the day its stock is
  physically counted in, never before. SIGN HERE has no supplier and is not
  on the site. Every product fact traces to a supplier listing or a concept
  doc in the Claude project; INCI is transcribed, never tidied.
- **Read `FOUNDER_AUDIT.md`** before touching the site: it is the living
  record of findings, decisions, open questions and regression risks.
- **British spelling** throughout (moisturiser, labelled). It is not a typo.
- **No customer PII in this repo.** Ever. The Etsy export lives outside git.
- **20% of net profits** (Young Founders' Room): four occurrences, same
  wording, never paraphrased, no legal gloss added.

## Practical notes

- Build: `npm run build`. It must pass before any commit. Verify changes at
  390px and 1440px — screenshots, not assumptions.
- Commit with explicit file paths, never `git add -A`.
- Hero images: `hero-open-door.webp` (desktop composite) and
  `hero-open-door-m.webp` (mobile, cropped past the soft-focus F) are the
  approved pair. `_candidates/` holds unadopted proposals — do not wire
  them in without Shelby's approval.
- The desk app (~/FOUNDER-Desk) has its own AGENTS.md. Same rules.
