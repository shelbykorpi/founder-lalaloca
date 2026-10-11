"use client";

import Image from "next/image";
import Link from "next/link";
import { AddToBagButton } from "@/components/bag/AddToBagButton";
import { formatPrice } from "@/lib/products";
import { toTrackItem, track } from "@/lib/analytics";
import type { SkincareItem } from "@/lib/skincare";

/**
 * One product, answering the four questions a shopper has (brief, 11 Oct
 * 2026): what is it (category), what does it do (one plain sentence), what
 * does it cost, and how do I buy it (a real add-to-bag on the live Shopify
 * variant, or a shade picker link for Smooth Talker). The name opens the
 * product page; the image does too.
 */
export function SkincareCard({
  item,
  soldOut,
  listId,
  listName,
  index,
}: {
  item: SkincareItem;
  soldOut: boolean;
  listId: string;
  listName: string;
  index: number;
}) {
  const select = () =>
    track("product_select", {
      item_list_id: listId,
      item_list_name: listName,
      items: [toTrackItem(item, { index, item_list_id: listId, item_list_name: listName })],
    });

  return (
    <article className="group flex h-full flex-col border border-bronze/20 bg-night-deep/60">
      <Link
        href={item.href}
        onClick={select}
        aria-label={`${item.name}, ${item.category}`}
        className="relative block aspect-[4/5] overflow-hidden bg-[radial-gradient(70%_60%_at_50%_45%,rgba(214,190,154,0.16)_0%,rgba(9,23,18,0)_70%)]"
      >
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 22vw"
          className="object-contain p-6 transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </Link>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-4 md:px-5">
        <p className="text-[0.625rem] uppercase tracking-[0.2em] text-champagne/80">{item.category}</p>
        <h3 className="mt-2 font-serif text-[1.45rem] leading-none text-cream md:text-[1.6rem]">
          <Link href={item.href} onClick={select} className="hover:text-champagne">
            {item.name}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-[0.875rem] leading-relaxed text-cream/75">{item.what}</p>
        <p className="mt-4 flex items-baseline justify-between gap-3 text-sm text-cream">
          <span className="font-serif text-[1.25rem]">{formatPrice(item.price)}</span>
          <span className="text-[0.75rem] text-cream/60">
            {item.shades ? `${item.shades} shades` : item.size.split(" / ")[0]}
          </span>
        </p>
        {item.note ? <p className="mt-1 text-[0.75rem] text-cream/60">{item.note}</p> : null}
        <div className="mt-4">
          {item.bag ? (
            <AddToBagButton
              product={item.bag}
              href={item.href}
              soldOut={soldOut}
              className="btn btn-primary w-full whitespace-nowrap !px-2 max-sm:!tracking-[0.12em]"
            />
          ) : (
            <Link href={item.href} onClick={select} className="btn btn-primary w-full whitespace-nowrap !px-2 max-sm:!tracking-[0.12em]">
              {soldOut ? "Sold out" : "Choose shade"}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
