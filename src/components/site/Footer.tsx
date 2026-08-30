import Link from "next/link";
import { FOUNDER_ASPECT, Wordmark } from "./Wordmark";
import { BRAND, FOOTER_NAV } from "@/lib/brand";
import { EmailSignup } from "./EmailSignup";

/**
 * The hall the house opens onto.
 *
 * Charcoal was the darkest thing on a cream site. On a night site it reads as
 * a lighter grey block at the foot of the page — the opposite of what a
 * footer should do — so it goes to the deepest ground the palette has and a
 * brass hairline does the separating.
 */
export function Footer() {
  return (
    <footer className="border-t border-bronze/20 bg-night-deep text-cream">
      <div className="shell grid gap-12 py-14 md:py-16 lg:grid-cols-[1.1fr_1.4fr] lg:gap-20">
        <div>
          {/* Colourway 05, Evening: Champagne Gold FOUNDER over Champagne
              Cream BEAUTY on Charcoal. It read `text-charcoal` until 11 August
              — charcoal on charcoal, an invisible logo nobody had reason to
              look for. */}
          <Wordmark
            height={150 / FOUNDER_ASPECT}
            className="text-champagne"
            beautyClassName="text-cream"
          />
          <p className="mt-4 max-w-sm font-serif text-[1.75rem] leading-tight text-cream/90">
            {BRAND.tagline}
          </p>
          <EmailSignup source="footer" />
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {FOOTER_NAV.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <h2 className="eyebrow text-cream/70">{group.heading}</h2>
              <ul className="mt-4 space-y-1">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-11 items-center text-sm text-cream/80 transition-colors hover:text-champagne"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="shell border-t border-bronze/20 py-6">
        <div className="flex flex-col gap-2 text-[0.6875rem] uppercase tracking-[0.16em] text-cream/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {BRAND.legal.name}. Cosmetic products.
          </p>
          <div className="flex flex-wrap gap-x-6">
            <Link
              href="/policies/privacy"
              className="inline-flex min-h-11 items-center hover:text-cream"
            >
              Privacy
            </Link>
            <Link
              href="/policies/terms"
              className="inline-flex min-h-11 items-center hover:text-cream"
            >
              Terms
            </Link>
            <Link
              href="/policies/accessibility"
              className="inline-flex min-h-11 items-center hover:text-cream"
            >
              Accessibility
            </Link>
          </div>
        </div>
        <p className="max-w-2xl text-[0.6875rem] leading-relaxed text-cream/65">
          {BRAND.display} is the name on your order. {BRAND.collection} is the
          name of the collection.
        </p>
      </div>
    </footer>
  );
}
