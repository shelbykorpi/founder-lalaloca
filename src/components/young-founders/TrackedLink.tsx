"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { track } from "@/lib/analytics";
import type { TrackEvent } from "@/lib/analytics";

/**
 * A link that reports itself.
 *
 * Internal links stay Next links so client navigation is preserved. External
 * links are plain anchors with the full `noopener noreferrer` pair and a
 * visually hidden note that they leave the site — this page sends people to a
 * charity's own donation page, and a link that silently replaces the tab is
 * the moment a visitor loses the thread.
 *
 * Nothing about the visitor is sent. The event name is the whole payload.
 */
export function TrackedLink({
  href,
  event,
  external = false,
  variant = "primary",
  children,
}: {
  href: string;
  event: TrackEvent;
  external?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
}) {
  const base =
    "eyebrow inline-flex min-h-[44px] items-center justify-center px-7 py-3 text-center transition-colors";
  const skin =
    variant === "primary"
      ? "bg-founder-green text-cream hover:bg-emerald"
      : variant === "secondary"
        ? "border border-founder-green text-founder-green hover:bg-founder-green hover:text-cream"
        : "border border-cream/60 text-cream hover:bg-cream hover:text-founder-green";

  const className = `${base} ${skin}`;
  const onClick = () => track(event);

  if (external) {
    return (
      <a
        href={href}
        onClick={onClick}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={className}>
      {children}
    </Link>
  );
}
