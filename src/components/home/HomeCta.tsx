"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { track } from "@/lib/analytics";

/**
 * A homepage call to action that records which one was pressed
 * (GA4 custom event `home_cta`, with `cta` naming the button). The homepage
 * is a server component, so the click is the only client code it needs.
 */
export function HomeCta({
  href,
  cta,
  className,
  children,
}: {
  href: string;
  cta: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        track("home_cta", { cta });
        if (href.includes("#share")) track("story_cta", { from: `home-${cta}` });
      }}
    >
      {children}
    </Link>
  );
}
