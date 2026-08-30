import Link from "next/link";

/**
 * The line rail — the strip across the foot of an after-hours product page
 * that lets you step sideways through the collection without going back up to
 * a grid. The product you are on is marked with a gold underline.
 *
 * OPENING LINE JOINED THE RAIL ON 30 AUGUST, and the order changed with it:
 * the rail now runs in routine order — cleanse, cleanse, moisturise, eyes,
 * finish — rather than the arbitrary order it had when it was four campaign
 * SKUs. A rail that reads as a routine teaches the line; one that reads as a
 * grid does not.
 *
 * ONLY PRODUCTS THAT EXIST GO IN IT. Shelby's mock-up includes SIGN HERE,
 * which has no formula, no INCI and no page; board v2.14 keeps it off the site
 * as a product in any form. A name in a navigation rail reads as a thing you
 * can go and look at, so it is left out here and stays a waitlist card on the
 * collection grid.
 *
 * THE WHOLE RAIL IS ONE WORLD. It briefly pointed at `/after-hours/<slug>`
 * while the plates lived there; before that, three of the four links left the
 * dark world mid-line and dropped the shopper onto a cream page. The plates
 * are the live pages now, so it is `/products/` again and there is nowhere
 * left to fall out of.
 */
const LINE = [
  { slug: "opening-line", name: "Opening Line" },
  { slug: "clean-break", name: "Clean Break" },
  { slug: "hold-the-room", name: "Hold the Room" },
  { slug: "double-take", name: "Double Take" },
  { slug: "smooth-talker", name: "Smooth Talker" },
];

export function LineRail({ current }: { current: string }) {
  return (
    <nav
      aria-label="The FOUNDER Collection"
      className="border-t border-bronze/25 bg-night/90 backdrop-blur-sm"
    >
      <ul className="mx-auto flex max-w-[80rem] flex-wrap items-stretch justify-center">
        {LINE.map((item) => {
          const active = item.slug === current;
          return (
            <li key={item.slug} className="flex">
              <Link
                href={`/products/${item.slug}`}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-12 items-center border-b-2 px-5 text-[0.625rem] uppercase tracking-[0.2em] transition-colors sm:px-8 ${
                  active
                    ? "border-bronze text-cream"
                    : "border-transparent text-cream/55 hover:text-cream"
                }`}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
