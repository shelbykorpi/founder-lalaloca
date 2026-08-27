"use client";

import { useEffect, useRef, useState } from "react";

/**
 * THE THRESHOLD DOORS.
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
 * THE GLOW. It is in the photograph while the doors are shut — that is the
 * point of the frame. As they part, a warm pink wash behind them widens and
 * then fades, so the light appears to come from the room rather than from a
 * filter, and the last thing to leave the screen is the colour.
 *
 * IT IS AN OVERLAY, NEVER A GATE:
 *
 *   1. Client-mount only. Server HTML has no doors, so a crawler, a reader
 *      with JS off, or a slow connection gets the shop immediately.
 *   2. The leaves are aria-hidden and nothing behind them is inert. The open
 *      control is a normal button; skipping it costs nothing.
 *   3. Once open it unmounts — no leftover stacking context, no pointer trap.
 *
 * REDUCED MOTION AND RETURNING VISITORS. Under `prefers-reduced-motion` the
 * doors never mount. Nor do they on a second visit this session — being made
 * to open the same door twice is theatre, not welcome. sessionStorage, so the
 * house is shut again tomorrow, and every access is wrapped: a browser with
 * site data blocked throws on read, and the only consequence is that the
 * doors open every time.
 */
export function ThresholdDoors() {
  const [mounted, setMounted] = useState(false);
  const [opening, setOpening] = useState(false);
  const [gone, setGone] = useState(false);
  const openRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      if (sessionStorage.getItem("founder-house-entered") === "1") return;
    } catch {
      /* Site data blocked. Show the doors; nothing depends on the record. */
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) openRef.current?.focus();
  }, [mounted]);

  /* Hold the page still only while the doors are actually shut. The scrollbar
     comes back the moment they start to move. */
  useEffect(() => {
    if (!mounted || opening) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted, opening]);

  if (!mounted || gone) return null;

  const open = () => {
    setOpening(true);
    try {
      sessionStorage.setItem("founder-house-entered", "1");
    } catch {
      /* ignored */
    }
    window.setTimeout(() => setGone(true), 2600);
  };

  /* 2200ms and a long tail on the curve: heavy doors do not snap. */
  const leaf =
    "absolute inset-y-0 w-1/2 overflow-hidden will-change-transform " +
    "[transition:transform_2200ms_cubic-bezier(0.32,0,0.12,1)]";

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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="presentation">
      {/* The room beyond: warm and pink, widening as the doors part, gone by
          the time they are off screen. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(46% 74% at 50% 42%, rgba(255,231,222,0.98) 0%, rgba(240,199,190,0.92) 22%, rgba(214,150,143,0.7) 46%, rgba(110,62,60,0.34) 70%, rgba(10,37,35,0) 88%)",
          /* Hold at full while the leaves travel, then go — the light is the
             last thing to leave, not the first. */
          opacity: opening ? 0 : 1,
          transform: opening ? "scale(1.5)" : "scale(1)",
          transition:
            "opacity 900ms ease 1500ms, transform 2400ms cubic-bezier(0.32,0,0.12,1)",
        }}
      />

      <div aria-hidden className="absolute inset-0">
        <div
          className={`${leaf} left-0`}
          style={{
            transform: opening ? "translateX(-101%)" : "translateX(0)",
            boxShadow: "36px 0 90px rgba(0,0,0,0.55)",
          }}
        >
          <div style={{ ...plate, left: 0 }} />
        </div>
        <div
          className={`${leaf} right-0`}
          style={{
            transform: opening ? "translateX(101%)" : "translateX(0)",
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
        className={`absolute inset-x-0 bottom-[8%] flex flex-col items-center px-6 text-center [transition:opacity_800ms_ease] ${
          opening ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <p
          className="display-product text-cream"
          style={{ textShadow: "0 2px 24px rgba(0,0,0,0.75)" }}
        >
          Open the door.
        </p>
        <button
          ref={openRef}
          type="button"
          onClick={open}
          className="btn btn-ghost-light mt-8 backdrop-blur-[2px]"
        >
          Enter the house
        </button>
      </div>
    </div>
  );
}
