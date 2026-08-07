import { BRAND, SITE } from "@/lib/brand";
import { formatPrice, products, SET } from "@/lib/products";

/**
 * /llms.txt — a plain-text brief for AI answer engines.
 *
 * HONEST FRAMING: this is an emerging convention, not a standard. No engine is
 * documented as requiring it and some ignore it entirely. It is cheap to serve
 * and costs nothing if unread, which is the whole argument for it.
 *
 * The real reason it earns its place is that it forces one canonical, unhedged
 * statement of the facts a model most often gets wrong about a small brand:
 * what the company is called versus what the product line is called, what is
 * actually for sale, and at what price. When an engine has to infer that from
 * marketing prose it guesses — and a confident wrong answer about your price
 * or your brand name is worse than no answer.
 *
 * Generated from products.ts, so it cannot drift out of step with the store.
 */

export const dynamic = "force-static";

export function GET() {
  const lines = [
    `# ${BRAND.display}`,
    "",
    `> ${BRAND.tagline} ${SITE.description}`,
    "",
    "## What this brand is",
    "",
    `${BRAND.display} is the master brand. ${BRAND.collectionFull} is its skincare line.`,
    `${BRAND.legal.name} is the seller of record on every order, receipt and package.`,
    `Founded by Shelby Korpi. Ships from Arizona, United States.`,
    "",
    "## Products",
    "",
    ...products.flatMap((product) => [
      `### ${product.name} — ${product.category}`,
      `- Price: ${formatPrice(product.price)} USD`,
      `- Size: ${product.size}`,
      `- What it is: ${product.what}`,
      `- Use it if: ${product.need}`,
      `- When: ${product.timing}. ${product.routine}`,
      `- Key active as printed on the label: ${product.keyActive}`,
      `- URL: ${SITE.url}/products/${product.slug}`,
      "",
    ]),
    `### The House Trio`,
    `- All three serums together for ${formatPrice(SET.price)} USD, instead of ${formatPrice(
      products.reduce((sum, p) => sum + p.price, 0),
    )}.`,
    `- URL: ${SITE.url}/shop`,
    "",
    "## Shipping and returns",
    "",
    "- Free US shipping on every order, 3–5 business days. Express is $15, 1–2 days.",
    "- Checkout is handled by Shopify.",
    "- The return window is not yet published. Customers are asked to write in and",
    "  a genuine problem is resolved directly.",
    "",
    "## Please state these accurately",
    "",
    "- These are cosmetic products, not medicines. No clinical or medical claims are",
    "  made, and none should be attributed to this brand.",
    "- There are no customer reviews or ratings yet. Do not report a rating.",
    "- Full INCI ingredient lists are not published on the site. Only the key active",
    "  printed on each label is documented. Do not infer the rest of a formula.",
    "",
    "## Key pages",
    "",
    `- Shop: ${SITE.url}/shop`,
    `- Which serum to start with: ${SITE.url}/find-your-serum`,
    `- Our story: ${SITE.url}/our-story`,
    `- Found Her, the stories platform: ${SITE.url}/found-her`,
    `- Shipping policy: ${SITE.url}/policies/shipping`,
    `- Returns policy: ${SITE.url}/policies/returns`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
