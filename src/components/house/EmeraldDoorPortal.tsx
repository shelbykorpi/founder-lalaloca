"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * THE EMERALD DOORS — the one door in the house, drawn once.
 *
 * Every architectural door on the site is this component: deep FOUNDER
 * emerald (`--color-founder-green` into `--color-emerald-deep`), antique-brass
 * beading and hardware (`--color-bronze`), and the gold F on each leaf painted
 * from the actual monogram asset — `/brand/founder-f-monogram.svg` through a
 * CSS mask — never a typed letter. Through the gap: the next room, as a real
 * photograph, never a pink field. Desert pink only ever arrives as light.
 *
 * It is a real link. Hover or focus eases the leaves a few degrees; pressing
 * swings them open (≈1.4 s), lets the camera drift forward, then navigates.
 * `prefers-reduced-motion` skips straight to the destination.
 */
const OPEN_MS = 1400;

export function EmeraldDoorPortal({
  href,
  through,
  throughAlt,
  label,
  eyebrow,
  className = "",
  priority = false,
}: {
  href: string;
  /** The next room, seen through the doorway. */
  through: string;
  throughAlt: string;
  /** The destination, as the link's visible name. */
  label: string;
  eyebrow?: string;
  className?: string;
  priority?: boolean;
}) {
  const router = useRouter();
  const [state, setState] = useState<"closed" | "ajar" | "opening">("closed");
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const go = useCallback(() => {
    if (href.startsWith("/#") || href.startsWith("#")) {
      const id = href.slice(href.indexOf("#") + 1);
      const onThisPage = window.location.pathname === "/" || href.startsWith("#");
      if (onThisPage) {
        const node = document.getElementById(id);
        if (node) {
          node.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.replaceState(null, "", `#${id}`);
          return;
        }
      }
    }
    router.push(href);
  }, [href, router]);

  const onClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    /* Let modified clicks (new tab, etc.) behave like any link. */
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    if (state === "opening") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      go();
      return;
    }
    setState("opening");
    timer.current = window.setTimeout(go, OPEN_MS);
  };

  const opening = state === "opening";
  const ajar = state === "ajar";

  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={() => state === "closed" && setState("ajar")}
      onMouseLeave={() => state === "ajar" && setState("closed")}
      onFocus={() => state === "closed" && setState("ajar")}
      onBlur={() => state === "ajar" && setState("closed")}
      aria-label={`${label} — open the doors`}
      className={`door-portal group relative block overflow-hidden bg-night-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne ${className}`}
      data-state={state}
    >
      {/* The next room, behind the doors. */}
      <span className="absolute inset-0 block">
        <Image
          src={through}
          alt={throughAlt}
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          sizes="(max-width: 768px) 100vw, 60vw"
          className="door-portal-through object-cover"
          style={{
            transform: opening ? "scale(1.08)" : ajar ? "scale(1.03)" : "scale(1)",
          }}
        />
        {/* Warm room light spilling through the gap — the pink and the brass
            come from the picture, so this only lifts it. */}
        <span
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_45%,rgba(216,167,160,0.3)_0%,rgba(216,167,160,0.08)_40%,rgba(7,19,15,0)_70%)]"
        />
      </span>

      {/* The frame: brass casing and a shadowed reveal, so the leaves hang in
          a wall rather than floating on the photograph. */}
      <span aria-hidden className="door-portal-casing absolute inset-0 block" />

      {/* Two leaves, hinged at the outer edges. */}
      <span aria-hidden className="absolute inset-0 block [perspective:1600px]">
        <span className={`door-leaf door-leaf-left ${ajar ? "is-ajar" : ""} ${opening ? "is-open" : ""}`}>
          <span className="door-panel door-panel-top" />
          <span className="door-panel door-panel-bottom" />
          <span className="door-monogram" />
          <span className="door-handle door-handle-left" />
        </span>
        <span className={`door-leaf door-leaf-right ${ajar ? "is-ajar" : ""} ${opening ? "is-open" : ""}`}>
          <span className="door-panel door-panel-top" />
          <span className="door-panel door-panel-bottom" />
          <span className="door-monogram" />
          <span className="door-handle door-handle-right" />
        </span>
      </span>

      {/* The destination, written on the threshold. */}
      <span className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-2 px-6 pb-7 text-center">
        {eyebrow && <span className="room-label">{eyebrow}</span>}
        <span
          className="font-serif text-[clamp(1.5rem,2.6vw,2.25rem)] leading-tight text-cream"
          style={{ textShadow: "0 2px 24px rgba(0,0,0,0.8)" }}
        >
          {label}
        </span>
        <span className="hairline mt-1 text-cream transition-colors group-hover:text-rose">
          {opening ? "After you." : "Push. It isn’t locked."}
        </span>
      </span>
    </a>
  );
}
