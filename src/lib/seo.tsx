import { BRAND, SITE } from "./brand";
import type { Product } from "./products";
import type { ProductReviews } from "./reviews";

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

/**
 * Social and marketplace profiles, as a comma-separated env var.
 *
 *   NEXT_PUBLIC_SAME_AS="https://instagram.com/…,https://lalaloca.etsy.com/…"
 *
 * `sameAs` is how a search engine confirms that the Instagram account, the Etsy
 * shop and this website are one entity rather than three brands with similar
 * names. For FOUNDER specifically it is the mechanism that ties the LALALOCA
 * Etsy history — real sales, real reviews, real age — to the new domain. It is
 * the single highest-value line in this file, and it is empty until the URLs
 * are supplied. They are not guessed at here.
 */
const SAME_AS = (process.env.NEXT_PUBLIC_SAME_AS ?? "")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: BRAND.legal.name,
    alternateName: [BRAND.display, BRAND.collection],
    url: SITE.url,
    logo: `${SITE.url}/icon.png`,
    image: `${SITE.url}/opengraph-image`,
    description: SITE.description,
    slogan: BRAND.tagline,
    founder: { "@type": "Person", name: "Shelby Korpi" },
    /* States the hierarchy as data: this company owns that collection. Without
       it an engine sees two names on one site and has to guess which is the
       company — and it guesses wrong often enough to matter. */
    brand: { "@id": `${SITE.url}/#brand-lalaloca` },
    knowsAbout: [
      "skincare",
      "hyaluronic acid serum",
      "vitamin C serum",
      "collagen firming serum",
    ],
    ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
    ...(CONTACT_EMAIL
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            email: CONTACT_EMAIL,
            areaServed: "US",
            availableLanguage: "English",
          },
        }
      : {}),
  };
}

/**
 * LALALOCA as its own node.
 *
 * The brand hierarchy — FOUNDER the company, LALALOCA the collection, FOUND HER
 * the editorial — is stated in prose all over the site, and prose is exactly
 * what an answer engine paraphrases badly. A `Brand` with a stable `@id`, owned
 * by the Organization and referenced by every Product, removes the ambiguity:
 * there is one company, one product line, and the products belong to the line.
 */
export function brandSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Brand",
    "@id": `${SITE.url}/#brand-lalaloca`,
    name: BRAND.collection,
    alternateName: BRAND.collectionFull,
    description: `${BRAND.structure} ${BRAND.collectionFull} is its skincare line: three serums, 50 ml each.`,
    url: `${SITE.url}/shop`,
    logo: `${SITE.url}/icon.png`,
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

/**
 * `reviews` is optional and comes from lib/reviews.ts, which is empty. When it
 * is null — which is today — no rating markup is emitted at all. That is not a
 * limitation to work around: a rating in the schema that no customer produced
 * is fraud, draws a manual penalty, and would cost more than every rich result
 * it could win. The function cannot be called in a way that invents one.
 */
export function productSchema(product: Product, reviews?: ProductReviews | null) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE.url}/products/${product.slug}/#product`,
    name: product.name,
    description: product.what,
    category: product.category,
    image: `${SITE.url}${product.bottle}`,
    sku: product.slug,
    /* Reference, not a fresh literal — so all three products and the brand node
       resolve to one entity instead of three lookalike strings. */
    brand: { "@id": `${SITE.url}/#brand-lalaloca` },
    size: product.size,
    audience: { "@type": "PeopleAudience", suggestedGender: "female" },
    ...(reviews && reviews.count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: reviews.average,
            reviewCount: reviews.count,
            bestRating: 5,
            worstRating: 1,
          },
          /* A handful of individual reviews alongside the aggregate. Google
             wants at least one `Review` node to show star ratings reliably,
             and a real excerpt is more persuasive in a result than a number. */
          review: reviews.items.slice(0, 5).map((item) => ({
            "@type": "Review",
            reviewRating: { "@type": "Rating", ratingValue: item.rating, bestRating: 5 },
            author: { "@type": "Person", name: item.author },
            datePublished: item.published,
            reviewBody: item.body,
          })),
        }
      : {}),
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
 * The three-bottle set.
 *
 * It is a real SKU at a real price with a working buy button, and until now it
 * was the only thing on the site you could purchase that no search engine knew
 * existed — it has no page of its own, so nothing described it as a product.
 * Marking it up on /shop makes the highest-value order in the store eligible
 * for a price-carrying result.
 *
 * `isRelatedTo` rather than `isSimilarTo`: these are its components, not
 * alternatives to it. Getting that backwards invites Google to show the set as
 * a competitor to its own contents.
 */
export function setSchema(set: {
  name: string;
  detail: string;
  price: number;
  image: string;
}, members: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE.url}/shop/#trio`,
    name: `${BRAND.collectionFull} — ${set.name}`,
    description: `${set.detail}: ${members.map((p) => p.name).join(", ")}.`,
    image: `${SITE.url}${set.image}`,
    sku: "lalaloca-trio",
    brand: { "@id": `${SITE.url}/#brand-lalaloca` },
    isRelatedTo: members.map((product) => ({
      "@id": `${SITE.url}/products/${product.slug}/#product`,
    })),
    offers: {
      "@type": "Offer",
      price: set.price.toFixed(2),
      priceCurrency: "USD",
      url: `${SITE.url}/shop`,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${SITE.url}/#organization` },
      shippingDetails: US_SHIPPING,
    },
  };
}

/**
 * The FOUND HER archive as a list of real articles.
 *
 * An index page of links is, to a crawler, a page of links. Declaring it as an
 * ItemList of Articles is what makes the archive itself a recognised editorial
 * hub rather than navigation — which is the difference between the section
 * accruing topical authority and the individual stories each fending for
 * themselves.
 */
export function editorialListSchema(
  entries: { title: string; path: string; description: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: BRAND.editorial,
    numberOfItems: entries.length,
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE.url}${entry.path}`,
      name: entry.title,
    })),
  };
}

/** /our-story, typed. Cheap, and it is the page an engine reads to answer
    "who is behind this brand" — worth being explicit about what it is. */
export function aboutPageSchema(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE.url}/our-story/#about`,
    name: `About ${BRAND.display}`,
    description,
    url: `${SITE.url}/our-story`,
    isPartOf: { "@id": `${SITE.url}/#website` },
    about: { "@id": `${SITE.url}/#organization` },
    primaryImageOfPage: `${SITE.url}/opengraph-image`,
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
