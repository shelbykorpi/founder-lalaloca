import Image from "next/image";
import type { ReactNode } from "react";
import { AmbientLighting } from "./AmbientLighting";

/**
 * EDITORIAL ROOM SECTION — the room continuing below the fold.
 *
 * Four surfaces, so a page never falls back to a flat block:
 *
 *   marble   the dark floor, veined, lit from the fire — the default
 *   panel    emerald paneling with brass lines: the wall between rooms
 *   paper    a cream page on the dark floor, brass-edged — for long reading
 *            (a story, a form, an ingredient list). Ink is charcoal inside.
 *   scene    a photograph of the room, darkened to hold type
 *
 * `paper` keeps the house rule that reading happens on a lit surface; it
 * just makes the surface a page lying in the room instead of a page the
 * room stops for.
 */
export function EditorialRoomSection({
  surface = "marble",
  scene,
  sceneAlt = "",
  scenePosition = "center",
  ambient = surface !== "paper",
  tight = false,
  id,
  className = "",
  children,
  ...rest
}: {
  surface?: "marble" | "panel" | "paper" | "scene";
  scene?: string;
  sceneAlt?: string;
  scenePosition?: string;
  ambient?: boolean;
  tight?: boolean;
  id?: string;
  className?: string;
  children: ReactNode;
  "aria-labelledby"?: string;
  "aria-label"?: string;
}) {
  const pad = tight ? "section-tight" : "section";
  const ground =
    surface === "panel" ? "house-panel" : surface === "scene" ? "room-hall" : "house-marble";

  return (
    <section
      id={id}
      className={`relative isolate overflow-hidden ${ground} ${pad} ${className}`}
      {...rest}
    >
      {surface === "scene" && scene && (
        <>
          <Image
            src={scene}
            alt={sceneAlt}
            fill
            loading="lazy"
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: scenePosition }}
          />
          <span aria-hidden className="house-scene-dim" />
        </>
      )}
      {ambient && <AmbientLighting glow={surface !== "paper"} />}
      {surface === "paper" ? (
        <div className="shell relative">
          <div className="paper-page mx-auto w-full max-w-6xl px-6 py-10 md:px-14 md:py-16">
            {children}
          </div>
        </div>
      ) : (
        <div className="relative">{children}</div>
      )}
    </section>
  );
}
