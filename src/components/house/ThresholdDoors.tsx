"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { readKey } from "@/lib/houseKey";
import { track } from "@/lib/analytics";

/**
 * THE THRESHOLD — the front door of the house.
 *
 * The photograph, split down the lit gap and drawn apart. The first pass drew
 * the leaves in CSS; Shelby's render is a real room with real lacquer, real
 * brass and real fluted glass behind, and no amount of gradient work gets
 * there. So the frame itself opens.
 *
 * HOW THE SPLIT WORKS. Both halves carry the SAME background image, sized to
 * the whole viewport with `cover`. The left half pins that background to the
 * viewport's left edge and the right half to its right, so side by side they
 * reconstruct one uncut photograph — you cannot see the join because there
 * isn't one. Translate the halves outward and each takes its own half of the
 * picture with it. The source was cropped so the lit gap sits at exactly 50%
 * (it was at 47.1%); without that the leaves would part off-centre and the
 * illusion would break on the first frame.
 *
 * THE DOORS ARE PUSHED, NOT PLAYED — 12 September 2026, brief §3. Until now
 * this was a button and a 2.2-second animation: you pressed, you watched.
 * A door you watch is a video. A door you push is a door. So the leaves are
 * bound to the gesture:
 *
 *   desktop   scroll (or trackpad swipe) — every notch moves the leaves and
 *             they hold wherever you stop. Past 45% they take over and swing.
 *   phone     drag up with a thumb, same binding, same take-over.
 *   keyboard  Enter, Space, ↓ or PageDown opens them; Escape opens them too
 *             (a shut door is never a trap).
 *   pointer   ENTER THE HOUSE, for anyone who would rather press a button.
 *
 * NOTHING IS BEHIND A CURTAIN. Between the leaves there is no backdrop — the
 * real page is there, and as the doors part you are looking at the actual
 * house, not a picture of it. SHOP DIRECTLY sits under the invitation from
 * the first frame, so a woman who came to buy is one press from the shop
 * without opening anything (brief §16).
 *
 * IT IS AN OVERLAY, NEVER A GATE:
 *
 *   1. Client-mount only. Server HTML has no doors, so a crawler, a reader
 *      with JS off, or a slow connection gets the shop immediately.
 *   2. The leaves are aria-hidden and nothing behind them is inert. The open
 *      controls are ordinary buttons and links; skipping costs nothing.
 *   3. Once open it unmounts — no leftover stacking context, no pointer trap.
 *
 * REDUCED MOTION AND RETURNING VISITORS. Under `prefers-reduced-motion` the
 * doors never mount. Nor do they on a second visit this session — being made
 * to open the same door twice is theatre, not welcome. sessionStorage, so the
 * house is shut again tomorrow, and every access is wrapped: a browser with
 * site data blocked throws on read, and the only consequence is that the
 * doors open every time.
 *
 * WELCOME BACK (brief §10). If the Founder Key already has rooms in it, the
 * invitation is not "Open the door" — it is WELCOME BACK. / WE KEPT YOUR
 * ROOM., and the brass key above it turns before the leaves move. It is
 * contextual by construction: once a session, and only for a woman the house
 * has already met.
 */

/* Past this the doors are hers no longer — they swing the rest of the way. */
const COMMIT = 0.45;
/* How much of a screen-height of scrolling opens them from shut. */
const TRAVEL = 0.9;
const SWING_MS = 1500;

/**
 * WHETHER THERE IS A DOOR AT ALL, decided once per page load and cached.
 *
 * This used to be `setMounted(true)` inside an effect, which is the pattern
 * the repo's `react-hooks/set-state-in-effect` rule exists to catch: it
 * renders, then immediately renders again. It is read through
 * `useSyncExternalStore` instead — the server snapshot is "no doors", which
 * is exactly right, because the server must never emit them. The store never
 * changes after the first read, so `subscribe` has nothing to subscribe to.
 */
type Verdict = { show: boolean; known: boolean };
const NO_DOORS: Verdict = { show: false, known: false };
let verdict: Verdict | null = null;

function readVerdict(): Verdict {
  if (verdict) return verdict;
  if (typeof window === "undefined") return NO_DOORS;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    verdict = NO_DOORS;
    return verdict;
  }
  try {
    if (sessionStorage.getItem("founder-house-entered") === "1") {
      verdict = NO_DOORS;
      return verdict;
    }
  } catch {
    /* Site data blocked. Show the doors; nothing depends on the record. */
  }
  /* Does the house know her? The key is read directly rather than through the
     provider: this renders before the first route effect has run, and a
     missing or unreadable key simply means a first visit. */
  verdict = { show: true, known: readKey().roomsVisited.length > 0 };
  return verdict;
}

