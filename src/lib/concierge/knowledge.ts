/**
 * The concierge's knowledge base.
 *
 * ── THE ONE RULE THAT GOVERNS THIS FILE ─────────────────────────────────────
 *
 * A claim that LIMITS what the product does may be written here freely.
 * A claim that ASSERTS what the product does must already exist on the site
 * or the approved label.
 *
 * That asymmetry is deliberate and it is the whole safety model. "Topical
 * collagen will not replace the collagen you have lost" costs nothing if it
 * turns out to be conservative. "Clinically shown to firm in four weeks" costs
 * everything if it turns out to be unsupported. So the concierge is allowed to
 * talk a customer *down* from a category myth on its own authority, and is
 * allowed to talk a product *up* only in words the brand has already approved.
 *
 * ── WHY MOST OF THIS IS GENERATED, NOT TYPED ────────────────────────────────
 *
 * Product facts are read out of `products.ts` and policy text out of
 * `content.ts` at build time. Nobody can edit a price on the product page and
 * leave the concierge quoting the old one, because there is only one copy of
 * the number. The hand-written sections below are only the things that exist
 * nowhere else — brand position, and the category corrections.
 *
 * ── WHAT WAS CUT FROM THE PROTOTYPE, AND WHY ────────────────────────────────
 *
 * The design prototype cited specific studies and figures: a named 2011 trial
 * with n=76, a molecular weight of 300,000 Daltons, a "55% of free radicals"
 * result for SPF 20+. Those may well all be sound. None of them are on the
 * site, none were verified here, and a chatbot repeating a citation makes it
 * the brand's claim. They are cut. The honest substance survives without the
 * false precision. If Shelby wants the numbers back, they need a source on
 * file first — noted in the concierge doc.
 */

import { BRAND } from "../brand";
import { policies } from "../content";
import { formatPrice, products, SET } from "../products";

/** One retrievable chunk. `id` exists so a bad answer can be traced to a source. */
export type Fact = {
  id: string;
  /** Words a customer might actually use, for the crude retrieval below. */
  cues: string[];
  text: string;
};

/* ── Products: generated, never typed ────────────────────────────────────── */

function productFacts(): Fact[] {
  return products.flatMap((p) => {
    const money = `${p.size}, ${formatPrice(p.price)}`;
    return [
      {
        id: `product:${p.slug}`,
        cues: [
          p.name.toLowerCase(),
          p.slug,
          p.archetype.toLowerCase(),
          p.category.toLowerCase(),
        ],
        text: [
          `${p.name} — ${p.archetype}. ${p.category}. ${money}.`,
          `What it is: ${p.what}`,
          `Who it is for: ${p.who}`,
          `The need it addresses: ${p.need}`,
          `Cosmetic benefit as approved: ${p.benefit}`,
          `Key active exactly as printed on the label: ${p.keyActive}`,
          `When: ${p.timing}. In a routine: ${p.routine}`,
          `How to use: ${p.howToUse.map((s) => `${s.step} — ${s.detail}`).join(" ")}`,
          p.ingredients
            ? `Full ingredient list: ${p.ingredients.join(", ")}`
            : `The full INCI list is NOT published on the site. Do not recite one. Offer to have the team send the supplier sheet.`,
        ].join("\n"),
      },
      ...p.faqs.map((f, i) => ({
        id: `faq:${p.slug}:${i}`,
        cues: [p.name.toLowerCase(), ...f.q.toLowerCase().split(/\W+/).filter((w) => w.length > 4)],
        text: `Published Q&A for ${p.name}. Q: ${f.q} A: ${f.a}`,
      })),
    ];
  });
}

/* ── The set ─────────────────────────────────────────────────────────────── */

const full = products.reduce((sum, p) => sum + p.price, 0);
const saving = Math.round(((full - SET.price) / full) * 1000) / 10;

const SET_FACT: Fact = {
  id: "product:trio",
  cues: ["trio", "all three", "set", "bundle", "save", "house trio", "cheaper", "together"],
  text: [
    `The House Trio: ${SET.detail}, ${formatPrice(SET.price)}.`,
    `Bought separately the three come to ${formatPrice(full)}, so the set saves ${saving}%.`,
    `Positioned as a wardrobe rather than a discount: The Closer, The Entrance, The Comeback — three formulas for three kinds of days. "No woman is only one version of herself."`,
    `It is the same three full-size bottles, not samples.`,
  ].join("\n"),
};

/* ── Brand ───────────────────────────────────────────────────────────────── */

