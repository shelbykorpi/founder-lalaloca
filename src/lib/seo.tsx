import { BRAND, SITE } from "./brand";
import type { Product } from "./products";

/**
 * Structured data — the machine-readable version of the site.
 *
 * This matters twice over. Google reads it to build rich results (breadcrumbs,
 * FAQ accordions, product cards with price and availability). AI answer engines
 * — ChatGPT, Perplexity, Gemini, AI Overviews — read it to decide what this
 * brand *is* and whether they can state a fact about it confidently. Prose can
 * be misread; a typed graph cannot.
 *
 * ONE RULE HERE: every value is a fact already published on the site or printed
 * on the approved label. Nothing in this file is invented to win a rich result.
 * Notably absent, and deliberately:
 *
 *   aggregateRating / review — we have no reviews. Inventing them is fraud.
 *   hasMerchantReturnPolicy  — the return window is still "to confirm" in
 *                              content.ts. Publishing an unconfirmed commercial
 *                              term as machine-readable data would put a number
 *                              in Google's index that legal never signed off.
 *                              Add it the day the policy is finalised; see
 *                              returnPolicyGap below.
 *   gtin / mpn               — no barcodes issued yet.
 */

/** Documented on /policies/shipping and the shop page. Free, US, 3–5 days. */
const US_SHIPPING = {
  "@type": "OfferShippingDetails",
  shippingRate: {
    "@type": "MonetaryAmount",
    value: "0",
    currency: "USD",
  },
  shippingDestination: {
    "@type": "DefinedRegion",
    addressCountry: "US",
  },
  deliveryTime: {
    "@type": "ShippingDeliveryTime",
    handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "DAY" },
    transitTime: { "@type": "QuantitativeValue", minValue: 3, maxValue: 5, unitCode: "DAY" },
  },
} as const;

/**
 * Set to true the day the return window is signed off, then add the policy
 * object below. Until then Product rich results will show a "missing return
 * policy" notice in Search Console — that is the correct trade.
 */
export const returnPolicyGap = true;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: BRAND.legal.name,
    alternateName: [BRAND.display, BRAND.collection],
    url: SITE.url,
    logo: `${SITE.url}/icon.png`,
    description: SITE.description,
    slogan: BRAND.tagline,
    founder: { "@type": "Person", name: "Shelby Korpi" },
    knowsAbout: [
      "skincare",
      "hyaluronic acid serum",
      "vitamin C serum",
      "collagen firming serum",
    ],
  };
}

/** Declares the site as a searchable entity and offers Google the search box. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: BRAND.display,
    description: SITE.description,
    publisher: { "@id": `${SITE.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Mirrors the visible breadcrumb trail so Google can render it in results. */
export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${SITE.url}${crumb.path}`,
    })),
  };
}

/**
 * The FAQs already sit in products.ts and render on every product page — they
 * were simply never exposed as data. Marking them up makes them eligible to
 * appear directly in results, and gives answer engines a clean question →
 * answer pair to quote instead of paraphrasing the page.
 */
export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

export function productSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE.url}/products/${product.slug}/#product`,
    name: product.name,
    description: product.what,
    category: product.category,
    image: `${SITE.url}${product.bottle}`,
    sku: product.slug,
    brand: { "@type": "Brand", name: BRAND.collection },
    size: product.size,
    audience: { "@type": "PeopleAudience", suggestedGender: "female" },
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: "USD",
      url: `${SITE.url}/products/${product.slug}`,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${SITE.url}/#organization` },
      shippingDetails: US_SHIPPING,
    },
  };
}

/** The collection as a ranked list, so /shop can win a carousel. */
export function collectionSchema(products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: BRAND.collectionFull,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE.url}/products/${product.slug}`,
      name: product.name,
    })),
  };
}

/**
 * FOUND HER stories. Original first-person interviews are the one kind of
 * content that cannot be produced by summarising someone else's page — which
 * is exactly what both Google's helpful-content system and answer engines are
 * trying to reward. Marking them as Article with a named author and a real
 * publication date is what lets them be recognised as reporting rather than
 * product copy.
 */
export function articleSchema(article: {
  title: string;
  standfirst: string;
  path: string;
  image?: string;
  published?: string;
  modified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE.url}${article.path}/#article`,
    headline: article.title,
    description: article.standfirst,
    url: `${SITE.url}${article.path}`,
    ...(article.image ? { image: `${SITE.url}${article.image}` } : {}),
    ...(article.published ? { datePublished: article.published } : {}),
    ...(article.modified ? { dateModified: article.modified } : {}),
    publisher: { "@id": `${SITE.url}/#organization` },
    isPartOf: { "@id": `${SITE.url}/#website` },
  };
}

/** The woman a profile is about — a real named person, not a testimonial. */
export function personSchema(person: {
  name: string;
  role?: string;
  path: string;
  image?: string;
  description?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    ...(person.role ? { jobTitle: person.role } : {}),
    ...(person.description ? { description: person.description } : {}),
    ...(person.image ? { image: `${SITE.url}${person.image}` } : {}),
    url: `${SITE.url}${person.path}`,
  };
}

/** One tag, many blocks — keeps the DOM tidy and the graph connected. */
export function JsonLd({ schema }: { schema: object | object[] }) {
  const payload = Array.isArray(schema) ? schema : [schema];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
