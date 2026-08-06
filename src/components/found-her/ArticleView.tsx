"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/** Fires the article-view event once per mount. Renders nothing. */
export function ArticleView({ slug }: { slug: string }) {
  useEffect(() => {
    track("found_her_article_view", { article: slug });
  }, [slug]);
  return null;
}
