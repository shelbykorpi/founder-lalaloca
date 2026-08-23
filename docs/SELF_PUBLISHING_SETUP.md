# Self-publishing products — Shelby's setup (about 10 minutes, once)

The code side is done. After these steps, launching a product is: Shopify →
Products → Add → fill the FOUNDER fields → publish. Card and detail page
appear on the site within a minute. No developer.

The site reads the catalog with the **same credentials the Founding List
already uses** (SHOPIFY_CLIENT_ID / SHOPIFY_CLIENT_SECRET, already in
Vercel). Only one thing may be missing from them: permission to read
products.

## Step 1 — let the app read products (2 min)

Shopify admin → **Settings → Apps and sales channels → Develop apps** → open
the app the site uses → **Configuration → Admin API integration → Edit** →
under Products, tick **read_products** → Save. If it asks to reinstall the
app, approve it.

That's the whole credential step. No new token, nothing to paste anywhere.

## Step 2 — the collection (1 min)

Products → Collections → **Create collection**. Title: `FOUNDER Collection`.
Check that its **handle** (Edit website SEO, bottom of the page) is exactly
`founder-collection`. Type: manual. Add **Hold the Room** to it.

Only products in this collection appear on the /founder-collection shelf.

## Step 3 — the FOUNDER fields (4 min)

Settings → **Custom data → Products → Add definition**, eight times. For
every one, the namespace and key must be exactly as written — the site reads
`founder.<key>`:

| Name | Namespace and key | Type | Keep it to |
|---|---|---|---|
| Character | `founder.character` | Single line text | 3 words ("The Anchor") |
| Descriptor | `founder.descriptor` | Single line text | 5 words max |
| Hook | `founder.hook` | Multi-line text | 25 words max |
| Who it's for | `founder.who` | Multi-line text | 40 words max |
| How to use | `founder.how` | Multi-line text | 40 words max |
| What's in it | `founder.actives` | Multi-line text | 40 words max |
| Door colour | `founder.door` | Color | — |
| Badge | `founder.badge` | Single line text | 2 words ("Preorder") |

Shopify can't count words, so where it offers a character limit use roughly
6× the word count (descriptor 35, hook 160, panels 260). The limits are the
punchiness — a hook that needs 40 words is a hook that needs editing.

Two writing rules that are not optional: the sentence "Cosmetic benefits
only, and skin varies. No clinical results are claimed." goes at the end of
**Who it's for** on every product, and nothing in any field states a
clinical result, a percentage, or an ingredient that isn't on the label.

## Step 4 — fill them for Hold the Room (2 min)

Products → Hold the Room → scroll to Metafields. Suggested, edit freely:

- Character: `The Anchor`
- Descriptor: `Moisturizing cream`
- Hook: `Anyone can make an entrance. Staying is the harder skill. A rich
  cream with chamomile and witch hazel.`
- Badge: `Preorder`
- Door colour: `#F2DCD3` (the blush of the studio shots)

Who/How/What's in it can be copied from the current page's three panels.

## Step 5 — optional but worth it: instant updates (1 min)

Settings → **Notifications → Webhooks → Create webhook**, twice:
event `Product creation`, then `Product update`, format JSON, URL:

    https://www.founderbeauty.co/api/revalidate?secret=<SHOPIFY_CLIENT_SECRET>

(Use the client secret's value, or set a dedicated REVALIDATE_SECRET in
Vercel and use that.) Without this the site still refreshes itself every 60
seconds; with it, saves land near-instantly.

## What happens with nothing set up

Nothing breaks. Until Step 1 is done the site can't read the catalog, so
/founder-collection shows the hand-built Hold the Room card and the two
waitlist cards, exactly as designed. Every step above only adds.

## Launching product #2, forever after

Products → Add product → title, price, one variant, photos (first photo =
card, second = hover) → fill the eight FOUNDER fields → add to the FOUNDER
Collection collection → set status Active and publish to the Online Store
channel. Done. `/products/<its-handle>` and its card exist within a minute.