const BRAND_FACTS: Fact[] = [
  {
    id: "brand:who",
    cues: ["founder", "brand", "who are you", "about", "philosophy", "lalaloca", "stand for", "why"],
    text: [
      `${BRAND.structure} FOUNDER is the master brand and the seller of record — the name on the order, the receipt and the packaging. LALALOCA is the name of the serum collection.`,
      `Belief: ${BRAND.belief} Campaign line: ${BRAND.campaign} Tagline: ${BRAND.tagline}`,
      `The brand line is set on two lines and never one: "${BRAND.campaignLines[0]}" / "${BRAND.campaignLines[1]}"`,
      `Not every woman has a company. Every woman is building something. Three serums, and the rest of what the brand does is about the women who buy it.`,
      `Founder. Found her. Both meanings, deliberately.`,
    ].join("\n"),
  },
  {
    id: "brand:three",
    cues: ["why three", "only three", "more products", "fourth", "range"],
    text: `There are three serums because a fourth has not earned its place. Hydration, brightness, cushion — morning and night. They are built to sit together, which is what the Trio is.`,
  },
  {
    id: "brand:claims",
    cues: ["claim", "results", "proof", "evidence", "clinical", "study", "trial", "guarantee"],
    text: [
      `These are cosmetic products. They act on how skin LOOKS and FEELS — hydration, texture, light. They do not treat, diagnose, cure or prevent any disease, and no clinical results are claimed anywhere on the site.`,
      `Every product page carries the line: cosmetic benefits only, and skin varies.`,
      `The brand does not publish reviews or star ratings it did not receive. There are currently no customer reviews. Do not invent one, and do not imply popularity.`,
    ].join("\n"),
  },
  {
    id: "brand:found-her",
    cues: ["found her", "story", "stories", "journal", "share", "submit", "profile", "featured"],
    text: [
      `FOUND HER is the brand's stories platform: women writing about what they started, survived, changed, finished, and finally gave themselves credit for. "${BRAND.campaign}"`,
      `Submissions go through the form on the Found Her page, at /found-her#share. No purchase is ever required to be featured — that is a rule, not a promotion.`,
      `Two separate permissions are asked for and neither is assumed: permission to reply, and permission to consider it for publication. Either can be withdrawn.`,
      `A person reads every submission. Profiles are edited by the FOUNDER team and the contributor approves the final text before anything is published. Nothing is invented.`,
    ].join("\n"),
  },
  {
    id: "brand:list",
    cues: ["newsletter", "email list", "founding list", "join", "subscribe", "mailing"],
    text: `The Founding List is the brand's email list. A few emails a month, not a few a week: which serum to start with, new stories as they are published, and word when something is back in stock. Sign-up is in the site footer. Every email carries a working unsubscribe link.`,
  },
];

/* ── Policy: generated ───────────────────────────────────────────────────── */

function policyFacts(): Fact[] {
  return (["shipping", "returns", "privacy", "terms"] as const).map((slug) => {
    const p = policies[slug];
    return {
      id: `policy:${slug}`,
      cues: [slug, ...p.title.toLowerCase().split(/\W+/)].filter(Boolean),
      text: [
        `PUBLISHED ${p.title.toUpperCase()} POLICY — quote only what is here.`,
        p.intro,
        ...p.sections.map((s) => `${s.heading}: ${s.body}`),
      ].join("\n"),
    };
  });
}

/* ── Category corrections ────────────────────────────────────────────────────
 *
 * Every entry below reduces expectations. That is why they are allowed to be
 * written here rather than sourced from the site: the brand can only lose by
 * them, so there is no incentive to overstate, and a customer who hears them is
 * better informed than one who doesn't. Specific study citations were removed —
 * see the header.
 */

