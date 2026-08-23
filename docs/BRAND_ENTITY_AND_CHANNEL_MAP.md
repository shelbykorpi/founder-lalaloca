# Brand entity and channel map

Three names, one company. Getting a search engine to understand that is the whole job.

---

## The hierarchy

```
FOUNDER                        the master brand · the company · the name on the receipt
  └── The LALALOCA Collection  the skincare line · three serums
        ├── Thirst Trap        8-Layer Hyaluronic Acid Serum · 50 ml · $38.00
        ├── C Me Glow          Vitamin C Brightening Serum   · 50 ml · $38.00
        ├── Bounce Back        Collagen Firming Serum        · 50 ml · $38.00
        └── All three                                        · $98.00
  └── FOUND HER                the stories platform · editorial
```

**FOUNDER is the seller of record** — the name on the order, the receipt and the packaging. It must stay identical to the Shopify store name, or the site and the receipt disagree in front of the customer.

---

## Where it is now stated as data

| Signal | Says |
|---|---|
| `Organization` | `name: FOUNDER`, `alternateName: [FOUNDER, LALALOCA]`, `brand: → #brand-lalaloca` |
| `Brand` (**new**) | `name: LALALOCA`, `alternateName: The LALALOCA Collection`, `@id: /#brand-lalaloca` |
| `Product` ×3 | `brand: { @id: /#brand-lalaloca }` — a reference, not a repeated string |
| `manifest.webmanifest` | `name: FOUNDER — The LALALOCA Collection` |
| `/llms.txt` | "FOUNDER is the master brand. The LALALOCA Collection is its skincare line." |
| Header banner | "FOUNDER presents the LALALOCA Collection." |

Before this pass the relationship existed only in prose. Prose is what an answer engine paraphrases badly — and a wrong paraphrase of your brand structure, repeated across three engines, is very hard to correct later.

---

## Channels

| Channel | Status | Names FOUNDER? | Notes |
|---|---|---|---|
| `founderbeauty.co` | Live, canonical | Yes | Everything points here |
| `lalaloca.com` | 308 → `www.founderbeauty.co` | n/a | Paths preserved. Google Workspace MX preserved |
| Shopify (`founderbeauty.myshopify.com`) | Live, checkout | Yes | Store renamed to FOUNDER |
| **Etsy (LALALOCA)** | Live, **not touched** | **No** | Holds the reviews, the sales history and the marketplace age. See the Etsy plan |
| Social | Unknown to me | — | **`NEXT_PUBLIC_SAME_AS` is empty.** Nothing was guessed |
| Google Business Profile | Not set up | — | Only worth it if there is a real service address |

---

## The one gap that costs the most

**`sameAs` is empty.**

`sameAs` is how a search engine confirms that the Instagram account, the Etsy shop and this website are one entity rather than three brands with similar names. Right now Google has no formal reason to connect LALALOCA-on-Etsy — which has real sales, real reviews and real age — to FOUNDER-on-founderbeauty.co, which has none of those things yet.

That connection is the mechanism by which the Etsy shop's accumulated trust transfers to the new domain. It is one environment variable:

```
NEXT_PUBLIC_SAME_AS=https://www.etsy.com/shop/…,https://www.instagram.com/…,https://www.tiktok.com/@…
```

Comma-separated, then redeploy. Include every profile the brand actually controls. Do not include accounts you don't own or can't post to — a `sameAs` pointing at something you don't control is a claim you can't back.

Second gap, smaller: `NEXT_PUBLIC_CONTACT_EMAIL` is unset, so the Organization carries no `ContactPoint`. A public support address is a routine trust signal and its absence is mildly conspicuous.

---

## Naming rules, for anyone writing copy

**Do:**
- "FOUNDER presents the LALALOCA Collection"
- "Thirst Trap, from the LALALOCA Collection"
- "FOUND HER, from FOUNDER"

**Don't:**
- "FOUNDER LALALOCA" — reads as one compound brand
- "LALALOCA Beauty" — invents a fourth name
- "Founder Beauty Co." — the domain is not the brand name
- Lower-case or title-case either brand name

---

## Two real-world jobs the code cannot do

Both are recorded in `brand.ts` and neither is solvable from a repo:

1. **FOUNDER needs trademark clearance.** It is now the trading name on customer receipts, which is a higher bar than a visible brand name.
2. **The registered entity behind the Shopify account is still called `vercel-store-5078d3d6 - entity`.** That name appears on tax and payout paperwork regardless of anything on the site. Shopify → Settings → General → Business details.
