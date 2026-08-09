# The three archetypes — copy audit and final copy

Applied to the live site 9 August 2026. Build clean, every change rendered and
checked at desktop, 1024 and mobile.

**The discipline first, because it constrains everything below.**

Every product fact on the site was diffed field by field against the version
before this edit — 21 field types, 63 individual values across the three
products and the trio. **All byte-identical.** Names, categories, sizes,
prices, colours, key actives, ingredient status, routine placement, timing,
cosmetic benefit lines, all twelve usage steps, all twelve FAQ answers and the
$98.99 trio block are exactly as they were.

The new language lives in three new fields — `archetype`, `archetypeFor`,
`hero` — which are marked in the code as editorial and forbidden from carrying
any claim. The rule written into `products.ts`:

> If a sentence would need substantiation under FTC claims rules, it does not
> belong in these three fields.

That is what keeps *"Looks expensive. Never looks exhausted."* on the right
side of the line: it describes how a morning goes, not what the serum does to
skin. The functional description sits directly underneath it on every page,
never replaced.

---

## THE AUDIT

### 1. Product data

**PAGE:** `src/lib/products.ts` (feeds every page below)
**SECTION:** Product type

**CURRENT COPY:** No identity field existed. The three serums were
differentiated only by what they do — hydration, brightness, firmness.

**RECOMMENDED COPY:** Three new fields per product.

| | Thirst Trap | C Me Glow | Bounce Back |
|---|---|---|---|
| `archetype` | The Closer | The Entrance | The Comeback |
| `archetypeFor` | For when it needs to get done. | For when it's time to be seen. | For when you're becoming again. |
| `hero` | Looks expensive. Never looks exhausted. | For mornings when being overlooked isn't on the calendar. | Because starting over is still starting. |

**WHY THIS CHANGE HELPS:** One source of truth. The archetype now appears in
six places on the site and can never drift between them, and a future edit to
the identity is one line, not a search across the codebase.

---

### 2. Product pages

**PAGE:** `/products/thirst-trap`, `/products/c-me-glow`, `/products/bounce-back`
**SECTION:** Above the fold, between the product name and the description

**CURRENT COPY:**

> **Thirst Trap**
> 8-LAYER HYALURONIC ACID SERUM
>
> A lightweight hydrating serum built on eight molecular weights of hyaluronic acid.

**RECOMMENDED COPY:**

> **Thirst Trap**
> THE CLOSER · 8-LAYER HYALURONIC ACID SERUM
>
> **Looks expensive. Never looks exhausted.**
>
> A lightweight hydrating serum built on eight molecular weights of hyaluronic acid.

**WHY THIS CHANGE HELPS:** Two additions, nothing removed. The archetype sits
*beside* the category rather than replacing it — the category is the approved
label wording and it is also what a shopper scanning for "vitamin C serum" is
looking for, so it keeps its place. The hero line runs above the functional
description rather than instead of it, which means the page answers *"who am I
when I use this?"* and *"what does it actually do?"* in a single glance. That
order matters: lifestyle copy that displaces the product description reads as
evasion, and this brand cannot afford to read that way.

---

**PAGE:** the three product pages
**SECTION:** "The other two" cross-sell at the foot of the page

**CURRENT COPY:**

> **Thirst Trap**
> Skin feels softer and more comfortable, and makeup sits better on top.

**RECOMMENDED COPY:**

> THE CLOSER
> **Thirst Trap**
> Skin feels softer and more comfortable, and makeup sits better on top.

**WHY THIS CHANGE HELPS:** This is the one module on the page where she is
actively choosing between two products, and "The Comeback" separates them
faster than two cosmetic benefit lines can. One short line, and the benefit
line stays.

---

### 3. Shop / collection page

**PAGE:** `/shop`
**SECTION:** New band between the intro and the product grid

**CURRENT COPY:** Nothing — the page went straight from the intro to three
doors.

**RECOMMENDED COPY:**

> ### Three serums. Three energies. One woman building what's next.
>
> | THE CLOSER | THE ENTRANCE | THE COMEBACK |
> |---|---|---|
> | **Thirst Trap** | **C Me Glow** | **Bounce Back** |
> | For when it needs to get done. | For when it's time to be seen. | For when you're becoming again. |

**WHY THIS CHANGE HELPS:** It hands a shopper a way of choosing that is faster
than comparing three ingredient lists, and it does it in about twenty words.
The mapping from identity to product name is explicit on purpose — an identity
band that leaves you guessing which bottle is which is decoration. Placed
above the grid because it frames what follows; kept small so it never becomes
the page.

---

**PAGE:** `/shop`
**SECTION:** Product cards

**CURRENT COPY:**

