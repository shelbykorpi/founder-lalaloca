/**
 * The mailing list, kept inside Shopify.
 *
 * WHY HERE AND NOT IN A MAILING TOOL. If the newsletter lives in Mailchimp and
 * the customers live in Shopify, you have two lists that do not know about each
 * other: you cannot email everyone who bought Thirst Trap, you cannot exclude
 * buyers from a "come and buy something" campaign, and you cannot trigger the
 * post-purchase review request that the SEO work identified as the single
 * biggest gap in the brand's credibility.
 *
 * Keeping the list on the Shopify customer record fixes that permanently, and
 * it also makes the *sender* swappable. Shopify Email can send the campaigns
 * today for nothing; Klaviyo can be plugged in later and will sync the same
 * customers with their consent state and tags intact. Nothing has to be
 * migrated, because the list never lived in the sending tool.
 *
 * CONSENT IS RECORDED PROPERLY, not implied. Marketing state, opt-in level and
 * a timestamp all go on the record, because "we have their email" is not the
 * same as "they agreed to be emailed" and only one of those is defensible.
 *
 * Inert without credentials — a missing token is reported to the caller, never
 * thrown at the visitor.
 */

import { SHOPIFY_DOMAIN } from "./shopifyLinks";

/**
 * The store host is already a known constant used to build cart permalinks, so
 * it is reused rather than duplicated into a second environment variable. One
 * fewer thing to set, and no way for two copies of the same fact to disagree.
 * The env var stays as an override for a staging store.
 */
const SHOP = process.env.SHOPIFY_SHOP_DOMAIN ?? SHOPIFY_DOMAIN;

/**
 * ── HOW THIS AUTHENTICATES, AND WHY IT CHANGED ──────────────────────────────
 *
 * Shopify retired the old "custom app → reveal a permanent Admin API token"
 * flow. Apps are now created in the Dev Dashboard and authenticate with a
 * CLIENT CREDENTIALS GRANT: post the client id and secret, receive an access
 * token that expires in 24 hours.
 *
 * So there is no long-lived token to paste into an environment variable any
 * more. The credentials are exchanged for one on demand and the result is
 * cached in module scope until shortly before it expires.
 *
 * The static-token path is kept as an override. Stores still running a legacy
 * custom app have a permanent token and should keep using it — setting
 * SHOPIFY_ADMIN_ACCESS_TOKEN skips the exchange entirely.
 *
 * The grant only works when the app and the store are in the same Shopify
 * organization, which is exactly the case for a store's own private app.
 */
const STATIC_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET;

/** Cached across invocations that share a warm serverless instance. */
let cachedToken: { value: string; expiresAt: number } | null = null;

/**
 * Refresh a minute early. A token that expires mid-request fails the request,
 * and one wasted exchange is cheaper than one lost subscriber.
 */
const EXPIRY_MARGIN_MS = 60_000;

