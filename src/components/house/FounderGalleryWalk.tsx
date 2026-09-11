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
 * 11 September 2026. Replaces the five static collection cards on the
 * homepage. One product per brass-trimmed arched bay; the active bay is
 * centred, lit and full size, the neighbours recede either side, and the
 * corridor keeps going past the viewport edge. Walking is drag, trackpad,
 * arrows, keyboard or the bays themselves.
 *
 * WHAT THIS COMPONENT DOES NOT OWN. The product data — name, category, fill,
 * availability line, price line, route — arrives as props from page.tsx,
 * which reads it from nextMove.ts and founderCollection.ts exactly as the
 * cards did. Nothing here formats a price, decides stock, or touches the bag.
 *
 * DESKTOP is a transform carousel: the track translates so the active bay is
 * centred; bays take their scale/rotation from `data-pos` in the stylesheet.
 * MOBILE (< lg) is a native scroll-snap strip: no perspective, the browser
 * owns the swipe, and the active index is read back from scroll position.
 * Vertical scrolling is never trapped — only horizontal wheel intent
 * (trackpad, or shift+wheel) walks the room, so a reader scrolling down the
 * page passes straight through.
 *
 * NO JS: the track is a plain list of product links, all five in the HTML,
 * bay 01 active. Reduced motion: the stylesheet drops the travel and keeps a
 * short opacity change.
 */

export type GalleryWalkItem = {
  n: string;
  archetype: string;
  name: string;
  descriptor: string;
  state: string;
  action: string;
  href: string;
  image: string;
  alt: string;
  ready: boolean;
};

const DRAG_THRESHOLD = 40;
const WHEEL_THRESHOLD = 60;
const WHEEL_COOLDOWN = 700;

