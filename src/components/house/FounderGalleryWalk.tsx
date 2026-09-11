"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import styles from "./gallery-walk.module.css";

/**
 * FOUNDER GALLERY WALK — Room 03 as a corridor.
 *
 * 11 September 2026, second pass. The room is Shelby's render, used as one
 * plate; the walk is a camera move across it. Five bays live at fixed
 * positions in the frame (BAYS below, as fractions of the plate), and the
 * active one is brought to the centre and nearest the viewer by panning and
 * easing the plate toward it, with a soft spotlight and the plaque following.
 * Bay hotspots are real links inside the moving layer, so every product is
 * reachable by pointer, keyboard and screen reader whatever the camera is
 * doing.
 *
 * WHAT THIS COMPONENT DOES NOT OWN. Name, category, fill, availability,
 * price line and route arrive as props from page.tsx, read from nextMove.ts
 * and founderCollection.ts exactly as the cards were. Nothing here formats a
 * price, decides stock, or touches the bag.
 *
 * DESKTOP: transform camera, drag / trackpad / arrows / ticks / keyboard.
 * MOBILE (< lg): the plate is a panorama in a native scroll-snap strip; the
 * browser owns the swipe and the active bay is read back from scroll
 * position. Vertical scrolling is never captured. Reduced motion keeps the
 * camera but shortens it and drops the fades.
 *
 * THE PLATE. public/editorial/rooms/collection-gallery-walk.webp is the
 * mock-up with its baked-in header, headline, plaque, arrows and cue taken
 * out (mirror-patched from the scene's own symmetry). Its products are part
 * of the picture: to change a product's packaging, re-render the plate.
 */

export type GalleryWalkItem = {
  n: string;
  archetype: string;
  name: string;
  descriptor: string;
  state: string;
  action: string;
  href: string;
  /** Unused by the walk (the plate carries the product); kept so page.tsx's
   *  LINE stays one shape for every consumer. */
  image: string;
  alt: string;
  ready: boolean;
};

/* Where each bay stands in the plate, left to right, as a fraction of its
   width, and how close the camera comes. The centre bay is the frame as
   rendered; the others are eased toward until they fill the same space. */
const BAYS = [
  { fx: 0.035, scale: 1.55 },
  { fx: 0.225, scale: 1.28 },
  { fx: 0.5, scale: 1 },
  { fx: 0.775, scale: 1.28 },
  { fx: 0.965, scale: 1.55 },
];
/* 3344 × 1778 — the render, upscaled 4x with Real-ESRGAN and brought down
   to 2x, so a retina 1440 screen gets a true 1:1 plate. Aspect stays
   1672 / 889 in the stylesheet. */
const PLATE = { src: "/editorial/rooms/collection-gallery-walk.webp", w: 3344, h: 1778 };
const PLATE_ALT =
  "The FOUNDER Collection corridor: five lit arched niches in Founder Green walls with brass trim, each product on a black marble plinth, a desert-pink doorway glowing at the far end.";

const DRAG_THRESHOLD = 40;
const WHEEL_THRESHOLD = 60;
const WHEEL_COOLDOWN = 800;

type Camera = { tx: number; ty: number; s: number; bayX: number; sx: number; plaqueLeft: number; plaqueTop: number };

