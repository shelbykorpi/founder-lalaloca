"use client";

import { useEffect, useRef, useState } from "react";

/**
 * THE THRESHOLD DOORS.
 *
 * Two Founder Green leaves closed across the homepage hero. ENTER THE HOUSE
 * draws them apart, slowly, and the room behind gains warmth as they go.
 *
 * DRAWN, NOT PHOTOGRAPHED. The leaves are CSS: lacquer built from layered
 * gradients, mouldings from inset shadows, brass handles and an F monogram in
 * Antique Gold. A photograph of a door cannot open, and a video would cost
 * more than the whole page. Everything here is one paint.
 *
 * IT IS AN OVERLAY, NEVER A GATE. Three rules keep it from becoming one:
 *
 *   1. It mounts on the client only. Server HTML has no doors at all, so a
 *      crawler, a reader with JS off, or a slow connection gets the hero
 *      immediately — the doors can never hide the shop.
 *   2. The panel is aria-hidden and the content behind it is never inert. A
 *      screen-reader or keyboard user reads the hero in DOM order and the
 *      doors simply are not in their way; the open control is offered to them
 *      as a normal button, and skipping it costs nothing.
 *   3. Once opened it unmounts. No stacking context left over the page, no
 *      pointer-events trap, nothing to intercept the first tap on a product.
 *
 * REDUCED MOTION AND RETURNING VISITORS. If the reader asks for reduced
 * motion the doors never mount. If they have already come through this
 * session, they do not mount again — being made to open the same door twice
 * is theatre, not welcome. sessionStorage rather than localStorage so the
 * house is closed again tomorrow, and every access wrapped: a browser with
 * site data blocked throws on read, and the failure mode is simply that the
 * doors open every visit.
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

  /* Lock the page behind the doors only while they are actually shut — and
     put the scrollbar back the moment they start to move, so the reader is
     never scrolled to a stop mid-gesture. */
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
    window.setTimeout(() => setGone(true), 2200);
  };

  const leaf =
    "absolute inset-y-0 w-1/2 will-change-transform " +
    "[transition:transform_1800ms_cubic-bezier(0.33,0,0.1,1)]";

  /* Lacquer: a vertical sheen over the flat field, plus one soft highlight
     where a light would fall on a painted surface. */
  const lacquer =
    "linear-gradient(96deg, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.18) 46%, rgba(0,0,0,0.34) 100%), " +
    "radial-gradient(120% 60% at 50% 8%, rgba(214,190,154,0.10) 0%, transparent 62%), " +
    "linear-gradient(#164d49, #10403c 58%, #0a2523)";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="presentation">
      {/* ── The leaves ─────────────────────────────────────────────────── */}
      <div aria-hidden className="absolute inset-0">
        <div
          className={`${leaf} left-0`}
          style={{
            background: lacquer,
            transform: opening ? "translateX(-101%)" : "translateX(0)",
            boxShadow: "inset -1px 0 0 rgba(176,138,100,0.45), 40px 0 90px rgba(0,0,0,0.5)",
          }}
        >
          <Panels side="left" />
        </div>
        <div
          className={`${leaf} right-0`}
          style={{
            background: lacquer,
            transform: opening ? "translateX(101%)" : "translateX(0)",
            boxShadow: "inset 1px 0 0 rgba(176,138,100,0.45), -40px 0 90px rgba(0,0,0,0.5)",
          }}
        >
          <Panels side="right" />
        </div>

        {/* The sliver of Desert Pink at the join — the light already on in the
            room behind, before anything opens. */}
        <span
          className="absolute inset-y-0 left-1/2 -translate-x-1/2 [transition:opacity_1200ms_ease,width_1800ms_cubic-bezier(0.33,0,0.1,1)]"
          style={{
            width: opening ? "38vw" : "4px",
            opacity: opening ? 0 : 1,
            background:
              "linear-gradient(90deg, transparent, rgba(216,167,160,0.7) 38%, rgba(234,211,195,0.95) 50%, rgba(216,167,160,0.7) 62%, transparent)",
            filter: "blur(0.5px)",
          }}
        />
      </div>

      {/* ── The invitation ─────────────────────────────────────────────── */}
      <div
        className={`absolute inset-x-0 top-[16%] flex flex-col items-center px-6 text-center [transition:opacity_700ms_ease] ${
          opening ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <p className="room-label">FOUNDER</p>
        <p className="display-house mt-7 text-cream">
          <span className="block">Open the Door.</span>
          <span className="block">The Room Is Yours.</span>
        </p>
        <button
          ref={openRef}
          type="button"
          onClick={open}
          className="btn btn-ghost-light mt-12"
        >
          Enter the house
        </button>
      </div>
    </div>
  );
}

/** Mouldings, hardware and the monogram. Pure decoration, hence aria-hidden above. */
function Panels({ side }: { side: "left" | "right" }) {
  /* On the face of the leaf, a quarter in from its outer edge — hardware
     placement, not a logo lockup at the join. */
  const monogram = side === "left" ? "left-[22%]" : "right-[22%]";
  return (
    <>
      {/* Two recessed panels per leaf, the proportion of a real six-panel door
          reduced to its two largest members. */}
      <span
        className="absolute inset-x-[12%] top-[9%] h-[38%] rounded-[2px]"
        style={{
          boxShadow:
            "inset 0 0 0 1px rgba(176,138,100,0.34), inset 0 3px 18px rgba(0,0,0,0.55), inset 0 -1px 0 rgba(214,190,154,0.14), 0 1px 0 rgba(214,190,154,0.12)",
        }}
      />
      <span
        className="absolute inset-x-[12%] bottom-[9%] h-[38%] rounded-[2px]"
        style={{
          boxShadow:
            "inset 0 0 0 1px rgba(176,138,100,0.34), inset 0 3px 18px rgba(0,0,0,0.55), inset 0 -1px 0 rgba(214,190,154,0.14), 0 1px 0 rgba(214,190,154,0.12)",
        }}
      />

      {/* The F, used as hardware rather than a logo: one per leaf, small, at
          eye height, in Antique Gold. */}
      <span
        className={`absolute top-[46%] ${monogram} font-serif text-[clamp(1.75rem,3vw,3rem)] font-light leading-none`}
        style={{ color: "rgba(176,138,100,0.75)", textShadow: "0 1px 0 rgba(0,0,0,0.5)" }}
      >
        F
      </span>

      {/* The handle: a brass lever on a backplate, at the meeting stile. */}
      <span
        className={`absolute top-1/2 -translate-y-1/2 ${side === "left" ? "right-3 md:right-5" : "left-3 md:left-5"}`}
      >
        <span
          className="block h-16 w-[10px] rounded-[3px] md:h-20 md:w-3"
          style={{
            background:
              "linear-gradient(90deg, #7d5f3d, #d6be9a 38%, #b08a64 62%, #6d5133)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.55)",
          }}
        />
        <span
          className={`absolute top-1/2 h-[6px] w-9 -translate-y-1/2 rounded-[3px] md:h-2 md:w-11 ${
            side === "left" ? "right-full mr-[2px]" : "left-full ml-[2px]"
          }`}
          style={{
            background: "linear-gradient(180deg, #d6be9a, #b08a64 55%, #7d5f3d)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
          }}
        />
      </span>
    </>
  );
}
