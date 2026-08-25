import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AddToBagButton } from "@/components/bag/AddToBagButton";
import { EmailSignup } from "@/components/site/EmailSignup";
import { FOUNDER_COLLECTION } from "@/lib/founderCollection";
import { fetchCollectionProducts, type CatalogProduct } from "@/lib/catalog";
import { LineCard } from "@/components/shop/LineCard";
import { NEXT_MOVE, CAMPAIGN } from "@/lib/nextMove";
import { formatPrice } from "@/lib/products";
import {
  JsonLd,
  breadcrumbSchema,
  faqSchema,
  founderProductSchema,
} from "@/lib/seo";

/**
 * THE FOUNDER COLLECTION.
 *
 * A quieter page than /shop on purpose. The LALALOCA serums earn the door
 * treatment because there are three of them and choosing between them is the
 * whole interaction. This line is one product; a door you can only walk
 * through one way is a corridor. So: editorial column, the facts in full, and
 * no theatre.
 *
 * ON SALE AS A PREORDER since 19 Aug 2026, per Shelby. Hold the Room has a
 * Shopify variant wired in shopifyLinks.ts and `sellable: true`, so the buy
 * module renders in place of the old "Not on sale yet" block.
 *
 * Both branches are kept. OPENING LINE and SIGN HERE will land here with
 * `sellable: false` and must still get the honest waiting-room treatment
 * rather than a dead button.
 *
 * THE PREORDER NOTE IS NOT DECORATION. Shopify holds 0 on hand and sells
 * anyway, while /policies/shipping promises dispatch within one business day.
 * `product.preorder` is the only thing on the page correcting that. If it
 * ever renders empty, the button must not render either.
 */

export const metadata: Metadata = {
  title: "The FOUNDER Collection",
  description:
    "The FOUNDER Collection. Hold the Room — a moisturizing cream with chamomile and witch hazel, 30 ml. The last step, after your serums.",
  alternates: { canonical: "/founder-collection" },
};

