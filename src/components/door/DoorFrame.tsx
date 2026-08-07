"use client";

import Image from "next/image";
import { usePrefersReducedMotion } from "./useMotionPrefs";
import type { Product } from "@/lib/products";

/** How long the elevator doors take to slide. */
export const DOOR_MS = 950;
/** How long the cab (the bottle) takes to arrive at the floor. */
const CAB_MS = 1400;
/** The cab starts moving a beat after the doors begin to part. */
const CAB_DELAY = 220;

/**
 * The three elevators come from ONE photograph of the FOUNDER elevator bank —
 * marble floor, sconces, green wainscot — cut into three equal slices, each
 * centred on its own car. Every serum gets its own elevator: Thirst Trap the
 * left car beside the sconce, C Me Glow the centre, Bounce Back the right.
 *
 * The slices were cut so the door opening sits at identical fractions in all
 * three, so one set of geometry drives them all. Re-cut at the same centres
 * if you ever swap the photograph, or the doors will slide off their tracks.
 */
const VARIANT: Record<string, number> = {
  "thirst-trap": 0,
  "c-me-glow": 1,
  "bounce-back": 2,
};

/** Where the elevator opening sits inside each slice, as fractions of it. */
const OPENING = {
  top: "20.853%",
  height: "70.616%",
  left: "28.387%",
  width: "43.226%",
} as const;

/** The leaves split the opening at the centre seam. */
const LEAF_LEFT_W = "50%";
const LEAF_RIGHT_W = "50%";

/** Each slice's own aspect. The container must match it or the leaves drift. */
export const DOOR_ASPECT = "aspect-[620/844]";

type Props = {
  product: Product;
  open: boolean;
  /**
   * Which way the serum rides in. "down" glides in from above and settles on
   * the floor, like an elevator arriving from an upper floor; "up" rises into
   * view from below. The shop page alternates: down, up, down.
   */
  arrive?: "down" | "up";
  compact?: boolean;
  priority?: boolean;
  className?: string;
};

/**
 * The architectural door primitive: an Art Deco elevator in Founder Green and
 * brass. The two leaves slide apart horizontally — a standard elevator opening,
 * not a swing — and disappear behind the fixed brass surround, which never
 * moves. Behind them, the serum rides in vertically and stops on the floor.
 *
 * Construction: the full photograph is the backdrop. The opening rectangle is
 * clipped (overflow hidden) and painted with an opaque room, so the baked-in
 * closed doors underneath are never visible; the two leaf crops sit exactly
 * over their own pixels when shut, and slide out of the clip when open.
 *
 * Purely presentational and aria-hidden. The accessible control lives with the
 * product information, never inside the elevator.
 */
