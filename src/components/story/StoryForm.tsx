"use client";

import { useEffect, useId, useRef, useState } from "react";
import { STORY_FIELDS } from "@/lib/content";
import { track } from "@/lib/analytics";
import { HONEYPOT_FIELD } from "@/lib/formGuard";

/**
 * Story submission, wired to /api/story.
 *
 * WHAT HAPPENS WHEN SHE PRESSES SEND: the whole submission is emailed to the
 * owner with her address as reply-to, and she gets a short confirmation. That
 * is all. Nothing is published, and — deliberately — nothing is added to the
 * mailing list. The two permissions on this form are "you may reply to me" and
 * "you may consider this for publication". Neither of them is "email me
 * marketing", and quietly treating them as if they were would be exactly the
 * kind of thing this brand tells people it does not do.
 *
 * THE UNCONFIGURED STATE STAYS. If mail is not set up the form says so instead
 * of showing a thank-you screen over a message that went nowhere. That has been
 * this component's position since before it had a backend and it survives
 * having one, because the failure it guards against — a woman believing her
 * story was received when it was not — is the worst outcome this page has.
 */
export function StoryForm() {
  const uid = useId();
  const [state, setState] = useState<"idle" | "sending" | "done" | "unconfigured">("idle");
  const [error, setError] = useState<string | null>(null);
  /* Stamped in an effect rather than during render: Date.now() is impure and
     the compiler is right to reject it in a render body. Mount time is the
     honest reading anyway — it is when the form became fillable. */
  const renderedAt = useRef(0);
  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);

  if (state === "done") {
    return (
      <div className="card-quiet max-w-xl p-8 md:p-10">
        <p className="eyebrow text-bronze-ink">It’s with us</p>
        <h2 className="subhead mt-4 text-charcoal">Thank you for writing it down.</h2>
        <p className="mt-4 text-sm leading-relaxed text-charcoal/80">
          A person reads every one of these — not a system, and not immediately. We’ve
          sent you a note confirming it arrived. If you ticked the second permission and
          we’d like to publish, you’ll see the final text first and can say no then,
          with no explanation needed.
        </p>
      </div>
    );
  }

  if (state === "unconfigured") {
    return (
      <div className="card-quiet max-w-xl p-8 md:p-10">
        <p className="eyebrow text-bronze-ink">Read this first</p>
        <h2 className="subhead mt-4 text-charcoal">
          We haven’t sent it — and we won’t pretend we did.
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-charcoal/80">
          The intake isn’t connected right now, so your words went nowhere and nothing
          was stored. We’d rather tell you that than show you a thank-you screen over a
          deleted message. Try again shortly — and if it keeps happening, write to us
          directly and we’ll take it that way.
        </p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="btn btn-outline mt-7"
        >
          Back to the form
        </button>
      </div>
    );
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;

    const form = event.currentTarget;
    if (!form.checkValidity()) {
      setError("Please fill in your name, email, and the two questions marked required.");
      form.reportValidity();
      return;
    }

    setError(null);
    setState("sending");

    const data = new FormData(form);
    const payload: Record<string, unknown> = {
      name: data.get("name"),
      email: data.get("email"),
      location: data.get("location"),
      social: data.get("social"),
      permission_contact: data.get("permission_contact") === "on",
      permission_publish: data.get("permission_publish") === "on",
      rendered_at: renderedAt.current,
      [HONEYPOT_FIELD]: data.get(HONEYPOT_FIELD) ?? "",
    };
    for (const field of STORY_FIELDS) payload[field.name] = data.get(field.name);

    try {
      const response = await fetch("/api/story", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));

      if (response.ok && result.ok) {
        track("story_submission", { consented_to_publish: payload.permission_publish === true });
        setState("done");
        return;
      }
      if (response.status === 503) {
        setState("unconfigured");
        return;
      }
      setState("idle");
      setError(result.error ?? "Something went wrong sending it. Try again in a moment.");
    } catch {
      setState("idle");
      setError("We couldn’t reach the server. Your words are still in the form — try again.");
    }
  }

  return (
    <form className="max-w-xl" noValidate onSubmit={submit}>
      {/* Honeypot: off-screen, hidden from screen readers, skipped by tabbing. */}
      <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-hp`}>Company website</label>
        <input id={`${uid}-hp`} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={`${uid}-name`} name="name" label="Your name" autoComplete="name" required />
        <Field
          id={`${uid}-email`}
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
        />
        <Field
          id={`${uid}-location`}
          name="location"
          label="Location (optional)"
          autoComplete="address-level2"
        />
        <Field
          id={`${uid}-social`}
          name="social"
          label="Instagram or website (optional)"
        />
      </div>

      {STORY_FIELDS.map((field) => (
        <div key={field.name} className="mt-6">
          <label htmlFor={`${uid}-${field.name}`} className="eyebrow text-charcoal/80">
            {field.label}
            {!field.required && <span className="normal-case tracking-normal"> (optional)</span>}
          </label>
          {field.hint && <p className="mt-2 text-xs text-charcoal/70">{field.hint}</p>}
          <textarea
            id={`${uid}-${field.name}`}
            name={field.name}
            rows={field.rows}
            required={field.required}
            maxLength={5000}
            className="mt-3 w-full border border-charcoal/25 bg-transparent p-4 text-sm leading-relaxed text-charcoal outline-none focus:border-bronze"
          />
        </div>
      ))}

      <fieldset className="mt-8 border-t border-charcoal/12 pt-6">
        <legend className="eyebrow px-0 text-charcoal/80">Two separate permissions</legend>

        <div className="mt-4 flex items-start gap-3">
          <input
            id={`${uid}-contact`}
            name="permission_contact"
            type="checkbox"
            required
            className="mt-1 h-6 w-6 shrink-0 accent-[#8a6335]"
          />
          <label htmlFor={`${uid}-contact`} className="text-sm leading-relaxed text-charcoal/80">
            You can email me about what I’ve sent.{" "}
            <span className="text-charcoal/70">(Required — otherwise we can’t reply.)</span>
          </label>
        </div>

        <div className="mt-4 flex items-start gap-3">
          <input
            id={`${uid}-publish`}
            name="permission_publish"
            type="checkbox"
            className="mt-1 h-6 w-6 shrink-0 accent-[#8a6335]"
          />
          <label htmlFor={`${uid}-publish`} className="text-sm leading-relaxed text-charcoal/80">
            You can consider this for publication. I understand I’ll see the final text
            and can say no at that point.{" "}
            <span className="text-charcoal/70">(Optional — say no and we’ll still read it.)</span>
          </label>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-charcoal/70">
          Sending this doesn’t mean it gets published. We publish very few, slowly, and
          only with the second permission above. It does not add you to the mailing
          list — that’s a separate choice, made somewhere else.
        </p>
      </fieldset>

      {error && (
        <p role="alert" className="mt-6 border-l-2 border-bounce pl-4 text-sm text-charcoal">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="btn btn-dark mt-8 w-full disabled:opacity-60 sm:w-auto"
      >
        {state === "sending" ? "Sending…" : "Send it"}
      </button>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  autoComplete,
  required,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow text-charcoal/80">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        maxLength={200}
        className="mt-3 h-12 w-full border border-charcoal/25 bg-transparent px-4 text-sm text-charcoal outline-none focus:border-bronze"
      />
    </div>
  );
}
