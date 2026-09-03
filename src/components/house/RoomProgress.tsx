"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
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
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

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

      {/* Phone pill + menu */}
      <div className="fixed bottom-4 left-4 z-30 lg:hidden">
        {open && (
          <ul
            id={menuId}
            role="list"
            className="mb-2 w-[min(20rem,calc(100vw-2rem))] border border-bronze/40 bg-night-deep/95 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur"
          >
            {ROOMS.map((r) => (
              <li key={r.slug}>
                <Link
                  href={r.href}
                  aria-current={r.number === active ? "location" : undefined}
                  onClick={() => setOpen(false)}
                  className={`flex min-h-11 items-center gap-3 px-3 text-[0.6875rem] uppercase tracking-[0.18em] ${
                    r.number === active ? "text-rose" : "text-cream/85 hover:text-rose"
                  }`}
                >
                  <span className="font-serif text-base normal-case tracking-normal text-champagne">
                    {String(r.number).padStart(2, "0")}
                  </span>
                  {r.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-11 items-center gap-2 border border-bronze/40 bg-night-deep/90 px-4 text-[0.625rem] uppercase tracking-[0.2em] text-cream backdrop-blur hover:border-rose hover:text-rose"
        >
          <span aria-hidden className="block h-px w-4 bg-rose" />
          {roomLabel(current)}
        </button>
      </div>
    </>
  );
}
