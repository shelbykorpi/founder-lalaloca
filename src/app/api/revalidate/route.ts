import { revalidateTag } from "next/cache";

/**
 * Shopify → site freshness, without a deploy.
 *
 * Shopify's `products/create` and `products/update` webhooks POST here; the
 * handler bursts the "shopify-catalog" cache tag so the next request re-reads
 * the catalog. Belt and braces with the 60-second revalidate on the readers —
 * the webhook makes changes near-instant, and if the webhook ever silently
 * dies the site is still never more than a minute stale.
 *
 * AUTH: `?secret=` must match REVALIDATE_SECRET (falling back to
 * SHOPIFY_CLIENT_SECRET, the same fallback unsubscribe links use). This
 * endpoint only busts a cache, so the blast radius of a leaked secret is
 * extra reads — but there is no reason to let the internet spend our Shopify
 * rate limit.
 *
 * Set up in Shopify: Settings → Notifications → Webhooks → Create webhook,
 * events "Product creation" and "Product update", format JSON, URL
 * https://www.founderbeauty.co/api/revalidate?secret=<REVALIDATE_SECRET>.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET ?? process.env.SHOPIFY_CLIENT_SECRET;
  const given = new URL(request.url).searchParams.get("secret");

  if (!secret || given !== secret) {
    return Response.json({ ok: false }, { status: 401 });
  }

  /* Next 16 signature: the second argument is the cache profile to apply
     to re-reads; "max" = serve stale while revalidating in the background. */
  revalidateTag("shopify-catalog", "max");
  return Response.json({ ok: true, revalidated: "shopify-catalog" });
}
