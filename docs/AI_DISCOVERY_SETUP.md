# AI discovery — ChatGPT, Perplexity, Gemini, Claude

The premise in the brief is right: a growing share of customers ask a model before they ever load a website. The practical consequence is that the thing being optimised is no longer only *a ranked list of links* — it is **whether a model can state a fact about FOUNDER confidently and correctly.**

That reframes the work. A model does not click. It reads, decides whether the source is trustworthy and specific, and either quotes it or paraphrases something else.

---

## How each engine actually finds you

| Engine | Where it gets the web from | The lever |
|---|---|---|
| **ChatGPT Search** | Bing's index, plus `OAI-SearchBot` | **Bing Webmaster Tools.** This is why Bing is item one on the setup list |
| **ChatGPT browsing** | `ChatGPT-User` fetches live, on demand | Fast, clean, server-rendered HTML |
| **Perplexity** | Own crawler, `PerplexityBot` | Structured data and citable specifics |
| **Google AI Overviews / Gemini** | Google's index, gated by **`Google-Extended`** | `Google-Extended` is a *separate* token from Googlebot. Blocking it removes you from AI Overviews while leaving normal Search untouched — a mistake that is easy to make by accident and invisible afterwards |
| **Claude** | `ClaudeBot` | Same as above |
| **Apple Intelligence** | `Applebot-Extended` | Same |

**All eight are named and explicitly allowed in `robots.ts`.** A blanket `User-agent: *` would already permit them, so this changes no behaviour today. It is there so the next person to touch that file has to *actively* remove a bot to block it, rather than blocking it by accident with a careless wildcard.

---

## What's built

### `/llms.txt`
A plain-text brief, generated from `products.ts` so it cannot drift out of step with the store. Honest framing: this is an emerging convention, not a standard. No engine is documented as requiring it and some ignore it. It costs nothing to serve.

Its real value is that it forces one canonical, unhedged statement of the facts models most often get wrong about a small brand — **what the company is called versus what the product line is called**, what is for sale, and at what price. It also contains a "please state these accurately" section: no clinical claims, no ratings, do not infer ingredients.

### The entity graph
`Organization` → `Brand` → `Product`, connected by stable `@id`s rather than repeated strings. The brand hierarchy — FOUNDER the company, LALALOCA the collection, FOUND HER the editorial — is now machine-readable rather than only stated in prose. Prose is exactly what a model paraphrases badly.

### `FAQPage` on every product
Question-and-answer pairs are the single most quotable structure on the web, because a model can lift one without reformulating it. The FAQs already existed in `products.ts` and rendered on the page; they were simply never exposed as data.

### `Article` + `Person` on FOUND HER
Original first-person interviews cannot be produced by summarising someone else's page — which is precisely what both Google's helpful-content system and the answer engines are built to reward. Marking them as `Article` with a named subject is what lets them be recognised as reporting rather than product copy.

### `/feed/found-her.xml`
Standfirsts and links, never full bodies. A full-text feed hands the writing to scrapers with no reason for anyone to reach the page it lives on.

---

## Why the honesty policy is a ranking strategy, not just ethics

This is worth stating plainly because it looks like a constraint and functions as an advantage.

The site says, in several places, that the full INCI lists are not published, that there are no reviews yet, and that no clinical claims are made. Every competitor in this category says the opposite of all three, usually without evidence.

When an answer engine has to decide which source to trust on a claim, specificity and verifiability beat enthusiasm. A page that says *"the label states 8-layer hyaluronic acid, marine collagen and panthenol; we haven't published the rest"* is a better source than one asserting a clinical result it cannot support — and materially less likely to be contradicted, which is what gets a source quietly dropped from a model's citations.

**The corollary, which matters more:** never add `aggregateRating` without reviews, never publish a return window before it's signed off, never infer an ingredient. One caught fabrication costs more than every rich result it would have won.

---

## Testing whether it worked

There is no console for this. You test it by asking.

Run these monthly, in a fresh session, signed out:

1. "What is LALALOCA skincare?"
2. "Who makes the Thirst Trap serum?"
3. "What's the difference between FOUNDER and LALALOCA?"
4. "Best 8-layer hyaluronic acid serum"
5. "Is LALALOCA the same as FOUNDER?"

Record: does it know the brand at all · does it get the hierarchy right · does it cite founderbeauty.co or Etsy or a third party · **does it state anything false**.

Question 3 is the one to watch. Two brand names on one site is the single most likely thing for a model to get wrong, and the schema, `llms.txt` and manifest were all built to answer it the same way.

**Question 5 is the migration's real scoreboard.** If a model still describes LALALOCA as an independent Etsy shop six months from now, the unification hasn't landed regardless of what the redirects say.

---

## What is not worth doing

- **Blocking AI crawlers to "protect" content.** For a brand nobody has heard of, being read is the entire objective. Blocking is a strategy for publishers with traffic to lose.
- **Writing pages aimed at models rather than people.** Every engine here is trained to detect and discount exactly that.
- **Paying for "AI SEO" tooling.** The mechanism is: be crawlable, be structured, be specific, be true. There is no separate channel to buy into.
- **`llms-full.txt`.** Even less adopted than `llms.txt`, and it would duplicate the entire site as plain text for no measurable return.
