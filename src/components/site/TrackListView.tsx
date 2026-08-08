"use client";

import { useEffect } from "react";
import { toTrackItem, track } from "@/lib/analytics";

/**
 * Fires `view_item_list` once when a product listing renders.
 *
 * WHY IT IS A COMPONENT AND NOT A LINE IN THE PAGE. /shop is a server
 * component, and analytics only exist in the browser. Rather than turn the
 * whole page into a client component — which would ship the comparison table,
 * the parlour section and the policy copy to the browser as JavaScript for no
 * reason — this is a leaf that renders nothing and runs one effect.
 *
 * WHY IT MATTERS. view_item_list is the top of GA4's ecommerce funnel. Without
 * it the first measurable step is select_item, so the reports can tell you how
 * many people opened a door but not how many saw the doors and didn't — which
 * is the only number that says whether the shop page is working.
 */
export function TrackListView({
  items,
  listId,
  listName,
}: {
  items: { slug: string; name: string; category: string; price: number }[];
  listId: string;
  listName: string;
}) {
  useEffect(() => {
    if (items.length === 0) return;
    track("product_list_view", {
      item_list_id: listId,
      item_list_name: listName,
      items: items.map((product, index) =>
        toTrackItem(product, { index, item_list_id: listId, item_list_name: listName }),
      ),
    });
    /* Once per mount. The list does not change without a navigation. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
