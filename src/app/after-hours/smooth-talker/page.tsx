import { permanentRedirect } from "next/navigation";

/**
 * The Smooth Talker plate was built here and promoted to /products/smooth-talker on
 * 30 August. Kept as a permanent redirect rather than deleted: the URL was
 * shared while the work was in progress.
 */
export const metadata = { robots: { index: false, follow: false } };

export default function Moved() {
  permanentRedirect("/products/smooth-talker");
}
