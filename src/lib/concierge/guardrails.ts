/**
 * Server-side guardrails for the concierge.
 *
 * ── WHY THESE ARE NOT PROMPT INSTRUCTIONS ───────────────────────────────────
 *
 * The system prompt also tells the model to do all of this, and most of the
 * time it will. These checks exist for the times it doesn't. A model can be
 * argued out of an instruction; a regex that runs before the model is ever
 * called cannot be. The two layers fail differently, which is the only reason
 * to have both.
 *
 * The design prototype ran its equivalent in the browser. That is worth nothing
 * — anyone can open devtools and call the endpoint directly. Everything here
 * runs on the server, and the client is treated as hostile.
 *
 * ── THE THREE THINGS THIS PROTECTS AGAINST, IN ORDER OF COST ────────────────
 *
 * 1. An adverse event handled as a chat message instead of a safety report.
 *    This is the expensive one. MoCRA requires serious adverse events to reach
 *    FDA within 15 business days, and the clock starts when the brand is told,
 *    not when someone notices the email. So a suspected reaction short-circuits
 *    the model entirely: fixed text, and a flag the route uses to escalate.
 *
 * 2. Medical advice. A skincare bot that discusses melasma, acne or eczema is
 *    practising without a licence and voiding the cosmetic framing at the same
 *    time. Refused before the model sees it.
 *
 * 3. Efficacy claims leaking into the answer. Caught on the way out, because
 *    this one the model has to be allowed to try — the words are ordinary and a
 *    pre-filter would refuse half of the legitimate questions.
 */

export type Verdict =
  | { pass: true }
  | {
      pass: false;
      /** Fixed reply. Never model-generated — that is the point. */
      reply: string;
      kind: "care" | "flag";
      tag: string;
      /** True when a human genuinely has to see this, not just be cc'd. */
      escalate: boolean;
      /** Why, for the log and the owner email. */
      reason: string;
    };

const has = (text: string, terms: string[]) => terms.some((t) => text.includes(t));

/* ── 1. Suspected adverse reaction ───────────────────────────────────────────
 *
 * Deliberately broad, and deliberately not clever. A false positive costs an
 * unnecessary email to the owner. A false negative costs a woman with a
 * chemical burn being offered a product recommendation. Those are not
 * comparable, so this errs hard toward catching. */
const REACTION = [
  "burn", "burnt", "burning", "stinging", "stings", "rash", "hives", "welts",
  "swell", "swollen", "blister", "peeling off", "chemical burn", "allergic reaction",
  "broke out in", "reacted badly", "bad reaction", "my face is", "eyes are watering",
  "itchy", "itching", "inflamed",
];
/* Words that make "burning" a metaphor rather than a symptom. */
const NOT_REACTION = [
  "burning question", "burning out", "burnt out", "money to burn", "slow burn",
];

/* ── 2. Diagnosis and medical territory ──────────────────────────────────── */
const CONDITIONS = [
  "melasma", "hyperpigmentation", "acne", "cystic", "rosacea", "eczema",
  "psoriasis", "dermatitis", "keratosis", "milia", "fungal", "perioral",
  "seborrheic", "vitiligo", "shingles", "impetigo", "skin cancer", "melanoma",
  "mole", "lesion",
];
const DIAGNOSIS_INTENT = [
  "do i have", "is this", "what is this", "diagnose", "cure", "treat my",
  "get rid of my", "prescribe", "medication for",
];

/* ── 3. Pregnancy and nursing ────────────────────────────────────────────── */
const PREGNANCY = ["pregnan", "breastfeed", "breast feeding", "nursing", "expecting", "ttc", "trying to conceive"];

/* ── 4. Skin-lightening ──────────────────────────────────────────────────── */
const LIGHTENING = ["whiten", "whitening", "bleach", "lighten my skin", "skin lightening", "fairness"];

/* ── 5. Explicit request for a human ─────────────────────────────────────── */
const HUMAN = [
  "speak to a human", "speak to someone", "talk to a person", "talk to someone",
  "real person", "customer service", "an agent", "reach a person", "reach someone",
  "speak to a real",
];

const OWNER_LINE =
  "I'm passing this to the FOUNDER team now — someone will follow up with you directly.";

