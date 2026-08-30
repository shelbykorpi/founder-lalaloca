import type { Metadata } from "next";
import { PageIntro } from "@/components/site/PageIntro";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe";
import { UnsubscribeForm } from "./UnsubscribeForm";

/**
 * The unsubscribe landing page.
 *
 * NOINDEX, and not in the sitemap. It is reachable only from a signed link in
 * an email; a crawler indexing it would put "unsubscribe" in search results for
 * the brand, and there is nothing here for anyone who did not arrive from an
 * email.
 *
 * The page confirms rather than acts — see `api/unsubscribe/route.ts` for why a
 * GET must never remove anyone.
 */
export const metadata: Metadata = {
  title: "Unsubscribe",
  description: "Stop receiving marketing email from FOUNDER.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/unsubscribe" },
};

export const dynamic = "force-dynamic";

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t } = await searchParams;
  const email = t ? verifyUnsubscribeToken(t) : null;

  return (
    <>
      {/* Someone lands here from an email already wanting out, so every
          state has to be unmistakable, not just legible. The intro opens
          dark like the header above it; the decision itself — the form, the
          broken-link fallback — moves to a paper panel below rather than
          living as cream-on-cream text inside a section that used to be the
          whole page, so it reads as clearly as the account and search pages
          this pass converted the same way. */}
      <PageIntro
        eyebrow="Founding List"
        title={email ? "Leaving the list" : "That link didn’t work"}
        lede={
          email
            ? "No hard feelings and no survey. One press and it’s done."
            : "The link may have been broken by your email client, or it may have expired if we’ve since rotated our keys."
        }
        tone="dark"
      />
      <section className="section bg-cream pt-4">
        <div className="shell">
          {email && t ? (
            <UnsubscribeForm token={t} email={email} />
          ) : (
            <p className="max-w-md text-sm leading-relaxed text-charcoal/80">
              Reply to any email from us with the word “unsubscribe” and a person
              will take you off by hand. That route always works and it does not
              depend on this page.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
