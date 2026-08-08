# Story intake and the Founding List — setup

**Built and tested. Dormant until five environment variables exist.**
Total setup: about 35 minutes, one new account, $0/month.

---

## What was built

### The Founding List → your Shopify customer list

Someone enters their email in the footer, on the homepage, or on Found Her. The site writes it **straight onto a Shopify customer record** with marketing consent, a timestamp, and a tag saying where they joined.

**Why Shopify and not Mailchimp.** If the newsletter lives in a mailing tool and the customers live in Shopify, you have two lists that don't know about each other. You can't email everyone who bought Thirst Trap. You can't exclude buyers from a "come and buy something" campaign. And you can't trigger the post-purchase review request — which the SEO audit identified as the single biggest hole in the brand's credibility, because you have no reviews and every competitor does.

One list fixes all three. It also makes the *sender* swappable: Shopify Email sends the campaigns for free today, and if you move to Klaviyo in a year it syncs the same customers with consent and tags intact. Nothing has to be migrated, because the list never lived in the sending tool.

Every subscriber gets tagged `newsletter` plus `source:footer`, `source:found-her`, `source:home` or `source:shop`. That is what lets you segment later. Without it, every subscriber is identical and no campaign can be targeted.

### Story submissions → your inbox

A woman fills in the Share Your Story form. You get one email at **shelbykorpi@gmail.com** with every answer, both permission flags, and her contact details — **sent with her address as the reply-to.**

That last part is the whole workflow. You hit reply in Gmail and you're writing to her. Approving a story is a reply. There's no dashboard to log into and no second system to remember.

She simultaneously gets a short confirmation so she knows a person has it and roughly what happens next.

**Nothing is published. Nothing is added to the mailing list.** The form's two permissions are "you may reply to me" and "you may consider this for publication." Neither of those is "email me marketing," and treating them as if they were is exactly the kind of thing this brand tells people it doesn't do. The form now says so out loud.

---

## The one honest caveat

You chose email over a submissions table, and at this volume that's defensible — Gmail is searchable, threaded, archivable, and already open. **The caveat is that a deleted email is a deleted story.** There's no second copy.

Two minutes of mitigation, in Gmail → Settings → Filters → Create a new filter:

- **Matches:** `subject:("FOUND HER submission")`
- **Do this:** Apply label `Found Her`, Never send to Spam, Mark as important

Now every submission collects in one place whatever else your inbox is doing, and none of it depends on remembering.

**When to upgrade:** the day the question stops being *"did I read it"* and starts being *"which ones am I mid-conversation with."* At that point you want a status column. The endpoint is written so that's one added function call, not a rewrite.

---

## Setup

### 1. Resend — the one new account (10 min)

A server can't just "send an email." Mail from an unauthenticated source goes to spam or gets refused outright; something has to sign it with SPF and DKIM on a domain allowed to send. That's the entire job of a service like this, and it's the one account this system genuinely can't avoid.

Free to 3,000 emails a month — far more than a story inbox will use.

1. resend.com → sign up
2. **Domains → Add Domain → `send.founderbeauty.co`**

   > **A subdomain, deliberately.** Adding a root-domain sender means touching records that sit next to your Google Workspace MX entries. A subdomain can't collide with them. Your email keeps working, guaranteed.

3. Resend shows three DNS records. Add them in GoDaddy under `founderbeauty.co` exactly as given — **do not touch the MX records.**
4. Wait for Resend to show **Verified** (usually minutes)
5. **API Keys → Create** → copy it (starts `re_`)

### 2. Shopify custom app (10 min)

1. Shopify admin → **Settings → Apps and sales channels → Develop apps**
2. **Create an app** → name it `FOUNDER site`
3. **Configure Admin API scopes** → tick exactly two:
   - `write_customers`
   - `read_customers`

   Nothing else. This app never needs to see an order or touch a product.
4. **Install app** → **Reveal token once** → copy it (starts `shpat_`)

   You get one look at it. Paste it into Vercel before closing the tab.

### 3. Vercel environment variables (5 min)

Settings → Environment Variables. All five, all environments.

| Variable | Value | Mark Sensitive |
|---|---|---|
| `RESEND_API_KEY` | `re_…` from step 1 | **yes** |
| `EMAIL_FROM` | `FOUNDER <notifications@send.founderbeauty.co>` | no |
| `OWNER_EMAIL` | `shelbykorpi@gmail.com` | no |
| `SHOPIFY_SHOP_DOMAIN` | `founderbeauty.myshopify.com` | no |
| `SHOPIFY_ADMIN_ACCESS_TOKEN` | `shpat_…` from step 2 | **yes** |

