import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AddToBagButton } from "@/components/bag/AddToBagButton";
import { EmailSignup } from "@/components/site/EmailSignup";
import { FOUNDER_COLLECTION } from "@/lib/founderCollection";
import { fetchCollectionProducts, type CatalogProduct } from "@/lib/catalog";
import { LineCard } from "@/components/shop/LineCard";
import { NEXT_MOVE, CAMPAIGN } from "@/lib/nextMove";
import { formatPrice, products } from "@/lib/products";
import { Reveal } from "@/components/house/Reveal";
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
 *
 * ── RE-SKINNED FOR THE DARK HOUSE, 30 AUGUST ─────────────────────────────
 *
 * The page was rebuilt as a room, not rewritten as a page. Every mechanism
 * above is untouched: the self-publishing Shopify shelf, the variant IDs, the
 * add-to-bag, the waitlist capture, the three-stage state lines and the
 * schema. Only the surfaces moved.
 *
 * THE HERO IS THE EMPTY SEAT. The redesign brief asks for it and it is the
 * best frame in the library: a boardroom, an empty green wingback under a
 * single light, a rose silk over the arm. The brief also asks for the covered
 * objects on the table to come out. They stay, for now, and they earn it — a
 * collection where one product takes money, three take reservations and two
 * are still names IS a table of covered things. Swap the clean render in when
 * it lands; the layout does not change.
 *
 * THE COMPOSITION IS SYMMETRICAL, so the copy sits centred and low rather
 * than in a left shadow the way the product plates do. Putting a left-aligned
 * column on a centred frame fights the picture.
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
       Opening Line      ) real products, artwork finished, NO PRICE YET —
       Clean Break       ) reservations only. Opening Line joined this group
       Smooth Talker     ) on 30 Aug when it finally found a supplier.
       Double Take       )
       Sign Here         ) named on the board, not made. Not a product
                           listing: no price, no formula, no claim.

     Hold the Room is the odd one visually and deliberately not disguised:
     it is a Blanka product in plain supplier packaging while the other
     three are Selfnamed in the striped house system. Its accent is Antique
     Gold rather than a stripe colourway, because it does not have one. */
  const liveTitles = new Set(cards.map((c) => c.title.toLowerCase()));
  const waitlist = [
    /* Opening Line left this list on 30 Aug — it is a reservation card now.
       Sign Here is the last name without a supplier; two have failed it. */
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
          className="btn btn-primary w-full"
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
          className="btn btn-primary w-full"
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
      <Link href={`/products/${entry.slug}`} className="btn btn-ghost-light w-full">
        Reserve
      </Link>
    ),
  }));
  const byName = (n: string) => nextMoveCards.find((c) => c.name === n)!;

  const holdTheRoom = shopCard;

  const line = [
    byName("Opening Line"),
    byName("Clean Break"),
    ...(holdTheRoom ? [holdTheRoom] : []),
    byName("Double Take"),
    byName("Smooth Talker"),
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
        <Link href="#waitlist" className="btn btn-ghost-light w-full">
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

      {/* ---- The empty seat ----
          The chair is the argument. Nobody is in it, the light is already on
          it, and the line reads "Take your seat." — so the photograph makes
          the offer and the words only name it.

          One frame at every width. It is near-square (1122x1200), which
          crops honestly to a phone and to a wide desktop alike because the
          subject sits dead centre; the two-crop treatment the old vanity
          hero needed does not apply. */}
      <section className="relative isolate flex min-h-[calc(100svh-7rem)] flex-col justify-end overflow-hidden bg-night text-cream">
        <Image
          src="/editorial/the-room-is-yours-chair.webp"
          alt="An empty dark green wingback chair at the head of a marble boardroom table under a single overhead light, a rose silk robe over one arm and covered objects on the table."
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Bottom-up only. The frame is lit from directly above and falls off
            to black at the foot on its own; this deepens that rather than
            imposing a second light direction.

            The first pass cleared at 28% and the copy landed on the chair's
            lit headrest — the eyebrow was unreadable against it. The wash now
            starts closing at the half and is solid by the time the words
            begin, so the light stays on the chair and the type gets ground. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,19,15,0.5)_0%,rgba(7,19,15,0.12)_24%,rgba(7,19,15,0.45)_50%,rgba(7,19,15,0.9)_68%,rgba(7,19,15,0.99)_86%,#07130f_100%)]"
        />

        <div className="shell relative pb-20 pt-32 text-center md:pb-24">
          <p className="room-label">The FOUNDER Collection</p>
          <h1 className="display-house mx-auto mt-6 max-w-[16ch] text-balance text-cream">
            Take your seat.
          </h1>
          <p className="mx-auto mt-7 max-w-[46ch] text-[1.0625rem] leading-relaxed text-cream/80">
            The mirror&rsquo;s lit. LALALOCA is the serum collection; this is what
            comes after it.
          </p>
        </div>
      </section>

      {/* ---- The line ----
          One grid, one card treatment, three stages of readiness. When the
          Shopify collection is reachable its products replace the local
          Hold the Room card; the three NEXT MOVE entries and the two names
          are local either way, because none of them exists in Shopify yet
          and inventing a variant for them would be the same lie as
          inventing a price. */}
      <section className="section bg-night" aria-labelledby="shelf-heading">
        <div className="shell">
          <h2 id="shelf-heading" className="room-label">
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

          <p className="mt-10 max-w-prose text-xs leading-relaxed text-cream/65">
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

      {/* ---- A room between the shelf and the reckoning ----
          The brief asks for alternating editorial reveals through this page.
          One is enough here: the grid above is already six pictures, and a
          second gallery would turn a collection page into a mood board. This
          is the pause before the page admits how much of the line is not
          finished. */}
      <section className="relative isolate overflow-hidden bg-night-deep">
        <Reveal>
          <div className="relative aspect-[16/9] w-full md:aspect-[1672/941]">
            <Image
              src="/editorial/collection-vanity.webp"
              alt="A row of brass dressing-room mirrors ringed with warm bulbs along a lit counter, the nearest one etched FOUNDER, against a dusty rose wall and dark green panelling."
              fill
              loading="lazy"
              sizes="100vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,8,6,0.2)_0%,rgba(3,8,6,0)_40%,rgba(3,8,6,0.85)_100%)]"
            />
          </div>
          <div className="shell -mt-16 relative pb-14 md:-mt-24 md:pb-16">
            <p className="font-serif text-[clamp(1.5rem,3vw,2.25rem)] leading-snug text-cream">
              A mirror, a ritual, a reminder.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ---- The rest of the line ---- */}
      <section className="bg-founder-green py-16 text-cream md:py-20">
        <div className="shell max-w-3xl">
          <p className="eyebrow text-blush">The FOUNDER Collection</p>
          <h2 className="mt-5 font-serif text-3xl leading-tight md:text-4xl">
            One is open. Four are close. One is still a name.
          </h2>
          <p className="mt-6 max-w-prose text-cream/85">
            {product.name} is the anchor and the first to be sourced — it is
            the only one you can order. Opening Line, Clean Break, Smooth
            Talker and Double Take are made and photographed but not yet
            priced, so they take reservations instead of money. Sign Here is a
            name, which is a different thing from coming soon.
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

      {/* ---- The first room ----
          The three serums, at the foot and deliberately quieter than the
          grid above: they are LALALOCA, a different line under the same
          roof, and they have been on sale for months. The brief calls this
          THE FIRST ROOM — the one you were already in before this collection
          existed. Bottles on a dark shelf, names, and a way through. No
          prices and no buttons here; that is what /shop is for. */}
      <section className="section bg-night-deep" aria-labelledby="first-room">
        <div className="shell">
          <Reveal>
            <p id="first-room" className="room-label">
              The first room · The LALALOCA Collection
            </p>
            <p className="mt-5 max-w-[46ch] font-serif text-[clamp(1.5rem,2.8vw,2rem)] leading-snug text-cream">
              Looking for the serums? You were already in that room.
            </p>
            <p className="mt-6 max-w-prose text-[0.9375rem] leading-relaxed text-cream/75">
              Three of them, 50 ml each, and part of every order goes to
              StandUp for Kids Tucson.
            </p>

            <ul className="mt-12 grid gap-10 sm:grid-cols-3">
              {products.map((serum) => (
                <li key={serum.slug}>
                  <Link
                    href={`/products/${serum.slug}`}
                    className="group/serum block text-center"
                  >
                    <span className="relative mx-auto block h-40 w-24 md:h-48 md:w-28">
                      <Image
                        src={serum.bottle}
                        alt={`The ${serum.name} bottle.`}
                        fill
                        loading="lazy"
                        sizes="112px"
                        className="object-contain transition-transform duration-500 group-hover/serum:scale-[1.04]"
                      />
                    </span>
                    <span className="eyebrow mt-6 block text-champagne">
                      {serum.archetype}
                    </span>
                    <span className="mt-2 block font-serif text-2xl font-light text-cream transition-colors group-hover/serum:text-champagne">
                      {serum.name}
                    </span>
                    <span className="mt-2 block text-sm text-cream/70">
                      {serum.category}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <Link href="/shop" className="hairline mt-12 inline-flex text-cream">
              The LALALOCA Collection <span aria-hidden>↗</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
