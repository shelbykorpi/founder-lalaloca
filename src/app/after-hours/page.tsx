import { permanentRedirect } from "next/navigation";

/**
 * /after-hours was the scaffolding, and the building is up.
 *
 * The dark house was built here first so it could be walked on the real
 * domain, against the real catalogue, without touching a homepage that was
 * selling. It took the front door on 30 August. This stays as a permanent
 * redirect rather than a deleted file because the URL was shared while the
 * work was in progress and a 404 is a worse answer than the page itself.
 */
export const metadata = { robots: { index: false, follow: false } };

export default function AfterHoursMoved() {
  permanentRedirect("/");
}
