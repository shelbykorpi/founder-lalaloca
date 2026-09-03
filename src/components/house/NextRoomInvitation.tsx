import { EmeraldDoorPortal } from "./EmeraldDoorPortal";
import { nextRoom, roomLabel, type Room } from "@/lib/rooms";

/**
 * THE END OF EVERY PAGE — an architectural invitation into the next room.
 *
 * A pair of emerald doors, the next room visible through them, its number
 * and name written on the threshold. It is a real link; the doors are the
 * link. On phones the doorway keeps its atmosphere but the button under it
 * is full width and always reachable without touching the picture.
 */
export function NextRoomInvitation({ room, note }: { room: Room; note?: string }) {
  const next = nextRoom(room);
  return (
    <section
      aria-labelledby={`next-room-${room.slug}`}
      className="house-marble relative overflow-hidden py-16 md:py-24"
    >
      <div className="shell grid items-center gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
        <div>
          <p className="room-label">Next door</p>
          <h2 id={`next-room-${room.slug}`} className="headline-house mt-5 text-balance text-cream">
            Walk on. Every door here opens for you.
          </h2>
          <p className="mt-6 max-w-[34ch] text-[0.9375rem] leading-relaxed text-cream/75">
            {note ?? room.through}
          </p>
          <p className="mt-6 text-[0.6875rem] uppercase tracking-[0.22em] text-rose">
            Next · {roomLabel(next)}
          </p>
          <a href={next.href} className="btn btn-primary mt-6 w-full sm:w-auto lg:hidden">
            Walk in
          </a>
        </div>
        <EmeraldDoorPortal
          href={next.href}
          through={next.hero.src}
          throughAlt={next.hero.alt}
          label={next.name}
          eyebrow={`Room ${String(next.number).padStart(2, "0")}`}
          className="w-full"
        />
      </div>
    </section>
  );
}
