/**
 * Public copy. Written to sound like a person, not a brand deck.
 *
 * Rules applied throughout: the prohibited-language list in the brand brief is
 * kept out of every customer-facing string; no invented reviews, contributors,
 * statistics or press; and the customer stays the main character.
 */

/* ---------------- FOUND HER — editorial platform ---------------- */

/** Questions each profile answers, shown on the page so women know what we ask. */
export const PROFILE_QUESTIONS = [
  "What are you building?",
  "What’s the part nobody saw?",
  "What are you proud of?",
  "When did you find her?",
  "What does beauty mean to you now?",
  "What would you tell a woman starting where you started?",
];

/* The team-written notes that used to live here ("The ten minutes before",
   "Nobody clapped", "What she said once, in passing") were removed with their
   section. The archive is contributors' stories only; their old URLs redirect
   to /found-her in next.config.ts. */

/* ---------------- Share Your Story ---------------- */

export const STORY_INTRO =
  "Finish the sentence. Maybe you found her the day you opened the company, or the day you closed one. Raising a family, finishing school, starting over, getting through a hard year, speaking up, helping someone else, or finally choosing yourself. However it happened, we want to hear about it.";

/**
 * The sentence completion comes first and is required — it is the recurring
 * community invitation, not one question among several. Everything after it is
 * context she can give us if she wants to.
 */
export const STORY_FIELDS = [
  {
    name: "found",
    label: "I found her when…",
    hint: "Finish the sentence in your own words. One line is enough; more is welcome.",
    aiHint:
      "Finish the sentence in my own words. One line is enough, but include more if my story supports it.",
    rows: 3,
    required: true,
  },
  {
    name: "building",
    label: "What are you building?",
    hint: "A company, a family, a body of work, a comeback — whatever it is.",
    aiHint:
      "This could be a company, family, body of work, comeback, new life, community, or something else meaningful to me.",
    rows: 3,
    required: true,
  },
  {
    name: "proud",
    label: "What are you proud of?",
    rows: 4,
    required: false,
  },
  {
    name: "cost",
    label: "What did it take?",
    hint: "The part people don’t see, if you want to tell us.",
    aiHint:
      "Include the part people may not see, but only if I have previously shared it.",
    rows: 4,
    required: false,
  },
  {
    name: "yourself",
    label: "What makes you feel most like yourself?",
    rows: 3,
    required: false,
  },
  {
    name: "next",
    label: "What would you tell a woman beginning now?",
    rows: 3,
    required: false,
  },
];

/**
 * The prompt a woman can hand to her own AI before she writes.
 *
 * WHY THIS EXISTS AND WHY IT READS THE WAY IT DOES. Some women can say the
 * thing out loud long before they can write it down, and plenty of them are
 * already talking to an assistant every day. Pretending otherwise would not
 * keep AI off this page; it would only mean the drafts arriving here were
 * written by an assistant that had been told nothing about honesty. So the
 * prompt is the safeguard: it forbids invention, forbids generic empowerment
 * language, forbids inferring anything sensitive, forbids searching the
 * internet for someone with a similar name, and requires the literal sentence
 * "I need your input for this answer" wherever the assistant does not know.
 * That is the editorial charter — nothing is invented, she approves the words —
 * translated into instructions a machine can follow.
 *
 * IT IS BUILT FROM STORY_FIELDS, NOT PASTED BESIDE THEM. The field list below
 * is generated from the same array the form renders, so a question can never
 * be added, reworded or reordered on the form while the prompt keeps asking
 * for the old one. The four contact fields are the only literals, and they
 * match the inputs at the top of StoryForm.
 */
const STORY_AI_CONTACT_FIELDS = [
  "Your name",
  "Email",
  "Location (optional)",
  "Instagram or website (optional)",
];