export function DoorFrame({
  product,
  open,
  arrive = "down",
  compact = false,
  priority = false,
  className = "",
}: Props) {
  const reduced = usePrefersReducedMotion();
  const doorMs = reduced ? 1 : DOOR_MS;
  const cabMs = reduced ? 1 : CAB_MS;
  const cabDelay = reduced ? 0 : CAB_DELAY;

  /* Elevator motion: brisk start, long settle. */
  const slide = reduced
    ? "none"
    : `transform ${doorMs}ms cubic-bezier(0.45, 0.05, 0.25, 1)`;
  const ride = reduced
    ? "none"
    : `transform ${cabMs}ms ${cabDelay}ms cubic-bezier(0.3, 0.9, 0.3, 1)`;

  const cabOffset = arrive === "up" ? "64%" : "-64%";
  const variant = VARIANT[product.slug] ?? 0;

  return (
    <div
      aria-hidden
      className={`relative select-none overflow-hidden bg-emerald-deep ${className}`}
    >
      {/* ---------- the lobby: brass surround, sconces, marble floor ---------- */}
      <Image
        src={`/door/edoor2-${variant}-scene.webp`}
        alt=""
        fill
        priority={priority}
        sizes={compact ? "(max-width: 1024px) 90vw, 26rem" : "(max-width: 1024px) 90vw, 32rem"}
        className="object-cover"
      />

      {/* ---------- the opening — everything inside is clipped by the frame ---------- */}
      <div
        className="absolute overflow-hidden"
        style={{
          top: OPENING.top,
          height: OPENING.height,
          left: OPENING.left,
          width: OPENING.width,
        }}
      >
        {/* the shaft: opaque, so the photograph's own shut doors never show */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #0a2523 0%, #0d2f2b 34%, #071915 100%)",
          }}
        />

        {/* the room lit in this product's own colour, rising as the doors part */}
        <div
          className="absolute inset-0 transition-opacity"
          style={{
            transitionDuration: `${doorMs}ms`,
            opacity: open ? 1 : 0,
            background: `radial-gradient(60% 44% at 50% 36%, ${product.glow}40 0%, transparent 74%), radial-gradient(36% 22% at 50% 84%, ${product.accent}30 0%, transparent 72%)`,
          }}
        />

        {/* floor — the car falls away into shadow at the bottom */}
        <div
          className="absolute inset-x-0 bottom-0 h-[30%] transition-opacity"
          style={{
            transitionDuration: `${doorMs}ms`,
            opacity: open ? 1 : 0,
            background:
              "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.42) 40%, rgba(3,12,10,0.9) 100%)",
          }}
        />

        {/* ---- the display block ----
            A lacquered black riser waiting on the elevator floor: a lit top
            face, a body that falls away into shadow, and the bottle mirrored
            in the polish once it lands. */}
        <div
          className="absolute bottom-[5%] left-1/2 h-[13%] w-[42%] transition-opacity"
          style={{
            transitionDuration: `${doorMs}ms`,
            opacity: open ? 1 : 0,
            transform: "translateX(-50%)",
          }}
        >
          <div
            className="absolute inset-x-[4%] bottom-0 top-[12%]"
            style={{
              background:
                "linear-gradient(180deg, #131211 0%, #070706 44%, #000 100%)",
              clipPath: "polygon(0 0, 100% 0, 95.5% 100%, 4.5% 100%)",
              boxShadow: "0 24px 36px rgba(0,0,0,0.8)",
            }}
          />
          <div
            className="absolute inset-x-0 top-0 h-[24%] rounded-[50%]"
            style={{
              background:
                "linear-gradient(180deg, #2b2724 0%, #141312 52%, #080807 100%)",
              boxShadow: `0 0 22px ${product.glow}2e, inset 0 1px 0 rgba(234,211,195,0.44)`,
            }}
          />
          <div
            className="absolute inset-x-[10%] top-[19%] h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(199,155,91,0.72), transparent)",
            }}
          />
        </div>

        {/* ---- the cab: the serum riding to this floor ----
            The whole group — bottle, its reflection in the plinth, and the
            contact shadow — glides vertically and stops. Direction comes from
            `arrive`; the clip hides it until it enters the opening. */}
        <div
          className="absolute inset-0 will-change-transform"
          style={{
            transform: open ? "translateY(0)" : `translateY(${cabOffset})`,
            transition: ride,
          }}
        >
          {/* the bottle, mirrored in the polished top — flipped about its own
              base and foreshortened, so it lands rather than floats */}
          <div
            className="absolute inset-x-0 transition-opacity"
            style={{
              bottom: "18.5%",
              top: "20%",
              transitionDuration: `${cabMs}ms`,
              transitionDelay: `${cabDelay}ms`,
              opacity: open ? 0.2 : 0,
              transform: "scaleY(-0.34)",
              transformOrigin: "bottom center",
              maskImage: "linear-gradient(0deg, #000 0%, transparent 62%)",
              WebkitMaskImage: "linear-gradient(0deg, #000 0%, transparent 62%)",
            }}
          >
            <Image
              src={product.bottle}
              alt=""
              fill
              sizes="320px"
              style={{ objectFit: "contain", objectPosition: "center bottom" }}
            />
          </div>

          {/* contact shadow where the bottle meets the block */}
          <div
            className="absolute bottom-[17.8%] left-1/2 h-[2%] w-[19%] -translate-x-1/2 rounded-[50%] blur-[5px] transition-opacity"
            style={{
              transitionDuration: `${cabMs}ms`,
              transitionDelay: `${cabDelay}ms`,
              opacity: open ? 0.85 : 0,
              background:
                "radial-gradient(closest-side, rgba(0,0,0,0.95), transparent)",
            }}
          />

          {/* the bottle */}
          <div
            className="absolute inset-x-0 flex items-end justify-center"
            style={{ bottom: "18.5%", top: "20%" }}
          >
            <div className="relative h-full w-full">
              <Image
                src={product.bottle}
                alt=""
                fill
                priority={priority}
                sizes={
                  compact
                    ? "(max-width: 768px) 60vw, 320px"
                    : "(max-width: 1024px) 70vw, 520px"
                }
                style={{ objectFit: "contain", objectPosition: "center bottom" }}
                className="drop-shadow-[0_28px_38px_rgba(0,0,0,0.55)]"
              />
            </div>
          </div>
        </div>

        {/* reflected light on the floor under the plinth */}
        <div
          className="absolute bottom-[2.5%] left-1/2 h-[4%] w-[44%] -translate-x-1/2 rounded-[50%] blur-lg transition-opacity"
          style={{
            transitionDuration: `${cabMs}ms`,
            transitionDelay: `${cabDelay}ms`,
            opacity: open ? 0.5 : 0,
            background: `radial-gradient(closest-side, ${product.glow}66, transparent)`,
          }}
        />

        {/* ---------- the doors — they slide, the frame never moves ---------- */}
        <div
          className="absolute inset-y-0 left-0 will-change-transform"
          style={{
            width: LEAF_LEFT_W,
            transform: open ? "translateX(-101%)" : "translateX(0)",
            transition: slide,
          }}
        >
          <Image
            src={`/door/edoor2-${variant}-left.webp`}
            alt=""
            fill
            priority={priority}
            sizes="(max-width: 1024px) 30vw, 10rem"
            className="object-fill"
          />
        </div>
        <div
          className="absolute inset-y-0 right-0 will-change-transform"
          style={{
            width: LEAF_RIGHT_W,
            transform: open ? "translateX(101%)" : "translateX(0)",
            transition: slide,
          }}
        >
          <Image
            src={`/door/edoor2-${variant}-right.webp`}
            alt=""
            fill
            priority={priority}
            sizes="(max-width: 1024px) 30vw, 10rem"
            className="object-fill"
          />
        </div>
      </div>
    </div>
  );
}
