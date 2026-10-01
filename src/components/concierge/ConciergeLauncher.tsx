"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/analytics";

export const CONCIERGE_OPEN_EVENT = "founder:open-concierge";

export function ConciergeLauncher({
  children = "Ask the concierge",
  className = "hairline text-cream",
  source = "site",
}: {
  children?: ReactNode;
  className?: string;
  source?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        track("concierge_open", { source });
        window.dispatchEvent(new CustomEvent(CONCIERGE_OPEN_EVENT, { detail: { source } }));
      }}
    >
      {children}
    </button>
  );
}
