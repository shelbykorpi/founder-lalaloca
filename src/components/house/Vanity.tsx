"use client";

/**
 * THE VANITY — Room 03. Five products standing on the console of a real room,
 * in the order they are used, where the mirror light follows your attention.
 *
 * See vanity.module.css for the rule it is built on: the product is never
 * dimmed. This file owns only the lighting — which piece is lit, and how it
 * got lit (hover, tap, key, the slide on a phone, or the ritual playing).
 * Data is page.tsx's LINE, read from the repo, so a price or a name changes
 * here when it changes there.
 */

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import s from "./vanity.module.css";

export type VanityItem = {
  n: string;
  archetype: string;
  name: string;
  descriptor: string;
  action: string;
  href: string;
  alt: string;
  /** The line the placard speaks in — the product's own hook. */
  hook?: string;
};

type Slug = "opening-line" | "clean-break" | "hold-the-room" | "double-take" | "smooth-talker";

/* The cutouts, the step each product belongs to, its tick colour, and its
   height as a percentage of the tallest piece — so all five stand at one
   true scale. Heights measured from the cutouts themselves. */
const PIECES: Record<Slug, { src: string; step: string; tick: string; h: number; w: number; ph: number }> = {
  "opening-line":  { src: "/products/opening-line-vanity.webp",  step: "01 · Cleanse", tick: "#F7EFE8", h: 99.5,  w: 350, ph: 1199 },
  "clean-break":   { src: "/products/clean-break-vanity.webp",   step: "02 · Cleanse", tick: "#F7EFE8", h: 100,   w: 337, ph: 1205 },
  "hold-the-room": { src: "/products/hold-the-room-vanity.webp", step: "03 · Treat",   tick: "#D8A7A0", h: 97.6,  w: 692, ph: 1176 },
  "double-take":   { src: "/products/double-take-vanity.webp",   step: "04 · Treat",   tick: "#D8A7A0", h: 63.3,  w: 729, ph: 763 },
  "smooth-talker": { src: "/products/smooth-talker-vanity.webp", step: "05 · Finish",  tick: "#B08A64", h: 71.4,  w: 566, ph: 860 },
};

