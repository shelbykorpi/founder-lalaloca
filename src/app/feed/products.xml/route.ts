import { BRAND, SITE } from "@/lib/brand";
import { products, SET } from "@/lib/products";

/**
 * Google Merchant Center product feed (RSS 2.0 + the `g:` namespace).
 *
 * WHY A FEED AND NOT JUST PRODUCT SCHEMA. The JSON-LD on each product page can
 * earn a rich result in ordinary Search. It cannot get the products into the
 * Shopping tab, into free listings across the Google surfaces, or into the
 * product data that Gemini and AI Overviews draw on when someone asks what to
 * buy. That comes from Merchant Center, and Merchant Center wants a feed.
 *
 * BEFORE YOU USE THIS, CHECK ONE THING: if the Shopify store is already syncing
 * to Merchant Center through the Google & YouTube channel app, adding this feed
 * creates a second record for every product and Merchant Center flags them as
 * duplicates. Use one source or the other, never both. This feed is the right
 * choice when the products are marketed from founderbeauty.co, because the
 * `link` then points at the page that carries the brand story rather than at a
 * bare Shopify product URL.
 *
 * `identifier_exists: no` is the honest declaration for a brand with no GTINs
 * issued yet. It is a supported value, not a workaround. Leaving it out while
 * also omitting `gtin` and `mpn` is what triggers a disapproval.
 *
 * NOTHING IN THIS FILE IS INVENTED. Every value comes from products.ts, which
 * comes from the approved label. There is no `product_highlight` puffery, no
 * invented `material`, and no `age_group`/`gender` guess beyond the audience
 * already declared in the on-page schema.
 */

export const dynamic = "force-static";

/**
 * Google's taxonomy ID for Health & Beauty > Personal Care > Cosmetics >
 * Skin Care. Serums sit here. Using the numeric ID rather than the string
 * avoids a mismatch when Google edits a category name.
 */
const GOOGLE_CATEGORY = "2915";

/** XML text escaping. Product copy contains apostrophes and em dashes. */
function xml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type FeedItem = {
  id: string;
  title: string;
  description: string;
  link: string;
  image: string;
  price: number;
  /** Optional extras that only some items carry. */
  extra?: string[];
};

function item(entry: FeedItem) {
  return [
    "    <item>",
    `      <g:id>${xml(entry.id)}</g:id>`,
    `      <g:title>${xml(entry.title)}</g:title>`,
    `      <g:description>${xml(entry.description)}</g:description>`,
    `      <g:link>${xml(entry.link)}</g:link>`,
    `      <g:image_link>${xml(entry.image)}</g:image_link>`,
    "      <g:availability>in_stock</g:availability>",
    "      <g:condition>new</g:condition>",
    `      <g:price>${entry.price.toFixed(2)} USD</g:price>`,
    `      <g:brand>${xml(BRAND.collection)}</g:brand>`,
    /* No barcodes issued. Declaring that is required; omitting it silently is
       what gets a feed disapproved. */
    "      <g:identifier_exists>no</g:identifier_exists>",
    `      <g:google_product_category>${GOOGLE_CATEGORY}</g:google_product_category>`,
    "      <g:shipping>",
    "        <g:country>US</g:country>",
    "        <g:service>Standard</g:service>",
    "        <g:price>0.00 USD</g:price>",
    "      </g:shipping>",
    "      <g:shipping_label>free-us-standard</g:shipping_label>",
    ...(entry.extra ?? []),
    "    </item>",
  ].join("\n");
}

export function GET() {
  const items = products.map((product) =>
    item({
      id: product.slug,
      /* Merchant Center title rules: the searchable attribute goes in, brand
         first, no promotional text, no all-caps beyond the brand name itself. */
      title: `${BRAND.collection} ${product.name} — ${product.category}, ${product.size}`,
      description: `${product.what} ${product.need} ${product.routine} Key active as printed on the label: ${product.keyActive}. Cosmetic product; no clinical claims are made.`,
      link: `${SITE.url}/products/${product.slug}`,
      image: `${SITE.url}${product.bottle}`,
      price: product.price,
      extra: [
        `      <g:product_type>${xml(`Skincare > Serums > ${product.category}`)}</g:product_type>`,
        `      <g:item_group_id>lalaloca-collection</g:item_group_id>`,
        `      <g:product_detail>`,
        `        <g:section_name>Format</g:section_name>`,
        `        <g:attribute_name>Size</g:attribute_name>`,
        `        <g:attribute_value>${xml(product.size)}</g:attribute_value>`,
        `      </g:product_detail>`,
        `      <g:product_detail>`,
        `        <g:section_name>Use</g:section_name>`,
        `        <g:attribute_name>When</g:attribute_name>`,
        `        <g:attribute_value>${xml(product.timing)}</g:attribute_value>`,
        `      </g:product_detail>`,
      ],
    }),
  );

  /* The trio is a real SKU sold at a real price on /shop, so it belongs in the
     feed. It is a multipack, and Google wants that stated explicitly — an
     unmarked bundle competing against its own components looks like duplicate
     inventory. */
  const trio = item({
    id: "lalaloca-trio",
    title: `${BRAND.collection} ${SET.name} — ${SET.detail}`,
    description: `All three serums in ${BRAND.collectionFull}: Thirst Trap (8-layer hyaluronic acid), C Me Glow (vitamin C) and Bounce Back (collagen). Three full-size 50 ml bottles. Cosmetic products; no clinical claims are made.`,
    link: `${SITE.url}/shop`,
    image: `${SITE.url}${SET.image}`,
    price: SET.price,
    extra: [
      `      <g:product_type>${xml("Skincare > Serums > Sets")}</g:product_type>`,
      `      <g:is_bundle>yes</g:is_bundle>`,
      `      <g:multipack>${products.length}</g:multipack>`,
    ],
  });

  const feed = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">',
    "  <channel>",
    `    <title>${xml(`${BRAND.display} — ${BRAND.collectionFull}`)}</title>`,
    `    <link>${xml(SITE.url)}</link>`,
    `    <description>${xml(SITE.description)}</description>`,
    ...items,
    trio,
    "  </channel>",
    "</rss>",
  ].join("\n");

  return new Response(feed, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
