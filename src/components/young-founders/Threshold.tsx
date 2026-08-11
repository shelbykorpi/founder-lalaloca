"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import s from "./threshold.module.css";
import { track } from "@/lib/analytics";

/**
 * The Young Founders' Threshold.
 *
 * A pair of Founder Green doors that open into the page. It is a decoration
 * over content that is already there — the hero behind it is server-rendered
 * and in the HTML whether this ever runs or not, which is what keeps the page
 * crawlable and keeps a JavaScript failure from costing anyone the content.
 *
 * ── WHAT DECIDES WHETHER IT PLAYS ───────────────────────────────────────────
 *
 *   prefers-reduced-motion   never plays. Not a shortened version — none.
 *   first visit this session  the full 2.6s sequence (1.8s on mobile)
 *   later visits this session a 0.7s open
 *
 * Session storage, not local storage, and deliberately: the entrance is part
 * of arriving, and someone coming back next week is arriving again. A flag
 * that outlives the tab would quietly delete the thing for everyone forever
 * after one visit.
 *
 * ── WHY IT RENDERS NOTHING ON THE SERVER ────────────────────────────────────
 *
 * An overlay in the server HTML is an overlay that covers the page for anyone
 * whose JavaScript is slow, blocked or broken. Deciding on the client means a
 * possible single frame of hero before the doors appear; that is the better
 * failure. The decision runs in a layout effect so in practice it lands before
 * paint.
 */

const SEEN_KEY = "founder_young_founders_threshold_seen_v1";

const FULL_DESKTOP_MS = 2600;
const FULL_MOBILE_MS = 1800;
const SHORT_MS = 700;

/* Runs before paint on the client, and is a no-op during SSR rather than the
   "useLayoutEffect does nothing on the server" warning. */
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

type Mode = "full" | "short";

export function Threshold({ focusTargetId }: { focusTargetId: string }) {
  const [mode, setMode] = useState<Mode | null>(null);
  const [gone, setGone] = useState(false);
  const closedRef = useRef(false);
  const skipRef = useRef<HTMLButtonElement>(null);

  /* One place that ends the entrance, however it ends. Called by the timer, by
     the skip control and by unmount, and safe to call more than once — a
     half-removed overlay that still eats clicks is the worst outcome here. */
  const close = useCallback(
    (reason: "completed" | "skipped") => {
      if (closedRef.current) return;
      closedRef.current = true;
      setGone(true);
      document.body.style.overflow = "";
      track(reason === "completed" ? "young_founders_door_completed" : "young_founders_door_skipped");

      /* Hand the keyboard the page, not the top of the document. */
      const target = document.getElementById(focusTargetId);
      if (target) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    },
    [focusTargetId],
  );

  useIsoLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      /* Immediate reveal. Still recorded, so the numbers are not silently
         missing the visitors who never see the doors. */
      closedRef.current = true;
      track("young_founders_door_completed", { reduced_motion: true });
      return;
    }

    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === "1";
      window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* Private mode, or storage disabled. Play the full entrance and let it
         play again — a broken storage API is not a reason to skip the door. */
    }

    setMode(seen ? "short" : "full");
  }, []);

  useEffect(() => {
    if (!mode || gone) return;

    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const duration = mode === "short" ? SHORT_MS : mobile ? FULL_MOBILE_MS : FULL_DESKTOP_MS;

    document.body.style.overflow = "hidden";
    track("young_founders_door_started", { mode, viewport: mobile ? "mobile" : "desktop" });
    skipRef.current?.focus({ preventScroll: true });

    const timer = window.setTimeout(() => close("completed"), duration);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close("skipped");
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      /* Whatever happened — navigation, an error, a fast route change — the
         page scrolls again. */
      document.body.style.overflow = "";
    };
  }, [mode, gone, close]);

  /* ── WHY THIS IS NOT `return null` ────────────────────────────────────────
     It was, and it shipped a bug worth writing down. Next links a client
     component's CSS into the page only when that component produces server
     output. Returning null on the server meant this module's stylesheet was
     never in the document, so the overlay mounted after hydration with no
     styles at all: a plain "Skip entrance" button shoving the hero down the
     page for 2.6 seconds, on every first visit. Caught by probing the live
     build every 150ms rather than by looking at a screenshot at one moment.

     An always-rendered, display:none element is enough to get the stylesheet
     linked, and it is inert for anyone without JavaScript. */
  if (!mode || gone) return <div className={s.boot} aria-hidden />;

  const mobile = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
  const duration = mode === "short" ? SHORT_MS : mobile ? FULL_MOBILE_MS : FULL_DESKTOP_MS;

  return (
    <div
      className={`${s.overlay} ${mode === "short" ? s.short : ""}`}
      style={
        {
          "--dur": `${duration}ms`,
          "--ease": "cubic-bezier(0.22, 0.61, 0.24, 1)",
        } as React.CSSProperties
      }
      /* The doors are scenery. A screen reader should hear the page, and the
         one control that matters is outside this subtree's hidden scope. */
      role="presentation"
    >
      <div className={s.backdrop} aria-hidden />
      <div className={s.roomLight} aria-hidden />

      <div className={s.scene} aria-hidden>
        <div className={`${s.leaf} ${s.left}`}>
          <span className={s.monogram} />
        </div>
        <div className={`${s.leaf} ${s.right}`}>
          <span className={s.monogram} />
        </div>
        <div className={s.seam} />
        <div className={s.edgeLight} />
      </div>

      <button ref={skipRef} type="button" className={s.skip} onClick={() => close("skipped")}>
        Skip entrance
      </button>
    </div>
  );
}
