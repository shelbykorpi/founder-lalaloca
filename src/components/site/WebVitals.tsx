"use client";

import { useReportWebVitals } from "next/web-vitals";
import { track } from "@/lib/analytics";

/**
 * Core Web Vitals, measured on real visitors' devices.
 *
 * WHY THIS AND NOT LIGHTHOUSE. Lighthouse is a lab test on a simulated phone on
 * a simulated network. Google ranks on field data — what actually happened to
 * people who loaded the page — collected through the Chrome UX Report. CrUX
 * only reports on origins with enough traffic to be statistically meaningful,
 * which a new site does not have and will not have for months. Until then this
 * is the only field data that exists for founderbeauty.co, and it starts
 * collecting from the first visitor rather than from whenever CrUX decides
 * there is a quorum.
 *
 * WHAT TO WATCH, and the thresholds Google uses for "good":
 *   LCP  ≤ 2.5s   largest element painted — here, almost always the hero or a
 *                 door image. This is the one the oversized bottle renders put
 *                 at risk: a ~350px asset upscaled ~3× costs decode time and
 *                 looks soft.
 *   INP  ≤ 200ms  responsiveness to a tap. The door and elevator animations are
 *                 the thing to watch — heavy work on the main thread during an
 *                 interaction lands here.
 *   CLS  ≤ 0.1    layout shift. Any image without explicit dimensions, or a
 *                 font swapping in at a different metric, shows up as this.
 *
 * The value is rounded before sending because GA4 stores event parameters as
 * integers unless configured otherwise, and CLS — a number like 0.0374 — would
 * otherwise be recorded as 0 for every visitor. Multiplying it by 1000 keeps
 * the precision; divide by 1000 when reading the report.
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    track("web_vitals", {
      metric_name: metric.name,
      metric_value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
      /* "good" | "needs-improvement" | "poor", straight from the library, so
         the report can be read without memorising thresholds. */
      metric_rating: metric.rating,
      metric_id: metric.id,
      /* Non-interaction: these fire on their own and must not affect
         engagement or bounce calculations. */
      non_interaction: true,
    });
  });

  return null;
}
