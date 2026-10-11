"use client";

import { useState } from "react";

/**
 * NOW PLAYING (Shelby, 2 Oct 2026): "Spin In The Dark" by The Bela Vibe.
 *
 * Click to load (11 Oct 2026 audit): the Spotify embed pulled about 810KB of
 * third-party script on every homepage visit, even with loading="lazy", and
 * was the largest single cost on a phone. Now nothing from Spotify loads
 * until she presses play; then Spotify's own licensed embed appears in
 * place. Spotify may set cookies once loaded, as the privacy policy says.
 */
export function NowPlaying() {
  const [on, setOn] = useState(false);
  return (
    <div className="mt-10 grid gap-4 border-t border-bronze/10 pt-6 md:grid-cols-[minmax(0,1fr)_26rem] md:items-center md:gap-8">
      <div>
        <span className="block text-[0.56rem] uppercase tracking-[0.22em] text-champagne/70">
          Now playing in the house
        </span>
        <span className="mt-2 block font-serif text-[1.35rem] text-cream">Spin In The Dark</span>
        <span className="mt-1 block text-sm text-cream/60">The Bela Vibe</span>
      </div>
      {on ? (
        <iframe
          title="Spin In The Dark by The Bela Vibe, on Spotify"
          src="https://open.spotify.com/embed/track/7dY2Gy12KLH8LkxcneRKce?utm_source=generator&theme=0"
          width="100%"
          height="80"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          className="block w-full rounded-[12px] border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setOn(true)}
          className="flex h-20 w-full items-center gap-4 rounded-[12px] border border-bronze/25 bg-night px-5 text-left transition-colors hover:border-champagne"
        >
          <span aria-hidden className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-champagne text-night">
            <svg viewBox="0 0 16 16" className="ml-0.5 h-4 w-4" fill="currentColor"><path d="M4 2.5v11l9-5.5z" /></svg>
          </span>
          <span>
            <span className="block text-sm text-cream">Play on Spotify</span>
            <span className="block text-[0.7rem] text-cream/55">Loads Spotify’s player</span>
          </span>
        </button>
      )}
    </div>
  );
}
