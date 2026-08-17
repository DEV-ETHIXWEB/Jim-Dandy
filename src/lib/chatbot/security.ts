const MAX_MESSAGE_LENGTH = 500;
const MIN_SEND_INTERVAL_MS = 700;

// Built from char codes (not a literal control-char range in source) so the
// intent is unambiguous: strips ASCII control chars 0-31 and 127, keeps
// normal whitespace which the next .replace collapses anyway.
const CONTROL_CHARS = new RegExp("[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F]", "g");

/**
 * Trims, strips control characters, and caps length. React already escapes
 * all rendered text (nothing here uses dangerouslySetInnerHTML), so this is
 * belt-and-suspenders normalization, not the real security boundary - that's
 * the server-side zod validation in the API routes.
 */
export function sanitizeInput(raw: string): string {
  return raw
    .replace(CONTROL_CHARS, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_MESSAGE_LENGTH);
}

/** Client-side rapid-send throttle. Caller owns a small timestamp ring buffer. */
export function isThrottled(lastSentAt: number[]): boolean {
  const now = Date.now();
  const last = lastSentAt[lastSentAt.length - 1];
  return last !== undefined && now - last < MIN_SEND_INTERVAL_MS;
}