> 01 · MORNING OR NIGHT
> **Thirst Trap**
> 8-LAYER HYALURONIC ACID SERUM
> Skin feels softer and more comfortable, and makeup sits better on top.
> 50 ml / 1.69 fl oz · $39.99

**RECOMMENDED COPY:**

> THE CLOSER
> **Thirst Trap**
> 8-LAYER HYALURONIC ACID SERUM
> Skin feels softer and more comfortable, and makeup sits better on top.
> 50 ml / 1.69 fl oz · $39.99 · Morning or night

**WHY THIS CHANGE HELPS:** The archetype replaces the 01/02/03 counter, which
was decoration — the numbering told a shopper nothing. **Timing is not lost:**
it moves down to the size-and-price line where the rest of the hard facts
already live. The card is the same length it was.

---

**PAGE:** `/shop`
**SECTION:** The House Trio

**CURRENT COPY:**

> THE HOUSE TRIO
> **Treat Yourself to All Three**
> Three full-size serums. Hydrate, firm, brighten. One order. No choosing.
> $98.99 for all three · valued at $119.97

**RECOMMENDED COPY:**

> THE HOUSE TRIO
> **No Woman Is Only One Version of Herself**
> The Closer, The Entrance, The Comeback. Three full-size serums — hydrate,
> brighten, firm — for three different kinds of days.
> $98.99 for all three · valued at $119.97

**WHY THIS CHANGE HELPS:** "Treat Yourself to All Three" was the weakest line
on the site — it could sit on any beauty bundle anywhere, and "treat yourself"
frames the purchase as indulgence rather than equipment. The replacement makes
the same commercial argument (three products, one order, clear saving) while
saying something only this brand can say. It still names what's included and
still shows the price and the comparison, so nothing conversion-critical is
traded away.

**One deliberate small change:** the three verbs are now in the order
*hydrate, brighten, firm*, matching the order of the three identities above
them. Previously *hydrate, firm, brighten*, which matched nothing.

*Note: this copy sits on the photographed tariff board, which has fixed
geometry. I set it at 1440 and at 1024 to confirm the longer headline and
description still fit inside the frame with margin. They do.*

---

**PAGE:** `/shop`
**SECTION:** New closing band, after the trio and before shipping

**CURRENT COPY:** Nothing — the page ended on a shipping and returns grid.

**RECOMMENDED COPY:**

> ### Some days you close. Some days you glow. Some days you start again.
>
> OPEN THE DOOR.
> THE ROOM IS YOURS.

**WHY THIS CHANGE HELPS:** The collection storytelling now lands somewhere
instead of trailing off into logistics. The campaign line is pulled from
`BRAND.campaignLines` rather than typed, so it can never drift out of sync with
the homepage, and it is set stacked on two lines because the Master Brand Board
prohibits a single-line setting.

**A judgment call you should check:** this page already opens with *"Open the
door. You're already in the room."* as its H1, so "open the door" now appears
twice on one page — once as a sentence at the top and once as the campaign line
at the bottom. I read that as an intentional bookend and it's how the page is
built now, but if it reads as repetition to you, say so and I'll either change
the H1 or drop the campaign line and end on the three-energies line alone.

---

### 4. Which serum? (the quiz result)

**PAGE:** `/find-your-serum`
**SECTION:** The result

**CURRENT COPY:**

> START HERE
> **C Me Glow**
> VITAMIN C BRIGHTENING SERUM

**RECOMMENDED COPY:**

> START HERE
> **C Me Glow**
> THE ENTRANCE · VITAMIN C BRIGHTENING SERUM

**WHY THIS CHANGE HELPS:** Someone finishing the quiz has just told you what
kind of person she is in three answers. Handing back an identity rather than
only a product name is the payoff, and it costs one line. Same pairing as the
product page, so the two pages agree.

---

## SECTIONS I RECOMMEND LEAVING ALONE

Worth stating explicitly, because the discipline is the point:

**The homepage "Come in." section.** *"Three serums on the other side of this
door. Nobody is checking names."* This is already the most distinctive
collection copy on the site and it is native to the door metaphor the whole
brand runs on. Adding archetypes here would dilute it and repeat what the shop
page now does properly. **No change.**

**The homepage hero.** Already carries the campaign line stacked, per the brand
board. **No change.**

**The "Side by side" comparison table.** Deliberately the one purely factual
module on the shop page — what it's for, when, key active, size, price. Adding
an identity column would blur what that table is for. **No change.**

**Every product page's "Who it's for", "How to use it", "What's in it" and
FAQs.** The `moment` lines in particular — *"The 6am one, when you've been up
twice in the night and you'd like your face not to announce it"* — are already
doing exactly what the archetypes are meant to do, and doing it more
specifically than any supplied phrase would. Replacing them would have been a
downgrade dressed as a strategy rollout. **No change.**

