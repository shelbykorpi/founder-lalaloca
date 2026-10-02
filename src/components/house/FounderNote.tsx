import { Homemade_Apple, Mrs_Saint_Delafield } from "next/font/google";

/*
 * A note from Shelby, set to look handwritten, beside the shelf where people
 * choose and buy (Shelby, 2 Oct 2026: "a what looks like a hand written note
 * from me near where they go to look and purchase the products and say how
 * each product is hand picked by me and has been used in my daily routines").
 *
 * The two script faces load only where this note renders. They are a
 * deliberate exception to the board's two-family rule (Cormorant + Jost):
 * this is meant to read as her hand, not as the house's type. The text is
 * real HTML, so it is readable by screen readers and search, and it is set
 * large enough to stay legible at phone width.
 */
const hand = Homemade_Apple({ weight: "400", subsets: ["latin"], display: "swap" });
const signature = Mrs_Saint_Delafield({ weight: "400", subsets: ["latin"], display: "swap" });

export const FOUNDER_NOTE = {
  body: [
    "Every product here was hand-picked by me, and every one has been part of my own daily routine before it ever came to you.",
    "If it’s on this shelf, it’s on mine.",
  ],
  signOff: "Shelby",
};

export function FounderNote({ className = "" }: { className?: string }) {
  return (
    <figure
      className={`relative mx-auto w-full max-w-[26rem] -rotate-[1.5deg] bg-[#f7efe4] px-7 pb-7 pt-9 text-[#2b2620] shadow-[0_22px_50px_rgba(0,0,0,0.45)] md:px-9 ${className}`}
      aria-label="A handwritten note from Shelby Korpi, founder"
    >
      {/* A strip of tape holding the card to the wall. */}
      <span
        aria-hidden
        className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-[2deg] bg-[rgba(214,170,160,0.55)] shadow-sm"
      />
      {/* Faint ruled lines, like a note card. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 bottom-6 top-8 bg-[repeating-linear-gradient(180deg,transparent_0,transparent_2.05rem,rgba(43,38,32,0.08)_2.05rem,rgba(43,38,32,0.08)_calc(2.05rem+1px))]"
      />
      <blockquote className={`${hand.className} relative text-[1.02rem] leading-[2.05rem] md:text-[1.08rem]`}>
        {FOUNDER_NOTE.body.map((l) => (
          <span key={l} className="block">
            {l}
          </span>
        ))}
      </blockquote>
      <figcaption className="relative mt-3 text-right">
        <span className={`${signature.className} text-[2.6rem] leading-none text-[#3b2d22]`}>
          {FOUNDER_NOTE.signOff}
        </span>
        <span className="sr-only">, founder of FOUNDER</span>
      </figcaption>
    </figure>
  );
}
