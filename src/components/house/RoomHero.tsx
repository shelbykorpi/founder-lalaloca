import Image from "next/image";
import type { ReactNode } from "react";
import { AmbientLighting } from "./AmbientLighting";
import { roomLabel, type Room } from "@/lib/rooms";

/**
 * THE ROOM HERO — one frame, full bleed, the copy in the room's own shadow.
 *
 * Built 3 September 2026 for the render set Shelby supplied: one photograph
 * per room of the house, each composed with a dark left third for type and
 * the scene on the right. The baked-in mock-up type was removed from every
 * frame before import (the site draws its own, so it translates, reflows and
 * is read aloud); what remains under the words on the left is the room's
 * wall, and the panel below deepens it to night so the type never depends on
 * the picture for contrast. House grammar R7: copy never sits on the
 * photograph — it sits beside it, on the shadow, with the picture untouched.
 *
 * `as` steps the heading down when a page already owns its h1.
 */
export function RoomHero({
  room,
  src: srcProp,
  alt: altProp,
  mobileSrc: mobileProp,
  label: labelProp,
  title,
  lede,
  children,
  as = "h1",
  position = "62% center",
  height = "min-h-[72svh]",
  priority = false,
  id,
  headingId,
}: {
  /** A room from the floor plan supplies src, alt, phone crop and label. */
  room?: Room;
  src?: string;
  alt?: string;
  /** Purpose-built portrait crop for phones; the wide frame is used when absent. */
  mobileSrc?: string;
  label?: string;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
  as?: "h1" | "h2" | "p";
  /** CSS object-position — where the frame's subject is, so it survives a narrow crop. */
  position?: string;
  height?: string;
  priority?: boolean;
  id?: string;
  /** Lets a page point a skip link or a focus target at the heading. */
  headingId?: string;
}) {
  const Heading = as;
  const src = srcProp ?? room?.hero.src ?? "";
  const alt = altProp ?? room?.hero.alt ?? "";
  const mobileSrc = mobileProp ?? room?.heroMobile.src;
  const label = labelProp ?? (room ? `Room ${roomLabel(room)}` : "");
  const pos = position === "62% center" && room?.hero.position ? room.hero.position : position;
  return (
    <section
      id={id}
      className={`relative isolate flex ${height} flex-col justify-end overflow-hidden bg-night text-cream`}
    >
      {/* The wide frame on desktop; the portrait crop on phones. Two
          elements, CSS-hidden, so each breakpoint gets a picture composed
          for it rather than the same crop squeezed. Only the desktop frame
          carries the preload. */}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        loading={priority ? undefined : "lazy"}
        sizes="100vw"
        className={`object-cover ${mobileSrc ? "hidden md:block" : ""}`}
        style={{ objectPosition: pos }}
      />
      {mobileSrc && (
        <Image
          src={mobileSrc}
          alt={alt}
          fill
          loading={priority ? "eager" : "lazy"}
          sizes="100vw"
          className="object-cover md:hidden"
          style={{ objectPosition: "center 40%" }}
        />
      )}
      <AmbientLighting />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,19,15,0.35)_0%,rgba(7,19,15,0.12)_32%,rgba(7,19,15,0.9)_76%,#07130f_100%)] md:bg-[linear-gradient(90deg,#07130f_0%,#07130f_20%,rgba(7,19,15,0.93)_34%,rgba(7,19,15,0.6)_48%,rgba(7,19,15,0.08)_66%,rgba(7,19,15,0)_80%)]"
      />
      <div className="shell relative flex w-full flex-1 items-end pb-14 pt-28 md:items-center md:py-24">
        <div className="max-w-[32rem]">
          <p className="room-label">{label}</p>
          <span aria-hidden className="mt-4 block h-px w-10 bg-rose" />
          <Heading id={headingId} tabIndex={headingId ? -1 : undefined} className="headline-house mt-5 text-balance text-cream outline-none">{title}</Heading>
          {lede && (
            <p className="mt-6 max-w-[40ch] text-[1.0625rem] leading-relaxed text-cream/80">
              {lede}
            </p>
          )}
          {children && (
            <div className="room-hero-actions mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">{children}</div>
          )}
        </div>
      </div>
    </section>
  );
}
