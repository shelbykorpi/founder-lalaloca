import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EmailSignup } from "@/components/site/EmailSignup";
import { SalonDoor } from "@/components/house/SalonDoor";

export const metadata: Metadata = {
  title: "The Salon · By invitation",
  description:
    "The Salon is the room in the FOUNDER house kept for members, early customers, conversations, events and private launches. The door is shut for now. Leave your name.",
  alternates: { canonical: "/salon" },
};

/**
 * THE SALON — the locked door. 12 September 2026.
 *
 * A room you can see and cannot yet enter. Not a paywall and not a tease:
 * it says exactly who the Salon is for and how its doors open, then offers
 * the one honest thing on offer today — the invitation list, which is the
 * Founding List under another plaque. When accounts or invitations exist
 * (Phase 3) this page is where they resolve; the door component already
 * takes an `open` prop.
 */
export default function SalonPage() {
  return (
    <div className="room-dark">
      <section className="relative isolate min-h-[calc(100svh-5rem)] overflow-hidden">
        <Image
          src="/editorial/threshold-doors.webp"
          alt="Tall Founder Green doors with brass hardware, shut, a line of warm light along the seam."
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_45%]"
        />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,33,27,0.35)_0%,rgba(14,33,27,0.15)_40%,rgba(14,33,27,0.92)_100%)]" />
        <div className="shell relative flex min-h-[calc(100svh-5rem)] flex-col items-center justify-end pb-16 pt-24 text-center md:justify-center">
          {/* The plaque is a button, and a heading cannot live inside one, so
              the page's h1 is here for readers and machines (17 Sept 2026,
              audit F-13 — this was the one route with no h1). */}
          <h1 className="sr-only">The Salon · By invitation</h1>
          <SalonDoor />
        </div>
      </section>

      <section className="section bg-night">
        <div className="shell-narrow">
          <p className="room-label">What the Salon is</p>
          <h2 className="mt-5 font-serif text-[clamp(1.8rem,3.2vw,2.6rem)] font-light leading-[1.05] text-cream">
            The room the house keeps for the women in it.
          </h2>
          <div className="mt-8 grid gap-6 text-[1.0625rem] leading-relaxed text-cream/80 md:grid-cols-2 md:gap-10">
            <p>
              Conversations with the women on the gallery wall. First sight of what is coming
              before it is priced. Evenings in the house — real ones, in rooms with doors. The
              things a brand does for the people who were there early, done properly.
            </p>
            <p>
              The door opens for early customers, for the women who write for FOUND HER, and
              by invitation. Not a tier you buy. When it opens for you, your key will say so.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link href="/shop" className="btn btn-primary w-full sm:w-auto">
              Shop the serums
            </Link>
            <Link href="/found-her#share" className="hairline text-cream">
              Write for Found Her
            </Link>
          </div>
        </div>
      </section>

      <section className="section-tight border-t border-bronze/20 bg-night-deep">
        <div className="shell-narrow">
          <EmailSignup
            heading="Leave your name at the door."
            source="waitlist"
          />
        </div>
      </section>
    </div>
  );
}
