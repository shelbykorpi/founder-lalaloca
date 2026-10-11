# Homepage clarity audit — Phase 1 (10 Oct 2026)

**Stack:** Next.js 16 (App Router), React 19, Tailwind 4, Vercel. Homepage = `src/app/page.tsx` ("The House"). Nav = `src/components/site/Header.tsx` driven by `SHOP_NAV` / `PRIMARY_NAV` / `FOOTER_NAV` in `src/lib/brand.ts`. Catalogue is in-repo typed data with Shopify variant IDs: `src/lib/nextMove.ts` (Opening Line, Clean Break, Double Take, Smooth Talker), `src/lib/founderCollection.ts` (Hold the Room; variant in `shopifyLinks.ts`), `src/lib/products.ts` (LALALOCA: Thirst Trap, C Me Glow, Bounce Back, + trio set); live availability via `src/lib/catalog.ts`. Bag → Shopify cart permalink. Stories: `src/lib/profiles.ts` (Shelby, Julie, Aly approved).
**Routes:** `/founder-collection`, `/shop` (= LALALOCA), `/products/*`, `/found-her`, `/found-her/[slug]`, `/our-story`, `/library`, `/young-founders-room`, `/salon`, `/find-your-serum`. **`/lalaloca-collection` does not exist (404 live)** — LALALOCA lives at `/shop`.

## Findings by visitor
**New Instagram customer** — The hero ("Come for the beauty. Stay for everything behind it.") is metaphor-first; it does not say "skincare you can buy". Primary CTA "Enter the FOUNDER Collection" leads to another editorial room, not prices. Before any product card she meets a ticker rail, a Spotify embed, an elevator metaphor and a six-door Grand Hall; first prices appear far down the page. The FOUNDER vs LALALOCA naming is never explained.

**FOUND HER-interested woman** — FOUND HER is real and strong (three approved stories, a consented share form), but on the homepage it appears as a one-line rose band and a later Room 06 block, with no faces or names to click into.

**Returning buyer** — No direct "buy again" path: products are split between a carousel-like Vanity (FOUNDER) and a serum grid; only product pages carry add-to-bag. Nav has six tabs (Shop, Found Her, Our Story, Young Founders, Library, Salon) and "Shop" splits into two lines with no "all".

**Luxury judge** — Visual identity is distinctive and consistent (Founder Green, antique gold, Desert Rose, editorial serif, monogram, room photography); copy discipline on claims/fills is excellent. The weakness is hierarchy: many equal-weight rooms and metaphors dilute the brand promise; the same FOUND HER message is said twice.

## Top issues
1. Hero doesn't state what FOUNDER sells or for whom.
2. Primary CTA doesn't reach shoppable products.
3. Prices/add-to-bag appear only after several house/metaphor sections.
4. FOUNDER (house) vs LALALOCA (collection) relationship unexplained.
5. FOUND HER under-represented on the homepage (no faces, duplicated band).
6. Nav overloaded (6 tabs); rooms compete with shopping.
7. Meta description ("FOUNDER after dark…") doesn't match the positioning.
8. Live collection pages say Opening Line, Clean Break, Smooth Talker "Ships October 12" while record says in-stock — fine, but worth confirming after 12 Oct.
