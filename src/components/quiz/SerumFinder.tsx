"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AddToBagButton } from "@/components/bag/AddToBagButton";
import { quiz } from "@/lib/content";
import { track } from "@/lib/analytics";
import { formatPrice, products, type ProductSlug } from "@/lib/products";

type Answers = Record<string, number>;

/** Three questions about your skin and your actual routine. No diagnosis. */
export function SerumFinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const total = quiz.length;
  const finished = step >= total;

  const result = useMemo(() => {
    if (!finished) return null;
    const scores: Record<ProductSlug, number> = {
      "bounce-back": 0,
      "thirst-trap": 0,
      "c-me-glow": 0,
    };
    quiz.forEach((question) => {
      const chosen = answers[question.id];
      if (chosen === undefined) return;
      (
        Object.entries(question.options[chosen].scores) as [ProductSlug, number][]
      ).forEach(([slug, value]) => {
        scores[slug] += value;
      });
    });
    const ranked = products.slice().sort((a, b) => scores[b.slug] - scores[a.slug]);
    return {
      pick: ranked[0],
      second: ranked[1],
      even: scores[ranked[0].slug] === scores[ranked[2].slug],
    };
  }, [answers, finished]);

  function choose(questionId: string, optionIndex: number) {
    setAnswers((current) => ({ ...current, [questionId]: optionIndex }));
    setStep((current) => current + 1);
  }

  if (finished && result) {
    return (
      <div className="shell py-4">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-16">
          <div className="relative mx-auto h-72 w-full max-w-xs lg:h-96">
            <Image
              src={result.pick.bottle}
              alt={`${result.pick.name}, ${result.pick.category}, 50 ml bottle`}
              fill
              sizes="(max-width: 1024px) 60vw, 320px"
              className="object-contain"
            />
          </div>

          <div>
            <p className="eyebrow text-bronze-ink">
              {result.even ? "Any of the three, honestly" : "Start here"}
            </p>
            <h2 className="headline mt-4 text-charcoal">{result.pick.name}</h2>
            <p className="mt-3 text-xs uppercase tracking-[0.16em] text-charcoal/70">
              {result.pick.category}
            </p>
            <p className="mt-5 max-w-md text-charcoal/80">
              {result.even
                ? "Your answers pointed at all three fairly evenly, which usually means you can start anywhere. This one is the easiest to add to an existing routine."
                : result.pick.what}
            </p>
            <p className="mt-4 max-w-md text-sm text-charcoal/80">
              {result.pick.benefit} {result.pick.timing}, {result.pick.routine.toLowerCase()}
            </p>
            <p className="mt-5 text-sm text-charcoal">
              {result.pick.size} · {formatPrice(result.pick.price)}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <AddToBagButton product={result.pick} className="btn btn-dark" showPrice />
              <Link href={`/products/${result.pick.slug}`} className="btn btn-outline">
                Read the details
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-charcoal/12 pt-6">
              <p className="text-sm text-charcoal/80">
                Second closest:{" "}
                <Link
                  href={`/products/${result.second.slug}`}
                  className="text-charcoal underline underline-offset-4 hover:text-bronze-ink"
                >
                  {result.second.name}
                </Link>
              </p>
              <button
                type="button"
                onClick={() => {
                  setAnswers({});
                  setStep(0);
                }}
                className="inline-flex min-h-11 items-center text-[0.6875rem] uppercase tracking-[0.16em] text-charcoal/70 underline underline-offset-4 hover:text-charcoal"
              >
                Start again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz[step];

  return (
    <div className="shell py-4">
      <div className="max-w-3xl">
        <div className="flex items-center gap-4">
          <p className="eyebrow text-bronze-ink">{question.eyebrow}</p>
          <div
            className="h-px flex-1 bg-charcoal/15"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={total}
            aria-valuenow={step + 1}
            aria-label={`Question ${step + 1} of ${total}`}
          >
            <div
              className="h-px bg-bronze transition-[width] duration-500"
              style={{ width: `${((step + 1) / total) * 100}%` }}
            />
          </div>
          <p className="text-xs tabular-nums text-charcoal/70">
            {step + 1} / {total}
          </p>
        </div>

        <h2 className="headline mt-7 text-balance text-charcoal">{question.question}</h2>
        {question.helper && (
          <p className="mt-4 text-sm text-charcoal/75">{question.helper}</p>
        )}

        <ul className="mt-9 grid gap-px border border-charcoal/12 bg-charcoal/12 sm:grid-cols-2">
          {question.options.map((option, index) => (
            <li key={option.label} className="bg-cream">
              <button
                type="button"
                onClick={() => {
                  choose(question.id, index);
                  if (step + 1 >= total) track("product_select", { source: "finder" });
                }}
                className="group flex min-h-[6.5rem] w-full items-center justify-between gap-4 p-6 text-left transition-colors hover:bg-shell"
              >
                <span>
                  <span className="block font-serif text-2xl leading-tight text-charcoal">
                    {option.label}
                  </span>
                  <span className="mt-1 block text-sm text-charcoal/75">
                    {option.detail}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="shrink-0 text-bronze-ink transition-transform duration-300 group-hover:translate-x-1"
                >
                  ↗
                </span>
              </button>
            </li>
          ))}
        </ul>

        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((current) => current - 1)}
            className="mt-6 inline-flex min-h-11 items-center text-[0.6875rem] uppercase tracking-[0.16em] text-charcoal/70 underline underline-offset-4 hover:text-charcoal"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}
