import type { ReactNode } from "react";
import { NextRoomInvitation } from "./NextRoomInvitation";
import { RoomProgress } from "./RoomProgress";
import { getRoom } from "@/lib/rooms";

/**
 * HOUSE SHELL — wraps a page in its room.
 *
 * Sets the room on the DOM (`data-room`), mounts the rail, keeps the dark
 * ground continuous from hero to footer, and closes the page with the doors
 * into the next room. Every route that is a room in the loop uses it; the
 * utility routes (policies, search, account) stay as they are.
 */
export function HouseShell({
  room,
  children,
  invitation = true,
  invitationNote,
}: {
  room: number;
  children: ReactNode;
  invitation?: boolean;
  invitationNote?: string;
}) {
  const r = getRoom(room);
  return (
    <div data-room={r.slug} className="room-dark">
      <RoomProgress room={room} />
      {children}
      {invitation && <NextRoomInvitation room={r} note={invitationNote} />}
    </div>
  );
}