async function getAccessToken(): Promise<string | null> {
  if (STATIC_TOKEN) return STATIC_TOKEN;
  if (!CLIENT_ID || !CLIENT_SECRET) return null;

  if (cachedToken && Date.now() < cachedToken.expiresAt - EXPIRY_MARGIN_MS) {
    return cachedToken.value;
  }

  const response = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Shopify token exchange returned ${response.status}: ${await response.text()}`,
    );
  }

  const json = await response.json();
  if (!json?.access_token) throw new Error("Shopify token exchange returned no access_token");

  cachedToken = {
    value: json.access_token,
    /* expires_in is seconds; Shopify currently returns 86399 (24 hours). */
    expiresAt: Date.now() + Number(json.expires_in ?? 3600) * 1000,
  };
  return cachedToken.value;
}

/**
 * Pinned deliberately. Shopify ships quarterly versions and unversioned calls
 * drift; a pinned version fails loudly on a scheduled date instead of quietly
 * changing behaviour on a random Tuesday. Bump this once a year.
 */
const API_VERSION = "2025-10";

export type SubscribeResult =
  | {
      ok: true;
      /** A Shopify customer record did not exist before this call. */
      created: boolean;
      /**
       * Consent moved from "not subscribed" to "subscribed" on this call —
       * true for a brand-new record, and also for an existing *buyer* who has
       * now joined the list. This, not `created`, is the condition for sending
       * a welcome: a customer who bought last month and subscribes today is new
       * to the list even though her record is not new.
       *
       * False when she was already subscribed, so re-entering an address never
       * sends a second welcome.
       */
      newlySubscribed: boolean;
    }
  | { ok: false; reason: string };

/** True when this deployment can talk to the Admin API at all. */
export function hasAdminCredentials(): boolean {
  return Boolean(SHOP && (STATIC_TOKEN || (CLIENT_ID && CLIENT_SECRET)));
}

/**
 * The one door to Admin GraphQL, exported for read-side callers (catalog.ts).
 * Same token machinery, same pinned version, same loud errors.
 */
export async function adminGraphql(query: string, variables: Record<string, unknown>) {
  return shopifyGraphql(query, variables);
}

async function shopifyGraphql(query: string, variables: Record<string, unknown>) {
  const token = await getAccessToken();
  if (!token) throw new Error("No Shopify credentials configured");

  const response = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) throw new Error(`Shopify returned ${response.status}`);
  const json = await response.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

const FIND = `
  query FindCustomer($query: String!) {
    customers(first: 1, query: $query) {
      edges { node { id emailMarketingConsent { marketingState } } }
    }
  }`;

const CREATE = `
  mutation CreateCustomer($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer { id }
      userErrors { field message }
    }
  }`;

const UPDATE_CONSENT = `
  mutation UpdateConsent($input: CustomerEmailMarketingConsentUpdateInput!) {
    customerEmailMarketingConsentUpdate(input: $input) {
      customer { id }
      userErrors { field message }
    }
  }`;

const ADD_TAGS = `
  mutation AddTags($id: ID!, $tags: [String!]!) {
    tagsAdd(id: $id, tags: $tags) { userErrors { field message } }
  }`;

export async function subscribeToList(
  email: string,
  source: string,
): Promise<SubscribeResult> {
  if (!SHOP || (!STATIC_TOKEN && !(CLIENT_ID && CLIENT_SECRET))) {
    return {
      ok: false,
      reason: "Set SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET (or a legacy SHOPIFY_ADMIN_ACCESS_TOKEN)",
    };
  }

  const address = email.trim().toLowerCase();
  const consentedAt = new Date().toISOString();

  /* Tags are how you segment later: who came from the footer, who came from a
     story page, who came from the shop. Without them every subscriber is
     identical and no campaign can be targeted. */
  const tags = ["newsletter", `source:${source}`];

  try {
    /* Existing customer? Someone who has already bought is very likely to be in
       here already, and customerCreate rejects a duplicate email outright. */
    const found = await shopifyGraphql(FIND, { query: `email:${address}` });
    const existing = found?.customers?.edges?.[0]?.node;

    if (existing) {
      const already = existing.emailMarketingConsent?.marketingState === "SUBSCRIBED";
      if (!already) {
        const result = await shopifyGraphql(UPDATE_CONSENT, {
          input: {
            customerId: existing.id,
            emailMarketingConsent: {
              marketingState: "SUBSCRIBED",
              /**
               * SINGLE_OPT_IN: they typed the address into a form that said
               * plainly what it was for. Adequate under US rules (CAN-SPAM),
               * and the honest description of what happened.
               *
               * Switch to CONFIRMED_OPT_IN before emailing anyone in the EU or
               * UK — GDPR and PECR want a confirmation click, and Shopify will
               * send the confirmation email for you once this is set.
               */
              marketingOptInLevel: "SINGLE_OPT_IN",
              consentUpdatedAt: consentedAt,
            },
          },
        });
        const errors = result?.customerEmailMarketingConsentUpdate?.userErrors ?? [];
        if (errors.length) return { ok: false, reason: JSON.stringify(errors) };
      }

      await shopifyGraphql(ADD_TAGS, { id: existing.id, tags });
      return { ok: true, created: false, newlySubscribed: !already };
    }

    const created = await shopifyGraphql(CREATE, {
      input: {
        email: address,
        tags,
        emailMarketingConsent: {
          marketingState: "SUBSCRIBED",
          marketingOptInLevel: "SINGLE_OPT_IN",
          consentUpdatedAt: consentedAt,
        },
      },
    });

    const errors = created?.customerCreate?.userErrors ?? [];
    if (errors.length) return { ok: false, reason: JSON.stringify(errors) };

    return { ok: true, created: true, newlySubscribed: true };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : "unknown error" };
  }
}

/**
 * Take someone off the list.
 *
 * UNSUBSCRIBED, NOT DELETED. The record stays, so the customer's orders, spend
 * and history survive — and so does the fact that she asked not to be emailed.
 * Deleting the row would lose the instruction along with everything else, and
 * the next time she bought something she would silently rejoin the list.
 *
 * NOT FOUND IS A SUCCESS. An address that was never on the list is, from the
 * only point of view that matters, already unsubscribed. Reporting a failure
 * would mean showing an error to someone who correctly wants to be left alone,
 * and it would turn the page into an oracle for which addresses are customers.
 */
export async function unsubscribeFromList(
  email: string,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  if (!SHOP || (!STATIC_TOKEN && !(CLIENT_ID && CLIENT_SECRET))) {
    return { ok: false, reason: "No Shopify credentials configured" };
  }

  const address = email.trim().toLowerCase();

  try {
    const found = await shopifyGraphql(FIND, { query: `email:${address}` });
    const existing = found?.customers?.edges?.[0]?.node;
    if (!existing) return { ok: true };

    const result = await shopifyGraphql(UPDATE_CONSENT, {
      input: {
        customerId: existing.id,
        emailMarketingConsent: {
          marketingState: "UNSUBSCRIBED",
          consentUpdatedAt: new Date().toISOString(),
        },
      },
    });

    const errors = result?.customerEmailMarketingConsentUpdate?.userErrors ?? [];
    if (errors.length) return { ok: false, reason: JSON.stringify(errors) };

    return { ok: true };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : "unknown error" };
  }
}
