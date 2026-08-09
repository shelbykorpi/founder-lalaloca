/**
 * The four desks, and what sits on each menu.
 *
 * Copy only — no logic, no facts. Lifted from the design prototype and kept in
 * its voice, because that voice is the reason the thing works: the menu reads
 * like a bill of fare rather than a support index, and every line is written as
 * if a person wrote it.
 *
 * `ask` is what gets sent to the concierge when a line is pressed. It is phrased
 * as a customer would phrase it, not as a command, so the model sees the same
 * shape of input whether she pressed a line or typed one.
 */

export type Desk = "beauty" | "house" | "found" | "service";

export type DeskContent = {
  label: string;
  /** Shown as the page's welcome. */
  title: string;
  courses: { label: string; items: { name: string; desc: string; ask: string }[] }[];
  faq: string[];
  /** The line under the cloche at the foot of the card. */
  note: string;
  /** Suggested follow-ups, shown under the chat. */
  chips: string[];
};

export const DESK_ORDER: Desk[] = ["beauty", "house", "found", "service"];

export const DESKS: Record<Desk, DeskContent> = {
  beauty: {
    label: "Beauty",
    title: "Welcome in.",
    courses: [
      {
        label: "To begin",
        items: [
          {
            name: "Which one is yours",
            desc: "Tell me what your skin’s doing. I’ll tell you straight.",
            ask: "Which serum should I start with?",
          },
          {
            name: "The order of things",
            desc: "What goes where. Morning, and night.",
            ask: "What order do I use them in?",
          },
        ],
      },
      {
        label: "In detail",
        items: [
          {
            name: "What’s actually in it",
            desc: "Ingredients, plainly. Nothing borrowed.",
            ask: "What’s actually in them?",
          },
          {
            name: "How long it really takes",
            desc: "Including the slow part nobody mentions.",
            ask: "How long before I see anything?",
          },
        ],
      },
    ],
    faq: [
      "Can I use vitamin C and niacinamide together?",
      "Does hyaluronic acid really hold 1000× its weight?",
      "Is topical collagen the same as taking it?",
      "Do I still need sunscreen?",
      "My serum turned yellow — is it off?",
    ],
    note: "Ask the awkward ones too.",
    chips: [
      "Is 8-layer HA better than regular?",
      "Will this get rid of my wrinkles?",
      "I’m allergic to fish",
      "What if my skin is sensitive?",
    ],
  },

  house: {
    label: "The House",
    title: "The House.",
    courses: [
      {
        label: "What we are",
        items: [
          {
            name: "Founder. Found her.",
            desc: "Both meanings. On purpose.",
            ask: "What does FOUNDER stand for?",
          },
          {
            name: "Why only three",
            desc: "A fourth hasn’t earned its place.",
            ask: "Why are there only three serums?",
          },
        ],
      },
      {
        label: "How we work",
        items: [
          {
            name: "What we’ll claim, and what we won’t",
            desc: "The line, and why we don’t cross it.",
            ask: "How do you talk about results?",
          },
          {
            name: "Where they’re made",
            desc: "Manufacture, sourcing, the paperwork.",
            ask: "Where are these made?",
          },
        ],
      },
    ],
    faq: ["Are these vegan?", "Are these FDA approved?", "Is it tested on animals?"],
    note: "Nothing here is invented.",
    chips: ["Why only three?", "Are these vegan?", "Are these FDA approved?"],
  },

  found: {
    label: "Found Her",
    title: "Found Her.",
    courses: [
      {
        label: "The profiles",
        items: [
          {
            name: "You didn’t become her",
            desc: "You found her. Stories from women who did.",
            ask: "What is Found Her?",
          },
          {
            name: "Who this is for",
            desc: "Not every woman has a company.",
            ask: "Who is Found Her for?",
          },
        ],
      },
      {
        label: "Your turn",
        items: [
          {
            name: "Tell me what you started",
            desc: "What it took, and the part you’ve never said out loud.",
            ask: "I’d like to share my story",
          },
          {
            name: "New stories, as they’re published",
            desc: "A few emails a month, not a few a week.",
            ask: "How do I join the Founding List?",
          },
        ],
      },
    ],
    faq: [
      "Do I have to buy anything to be featured?",
      "Will you use my name?",
      "Who writes the profiles?",
    ],
    note: "The room is yours.",
    chips: ["What is Found Her?", "How do I share my story?", "Who is it for?"],
  },

  service: {
    label: "Service",
    title: "The Front Desk.",
    courses: [
      {
        label: "Your order",
        items: [
          {
            name: "Where it is",
            desc: "Tracking, and when it lands.",
            ask: "Where is my order?",
          },
          {
            name: "Sending it back",
            desc: "The policy, exactly as written.",
            ask: "What’s the return policy?",
          },
        ],
      },
      {
        label: "Anything else",
        items: [
          {
            name: "All three together",
            desc: "What the Trio actually saves you.",
            ask: "What does the Trio save me?",
          },
          {
            name: "A person, not me",
            desc: "No offence taken.",
            ask: "I’d like to speak to someone",
          },
        ],
      },
    ],
    faq: ["Where do you ship?", "How long does delivery take?", "Can I change my order?"],
    note: "Ring again whenever.",
    chips: ["Where is my order?", "What’s the return policy?", "Do you ship internationally?"],
  },
};
