"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getRoom } from "@/lib/rooms";

/**
 * THE ENTRANCE — what happens when "Enter the house" is pressed.
 *
 * A short cinematic beat, not a page:
 *
 *   0.0 s  the emerald entrance doors (the closed-door photograph, split
 *          into two leaves) fill the screen and begin to part — ≈1.6 s
 *   0.4 s  behind them the dressing room — the vanity, the candle, the
 *          blazer on its rail, the note — and the camera drifts forward
 *          into it (a slow scale from 1.1 to 1)
 *   1.4 s  the transition copy fades in, line by line (≈700 ms each)
 *   3.8 s  the dressing room dissolves into the fireplace lounge
 *   4.9 s  the overlay clears and the page is standing in Room 02,
 *          scrolled to the lounge; scrolling continues the journey
 *
 * Escape or the "Skip" control ends it at once. Reduced motion never shows
 * it: the button is then an ordinary in-page link to the lounge. Nothing
 * here delays shopping — the hero's SHOP THE SERUMS is untouched.
 */
const DOOR_MS = 1600;
const CROSSFADE_AT_MS = 3800;
const HOLD_MS = 4900;
const FADE_MS = 900;
const VANITY = "/editorial/rooms/entrance-vanity.webp";

const LINES = [
  "The door closes softly behind you.",
  "The lights are low. On the vanity, a note waits with your name on it.",
];

export function EnterTheHouse({ className = "hairline text-cream" }: { className?: string }) {
  const [playing, setPlaying] = useState(false);
  const [phase, setPhase] = useState<"doors" | "copy" | "lounge" | "leaving">("doors");
  const [doorsOpen, setDoorsOpen] = useState(false);
  const timers = useRef<number[]>([]);
  const skipRef = useRef<HTMLButtonElement>(null);
  const lounge = getRoom(2);

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const arrive = useCallback(() => {
    const node = document.getElementById("room-house");
    node?.scrollIntoView({ behavior: "auto", block: "start" });
    window.history.replaceState(null, "", "#room-house");
    node?.setAttribute("tabindex", "-1");
    node?.focus({ preventScroll: true });
  }, []);

  const finish = useCallback(() => {
    clear();
    setPhase("leaving");
    arrive();
    timers.current.push(
      window.setTimeout(() => {
        setPlaying(false);
        setPhase("doors");
        document.body.style.overflow = "";
      }, FADE_MS),
    );
  }, [arrive]);

  useEffect(() => {
    if (!playing) return;
    document.body.style.overflow = "hidden";
    skipRef.current?.focus({ preventScroll: true });
    /* Two frames after mount, so the closed doors paint once before they
       start to part — otherwise there is nothing to transition from. */
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setDoorsOpen(true)));
    timers.current.push(window.setTimeout(() => setPhase("copy"), 1400));
    timers.current.push(window.setTimeout(() => setPhase("lounge"), CROSSFADE_AT_MS));
    timers.current.push(window.setTimeout(finish, HOLD_MS));
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      clear();
      setDoorsOpen(false);
      document.body.style.overflow = "";
    };
  }, [playing, finish]);

  const onClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      arrive();
      return;
    }
    setPhase("doors");
    setPlaying(true);
  };

  const leaf =
    "absolute inset-y-0 w-1/2 overflow-hidden will-change-transform " +
    "[transition:transform_1600ms_cubic-bezier(0.32,0,0.12,1)]";
  const plate: React.CSSProperties = {
    position: "absolute",
    top: 0,
    width: "100vw",
    height: "100%",
    backgroundImage: "url(/editorial/threshold-doors.webp)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
  const open = doorsOpen;
  const leaving = phase === "leaving";

  return (
    <>
      <a href="#room-house" onClick={onClick} className={className}>
        Enter the house
      </a>

      {/* Portalled to <body>: the hero section isolates its own stacking
          context, so an overlay rendered inside it would sit under the
          header and the rail. */}
      {playing && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Entering the house"
          className="fixed inset-0 z-[70] overflow-hidden bg-night"
          style={{
            opacity: leaving ? 0 : 1,
            transition: `opacity ${FADE_MS}ms ease`,
          }}
        >
          {/* The dressing room, and the camera drifting into it. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${VANITY})`,
              backgroundPosition: "60% center",
              animation: `house-push ${HOLD_MS}ms cubic-bezier(0.22,0.61,0.24,1) forwards`,
            }}
          />
          {/* …which resolves into the lounge before the overlay clears, so
              the page underneath is the room the picture just became. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage: `url(${lounge.hero.src})`,
              backgroundPosition: lounge.hero.position ?? "center",
              opacity: phase === "lounge" || leaving ? 1 : 0,
              transition: "opacity 1100ms ease",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,19,15,0.92)_0%,rgba(7,19,15,0.7)_38%,rgba(7,19,15,0.15)_70%)]"
          />
          <span aria-hidden className="ambient-fire absolute inset-0" />

          {/* The entrance doors, parting. */}
          <div aria-hidden className="absolute inset-0">
            <div
              className={`${leaf} left-0`}
              style={{
                transform: open ? "translateX(-101%)" : "translateX(0)",
                boxShadow: "36px 0 90px rgba(0,0,0,0.55)",
                transitionDelay: "120ms",
              }}
            >
              <div style={{ ...plate, left: 0 }} />
            </div>
            <div
              className={`${leaf} right-0`}
              style={{
                transform: open ? "translateX(101%)" : "translateX(0)",
                boxShadow: "-36px 0 90px rgba(0,0,0,0.55)",
                transitionDelay: "120ms",
              }}
            >
              <div style={{ ...plate, right: 0 }} />
            </div>
          </div>

          {/* The copy, arriving line by line. */}
          <div className="shell relative flex h-full flex-col justify-center">
            <div className="max-w-[30rem]" aria-live="polite">
              {phase !== "doors" && (
                <>
                  <p
                    className="room-label"
                    style={{ animation: "house-copy-in 700ms ease both" }}
                  >
                    Room 02 · Inside FOUNDER
                  </p>
                  {LINES.map((line, i) => (
                    <p
                      key={line}
                      className="mt-5 font-serif text-[clamp(1.5rem,3vw,2.25rem)] leading-snug text-cream"
                      style={{ animation: `house-copy-in 800ms ease ${300 + i * 700}ms both` }}
                    >
                      {line}
                    </p>
                  ))}
                  <p
                    className="hairline mt-8 inline-block text-cream"
                    style={{ animation: "house-copy-in 700ms ease 1900ms both" }}
                  >
                    Follow the light ↓
                  </p>
                </>
              )}
            </div>
          </div>

          <button
            ref={skipRef}
            type="button"
            onClick={finish}
            className="absolute right-5 top-5 z-10 inline-flex min-h-11 items-center border border-cream/30 px-4 text-[0.625rem] uppercase tracking-[0.2em] text-cream/80 hover:border-rose hover:text-rose"
          >
            Skip
          </button>
        </div>,
        document.body,
      )}
    </>
  );
}

/* The door time is exported so the homepage can keep its own copy delay in
   step with it if it ever needs to. */
export const ENTRANCE_DOOR_MS = DOOR_MS;
