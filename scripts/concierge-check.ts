/**
 * The concierge's guardrail suite.
 *
 *   node --experimental-strip-types scripts/concierge-check.ts
 *
 * ── WHY THIS FILE EXISTS ────────────────────────────────────────────────────
 *
 * These checks were run by hand when the concierge was built, and the result
 * was a sentence in the documentation saying "25 cases, all passing". That
 * sentence is worth nothing the moment someone edits the prompt, because a
 * claim about tests that cannot be re-run is just a claim.
 *
 * Now it is a command. Run it after ANY change to prompt.ts, guardrails.ts or
 * the model, which is exactly when a quiet regression gets shipped.
 *
 * It imports only `guardrails.ts` and `prompt.ts`, both of which have no
 * runtime dependencies — `prompt.ts` imports a type and nothing else — so this
 * runs on plain Node with no build step, no test framework and no config.
 *
 * IT DOES NOT CALL THE MODEL. Everything here is deterministic. The parts that
 * need a live model are checked against the deployed site by hand, because a
 * test that spends money and returns different text every run is not a test.
 */

import { screenInbound, screenOutbound } from "../src/lib/concierge/guardrails.ts";
import { systemPrompt } from "../src/lib/concierge/prompt.ts";

let failures = 0;
let checks = 0;

function check(label: string, condition: boolean, detail = "") {
  checks += 1;
  if (condition) return;
  failures += 1;
  console.error(`  FAIL  ${label}${detail ? `\n        ${detail}` : ""}`);
}

function section(name: string) {
  console.log(`\n${name}`);
}

/* ── INBOUND ─────────────────────────────────────────────────────────────────
 * Each case: the message, the reason we expect, and whether it must escalate.
 * `null` means it should reach the model untouched. */
section("Inbound screen");

const INBOUND: [string, string | null, boolean][] = [
  // Adverse reaction — the expensive category. Errs toward catching.
  ["my cheeks are burning after using this", "Possible adverse reaction reported", true],
  ["I have a rash on my jaw", "Possible adverse reaction reported", true],
  ["it stings when I put it on", "Possible adverse reaction reported", true],
  ["my face is swollen this morning", "Possible adverse reaction reported", true],
  ["I broke out in hives", "Possible adverse reaction reported", true],
  ["skin went red and itchy", "Possible adverse reaction reported", true],

  // The metaphor guard. These are not symptoms and must pass through.
  ["I have a burning question about vitamin C", null, false],
  ["honestly I am burnt out and my skin shows it", null, false],

  // Diagnosis and named conditions — referred out, not escalated.
  ["do I have melasma or is this sun damage", "Diagnosis or named skin condition", false],
  ["will this help my cystic acne", "Diagnosis or named skin condition", false],
  ["what is this patch on my face", "Diagnosis or named skin condition", false],

  // Pregnancy — clinician, not the concierge.
  ["is this safe while pregnant", "Pregnancy or nursing", false],
  ["I am breastfeeding, can I use the vitamin C", "Pregnancy or nursing", false],

  // Lightening — the brand does not make these.
  ["do you have anything for whitening", "Skin-lightening request", false],

  // Human handover.
  ["can I speak to a human please", "Asked for a human", true],
  ["I would like to talk to someone about my order", "Asked for a human", true],

  // Ordinary questions. All five must reach the model.
  ["which serum should I start with", null, false],
  ["what order do I use them in", null, false],
  ["what does the trio cost", null, false],
  ["does C Me Glow replace sunscreen", null, false],
  ["can I use vitamin C and niacinamide together", null, false],
];

for (const [message, reason, mustEscalate] of INBOUND) {
  const verdict = screenInbound(message);
  if (reason === null) {
    check(`passes through: "${message}"`, verdict.pass, `caught as: ${verdict.pass ? "" : verdict.reason}`);
    continue;
  }
  check(`caught: "${message}"`, !verdict.pass && verdict.reason === reason,
    `expected "${reason}", got "${verdict.pass ? "passed through" : verdict.reason}"`);
  if (!verdict.pass) {
    check(`escalation flag: "${message}"`, verdict.escalate === mustEscalate);
  }
}

/* ── OUTBOUND ────────────────────────────────────────────────────────────────
 * Checked on the model's actual words. The selling voice makes this layer more
 * important than it was, not less: a bot told to lead with desire is a bot with
 * more opportunity to overreach. */
section("Outbound screen");

