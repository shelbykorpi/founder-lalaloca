"use client";

import Image from "next/image";
import { usePrefersReducedMotion } from "./useMotionPrefs";
import type { Product } from "@/lib/products";

export const DOOR_MS = 860;

/**
 * Where the doors sit inside pdoor-scene.webp, as fractions of it.
 * Re-cut the leaves at the same seam if you ever swap the photograph, or the
 * doors will hang off their hinges.
 */
const LEAF = {
  top: "23.59%",
  height: "74.85%",
  width: "38.27%",
  leftX: "11.99%",
  rightX: "50.26%",
} as const;

/** The photograph's own aspect. The container must match it or the leaves drift. */
export const DOOR_ASPECT = "aspect-[784/1030]";

type Props = {
  product: Product;
  open: boolean;
  /** Frame edges get lighter detailing on small cards */
  compact?: boolean;
  priority?: boolean;
  className?: string;
};

/**
 * The architectural door primitive: an emerald lacquered doorway under a lit
 * fanlight, with a pair of heavy doors that swing inward.
 *
 * Same construction as the entrance on the homepage — a photographed scene with
 * the two leaves cut out at the centre seam and hinged back over it — but
 * recoloured to emerald with the brass left alone. Swinging the leaves reveals
 * the room painted in behind them, lit in the product's own accent.
 *
 * Purely presentational and aria-hidden. The accessible control lives with the
 * product information, never inside the room.
 */
