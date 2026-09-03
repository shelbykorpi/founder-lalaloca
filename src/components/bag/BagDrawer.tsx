"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useBag } from "./BagProvider";
import { track } from "@/lib/analytics";
import { formatPrice } from "@/lib/products";
import { cartPermalink } from "@/lib/shopifyLinks";

export function BagDrawer() {
  const { lines, isOpen, closeBag, setQuantity, remove, subtotal, count } = useBag();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  /**
   * Checkout is a handoff. We build a Shopify cart permalink from the bag and
   * send the customer to Shopify's hosted checkout — payment, tax, shipping
   * rates and the order record all live there. Nothing sensitive touches this
   * site, and there is no second cart to keep in step.
   */
  function startCheckout() {
    const url = cartPermalink(lines.map((l) => ({ id: l.id, quantity: l.quantity })));

    if (!url) {
      setCheckoutError("Something in your bag is no longer available. Try removing and re-adding it.");
      return;
    }

    track("begin_checkout", {
      value: subtotal,
      currency: "USD",
      items: lines.map((l) => ({
        item_id: l.id,
        item_name: l.name,
        item_category: l.category,
        price: l.price,
        quantity: l.quantity,
      })),
    });
    window.location.href = url;
  }

  /**
   * view_cart, fired once each time the drawer opens.
   *
   * This is the step where GA4's funnel usually breaks on a headless build:
   * there is no /cart page to collect a pageview, so without an explicit event
   * the journey jumps from add_to_cart straight to begin_checkout and every
   * abandonment in between is invisible.
   */
  useEffect(() => {
    if (!isOpen || lines.length === 0) return;
    track("cart_view", {
      value: subtotal,
      currency: "USD",
      items: lines.map((l) => ({
        item_id: l.id,
        item_name: l.name,
        item_category: l.category,
        item_brand: "LALALOCA",
        price: l.price,
        quantity: l.quantity,
      })),
    });
    /* Only on the open transition — re-firing as the bag is edited would
       inflate the count and distort the drop-off rate. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  /** Removals are the clearest signal of a pricing or expectation problem, and
      they are the one bag action that leaves no other trace. */
  function removeLine(line: (typeof lines)[number]) {
    track("remove_from_cart", {
      value: line.price * line.quantity,
      currency: "USD",
      items: [
        {
          item_id: line.id,
          item_name: line.name,
          item_category: line.category,
          item_brand: "LALALOCA",
          price: line.price,
          quantity: line.quantity,
        },
      ],
    });
    remove(line.id);
  }

  /* Escape closes, focus moves into the panel, and focus is trapped while open. */
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeBag();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, [isOpen, closeBag]);

  return (
    <>
      <div
        aria-hidden={!isOpen}
        onClick={closeBag}
        className={`fixed inset-0 z-40 bg-night-deep/70 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        aria-hidden={!isOpen}
        className={`fixed right-0 top-0 z-50 flex h-[100dvh] w-full max-w-[26rem] flex-col border-l border-bronze/25 bg-night text-cream shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,0.61,0.24,1)] ${
          isOpen ? "translate-x-0" : "pointer-events-none translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-bronze/20 px-6 py-5">
          <h2 className="eyebrow text-cream">
            Your bag {count > 0 && <span className="text-bronze">({count})</span>}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={closeBag}
            className="-mr-2 flex h-11 w-11 items-center justify-center text-cream transition-opacity hover:opacity-60"
          >
            <span className="sr-only">Close bag</span>
            <svg viewBox="0 0 16 16" aria-hidden className="h-4 w-4">
              <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.2" fill="none" />
            </svg>
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
            <p className="subhead text-cream">Your bag is empty.</p>
            <p className="text-sm text-cream/75">
              The house is open. Three serums, $38 each — or all three for $98.
            </p>
            <Link href="/shop" onClick={closeBag} className="btn btn-primary">
              Shop the serums
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-bronze/20 overflow-y-auto px-6">
              {lines.map((line) => (
                <li key={line.id} className="flex gap-4 py-5">
                  <div className="relative h-24 w-16 shrink-0 overflow-hidden bg-cream">
                    <Image
                      src={line.image}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <Link
                      href={line.href}
                      onClick={closeBag}
                      className="inline-flex min-h-11 items-center font-serif text-xl leading-tight text-cream hover:text-champagne"
                    >
                      {line.name}
                    </Link>
                    <p className="text-xs uppercase tracking-[0.14em] text-cream/70">
                      {line.size}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border border-bronze/30">
                        <button
                          type="button"
                          onClick={() => setQuantity(line.id, line.quantity - 1)}
                          className="flex h-11 w-11 items-center justify-center text-cream hover:bg-cream/10"
                        >
                          <span className="sr-only">Decrease quantity of {line.name}</span>
                          <span aria-hidden>–</span>
                        </button>
                        <span className="w-8 text-center text-sm" aria-live="polite">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(line.id, line.quantity + 1)}
                          className="flex h-11 w-11 items-center justify-center text-cream hover:bg-cream/10"
                        >
                          <span className="sr-only">Increase quantity of {line.name}</span>
                          <span aria-hidden>+</span>
                        </button>
                      </div>
                      <span className="text-sm text-cream">
                        {formatPrice(line.price * line.quantity)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLine(line)}
                      className="mt-1 inline-flex min-h-11 self-start items-center text-[0.6875rem] uppercase tracking-[0.16em] text-cream/70 underline underline-offset-4 hover:text-cream"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-bronze/20 px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="eyebrow text-cream/70">Subtotal</span>
                <span className="font-serif text-2xl text-cream">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="mt-1 text-xs text-cream/70">
                Free US shipping. Taxes calculated at checkout.
              </p>
              <button
                type="button"
                onClick={startCheckout}
                className="btn btn-primary mt-4 w-full"
              >
                Checkout
              </button>
              {checkoutError && (
                <p role="alert" className="mt-3 border-l-2 border-rose py-2 pl-3 text-left text-xs leading-relaxed text-rose">
                  {checkoutError}
                </p>
              )}
              <p className="mt-3 text-center text-[0.6875rem] leading-relaxed text-cream/60">
                Secure checkout by Shopify. FOUNDER is the name on your order. Cosmetic products.
              </p>
            </footer>
          </>
        )}
      </div>
    </>
  );
}
