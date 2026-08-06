"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { notes } from "@/lib/content";
import { PRIMARY_NAV } from "@/lib/brand";
import { products } from "@/lib/products";
import { profiles } from "@/lib/profiles";

type Result = {
  href: string;
  title: string;
  kind: string;
  detail: string;
  haystack: string;
};

const index: Result[] = [
  ...products.map((product) => ({
    href: `/products/${product.slug}`,
    title: product.name,
    kind: "Serum",
    detail: `${product.category} · ${product.benefit}`,
    haystack:
      `${product.name} ${product.category} ${product.what} ${product.need} ${product.benefit} ${product.keyActive} ${product.timing}`.toLowerCase(),
  })),
  ...profiles.map((profile) => ({
    href: `/found-her/${profile.slug}`,
    title: profile.name,
    kind: "Found Her",
    detail: profile.building,
    haystack: `${profile.name} ${profile.role} ${profile.building} ${profile.standfirst}`.toLowerCase(),
  })),
  ...notes.map((note) => ({
    href: `/found-her/${note.slug}`,
    title: note.title,
    kind: "Found Her",
    detail: note.standfirst,
    haystack: `${note.title} ${note.standfirst} ${note.excerpt}`.toLowerCase(),
  })),
  ...[
    ...PRIMARY_NAV,
    { href: "/find-your-serum", label: "Which serum?" },
    { href: "/policies/shipping", label: "Shipping" },
    { href: "/policies/returns", label: "Returns" },
  ].map((item) => ({
    href: item.href,
    title: item.label,
    kind: "Page",
    detail: item.href,
    haystack: `${item.label} ${item.href}`.toLowerCase(),
  })),
];

export function SiteSearch() {
  const [query, setQuery] = useState("");
  const trimmed = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (trimmed.length < 2) return [];
    const terms = trimmed.split(/\s+/);
    return index.filter((entry) => terms.every((term) => entry.haystack.includes(term)));
  }, [trimmed]);

  return (
    <div className="shell">
      <form role="search" onSubmit={(e) => e.preventDefault()} className="max-w-2xl">
        <label htmlFor="site-search" className="eyebrow text-charcoal/70">
          Search
        </label>
        <input
          id="site-search"
          type="search"
          value={query}
          autoComplete="off"
          placeholder="Serums, stories, pages"
          onChange={(event) => setQuery(event.target.value)}
          className="mt-3 h-14 w-full border border-charcoal/25 bg-transparent px-5 font-serif text-2xl text-charcoal outline-none focus:border-bronze"
        />
      </form>

      <div aria-live="polite" className="mt-10">
        {trimmed.length < 2 ? (
          <p className="text-sm text-charcoal/75">
            Type at least two letters. Try “hyaluronic”, “morning”, or “returns”.
          </p>
        ) : results.length === 0 ? (
          <div>
            <p className="font-serif text-2xl text-charcoal">
              Nothing matched “{query.trim()}”.
            </p>
            <p className="mt-3 text-sm text-charcoal/80">
              Try a skin concern — dry, dull, tired —or{" "}
              <Link
                href="/find-your-serum"
                className="text-charcoal underline underline-offset-4 hover:text-bronze-ink"
              >
                answer three questions
              </Link>{" "}
              and we’ll point you at one.
            </p>
          </div>
        ) : (
          <>
            <p className="eyebrow text-charcoal/70">
              {results.length} {results.length === 1 ? "result" : "results"}
            </p>
            <ul className="mt-5 border-t border-charcoal/12">
              {results.map((result) => (
                <li key={result.href} className="border-b border-charcoal/12">
                  <Link
                    href={result.href}
                    className="group flex items-baseline justify-between gap-6 py-5 transition-colors hover:bg-shell md:px-3"
                  >
                    <span>
                      <span className="block font-serif text-2xl leading-tight text-charcoal">
                        {result.title}
                      </span>
                      <span className="mt-1 block text-sm text-charcoal/75">
                        {result.detail}
                      </span>
                    </span>
                    <span className="eyebrow shrink-0 text-bronze-ink">{result.kind}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
