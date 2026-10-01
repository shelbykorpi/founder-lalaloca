/**
 * The concierge without a model.
 *
 * ── WHY THIS EXISTS ─────────────────────────────────────────────────────────
 *
 * The site went live with the model route broken: Vercel's AI Gateway answers
 * every request with 403 (see the note in model.ts), and until a working key
 * is in place every question got "The concierge isn't connected yet". Shelby,
 * 2 Oct 2026: "if we need just auto generated answers that's fine too, but
 * we're live now."
 *
 * So when the model is missing or fails, the route answers from here instead.
 * When a model is working again this file stays as the safety net. The route
 * only reaches it on failure.
 *
 * ── THE RULES IT KEEPS ──────────────────────────────────────────────────────
 *
 * Every fact is READ from the same sources the site renders: products.ts,
 * founderCollection.ts, nextMove.ts and the policy text in content.ts. Nothing
 * here can quote a price, a ship date or a return window that the site doesn't
 * also show. The hand-written sentences are routing and tone only, plus the
 * category corrections already approved in knowledge.ts, which only LOWER
 * expectations.
 *
 * Guardrails still run first. Reactions, medical questions, pregnancy, skin
 * lightening and requests for a person are answered by screenInbound before
 * this file is ever asked, and every reply here goes through screenOutbound.
 *
 * When it doesn't know, it says so and gives the email. It never guesses.
 */

import { CONTACT_EMAIL } from "../brand";
import { policies } from "../content";
import { formatPrice, products, SET } from "../products";
import { FOUNDER_COLLECTION } from "../founderCollection";
import { COLLECTION_SHIPS, EXPRESS_OFFERED, NEXT_MOVE } from "../nextMove";

const SITE = "founderbeauty.co";

export type FallbackReply = { text: string; tag?: string };

/* ── One shape for every product the house sells ─────────────────────────── */

type Item = {
  slug: string;
  name: string;
  line: "LALALOCA" | "the FOUNDER Collection";
  category: string;
  size: string;
  price: number;
  what: string;
  key: string;
  how: string | null;
  when: string | null;
  ingredients: string[] | null;
  shades: string | null;
  /** Extra words people use for it, beyond its name. */
  aliases: string[];
};

const ALIASES: Record<string, string[]> = {
  "thirst-trap": ["hyaluronic", "hydrating serum"],
  "c-me-glow": ["vitamin c", "cme glow", "c-me", "see me glow"],
  "bounce-back": ["collagen serum", "night serum"],
  "opening-line": ["cleanser", "cleansing oil", "oil to milk", "oil-to-milk"],
  "clean-break": ["face wash", "facewash"],
  "hold-the-room": ["moisturiser", "moisturizer", "face cream", "peptide cream"],
  "double-take": ["eye cream"],
  "smooth-talker": ["tone stick", "cc stick", "ceramide stick"],
};

function steps(list: { step: string; detail: string }[] | undefined): string | null {
  if (!list?.length) return null;
  return list.map((s) => `**${s.step}.** ${s.detail}`).join(" ");
}

const ITEMS: Item[] = [
  ...products.map(
    (p): Item => ({
      slug: p.slug,
      name: p.name,
      line: "LALALOCA",
      category: p.category,
      size: p.size,
      price: p.price,
      what: p.what,
      key: p.keyActive,
      how: steps(p.howToUse),
      when: p.timing,
      ingredients: p.ingredients,
      shades: null,
      aliases: ALIASES[p.slug] ?? [],
    }),
  ),
  ...FOUNDER_COLLECTION.map(
    (p): Item => ({
      slug: p.slug,
      name: p.name,
      line: "the FOUNDER Collection",
      category: p.category,
      size: p.size,
      price: p.price,
      what: p.what,
      key: p.keyActive,
      how: steps(p.howToUse),
      when: p.timing,
      ingredients: p.ingredients,
      shades: null,
      aliases: ALIASES[p.slug] ?? [],
    }),
  ),
  ...NEXT_MOVE.filter((p) => !FOUNDER_COLLECTION.some((f) => f.slug === p.slug)).map(
    (p): Item => ({
      slug: p.slug,
      name: p.name,
      line: "the FOUNDER Collection",
      category: p.category,
      size: p.size,
      price: p.price,
      what: p.what,
      key: p.keyIngredients.join(", "),
      how: null,
      when: null,
      ingredients: p.ingredients,
      shades: p.shades?.length ? p.shades.map((s) => `${s.code} ${s.name}`).join(", ") : null,
      aliases: ALIASES[p.slug] ?? [],
    }),
  ),
];

