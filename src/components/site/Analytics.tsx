import Script from "next/script";

/**
 * Google Analytics 4.
 *
 * Inert until NEXT_PUBLIC_GA_ID is set, so this ships safely before the
 * property exists and switches on with one environment variable — no code
 * change, no redeploy of anything but config.
 *
 * CROSS-DOMAIN IS THE WHOLE GAME HERE. Checkout leaves this site for Shopify.
 * Without `linker`, GA4 treats the Shopify checkout as a brand-new session
 * arriving from a referral, which detaches every sale from the campaign, search
 * or page that actually earned it — you would see traffic here and revenue
 * over there with no thread between them. Listing both domains keeps the
 * client ID intact across the hop.
 *
 * The other half must be done inside Shopify: the SAME measurement ID has to be
 * installed there too, or the purchase never reaches this property at all.
 */

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/** Both hosts a single customer journey can touch. */
const LINKED_DOMAINS = ["founderbeauty.co", "founderbeauty.myshopify.com"];

export function Analytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            linker: { domains: ${JSON.stringify(LINKED_DOMAINS)}, accept_incoming: true },
            send_page_view: true
          });
        `}
      </Script>
    </>
  );
}
