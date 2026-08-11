import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

/**
 * A photograph slot that is honest about being empty.
 *
 * The approved StandUp for Kids photographs are not in this repository yet.
 * Rather than ship a broken image, a grey box, or — far worse — a substitute
 * picture of young people who are not the young people in the story, each slot
 * checks for its file at build time and renders nothing at all if it is
 * missing. The layout is designed to read correctly either way.
 *
 * Drop the named file into /public and it appears on the next build. Nothing
 * else needs changing.
 *
 * WHY `fill` AND NOT WIDTH/HEIGHT: the intrinsic dimensions of a file that
 * does not exist yet cannot be known here, and guessing them is how layout
 * shift gets shipped. The wrapper owns a fixed aspect ratio instead, so the
 * space is reserved before the image loads and stays reserved whatever the
 * source turns out to measure.
 *
 * `focal` exists because centring every photograph is how a group shot ends up
 * cropped to someone's shoulder on a 390px screen.
 */

export function assetExists(src: string): boolean {
  return fs.existsSync(path.join(process.cwd(), "public", src.replace(/^\//, "")));
}

export function DocumentaryImage({
  src,
  alt,
  ratio = "4 / 3",
  focal = "50% 50%",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  className = "",
}: {
  src: string;
  /** Describe what is happening and who is present in general terms. Never a
      young person's name, and never "image". */
  alt: string;
  ratio?: string;
  focal?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  if (!assetExists(src)) return null;

  return (
    <div className={`relative w-full overflow-hidden ${className}`} style={{ aspectRatio: ratio }}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={{ objectPosition: focal }}
      />
    </div>
  );
}
