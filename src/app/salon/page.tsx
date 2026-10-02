import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SalonEntrance } from "@/components/house/salon/SalonEntrance";

export const metadata: Metadata = {
  title: "The Salon · By invitation",
  description:
    "The Salon is the private room of the FOUNDER house: intimate dinners, late-night parties, escapes and first looks. By invitation. RSVP with your email to receive your key.",
  alternates: { canonical: "/salon" },
};

/**
 * THE SALON — 2 October 2026 (Shelby: "build out The Salon … an invitation
 * … signing up with your email about updates to The Salon where we will hold
 * exclusive events, dinners, parties, escapes … you need the invitation and
 * the key to enter").
 *
 * The entrance (SalonEntrance) holds the sealed invitation, the RSVP that
 * earns the key, and the door. Everything inside the door is this file's
 * children, rendered only once she has turned the key.
 *
 * NOTHING HERE IS A DATE, A PLACE OR A PROMISE OF A SPECIFIC EVENT. None has
 * been announced. The copy describes the kinds of evenings the Salon is for
 * and says, truthfully, that the guest list hears first.
 */

const ROOMS = [
  {
    name: "The Dinners",
    line: "A long table, low candlelight and the kind of conversation that makes you miss your ride home.",
    image: "/editorial/rooms/inside-founder-lounge.webp",
    alt: "A woman in a rose silk gown in a green velvet chair beside a lit fireplace in a dark green panelled room.",
    position: "60% 40%",
  },
  {
    name: "The Parties",
    line: "Dressed up, music up, phones down. The nights the house will still be talking about on Monday.",
    image: "/editorial/rooms/threshold-hall.webp",
    alt: "Tall green doors standing open onto a rose-lit salon with a crystal chandelier, candles burning in brass sconces either side.",
    position: "50% 45%",
  },
  {
    name: "The Escapes",
    line: "A few days away with women who are building something. Somewhere beautiful. Somewhere quiet.",
    image: "/editorial/rooms/found-her-hall-sky.webp",
    alt: "A dark marble hall lined with portraits, a door at the end open onto a pink desert sky.",
    position: "70% 50%",
  },
  {
    name: "The First Look",
    line: "New pieces and new rooms, shown to the Salon before they ever reach the shelf.",
    image: "/editorial/rooms/vanity-dressing-table.webp",
    alt: "A dressing table in the FOUNDER house, brass and marble lit by a ring of vanity bulbs.",
    position: "50% 50%",
  },
];

export default function SalonPage() {
  return (
    <div className="room-dark">
      <SalonEntrance>
        <section className="bg-night py-20 md:py-28" aria-labelledby="inside-heading">
          <div className="shell">
            <div className="mx-auto max-w-[40rem] text-center">
              <p className="room-label">You’re inside</p>
              <span aria-hidden className="mx-auto mt-4 block h-px w-10 bg-rose" />
              <h2
                id="inside-heading"
                className="mt-5 font-serif text-[clamp(2.6rem,6vw,4.6rem)] font-light leading-[0.95] text-cream"
              >
                Welcome to The Salon.
              </h2>
              <p className="mt-6 text-[1.05rem] leading-[1.8] text-cream/78">
                You’re on the guest list. When the house gathers, you hear first: the evening, the
                city, and how many seats there are. There are never many.
              </p>
            </div>

            <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {ROOMS.map((room) => (
                <li key={room.name} className="group relative isolate flex min-h-[26rem] flex-col justify-end overflow-hidden border border-bronze/20">
                  <Image
                    src={room.image}
                    alt={room.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 23vw"
                    className="-z-10 object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
                    style={{ objectPosition: room.position }}
                  />
                  <span aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(9,23,18,0.1)_0%,rgba(9,23,18,0.55)_45%,rgba(9,23,18,0.95)_100%)]" />
                  <div className="p-6">
                    <span aria-hidden className="block h-px w-8 bg-champagne" />
                    <h3 className="mt-4 font-serif text-[1.85rem] font-light leading-none text-cream">{room.name}</h3>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-cream/78">{room.line}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-bronze/15 bg-night-deep py-16 md:py-20">
          <div className="shell grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="room-label">House rules</p>
              <p className="mt-5 max-w-[36rem] font-serif text-[clamp(1.6rem,3vw,2.3rem)] font-light leading-[1.15] text-cream">
                What happens in the Salon is announced to the Salon first.
              </p>
              <p className="mt-5 max-w-[34rem] text-[1rem] leading-[1.8] text-cream/72">
                Watch your inbox. Keep your key. And if there is a woman who belongs in this room,
                tell her where the door is.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 md:justify-end">
              <Link href="/founder-collection" className="btn btn-primary">
                Shop FOUNDER
              </Link>
              <Link href="/found-her#share" className="btn btn-ghost-light">
                Write for FOUND HER
              </Link>
            </div>
          </div>
        </section>
      </SalonEntrance>
    </div>
  );
}
