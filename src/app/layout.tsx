import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { BagProvider } from "@/components/bag/BagProvider";
import { BagDrawer } from "@/components/bag/BagDrawer";
import { BRAND, SITE } from "@/lib/brand";
import { JsonLd, organizationSchema, websiteSchema } from "@/lib/seo";
import { Analytics } from "@/components/site/Analytics";

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
    images: [
      {
        url: "/founder-share.jpg",
        width: 1200,
        height: 1200,
        alt: "FOUNDER gold doorway monogram on the signature deep green field.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: ["/founder-share.jpg"],
  },
  robots: SITE.indexable
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="flex min-h-full flex-col">
        {/* The brand as a connected graph: who we are, and that this is a
            searchable site. Product and FAQ blocks reference the @id set here. */}
        <JsonLd schema={[organizationSchema(), websiteSchema()]} />
        <Analytics />
        <BagProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-charcoal focus:px-4 focus:py-3 focus:text-sm focus:text-shell"
          >
            Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <BagDrawer />
        </BagProvider>
      </body>
    </html>
  );
}