const BLOCKED: [string, string][] = [
  ["This is clinically proven to smooth fine lines.", "clinical claim"],
  ["It is dermatologist-approved for daily use.", "unsubstantiated endorsement"],
  ["It treats acne within a fortnight.", "treatment claim"],
  ["Every formula is FDA-approved.", "no cosmetic is FDA-approved"],
  ["The serum is hypoallergenic.", "unsubstantiated safety claim"],
  ["94% of users saw brighter skin.", "invented consumer statistic"],
  ["Guaranteed results in two weeks.", "results guarantee"],
  ["It erases wrinkles.", "results guarantee"],
  ["Rated 4.8 out of 5 by our community.", "rating — there are none"],
  ["Our best-selling serum.", "unverified popularity claim"],

  /* The softened-claim backstop. A hedge in front of a claim is still a claim,
     so these must fail even though every one of them sounds gentle. */
  ["It may reduce wrinkles over time.", "wrinkle claim — say how skin LOOKS instead"],
  ["This can help reduce fine lines.", "wrinkle claim — say how skin LOOKS instead"],
  ["It gets rid of those lines around the eyes.", "wrinkle claim — say how skin LOOKS instead"],
  ["Bounce Back may help tighten your jawline.", "lifting or tightening claim — a cosmetic does not do this"],
  ["It lifts the contour a little.", "lifting or tightening claim — a cosmetic does not do this"],
  ["Marine collagen helps rebuild your collagen.", "topical collagen does not rebuild collagen"],
];

for (const [reply, why] of BLOCKED) {
  const verdict = screenOutbound(reply);
  check(`blocks: "${reply}"`, !verdict.clean && verdict.why === why,
    `expected "${why}", got "${verdict.clean ? "allowed" : verdict.why}"`);
}

const ALLOWED = [
  "Thirst Trap is the one I would place in your room. It gives thirsty, tired-looking skin the hydration step that helps it appear fresher and more composed.",
  "C Me Glow is your entrance. Apply it before moisturizer and sunscreen, then walk in like the room was expecting you.",
  "The House Trio is $98.99 for three full-size 50 ml serums. Shall I send it up?",
  "Vitamin C is not a UV filter, so keep wearing sunscreen daily.",

  /* The permitted register. Every one of these is the softened, positive form
     the prompt now asks for, and every one must survive the backstop — a
     filter that also blocks the approved phrasing would leave the concierge
     with nothing to say. */
  "Hydrated skin can make fine lines look softer, and the surface often looks smoother by morning.",
  "It may help skin look more rested, and many find their makeup sits better on top.",
  "Bounce Back is the collagen firming serum — skin feels firmer and more cushioned.",
  "It can reduce the appearance of dullness by morning.",
  "This is designed to help skin look brighter and more even in tone.",
];

for (const reply of ALLOWED) {
  check(`allows: "${reply.slice(0, 48)}…"`, screenOutbound(reply).clean);
}

/* ── THE PROMPT ──────────────────────────────────────────────────────────────
 * Four things the brief did not include and that must survive every future
 * edit, plus the Found Her exception. These are the regressions that would be
 * invisible in a live conversation until the day they mattered. */
section("System prompt");

const FACTS = [{ id: "brand:claims", text: "Placeholder fact." }] as never;

for (const desk of ["beauty", "house", "service", "found"]) {
  const prompt = systemPrompt(desk, FACTS);
  check(`${desk}: grounds every fact in FACTS`, prompt.includes("must come from the FACTS below"));
  check(`${desk}: keeps the escalation token`, prompt.includes("[[ESCALATE]]"));
  check(`${desk}: escalates anti-ageing claims`, /wrinkles, fine lines, firming/.test(prompt));
  check(`${desk}: keeps the format rules`, prompt.includes("No headings, no bullet lists"));
  check(`${desk}: keeps the cosmetic framing`, prompt.includes("They do not treat, diagnose, cure or prevent anything"));
  check(`${desk}: states there are no reviews`, prompt.includes("no customer reviews yet"));
  check(`${desk}: injects the facts`, prompt.includes("Placeholder fact."));
}

const beauty = systemPrompt("beauty", FACTS);
const found = systemPrompt("found", FACTS);

check("beauty sells", beauty.includes("THE SALES PRINCIPLE") && beauty.includes("guided toward a purchase"));
check("beauty closes", beauty.includes("Shall I place it in your room?"));
check("found does NOT sell", !found.includes("THE SALES PRINCIPLE"));
check("found has no closing invitation", !found.includes("Shall I place it in your room?"));
check("found drops the purchase framing", !found.includes("guided toward a purchase"));
check("found says so explicitly", found.includes("THIS DESK DOES NOT SELL"));

/* ── RESULT ──────────────────────────────────────────────────────────────── */
console.log(
  failures === 0
    ? `\n${checks} checks, all passing.\n`
    : `\n${checks} checks, ${failures} FAILING.\n`,
);
process.exit(failures === 0 ? 0 : 1);
