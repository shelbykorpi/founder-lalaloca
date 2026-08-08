import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { BRAND } from "./brand";

/**
 * Shared Open Graph card renderer.
 *
 * WHY THIS EXISTS AT ALL. Until now the site set `openGraph.title` and
 * `openGraph.description` but no image, so every share of every page — a
 * Pinterest pin, an Instagram DM, a Slack link, a WhatsApp forward, a
 * Perplexity source card — rendered as a grey box with a URL under it. For a
 * beauty brand that is a strange thing to leave on the floor: the one channel
 * where the picture *is* the click, and there was no picture.
 *
 * It also feeds AI answer engines. Several render a source card with the OG
 * image beside the citation, so this is what FOUNDER looks like when a model
 * quotes it.
 *
 * ONE TYPEFACE, DELIBERATELY. The site sets the wordmark and the small-caps
 * lines in Jost and reserves Cormorant for display. This card is Cormorant
 * throughout. That is a compromise, not an oversight: registering a second face
 * alongside it did not take in the image renderer — every line still came out
 * in the first font — and a card that silently ignores half its type rules is
 * worse than one that is knowingly set in a single face. Revisit if the
 * renderer's font handling changes; the rest of the card is unaffected.
 *
 * WHY IT IS DRAWN RATHER THAN PHOTOGRAPHED. A drawn card stays correct when a
 * price or a product name changes, works for pages that have no photograph
 * (policies, the quiz, a new story), and never ships a stale crop. The
 * photography still wins on the pages that have it — per-route files can
 * override this.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/* Palette, copied from globals.css. Satori has no CSS-variable resolution, so
   these are literals on purpose — if the brand tokens move, move them here. */
const GREEN = "#164d49";
const CREAM = "#f7efe8";
const BRONZE = "#b08a64";

/**
 * Cormorant Garamond, read from the repo rather than fetched.
 *
 * The obvious implementation fetches the font from Google at build time. It is
 * also the wrong one: it makes every deployment depend on a third-party CDN
 * responding, and when it quietly does not, the build still succeeds and ships
 * cards set in the fallback sans — which is exactly the kind of failure nobody
 * notices for a month. The file is 290 KB, it is committed, and it cannot fail.
 *
 * Still wrapped in a try/catch: a missing font should degrade the card, never
 * fail a deployment.
 */
let cached: Buffer | null | undefined;

async function cormorant(): Promise<Buffer | null> {
  if (cached !== undefined) return cached;
  try {
    cached = await readFile(
      join(process.cwd(), "src/lib/fonts/CormorantGaramond-Regular.ttf"),
    );
  } catch {
    cached = null;
  }
  return cached;
}

export async function ogCard({
  eyebrow,
  title,
  footnote,
}: {
  eyebrow: string;
  title: string;
  footnote?: string;
}) {
  const serif = await cormorant();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: GREEN,
          padding: "72px 80px",
          fontFamily: serif ? "Cormorant" : "sans-serif",
        }}
      >
        {/* A hairline frame, the way the doors are framed on the site. */}
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            border: `1px solid ${BRONZE}`,
            opacity: 0.55,
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: BRONZE,

          }}
        >
          {eyebrow}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: title.length > 54 ? 62 : 82,
              lineHeight: 1.08,
              color: CREAM,
              maxWidth: 900,
            }}
          >
            {title}
          </div>
          {footnote ? (
            <div
              style={{
                display: "flex",
                marginTop: 26,
                fontSize: 26,
                color: CREAM,
                opacity: 0.78,

              }}
            >
              {footnote}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

          }}
        >
          <div style={{ display: "flex", fontSize: 30, letterSpacing: 12, color: CREAM }}>
            {BRAND.display}
          </div>
          <div style={{ display: "flex", fontSize: 22, color: BRONZE, letterSpacing: 3 }}>
            {BRAND.tagline}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: serif
        ? [
            {
              name: "Cormorant",
              data: serif as unknown as ArrayBuffer,
              style: "normal" as const,
              weight: 400 as const,
            },
          ]
        : undefined,
    },
  );
}