export function FounderGalleryWalk({ items }: { items: GalleryWalkItem[] }) {
  const [active, setActive] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);
  const [offset, setOffset] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const bayRefs = useRef<(HTMLLIElement | null)[]>([]);
  const drag = useRef<{ x: number; moved: boolean; id: number } | null>(null);
  const dragMoved = useRef(false);
  const wheelAcc = useRef(0);
  const wheelLock = useRef(0);
  const regionId = useId();
  const liveId = useId();

  const count = items.length;
  const clamp = useCallback((i: number) => Math.max(0, Math.min(count - 1, i)), [count]);
  const go = useCallback((i: number) => setActive(clamp(i)), [clamp]);
  const step = useCallback((d: number) => setActive((a) => clamp(a + d)), [clamp]);

  /* Which mode we are in. Matches the stylesheet's 1023px breakpoint. */
  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  /* Desktop: centre the active bay. Measured, so the bay width can be a
     clamp() in CSS and the maths still lands. */
  useLayoutEffect(() => {
    if (!isDesktop) return;
    const stage = stageRef.current;
    const bay = bayRefs.current[active];
    const track = trackRef.current;
    if (!stage || !bay || !track) return;
    const compute = () => {
      const stageW = stage.clientWidth;
      const bayW = bay.offsetWidth;
      setOffset(stageW / 2 - bayW / 2 - bay.offsetLeft);
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(stage);
    return () => ro.disconnect();
  }, [active, isDesktop]);

  /* Mobile: the browser scrolls; we read the nearest bay back. */
  useEffect(() => {
    if (isDesktop) return;
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const centre = track.scrollLeft + track.clientWidth / 2;
        let best = 0;
        let bestD = Infinity;
        bayRefs.current.forEach((el, i) => {
          if (!el) return;
          const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - centre);
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        });
        setActive(best);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [isDesktop]);

  /* Mobile arrows and keyboard scroll the strip; desktop just sets state. */
  const walkTo = useCallback(
    (i: number) => {
      const target = clamp(i);
      if (isDesktop) {
        go(target);
        return;
      }
      const el = bayRefs.current[target];
      const track = trackRef.current;
      if (!el || !track) return;
      track.scrollTo({
        left: el.offsetLeft + el.offsetWidth / 2 - track.clientWidth / 2,
        behavior: "smooth",
      });
    },
    [clamp, go, isDesktop],
  );

  /* Drag (desktop only — mobile has native swipe). */
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDesktop || e.button !== 0) return;
    drag.current = { x: e.clientX, moved: false, id: e.pointerId };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    if (Math.abs(e.clientX - d.x) > 6) d.moved = true;
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    drag.current = null;
    if (Math.abs(dx) >= DRAG_THRESHOLD) step(dx < 0 ? 1 : -1);
  };
  /* A drag that ends on a bay must not also follow the link. */
  const onClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    if (dragMoved.current) {
      e.preventDefault();
      e.stopPropagation();
      dragMoved.current = false;
    }
  };
  const onPointerUpCapture = (e: PointerEvent<HTMLDivElement>) => {
    if (drag.current && drag.current.moved) dragMoved.current = true;
    onPointerUp(e);
  };

  /* Horizontal wheel only. Vertical intent belongs to the page. Attached
     natively because React registers onWheel as passive, and a passive
     listener cannot stop the browser's own horizontal scroll. */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !isDesktop) return;
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
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [isDesktop, step]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      walkTo(active + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      walkTo(active - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      walkTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      walkTo(count - 1);
    }
  };

  const current = items[active];

  return (
    <section
      aria-labelledby={regionId}
      className={`${styles.room} section pt-10 pb-0`}
      style={
        {
          "--bay-w": "clamp(15rem, 24vw, 22rem)",
          "--gap": "clamp(1.25rem, 3vw, 3rem)",
        } as CSSProperties
      }
    >
      <div className={`shell ${styles.head}`}>
        <p className="room-label">Room 03 · The Collection</p>
        <h2
          id={regionId}
          className="mt-4 font-serif text-4xl leading-[1.02] text-cream md:text-6xl text-balance"
        >
          Choose your next move.
        </h2>
        <p className="mt-3 max-w-prose text-cream/80">
          Walk the room. Every product opens a different door.
        </p>
      </div>

      <div
        ref={stageRef}
        className={`${styles.stage} relative mt-10 md:mt-14`}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="The FOUNDER Collection — walk the room"
        aria-describedby={liveId}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUpCapture}
        onPointerCancel={() => (drag.current = null)}
        onClickCapture={onClickCapture}
        style={{ touchAction: isDesktop ? "pan-y" : undefined, cursor: isDesktop ? "grab" : undefined }}
      >
        <div className={styles.floor} aria-hidden />
        <ul
          ref={trackRef}
          className={`${styles.track} lg:px-0`}
          style={isDesktop ? { transform: `translate3d(${offset}px, 0, 0)` } : undefined}
        >
          {items.map((item, i) => {
            const pos = i - active;
            return (
              <li
                key={item.href}
                ref={(el) => {
                  bayRefs.current[i] = el;
                }}
                className={styles.bay}
                data-pos={Math.max(-2, Math.min(2, pos))}
                aria-current={pos === 0 ? "true" : undefined}
              >
                <Link
                  href={item.href}
                  className={styles.bayLink}
                  draggable={false}
                  onClick={(e) => {
                    /* A click on a neighbour walks to it first; the second
                       click enters the room. The active bay is a plain link. */
                    if (pos !== 0) {
                      e.preventDefault();
                      walkTo(i);
                    }
                  }}
                  aria-label={`${item.name} — ${item.descriptor}. ${item.state}. ${item.action}`}
                >
                  <div className={styles.arch}>
                    <div className={styles.product}>
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 1023px) 70vw, 24vw"
                        priority={i === 0}
                        loading={i === 0 ? "eager" : "lazy"}
                        draggable={false}
                      />
                    </div>
                  </div>
                  <div className={styles.plinth} aria-hidden />
                  <p className={styles.caption} aria-hidden>
                    {item.name}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* The plaque: beside the active bay on desktop, under the strip on
            phones so it never covers packaging. Keyed on the product so the
            content crossfades rather than snapping. */}
        <div className={styles.plaque}>
          <div key={current.href} className={styles.plaqueInner}>
            <p className="room-label">
              {current.n} · {current.archetype}
            </p>
            <p className="mt-3 font-serif text-[1.75rem] font-light uppercase leading-none tracking-[0.02em] text-cream">
              {current.name}
            </p>
            <p className="mt-2 text-[0.8125rem] text-cream/80">{current.descriptor}</p>
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

      {/* Controls and the brass progress line. */}
      <div className={`shell ${styles.controls}`}>
        <div className="flex items-center gap-5">
          <button
            type="button"
            className={styles.arrow}
            onClick={() => walkTo(active - 1)}
            disabled={active === 0}
            aria-label={active > 0 ? `Previous: ${items[active - 1].name}` : "Previous product"}
          >
            <span aria-hidden>←</span>
          </button>
          <div className={`${styles.progress} flex-1`}>
            <span
              className={styles.progressLine}
              style={{ width: `${(100 / (count - 1)) * active}%` }}
              aria-hidden
            />
            {items.map((item, i) => (
              <button
                key={item.href}
                type="button"
                className={styles.tick}
                style={{ left: `${(100 / (count - 1)) * i}%` }}
                data-active={i === active}
                onClick={() => walkTo(i)}
                aria-label={`Go to ${item.name}`}
                aria-current={i === active ? "true" : undefined}
              />
            ))}
          </div>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => walkTo(active + 1)}
            disabled={active === count - 1}
            aria-label={active < count - 1 ? `Next: ${items[active + 1].name}` : "Next product"}
          >
            <span aria-hidden>→</span>
          </button>
        </div>
        <p className="mt-5 text-center text-[0.5625rem] uppercase tracking-[0.22em] text-cream/60">
          <span className="hidden lg:inline">Drag to walk the room</span>
          <span className="lg:hidden">Swipe to walk the room</span>
        </p>
        <p id={liveId} className="sr-only" aria-live="polite">
          {current.n} · {current.name}. {current.descriptor}. {current.state}. {current.action}.
        </p>
      </div>
      </div>

    </section>
  );
}
