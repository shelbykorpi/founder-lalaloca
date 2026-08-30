"use client";

import { useEffect, useState } from "react";

/**
 * The room rail — the vertical index down the right edge of /after-hours.
 *
 * It is decoration with a job: it tells a woman how far into the house she is
 * and what the room she is standing in is called. That is the one thing the
 * seven-room structure needs and a normal scrollbar cannot say.
 *
 * IT IS NOT NAVIGATION. Every room is also reachable by scrolling and by the
 * links in the page, so the rail is aria-hidden rather than a landmark full of
 * anchor links a screen-reader user has to walk past. Marking it up as a real
 * nav would add a duplicate route list to every page announcement and buy
 * nothing — the rooms are already headings.
 *
 * Hidden below lg: on a phone it would sit on top of the copy, and the room
 * headings do the same job in a single column.
 */
export function RoomRail({ rooms }: { rooms: { id: string; label: string }[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const nodes = rooms
      .map((r) => document.getElementById(r.id))
      .filter((n): n is HTMLElement => Boolean(n));
    if (!nodes.length) return;

    /* Whichever room owns the middle of the viewport is the room she is in.
       Threshold-based observers flicker on tall sections; this does not. */
    const pick = () => {
      const mid = window.innerHeight / 2;
      let best = 0;
      nodes.forEach((node, i) => {
        const { top } = node.getBoundingClientRect();
        if (top <= mid) best = i;
      });
      setActive(best);
    };

    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, [rooms]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
    >
      <span
        className="mb-2 text-[0.5rem] uppercase tracking-[0.28em] text-cream/55"
        style={{ writingMode: "vertical-rl" }}
      >
        {rooms[active]?.label}
      </span>
      {rooms.map((room, i) => (
        <span
          key={room.id}
          className="block h-px transition-all duration-500"
          style={{
            width: i === active ? "1.75rem" : "0.75rem",
            background:
              i === active ? "var(--color-champagne)" : "color-mix(in srgb, var(--color-cream) 30%, transparent)",
          }}
        />
      ))}
    </div>
  );
}
