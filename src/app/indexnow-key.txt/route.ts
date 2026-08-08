/**
 * IndexNow key file.
 *
 * WHAT INDEXNOW IS. Normally you publish a page and then wait — days, sometimes
 * weeks — for a crawler to notice. IndexNow inverts that: you ping a single
 * endpoint the moment a URL changes and Bing, Yandex, Seznam and Naver all pull
 * it immediately. Bing matters disproportionately here, because ChatGPT's web
 * search leans on Bing's index. Faster into Bing is faster into ChatGPT.
 *
 * Google does not participate. This costs nothing and does not affect Google
 * either way.
 *
 * WHY THE KEY LIVES AT A FIXED PATH INSTEAD OF `/<key>.txt`. The protocol's
 * default is to host the key at `https://host/<key>.txt`, which cannot be
 * expressed as an App Router segment — a dynamic segment has to be the whole
 * segment, so `[key].txt` is not a valid folder name. The protocol also allows
 * an explicit `keyLocation` in the submission payload for exactly this reason.
 * `scripts/indexnow-ping.mjs` sends it.
 *
 * Inert without INDEXNOW_KEY, and deliberately 404s rather than serving an
 * empty file — an empty key file is a failed verification, which is worse than
 * no key file at all.
 */

export const dynamic = "force-static";

export function GET() {
  const key = process.env.INDEXNOW_KEY;

  if (!key) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(key, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=86400",
    },
  });
}