const STORY_AI_RULES = [
  "Do not invent, assume, exaggerate, or embellish any details.",
  "Do not use generic inspirational language that could describe anyone.",
  "Only include facts, experiences, accomplishments, challenges, and feelings that I have personally shared with you.",
  "Do not infer sensitive details such as my email, location, family status, health, finances, or identity.",
  "If you do not have enough information to answer something truthfully, write: “I need your input for this answer.”",
  "Write in the first person and make the responses sound natural, honest, personal, and emotionally grounded.",
  "Preserve my voice. Do not make me sound overly polished, corporate, or AI-generated.",
  "Keep each response concise but meaningful.",
  "After drafting, identify any statement that may need me to verify before submitting.",
  "Do not search the internet or use information about another person with a similar name.",
];

export const STORY_AI_PROMPT = [
  "Using only credible facts I have explicitly shared with you in our past conversations, help me complete the FOUND HER submission form below.",
  "",
  "Important rules:",
  "",
  ...STORY_AI_RULES.map((rule) => `- ${rule}`),
  "",
  "Complete these fields:",
  "",
  ...[
    ...STORY_AI_CONTACT_FIELDS,
    ...STORY_FIELDS.map((field) =>
      [field.label, field.required ? "" : "(optional)", field.aiHint ?? ""]
        .filter(Boolean)
        .join(" "),
    ),
  ].map((line, index) => `${index + 1}. ${line}`),
  "",
  "First, review what you credibly know about me from our conversations. If important information is missing, ask me up to five short questions before writing the final submission. Then present the completed answers under their matching form headings, ready for me to review and paste into the FOUND HER form.",
].join("\n");

export const STORY_STANDARD = [
  {
    title: "You approve the words",
    detail:
      "Nothing is published until you have read the final text and said yes to it as written.",
  },
  {
    title: "Two separate permissions",
    detail:
      "One to reply to you. A different one to consider your story for publication. Neither is bundled into the other.",
  },
  {
    title: "Nothing is invented",
    detail:
      "No composite women, no made-up names or quotes. An empty page is more honest than a fabricated one.",
  },
  {
    title: "No purchase, ever",
    detail:
      "You don’t have to buy anything to send this, and buying something doesn’t move you up the list.",
  },
];

/* ---------------- Which serum ---------------- */

export type QuizQuestion = {
  id: string;
  eyebrow: string;
  question: string;
  helper?: string;
  options: {
    label: string;
    detail: string;
    scores: Partial<Record<"bounce-back" | "thirst-trap" | "c-me-glow", number>>;
  }[];
};

export const quiz: QuizQuestion[] = [
  {
    id: "skin",
    eyebrow: "Question 1",
    question: "What does your skin do most days?",
    helper: "Pick the one that sounds most like this week.",
    options: [
      {
        label: "Goes tight and flaky",
        detail: "Especially by mid-afternoon, or under makeup",
        scores: { "thirst-trap": 3 },
      },
      {
        label: "Looks dull or uneven",
        detail: "Fine up close, flat in photos",
        scores: { "c-me-glow": 3 },
      },
      {
        label: "Feels slack or tired",
        detail: "You want more spring to it",
        scores: { "bounce-back": 3 },
      },
      {
        label: "All three, depending on the week",
        detail: "That’s most people",
        scores: { "bounce-back": 1, "thirst-trap": 1, "c-me-glow": 1 },
      },
    ],
  },
  {
    id: "when",
    eyebrow: "Question 2",
    question: "When would you actually use it?",
    options: [
      {
        label: "Morning, before everything else",
        detail: "Under sunscreen and makeup",
        scores: { "c-me-glow": 2, "thirst-trap": 1 },
      },
      {
        label: "Night, after the house goes quiet",
        detail: "The one part of the day that’s yours",
        scores: { "bounce-back": 2, "thirst-trap": 1 },
      },
      {
        label: "Both, if it’s comfortable enough",
        detail: "You don’t want anything heavy",
        scores: { "thirst-trap": 2 },
      },
      {
        label: "Whenever I get five minutes",
        detail: "Honest answer",
        scores: { "bounce-back": 1, "thirst-trap": 1, "c-me-glow": 1 },
      },
    ],
  },
  {
    id: "routine",
    eyebrow: "Question 3",
    question: "How much are you willing to do?",
    options: [
      {
        label: "One serum, that’s it",
        detail: "Cleanse, serum, moisturiser",
        scores: { "thirst-trap": 2 },
      },
      {
        label: "One for mornings, one for nights",
        detail: "You’ll keep two on the shelf",
        scores: { "c-me-glow": 2, "bounce-back": 1 },
      },
      {
        label: "The full three",
        detail: "You like a proper routine",
        scores: { "bounce-back": 2, "thirst-trap": 1, "c-me-glow": 1 },
      },
      {
        label: "Depends how it feels",
        detail: "Try one, see how it goes",
        scores: { "thirst-trap": 1, "c-me-glow": 1 },
      },
    ],
  },
];

