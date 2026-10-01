"use client";

import Link from "next/link";
import { useState } from "react";
import s from "./vanity.module.css";

export type VanityItem = {
  n: string;
  archetype: string;
  name: string;
  descriptor: string;
  action: string;
  href: string;
  alt: string;
  hook?: string;
};

type Slug = "opening-line" | "clean-break" | "hold-the-room" | "double-take" | "smooth-talker";

const SCENES: Record<Slug, { src: string; alt: string; position?: string }> = {
  "opening-line": {
    src: "/products/opening-line-card-vanity.webp",
    alt: "Opening Line on a dark green marble basin edge in a low-lit dressing room.",
    position: "50% 50%",
  },
  "clean-break": {
    src: "/products/clean-break-card-dark.webp",
    alt: "Clean Break on dark green marble beside a folded towel and brass tap.",
    position: "50% 52%",
  },
  "hold-the-room": {
    src: "/products/hold-the-room-card-dark.webp",
    alt: "Hold the Room and its carton on a dark marble dressing table in warm low light.",
    position: "50% 50%",
  },
  "double-take": {
    src: "/products/double-take-card-dark.webp",
    alt: "Double Take and its carton on dark green marble in a low-lit dressing room.",
    position: "50% 50%",
  },
  "smooth-talker": {
    src: "/products/smooth-talker-card-dark.webp",
    alt: "Smooth Talker and its carton on a dark marble dressing table.",
    position: "50% 50%",
  },
};

const slugOf = (href: string): Slug => href.replace(/^\/products\//, "") as Slug;

export function Vanity({ items, title, lede }: { items: VanityItem[]; title: string; lede: string }) {
  const [active, setActive] = useState(Math.min(2, items.length - 1));
  const item = items[active];
  const scene = SCENES[slugOf(item.href)];

  return (
    <section className={s.room} aria-labelledby="vanity-heading">
      <div className={s.intro}>
        <div>
          <p className="eyebrow text-champagne">The vanity</p>
          <h2 id="vanity-heading" className={s.title}>{title}</h2>
        </div>
        <p className={s.lede}>{lede}</p>
      </div>

      <div className={s.stage}>
        <div className={s.media} aria-live="polite">
          {items.map((entry, i) => {
            const art = SCENES[slugOf(entry.href)];
            return (
              <figure
                key={entry.href}
                className={`${s.frame} ${i === active ? s.frameOn : ""}`}
                aria-hidden={i !== active}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- source files are already optimized webp campaign assets */}
                <img
                  src={art.src}
                  alt={i === active ? art.alt : ""}
                  loading={i === active ? "eager" : "lazy"}
                  decoding="async"
                  style={{ objectPosition: art.position ?? "center" }}
                />
              </figure>
            );
          })}
          <div className={s.mediaShade} aria-hidden="true" />
          <div className={s.mediaMark}>
            <span>FOUNDER</span>
            <span>{String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
          </div>
        </div>

        <div className={s.detail}>
          <div className={s.detailTop}>
            <p className={s.step}>{String(active + 1).padStart(2, "0")} · {item.archetype}</p>
            <p className={s.descriptor}>{item.descriptor}</p>
          </div>

          <div className={s.detailMain}>
            <p className={s.kicker}>The FOUNDER Collection</p>
            <h3 className={s.name}>{item.name}</h3>
            {item.hook && <p className={s.hook}>{item.hook}</p>}
          </div>

          <div className={s.detailBottom}>
            <p className={s.action}>{item.action}</p>
            <Link href={item.href} className={s.cta}>
              Discover {item.name}
              <span aria-hidden>↗</span>
            </Link>
          </div>
        </div>
      </div>

      <div className={s.rail} role="tablist" aria-label="Choose a FOUNDER Collection product">
        {items.map((entry, i) => (
          <button
            key={entry.href}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`${s.tab} ${i === active ? s.tabOn : ""}`}
            onClick={() => setActive(i)}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
          >
            <span className={s.tabNo}>{String(i + 1).padStart(2, "0")}</span>
            <span className={s.tabName}>{entry.name}</span>
            <span className={s.tabType}>{entry.archetype}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
