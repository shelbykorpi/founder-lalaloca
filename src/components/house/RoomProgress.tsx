"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ROOMS, roomForPathname, roomLabel } from "@/lib/rooms";

/**
 * THE ROOM RAIL — where you are in the house, on every page.
 *
 * Desktop: a restrained vertical rail on the right, seven hairlines, the
 * current room's name set vertically beside it. Each line is a link, so the
 * rail is navigation, not decoration. On the homepage the active room
 * follows the scroll between the threshold and the lounge.
 *
 * Phones: the rail becomes a small pill at the foot of the screen — "03 ·
 * The Serum Salon" — that opens an accessible menu of the seven rooms.
 */
export function RoomProgress({ room: forced }: { room?: number } = {}) {
  const pathname = usePathname();
  const routeRoom = forced ? ROOMS[forced - 1] : roomForPathname(pathname ?? "/");
  /* On the homepage the threshold and the lounge share the page, so the
     active room there follows the scroll; everywhere else it is the route's. */
  const [homeRoom, setHomeRoom] = useState<1 | 2>(1);
  const active = pathname === "/" ? homeRoom : (routeRoom?.number ?? 1);

  useEffect(() => {
    if (pathname !== "/") return;
    const lounge = document.getElementById("room-house");
    if (!lounge) return;
    const pick = () => {
      const { top } = lounge.getBoundingClientRect();
      setHomeRoom(top <= window.innerHeight / 2 ? 2 : 1);
    };
    const raf = requestAnimationFrame(pick);
    window.addEventListener("scroll", pick, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", pick);
    };
  }, [pathname]);


  if (!routeRoom) return null;
  const current = ROOMS[active - 1];

  return (
    <>
      {/* Desktop rail */}
      <nav
        aria-label="Rooms of the house"
        className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
      >
        <span
          aria-hidden
          className="mb-2 text-[0.5rem] uppercase tracking-[0.28em] text-cream/60"
          style={{ writingMode: "vertical-rl" }}
        >
          {roomLabel(current)}
        </span>
        {ROOMS.map((r) => {
          const isActive = r.number === active;
          return (
            <Link
              key={r.slug}
              href={r.href}
              aria-current={isActive ? "location" : undefined}
              aria-label={roomLabel(r)}
              title={roomLabel(r)}
              className="group flex min-h-5 items-center justify-end gap-2 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-champagne"
            >
              <span className="room-progress-link opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 text-cream/80">
                {String(r.number).padStart(2, "0")}
              </span>
              <span
                aria-hidden
                className="block h-px transition-all duration-500"
                style={{
                  width: isActive ? "1.75rem" : "0.75rem",
                  background: isActive
                    ? "var(--color-rose)"
                    : "color-mix(in srgb, var(--color-cream) 30%, transparent)",
                }}
              />
            </Link>
          );
        })}
      </nav>

      {/* 12 Sept 2026: the phone pill that lived here is gone — the Founder
          Key (FounderKey.tsx) is the one house control on a phone now, and
          it opens the full map rather than a list. The desktop rail stays. */}
    </>
  );
}
