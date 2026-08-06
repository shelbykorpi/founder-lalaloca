"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion, useHasHover } from "./useMotionPrefs";
import { track } from "@/lib/analytics";

const OPEN_MS = 900;
/** How long the walk-through runs before the shop page takes over. */
const WALK_MS = 1000;
const NAV_MS = 940;

/**
 * The entrance to the shop: black lacquered doors under a lit fanlight,
 * between two brass sconces.
 *
 * HOW THIS IS BUILT
 * -----------------
 * The scene is a photograph, but the doors still open. Three images:
 *
 *   door-scene.webp        the room — wall, pilasters, fanlight, sconces, and
 *                          a dark warm interior painted in behind the doorway
 *   door-leaf-left.webp    the left door, cut out at the centre seam
 *   door-leaf-right.webp   the right door
 *
 * The leaves are positioned over the scene at the exact fractions of the
 * photograph they were cut from (see LEAF below) and rotated on their outer
 * hinges. Because they are separate layers, swinging them reveals the interior
 * that was painted behind them.
 *
 * IF YOU REPLACE THE PHOTOGRAPH: re-cut the leaves at the same seam and update
 * LEAF with the new fractions, or the doors will sit off their hinges.
 *
 * It is a real link first — it works without JavaScript, and middle-click,
 * cmd-click and the keyboard all behave normally. When the pointer is a mouse
 * we intercept the click, swing the doors, and navigate as they finish. With
 * reduced motion the link is left alone and simply navigates.
 */

/** Where the doors sit inside the photograph, as fractions of its width/height. */
const LEAF = {
  top: "22.92%",
  height: "72.74%",
  width: "20.22%",
  leftX: "30.05%",
  rightX: "50.27%",
} as const;

export function EntranceDoor() {
  const router = useRouter();
  const reduced = usePrefersReducedMotion();
  const hasHover = useHasHover();
  const [ajar, setAjar] = useState(false);
  const [opening, setOpening] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const open = opening;
  const angle = open ? 82 : ajar ? 9 : 0;
  const ease = "cubic-bezier(0.16, 0.72, 0.22, 1)";
  const leafTransition = reduced
    ? "none"
    : `transform ${open ? OPEN_MS : 620}ms ${ease}, filter ${open ? OPEN_MS : 620}ms ${ease}`;

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    track("product_select", { source: "entrance_door" });
    if (reduced || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return; // let the browser do its normal thing
    }
    event.preventDefault();
    if (opening) return;
    setOpening(true);
    timer.current = window.setTimeout(() => router.push("/shop"), NAV_MS);
  }

  return (
    <Link
      href="/shop"
      onClick={handleClick}
      onPointerEnter={() => hasHover && !reduced && setAjar(true)}
      onPointerLeave={() => hasHover && setAjar(false)}
      className="group mx-auto block w-full max-w-[62rem] focus-visible:outline-offset-8"
      aria-label="Open the doors and shop the LALALOCA Collection"
    >
      <div
        aria-hidden
        className={`relative aspect-[1484/1060] w-full select-none overflow-hidden bg-black ${
          opening ? "z-30" : ""
        }`}
        style={{
          perspective: "1600px",
          transformOrigin: "center 62%",
          transform: opening ? "scale(2.4)" : "scale(1)",
          transition: reduced
            ? "none"
            : `transform ${WALK_MS}ms cubic-bezier(0.55, 0, 0.85, 0.2)`,
        }}
      >
        {/* ---------- the room, and what waits on the other side ---------- */}
        <Image
          src="/door/door-scene.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 62rem"
          className="object-cover"
        />

        {/* warm light from the room, rising as the doors swing */}
        <div
          className="absolute transition-opacity"
          style={{
            top: LEAF.top,
            height: LEAF.height,
            left: LEAF.leftX,
            width: `calc(${LEAF.width} * 2)`,
            transitionDuration: `${OPEN_MS}ms`,
            opacity: open ? 1 : 0,
            background:
              "radial-gradient(64% 52% at 50% 46%, rgba(240,214,178,0.40) 0%, rgba(176,138,100,0.16) 44%, transparent 78%)",
          }}
        />

        {/* ---------- the doors ---------- */}
        {(["left", "right"] as const).map((side) => {
          const isLeft = side === "left";
          return (
            <div
              key={side}
              className="absolute will-change-transform"
              style={{
                top: LEAF.top,
                height: LEAF.height,
                width: LEAF.width,
                left: isLeft ? LEAF.leftX : LEAF.rightX,
                transformOrigin: isLeft ? "left center" : "right center",
                transform: `rotateY(${isLeft ? -angle : angle}deg)`,
                transition: leafTransition,
                backfaceVisibility: "hidden",
                /* the face turns away from the sconces as it swings */
                filter: `brightness(${open ? 0.62 : ajar ? 0.94 : 1})`,
              }}
            >
              <Image
                src={`/door/door-leaf-${side}.webp`}
                alt=""
                fill
                priority
                sizes="21vw"
                className="object-fill"
              />
              {/* edge shadow deepening into the seam as the door parts */}
              <div
                className="pointer-events-none absolute inset-0 transition-opacity"
                style={{
                  transitionDuration: `${open ? OPEN_MS : 620}ms`,
                  opacity: angle > 0 ? 1 : 0,
                  background: isLeft
                    ? "linear-gradient(270deg, rgba(0,0,0,0.55) 0%, transparent 42%)"
                    : "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, transparent 42%)",
                }}
              />
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-center text-[0.6875rem] uppercase tracking-[0.22em] text-charcoal/70 transition-colors group-hover:text-charcoal">
        Open the doors <span aria-hidden>↗</span>
      </p>
    </Link>
  );
}
