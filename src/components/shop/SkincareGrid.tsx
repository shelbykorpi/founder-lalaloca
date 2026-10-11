import { SkincareCard } from "./SkincareCard";
import { TrackListView } from "@/components/site/TrackListView";
import { isSoldOut, type SkincareItem } from "@/lib/skincare";

/** A row of SkincareCards with GA4's view_item_list fired once. */
export function SkincareGrid({
  items,
  availability,
  listId,
  listName,
  className = "",
}: {
  items: SkincareItem[];
  availability: Record<string, boolean> | null | undefined;
  listId: string;
  listName: string;
  className?: string;
}) {
  return (
    <>
      <TrackListView
        items={items.map((i) => ({ slug: i.bag?.slug ?? i.slug, name: i.name, category: i.category, price: i.price }))}
        listId={listId}
        listName={listName}
      />
      <ul className={`grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 ${className}`}>
        {items.map((item, index) => (
          <li key={item.slug}>
            <SkincareCard
              item={item}
              soldOut={isSoldOut(item, availability)}
              listId={listId}
              listName={listName}
              index={index}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
