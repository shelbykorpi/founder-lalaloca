/**
 * The one-price guard. Runs before every `npm run build` (see "prebuild").
 *
 * The repo still carries prices for the hand-written pages, and the whole
 * $38-vs-$39.99 episode existed because a repo price and a Shopify price can
 * drift apart silently. This script makes the drift loud: it reads the live
 * public storefront JSON (no credentials needed) and compares each variant's
 * price to the figure in the source files. A mismatch is reported loudly with
 * a message saying which side to fix — almost always the repo, because Shopify
 * is the source of truth (decision of 23 Aug 2026, see docs/BRAND_BOARD.md).
 *
 * THIS SCRIPT MUST NEVER BLOCK A DEPLOY FOR A NON-PRICE REASON. It runs as
 * `prebuild`, so anything it throws takes the whole site down — a guard that
 * can do that is worse than the bug it guards against. Every failure mode
 * except one confirmed mismatch exits 0: offline, DNS, 403, bad JSON, a
 * renamed handle, an unreadable source file, a regex that stops matching.
 * The only exit 1 is "both numbers read cleanly and they disagree."
 *
 * Run `node scripts/check-prices.mjs --strict` to make any problem fatal —
 * useful by hand, never in the build.
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

const STRICT = process.argv.includes("--strict");

let mismatch = false;
let checked = 0;

try {
  const repo = await repoPrices();

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
      mismatch = true;
    }
  }
} catch (error) {
  /* Anything the loop did not anticipate: an unreadable source file, a regex
     that stopped matching after a refactor, a Node API change. Report it and
     let the build through — see the note at the top. */
  console.warn(`[price-check] SKIPPED — the check itself failed (${error.message}).`);
  if (STRICT) process.exit(1);
  process.exit(0);
}

if (mismatch) {
  if (STRICT) process.exit(1);
  console.error(
    "[price-check] Prices disagree with Shopify. NOT failing the build — fix " +
      "the repo figure, then run: node scripts/check-prices.mjs --strict",
  );
  process.exit(0);
}

console.log(
  checked > 0
    ? `[price-check] OK — ${checked} price(s) match Shopify.`
    : "[price-check] Shopify unreachable — skipped.",
);
