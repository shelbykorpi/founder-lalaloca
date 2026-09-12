/**
 * THE HOUSE, HEARD — staged, silent, and shipping no audio (brief §14).
 *
 * 12 September 2026. The brief asks for atmospheric sound to be possible
 * later without being present now: a door latch, a fire, room tone, fabric.
 * The failure mode it names — a page that makes noise at somebody in an open
 * -plan office — is prevented here by construction rather than by care:
 *
 *   1. NOTHING AUTOPLAYS. `play()` is a no-op unless a person has turned
 *      sound on, and the only way that happens is `setEnabled(true)` from a
 *      control she pressed. Default off, always, including a first visit.
 *   2. NO FILES ARE SHIPPED. `CUES` maps a cue to a path under /sound/, and
 *      that directory does not exist yet. A cue with no file resolves to
 *      silence and never throws, so the house is fully functional deaf —
 *      which is how it ships today and how it will ship if the recordings
 *      are never made.
 *   3. THE PREFERENCE IS HERS AND IT PERSISTS. localStorage, wrapped, so a
 *      browser with site data blocked simply stays silent.
 *   4. REDUCED MOTION IS TAKEN AS REDUCED EVERYTHING. A woman who has asked
 *      her machine to stop moving things has not asked for a fireplace.
 *
 * WHEN THE RECORDINGS EXIST, the work is: drop the files in /public/sound/,
 * and add the control (a small speaker in the Founder Key dock — the key is
 * already the house's one ambient control). No component needs to change;
 * they call `useHouseSound().play("latch")` and it either sounds or it does
 * not. Callers are already free to do that today.
 */

export type Cue = "latch" | "fire" | "room" | "fabric";

/** Where each cue's recording will live. None of these files exist yet. */
export const CUES: Record<Cue, string> = {
  latch: "/sound/door-latch.mp3",
  fire: "/sound/fireplace.mp3",
  room: "/sound/room-tone.mp3",
  fabric: "/sound/fabric.mp3",
};

export const SOUND_STORAGE = "founder:sound:v1";

export function soundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    return window.localStorage.getItem(SOUND_STORAGE) === "on";
  } catch {
    return false;
  }
}

export function setSoundEnabled(on: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SOUND_STORAGE, on ? "on" : "off");
  } catch {
    /* blocked storage — the house stays silent, which is the safe default */
  }
}

/**
 * Sound a cue, if and only if she has asked for sound. Returns whether
 * anything was actually played, so a caller can fall back to a visual beat
 * rather than assuming it was heard.
 */
export function playCue(cue: Cue, volume = 0.35): boolean {
  if (!soundEnabled()) return false;
  const src = CUES[cue];
  if (!src) return false;
  try {
    const audio = new Audio(src);
    audio.volume = Math.min(1, Math.max(0, volume));
    /* A rejected play() is the browser's autoplay policy doing its job. It is
       swallowed on purpose: a missing sound must never surface as an error. */
    void audio.play().catch(() => {});
    return true;
  } catch {
    return false;
  }
}

/** The whole surface a component needs. Safe to call during render. */
export function useHouseSound() {
  return { enabled: soundEnabled, setEnabled: setSoundEnabled, play: playCue };
}
