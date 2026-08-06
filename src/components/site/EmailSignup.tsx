"use client";

import { useId, useState } from "react";
import { track } from "@/lib/analytics";

/**
 * Email signup. There is no email provider connected yet, so the form says so
 * instead of showing a success state over a discarded address.
 *
 * The heading and the button are the locked §12 call to action — "Enter the
 * Founding List. Be first through the doors." The invitation is "come closer",
 * never "sign up now" (§8), so the button says Enter, not Subscribe.
 */
export function EmailSignup({
  tone = "dark",
  heading = "Enter the Founding List.",
}: {
  tone?: "dark" | "light";
  heading?: string;
}) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const dark = tone === "dark";

  return (
    <form
      className="mt-8 max-w-md"
      onSubmit={(event) => {
        event.preventDefault();
        track("email_signup", { source: dark ? "footer" : "page" });
        setSent(true);
      }}
    >
      <label
        htmlFor={id}
        className={`eyebrow block ${dark ? "text-shell/60" : "text-charcoal/70"}`}
      >
        {heading}
      </label>
      <p className={`mt-2 text-sm ${dark ? "text-shell/70" : "text-charcoal/75"}`}>
        Be first through the doors. Which serum to start with, new stories as
        they’re published, and when something is back in stock. A few emails a
        month, not a few a week.
      </p>

      {sent ? (
        <p
          role="status"
          className={`mt-4 border p-4 text-sm leading-relaxed ${
            dark ? "border-shell/25 text-shell/85" : "border-bronze/40 text-charcoal/80"
          }`}
        >
          Nothing was stored — the mailing list isn’t connected yet, so we haven’t
          kept your address. Come back when it is, and we’ll do this properly.
        </p>
      ) : (
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
              dark
                ? "border-shell/30 text-shell focus:border-bronze"
                : "border-charcoal/25 text-charcoal focus:border-bronze"
            }`}
          />
          <button
            type="submit"
            className={`btn shrink-0 ${dark ? "btn-ghost-light" : "btn-outline"}`}
          >
            Enter
          </button>
        </div>
      )}
    </form>
  );
}
