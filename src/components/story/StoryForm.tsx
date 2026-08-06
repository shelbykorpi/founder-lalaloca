"use client";

import { useId, useState } from "react";
import { STORY_FIELDS } from "@/lib/content";
import { track } from "@/lib/analytics";

/**
 * Story submission.
 *
 * There is no backend and no form provider connected to this repository yet.
 * The form therefore does not pretend to send anything: it validates, then
 * tells you plainly that the intake is not live. Wire this to the real endpoint
 * before launch — see README, "Integrations still to connect".
 */
export function StoryForm() {
  const uid = useId();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (submitted) {
    return (
      <div className="card-quiet max-w-xl p-8 md:p-10">
        <p className="eyebrow text-bronze-ink">Read this first</p>
        <h2 className="subhead mt-4 text-charcoal">
          We haven’t sent it — and we won’t pretend we did.
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-charcoal/80">
          The form isn’t connected to anything yet, so your words went nowhere and
          nothing was stored. We’d rather tell you that than show you a thank-you
          screen over a deleted message. When the intake is live, a person reads every
          one, and nothing is published without you seeing it first.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="btn btn-outline mt-7"
        >
          Back to the form
        </button>
      </div>
    );
  }

  return (
    <form
      className="max-w-xl"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.checkValidity()) {
          setError("Please fill in your name, email, and the two questions marked required.");
          form.reportValidity();
          return;
        }
        setError(null);
        track("story_submission", { status: "not_connected" });
        setSubmitted(true);
      }}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={`${uid}-name`} label="Your name" autoComplete="name" required />
        <Field id={`${uid}-email`} label="Email" type="email" autoComplete="email" required />
        <Field id={`${uid}-location`} label="Location (optional)" autoComplete="address-level2" />
        <Field id={`${uid}-social`} label="Instagram or website (optional)" />
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
            className="mt-3 w-full border border-charcoal/25 bg-transparent p-4 text-sm leading-relaxed text-charcoal outline-none focus:border-bronze"
          />
        </div>
      ))}

      <fieldset className="mt-8 border-t border-charcoal/12 pt-6">
        <legend className="eyebrow px-0 text-charcoal/80">Two separate permissions</legend>

        <div className="mt-4 flex items-start gap-3">
          <input
            id={`${uid}-contact`}
            name="permission-contact"
            type="checkbox"
            required
            className="mt-1 h-6 w-6 shrink-0 accent-[#8a6335]"
          />
          <label htmlFor={`${uid}-contact`} className="text-sm leading-relaxed text-charcoal/80">
            You can email me about what I’ve sent. <span className="text-charcoal/70">(Required — otherwise we can’t reply.)</span>
          </label>
        </div>

        <div className="mt-4 flex items-start gap-3">
          <input
            id={`${uid}-publish`}
            name="permission-publish"
            type="checkbox"
            className="mt-1 h-6 w-6 shrink-0 accent-[#8a6335]"
          />
          <label htmlFor={`${uid}-publish`} className="text-sm leading-relaxed text-charcoal/80">
            You can consider this for publication. I understand I’ll see the final text
            and can say no at that point. <span className="text-charcoal/70">(Optional — say no and we’ll still read it.)</span>
          </label>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-charcoal/70">
          Sending this doesn’t mean it gets published. We publish very few, slowly, and
          only with the second permission above.
        </p>
      </fieldset>

      {error && (
        <p role="alert" className="mt-6 border-l-2 border-bounce pl-4 text-sm text-charcoal">
          {error}
        </p>
      )}

      <button type="submit" className="btn btn-dark mt-8 w-full sm:w-auto">
        Send it
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  type = "text",
  autoComplete,
  required,
}: {
  id: string;
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
        name={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="mt-3 h-12 w-full border border-charcoal/25 bg-transparent px-4 text-sm text-charcoal outline-none focus:border-bronze"
      />
    </div>
  );
}
