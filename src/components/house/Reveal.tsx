"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Scroll reveal for the after-hours rooms.
 *
 * WHY THE CLASS IS ADDED AFTER MOUNT, NOT IN THE MARKUP. `.reveal` sets
 * opacity 0. If it shipped in the server HTML, anyone without JS — and any
 * crawler that does not run it — would get a blank page, and the whole
 * homepage would be invisible to search. So the server renders plain content
 * and this only dims it once it knows it can undim it.
 *
 * It also unobserves on first reveal: these sections never hide again, so a
 * live observer per section for the life of the page buys nothing.
 *
 * prefers-reduced-motion is handled in CSS rather than here, so the setting is
 * respected even if it changes after mount.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** ms. Use sparingly — a stagger over ~3 items, not a queue. */
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    /* Anything already on screen at mount is shown immediately and never
       animates — otherwise the hero fades in after the page has arrived,
       which reads as a slow site rather than a considered one. */
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      setShown(true);
      return;
    }

    setArmed(true);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`${armed ? "reveal" : ""} ${className}`.trim()}
      data-shown={shown ? "true" : "false"}
      style={delay && armed ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
