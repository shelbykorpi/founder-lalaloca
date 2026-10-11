import type { Metadata } from "next";
import Link from "next/link";
import { SkincareGrid } from "@/components/shop/SkincareGrid";
import { AddSetButton } from "@/components/bag/AddToBagButton";
import { BRAND } from "@/lib/brand";
import { FOUNDER_LINE, LALALOCA_LINE, allVariantIds } from "@/lib/skincare";
import { fetchVariantAvailability } from "@/lib/catalog";
import { VARIANT_ID } from "@/lib/shopifyLinks";
import { formatPrice, SET } from "@/lib/products";
import { JsonLd, breadcrumbSchema } from "@/lib/seo";

/**
 * SHOP ALL (11 Oct 2026, clarity brief: Shop → "Shop All"). Every product,
 * both collections, one page, with a real buy button on each, for the
 * shopper who knows she wants skincare and nothing else today. The
 * collection pages (/founder-collection, /shop) keep their own rooms.
 */
const TITLE = "Shop All Skincare";
const DESCRIPTION =
  "All FOUNDER skincare in one place: the five-piece FOUNDER Collection, from Opening Line cleanser to Smooth Talker tone stick, and the three LALALOCA serums. Free US shipping.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/skincare" },
  openGraph: { title: `${TITLE} | FOUNDER`, description: DESCRIPTION, url: "/skincare" },
};

export default async function SkincarePage() {
  const availability = await fetchVariantAvailability([
    ...allVariantIds([...FOUNDER_LINE, ...LALALOCA_LINE]),
    VARIANT_ID["all-three"],
  ]);

  return (
    <div className="room-dark bg-night text-cream">
      <JsonLd schema={breadcrumbSchema([{ name: TITLE, path: "/skincare" }])} />
      <section className="border-b border-bronze/15 bg-night-deep py-14 md:py-20">
        <div className="shell">
          <div className="max-w-[48rem]">
          <p className="room-label">Shop FOUNDER</p>
          <h1 className="mt-4 font-serif text-[clamp(2.4rem,5.6vw,4.2rem)] font-light leading-[0.98] text-cream">
            All skincare
          </h1>
          <p className="mt-5 text-[1rem] leading-[1.75] text-cream/78">
            {BRAND.oneLine} Two collections, eight products: the five-piece FOUNDER Collection,
            cleanse to finish, and the three LALALOCA serums.
          </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16" aria-labelledby="founder-heading">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-bronze/20 pb-4">
            <h2 id="founder-heading" className="font-serif text-[1.8rem] text-cream">
              The FOUNDER Collection
              <span className="ml-3 align-middle text-[0.65rem] uppercase tracking-[0.2em] text-champagne/80">
                Five pieces · one routine
              </span>
            </h2>
            <Link href="/founder-collection" className="hairline text-cream">
              About the collection
            </Link>
          </div>
          <SkincareGrid
            items={FOUNDER_LINE}
            availability={availability}
            listId="shop_all_founder"
            listName="Shop All · FOUNDER Collection"
            className="mt-6 lg:grid-cols-5"
          />
        </div>
      </section>

      <section className="pb-16 md:pb-24" aria-labelledby="lalaloca-heading">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-bronze/20 pb-4">
            <h2 id="lalaloca-heading" className="font-serif text-[1.8rem] text-cream">
              The LALALOCA Serums
              <span className="ml-3 align-middle text-[0.65rem] uppercase tracking-[0.2em] text-champagne/80">
                By FOUNDER · three serums
              </span>
            </h2>
            <Link href="/shop" className="hairline text-cream">
              About the serums
            </Link>
          </div>
          <div className="mt-6 grid gap-3 sm:gap-4 lg:grid-cols-[3fr_1fr]">
            <SkincareGrid
              items={LALALOCA_LINE}
              availability={availability}
              listId="shop_all_lalaloca"
              listName="Shop All · LALALOCA serums"
              className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-3"
            />
            <div className="flex flex-col justify-between border border-bronze/30 bg-[linear-gradient(160deg,rgba(214,190,154,0.12),rgba(9,23,18,0.6))] p-5">
              <div>
                <p className="text-[0.625rem] uppercase tracking-[0.2em] text-champagne/80">The set</p>
                <p className="mt-2 font-serif text-[1.6rem] leading-none text-cream">The House Trio</p>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-cream/75">
                  All three LALALOCA serums, full size, for every kind of day.
                </p>
              </div>
              <div className="mt-6">
                <p className="font-serif text-[1.25rem] text-cream">{formatPrice(SET.price)}</p>
                <AddSetButton
                  className="btn btn-primary mt-4 w-full"
                  soldOut={availability?.[VARIANT_ID["all-three"]] === false}
                />
              </div>
            </div>
          </div>
          <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-2 border-t border-bronze/15 pt-6 text-[0.8125rem] text-cream/70">
            <li>Free US shipping on every order</li>
            <li>Returns within 14 days on unopened pieces</li>
            <li>Secure checkout by Shopify</li>
            <li>
              Not sure where to start?{" "}
              <Link href="/find-your-serum" className="underline underline-offset-4">
                Find your serum
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
