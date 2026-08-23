/**
 * The one-price guard. Runs before every `npm run build` (see "prebuild").
 *
 * The repo still carries prices for the hand-written pages, and the whole
 * $38-vs-$39.99 episode existed because a repo price and a Shopify price can
 * drift apart silently. This script makes the drift loud: it reads the live
 * public storefront JSON (no credentials needed) and compares each variant's
 * price to the figure in the source files. A mismatch FAILS THE BUILD with a
 * message saying which side to fix — almost always the repo, because Shopify
 * is the source of truth (decision of 23 Aug 2026, see docs/BRAND_BOARD.md).
 *
 * OFFLINE IS NOT A FAILURE. A local build on a plane, or a Shopify outage,
 * prints a warning and passes — this guard exists to catch drift, not to make
 * the site unbuildable when a third party has a bad minute.
 */

import { readFile } from "node:fs/promises";

const SHOP = "founderbeauty.myshopify.com";

/** slug in the repo → Shopify product handle. */
const HANDLES = {
  "thirst-trap":
    "8-layer-hyaluronic-acid-serum-plumping-glow-drops-marine-collagen-dry-skin-hydration-50ml",
  "c-me-glow": "c-me-glow-vitamin-c-brightening-serum-with-niacinamide-50ml-full-size",
  "bounce-back": "bounce-back-collagen-firming-serum-marine-face-neck-lifting-50ml",
  "all-three": "lalaloca-serum-trio-hyaluronic-acid-vitamin-c-collagen-face-serums",
};

async function repoPrices() {
  const products = await readFile("src/lib/products.ts", "utf8");
  const founder = await readFile("src/lib/founderCollection.ts", "utf8");

  const out = {};
  // Every serum entry declares `slug: "x"` ... `price: N` in order.
  for (const match of products.matchAll(/slug: "([a-z-]+)"[\s\S]*?price: ([\d.]+)/g)) {
    out[match[1]] = Number(match[2]);
  }
  const set = products.match(/SET = \{[\s\S]*?price: ([\d.]+)/);
  if (set) out["all-three"] = Number(set[1]);
  const htr = founder.match(/slug: "hold-the-room"[\s\S]*?price: ([\d.]+)/);
  if (htr) out["hold-the-room"] = Number(htr[1]);
  return out;
}

async function livePrice(handle) {
  const response = await fetch(`https://${SHOP}/products/${handle}.js`, {
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`${response.status} for ${handle}`);
  const json = await response.json();
  return json.variants[0].price / 100;
}

const repo = await repoPrices();
let failed = false;
let checked = 0;

for (const [slug, handle] of Object.entries(HANDLES)) {
  if (!(slug in repo)) continue;
  let live;
  try {
    live = await livePrice(handle);
  } catch (error) {
    console.warn(`[price-check] SKIP ${slug} — Shopify unreachable (${error.message}).`);
    continue;
  }
  checked += 1;
  if (Math.abs(live - repo[slug]) > 0.001) {
    console.error(
      `[price-check] MISMATCH ${slug}: repo says $${repo[slug].toFixed(2)}, ` +
        `Shopify charges $${live.toFixed(2)}. Shopify is the source of truth — ` +
        `fix the repo figure (or, if the price genuinely changed, change it in ` +
        `Shopify first and re-run).`,
    );
    failed = true;
  }
}

if (failed) process.exit(1);
console.log(
  checked > 0
    ? `[price-check] OK — ${checked} price(s) match Shopify.`
    : "[price-check] Shopify unreachable — skipped (offline build).",
);