const noSubscribe = () => () => {};

export function ThresholdDoors() {
  const { show: mounted, known } = useSyncExternalStore(
    noSubscribe,
    readVerdict,
    () => NO_DOORS,
  );
  /* 0 shut → 1 open. Driven by the gesture, then by the swing. */
  const [progress, setProgress] = useState(0);
  const [swinging, setSwinging] = useState(false);
  const [gone, setGone] = useState(false);
  const openRef = useRef<HTMLButtonElement>(null);
  const p = useRef(0);
  const committed = useRef(false);
  const touchY = useRef<number | null>(null);

  useEffect(() => {
    if (mounted) openRef.current?.focus();
  }, [mounted]);

  const swing = useCallback(() => {
    if (committed.current) return;
    committed.current = true;
    setSwinging(true);
    setProgress(1);
    p.current = 1;
    track("threshold_open", { known });
    /* Both records, because they answer different questions: sessionStorage
       is "she has been in today", and the cached verdict is "do not build a
       door again in this page's lifetime" — without it a client-side
       navigation back to / would re-mount the doors on a woman already
       standing in the hall. */
    verdict = NO_DOORS;
    try {
      sessionStorage.setItem("founder-house-entered", "1");
    } catch {
      /* ignored */
    }
    window.setTimeout(() => setGone(true), SWING_MS + 700);
  }, [known]);

  /* The gesture. `passive: false` so a shut door can refuse the scroll —
     the page underneath must not creep while the leaves are still closed. */
  useEffect(() => {
    if (!mounted || gone) return;

    const push = (delta: number) => {
      if (committed.current) return;
      const next = Math.min(1, Math.max(0, p.current + delta / (window.innerHeight * TRAVEL)));
      p.current = next;
      setProgress(next);
      if (next >= COMMIT) swing();
    };

    const onWheel = (e: WheelEvent) => {
      if (committed.current) return;
      e.preventDefault();
      push(e.deltaY);
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY.current = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (committed.current || touchY.current === null) return;
      e.preventDefault();
      const y = e.touches[0]?.clientY ?? touchY.current;
      push((touchY.current - y) * 1.6);
      touchY.current = y;
    };
    const onKey = (e: KeyboardEvent) => {
      if (committed.current) return;
      if (["Enter", " ", "Spacebar", "ArrowDown", "PageDown", "Escape"].includes(e.key)) {
        /* Enter and Space on the button are the button's own job. */
        if ((e.key === "Enter" || e.key === " ") && document.activeElement?.tagName === "BUTTON") return;
        e.preventDefault();
        swing();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };
  }, [mounted, gone, swing]);

  /* Hold the page still only while the doors are actually shut. The scrollbar
     comes back the moment they commit. */
  useEffect(() => {
    if (!mounted || swinging) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted, swinging]);

  if (!mounted || gone) return null;

  /* No transition while she is pushing them — the leaves must sit exactly
     where she left them. The curve arrives with the swing: 1500ms and a long
     tail, because heavy doors do not snap. */
  const leaf =
    "absolute inset-y-0 w-1/2 overflow-hidden will-change-transform" +
    (swinging ? " [transition:transform_1500ms_cubic-bezier(0.32,0,0.12,1)]" : "");

  /* One viewport-wide backdrop per leaf, pinned to opposite edges. Together
     they are the single photograph; apart, they are two doors. */
  const plate: React.CSSProperties = {
    position: "absolute",
    top: 0,
    width: "100vw",
    height: "100%",
    backgroundImage: "url(/editorial/threshold-doors.webp)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  /* The invitation thins out as the gap widens; it is gone before the leaves
     clear the frame, so nothing is ever read across a moving edge. */
  const copyOpacity = swinging ? 0 : Math.max(0, 1 - progress / (COMMIT * 0.55));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="presentation">
      {/* The room beyond: warm and pink, widening as the doors part, gone by
          the time they are off screen. Between the leaves there is no
          backdrop at all — that is the real page showing through. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(46% 74% at 50% 42%, rgba(255,231,222,0.98) 0%, rgba(240,199,190,0.92) 22%, rgba(214,150,143,0.7) 46%, rgba(110,62,60,0.34) 70%, rgba(10,37,35,0) 88%)",
          /* Hold at full while the leaves travel, then go — the light is the
             last thing to leave, not the first. */
          /* It thins as the gap widens. At full strength over an open gap it
             is a pink filter over the hall; the point is light coming out of
             a door, and light does that from a crack, not from a doorway. */
          opacity: swinging ? 0 : Math.max(0, 1 - progress * 1.15),
          transform: `scale(${1 + progress * 0.5})`,
          transition: swinging
            ? "opacity 900ms ease 800ms, transform 2400ms cubic-bezier(0.32,0,0.12,1)"
            : "none",
        }}
      />

      <div aria-hidden className="absolute inset-0">
        <div
          className={`${leaf} left-0`}
          style={{
            transform: `translateX(${-progress * 101}%)`,
            boxShadow: "36px 0 90px rgba(0,0,0,0.55)",
          }}
        >
          <div style={{ ...plate, left: 0 }} />
        </div>
        <div
          className={`${leaf} right-0`}
          style={{
            transform: `translateX(${progress * 101}%)`,
            boxShadow: "-36px 0 90px rgba(0,0,0,0.55)",
          }}
        >
          <div style={{ ...plate, right: 0 }} />
        </div>
      </div>

      {/* ── The invitation ───────────────────────────────────────────────
          Low in the frame, where the caption sits in the render, so it never
          crosses the handles or the lit gap. */}
      <div
        className="absolute inset-x-0 bottom-[7%] flex flex-col items-center px-6 text-center"
        style={{
          opacity: copyOpacity,
          transition: swinging ? "opacity 700ms ease" : "none",
          pointerEvents: swinging ? "none" : undefined,
        }}
      >
        {/* The key. On a return visit it turns in the lock before anything
            else moves; on a first visit it is simply the emblem on the door. */}
        <span
          aria-hidden
          className="mb-6 block h-9 w-9 text-champagne"
          style={{
            transform: known ? "rotate(90deg)" : "none",
            transition: "transform 1100ms cubic-bezier(0.22,0.61,0.24,1) 260ms",
            filter: "drop-shadow(0 0 18px rgba(214,190,154,0.45))",
          }}
        >
          <KeyMark />
        </span>

        {known ? (
          <>
            <p
              className="display-product text-cream"
              style={{ textShadow: "0 2px 24px rgba(0,0,0,0.75)" }}
            >
              Welcome back.
            </p>
            <p className="mt-3 font-serif text-[1.15rem] text-blush">We kept your room.</p>
          </>
        ) : (
          <p
            className="display-product text-cream"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.75)" }}
          >
            Open the door.
          </p>
        )}

        <button
          ref={openRef}
          type="button"
          onClick={swing}
          className="btn btn-ghost-light mt-8 backdrop-blur-[2px]"
        >
          Enter the house
        </button>

        {/* The escape hatch, and it is never hidden: a woman who already knows
            what she wants should not have to open a door to buy. */}
        <Link
          href="/shop"
          onClick={() => {
            verdict = NO_DOORS;
            try {
              sessionStorage.setItem("founder-house-entered", "1");
            } catch {
              /* ignored */
            }
            track("threshold_shop_direct", {});
          }}
          className="mt-5 inline-flex min-h-11 items-center text-[0.625rem] uppercase tracking-[0.22em] text-cream/70 no-underline transition-colors hover:text-champagne"
        >
          Shop directly
        </Link>

        <p
          aria-hidden
          className="mt-6 text-[0.5625rem] uppercase tracking-[0.24em] text-cream/55"
        >
          {/* A phone is not scrolled, it is pushed. Both are true of these
              doors; each device is told the one it can do. */}
          <span className="sm:hidden">Or push them open</span>
          <span className="hidden sm:inline">Or scroll</span>
        </p>
      </div>
    </div>
  );
}

/* The house key, drawn — a bow, a shank, two wards, standing upright so it
   reads as a key at 36px and reads as a key TURNING when it rotates. The
   first pass drew it on the diagonal and at that size it was a magnifying
   glass. Not the F monogram: the monogram is the mark of the brand, its
   geometry is never redrawn, and this is hardware. */
function KeyMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <circle cx="12" cy="6" r="3.9" />
      <path d="M12 9.9V21" strokeLinecap="round" />
      <path d="M12 15.2h3.7M12 18.2h2.7" strokeLinecap="round" />
    </svg>
  );
}