export function screenInbound(raw: string): Verdict {
  const t = raw.toLowerCase();

  if (has(t, REACTION) && !has(t, NOT_REACTION)) {
    return {
      pass: false,
      kind: "care",
      tag: "Passed to our team",
      escalate: true,
      reason: "Possible adverse reaction reported",
      reply: [
        "I'm sorry that happened — please stop using the product for now.",
        "If it's severe, or there's any swelling, blistering or difficulty breathing, please seek medical care straight away.",
        `${OWNER_LINE} You can also report a cosmetic reaction to FDA MedWatch at fda.gov/medwatch.`,
      ].join("\n\n"),
    };
  }

  if (has(t, CONDITIONS) || (has(t, DIAGNOSIS_INTENT) && has(t, ["skin", "face", "spot", "patch"]))) {
    return {
      pass: false,
      kind: "flag",
      tag: "Referred out",
      escalate: false,
      reason: "Diagnosis or named skin condition",
      reply: [
        "I can't advise on skin conditions — that's a conversation for a board-certified dermatologist who can actually look at your skin.",
        "What I can do is tell you exactly what's in any of the three, if it would help to take that to an appointment.",
      ].join("\n\n"),
    };
  }

  if (has(t, PREGNANCY)) {
    return {
      pass: false,
      kind: "care",
      tag: "Ask your clinician",
      escalate: false,
      reason: "Pregnancy or nursing",
      reply: [
        "I can't clear anything for pregnancy or nursing — please ask your OB or midwife, who knows your situation.",
        "What I can tell you factually is that none of the three contain retinoids or hydroquinone, the two ingredients most often flagged. That's information, not clearance.",
      ].join("\n\n"),
    };
  }

  if (has(t, LIGHTENING)) {
    return {
      pass: false,
      kind: "flag",
      tag: "Referred out",
      escalate: false,
      reason: "Skin-lightening request",
      reply: [
        "We don't make products for that.",
        "C Me Glow is a cosmetic serum formulated to help skin look brighter and more even in tone. If you have a specific pigment concern, a dermatologist is the right person to see.",
      ].join("\n\n"),
    };
  }

  if (has(t, HUMAN)) {
    return {
      pass: false,
      kind: "care",
      tag: "Passed to our team",
      escalate: true,
      reason: "Asked for a human",
      reply: [
        "Of course.",
        `${OWNER_LINE} If it's about an order, have the order number ready — it'll save you a round trip.`,
      ].join("\n\n"),
    };
  }

  return { pass: true };
}

/* ── Outbound ────────────────────────────────────────────────────────────────
 *
 * Phrases the brand does not use about its own products, checked on the model's
 * output. Kept tight on purpose: a long list produces false positives on
 * ordinary sentences, and a filter that fires constantly gets switched off.
 * These are the ones that would actually be a problem in writing. */
const BANNED_OUT: { pattern: RegExp; why: string }[] = [
  { pattern: /\bclinically (proven|shown|tested)\b/i, why: "clinical claim" },
  { pattern: /\bdermatologist[- ](tested|approved|recommended)\b/i, why: "unsubstantiated endorsement" },
  { pattern: /\b(cures?|heals?|treats?)\b[^.]{0,40}\b(acne|eczema|rosacea|wrinkles?|condition)\b/i, why: "treatment claim" },
  { pattern: /\bFDA[- ]approved\b/i, why: "no cosmetic is FDA-approved" },
  { pattern: /\b(hypoallergenic|non[- ]comedogenic)\b/i, why: "unsubstantiated safety claim" },
  { pattern: /\b\d+(\.\d+)?%\s+of (users|women|customers|people)\b/i, why: "invented consumer statistic" },
  { pattern: /\b(guarantee[ds]?|guaranteed results|will eliminate|erases?)\b/i, why: "results guarantee" },
  { pattern: /\b\d(\.\d)?\s*(out of 5|stars?)\b/i, why: "rating — there are none" },
  { pattern: /\bbest[- ]sell(er|ing)\b/i, why: "unverified popularity claim" },
];

export type OutboundCheck = { clean: true } | { clean: false; why: string };

export function screenOutbound(reply: string): OutboundCheck {
  for (const { pattern, why } of BANNED_OUT) {
    if (pattern.test(reply)) return { clean: false, why };
  }
  return { clean: true };
}

/** Shown instead of a blocked answer. Honest about what happened. */
export const OUTBOUND_FALLBACK = [
  "I started to answer that and stopped myself — I'd have been claiming more than we can actually stand behind.",
  "Let me get you a straight answer from the team rather than a confident-sounding one from me.",
].join("\n\n");
