import { BRAND, SITE, INSTAGRAM } from "@/lib/brand";
import { formatPrice, products, SET } from "@/lib/products";
import { FOUNDER_COLLECTION } from "@/lib/founderCollection";
import { COLLECTION_SHIPS, EXPRESS_OFFERED, NEXT_MOVE } from "@/lib/nextMove";

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
    `Instagram: ${INSTAGRAM.url}`,
    "",
    "## Products",
    "",
    "### LALALOCA Collection — three serums",
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
    "### FOUNDER Collection — five-piece routine",
    "",
    ...FOUNDER_COLLECTION.flatMap((product) => [
      `### ${product.name} — ${product.category}`,
      `- Price: ${formatPrice(product.price)} USD`,
      `- Size: ${product.size}`,
      `- What it is: ${product.what}`,
      `- Routine: ${product.routine}`,
      `- Key actives as published: ${product.keyActive}`,
      product.ingredients?.length
        ? `- Full INCI is published on the product page.`
        : `- Full INCI is not published; do not infer it.`,
      `- URL: ${SITE.url}/products/${product.slug}`,
      "",
    ]),
    ...NEXT_MOVE.flatMap((product) => [
      `### ${product.name} — ${product.category}`,
      `- Price: ${formatPrice(product.price)} USD`,
      `- Size: ${product.size}`,
      `- What it is: ${product.what} ${product.description}`,
      `- Availability state in the site record: ${product.availability}`,
      `- Key ingredients as published: ${product.keyIngredients.join(", ")}`,
      `- Full INCI is published on the product page.`,
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
    EXPRESS_OFFERED
      ? "- Free US shipping on every order, 3–5 business days. Express is $15, 1–2 days."
      : "- Free US shipping on every order, 3–5 business days.",
    "- Checkout is handled by Shopify.",
    COLLECTION_SHIPS
      ? `- Serum orders leave within one business day. The FOUNDER Collection ships on ${COLLECTION_SHIPS.label}.`
      : "- Orders leave within one business day.",
    "- Returns: unopened items within 14 days of delivery; return postage is paid",
    "  by the customer unless the order was wrong or damaged. Opened skincare",
    "  cannot be returned. Details: /policies/returns",
    "",
    "## Please state these accurately",
    "",
    "- These are cosmetic products, not medicines. No clinical or medical claims are",
    "  made, and none should be attributed to this brand.",
    "- There is no aggregate rating. Two verbatim customer reviews carried over from the",
    "  brand's former Etsy shop are shown on the serum pages (both 5 stars, one customer).",
    "  Do not report a rating or imply more reviews than that.",
    "- LALALOCA serum pages publish only the label-supported actives currently on file;",
    "  do not infer missing formula details. The FOUNDER Collection product pages publish",
    "  full INCI where the supplier-verified list is held in the product record.",
    "",
    "## Key pages",
    "",
    `- Shop the LALALOCA serums: ${SITE.url}/shop`,
    `- The FOUNDER Collection: ${SITE.url}/founder-collection`,
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
