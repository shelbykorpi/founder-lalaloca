# FOUNDER

Beauty for what you're building.

A Next.js (App Router) site for **FOUNDER**, presenting the **LALALOCA Collection**
— three serums already on sale — and **FOUND HER**, the editorial platform.

---

## Running it

> **Note on the folder name.** This directory contains a colon (`Founder:LALALOCA`).
> A colon is the `PATH` separator on macOS/Linux, so npm cannot put
> `node_modules/.bin` on the path and plain `next dev` fails with
> `next: command not found`. The npm scripts therefore call the binaries through
> `node` directly, which works regardless. If you rename the folder to something
> without a colon, you can restore the conventional `"dev": "next dev"` scripts.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on :3000 |
| `npm run build` | Production build (also type-checks) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (Next core-web-vitals + react-hooks) |

There is no test runner configured — no test framework was present to preserve.
Verification for this build was done through the production build, ESLint,
TypeScript, and scripted browser checks (see "What was tested").

---

## Brand structure

Everything is centralised in [`src/lib/brand.ts`](src/lib/brand.ts). Do not
hard-code brand names in components.

| Layer | Value | Notes |
| --- | --- | --- |
| Display brand | FOUNDER | Working name. **Not legally cleared.** |
| Collection | LALALOCA | The original three-serum collection |
| Editorial | FOUND HER | Stories platform |
| Legal seller | LALALOCA | Unchanged. Named in Organization schema, footer, terms, and on every product page. |

The site never states that LALALOCA has changed its legal name. The footer and
`/policies/terms` both say plainly that FOUNDER is the brand name on the site
and LALALOCA is the name on the order, receipt and packaging.

### Message hierarchy

Each line has one job and appears in one place:

- **Tagline** — *Beauty for what you're building.* → homepage hero, footer
- **Belief** — *Every woman is the founder of something.* → homepage belief section
- **Campaign** — *You didn't become her. You found her.* → Found Her hero, homepage Found Her block
- **Question** — *When did you find her?* → story form, end of articles
- **Supporting** — *Be seen. Be heard. Look good doing it.* → Our Story, once, where the collection's history sits

---

## Routes

| Route | Type |
| --- | --- |
| `/` | Static |
| `/shop` | Static |
| `/products/[slug]` | SSG — `thirst-trap`, `c-me-glow`, `bounce-back` (URLs unchanged) |
| `/our-story` | Static |
| `/found-her` | Static |
| `/found-her/[slug]` | SSG — profiles first, then editorial notes |
| `/find-your-serum` | Static |
| `/search` | Static |
| `/account` | Static |
| `/policies/[slug]` | SSG — shipping, returns, accessibility, privacy, terms |
| `/sitemap.xml`, `/robots.txt` | Generated |

Redirects (in `next.config.ts`): `/women` and `/journal` → `/found-her`, the
three old journal slugs → their replacement articles, `/prelaunch` → `/`.

---

## Product data is locked

[`src/lib/products.ts`](src/lib/products.ts) is the single source. Names,
categories, sizes, prices, product colours and bottle photography come from the
approved packaging and must not be changed.

**Only what the label states is repeated.** No percentages, no undocumented
actives, no results claims, no reviews or ratings — including in the
`Product` JSON-LD, which deliberately carries no `aggregateRating`.

Fields marked `null` (`ingredients`, `texture`) render as an explicit "not
published yet" message on the product page rather than being invented.

### Hero image

`public/editorial/hero-founder.webp` — the approved campaign photograph, resized
to 2400px wide and compressed to webp. The original is kept at
`assets/source/hero-founder-original.png`.

To swap it:

```bash
./scripts/set-hero.sh path/to/new-photo.jpg
```

The layout is tuned to this composition — subject on the right, black on the
left. Below `md` the photograph is its own block with the copy beneath it; from
`md` up it becomes the background and the wash fades out before her face so the
picture is never veiled. A different composition will need the
`object-position` values in `src/app/page.tsx` adjusted.

### Bottle imagery

- `thirst-trap-bottle.png` — the approved transparent cutout, full resolution.
- `editorial/collection-still.webp` — the "all three" still life. Deliberately
  **not** a photograph of the bottles: it carries the three product colours
  without re-rendering approved packaging.
- `trio-hero.jpg` — the previous "all three" shot, no longer referenced. Cropped
  to the bottles only. The supplied composite had
  "Three serums. One ritual." set into the photograph, and *ritual* is on the
  prohibited list — a text sweep cannot catch words that are pixels, so check
  new imagery by eye. Labels and proportions are uncropped.
- `bounce-back-bottle.png`, `c-me-glow-bottle.png` — **isolated from the existing
  campaign composites.** The striped pink background was masked out
  geometrically; the bottles, labels and proportions are untouched, but source
  resolution is limited (~380 px wide native). Product pages show a production
  note asking for the approved high-resolution cutouts. Drop replacements at the
  same paths and nothing else needs to change.

---

## Integrations still to connect

