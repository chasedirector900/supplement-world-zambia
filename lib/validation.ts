/**
 * Client-side checkout validation. This is a UX layer, not a security
 * boundary — Django (Phase 2) is the source of truth and re-validates
 * everything server-side. Catching an obviously wrong email or phone number
 * here just saves a round trip: staff finding out a "confirmed" order has an
 * unreachable number only after trying to call it wastes everyone's time.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

/**
 * Zambian mobile numbers: 10 digits starting with 0 (e.g. 0979003311), or
 * the same number with a +260/260 country code instead of the leading 0.
 * Deliberately permissive about the exact network prefix (07x/08x/09x cover
 * Airtel, MTN and Zamtel) rather than hard-coding today's prefix list.
 */
const PHONE_RE = /^(\+?260|0)[789]\d{8}$/;

export function isValidPhone(value: string): boolean {
  return PHONE_RE.test(value.replace(/[\s\-()]/g, ""));
}