export function DoorFrame({
  product,
  open,
  compact = false,
  priority = false,
  className = "",
}: Props) {
  const reduced = usePrefersReducedMotion();
  const duration = reduced ? 1 : DOOR_MS;
  /* the bottle arrives a beat after the leaves start moving, so you see the
     doors part first and the product second — not both at once */
  const revealDelay = reduced ? 0 : Math.round(DOOR_MS * 0.34);
  const angle = open ? 78 : 0;

  const leafTransition = reduced
    ? "none"
    : `transform ${duration}ms var(--ease-door), filter ${duration}ms ease`;

  return (
    <div
      aria-hidden
      className={`relative select-none overflow-hidden bg-emerald-deep ${className}`}
      style={{ perspective: compact ? "1000px" : "1600px" }}
    >
      {/* ---------- the doorway, and the room waiting behind it ---------- */}
      <Image
        src="/door/pdoor-scene.webp"
        alt=""
        fill
        priority={priority}
        sizes="(max-width: 1024px) 90vw, 30rem"
        className="object-cover"
      />

      {/* ---------- the room, and the bottle standing in it ----------
          Everything here sits inside the doorway opening and is painted before
          the leaves, so the doors swing over the top of it. This is the whole
          point of the interaction: opening the doors shows you the product. */}
      <div
        className="absolute overflow-hidden"
        style={{
          top: LEAF.top,
          height: LEAF.height,
          left: LEAF.leftX,
          width: `calc(${LEAF.width} * 2)`,
        }}
      >
        {/* Deepen the back wall. The scene is graded so the *door face* lands on
            Founder Green, which leaves the room behind it too bright — and
            Thirst Trap's turquoise is close enough to Founder Green that the
            bottle would half-disappear into the wall. The room is a shadow
            value; the lit face is the brand colour. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(72% 58% at 50% 44%, rgba(4,20,18,0.30) 0%, rgba(4,20,18,0.62) 68%, rgba(3,14,12,0.80) 100%)",
          }}
        />

        {/* the room lit in this product's own colour, rising as the doors part */}
        <div
          className="absolute inset-0 transition-opacity"
          style={{
            transitionDuration: `${duration}ms`,
            opacity: open ? 1 : 0,
            background: `radial-gradient(58% 46% at 50% 38%, ${product.glow}44 0%, transparent 74%), radial-gradient(34% 24% at 50% 82%, ${product.accent}33 0%, transparent 72%)`,
          }}
        />

        {/* floor — the room falls away into shadow at the bottom */}
        <div
          className="absolute inset-x-0 bottom-0 h-[34%] transition-opacity"
          style={{
            transitionDuration: `${duration}ms`,
            opacity: open ? 1 : 0,
            background:
              "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.42) 38%, rgba(3,12,10,0.9) 100%)",
          }}
        />

        {/* ---- the display block ----
            A lacquered black riser, the way a jeweller sets one piece down:
            a lit top face, a body that falls away into shadow, and the bottle
            mirrored in the polish. */}
        <div
          className="absolute bottom-[6%] left-1/2 h-[15%] w-[35%] transition-all"
          style={{
            transitionDuration: `${duration}ms`,
            transitionDelay: `${revealDelay}ms`,
            opacity: open ? 1 : 0,
            transform: open
              ? "translate(-50%, 0) scale(1)"
              : "translate(-50%, 6px) scale(0.96)",
          }}
        >
          {/* body — tapered a touch so it reads as a solid seen from above */}
          <div
            className="absolute inset-x-[4%] bottom-0 top-[12%]"
            style={{
              background:
                "linear-gradient(180deg, #131211 0%, #070706 44%, #000 100%)",
              clipPath: "polygon(0 0, 100% 0, 95.5% 100%, 4.5% 100%)",
              boxShadow: "0 24px 36px rgba(0,0,0,0.8)",
            }}
          />
          {/* polished cap, overhanging the body the way a plinth does */}
          <div
            className="absolute inset-x-0 top-0 h-[24%] rounded-[50%]"
            style={{
              background:
                "linear-gradient(180deg, #2b2724 0%, #141312 52%, #080807 100%)",
              boxShadow: `0 0 22px ${product.glow}2e, inset 0 1px 0 rgba(234,211,195,0.44)`,
            }}
          />
          {/* bronze line along the front lip of the cap */}
          <div
            className="absolute inset-x-[10%] top-[19%] h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(199,155,91,0.72), transparent)",
            }}
          />
        </div>

        {/* the bottle, mirrored in the polished top — flipped about its own base
            and foreshortened, so it falls onto the block rather than floating */}
        <div
          className="absolute inset-x-0 transition-opacity"
          style={{
            bottom: "21%",
            top: "15%",
            transitionDuration: `${duration}ms`,
            transitionDelay: `${revealDelay}ms`,
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
          className="absolute bottom-[20.2%] left-1/2 h-[2%] w-[17%] -translate-x-1/2 rounded-[50%] blur-[5px] transition-opacity"
          style={{
            transitionDuration: `${duration}ms`,
            transitionDelay: `${revealDelay}ms`,
            opacity: open ? 0.85 : 0,
            background: "radial-gradient(closest-side, rgba(0,0,0,0.95), transparent)",
          }}
        />

        {/* the bottle */}
        <div
          className="absolute inset-x-0 flex items-end justify-center transition-all"
          style={{
            bottom: "21%",
            top: "15%",
            transitionDuration: `${duration}ms`,
            transitionDelay: `${revealDelay}ms`,
            opacity: open ? 1 : 0,
            transform: open ? "translateY(0) scale(1)" : "translateY(10px) scale(0.97)",
          }}
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

        {/* reflected light on the floor under the plinth */}
        <div
          className="absolute bottom-[3%] left-1/2 h-[4%] w-[40%] -translate-x-1/2 rounded-[50%] blur-lg transition-opacity"
          style={{
            transitionDuration: `${duration}ms`,
            transitionDelay: `${revealDelay}ms`,
            opacity: open ? 0.5 : 0,
            background: `radial-gradient(closest-side, ${product.glow}66, transparent)`,
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
              width: LEAF.width,
              left: isLeft ? LEAF.leftX : LEAF.rightX,
              transformOrigin: isLeft ? "left center" : "right center",
              transform: `rotateY(${isLeft ? -angle : angle}deg)`,
              transition: leafTransition,
              backfaceVisibility: "hidden",
              filter: `brightness(${open ? 0.66 : 1})`,
            }}
          >
            <Image
              src={`/door/pdoor-leaf-${side}.webp`}
              alt=""
              fill
              priority={priority}
              sizes="(max-width: 1024px) 35vw, 12rem"
              className="object-fill"
            />
            <div
              className="pointer-events-none absolute inset-0 transition-opacity"
              style={{
                transitionDuration: `${duration}ms`,
                opacity: open ? 1 : 0,
                background: isLeft
                  ? "linear-gradient(270deg, rgba(0,0,0,0.5) 0%, transparent 44%)"
                  : "linear-gradient(90deg, rgba(0,0,0,0.5) 0%, transparent 44%)",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
