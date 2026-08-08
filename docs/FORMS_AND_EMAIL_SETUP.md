# Story intake and the Founding List — setup

**Live and verified in production, 8 August 2026.** Both forms have been run end
to end against the real Shopify store, the real Resend account and the real
Airtable base. This document is the record of how it is put together and what
to do if it breaks — not a plan.

Total setup was about 35 minutes, one new account, $0/month.

> **Corrected 8 August 2026.** The Shopify section of this document previously
> described the legacy "custom app → reveal a permanent `shpat_` token" flow.
> Shopify has retired that flow. Section 2 below is the current one, and the
> code was rewritten to match. If you are reading an older copy of these
> instructions anywhere, that is why they don't match your admin.

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

### 2. Shopify app credentials (10 min) — *this is the part that changed*

There is **no permanent Admin API token any more.** Shopify retired the old
"reveal it once and paste it somewhere" flow. Apps now hold a client id and a
client secret and exchange them for a token that lasts 24 hours, which the site
does automatically on demand and caches until shortly before it expires.

This is better, not worse: a leaked credential from a log or a screenshot is now
useless within a day.

1. **dev.shopify.com** → your organisation → **Apps → Create app**
2. Name it `FOUNDER site`
3. **Configuration → Admin API access scopes** → tick exactly two:
   - `write_customers`
   - `read_customers`

   Nothing else. This app never needs to see an order or touch a product, and a
   token that cannot move money is an annoyance if it leaks rather than an
   incident.
4. **Install** it on the `founderbeauty` store
5. **Overview → Client credentials** → copy the **Client ID** and the
   **Client secret**

   These are two different values and they are easy to transpose — the secret is
   the longer one and is hidden behind a reveal control. Getting them the wrong
   way round produces a `401` from the token exchange and a form that says the
   list isn't connected.

> The client credentials grant only works when the app and the store are in the
> same Shopify organisation, which is exactly the case for a store's own private
> app. It is not a route anyone else can use against your store.

### 3. Vercel environment variables (5 min)

Settings → Environment Variables. All environments.

| Variable | Value | Mark Sensitive |
|---|---|---|
| `RESEND_API_KEY` | `re_…` from step 1 | **yes** |
| `EMAIL_FROM` | `FOUNDER <notifications@send.founderbeauty.co>` | no |
| `OWNER_EMAIL` | `shelbykorpi@gmail.com` | no |
| `SHOPIFY_CLIENT_ID` | from step 2 | **yes** |
| `SHOPIFY_CLIENT_SECRET` | from step 2 | **yes** |
| `AIRTABLE_API_KEY` | `pat…` | **yes** |
| `AIRTABLE_BASE_ID` | `appHAc3Q0Hz3ArKaw` | no |
| `AIRTABLE_TABLE_ID` | the Submissions table id | no |
| `UNSUBSCRIBE_SECRET` | any long random string | **yes** |
| `MAILING_ADDRESS` | a real postal address — see below | no |

`SHOPIFY_SHOP_DOMAIN` is optional; the store host is already a constant in the
code and the variable exists only as an override for a staging store.

**Then redeploy.** These are server-side, so unlike the `NEXT_PUBLIC_*` ones they
aren't baked into the JavaScript at build time — but the running deployment
still won't see them until it restarts.

### 4. The welcome email — sent by the site, not by Shopify

**Shopify's "Welcome new subscribers" automation is not used, on purpose.**

Shopify documents that trigger as firing when someone *"subscribes by using a
form on your online store."* Subscribers here are written onto the customer
record through the Admin API from `founderbeauty.co` — which is not that store;
the Shopify storefront is only a checkout. Shopify does not document whether the
trigger fires for an API-driven consent change, and the first thing the brand
ever says to a new subscriber is not a good place to depend on undocumented
behaviour.

So the welcome is sent from the same Resend path that already carries the story
confirmation — live, tested, and visible in one place when it fails. It lives in
`src/lib/welcomeEmail.ts`; the copy is plain text and can be edited there.

**It only goes to someone whose consent actually changed.** Re-entering an
address that is already subscribed still shows the thank-you but sends nothing,
so nobody can be made to receive two welcomes by refreshing a page. An existing
*buyer* who joins the list does get one — she is new to the list even though her
customer record isn't.

**No discount in it.** Both Shopify templates attach one. A first-purchase
discount teaches your most engaged readers to wait for the next one and takes
margin from the buyers least likely to have needed it. The footer sold the list
as *be first through the doors* — access, not money off — and the email keeps
that promise rather than quietly replacing it.

