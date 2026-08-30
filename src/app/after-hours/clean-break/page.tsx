import { permanentRedirect } from "next/navigation";

/**
 * The Clean Break plate was built here and promoted to /products/clean-break on
 * 30 August. Kept as a permanent redirect rather than deleted: the URL was
 * shared while the work was in progress.
 */
export const metadata = { robots: { index: false, follow: false } };

export default function Moved() {
  permanentRedirect("/products/clean-break");
}
