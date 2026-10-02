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

/* Shelby's own Salon imagery (2 Oct 2026: "update and replace the current
   images with these in the salon"). Composed mood images of a Salon evening,
   not photographs of an event that has happened; the note under the tiles
   says so, the same way the FOUND HER wall's artwork is captioned. */
const ROOMS = [
  {
    name: "The Dinners",
    line: "A long table, low candlelight and the kind of conversation that makes you miss your ride home.",
    image: "/editorial/salon/salon-lounge.webp",
    alt: "A candlelit FOUNDER evening above the city at night: guests in gowns with champagne, a velvet sofa, and a gilded arch holding FOUNDER and LALALOCA bottles among white orchids.",
    position: "64% 50%",
  },
  {
    name: "The Parties",
    line: "Dressed up, music up, phones down. The nights the house will still be talking about on Monday.",
    image: "/editorial/salon/salon-gala.webp",
    alt: "A black-tie evening in a marble hall under crystal chandeliers: a woman in a sequinned black gown with champagne, guests on a red-carpeted staircase behind a velvet rope.",
    position: "45% 45%",
  },
  {
    name: "The Escapes",
    line: "A few days away with women who are building something. Somewhere beautiful. Somewhere quiet.",
    image: "/editorial/salon/salon-escape.webp",
    alt: "Two women in silk gowns with champagne on a candlelit terrace beside a lit pool, a full moon over the sea and coastline behind them, FOUNDER on the marble wall.",
    position: "50% 50%",
  },
  {
    name: "The First Look",
    line: "New pieces and new rooms, shown to the Salon before they ever reach the shelf.",
    image: "/editorial/salon/salon-first-look.webp",
    alt: "Women in gold and black silk trying FOUNDER products at a candlelit marble bar, the wall behind lettered FOUNDER. FOUND HER., the city lit up through the windows.",
    position: "60% 50%",
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
                <li key={room.name} className="group relative isolate flex min-h-[30rem] flex-col justify-end overflow-hidden border border-bronze/20">
                  <Image
                    src={room.image}
                    alt={room.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 23vw"
                    className="-z-10 object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
                    style={{ objectPosition: room.position }}
                  />
                  <span aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(9,23,18,0)_0%,rgba(9,23,18,0)_42%,rgba(9,23,18,0.78)_72%,rgba(9,23,18,0.96)_100%)]" />
                  <div className="p-6">
                    <span aria-hidden className="block h-px w-8 bg-champagne" />
                    <h3 className="mt-4 font-serif text-[1.85rem] font-light leading-none text-cream">{room.name}</h3>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-cream/78">{room.line}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-center text-[0.75rem] leading-relaxed text-cream/55">
              Imagery shows the mood of a Salon evening, not a past event.
            </p>
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
