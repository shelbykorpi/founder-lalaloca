# Paste this into Claude

Everything below the line is self-contained. It carries the strategy, the exact
approved copy, the live Shopify data, and the guardrails — so the session
doesn't have to guess, fetch, or ask you to re-explain.

**Read the two flags at the bottom of this page before you paste.** They are
decisions only you can make, and the brief tells Claude to stop and ask rather
than guess at them.

---

## THE PROMPT

You are updating the four product listings in the FOUNDER Shopify store
(`founderbeauty.myshopify.com`) so they carry the brand's new product
positioning. The website at founderbeauty.co has already been updated; your job
is to bring Shopify in line with it.

### Hard rules — these override anything else in this brief

1. **Never change a product handle, SKU, variant ID, or price.** They are listed
   below. Every one of them is load-bearing: the website's checkout links point
   at those variant IDs, and changing a handle breaks every existing link and
   any search ranking the listing has earned.
2. **Never delete and recreate a product.** That issues new IDs and silently
   breaks checkout on founderbeauty.co.
3. **Do not touch inventory quantities, product images, or shipping settings.**
4. **Do not invent or add any ingredient, percentage, certification, clinical
   result, timeframe, review, or rating.** If a fact is not already in the
   listing copy quoted below, it does not go in.
5. **Do not remove existing safety or care language** — patch testing, the
   pregnancy/nursing note, storage, PAO ("use within 12 months"), the oxidation
   note on vitamin C. All of it stays exactly as written.
6. If something in this brief conflicts with what you find in the store, **stop
   and report it** rather than resolving it yourself.

### The strategy

FOUNDER sells three serums that do three different things, and the reason a
woman reaches for one over another is rarely only dermatological — it's what
kind of day she's having. Each serum now carries an identity:

| Product | Identity | Hero line | One-liner |
|---|---|---|---|
| Thirst Trap | **THE CLOSER** | Looks expensive. Never looks exhausted. | For when it needs to get done. |
| C Me Glow | **THE ENTRANCE** | For mornings when being overlooked isn't on the calendar. | For when it's time to be seen. |
| Bounce Back | **THE COMEBACK** | Because starting over is still starting. | For when you're becoming again. |

The trio is positioned as a wardrobe, not a discount:
**"No woman is only one version of herself."**

The brand line, always set stacked on two lines, never on one:

> OPEN THE DOOR.
> THE ROOM IS YOURS.

**Tone:** elevated, intelligent, feminine, witty, restrained. Never "boss babe",
"girlboss", hustle culture, or corporate. The customer is the main character.

**The line that governs this work:** the identity language is *editorial*. It
describes how a morning goes, not what the product does to skin. Never let it
touch a product claim. If a sentence would need substantiation under FTC rules,
it does not belong in the identity copy.

### The live listings, exactly as they are now

Confirmed against the store on 9 August 2026.

| Product | Handle | SKU | Variant ID | Price |
|---|---|---|---|---|
| Thirst Trap | `8-layer-hyaluronic-acid-serum-plumping-glow-drops-marine-collagen-dry-skin-hydration-50ml` | `ThirstTrap` | 47320268964009 | $38.00 |
| C Me Glow | `c-me-glow-vitamin-c-brightening-serum-with-niacinamide-50ml-full-size` | `CmegLow` | 47320268898473 | $38.00 |
| Bounce Back | `bounce-back-collagen-firming-serum-marine-face-neck-lifting-50ml` | `bounceback` | 47320268996777 | $38.00 |
| Serum Trio | `lalaloca-serum-trio-hyaluronic-acid-vitamin-c-collagen-face-serums` | `SerumSet` | 47320268931241 | $98.00 |

Current titles:

- `8-Layer Hyaluronic Acid Serum, Plumping Glow Drops, Marine Collagen, Dry Skin Hydration (50ml)`
- `C ME GLOW Vitamin C Brightening Serum with Niacinamide, 50ml Full Size`
- `BOUNCE BACK Collagen Firming Serum, Marine, Face Neck Lifting (50ml)`
- `LALALOCA Serum Trio, Hyaluronic Acid, Vitamin C, Collagen Face Serums`

### What to change

**1. Titles — one product only.**

Leave three of the four titles alone. They are long because they are doing
long-tail search work, and rewriting them to look tidy would trade real traffic
for neatness.

The exception is Thirst Trap. The other two lead with the product name and it
doesn't, which makes the range look inconsistent wherever the four appear
together. Change only the front of the string, keeping every keyword:

> **From:** `8-Layer Hyaluronic Acid Serum, Plumping Glow Drops, Marine Collagen, Dry Skin Hydration (50ml)`
> **To:** `THIRST TRAP 8-Layer Hyaluronic Acid Serum, Plumping Glow Drops, Marine Collagen, Dry Skin Hydration (50ml)`

