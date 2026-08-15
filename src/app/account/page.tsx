import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/site/PageIntro";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Account",
  description: "Track an order using the link in your confirmation email.",
  alternates: { canonical: "/account" },
  /**
   * robots.txt already disallows this path, but a disallow only asks a crawler
   * not to *fetch* the page — a URL that is linked from the footer can still be
   * indexed on the strength of those links, showing up as a bare title with no
   * description. A noindex on the page itself is what actually keeps it out,
   * and the two work together: crawlers that respect the disallow never see it,
   * and any that fetch it anyway are told plainly.
   */
  robots: { index: false, follow: true },
};

export default function AccountPage() {
  return (
    <>
      <PageIntro
        eyebrow="Account"
        title="There’s nothing to sign into."
        lede="You don’t need an account to order, and we’d rather not ask you to make one."
      />

      <section className="section bg-cream pt-4">
        <div className="shell">
          <div className="card-quiet max-w-xl p-8 md:p-10">
            <p className="text-sm leading-relaxed text-charcoal/85">
              Checkout is guest checkout. No password to invent, no account to forget.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-charcoal/85">
              <strong className="font-medium">Tracking an order?</strong> Your
              confirmation email has a link to the live order status page — that’s the
              same information a login would show you, without the login. Can’t find the
              email, or need to change an order? Write to{" "}
              <a href={CONTACT_MAILTO} className="link-underline text-charcoal">
                {CONTACT_EMAIL}
              </a>{" "}
              and a person will answer.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-charcoal/85">
              Payment is handled on Shopify’s secure checkout. No card details are ever
              collected on this site.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="btn btn-dark">
                Shop the collection
              </Link>
              <Link href="/find-your-serum" className="btn btn-outline">
                Which serum?
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
