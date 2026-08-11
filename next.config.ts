import type { NextConfig } from "next";

/**
 * LEGACY PATHS FROM THE LALALOCA ERA.
 *
 * lalaloca.com now points at this site, so every URL anyone ever linked,
 * bookmarked, pinned or printed arrives here. Vercel preserves the path on the
 * way through, which means a legacy path that has no route becomes a 404 —
 * and a 404 discards whatever link equity that URL had earned.
 *
 * These map the standard Shopify and Etsy URL shapes onto their FOUNDER
 * equivalents. Every one of them is a *pattern*, not a guess at a specific
 * page: `/collections/anything` is a collection page under any Shopify theme,
 * `/pages/about` is where Shopify puts an about page. Nothing here invents a
 * slug that may never have existed.
 *
 * WHAT IS STILL MISSING, and it is the one input that would improve this most:
 * the actual list of URLs lalaloca.com used to serve. A Search Console export
 * for the old property, an old sitemap.xml, or server logs. With that list,
 * every one-to-one mapping can be made exact instead of falling back to a
 * section. Until then, section-level is the honest ceiling — and it is still
 * far better than the previous behaviour, where GoDaddy collapsed every legacy
 * URL onto the homepage.
 *
 * ORDER MATTERS. Next matches top-down and stops at the first hit, so specific
 * rules must precede their catch-alls.
 */
const legacyRedirects = [
  /* --- Shopify collection URLs --- */
  { source: "/collections", destination: "/shop", permanent: true },
  { source: "/collections/all", destination: "/shop", permanent: true },
  { source: "/collections/frontpage", destination: "/shop", permanent: true },
  { source: "/collections/serums", destination: "/shop", permanent: true },
  { source: "/collections/skincare", destination: "/shop", permanent: true },
  /* A collection page for one product goes to that product, not to /shop —
     the closest relevant replacement always beats the section index. */
  {
    source: "/collections/:collection/products/:slug",
    destination: "/products/:slug",
    permanent: true,
  },
  { source: "/collections/:collection", destination: "/shop", permanent: true },

  /* --- Shopify content pages --- */
  { source: "/pages/about", destination: "/our-story", permanent: true },
  { source: "/pages/about-us", destination: "/our-story", permanent: true },
  { source: "/pages/our-story", destination: "/our-story", permanent: true },
  { source: "/pages/contact", destination: "/our-story", permanent: true },
  { source: "/pages/faq", destination: "/shop", permanent: true },
  { source: "/pages/shipping", destination: "/policies/shipping", permanent: true },
  { source: "/pages/returns", destination: "/policies/returns", permanent: true },
  { source: "/pages/privacy-policy", destination: "/policies/privacy", permanent: true },
  { source: "/pages/terms-of-service", destination: "/policies/terms", permanent: true },
  { source: "/pages/:slug", destination: "/", permanent: true },

  /* --- Shopify's own policy URLs, which are fixed slugs --- */
  { source: "/policies/refund-policy", destination: "/policies/returns", permanent: true },
  { source: "/policies/privacy-policy", destination: "/policies/privacy", permanent: true },
  { source: "/policies/terms-of-service", destination: "/policies/terms", permanent: true },
  {
    source: "/policies/shipping-policy",
    destination: "/policies/shipping",
    permanent: true,
  },

  /* --- Shopify blog URLs: /blogs/<blog>/<article> --- */
  { source: "/blogs/:blog/:article", destination: "/found-her", permanent: true },
  { source: "/blogs/:blog", destination: "/found-her", permanent: true },

  /* --- Cart and account: these belong to Shopify now, not to this site --- */
  { source: "/cart", destination: "/shop", permanent: false },
  { source: "/account/login", destination: "/account", permanent: true },
  { source: "/account/register", destination: "/account", permanent: true },

  /* --- Marketplace habits: people type /shop-now, /store, /products --- */
  { source: "/store", destination: "/shop", permanent: true },
  { source: "/shop-now", destination: "/shop", permanent: true },
  { source: "/products", destination: "/shop", permanent: true },
  { source: "/serums", destination: "/shop", permanent: true },
  { source: "/lalaloca", destination: "/shop", permanent: true },
];

const nextConfig: NextConfig = {
  /* Discloses the framework and version to anyone scanning. No SEO effect;
     no reason to advertise it either. */
  poweredByHeader: false,

  images: {
    /**
     * AVIF first, WebP as the fallback.
     *
     * This is the cheapest Core Web Vitals win available on a site this
     * image-heavy. AVIF typically lands 30–50% smaller than WebP at the same
     * perceptual quality, and LCP here is almost always an image — the hero,
     * or the first door on /shop. Next negotiates by Accept header, so
     * browsers without AVIF support silently get WebP.
     */
    formats: ["image/avif", "image/webp"],
    /* Optimised variants are cached for a year rather than the 60-second
       default, so a returning visitor and a repeat crawl do not pay to
       re-encode an image that has not changed. */
    minimumCacheTTL: 31_536_000,
  },

  async redirects() {
    return [
      /* Editorial moved under FOUND HER. Product URLs are unchanged. */
      { source: "/women", destination: "/found-her", permanent: true },
      { source: "/journal", destination: "/found-her", permanent: true },
      /* Share Your Story folded into Found Her; the fragment lands arrivals
         on the form itself, not the top of the archive. */
      { source: "/share-your-story", destination: "/found-her#share", permanent: true },
      /* Previous journal slugs, mapped to the pieces that replaced them. */
      {
        source: "/journal/the-moment-before",
        destination: "/found-her/the-ten-minutes-before",
        permanent: true,
      },
      { source: "/journal/quiet-wins", destination: "/found-her/nobody-clapped", permanent: true },
      {
        source: "/journal/notes-between-women",
        destination: "/found-her/what-she-said-once",
        permanent: true,
      },
      { source: "/journal/:slug", destination: "/found-her", permanent: true },
      { source: "/prelaunch", destination: "/", permanent: true },
      ...legacyRedirects,
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          /**
           * HSTS. Tells the browser to use HTTPS for this host for a year
           * without asking, which removes the initial HTTP request on every
           * later visit — one fewer redirect hop for both people and crawlers.
           *
           * `preload` is left OFF deliberately. Submitting to the preload list
           * is effectively irreversible for months and applies to every
           * subdomain forever; it is not something to enable by side effect
           * while a domain migration is still settling.
           */
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          /* Stops a browser from second-guessing a declared content type —
             which is how a .txt or .xml endpoint ends up being interpreted as
             something executable. */
          { key: "X-Content-Type-Options", value: "nosniff" },
          /**
           * Send the full URL to our own origin and the origin only to
           * third parties. This is what keeps referrer data intact in GA4 and
           * in Search Console's referral reporting; the stricter
           * `no-referrer` blinds your own analytics along with everyone else's.
           */
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          /* No feature here needs any of these. Denying them is free. */
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
      {
        /* Feeds and the AI brief change when the catalogue changes, which is
           rarely. An hour at the edge, a day in shared caches, and stale
           content may be served for a further day while it revalidates —
           so a crawler never waits on a cold origin. */
        source: "/:file(llms.txt|feed/products.xml|feed/found-her.xml)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
