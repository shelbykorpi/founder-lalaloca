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

    track("begin_checkout", { value: subtotal, currency: "USD", items: count });
    window.location.href = url;
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
        className={`fixed inset-0 z-40 bg-charcoal/45 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        aria-hidden={!isOpen}
        className={`fixed right-0 top-0 z-50 flex h-[100dvh] w-full max-w-[26rem] flex-col bg-shell shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,0.61,0.24,1)] ${
          isOpen ? "translate-x-0" : "pointer-events-none translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-bronze/20 px-6 py-5">
          <h2 className="eyebrow text-charcoal">
            Your bag {count > 0 && <span className="text-bronze-ink">({count})</span>}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={closeBag}
            className="-mr-2 flex h-11 w-11 items-center justify-center text-charcoal transition-opacity hover:opacity-60"
          >
            <span className="sr-only">Close bag</span>
            <svg viewBox="0 0 16 16" aria-hidden className="h-4 w-4">
              <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.2" fill="none" />
            </svg>
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
            <p className="subhead text-charcoal">Your bag is empty.</p>
            <p className="text-sm text-charcoal/70">
              Three serums, three distinct personalities. Start wherever you like.
            </p>
            <Link href="/shop" onClick={closeBag} className="btn btn-dark">
              Shop the collection
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-bronze/15 overflow-y-auto px-6">
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
                      className="inline-flex min-h-11 items-center font-serif text-xl leading-tight text-charcoal hover:text-bronze-ink"
                    >
                      {line.name}
                    </Link>
                    <p className="text-xs uppercase tracking-[0.14em] text-charcoal/70">
                      {line.size}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border border-bronze/30">
                        <button
                          type="button"
                          onClick={() => setQuantity(line.id, line.quantity - 1)}
                          className="flex h-11 w-11 items-center justify-center text-charcoal hover:bg-cream"
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
                          className="flex h-11 w-11 items-center justify-center text-charcoal hover:bg-cream"
                        >
                          <span className="sr-only">Increase quantity of {line.name}</span>
                          <span aria-hidden>+</span>
                        </button>
                      </div>
                      <span className="text-sm text-charcoal">
                        {formatPrice(line.price * line.quantity)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(line.id)}
                      className="mt-1 inline-flex min-h-11 self-start items-center text-[0.6875rem] uppercase tracking-[0.16em] text-charcoal/70 underline underline-offset-4 hover:text-charcoal"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-bronze/20 px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="eyebrow text-charcoal/70">Subtotal</span>
                <span className="font-serif text-2xl text-charcoal">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="mt-1 text-xs text-charcoal/70">
                Free US shipping. Taxes calculated at checkout.
              </p>
              <button
                type="button"
                onClick={startCheckout}
                className="btn btn-dark mt-4 w-full"
              >
                Checkout
              </button>
              {checkoutError && (
                <p role="alert" className="mt-3 text-center text-xs leading-relaxed text-red-700">
                  {checkoutError}
                </p>
              )}
              <p className="mt-3 text-center text-[0.6875rem] leading-relaxed text-charcoal/70">
                You’ll finish your order on Shopify’s secure checkout. Cosmetic use only.
              </p>
            </footer>
          </>
        )}
      </div>
    </>
  );
}
