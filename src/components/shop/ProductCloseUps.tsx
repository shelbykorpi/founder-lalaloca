import Image from "next/image";
import { Reveal } from "@/components/house/Reveal";
import { CLOSE_UPS } from "@/lib/closeUps";

/**
 * Real-life close-ups on a product page (15 Oct 2026). One component for
 * all eight pages: the serum pages (products/[slug]), the four FOUNDER
 * plates (ProductPlate) and Hold the Room's own page. Built on the serum
 * page's existing photography band (night ground, two figures, small caps
 * caption) with 3:4 portrait frames, matching the files, because these are faces.
 *
 * The line under the heading says these are not results. No product appears
 * in the photographs, so a reader must never take them as a before-and-after.
 */
export function ProductCloseUps({ slug }: { slug: string }) {
  const shots = CLOSE_UPS[slug];
  if (!shots) return null;
  return (
    <section className="section-tight bg-night" aria-labelledby={`close-up-${slug}`}>
      <div className="shell">
        <Reveal>
          <p className="room-label">Close up</p>
          <h2 id={`close-up-${slug}`} className="mt-4 font-serif text-3xl font-light text-cream">
            Real skin. Real light.
          </h2>
          <p className="mt-3 max-w-[34rem] text-[0.9375rem] leading-relaxed text-cream/70">
            Photographed on the beach, not in a studio. A mood, not a before-and-after.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {shots.map((shot) => (
            <figure key={shot.src}>
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-night-deep">
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, 44vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 text-xs uppercase tracking-[0.16em] text-cream/60">
                {shot.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
