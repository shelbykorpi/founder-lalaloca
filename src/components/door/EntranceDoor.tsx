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
 * The entrance to the shop: the full FOUNDER lobby — marble floor, velvet
 * chairs, green fluted panels with mirrors — with the black lacquered ꟻF
 * doors at its centre under the gold fanlight. It runs the full width of
 * the page.
 *
 * HOW THIS IS BUILT
 * -----------------
 * The scene is a photograph, but the doors still open. Three images:
 *
 *   hdoor-scene.webp        the whole lobby, doors shut (baked in)
 *   hdoor-leaf-left.webp    the left door, cut out at the centre seam
 *   hdoor-leaf-right.webp   the right door
 *
 * The leaves are positioned over the scene at the exact fractions of the
 * photograph they were cut from (see LEAF below) and rotated on their outer
 * hinges. Because the photograph's own doors are baked in shut, an opaque
 * interior is painted into the opening underneath the leaves — swinging them
 * reveals that interior, never the baked pixels.
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
  top: "21.531%",
  height: "57.775%",
  leftX: "42.371%",
  leftW: "8.985%",
  rightX: "51.356%",
  rightW: "9.038%",
  openW: "18.022%",
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
      className="group block w-full focus-visible:outline-offset-8"
      aria-label="Open the doors and shop the LALALOCA Collection"
    >
      <div
        aria-hidden
        className={`relative aspect-[1881/836] w-full select-none overflow-hidden bg-black ${
          opening ? "z-30" : ""
        }`}
        style={{
          perspective: "2400px",
          transformOrigin: "center 55%",
          transform: opening ? "scale(3.2)" : "scale(1)",
          transition: reduced
            ? "none"
            : `transform ${WALK_MS}ms cubic-bezier(0.55, 0, 0.85, 0.2)`,
        }}
      >
        {/* ---------- the lobby ---------- */}
        <Image
          src="/door/hdoor-scene.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* ---------- the doorway — interior painted under the leaves ---------- */}
        <div
          className="absolute overflow-hidden"
          style={{
            top: LEAF.top,
            height: LEAF.height,
            left: LEAF.leftX,
            width: LEAF.openW,
          }}
        >
          {/* opaque interior, so the photograph's own shut doors never show */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, #171008 0%, #241708 40%, #0c0703 100%)",
            }}
          />
          {/* warm light from the room, rising as the doors swing */}
          <div
            className="absolute inset-0 transition-opacity"
            style={{
              transitionDuration: `${OPEN_MS}ms`,
              opacity: open ? 1 : 0,
              background:
                "radial-gradient(70% 56% at 50% 42%, rgba(240,214,178,0.5) 0%, rgba(176,138,100,0.2) 46%, transparent 80%)",
            }}
          />
          {/* a marble threshold catching that light at the floor */}
          <div
            className="absolute inset-x-0 bottom-0 h-[9%] transition-opacity"
            style={{
              transitionDuration: `${OPEN_MS}ms`,
              opacity: open ? 0.8 : 0,
              background:
                "linear-gradient(180deg, transparent, rgba(240,214,178,0.28))",
            }}
          />
        </div>

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
                width: isLeft ? LEAF.leftW : LEAF.rightW,
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
                src={`/door/hdoor-leaf-${side}.webp`}
                alt=""
                fill
                priority
                sizes="10vw"
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
