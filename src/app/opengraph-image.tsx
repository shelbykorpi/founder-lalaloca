import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * v3.0 identity: the site-wide OG / social share image is the primary lockup
 * on Founder Green (public/brand/founder-primary-green.png), per the Website
 * Alignment Spec §1. Routes with their own opengraph-image (products,
 * Found Her profiles) still override this.
 */
export const alt = "FOUNDER";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const png = await readFile(
    join(process.cwd(), "public/brand/founder-primary-green.png"),
  );
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": contentType },
  });
}