None of these are faked. Each one says so in the interface rather than showing a
success state over a discarded action.

| Feature | State | Where |
| --- | --- | --- |
| Checkout / payments | **Not connected.** Bag works fully (add, quantity, remove, persistence, cross-tab sync via `localStorage`); the Checkout button is disabled with an explanation. | `src/components/bag/` |
| Email signup | **Not connected.** Submitting says nothing was stored. | `src/components/site/EmailSignup.tsx` |
| Story submissions | **Not connected.** Validates, then states plainly that it was not sent. | `src/components/story/StoryForm.tsx` |
| Analytics | **Provider-agnostic.** Events push to `window.dataLayer` and fire a `founder:track` DOM event. Add GTM/GA4/Segment and they flow. | `src/lib/analytics.ts` |
| CMS for Found Her profiles | **Not connected.** Profiles live in `src/lib/profiles.ts` with a typed shape ready to map. The founder's is the first and only one. | `src/lib/profiles.ts` |

Events emitted: `product_view`, `product_select`, `add_to_cart`,
`begin_checkout`, `purchase`, `email_signup`, `found_her_article_view`,
`story_submission`. The last four of the first group fire today; `begin_checkout`
and `purchase` are defined and wire up with the commerce provider.

---

## Design system

Tokens live in [`src/app/globals.css`](src/app/globals.css) under `@theme`.

- **Palette** — cream `#F7EFE8`, blush `#EAD3C3`, rose `#D8A7A0`, bronze
  `#B08A64`, charcoal `#2A2928`, black. Door environments use deep emerald
  `#0D2B26` / teal `#143F3A`.
- **Two accessible bronzes.** `--color-bronze` (`#B08A64`) is decorative and for
  text on dark surfaces. `--color-bronze-ink` (`#8A6335`) is for small text on
  cream — it clears 4.5:1. `--color-bronze-mid` (`#A37C53`) is for large display
  accents and clears 3:1. Use `text-bronze-ink` on light backgrounds.
- **Type** — Cormorant Garamond (display) and Jost (interface), via `next/font`.
- **Spacing** — `.shell`, `.shell-narrow`, `.section`, `.section-tight`. Use
  these rather than one-off padding values.
- **Buttons** — one `.btn` base with `.btn-primary` / `.btn-dark` /
  `.btn-outline` / `.btn-ghost-light`. All are at least 48 px tall.

### The product doorway

`src/components/door/` — one component system, three sizes.

- `DoorFrame` — the presentational primitive: emerald room, bronze frame,
  two lacquered leaves that swing **inward** so an open door never covers copy
  outside the frame. Purely decorative and `aria-hidden`.
- `DoorCard` — homepage and shop. Portrait aspect, opens on hover (fine
  pointers only), on keyboard focus, or by an explicit control.
- `ProductDoor` — one contained reveal at the top of a product page, opened
  once on arrival. Never repeated further down the page.
- `EntranceDoor` — the homepage feature: black lacquered doors under a brass
  fanlight that swing open and take you to `/shop`. It is a real `<a href>`
  first, so it works without JavaScript and honours cmd/middle-click; the click
  is only intercepted to play the swing before navigating, and not at all under
  reduced motion.

Details inside the frame:

- **Monogram** — a mirrored pair of serif letterforms (`BRAND.monogram`, set in
  Cormorant via SVG so it scales with the frame) that together make a doorway,
  with a four-point star straddling the seam. Each leaf carries its own half,
  clipped by its own edge, so the mark reads as one piece when shut and parts as
  the doors swing. Handles sit at 64% height to stay clear of it.
- **Display block** — the serum is set on a lacquered black riser with a lit cap,
  a tapered body, a contact shadow and the bottle mirrored in the polish. The
  bottle base and the top of the block are both pinned to 21% from the frame
  floor, so they stay locked together at any size.

> Tailwind v4 emits `translate-*` utilities as the standalone `translate`
> property, which **composes with** an inline `transform` rather than replacing
> it. Anything inside `DoorFrame` that animates via inline `transform` must not
> also carry a translate utility, or it shifts twice.

Rules the components enforce:

- Every piece of purchase information sits **outside** the doorway and is
  readable whether it is open or shut.
- Hover-to-open is gated behind `(hover: hover) and (pointer: fine)`, so touch
  devices get the explicit button instead.
- Focus-to-open is gated behind `:focus-visible`, otherwise a mouse or touch
  press would open on focus and immediately close on click.
- `prefers-reduced-motion` replaces the 3D swing with an immediate open state.

---

## Writing rules

Public copy lives in `src/lib/content.ts`, `src/lib/products.ts` and the page
files. Before adding any customer-facing string:

1. It must sound like a person talking, not a brand deck.
2. The prohibited-word list from the brand brief stays out — including
   *signal*, *ritual*, *journey*, *elevate*, *empower*, *own the room*.
3. No invented reviews, contributors, statistics, press or results.
4. The customer is the main character, not the founder and not the product.
5. If the sentence would work for 500 other beauty brands, rewrite it.
