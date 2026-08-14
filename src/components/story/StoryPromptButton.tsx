"use client";

import { useEffect, useRef, useState } from "react";
import { STORY_AI_PROMPT } from "@/lib/content";
import { track } from "@/lib/analytics";

/**
 * "Copy the prompt" — the writing help that sits above the story form.
 *
 * WHAT IT DOES AND, MORE IMPORTANTLY, WHAT IT DOES NOT. It puts one block of
 * text on her clipboard. It does not call a model, does not send her anything,
 * does not read what she has typed into the form, and does not open a tab
 * anywhere. The only thing that leaves this component is a single analytics
 * event counting the click. Everything after the copy happens in her own
 * assistant, in her own account, out of our sight — which is the correct place
 * for a first draft of a story we have promised she owns.
 *
 * WHY IT IS NOT SILENT. A copy button with no confirmation is the classic way
 * to make someone paste an empty clipboard into a chat window and lose their
 * place. The state says "Copied", holds it for four seconds, and announces it
 * to screen readers.
 *
 * THE FALLBACK MATTERS MORE THAN IT LOOKS. navigator.clipboard is unavailable
 * on insecure origins and refused outright by some in-app browsers — Instagram
 * being the obvious one for this audience, since the invitation to write is
 * posted there. When the write fails we show the prompt in a selected textarea
 * instead of a dead button, so she can copy it by hand rather than conclude
 * the page is broken.
 */
export function StoryPromptButton() {
  const [state, setState] = useState<"idle" | "copied" | "manual">("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const manualField = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  /* Select the text the moment the fallback appears, so the manual path is
     two keystrokes and not a scroll-and-drag through a long prompt. */
  useEffect(() => {
    if (state !== "manual") return;
    const field = manualField.current;
    if (!field) return;
    field.focus();
    field.select();
  }, [state]);

  async function copyPrompt() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("no clipboard");
      await navigator.clipboard.writeText(STORY_AI_PROMPT);
    } catch {
      setState("manual");
      return;
    }

    track("story_prompt_copied");
    setState("copied");
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setState("idle"), 4000);
  }

  return (
    <section
      aria-labelledby="story-ai-help"
      className="card-quiet mb-10 max-w-xl p-7 md:p-8"
    >
      <p className="eyebrow text-bronze-ink">If you write with AI</p>
      <h3 id="story-ai-help" className="subhead mt-3 text-charcoal">
        Say it to the machine first, if that’s easier.
      </h3>
      <p className="mt-4 text-sm leading-relaxed text-charcoal/80">
        Some women can talk about what they built long before they can write it
        down. This copies a prompt for whichever assistant you already use. It
        tells that assistant to work only from what you have actually told it,
        to invent nothing, and to write{" "}
        <span className="italic-accent">“I need your input for this answer”</span>{" "}
        anywhere it doesn’t know. Paste it in, answer what it asks you, then
        bring your own words back to this form.
      </p>

      {state === "manual" ? (
        <div className="mt-6">
          <label
            htmlFor="story-ai-prompt-text"
            className="eyebrow text-charcoal/80"
          >
            Copy this by hand
          </label>
          <p className="mt-2 text-xs leading-relaxed text-charcoal/70">
            Your browser wouldn’t let us reach the clipboard — some in-app
            browsers block it. The prompt is selected below; copy it and paste
            it into your assistant.
          </p>
          <textarea
            id="story-ai-prompt-text"
            ref={manualField}
            readOnly
            rows={8}
            value={STORY_AI_PROMPT}
            onFocus={(event) => event.currentTarget.select()}
            className="mt-3 w-full border border-charcoal/25 bg-transparent p-4 text-xs leading-relaxed text-charcoal outline-none focus:border-bronze"
          />
        </div>
      ) : (
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={copyPrompt}
            className="btn btn-outline w-full sm:w-auto"
          >
            {state === "copied" ? "Copied" : "Copy the prompt"}
          </button>
          <p aria-live="polite" className="text-xs text-charcoal/70">
            {state === "copied"
              ? "On your clipboard. Paste it into your assistant."
              : "Nothing is sent anywhere. It only goes to your clipboard."}
          </p>
        </div>
      )}

      <p className="mt-6 border-t border-charcoal/12 pt-5 text-xs leading-relaxed text-charcoal/70">
        Read every line before you send it. What gets published here is yours,
        in your words — so anything the assistant guessed at, change it or take
        it out.
      </p>
    </section>
  );
}