const slugOf = (href: string): Slug => href.replace(/^\/products\//, "") as Slug;

export function Vanity({ items, title, lede }: { items: VanityItem[]; title: string; lede: string }) {
  const N = items.length;
  /* Hold the Room is the anchor and the campaign piece; it is lit at rest. */
  const [active, setActive] = useState(Math.min(2, N - 1));
  const [playing, setPlaying] = useState(false);
  const paused = useRef(false);
  const shelf = useRef<HTMLDivElement>(null);
  const slots = useRef<(HTMLDivElement | null)[]>([]);
  const reduce = useRef(false);
  const phone = () => typeof window !== "undefined" && window.matchMedia("(max-width: 820px)").matches;

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const light = useCallback(
    (i: number, fromScroll = false) => {
      const next = ((i % N) + N) % N;
      setActive(next);
      if (phone() && !fromScroll) {
        slots.current[next]?.scrollIntoView({ behavior: reduce.current ? "auto" : "smooth", inline: "center", block: "nearest" });
      }
    },
    [N],
  );

  /* The ritual: the light walks the console. Hovering a piece holds it. */
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      if (!paused.current) setActive((a) => (a + 1) % N);
    }, 3200);
    return () => clearInterval(t);
  }, [playing, N]);

  /* On a phone the light follows whatever you slide into the centre. */
  useEffect(() => {
    if (!("IntersectionObserver" in window) || !shelf.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!phone()) return;
        entries.forEach((en) => {
          if (en.isIntersecting && en.intersectionRatio > 0.6) {
            const i = Number((en.target as HTMLElement).dataset.i);
            setActive(i);
          }
        });
      },
      { root: shelf.current, threshold: [0.6] },
    );
    slots.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { light(active + 1); e.preventDefault(); }
      if (e.key === "ArrowLeft") { light(active - 1); e.preventDefault(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, light]);

  const togglePlay = () => {
    if (reduce.current) { light(active + 1); return; } /* no motion: step once */
    if (!playing) setActive(0);
    setPlaying((p) => !p);
  };

  return (
    <section className={s.room} aria-labelledby="vanity-heading">
      <div className={s.words}>
        <p className="eyebrow text-champagne">Room 03 · The Collection</p>
        <h2 id="vanity-heading" className={`${s.title} mt-3 font-serif font-light text-cream`}>{title}</h2>
        <p className="mt-3 max-w-[40ch] text-[0.9rem] leading-relaxed text-cream/70">{lede}</p>
        <button type="button" className={s.play} onClick={togglePlay} aria-pressed={playing}>
          <span className={s.dot} aria-hidden="true" />
          <span>{playing ? "Pause" : "Play the ritual"}</span>
        </button>
      </div>

      <div className={s.lights} aria-hidden="true">
        {items.map((_, i) => (
          <div key={i} className={`${s.light} ${i === active ? s.lightOn : ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element -- a 2 KB alpha webp; next/image would re-encode it for nothing */}
            <img src="/brand/vanity-bulb.webp" alt="" width={70} height={70} />
          </div>
        ))}
      </div>

      {/* Each product is its own link: hover lights it, click enters its room.
          Shelby, 11 Sep — "you should be able to click the actual product". */}
      <div ref={shelf} className={s.shelf} aria-label="The FOUNDER Collection, in ritual order">
        {items.map((it, i) => {
          const p = PIECES[slugOf(it.href)];
          return (
            <div
              key={it.href}
              ref={(el) => { slots.current[i] = el; }}
              data-i={i}
              className={`${s.slot} ${i === active ? s.slotOn : ""}`}
              style={{ "--h": p.h } as React.CSSProperties}
              onMouseEnter={() => { if (!phone()) { paused.current = true; light(i); } }}
              onMouseLeave={() => { paused.current = false; }}
            >
              <span className={s.cone} />
              <Link
                href={it.href}
                className={s.piece}
                aria-label={`${it.name} — ${it.descriptor}. Enter this room.`}
                aria-current={i === active ? "true" : undefined}
                onFocus={() => light(i)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- already-optimised alpha webp cutouts, sized by the true-scale unit in CSS; next/image cannot size by a CSS variable */}
                <img src={p.src} alt={it.alt} width={p.w} height={p.ph} loading={i === 2 ? "eager" : "lazy"} decoding="async" />
              </Link>
              <span className={s.refl} />
            </div>
          );
        })}
      </div>

      <div className={s.placard} aria-live="polite">
        {items.map((it, i) => {
          const p = PIECES[slugOf(it.href)];
          return (
            <div key={it.href} className={`${s.p} ${i === active ? s.pOn : ""}`} style={{ "--stepc": p.tick } as React.CSSProperties}>
              <span className="text-[0.5625rem] uppercase tracking-[0.26em] text-cream/60">
                {p.step}
                <span className={s.tick} aria-hidden="true" />
              </span>
              <h3 className={`${s.name} mt-2 font-serif font-light text-cream`}>
                {it.name}
                <small className="mt-2 block font-sans text-[0.5625rem] uppercase tracking-[0.24em] text-champagne">{it.archetype}</small>
              </h3>
              <p className="mt-3 text-[0.625rem] uppercase tracking-[0.12em] text-cream/70">{it.descriptor}</p>
              {it.hook && <p className="mt-3 font-serif text-[1.05rem] italic leading-snug text-cream/85">{it.hook}</p>}
              <p className="mt-3 font-serif text-[1.3rem] tabular-nums text-cream">{it.action}</p>
              <a
                href={it.href}
                className="mt-3 inline-block border-b border-champagne/45 pb-[3px] text-[0.625rem] uppercase tracking-[0.24em] text-champagne no-underline hover:border-champagne"
              >
                Enter this room →
              </a>
            </div>
          );
        })}
      </div>

      <div className={s.names}>
        {items.map((it, i) => (
          <button key={it.href} type="button" className={`font-serif ${i === active ? s.nameOn : ""}`} onClick={() => light(i)}>
            {it.name}
          </button>
        ))}
      </div>
    </section>
  );
}
