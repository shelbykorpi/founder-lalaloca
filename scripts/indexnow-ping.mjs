#!/usr/bin/env node
/**
 * Tell Bing (and Yandex, Seznam, Naver) that URLs changed — now, not whenever
 * they next crawl.
 *
 *   INDEXNOW_KEY=<key> node scripts/indexnow-ping.mjs                 # whole sitemap
 *   INDEXNOW_KEY=<key> node scripts/indexnow-ping.mjs /shop /products/thirst-trap
 *
 * With no arguments it reads the live sitemap and submits every URL in it.
 * With arguments it submits only those paths, which is what you want after
 * editing one page.
 *
 * Generate a key once — any 8–128 character hex string:
 *   node -e "console.log(crypto.randomUUID().replace(/-/g,''))"
 * then set it in Vercel as INDEXNOW_KEY (all environments) and redeploy, so
 * /indexnow-key.txt starts serving it. The endpoint verifies that file before
 * accepting anything, so a ping sent before the redeploy will be rejected.
 *
 * IndexNow's rate limit is generous but not infinite. Submitting the full
 * sitemap on every deploy is fine; submitting it in a loop is not.
 */

const KEY = process.env.INDEXNOW_KEY;
const HOST = process.env.INDEXNOW_HOST ?? "www.founderbeauty.co";
const ORIGIN = `https://${HOST}`;

if (!KEY) {
  console.error("INDEXNOW_KEY is not set. Nothing submitted.");
  process.exit(1);
}

/** Pull every <loc> out of the live sitemap. */
async function urlsFromSitemap() {
  const response = await fetch(`${ORIGIN}/sitemap.xml`);
  if (!response.ok) {
    throw new Error(`sitemap.xml returned ${response.status}`);
  }
  const xml = await response.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
}

const args = process.argv.slice(2);
const urlList = args.length
  ? args.map((path) => (path.startsWith("http") ? path : `${ORIGIN}${path}`))
  : await urlsFromSitemap();

if (!urlList.length) {
  console.error("No URLs to submit.");
  process.exit(1);
}

/* Confirm the key file is actually being served before submitting. The API
   returns a bare 403 if it can't fetch the key, with no explanation of why,
   so checking here turns a mystery into a sentence. */
const keyCheck = await fetch(`${ORIGIN}/indexnow-key.txt`);
const served = keyCheck.ok ? (await keyCheck.text()).trim() : null;
if (served !== KEY) {
  console.error(
    `${ORIGIN}/indexnow-key.txt does not serve this key ` +
      `(got ${served === null ? `HTTP ${keyCheck.status}` : "a different value"}).\n` +
      `Set INDEXNOW_KEY in Vercel and redeploy first — the endpoint checks that file.`,
  );
  process.exit(1);
}

const response = await fetch("https://api.indexnow.org/IndexNow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `${ORIGIN}/indexnow-key.txt`,
    urlList,
  }),
});

/* 200 and 202 both mean accepted. 422 usually means a URL in the list is on a
   different host than `host`. */
if (response.ok) {
  console.log(`Submitted ${urlList.length} URL(s) to IndexNow — HTTP ${response.status}`);
} else {
  console.error(`IndexNow returned HTTP ${response.status}`);
  console.error(await response.text());
  process.exit(1);
}
