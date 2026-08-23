import Image from "next/image";
import Link from "next/link";
import { AddToBagButton } from "@/components/bag/AddToBagButton";
import { formatPrice } from "@/lib/products";
import type { CatalogProduct } from "@/lib/catalog";

/**
 * The product card from the copy-cut template — six elements, nothing else:
 * image on the door colour · badge pill · character · name · descriptor ·
 * button with the price inside it. The whole card links to the detail page;
 * the button adds to the bag without leaving the grid.
 *
 * Everything on it is authored in Shopify. The card renders whatever exists
 * and never invents: no descriptor means no descriptor line, not filler.
 */
export function CatalogCard({
  product,
  href,
}: {
  product: CatalogProduct;
  /** Override for cards whose page is not /products/<handle> — the local
      Hold the Room fallback points back at its own editorial section. */
  href?: string;
}) {
  const target = href ?? `/products/${product.handle}`;
  return (
    <div className="group relative">
      <Link
        href={target}
        className="block"
        aria-label={product.title}
      >
        <div
          className="relative aspect-square w-full overflow-hidden"
          style={{ background: product.door ?? "var(--color-shell, #f4ece2)" }}
        >
          {product.image ? (
            <>
              <Image
                src={product.image.url}
                alt={product.image.alt}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 90vw, 30vw"
                className={`object-cover transition-opacity duration-500 ${
                  product.hoverImage ? "group-hover:opacity-0" : ""
                }`}
              />
              {product.hoverImage && (
                <Image
                  src={product.hoverImage.url}
                  alt=""
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 90vw, 30vw"
                  className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              )}
            </>
          ) : null}
          {product.badge && (
            <span className="absolute left-3 top-3 bg-cream/95 px-3 py-1 text-[0.625rem] uppercase tracking-[0.18em] text-charcoal">
              {product.badge}
            </span>
          )}
        </div>

        {product.character && (
          <p className="eyebrow mt-5 text-bronze-ink">{product.character}</p>
        )}
        <h3 className="mt-2 font-serif text-2xl font-light leading-none text-charcoal transition-colors group-hover:text-bronze-ink">
          {product.title}
        </h3>
        {product.descriptor && (
          <p className="mt-2 text-sm text-charcoal/80">{product.descriptor}</p>
        )}
      </Link>

      <div className="mt-4">
        <AddToBagButton
          product={{
            /* The raw variant id is the bag id — cartPermalink accepts it
               directly, so no map entry is needed for catalog products. */
            slug: product.variantId,
            name: product.title,
            category: product.descriptor ?? "",
            price: product.price,
            size: "",
            bottle: product.image?.url ?? "",
          }}
          href={target}
          className="btn btn-dark w-full"
          label={product.available ? "Add" : "Add"}
          soldOut={!product.available}
          showPrice
        />
      </div>
    </div>
  );
}

/**
 * The waitlist card, for a named-but-unmade product. By the board's rule it
 * is not a product listing: name, a purely categorical descriptor, and a way
 * to hear when it's real. No price, no formula, no claim, no ingredient.
 */
export function WaitlistCard({
  character,
  name,
  descriptor,
}: {
  character: string;
  name: string;
  descriptor: string;
}) {
  return (
    <div className="flex flex-col">
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-shell">
        <span className="absolute left-3 top-3 bg-cream/95 px-3 py-1 text-[0.625rem] uppercase tracking-[0.18em] text-charcoal">
          In the making
        </span>
        <span className="px-8 text-center font-serif text-[clamp(1.5rem,2.4vw,2rem)] leading-tight text-charcoal/40">
          {name}
        </span>
      </div>
      <p className="eyebrow mt-5 text-bronze-ink">{character}</p>
      <h3 className="mt-2 font-serif text-2xl font-light leading-none text-charcoal">
        {name}
      </h3>
      <p className="mt-2 text-sm text-charcoal/80">{descriptor}</p>
      <div className="mt-4">
        <Link
          href="#waitlist"
          className="btn btn-outline w-full"
          aria-label={`Join the waitlist for ${name}`}
        >
          Join the waitlist
        </Link>
      </div>
    </div>
  );
}
