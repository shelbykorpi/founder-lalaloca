# Brand email — shelby@founderbeauty.co

**Done 14 August 2026, verified live.** This supersedes the email half of
`FORMS_AND_EMAIL_SETUP.md`, which still describes the old subdomain sender.

---

## Correction to the first version of this document

An earlier draft of this file said Resend's DNS records were missing and that
the site's outbound mail was probably failing. **That was wrong**, and the
mistake is worth recording so nobody repeats it.

The domain registered in Resend was the *subdomain* `send.founderbeauty.co`, so
Resend's record names were relative to it: the DKIM record lived at
`resend._domainkey.send.founderbeauty.co` and the SPF/MX pair at
`send.send.founderbeauty.co`. The check had looked for
`resend._domainkey.founderbeauty.co`, got NXDOMAIN, and concluded the records
were gone. They were one label deeper the whole time.

**The lesson: when a provider shows record names, they are relative to the
domain you registered with that provider, not to the apex.** Read the apex off
the provider's own dashboard before declaring anything missing.

---

## What is live now

| Type | Name | Value | Purpose |
|---|---|---|---|
| MX | `@` | `mx1.improvmx.com` (10) | Inbound forwarding |
| MX | `@` | `mx2.improvmx.com` (20) | Inbound forwarding |
| TXT | `@` | `v=spf1 include:amazonses.com include:spf.improvmx.com ~all` | One SPF covering both services |
| MX | `send` | `feedback-smtp.us-east-1.amazonses.com` (10) | Resend bounce handling |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` | Resend envelope SPF |
| TXT | `resend._domainkey` | `p=MIGfMA0GCSqGSIb3…rQIDAQAB` | Resend DKIM |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=…@onsecureserver.net;` | GoDaddy default — see below |

All added in the **GoDaddy** DNS panel (nameservers are `ns27`/`ns28.domaincontrol.com`;
Vercel serves the site but does not host DNS). Confirmed resolving from Google
Public DNS and Cloudflare DNS within a minute of saving.

The `A` record (`216.198.79.1`) and the `www` CNAME to Vercel were not touched.

### Resend now holds the ROOT domain, not the subdomain

`send.founderbeauty.co` was deleted from Resend and `founderbeauty.co` added in
its place — the free plan allows exactly one domain, so this was a swap, not an
addition. Status: **Verified**.

Why the swap: Gmail can only "send mail as" an address on a domain Resend has
verified. With only the subdomain verified, `shelby@founderbeauty.co` could
receive but never reply. The trade-off is that sending reputation is no longer
isolated on a subdomain, which matters at newsletter volume and does not at
story-form volume.

The three DNS records did not change shape — they were renamed in place from
`send.send` → `send` and `resend._domainkey.send` → `resend._domainkey`, and the
DKIM value was replaced with the new key Resend generated.

### Vercel

`EMAIL_FROM` is now `FOUNDER <notifications@founderbeauty.co>` (was
`notifications@send.founderbeauty.co`, which stopped working the moment the
subdomain left Resend). Production was redeployed so it took effect.

`NEXT_PUBLIC_CONTACT_EMAIL` is deliberately **not** set — `src/lib/brand.ts`
defaults to `shelby@founderbeauty.co`. Set it only to override on a preview.

---

## Still outstanding

### 1. ImprovMX aliases

The MX records point at ImprovMX, but forwarding only works once the account
exists and the aliases are created. Until then mail to shelby@ is refused.

improvmx.com → add `founderbeauty.co` → forward to `shelbykorpi@gmail.com`.
Free tier allows 25 aliases; make the ones already promised in public first:

- `shelby@` — **the address the website shows.** It is in `src/lib/brand.ts` as
  the contact address on the shop, account, policy, product and FOUND HER pages,
  and in the site's structured data. If it does not forward, those pages lie.
- `notifications@` — so a reply to an automated email is not a black hole
- `hello@`, `care@`, `press@` — likely guesses

Do **not** enable the catch-all. It collects spam forever and cannot be undone
retroactively.

### 2. Replying as the brand, from Gmail

Gmail → Settings → **Accounts and Import** → *Send mail as* → **Add another
email address**:

- Name `FOUNDER`, address `shelby@founderbeauty.co`
- Untick **Treat as an alias**
- SMTP `smtp.resend.com`, port `587`, username `resend`, password = the Resend
  API key, **TLS**

Gmail sends a confirmation code to shelby@founderbeauty.co, so this only works
after the ImprovMX alias exists. Replies count against Resend's 100/day — not a
constraint at this volume, but worth knowing before it is.

### 3. DMARC

Leave the GoDaddy default until a week of real mail has gone out, then replace:

`v=DMARC1; p=none; rua=mailto:shelby@founderbeauty.co;`

`p=none` first so nothing gets quarantined while things settle, and so the
reports arrive somewhere readable. Back to `p=quarantine` once mail is landing.

DKIM is the record that must pass — SPF may show neutral because the envelope
sender is on the `send` subdomain, and relaxed alignment means DMARC still
passes on DKIM alone.

### 4. Shopify — read only, nothing changed

Settings → Notifications → **Sender email is `shelbykorpi@gmail.com`**, and
Shopify shows its own warning next to it:

> Public domains like Gmail don't support custom sending. Customers will see
> your email as `store+74386112681@shopifyemail.com`.

So **every order confirmation, shipping notice and receipt currently arrives
from `store+74386112681@shopifyemail.com`** — an unbranded address that reads as
a mis-sent machine email. Store contact details are also `shelbykorpi@gmail.com`.

This is now fixable, because founderbeauty.co has MX and SPF. Changing it means
setting the sender to an address on the domain and letting Shopify verify it,
which **adds Shopify's own DKIM CNAMEs and wants `include:shops.shopify.com` in
the root SPF** — a fourth service in the single SPF record. That edit has not
been made. Worth doing deliberately, in one pass, rather than tacking onto this.

---

## Verifying

1. Send yourself a test to shelby@founderbeauty.co from another account.
2. Reply using the new From address. In the receiving account, *Show original* →
   `DKIM: PASS` and `DMARC: PASS` are the two that matter.
3. Submit the story form on the live site. Thank-you screen plus two emails —
   one to you with the answers, one to the submitter — means the whole path works.
4. Gmail filter, as `FORMS_AND_EMAIL_SETUP.md` recommends:
   `subject:("FOUND HER submission")` → label *Found Her*, never spam, mark
   important. A deleted email is still a deleted story.

---

## Why shelby@ and not hello@

It is a person's name, and that is the point. This brand tells women a person
reads every submission and that a genuine problem is still our problem.
`hello@` reads as a queue; `shelby@` reads as the promise the rest of the site
is already making. It is also true right now — one person does read all of it.

The cost is that it does not survive delegation. The day someone else answers
care mail, the public address should become `care@` and `shelby@` should go
private. That is one line in `src/lib/brand.ts` plus a new alias — deliberately,
so the decision can be made later without a search-and-replace through the copy.

## What this does not do

- It is not a mailbox. No separate account, no separate password, nothing to
  check. If the Gmail account is lost, the brand's mail history goes with it.
- It does not give anyone else an address. A second person answering
  `care@founderbeauty.co` needs a real mailbox — Google Workspace at $7/user/mo
  is the usual next step, and it replaces the ImprovMX MX records rather than
  sitting beside them.
- It does not send the newsletter. That still goes out of Shopify Email against
  the customer list, which is a separate system on purpose.
