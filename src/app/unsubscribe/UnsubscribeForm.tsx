"use client";

import { useState } from "react";

/**
 * One button, and it is a POST.
 *
 * The token arrives from the server component as a prop rather than being read
 * from the URL here, so the page renders identically whether or not JavaScript
 * has hydrated yet — the reader always sees why they are on this page and what
 * pressing the button will do before anything happens.
 *
 * The address is shown because the alternative is asking someone to trust an
 * opaque link. If it is not their address, they should be able to see that and
 * close the tab.
 */
export function UnsubscribeForm({ token, email }: { token: string; email: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (state === "sending" || state === "done") return;
    setState("sending");

    try {
      const response = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await response.json().catch(() => ({}));
      setState(response.ok && data.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="mt-8 max-w-md border border-bronze/40 p-5">
        <p role="status" className="text-sm leading-relaxed text-charcoal/85">
          Done. <strong className="font-normal text-charcoal">{email}</strong> is off the
          Founding List and won’t get marketing from us again.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
          Receipts and shipping updates for anything you’ve actually ordered will
          still reach you — those aren’t marketing and you can’t be opted out of
          them without losing your own order tracking.
        </p>
      </div>
    );
  }

  return (
    <form className="mt-8 max-w-md" onSubmit={submit}>
      <p className="text-sm leading-relaxed text-charcoal/85">
        This will stop marketing email to{" "}
        <strong className="font-normal text-charcoal">{email}</strong>.
      </p>
      <button type="submit" disabled={state === "sending"} className="btn btn-outline mt-5">
        {state === "sending" ? "One moment" : "Unsubscribe"}
      </button>

      {state === "error" && (
        <p role="alert" className="mt-4 text-sm leading-relaxed text-charcoal/80">
          That didn’t go through, and we’d rather say so than let you leave
          thinking it did. Reply to any email from us and it will be done by
          hand.
        </p>
      )}
    </form>
  );
}
