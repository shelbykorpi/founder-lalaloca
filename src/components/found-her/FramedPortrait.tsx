import Image from "next/image";

/**
 * A portrait hung in the FOUNDER frame.
 *
 * THE FRAME IS ONE ASSET, NOT ONE PER WOMAN. The old gallery (removed in
 * 325cd58, "one continuous cinematic room") worked by baking each portrait
 * into its own rendered wall — founder-portrait-wall.webp was Shelby and only
 * ever Shelby. That looked real and did not scale: every new story arrived
 * unframed and needed a new render.
 *
 * So the frame is now an overlay. `found-her-frame.webp` is the empty frame
 * artwork with its aperture cut to transparent, laid over whatever portrait
 * sits behind it. Any woman approved into the archive is framed the moment
 * her portrait lands — nothing to render, nothing to commission.
 *
 * THE NUMBERS ARE MEASURED, NOT EYEBALLED. The aperture and the nameplate
 * were read off the artwork in pixels and converted to percentages of the
 * frame, so they hold at every size:
 *
 *   aperture   x 166..918, y 208..1242 of 1086x1448
 *              -> left 15.285%  top 14.365%  w 69.245%  h 71.409%
 *   nameplate  centred at 50.1% / 93.4%, 31.8% of the frame wide
 *
 * If the frame artwork is ever re-cut, re-measure. Do not nudge these by eye.
 *
 * THE NAMEPLATE IS LIVE TEXT, engraved-looking rather than engraved: a dark
 * warm fill with a one-pixel light below it, which is what brass does. Real
 * text, so it is readable by a screen reader, selectable, and translatable —
 * and so a new name never needs a new image. It scales with the frame via
 * container units, which is why the figure declares its own containment.
 */

export type FramedPortraitProps = {
  src: string;
  alt: string;
  /** object-position for the portrait inside the aperture. */
  position?: string;
  /** Engraved on the brass plate. */
  name: string;
  role?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

/* Measured off the artwork — see the note above before changing. */
const APERTURE = {
  left: "15.285%",
  top: "14.365%",
  width: "69.245%",
  height: "71.409%",
} as const;

export function FramedPortrait({
  src,
  alt,
  position,
  name,
  role,
  priority = false,
  sizes = "(max-width: 768px) 86vw, 34vw",
  className = "",
}: FramedPortraitProps) {
  const engraved = role ? `${name} · ${role}` : name;

  /* THE PLATE IS A FIXED SIZE AND NAMES ARE NOT, so the engraving is sized to
     fit rather than set once and hoped over. The usable bezel is ~24.8cqw
     (31.8% of the frame, less the rounded ends), and Cormorant at 0.12em
     tracking averages ~0.66em per character — so a label of N characters
     needs 24.8 / (0.66 * N) cqw, capped at 1.55 so short names do not become
     billboards.
       "SHELBY KORPI · FOUNDER"        24 chars -> capped at 1.55cqw
       "ALY V · BUILDING MAKEUPGEMZ"   29 chars -> 1.30cqw, clears the bezel
     Measured against both, not estimated. A longer name shrinks; it never
     overruns the brass. */
  const plateFontCqw = Math.min(1.55, 24.8 / (0.66 * engraved.length));

  return (
    <figure
      className={`relative mx-auto w-full ${className}`}
      /* inline-size containment is what makes the nameplate scale with the
         frame instead of the viewport. */
      style={{ containerType: "inline-size" }}
    >
      <div className="relative aspect-[1086/1448]">
        {/* The portrait, behind the frame, clipped to the aperture. */}
        <div className="absolute overflow-hidden" style={APERTURE}>
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]"
            style={{ objectPosition: position ?? "center" }}
          />
        </div>

        {/* The frame itself. Decorative — the portrait above carries the alt. */}
        <Image
          src="/editorial/found-her-frame.webp"
          alt=""
          aria-hidden
          fill
          sizes={sizes}
          className="pointer-events-none select-none object-contain"
        />

        {/* Engraved on the brass. */}
        <figcaption
          className="pointer-events-none absolute whitespace-nowrap text-center uppercase"
          style={{
            left: "50.1%",
            top: "93.4%",
            transform: "translate(-50%, -50%)",
            fontSize: `${plateFontCqw.toFixed(3)}cqw`,
            letterSpacing: "0.12em",
            color: "#4a3519",
            textShadow: "0 0.08cqw 0 rgba(255,236,198,0.38)",
          }}
        >
          {engraved}
        </figcaption>
      </div>
    </figure>
  );
}