export default async function FounderCollectionPage() {
  const product = FOUNDER_COLLECTION[0];

  /* The self-publishing shelf. When the founder-collection collection in
     Shopify is reachable, its products are the cards; add one there and it
     appears here within a minute. Until then the shelf falls back to Hold
     the Room built from local data, so this page never renders empty. */
  const catalog = await fetchCollectionProducts("founder-collection");
  const cards: CatalogProduct[] =
    catalog && catalog.length > 0
      ? catalog
      : [
          {
            handle: "founder-collection",
            title: product.name,
            variantId: "47361868169385",
            price: product.price,
            available: true,
            /* The vanity set, 25 Aug 2026. The card tile is 3:2, so these
               are crops of the wide and overhead frames rather than the
               square studio sweep padded out at the sides. Scene leads and
               the flatlay is the hover, matching how the other five cards
               work — and this card no longer sits in a peach mockup studio
               beside five shot in the atelier. */
            image: {
              url: "/products/hold-the-room-vanity-wide.webp",
              alt: "Hold the Room and its carton on a marble dressing table, green doors open onto a lit vanity beyond.",
            },
            hoverImage: {
              url: "/products/hold-the-room-vanity-flatlay.webp",
              alt: "Hold the Room seen from above on a marble vanity, among a gold watch, earrings and a cream handbag.",
            },
            character: `02 · ${product.archetype}`,
            descriptor: product.category,
            hook: null,
            who: null,
            how: null,
            actives: null,
            door: null,
            badge: "Preorder",
          },
        ];
  /* ── THE WHOLE LINE, IN ONE GRID ──────────────────────────────────────
     Six entries at three different stages, and the grid has to say which
     is which rather than implying six things you can buy:

       Hold the Room     on sale as a preorder, $34
       Clean Break       ) real products, artwork finished, NO PRICE YET —
       Smooth Talker     ) reservations only, detail lives on /the-next-move
       Double Take       )
       Opening Line      ) named on the board, not made. Not product
       Sign Here         ) listings: no price, no formula, no claim.

     Hold the Room is the odd one visually and deliberately not disguised:
     it is a Blanka product in plain supplier packaging while the other
     three are Selfnamed in the striped house system. Its accent is Antique
     Gold rather than a stripe colourway, because it does not have one. */
  const liveTitles = new Set(cards.map((c) => c.title.toLowerCase()));
  const waitlist = [
    { character: "01 · The Opener", name: "Opening Line", category: "Daily cleanser" },
    { character: "03 · The Signature", name: "Sign Here", category: "Lip treatment" },
  ].filter((w) => !liveTitles.has(w.name.toLowerCase()));

  /* ── THE ORDER OF THE GRID, STATED ONCE ──────────────────────────────
     This used to be three maps rendered one after another, so the sequence
     was an accident of which array came first. Shelby swapped Double Take
     and Hold the Room on 25 Aug — which lands the whole NEXT MOVE trio in
     row one and Hold the Room at the head of row two, beside the two names.
     To reorder the shelf, reorder this list and nothing else. */
  /* Every catalog card becomes a LineCard. When Shopify is connected these
     are real products — Hold the Room plus anything else published into the
     collection — so extras must not be silently dropped just because the
     shelf has a hand-ordered head. */
  const shopCards = cards.map((c) => ({
    handle: c.handle,
    name: c.title,
    category: c.descriptor ?? "",
    character: c.character ?? undefined,
    image: c.image ? { src: c.image.url, alt: c.image.alt } : undefined,
    hoverImage: c.hoverImage
      ? { src: c.hoverImage.url, alt: c.hoverImage.alt }
      : undefined,
    /* Antique Gold, not a stripe colourway — Hold the Room is Blanka in
       plain supplier packaging and does not have one. */
    accent: "var(--color-bronze)",
    href:
      c.handle === "founder-collection"
        ? "/products/hold-the-room"
        : `/products/${c.handle}`,
    state:
      c.handle === "founder-collection"
        ? "Preorder — ships when the first run lands"
        : `${formatPrice(c.price)}`,
    action:
      c.handle === "founder-collection" ? (
        <AddToBagButton
          /* Six fields, not the whole record. Passing `product` shipped the
             entire FounderProduct — 30-line INCI and all — into this page's
             RSC payload for a button that reads six keys. */
          product={{
            slug: product.slug,
            name: product.name,
            category: product.category,
            price: product.price,
            size: product.size,
            bottle: product.bottle,
          }}
          href="/products/hold-the-room"
          className="btn btn-dark w-full"
          label="Preorder"
          showPrice
        />
      ) : (
        <AddToBagButton
          product={{
            slug: c.variantId,
            name: c.title,
            category: c.descriptor ?? "",
            price: c.price,
            size: "",
            bottle: c.image?.url ?? "",
          }}
          href={`/products/${c.handle}`}
          className="btn btn-dark w-full"
          soldOut={!c.available}
          showPrice
        />
      ),
  }));
  const isAnchor = (n: string) => n.toLowerCase() === "hold the room";
  const shopCard = shopCards.find((c) => isAnchor(c.name)) ?? shopCards[0];
  const otherShopCards = shopCards.filter((c) => c !== shopCard);
  const nextMoveCards = NEXT_MOVE.map((entry) => ({
    handle: entry.slug,
    name: entry.name,
    category: entry.category,
    character: CAMPAIGN.name,
    image: entry.scene,
    hoverImage: entry.shades ? undefined : { src: entry.pack.src, alt: entry.pack.alt },
    accent: entry.stripes.b,
    /* Each card opens ITS OWN product page. Until 25 Aug all three pointed
       at /the-next-move, so clicking Clean Break opened a page about three
       products and the shopper had to find hers again. /the-next-move stays
       as the campaign page and the "See all three" destination. */
    href: `/products/${entry.slug}`,
    state: entry.shades
      ? `Reserve — ${entry.shades.length} shades, no price yet`
      : "Reserve — no price yet",
    action: (
      <Link href={`/products/${entry.slug}`} className="btn btn-outline w-full">
        Reserve
      </Link>
    ),
  }));
  const byName = (n: string) => nextMoveCards.find((c) => c.name === n)!;

  const holdTheRoom = shopCard;

  const line = [
    byName("Double Take"),
    byName("Clean Break"),
    byName("Smooth Talker"),
    ...(holdTheRoom ? [holdTheRoom] : []),
    ...otherShopCards,
    ...waitlist.map((entry) => ({
      handle: entry.name.toLowerCase().replace(/\s+/g, "-"),
      name: entry.name,
      category: entry.category,
      character: entry.character,
      image: undefined,
      hoverImage: undefined,
      accent: "var(--color-blush)",
      href: "#waitlist",
      state: "In the making",
      action: (
        <Link href="#waitlist" className="btn btn-outline w-full">
          Join the waitlist
        </Link>
      ),
    })),
  ];

  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "The FOUNDER Collection", path: "/founder-collection" },
          ]),
          faqSchema(product.faqs),
          ...(product.sellable ? [founderProductSchema(product)] : []),
        ]}
      />

      {/* ---- The vanity ----
          The page used to open with a paragraph. It opens at the mirror now:
          the point of this line is the twenty minutes in front of one, and a
          shopper should feel seated before she is sold to.

          Two crops, because the feeling does not survive a letterbox. Desktop
          runs the room wide — the same 1672×941 frame as the homepage hero, so
          the two read as one house. Phones get a crop into the nearest mirror
          and the counter running out of frame, which reads as *this* mirror
          rather than a photograph of a row of them.

          The wordmark is etched into the glass in-shot, so the live copy sits
          on the dark wall to the left and never fights it. Same construction
          as the homepage: below md the photograph is its own block with the
          copy beneath, from md up it becomes the background. */}
      <section className="relative isolate bg-ink text-shell">
        <div className="relative aspect-[722/901] w-full sm:aspect-[16/9] md:absolute md:inset-0 md:aspect-auto md:h-full">
          <Image
            src="/editorial/collection-vanity-m.webp"
            alt="A dressing-room mirror in a brass frame ringed with warm bulbs, FOUNDER · The Collection etched into the glass, above a lit counter."
            fill
            priority
            sizes="100vw"
            className="object-cover md:hidden"
          />
          <Image
            src="/editorial/collection-vanity.webp"
            alt="A row of brass dressing-room mirrors ringed with warm bulbs along a lit counter, the nearest one etched FOUNDER · The Collection, against a dusty rose wall and dark green panelling."
            fill
            priority
            sizes="100vw"
            className="hidden object-cover md:block"
          />
          {/* Phones: wash the foot of the frame so the copy beneath has ground. */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_55%,rgba(0,0,0,0.85)_88%,#000_100%)] md:hidden" />
          {/* Wide: the left wall is already near-black, so this only deepens
              it — it clears well before the first mirror. */}
          <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,0.82)_22%,rgba(0,0,0,0.4)_38%,rgba(0,0,0,0)_54%)] md:block" />
        </div>

        <div className="shell relative flex flex-col justify-end pb-14 pt-8 md:min-h-[34rem] md:py-16 lg:min-h-[38rem]">
          <div className="max-w-[30rem]">
            <p className="eyebrow text-blush/90">The FOUNDER Collection</p>
            <h1 className="display mt-5 text-balance">Take your seat.</h1>
            <p className="mt-6 text-[1.0625rem] leading-relaxed text-shell/85">
              The mirror’s lit. LALALOCA is the serum collection; this is what
              comes after it.
            </p>
          </div>
        </div>
      </section>

      {/* ---- The line ----
          One grid, one card treatment, three stages of readiness. When the
          Shopify collection is reachable its products replace the local
          Hold the Room card; the three NEXT MOVE entries and the two names
          are local either way, because none of them exists in Shopify yet
          and inventing a variant for them would be the same lie as
          inventing a price. */}
      <section className="section bg-cream" aria-labelledby="shelf-heading">
        <div className="shell">
          <h2 id="shelf-heading" className="eyebrow text-charcoal/70">
            The line
          </h2>

          <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {line.map((card) => (
              <LineCard
                key={card.handle}
                name={card.name}
                category={card.category}
                character={card.character}
                image={card.image}
                hoverImage={card.hoverImage}
                accent={card.accent}
                href={card.href}
                state={card.state}
                action={card.action}
              />
            ))}
          </div>

          <p className="mt-10 max-w-prose text-xs leading-relaxed text-charcoal/70">
            {CAMPAIGN.name}: Clean Break, Smooth Talker and Double Take are
            reservations, not sales. Nothing is charged, and no ship date has
            been set.{" "}
            <Link
              href="/the-next-move"
              className="underline underline-offset-2 hover:opacity-70"
            >
              See all three
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ---- The rest of the line ---- */}
      <section className="bg-founder-green py-16 text-cream md:py-20">
        <div className="shell max-w-3xl">
          <p className="eyebrow text-blush">The FOUNDER Collection</p>
          <h2 className="mt-5 font-serif text-3xl leading-tight md:text-4xl">
            One is open. Three are close. Two are still names.
          </h2>
          <p className="mt-6 max-w-prose text-cream/85">
            {product.name} is the anchor and the first to be sourced — it is
            the only one you can order. Clean Break, Smooth Talker and Double
            Take are made and photographed but not yet priced, so they take
            reservations instead of money. Opening Line and Sign Here are
            names, which is a different thing from coming soon.
          </p>
          <p className="mt-6 font-serif text-xl text-blush">
            Named. Not yet promised.
          </p>
        </div>
      </section>

      {/* ---- The waitlist ---- */}
      <section
        id="waitlist"
        className="section-tight bg-founder-green py-14 scroll-mt-24 md:py-16"
      >
        <div className="shell">
          <div className="max-w-xl">
            <h2 className="headline text-balance text-cream">
              Hear when the next one is real.
            </h2>
            <EmailSignup tone="green" source="waitlist" />
          </div>
        </div>
      </section>

      {/* ---- Back to the serums ---- */}
      <section className="bg-shell py-14 md:py-16">
        <div className="shell max-w-3xl">
          <p className="text-charcoal/85">
            Looking for the serums? Those are LALALOCA — three of them, 50 ml
            each, and part of every order goes to StandUp for Kids Tucson.
          </p>
          <Link href="/shop" className="link-underline mt-4 inline-flex text-charcoal">
            The LALALOCA Collection <span aria-hidden>↗</span>
          </Link>
        </div>
      </section>
    </>
  );
}
