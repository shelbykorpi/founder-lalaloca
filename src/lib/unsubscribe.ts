/**
 * Unsubscribe links that cannot be forged and do not need a database.
 *
 * ── WHY A SIGNED LINK RATHER THAN A LOOKUP ──────────────────────────────────
 *
 * The naive version is /unsubscribe?email=someone@example.com. That is an open
 * endpoint for removing anyone you can guess the address of, and addresses are
 * guessable. Signing the address with a server-side secret means a link only
 * works if this server produced it, and there is still nothing to store.
 *
 * ── WHY THE TOKEN CARRIES THE ADDRESS ───────────────────────────────────────
 *
 * So the link keeps working forever. A random token would have to be looked up
 * somewhere, which means a table, which means an unsubscribe that breaks when
 * the table is migrated. The one thing that must never break is the way out.
 *
 * ── ON THE SECRET ───────────────────────────────────────────────────────────
 *
 * UNSUBSCRIBE_SECRET if set. Otherwise SHOPIFY_CLIENT_SECRET, which is already
 * present in every environment that can touch the list at all — reusing it is
 * a compromise, but a link that cannot be generated is worse than one signed
 * with a key that has another job. If neither exists, signing returns null and
 * the caller falls back to plain wording instead of printing a broken URL.
 *
 * Rotating the secret invalidates every link already sitting in an inbox. If
 * you ever rotate SHOPIFY_CLIENT_SECRET, set UNSUBSCRIBE_SECRET first to a
 * separate value so the two are no longer tied together.
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import { SITE } from "./brand";

const SECRET = process.env.UNSUBSCRIBE_SECRET ?? process.env.SHOPIFY_CLIENT_SECRET;

/** URL-safe base64, so the token survives being pasted out of a mail client. */
function b64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromB64url(input: string): string {
  return Buffer.from(input.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
}

function signature(payload: string, secret: string): string {
  return b64url(createHmac("sha256", secret).update(payload).digest());
}

/** `<base64 address>.<signature>`, or null when no secret is configured. */
export function signUnsubscribeToken(email: string): string | null {
  if (!SECRET) return null;
  const payload = b64url(email.trim().toLowerCase());
  return `${payload}.${signature(payload, SECRET)}`;
}

/** The address the token was issued for, or null if it wasn't issued by us. */
export function verifyUnsubscribeToken(token: string): string | null {
  if (!SECRET) return null;

  const separator = token.lastIndexOf(".");
  if (separator <= 0) return null;

  const payload = token.slice(0, separator);
  const provided = token.slice(separator + 1);
  const expected = signature(payload, SECRET);

  /* Compared in constant time. A fast reject leaks, one byte at a time, how
     much of a guessed signature was right — which is enough to forge one given
     patience. Length is checked first because timingSafeEqual throws on a
     mismatch, and that throw would itself be the timing signal. */
  if (provided.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(provided), Buffer.from(expected))) return null;

  try {
    const email = fromB64url(payload);
    return email.includes("@") ? email : null;
  } catch {
    return null;
  }
}

/**
 * The link a human clicks. Lands on a page that explains and asks once.
 * Null when signing isn't configured.
 */
export function unsubscribeUrl(email: string): string | null {
  const token = signUnsubscribeToken(email);
  return token ? `${SITE.url}/unsubscribe?t=${encodeURIComponent(token)}` : null;
}

/**
 * The URL for the List-Unsubscribe header, which is a DIFFERENT URL — Gmail
 * sends a POST to it and expects the unsubscribe to have happened by the time
 * it returns. That has to be the API route: the page route only answers GET,
 * so pointing the header at it would return 405 and Gmail would show the reader
 * an error on a control it advertised itself.
 *
 * The token rides in the query string because one-click posts a fixed form
 * body (`List-Unsubscribe=One-Click`), not one of ours.
 */
export function unsubscribeOneClickUrl(email: string): string | null {
  const token = signUnsubscribeToken(email);
  return token ? `${SITE.url}/api/unsubscribe?t=${encodeURIComponent(token)}` : null;
}