/* ---------------- Policies ---------------- */

export const policies = {
  shipping: {
    title: "Shipping",
    intro:
      "Free standard shipping on every US order. Everything is packed and sent from Arizona, with tracking on every parcel.",
    sections: [
      {
        heading: "What it costs and how long it takes",
        body: "Standard shipping is free anywhere in the United States and takes 3–5 business days. Express is $15 and takes 1–2 business days. Orders are dispatched within one business day. You’ll get a tracking number either way.",
      },
      {
        heading: "Outside the United States",
        body: "We don’t ship internationally yet. If you’re outside the US, checkout won’t be able to quote you a rate — write to us and we’ll tell you when that changes rather than guess at a date.",
      },
      {
        heading: "If it arrives damaged",
        body: "Every bottle is wrapped and boxed to survive transit. If something breaks anyway, send us a photo and we’ll make it right — that’s on us, not on you.",
      },
    ],
  },
  returns: {
    title: "Returns",
    intro:
      "If something arrives damaged or isn’t what you expected, we want to sort it out without a negotiation.",
    sections: [
      {
        heading: "The principle",
        body: "Write to us and tell us what happened. Cosmetics have rules about what can be resold, so opened products are handled differently from sealed ones — but a genuine problem is our problem, not yours.",
      },
      {
        heading: "Still to confirm",
        body: "The return window, the condition requirements and refund timing need commercial and legal sign-off before they are published as terms.",
      },
    ],
  },
  accessibility: {
    title: "Accessibility",
    intro:
      "If you can’t use this site, it doesn’t work. Accessibility was built in rather than added afterwards.",
    sections: [
      {
        heading: "What’s built in",
        body: "Semantic headings and landmarks, keyboard operation for everything including the product doors, visible focus states, respect for reduced-motion settings, alternative text on imagery, and contrast held to WCAG AA for body text and controls.",
      },
      {
        heading: "What’s still to come",
        body: "A third-party audit including assistive-technology testing should be commissioned before public launch. If you hit a barrier here, tell us and we’ll fix it.",
      },
    ],
  },
  privacy: {
    title: "Privacy",
    intro:
      "Your details, and especially your story, are handled with specific permission that you can withdraw.",
    sections: [
      {
        heading: "Stories",
        body: "A person reads every submission. Permission to reply to you and permission to publish your story are asked for separately, and neither is assumed. You can withdraw either at any time.",
      },
      {
        heading: "Still to confirm",
        body: "The full privacy notice, the list of data processors and the regional disclosures need legal review before publication.",
      },
    ],
  },
  terms: {
    title: "Terms",
    intro: "The terms of sale and site use need legal review before publication.",
    sections: [
      {
        heading: "About the products",
        body: "These are cosmetic products. Nothing on this site is medical advice, and no clinical or regulatory claims are made or implied.",
      },
      {
        heading: "About the names",
        body: "FOUNDER is the seller and the name you’ll see at checkout, on your receipt, on the confirmation email and on the packaging. LALALOCA is the name of the serum collection itself — Thirst Trap, C Me Glow and Bounce Back. One company, two names doing different jobs.",
      },
      {
        heading: "Still to confirm",
        body: "Governing law, limitation of liability and the purchase terms are marked for completion rather than invented.",
      },
    ],
  },
} as const;

export type PolicySlug = keyof typeof policies;