**All compliance and disclaimer language.** The INCI-not-published answers, the
"cosmetic products, not medicine" note, "no clinical claims", the seller-of-record
line, and "no reviews we wrote ourselves." **No change, and none of it moved.**

**Shipping, returns, pricing, checkout copy.** **No change.**

---

## FINAL COPY, PAGE BY PAGE

Everything below is what is now live in the code. Reproduced here so you can
read it in one place or paste it elsewhere — social, packaging, a deck, Etsy.

### Thirst Trap — product page

> **Thirst Trap**
> THE CLOSER · 8-LAYER HYALURONIC ACID SERUM
>
> **Looks expensive. Never looks exhausted.**
>
> A lightweight hydrating serum built on eight molecular weights of hyaluronic acid.
>
> Size 50 ml / 1.69 fl oz · Price $39.99 · When Morning or night · In your routine After cleansing, before moisturiser.

*Everything below the fold — Who it's for, How to use it, What's in it, Questions — unchanged.*

### C Me Glow — product page

> **C Me Glow**
> THE ENTRANCE · VITAMIN C BRIGHTENING SERUM
>
> **For mornings when being overlooked isn't on the calendar.**
>
> A vitamin C serum for skin that looks flat or uneven in tone.
>
> Size 50 ml / 1.69 fl oz · Price $39.99 · When Morning · In your routine After cleansing, before moisturiser and sunscreen.

*Everything below the fold unchanged.*

### Bounce Back — product page

> **Bounce Back**
> THE COMEBACK · COLLAGEN FIRMING SERUM
>
> **Because starting over is still starting.**
>
> A collagen serum for skin that feels slack rather than dry.
>
> Size 50 ml / 1.69 fl oz · Price $39.99 · When Night · In your routine After cleansing, before moisturiser.

*Everything below the fold unchanged.*

### Shop / collection page

> THE LALALOCA COLLECTION
> # Open the door. You're already in the room.
> Three serums behind three doors, and nothing standing in front of them. Start
> with the one that matches what your skin actually does — not the one with the
> best story.
>
> *Answer three questions instead ↗*
>
> ---
>
> ## Three serums. Three energies. One woman building what's next.
>
> **THE CLOSER** — Thirst Trap — For when it needs to get done.
> **THE ENTRANCE** — C Me Glow — For when it's time to be seen.
> **THE COMEBACK** — Bounce Back — For when you're becoming again.
>
> ---
>
> *[the three product doors, then the Side by side table — both unchanged]*
>
> ---
>
> THE HOUSE TRIO
> ## No Woman Is Only One Version of Herself
> The Closer, The Entrance, The Comeback. Three full-size serums — hydrate,
> brighten, firm — for three different kinds of days.
> $98.99 for all three · valued at $119.97
> **[ ADD ALL THREE · $98.99 ]**
>
> ---
>
> ## Some days you close. Some days you glow. Some days you start again.
>
> OPEN THE DOOR.
> THE ROOM IS YOURS.
>
> ---
>
> *[Shipping · Returns · What these are — all unchanged]*

### Product cards (shop grid)

> THE CLOSER
> **Thirst Trap**
> 8-LAYER HYALURONIC ACID SERUM
> Skin feels softer and more comfortable, and makeup sits better on top.
> 50 ml / 1.69 fl oz · $39.99 · Morning or night

> THE ENTRANCE
> **C Me Glow**
> VITAMIN C BRIGHTENING SERUM
> Tone looks brighter and more even, with a warm finish rather than a shiny one.
> 50 ml / 1.69 fl oz · $39.99 · Morning

> THE COMEBACK
> **Bounce Back**
> COLLAGEN FIRMING SERUM
> Skin feels firmer and more cushioned, and looks smoother the next morning.
> 50 ml / 1.69 fl oz · $39.99 · Night

---

## THE PHRASES I DIDN'T USE, AND WHY

You supplied several supporting lines per archetype and asked for restraint, so
these are held in reserve rather than spent:

- *Hydrate. Handle it. Close.*
- *Before the meeting. Before the flight. Before the dinner you almost canceled.*
- *Glow first. Introductions later.*
- *You're not disappearing into the room. You're walking into it.*
- *Reset. Rebuild. Bounce back.*
- *Some chapters begin with a launch. Others begin with a decision no one else sees.*

They are strong, and putting them on the product pages alongside the hero line
and the existing `moment` copy would have crowded three pages that are working
because they are spare. **Where they belong is off-site** — campaign posts,
email subject lines, packaging inserts, the Etsy listings. That's a channel
where repetition is an asset rather than clutter, and where the site currently
says nothing at all.

Say the word and I'll map them to a launch sequence.