**Later, when there are orders:** the post-purchase review request at 14 days is
the flow that closes the review gap. See `REVIEWS_AND_POST_PURCHASE.md`. It needs
orders to exist first.

### 5. The way out

Marketing email has to carry a working opt-out, and this one does.

- Every welcome carries a **signed unsubscribe link** at the bottom. The address
  is signed with `UNSUBSCRIBE_SECRET`, so a link only works if this server made
  it — otherwise `/unsubscribe?email=anyone@you-can-guess.com` would be an open
  endpoint for removing strangers.
- It also carries **`List-Unsubscribe` and `List-Unsubscribe-Post`** headers,
  which put Gmail's own Unsubscribe control next to the sender name. That control
  is why a bored reader presses *unsubscribe* instead of *report spam* — which is
  the difference between losing one subscriber and damaging the domain that also
  sends your order confirmations. Gmail and Yahoo both expect these on bulk mail.
- Clicking the link lands on `/unsubscribe`, which **asks once and then acts**.
  There is deliberately no URL that unsubscribes on a plain page load: mail
  scanners and corporate security filters fetch every link in an email before a
  human sees it, and a link that acted on being fetched would silently remove
  people who never clicked anything.
- Unsubscribing sets the Shopify record to `UNSUBSCRIBED`. **It does not delete
  it** — the orders, the spend and the instruction itself all survive. Deleting
  the row would lose the "don't email me" along with everything else, and she
  would silently rejoin the list the next time she bought something.

**`MAILING_ADDRESS` is the one thing here you have to supply.** CAN-SPAM requires
a valid physical postal address in commercial email, and this email is commercial
— it links to products. There is deliberately no default in the code: an invented
address would be worse than a missing one, because a missing one is visible. A PO
box or a registered-agent address is fine and is what most one-person brands use;
your home address is not required and shouldn't be used. Until it's set the email
still sends — dropping a subscriber's welcome would be the worse failure — but
every send logs a warning in Vercel.

---

## Verify it works

After any redeploy that touches these variables:

1. **Subscribe** with a spare address in the site footer.
   → Shopify → Customers → filter by tag `newsletter`. The address should be
     there, marked *Subscribed*, tagged `source:footer`.
   → A welcome email in that inbox, with a working unsubscribe link at the
     bottom and Gmail's own Unsubscribe control beside the sender name.
   → Subscribe with the *same* address again. Still a thank-you on screen, and
     **no second welcome**.
2. **Submit a story** to yourself on /share-your-story.
   → An email titled **"FOUND HER submission — <name>"** at shelbykorpi@gmail.com.
     Hit reply and check it addresses the submitter, not a no-reply.
   → A separate confirmation in the submitter's inbox.
   → A new row in the Airtable pipeline, linked from the notification.
3. **Press the unsubscribe link** in the welcome.
   → Shopify → that customer → email marketing shows *Not subscribed*, and the
     record still exists.
4. **If any form says it isn't connected**, that's the honest failure state doing
   its job — a variable is missing or the redeploy hasn't finished. Vercel → Logs
   will name it.

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
| Unsubscribe token, valid | Verifies to the right address; page names it before acting |
| Unsubscribe token, one character altered | Rejected. Compared in constant time, so a near-miss leaks nothing |
| Unsubscribe token with the signature stripped | Rejected |
| `GET /api/unsubscribe` | **405.** A link scanner cannot remove anyone |
| Gmail one-click (form POST, token in the query) | Reaches the handler and unsubscribes |
| Unsubscribe for an address that was never on the list | Success. Nothing to report, and no way to use the page to test whether an address is a customer |

`tsc` clean, `eslint` clean, production build clean.

**Verified against the live Shopify store on 8 August 2026** — a real customer
record was created, subscribed, tagged `newsletter` and `source:footer`, and
carried the timeline entry *"FOUNDER site created this customer."* The GraphQL
shapes are pinned to Admin API `2025-10`.

---

## Legal note, briefly

**I am not a lawyer and this is not legal advice.**

Consent is recorded as `SINGLE_OPT_IN` with a timestamp: they typed the address
into a form that said plainly what it was for. That's adequate under US rules
(CAN-SPAM) and it's the honest description of what happened.

CAN-SPAM asks for three things of a commercial email, and the welcome now carries
all three: an accurate sender and subject, **a working opt-out**, and **a valid
physical postal address**. The last of those is `MAILING_ADDRESS` and only you can
supply it — see section 5.

**Before you email anyone in the EU or UK**, switch to `CONFIRMED_OPT_IN` in
`src/lib/shopifyAdmin.ts`. GDPR and PECR want a confirmation click, and Shopify
will send that confirmation for you once the level is set. One-word change,
flagged in the file.
