import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { BagProvider } from "@/components/bag/BagProvider";
import { BagDrawer } from "@/components/bag/BagDrawer";
import { BRAND, SITE } from "@/lib/brand";
import { JsonLd, brandSchema, organizationSchema, websiteSchema } from "@/lib/seo";
import { Analytics } from "@/components/site/Analytics";
import { WebVitals } from "@/components/site/WebVitals";
import { Concierge } from "@/components/concierge/Concierge";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s | ${BRAND.display}` },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    siteName: BRAND.display,
    title: SITE.title,
    description: SITE.description,
    type: "website",
    url: SITE.url,
  },
  twitter: { card: "summary_large_image", title: SITE.title, description: SITE.description },
  robots: SITE.indexable
    ? {
        index: true,
        follow: true,
        /* max-image-preview:large is what makes Google use a full-size image in
           Discover and in image-rich results rather than a thumbnail. There is
           no downside for a brand that wants its photography seen. */
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      }
    : { index: false, follow: false, nocache: true },
  /**
   * Ownership proofs. Each is a token from the relevant console, set as an
   * environment variable so the value can change without a code review.
   *
   * DNS TXT verification is better than a meta tag where it is offered, because
   * it survives a rewrite of this file and covers every subdomain at once. These
   * are the fallback, and the only option Bing gives without a DNS record.
   */
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ||
    process.env.NEXT_PUBLIC_PINTEREST_SITE_VERIFICATION
      ? {
          other: {
            ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
              ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
              : {}),
            ...(process.env.NEXT_PUBLIC_PINTEREST_SITE_VERIFICATION
              ? { "p:domain_verify": process.env.NEXT_PUBLIC_PINTEREST_SITE_VERIFICATION }
              : {}),
          },
        }
      : {}),
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="flex min-h-full flex-col">
        {/* The brand as a connected graph: who we are, what the collection is
            called, and that this is a searchable site. Product, FAQ and Article
            blocks on individual pages reference the @ids set here rather than
            restating them, so the whole site resolves to one entity. */}
        <JsonLd schema={[organizationSchema(), brandSchema(), websiteSchema()]} />
        <Analytics />
        {/* Field data from the first visitor, rather than waiting months for
            CrUX to reach a reporting quorum. Inert without a GA4 ID. */}
        <WebVitals />
        <BagProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-bronze focus:px-4 focus:py-3 focus:text-sm focus:text-night"
          >
            Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <BagDrawer />
          {/* Outside <main> on purpose: it is a fixed overlay available on every
              page, not page content, and putting it in the main landmark would
              have a screen reader announce it as part of whatever she is
              reading. */}
          <Concierge />
        </BagProvider>
      </body>
    </html>
  );
}