const SERUMS = ITEMS.filter((i) => i.line === "LALALOCA");
const COLLECTION = ITEMS.filter((i) => i.line !== "LALALOCA");

function mentioned(q: string): Item[] {
  return ITEMS.filter((i) =>
    [i.name.toLowerCase(), i.slug.replace(/-/g, " "), ...i.aliases].some((w) => q.includes(w)),
  );
}

/* ── The sentences the site already says ─────────────────────────────────── */

function shipping(): string {
  const lines = [
    `**Shipping is free anywhere in the US** on every order, standard, 3–5 business days. Everything is packed and shipped from Arizona with tracking.`,
    COLLECTION_SHIPS
      ? `The LALALOCA serums leave within one business day. **The FOUNDER Collection ships on ${COLLECTION_SHIPS.label}**, so an order that includes any Collection piece ships then.`
      : `Orders leave within one business day.`,
  ];
  if (EXPRESS_OFFERED) lines.push(`Express is $15 and takes 1–2 business days.`);
  lines.push(`We only ship within the US for now. The full policy is at ${SITE}/policies/shipping.`);
  return lines.join("\n\n");
}

function returns(): string {
  const r = policies.returns.sections;
  const pick = (heading: string) => r.find((s) => s.heading === heading)?.body;
  return [
    pick("The window"),
    pick("How to start one"),
    pick("Return postage"),
    pick("Opened products"),
    `Full details: ${SITE}/policies/returns.`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function priceList(): string {
  const serums = SERUMS.map((i) => `${i.name} ${formatPrice(i.price)}`).join(" · ");
  const collection = COLLECTION.map((i) => `${i.name} ${formatPrice(i.price)}`).join(" · ");
  const full = SERUMS.reduce((sum, i) => sum + i.price, 0);
  return [
    `**LALALOCA serums:** ${serums}. **The House Trio**, all three full size: ${formatPrice(SET.price)} instead of ${formatPrice(full)}.`,
    `**The FOUNDER Collection:** ${collection}.`,
    `Shipping is free anywhere in the US.`,
  ].join("\n\n");
}

function summary(i: Item): string {
  const lines = [
    `**${i.name}**, from ${i.line}. ${i.category}, ${i.size}, ${formatPrice(i.price)}.${i.shades ? ` Shades: ${i.shades}.` : ""}`,
    i.what,
  ];
  if (i.when) lines.push(`**When:** ${i.when}.`);
  if (i.line !== "LALALOCA" && COLLECTION_SHIPS) lines.push(`It ships on ${COLLECTION_SHIPS.label}, free anywhere in the US.`);
  lines.push(`More, and the bag, at ${SITE}/products/${i.slug}.`);
  return lines.join("\n\n");
}

function howTo(i: Item): string {
  if (!i.how) {
    return `The full directions for **${i.name}** are on its page at ${SITE}/products/${i.slug}. If anything there isn't clear, write to ${CONTACT_EMAIL} and a person will answer.`;
  }
  return [`**How to use ${i.name}:** ${i.how}`, i.when ? `**When:** ${i.when}.` : ""].filter(Boolean).join("\n\n");
}

function ingredientsOf(i: Item): string {
  if (i.ingredients?.length) {
    return [
      `**${i.name}, key ingredients:** ${i.key}.`,
      `**Full ingredient list:** ${i.ingredients.join(", ")}.`,
    ].join("\n\n");
  }
  return [
    `**${i.name}, key active as printed on the label:** ${i.key}.`,
    `The full ingredient list isn't published on the site yet. Write to ${CONTACT_EMAIL} and the team will send it rather than have me guess.`,
  ].join("\n\n");
}

function whichSerum(): string {
  return [
    `Three serums, three kinds of day:`,
    ...SERUMS.map((i) => `**${i.name}.** ${i.what}`),
    `Not sure? The two-minute serum finder at ${SITE}/find-your-serum asks what your skin does and when you'd use it. Or take all three in **the House Trio** for ${formatPrice(SET.price)}.`,
  ].join("\n\n");
}

function routine(): string {
  const names = (slugs: string[]) =>
    slugs.map((s) => ITEMS.find((i) => i.slug === s)?.name).filter(Boolean).join(", then ");
  return [
    `The order, morning or night: **${names(["opening-line", "clean-break"])}**, then your **serum**, then **${names(["hold-the-room", "double-take", "smooth-talker"])}**.`,
    `Serums go on after cleansing and before moisturiser. C Me Glow is a morning serum and goes under sunscreen, never instead of it.`,
    `Each product page has its own directions.`,
  ].join("\n\n");
}

const CONTACT = `Write to **${CONTACT_EMAIL}**. A person reads every message, and you'll get a reply from a human rather than a ticket number.`;

/* ── The answer ──────────────────────────────────────────────────────────── */

const any = (q: string, words: string[]) => words.some((w) => q.includes(w));

export function answerWithoutModel(raw: string): FallbackReply {
  /* Punctuation becomes a space so "a set?" still matches " set ". */
  const q = ` ${raw
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[?!,;:()"“”]/g, " ")
    .replace(/\s+/g, " ")} `;
  const words = q.trim().split(" ").filter(Boolean);
  const items = mentioned(q);
  const one = items[0];

  if (words.length <= 4 && any(q, [" hi ", " hello ", " hey ", " hiya ", "good morning", "good evening", "good afternoon"])) {
    return {
      text: `Welcome to the house. I can help with the products, prices, shipping, returns and FOUND HER.\n\nWhat can I find for you?`,
    };
  }
  if (words.length <= 5 && any(q, ["thank", " thx", " ty "])) {
    return { text: `My pleasure. I'm here if anything else comes up.` };
  }

  if (any(q, ["where is my order", "where's my order", "track", "tracking", "order status", "my order", "order number", "cancel", "change my order", "change my address", "wrong address", "hasn't arrived", "not arrived", "never arrived", "didn't arrive", "missing"])) {
    return {
      text: `Your tracking link is in the shipping confirmation email that comes when your order leaves us.\n\nFor anything about a specific order, a change, a cancellation or a parcel that hasn't turned up, write to **${CONTACT_EMAIL}** with your order number and a person will sort it out.`,
      tag: "Order help",
    };
  }

  if (any(q, ["international", "outside the us", "outside us", "canada", "mexico", " uk ", "united kingdom", "europe", "australia", "overseas", "ship to other countries", "worldwide"])) {
    return {
      text: `We only ship within the United States for now. If you're elsewhere, write to **${CONTACT_EMAIL}** and we'll tell you when that changes rather than guess at a date.`,
    };
  }

  if (any(q, ["ship", "delivery", "deliver", "arrive", "how long", "express", "postage", "dispatch", "when will i get", "free shipping"])) {
    return { text: shipping(), tag: "Shipping" };
  }

  if (any(q, ["return", "refund", "exchange", "send it back", "send back", "money back", "damaged", "broken", "leaking", "wrong item"])) {
    return { text: returns(), tag: "Returns" };
  }

  if (any(q, ["discount", "coupon", "promo", "code", "sale", "deal", "offer"])) {
    const full = SERUMS.reduce((sum, i) => sum + i.price, 0);
    return {
      text: `The best value in the house is **the House Trio**: all three LALALOCA serums, full size, for ${formatPrice(SET.price)} instead of ${formatPrice(full)}. Shipping is free anywhere in the US on every order.`,
    };
  }

  /* Claims, sun and allergens answer before any product summary, so a
     product name in the question can never route around them. */
  if (any(q, ["wrinkle", "fine line", "anti-aging", "anti aging", "lift my", "lifting", "tighten", "sagging", "botox", "filler"])) {
    return {
      text: `Straight answer: no cream makes a line disappear, ours included. Well-hydrated skin makes fine lines look softer and skin look smoother, and that's real and visible, but it isn't the same thing. For more than that, a board-certified dermatologist is the right person.\n\n${whichSerum()}`,
    };
  }
  if (any(q, ["sunscreen", " spf", "sun protection"])) {
    return {
      text: `C Me Glow goes under your sunscreen and never replaces it. Vitamin C isn't a UV filter, so keep wearing your sunscreen every day.`,
    };
  }
  if (any(q, ["fish", "seafood", "shellfish"])) {
    return {
      text: `Thirst Trap contains marine collagen, which is fish-derived. If you have a fish or seafood allergy, please skip it and check with your allergist before trying anything new.\n\nFor any other product, write to **${CONTACT_EMAIL}** and the team will check the ingredient list with you.`,
    };
  }
  if (any(q, ["vegan", "cruelty", "animal", "gluten", "nut allergy", "allergen"])) {
    return {
      text: `I'd rather not guess on that one. Write to **${CONTACT_EMAIL}** and the team will answer from the supplier sheets.`,
    };
  }
  if (one && any(q, ["ingredient", "inci", "contain", "what's in", "whats in", "formula", "fragrance", "scent"])) {
    return { text: ingredientsOf(one) };
  }
  if (one && any(q, ["how to use", "how do i use", "how do you use", "apply", "directions", "when do i", "when should", "morning", "night", "how often"])) {
    return { text: howTo(one) };
  }
  if (one && items.length === 1) {
    return { text: summary(one) };
  }
  if (items.length > 1) {
    return {
      text: items.map((i) => `**${i.name}.** ${i.category}, ${i.size}, ${formatPrice(i.price)}. ${i.what}`).join("\n\n"),
    };
  }

  if (any(q, ["trio", "all three", "bundle", " set ", "gift set", "the set"])) {
    const full = SERUMS.reduce((sum, i) => sum + i.price, 0);
    return {
      text: [
        `**The House Trio** is all three LALALOCA serums, full size, ${SERUMS.map((i) => i.name).join(", ")}, for ${formatPrice(SET.price)} instead of ${formatPrice(full)} bought separately.`,
        `Three formulas for three kinds of day, so there's no choosing. Free US shipping, and it leaves within one business day.`,
        `It's at ${SITE}/shop.`,
      ].join("\n\n"),
      tag: "The House Trio",
    };
  }

  if (any(q, ["price", "how much", "cost", "expensive", "cheap"])) {
    return { text: priceList(), tag: "Prices" };
  }

  if (any(q, ["which serum", "what serum", "which one", "recommend", "where do i start", "where to start", "start with", "best for", "dry skin", "dull", "tired", "dehydrated", "glow", "what should i", "suggest", "pick", "choose", "help me find", "serum for", "serum"])) {
    return { text: whichSerum(), tag: "Serums" };
  }

  if (any(q, ["routine", "order to apply", "what order", "layer", "steps"])) {
    return { text: routine() };
  }





  if (any(q, ["found her", "story", "stories", "feature", "featured", "submit", "share my"])) {
    return {
      text: `FOUND HER is where women tell their own stories: what they built, what it took, and what changed. They're published only after the woman approves the final words.\n\nRead them, or tell yours, at ${SITE}/found-her. No purchase is ever needed to be featured.`,
      tag: "FOUND HER",
    };
  }

  if (any(q, ["newsletter", "email list", "founding list", "subscribe", "mailing list"])) {
    return {
      text: `The Founding List is our email list: a few emails a month, not a week. New stories, which serum to start with, and word when something is back. Sign up in the footer of any page, and unsubscribe whenever you like.`,
    };
  }

  if (any(q, ["who are you", "about", "founder", "lalaloca", "brand", "who owns", "shelby"])) {
    return {
      text: `FOUNDER is the house. **LALALOCA** is its serum collection, and **the FOUNDER Collection** is its five-piece routine. FOUND HER is where real women tell their stories.\n\nThe whole story, from Shelby herself, is at ${SITE}/our-story.`,
    };
  }

  if (any(q, ["contact", "email", "talk to", "speak to", "phone", "call", "help"])) {
    return { text: CONTACT, tag: "Contact" };
  }

  return {
    text: `I don't have a confident answer to that here, and I'd rather not guess.\n\n${CONTACT}\n\nI can answer straight away about the products, prices, shipping, returns and FOUND HER.`,
  };
}