export function FounderGalleryWalk({ items }: { items: GalleryWalkItem[] }) {
  const count = Math.min(items.length, BAYS.length);
  /* Opens on the Anchor — the frame as rendered — so the first paint is the
     mock-up. Deterministic, never auto-rotated. */
  const [active, setActive] = useState(2);
  const [isDesktop, setIsDesktop] = useState(true);
  const [cam, setCam] = useState<Camera | null>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const plaqueRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; id: number; moved: boolean } | null>(null);
  const dragMoved = useRef(false);
  const wheelAcc = useRef(0);
  const wheelLock = useRef(0);
  const headingId = useId();
  const liveId = useId();

  const clamp = useCallback((i: number) => Math.max(0, Math.min(count - 1, i)), [count]);
  const step = useCallback((d: number) => setActive((a) => clamp(a + d)), [clamp]);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  /* Desktop camera: pan and ease the plate so the bay sits centre-frame,
     never showing past the plate's edge. Plaque goes beside the bay, on
     whichever side has room. */
  useLayoutEffect(() => {
    if (!isDesktop) return;
    const scene = sceneRef.current;
    if (!scene) return;
    const compute = () => {
      const W = scene.clientWidth;
      const H = scene.clientHeight;
      const { fx, scale: s } = BAYS[active];
      const tx = Math.min(0, Math.max(W - W * s, W / 2 - fx * W * s));
      const ty = Math.min(0, Math.max(H - H * s, H / 2 - 0.5 * H * s));
      const bayX = tx + fx * W * s;
      const plaqueW = plaqueRef.current?.offsetWidth ?? 300;
      const gap = 0.085 * W * s;
      const right = bayX + gap;
      const plaqueLeft =
        right + plaqueW <= W - 16 ? right : Math.max(16, bayX - gap - plaqueW);
      setCam({ tx, ty, s, bayX, sx: (bayX / W) * 100, plaqueLeft, plaqueTop: H * 0.3 });
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(scene);
    return () => ro.disconnect();
  }, [active, isDesktop]);

  /* Mobile: read the nearest bay back from the strip's scroll position. */
  useEffect(() => {
    if (isDesktop) return;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    if (!scene || !camera) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const centre = scene.scrollLeft + scene.clientWidth / 2;
        const w = camera.clientWidth;
        let best = 0;
        let bestD = Infinity;
        BAYS.slice(0, count).forEach((b, i) => {
          const d = Math.abs(b.fx * w - centre);
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        });
        setActive(best);
      });
    };
    /* Land on the current bay without animating — a phone that opens on bay
       01 when the state says 03 would announce one thing and show another. */
    scene.scrollLeft = BAYS[Math.min(count - 1, 2)].fx * camera.clientWidth - scene.clientWidth / 2;
    scene.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      scene.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [isDesktop, count]);

  const walkTo = useCallback(
    (i: number) => {
      const target = clamp(i);
      if (isDesktop) {
        setActive(target);
        return;
      }
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      if (!scene || !camera) return;
      scene.scrollTo({
        left: BAYS[target].fx * camera.clientWidth - scene.clientWidth / 2,
        behavior: "smooth",
      });
    },
    [clamp, isDesktop],
  );

  /* Drag — desktop only; the phone strip is native. */
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDesktop || e.button !== 0) return;
    drag.current = { x: e.clientX, id: e.pointerId, moved: false };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (d && d.id === e.pointerId && Math.abs(e.clientX - d.x) > 6) d.moved = true;
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    if (d.moved) dragMoved.current = true;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) >= DRAG_THRESHOLD) step(dx < 0 ? 1 : -1);
  };
  const onClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    if (dragMoved.current) {
      e.preventDefault();
      e.stopPropagation();
      dragMoved.current = false;
    }
  };

  /* Horizontal wheel only; vertical intent belongs to the page. Native, so
     preventDefault works (React's onWheel is passive). */
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !isDesktop) return;
    const onWheel = (e: globalThis.WheelEvent) => {
      const horizontal = e.shiftKey ? e.deltaY : e.deltaX;
      const vertical = e.shiftKey ? 0 : e.deltaY;
      if (Math.abs(horizontal) <= Math.abs(vertical)) return;
      e.preventDefault();
      const now = performance.now();
      if (now < wheelLock.current) return;
      wheelAcc.current += horizontal;
      if (Math.abs(wheelAcc.current) >= WHEEL_THRESHOLD) {
        step(wheelAcc.current > 0 ? 1 : -1);
        wheelAcc.current = 0;
        wheelLock.current = now + WHEEL_COOLDOWN;
      }
    };
    scene.addEventListener("wheel", onWheel, { passive: false });
    return () => scene.removeEventListener("wheel", onWheel);
  }, [isDesktop, step]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, number> = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: count - 1 };
    if (e.key in map) {
      e.preventDefault();
      walkTo(map[e.key]);
    }
  };

  const current = items[active];
  const cameraStyle: CSSProperties | undefined =
    isDesktop && cam ? { transform: `translate(${cam.tx}px, ${cam.ty}px) scale(${cam.s})` } : undefined;
  const plaqueStyle: CSSProperties | undefined =
    isDesktop && cam ? { left: cam.plaqueLeft, top: cam.plaqueTop } : undefined;
  const spotStyle =
    isDesktop && cam
      ? ({ "--sx": `${cam.sx}%`, "--sy": "48%" } as CSSProperties)
      : undefined;

  return (
    <section aria-labelledby={headingId} className={styles.room}>
      <div className="relative">
        {/* Copy over the frame, top left, as drawn. */}
        <div className={`${styles.head} px-5 lg:px-0`}>
          <p className="room-label">Room 03 · The Collection</p>
          <h2
            id={headingId}
            className="mt-3 font-serif text-4xl leading-[1.02] text-cream md:text-6xl text-balance"
          >
            Choose your next move.
          </h2>
          <p className="mt-2 max-w-prose text-cream/85 md:text-lg">
            Walk the room. Every product opens a different door.
          </p>
        </div>

        <div
          ref={sceneRef}
          className={styles.scene}
          tabIndex={0}
          role="group"
          aria-roledescription="carousel"
          aria-label="The FOUNDER Collection — walk the room"
          aria-describedby={liveId}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (drag.current = null)}
          onClickCapture={onClickCapture}
          style={isDesktop ? { touchAction: "pan-y" } : undefined}
        >
          <div ref={cameraRef} className={styles.camera} style={cameraStyle}>
            <Image
              src={PLATE.src}
              alt={PLATE_ALT}
              fill
              priority
              quality={90}
              sizes="(max-width: 1023px) 260vw, 100vw"
              draggable={false}
            />
            {/* One link per bay, inside the camera so it travels with the
                plate. Clicking a neighbour walks to it; the active bay is a
                plain link into its room. */}
            <ul className="m-0 list-none p-0">
              {items.slice(0, count).map((item, i) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={styles.hot}
                    style={{ left: `${BAYS[i].fx * 100}%` }}
                    aria-current={i === active ? "true" : undefined}
                    aria-label={`${item.name} — ${item.descriptor}. ${item.state}. ${item.action}`}
                    draggable={false}
                    onClick={(e) => {
                      if (i !== active) {
                        e.preventDefault();
                        walkTo(i);
                      }
                    }}
                  />
                  <span aria-hidden className={styles.snap} style={{ left: `${BAYS[i].fx * 100}%` }} />
                </li>
              ))}
            </ul>
          </div>
          {isDesktop && <div key={active} className={styles.spot} style={spotStyle} aria-hidden />}
        </div>

        {/* The plaque: beside the active bay; under the strip on phones. */}
        <div ref={plaqueRef} className={styles.plaque} style={plaqueStyle}>
          <div key={current.href} className={styles.plaqueInner}>
            <p className="room-label">
              {current.n} · {current.archetype}
            </p>
            <p className="mt-3 font-serif text-[1.65rem] font-light uppercase leading-none tracking-[0.03em] text-cream">
              {current.name}
            </p>
            <p className="mt-2 text-[0.8125rem] text-cream/85">{current.descriptor}</p>
            <p className="mt-4 flex items-center gap-2 text-[0.5625rem] uppercase tracking-[0.18em] text-cream/80">
              <span
                aria-hidden
                className={`block h-[0.3rem] w-[0.3rem] rounded-full ${current.ready ? "bg-champagne" : "bg-cream/35"}`}
              />
              {current.state}
            </p>
            <p className="mt-2 text-[0.5625rem] uppercase tracking-[0.18em] text-champagne">
              {current.action}
            </p>
            <Link href={current.href} className="hairline mt-5 text-cream">
              Enter this room <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowPrev}`}
          onClick={() => walkTo(active - 1)}
          disabled={active === 0}
          aria-label={active > 0 ? `Previous: ${items[active - 1].name}` : "Previous product"}
        >
          <span aria-hidden>←</span>
        </button>
        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowNext}`}
          onClick={() => walkTo(active + 1)}
          disabled={active === count - 1}
          aria-label={active < count - 1 ? `Next: ${items[active + 1].name}` : "Next product"}
        >
          <span aria-hidden>→</span>
        </button>

        <p className={styles.cue} aria-hidden>
          Drag to walk the room
        </p>
      </div>

      {/* The rail: the brass line, one tick per bay, and the phone cue. */}
      <div className={styles.rail}>
        <div className="shell">
          <div className={`${styles.progress} mx-8 lg:mx-16`}>
            <span
              className={styles.progressLine}
              style={{ width: `${(100 / (count - 1)) * active}%` }}
              aria-hidden
            />
            {items.slice(0, count).map((item, i) => (
              <span key={item.href}>
                <button
                  type="button"
                  className={styles.tick}
                  style={{ left: `${(100 / (count - 1)) * i}%` }}
                  data-active={i === active}
                  onClick={() => walkTo(i)}
                  aria-label={`Go to ${item.name}`}
                  aria-current={i === active ? "true" : undefined}
                />
                <span
                  className={styles.tickLabel}
                  style={{ left: `${(100 / (count - 1)) * i}%` }}
                  data-active={i === active}
                  aria-hidden
                >
                  {item.name}
                </span>
              </span>
            ))}
          </div>
          <p className="mt-10 text-center text-[0.5625rem] uppercase tracking-[0.22em] text-cream/60 lg:hidden">
            Swipe to walk the room
          </p>
          <p id={liveId} className="sr-only" aria-live="polite">
            {current.n} · {current.name}. {current.descriptor}. {current.state}. {current.action}.
          </p>
        </div>
      </div>
    </section>
  );
}
