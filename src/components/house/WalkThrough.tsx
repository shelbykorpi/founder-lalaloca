"use client";

import { useCallback, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

/**
 * WALKING THROUGH A DOOR — the room transition (brief §13).
 *
 * "When entering a new room, the previous doorway could expand toward the
 * camera and become the frame of the next scene." That is exactly what this
 * does, and nothing more. Press a door: the room seen through its opening
 * grows from the opening's own rectangle until it fills the viewport, over
 * --motion-room, and then the route changes. The page that arrives opens on
 * the same room, so the picture you walked into is the picture you are
 * standing in.
 *
 * It is an overlay on top of a normal link. The href is a real href; a
 * modifier-click, a middle-click, a crawler, a reader with JavaScript off and
 * a person with reduced motion all get an ordinary navigation. The overlay
 * unmounts with the page it was born on, so there is nothing to clean up on
 * arrival and nothing to strand the back button.
 */
export type WalkTarget = {
  href: string;
  /** The room seen through the door — what grows to fill the frame. */
  image: string;
  alt: string;
  /** The plaque, said once on the way through. */
  label: string;
};

type Frame = { top: number; left: number; width: number; height: number };

export function useWalkThrough(): {
  walk: (event: MouseEvent<HTMLAnchorElement>, opening: HTMLElement | null, target: WalkTarget) => void;
  layer: ReactNode;
} {
  const router = useRouter();
  const [going, setGoing] = useState<{ target: WalkTarget; from: Frame } | null>(null);
  const [expanded, setExpanded] = useState(false);
  const busy = useRef(false);

  const walk = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, opening: HTMLElement | null, target: WalkTarget) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      if (busy.current) {
        event.preventDefault();
        return;
      }
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || !opening) return; /* the link does its own job */
      event.preventDefault();
      busy.current = true;
      const r = opening.getBoundingClientRect();
      setGoing({ target, from: { top: r.top, left: r.left, width: r.width, height: r.height } });
      /* Two frames so the small frame paints once before it grows. */
      requestAnimationFrame(() => requestAnimationFrame(() => setExpanded(true)));
      const ms = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--motion-room"), 10) || 900;
      window.setTimeout(() => router.push(target.href), ms + 120);
    },
    [router],
  );

  const layer =
    going && typeof document !== "undefined"
      ? createPortal(
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[80]"
            style={{
              background: expanded ? "rgba(9,23,18,0.35)" : "rgba(9,23,18,0)",
              transition: "background var(--motion-room) var(--ease-house)",
            }}
          >
            <div
              className="absolute overflow-hidden"
              style={{
                top: expanded ? 0 : going.from.top,
                left: expanded ? 0 : going.from.left,
                width: expanded ? "100vw" : going.from.width,
                height: expanded ? "100vh" : going.from.height,
                transition:
                  "top var(--motion-room) var(--ease-house), left var(--motion-room) var(--ease-house), width var(--motion-room) var(--ease-house), height var(--motion-room) var(--ease-house)",
                willChange: "top, left, width, height",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- a one-shot overlay on an image the page already has cached; next/image would fetch a new candidate mid-transition */}
              <img
                src={going.target.image}
                alt=""
                className="h-full w-full object-cover"
                style={{
                  objectPosition: "50% 45%",
                  transform: expanded ? "scale(1)" : "scale(1.08)",
                  transition: "transform var(--motion-room) var(--ease-house)",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(180deg, rgba(9,23,18,0) 50%, rgba(9,23,18,0.72) 100%)",
                  opacity: expanded ? 1 : 0,
                  transition: "opacity var(--motion-room) var(--ease-house)",
                }}
              />
              <p
                className="room-label absolute bottom-[12%] left-1/2 -translate-x-1/2 whitespace-nowrap text-cream"
                style={{
                  opacity: expanded ? 1 : 0,
                  transition: "opacity var(--motion-reveal) var(--ease-house) 400ms",
                }}
              >
                {going.target.label}
              </p>
            </div>
          </div>,
          document.body,
        )
      : null;

  return { walk, layer };
}