The handle does **not** change with the title. Confirm this after saving — if
Shopify offers to update the URL, decline.

**2. Descriptions — add three lines at the top of each, change nothing else.**

Each description currently opens with a product name and a spec line. Insert
the identity above it. For Thirst Trap:

```
THE CLOSER

Looks expensive. Never looks exhausted.

THIRST TRAP - 8-Layer Hyaluronic Acid Serum | 50ml full size
[...the rest of the existing description, completely unchanged...]
```

Same pattern for the other two, using their identity and hero line from the
table above. **Everything below those three lines stays byte-for-byte as it is** —
WHAT IT DOES, WHO IT'S FOR, KEY INGREDIENTS, HOW TO USE, WHEN YOU'LL SEE
SOMETHING, SENSITIVE SKIN, CARE, THE FULL RITUAL, SHIPPING.

For the Serum Trio, insert:

```
THE CLOSER. THE ENTRANCE. THE COMEBACK.

No woman is only one version of herself.

LALALOCA SERUM TRIO - The Complete Routine | 3 x 50ml full size
[...rest unchanged...]
```

**3. THE FULL RITUAL cross-references — add the identity, keep the function.**

Each listing ends by naming the other two. Add the identity in front of the
existing description so the three read as a set:

> **From:** `C ME GLOW - vitamin C serum with niacinamide, for morning`
> **To:** `C ME GLOW, The Entrance - vitamin C serum with niacinamide, for morning`

Apply the same to every cross-reference in all four listings.

**4. Vendor field.**

All four products currently show vendor `vercel-store-5078d3d6`. Change it to
`LALALOCA` on all four. This is the brand name that appears in Shopify search
facets and in the Google & YouTube channel feed, and the current value is a
leftover from the store template.

**5. Tags — add three, remove none.**

Add `the_closer`, `the_entrance`, `the_comeback` to the matching product, and all
three to the trio. Existing tags stay: they are doing search work and several of
them (`niacinamide`, `edelweiss extract`, `marine collagen`) also record
ingredients.

### What not to change

Prices. Inventory. Images. Handles. SKUs. Variant IDs. Shipping. Every existing
tag. All safety, care and shelf-life language. The 50ml-versus-30ml comparison.
The gifting and shipping sections. The ABOUT LALALOCA section.

### Report back

When you're done, list for each product: what you changed, what you left, and
confirm the handle, SKU, variant ID and price are unchanged. Then flag anything
that looked wrong but that you did not touch.

---

## END OF PROMPT — the two flags, for you

I read all four live listings while assembling this, and there are two things I
deliberately did **not** write instructions for, because they're yours to decide
and one of them has real exposure.

### Flag 1 — your Shopify listings name ingredients your website says it doesn't have

This is the bigger of the two, and it's good news wrapped in a problem.

| | Shopify says | founderbeauty.co says |
|---|---|---|
| Thirst Trap | 8-weight hyaluronic acid, marine collagen, panthenol | same ✓ |
| C Me Glow | Vitamin C **and niacinamide** | "Vitamin C" only |
| Bounce Back | **Marine collagen and edelweiss extract** | "Collagen" only |

The website currently tells people *"we haven't listed anything the packaging
doesn't — email us and we'll send the supplier sheet."* That was written when I
had no ingredient information at all. **It is now out of date, and the source
that contradicts it is your own storefront.**

If niacinamide and edelweiss extract are on the approved labels, the website is
under-selling two products and leaving real search traffic on the table —
"niacinamide serum" and "edelweiss" are things people search for, and neither
word appears on founderbeauty.co. Confirm against a physical carton and I'll add
them to `keyActive` on the site properly, which also closes part of the INCI gap
in the MoCRA briefing.

If they are *not* on the labels, then the Shopify listings are making ingredient
claims the product can't support, and that's the direction of this gap that
needs fixing first.

Either way, one of the two channels is wrong right now. **Check a carton.**

### Flag 2 — the Shopify copy makes timing and results claims the website deliberately avoids

Your Shopify descriptions include:

- *"Skin looks plumper and feels softer, usually within the first few uses"*
- *"Helps skin look smoother and more lifted over time"*
- *"Give it 4-6 weeks of consistent daily use"*

The website says none of this, on purpose — it makes appearance-only statements
with no timeframe, because a claim about when a result appears is the kind that
needs substantiation behind it if anyone asks.

**I am not a lawyer and this is not legal advice.** I have not written
instructions to remove those lines, because they may be perfectly defensible and
they are almost certainly helping the listings convert. But you should know the
two channels currently make different promises about the same three bottles, and
that the FTC's substantiation expectation attaches to the stronger one. It's a
short question for the regulatory consultant already recommended in
`MOCRA_READINESS.md`.

### One thing I'd do while you're in there

Product type is blank on all four. Setting it to `Face Serum` costs nothing and
improves Shopify's own search, filtering and reporting. Not urgent, not risky.
