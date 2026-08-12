import { ShieldCheck, CalendarCheck, Store, MessageCircle } from "lucide-react";

/**
 * The shop's answer to the #1 objection in this market: "is this actually
 * genuine, or did I just buy a re-filled tub off someone's car boot?" Every
 * line here exists to answer that directly rather than with a generic
 * "quality guaranteed" badge that doesn't actually say anything.
 *
 * Single source of truth — components/TrustBadges.tsx renders it in a
 * "full" (icon + title + subtitle) or "compact" (icon + label) layout
 * depending on where it's placed.
 */
export const TRUST_POINTS = [
  {
    icon: ShieldCheck,
    label: "100% Genuine Stock",
    detail: "Sourced from authorised distributors, not grey-market resellers.",
  },
  {
    icon: CalendarCheck,
    label: "Batch & Expiry Checked",
    detail: "Every tub is checked for a valid batch and expiry before it ships.",
  },
  {
    icon: Store,
    label: "Walk In & Verify",
    detail: "Check the seal yourself at any of our branches before you pay.",
  },
  {
    icon: MessageCircle,
    label: "Confirmed by a Real Person",
    detail: "A real staff member confirms every order over WhatsApp — no bots.",
  },
] as const;
