import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * The site-wide share card: the Open the Door photograph with the campaign
 * lockup and the FOUNDER/BEAUTY wordmark, pre-composed in
 * public/brand/og-home.png.
 *
 * It replaced founder-primary-green.png on 14 August 2026 — that PNG carries
 * the retired wide-tracked FOUNDER with the F-key fused to it, both of which
 * the board prohibits in the master lockup. Do not point this back at it.
 * Routes with their own opengraph-image (products, Found Her profiles) still
 * override this.
 */
export const alt = "Open the Door. The Room Is Yours. — FOUNDER Beauty";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const png = await readFile(
    join(process.cwd(), "public/brand/og-home.png"),
  );
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": contentType },
  });
}
