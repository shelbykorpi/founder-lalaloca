"use client";

import { useEffect, useId, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { HONEYPOT_FIELD } from "@/lib/formGuard";

/**
 * Email signup, wired to /api/subscribe → the Shopify customer list.
 *
 * The heading and the button are the locked §12 call to action — "Enter the
 * Founding List. Be first through the door." The invitation is "come closer",
 * never "sign up now" (§8), so the button says Enter, not Subscribe.
 *
 * THREE STATES, AND THE THIRD IS THE IMPORTANT ONE. Idle, subscribed, and
 * not-connected. If the list credentials are missing the form says so plainly
 * rather than showing a thank-you over a discarded address — the same position
 * this component held before there was a backend. A success screen you cannot
 * back up is worse than an honest failure.
 */
export function EmailSignup({
  tone = "dark",
  heading = "Enter the Founding List.",
  source = "page",
}: {
  /** "green" = the Founder Green invitation band: cream type, blush eyebrow, gold ENTER. */
  tone?: "dark" | "light" | "green";
  heading?: string;
  /** Becomes a Shopify tag, so campaigns can be segmented by where someone joined. */
  source?: "footer" | "found-her" | "shop" | "page" | "home" | "waitlist";
}) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "unconfigured" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);
  /* Stamped in an effect rather than during render: Date.now() is impure and
     the compiler is right to reject it in a render body. Mount time is the
     honest reading anyway — it is when the form became fillable. */
  const renderedAt = useRef(0);
  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);
  const dark = tone === "dark";
  const green = tone === "green";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    setState("sending");
    setMessage(null);

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          source,
          rendered_at: renderedAt.current,
          [HONEYPOT_FIELD]: form.get(HONEYPOT_FIELD) ?? "",
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok && data.ok) {
        track("email_signup", { source });
        setState("done");
        return;
      }
      if (response.status === 503) {
        setState("unconfigured");
        return;
      }
      setState("error");
      setMessage(data.error ?? "Something went wrong. Try again in a moment.");
    } catch {
      setState("error");
      setMessage("We couldn’t reach the server. Try again in a moment.");
    }
  }

  const note = `mt-4 border p-4 text-sm leading-relaxed ${
    green
      ? "border-cream/30 text-cream/85"
      : dark
        ? "border-shell/25 text-shell/85"
        : "border-bronze/40 text-charcoal/80"
  }`;

  return (
    <form className="mt-8 max-w-md" onSubmit={submit}>
      <label
        htmlFor={id}
        className={`eyebrow block ${green ? "text-blush" : dark ? "text-shell/60" : "text-charcoal/70"}`}
      >
        {heading}
      </label>
      <p className={`mt-2 text-sm ${green ? "text-cream/80" : dark ? "text-shell/70" : "text-charcoal/75"}`}>
        Be first through the door. Where to start, what’s back, what we’ve
        published. A few emails a month, not a few a week.
      </p>

      {/* Honeypot. Hidden from sight, hidden from screen readers, skipped by
          tabbing — invisible to a person, irresistible to a bot. */}
      <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={`${id}-hp`}>Company website</label>
        <input id={`${id}-hp`} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state === "done" ? (
        <p role="status" className={note}>
          You’re on the list. Nothing else to do — we’ll write when there’s
          something worth reading.
        </p>
      ) : state === "unconfigured" ? (
        <p role="status" className={note}>
          The mailing list isn’t connected yet, so we haven’t kept your address —
          we’d rather say that than show you a thank-you over a discarded email.
          Come back when it is, and we’ll do this properly.
        </p>
      ) : (
        <>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              id={id}
              type="email"
              required
              value={email}
              autoComplete="email"
              placeholder="Your email"
              onChange={(event) => setEmail(event.target.value)}
              className={`h-12 min-w-0 shrink-0 border bg-transparent px-4 text-sm outline-none transition-colors placeholder:text-current/60 sm:flex-1 ${
                green
                  ? "border-cream/40 text-cream focus:border-bronze"
                  : dark
                    ? "border-shell/30 text-shell focus:border-bronze"
                    : "border-charcoal/25 text-charcoal focus:border-bronze"
              }`}
            />
            <button
              type="submit"
              disabled={state === "sending"}
              className={`btn shrink-0 disabled:opacity-60 ${
                green ? "bg-bronze text-ink hover:opacity-90" : dark ? "btn-ghost-light" : "btn-outline"
              }`}
            >
              {state === "sending" ? "One moment" : "Enter"}
            </button>
          </div>
          {message && (
            <p
              role="alert"
              className={`mt-3 text-sm ${green ? "text-cream/85" : dark ? "text-shell/80" : "text-charcoal/80"}`}
            >
              {message}
            </p>
          )}
        </>
      )}
    </form>
  );
}
