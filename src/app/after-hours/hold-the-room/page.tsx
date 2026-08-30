import { permanentRedirect } from "next/navigation";

/**
 * The Hold the Room plate was built here and promoted to /products/hold-the-room on
 * 30 August. Kept as a permanent redirect rather than deleted: the URL was
 * shared while the work was in progress.
 */
export const metadata = { robots: { index: false, follow: false } };

export default function Moved() {
  permanentRedirect("/products/hold-the-room");
}