const CORRECTIONS: Fact[] = [
  {
    id: "correct:ha-1000x",
    cues: ["1000", "1,000", "thousand times", "holds its weight", "times its weight"],
    text: `The "hyaluronic acid holds 1000 times its weight in water" line is a misreading that has been repeated until it sounds like fact. It describes the solvent volume one expanded molecule sweeps out in dilute solution — which is why a very small amount thickens water dramatically — not how much water the molecule binds. Hyaluronic acid is still an excellent humectant. The number is folklore, and the concierge should say so.`,
  },
  {
    id: "correct:ha-layers",
    cues: ["8-layer", "8 layer", "eight layer", "molecular weight", "better than regular", "multi-weight"],
    text: `Thirst Trap uses eight molecular weights of hyaluronic acid. Larger molecules sit at the surface and hold water there; smaller ones travel further into the upper layers. Do NOT claim a blend outperforms a single well-chosen weight — that comparison is not something the brand can evidence. What the blend genuinely buys is surface hold without the heaviness a high-weight-only formula tends to have. It is a texture and coverage choice, not a magic number.`,
  },
  {
    id: "correct:topical-collagen",
    cues: ["collagen supplement", "oral collagen", "collagen drink", "replace collagen", "topical collagen", "same as taking"],
    text: `Applied collagen and swallowed collagen are not the same thing and should never be conflated. Collagen applied to skin stays at the surface — the molecule is far too large to pass through the outer layer. What it does well is hold moisture and form a smoothing film, so skin looks plumper and feels more cushioned. That is genuine and it is what Bounce Back is for. It is not the supplement research, and it does not replace collagen the body has lost.`,
  },
  {
    id: "correct:wrinkles",
    cues: ["wrinkle", "fine lines", "anti-aging", "anti aging", "get rid of", "botox", "filler"],
    text: `Nothing here removes a wrinkle, and the concierge must not suggest otherwise. Hydrated skin makes fine lines look temporarily softer and skin look smoother. That is real and visible, and it is a different thing from removing a line. Anyone wanting more than that should see a board-certified dermatologist.`,
  },
  {
    id: "correct:vitc-niacinamide",
    cues: ["niacinamide", "mix vitamin c", "together", "combine", "conflict"],
    text: `Vitamin C and niacinamide can be used together. The belief that they cannot traces to mid-century laboratory work on the two compounds interacting in solution at high concentration — not in a cosmetic formulation and not on skin. Turning niacinamide into nicotinic acid, the flushing compound, needs strong acid or base plus heat. That does not happen in a bottle or on a face.`,
  },
  {
    id: "correct:spf",
    cues: ["sunscreen", "spf", "sun", "uv", "replace sunscreen", "protect"],
    text: `C Me Glow goes UNDER sunscreen and never replaces it. Vitamin C has no SPF and is not a UV filter — the two work differently, and sunscreen is the one doing the protecting. Always tell a customer to keep wearing it.`,
  },
  {
    id: "correct:oxidation",
    cues: ["yellow", "orange", "brown", "changed colour", "changed color", "oxidis", "oxidiz", "gone off", "expired"],
    text: `A vitamin C serum yellowing means it is oxidising. A faint tint means it is losing potency; orange or brown means it is past useful. It is a potency question, not a safety one. Cool, dark, cap closed makes it last longer. The Shopify listing carries this note too.`,
  },
  {
    id: "correct:damp",
    cues: ["damp", "wet skin", "dry skin apply", "why damp"],
    text: `Humectants draw moisture from whatever is available to them. Applied to damp skin and sealed with a moisturiser they have water to work with; applied to bone-dry skin in a dry room with nothing over the top they have very little. This is why every routine here says damp skin.`,
  },
  {
    id: "correct:actives",
    cues: ["retinol", "retinoid", "tretinoin", "acid", "aha", "bha", "exfoliant"],
    text: `Many people run vitamin C in the morning and a retinoid at night. That is a tolerability pattern rather than a chemical requirement — the real constraint is stacking irritants. Anyone on a prescription retinoid should check with whoever prescribed it. The concierge does not design routines around prescription medication.`,
  },
  {
    id: "correct:allergen",
    cues: ["allergy", "allergic", "fish", "seafood", "shellfish", "marine", "vegan", "animal"],
    text: `Thirst Trap contains marine collagen, which is fish-derived. Anyone with a fish or seafood allergy should be steered away from it and told to check with their allergist. Fish collagen is a recognised allergen. For C Me Glow and Bounce Back the brand has NOT confirmed vegan status here — do not guess either way; escalate.`,
  },
];

/* ── Retrieval ────────────────────────────────────────────────────────────── */

export const FACTS: Fact[] = [
  ...productFacts(),
  SET_FACT,
  ...BRAND_FACTS,
  ...policyFacts(),
  ...CORRECTIONS,
];

/**
 * Keyword retrieval, deliberately.
 *
 * A vector store would retrieve better, and it would also mean a second
 * service, an embedding bill, an index that can fall out of date with
 * products.ts, and a failure mode where nobody can explain why the bot said
 * something. This corpus is about forty short entries. Scoring them all on
 * every request costs microseconds and is completely inspectable — every
 * answer can be traced to the `id`s that were in front of the model.
 *
 * Revisit when the corpus is in the hundreds. Not before.
 */
export function retrieve(query: string, limit = 8): Fact[] {
  const q = query.toLowerCase();
  const words = q.split(/\W+/).filter((w) => w.length > 3);

  const scored = FACTS.map((fact) => {
    let score = 0;
    for (const cue of fact.cues) {
      if (cue.length > 2 && q.includes(cue)) score += cue.includes(" ") ? 4 : 3;
    }
    for (const w of words) if (fact.text.toLowerCase().includes(w)) score += 1;
    return { fact, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  /* Brand and claims context rides along with everything. The single most
     likely failure of a retrieval bot is answering a product question with no
     compliance framing in the window. */
  const always = FACTS.filter((f) => f.id === "brand:claims");
  const top = scored.slice(0, limit).map((s) => s.fact);
  return [...always, ...top.filter((f) => !always.includes(f))];
}
