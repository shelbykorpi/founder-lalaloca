"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

/**
 * The Salon's door and plaque. Pressing the door does not open it — it
 * turns the plaque over and says, in one breath, who the room is for. The
 * `open` prop is the seam for Phase 3: when a key carries a Salon
 * invitation, the same component swings.
 */
export function SalonDoor({ open = false }: { open?: boolean }) {
  const [asked, setAsked] = useState(false);
  return (
    <div className="max-w-[34rem]">
      <p className="room-label inline-block bg-night-deep/70 px-3 py-1.5 backdrop-blur">
        The house · a door you have not been through
      </p>
      <button
        type="button"
        onClick={() => {
          setAsked(true);
          track("salon_door", { open });
        }}
        aria-expanded={asked}
        className="group mx-auto mt-8 block border border-bronze/60 bg-night-deep/70 px-8 py-6 text-center backdrop-blur transition-[border-color,background-color] duration-[var(--motion-micro)] hover:border-champagne focus-visible:border-champagne focus-visible:outline-none"
      >
        <span className="block font-serif text-[clamp(2rem,4.5vw,3.4rem)] font-light leading-none tracking-[0.04em] text-champagne">
          The Salon
        </span>
        <span className="mt-3 block h-px w-10 bg-bronze/70 group-hover:bg-champagne mx-auto" aria-hidden />
        <span className="mt-3 block text-[0.625rem] uppercase tracking-[0.3em] text-cream/75">
          By invitation
        </span>
      </button>
      <p
        className="mx-auto mt-6 max-w-[30rem] font-serif text-[1.15rem] italic leading-snug text-cream/85 transition-opacity duration-[var(--motion-reveal)]"
        style={{ opacity: asked ? 1 : 0 }}
        aria-live="polite"
      >
        {asked
          ? open
            ? "The door is open for you."
            : "Kept for members, early customers, conversations, events and private launches. The door is shut for now — your key will tell you when it isn’t."
          : ""}
      </p>
      {!asked && (
        <p className="mt-6 text-[0.75rem] uppercase tracking-[0.2em] text-cream/55">Press the plaque</p>
      )}
    </div>
  );
}