**Then redeploy.** These are server-side so they aren't baked into the JavaScript like the `NEXT_PUBLIC_*` ones, but the running deployment still won't see them until it restarts.

### 4. Turn Shopify Email on (5 min)

1. Shopify admin → **Apps → Shopify Email** (install if it isn't there — free)
2. **Marketing → Automations → Welcome new subscriber** → activate

   That one toggle is the automation. Everyone who joins the list gets a welcome without you doing anything, forever.
3. Write the welcome once. Suggested spine, following the brand rules: what the collection is, which serum to start with, and a link to Found Her. Not a discount code — a discount as the first thing you say trains people to wait for the next one.

**Later, when there are orders:** Marketing → Automations → **post-purchase follow-up**, timed 14 days out, asking for a review. That is the flow that closes the review gap. It needs orders to exist first.

---

## Verify it works

After the redeploy:

1. **Subscribe** with your own address in the site footer.
   → Shopify → Customers → filter by tag `newsletter`. You should see yourself, marked *Subscribed*, tagged `source:footer`.
2. **Submit a story** to yourself on /share-your-story.
   → An email titled **"FOUND HER submission — <name>"** at shelbykorpi@gmail.com. Hit reply and check it addresses the submitter, not a no-reply.
   → A separate confirmation in the submitter's inbox.
3. **If either form says it isn't connected**, that's the honest failure state doing its job — a variable is missing or the redeploy hasn't finished. Vercel → Logs will name it.

---

## What's protecting these endpoints

A public form gets found by scanners within days — not because anyone targeted the brand, but because bots walk every new domain looking for anything that accepts a POST. Left open, the story inbox fills with casino spam and the mailing list fills with addresses that bounce, which is how a sending domain earns a bad reputation and starts landing real email in junk.

Three layers, none of which asks a visitor to do anything:

- **Honeypot** — a field no human sees and no human fills. Most bots fill everything.
- **Timing** — a submission completed in under three seconds wasn't typed by someone answering *"what are you building?"*
- **Rate limit** — five per IP per hour.

A caught bot gets the same `200` and the same wording a person does. Telling a scanner *"rejected: honeypot"* just teaches it which field to skip next time.

**Deliberately not a CAPTCHA.** This form asks women to write about the hardest thing they've done. Making them identify traffic lights first is the wrong trade. If spam genuinely becomes a problem, Cloudflare Turnstile is invisible to most visitors and is the next step — not reCAPTCHA.

`/api/` is disallowed in robots.txt. These answer POST and nothing else; a crawler spending requests on them learns nothing.

---

## How this was tested

Both endpoints were run against mock Resend and mock Shopify servers and the outgoing requests inspected:

| Case | Result |
|---|---|
| Valid story submission | Two emails sent — owner notification with correct reply-to, plus her confirmation |
| Missing the required consent | `400`, plain-English error, no email |
| Honeypot filled | `200`, **no email sent** |
| Malformed email | `400` |
| New subscriber | `customerCreate` with `SUBSCRIBED`, `SINGLE_OPT_IN`, timestamp, both tags |
| Existing customer, not yet subscribed | `customerEmailMarketingConsentUpdate` then `tagsAdd` — no duplicate created |
| Mixed-case address with trailing space | Normalised to lowercase and trimmed |
| Forged `source` value | Coerced to `page`, not trusted |
| No credentials configured | `503` and the form says it isn't connected — never a false thank-you |

`tsc` clean, `eslint` clean, production build clean.

**Not tested against live Shopify** — that needs your token. The GraphQL shapes are pinned to Admin API `2025-10` and were verified against a mock built from that schema. Step 1 of *Verify it works* is what confirms it against the real thing.

---

## Legal note, briefly

Consent is recorded as `SINGLE_OPT_IN` with a timestamp: they typed the address into a form that said plainly what it was for. That's adequate under US rules (CAN-SPAM) and it's the honest description of what happened.

**Before you email anyone in the EU or UK**, switch to `CONFIRMED_OPT_IN` in `src/lib/shopifyAdmin.ts`. GDPR and PECR want a confirmation click, and Shopify will send that confirmation for you once the level is set. One-word change, flagged in the file.
