/**
 * "WHAT ARE YOU WALKING INTO?" — the concierge's first question.
 *
 * 12 September 2026, brief §12. The folio used to open on four desks and a
 * bill of fare: Beauty, The House, Found Her, Service. That is a support
 * index with good manners, and it asks a woman to know which department her
 * problem belongs to before she has said anything. A concierge does not do
 * that. A concierge asks where you are going.
 *
 * So the first thing on the card is now seven occasions, and each one is a
 * rule — nothing more. It picks the desk and it phrases the question the way
 * she would have phrased it, then hands both to the concierge that already
 * exists. There is no new model, no new endpoint, no client-side knowledge
 * base and no recommendation logic in the browser: the answer still comes
 * from /api/concierge, which is the only thing on this site allowed to state
 * a fact about a product.
 *
 * THE ASKS ARE QUESTIONS, NEVER CLAIMS. "What should I put on the night
 * before a board meeting?" is safe to ship because it asserts nothing. An
 * occasion that pre-loaded an answer — "the peptide cream is what you want
 * for a long flight" — would be this file inventing product performance,
 * which is exactly what the house does not do.
 *
 * The desks stay. They are the second row on the card and they are how a
 * woman who knows she has an order problem skips the poetry.
 */

import type { Desk } from "./desks";

export type Occasion = {
  /** The plate on the card. Set in tracked micro-caps. */
  label: string;
  /** Which desk the conversation opens at. */
  desk: Desk;
  /** Sent verbatim as her first message, phrased as she would phrase it. */
  ask: string;
};

/** The line the house says back before the desk answers. */
export const LAID_OUT = "I’ve laid something out for you.";

export const OCCASIONS: Occasion[] = [
  {
    label: "A board meeting",
    desk: "beauty",
    ask: "I have a board meeting in the morning. What should I do the night before and what do I put on before I walk in?",
  },
  {
    label: "A first date",
    desk: "beauty",
    ask: "I have a first date tonight. What should I put on that still looks like me?",
  },
  {
    label: "A long flight",
    desk: "beauty",
    ask: "I have a long flight. What should I take with me and what do I use when I land?",
  },
  {
    label: "A big night",
    desk: "beauty",
    ask: "Big night out. What do I use so my skin holds up under the lights and after?",
  },
  {
    label: "Monday morning",
    desk: "beauty",
    ask: "Monday morning, no time. What is the shortest routine that actually does something?",
  },
  {
    label: "Starting over",
    desk: "beauty",
    ask: "I am starting over with my skin. Where should I begin, and what should I stop doing?",
  },
  {
    label: "I just want to feel expensive",
    desk: "beauty",
    ask: "I just want to feel expensive. What would you lay out for me?",
  },
];
