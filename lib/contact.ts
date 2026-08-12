/**
 * Single source of truth for Supplement World Zambia's real contact details.
 * Sourced from their Facebook business page. Everything user-facing (nav,
 * footer, announcement bar, WhatsApp links) reads from here — change it once.
 */

export const CONTACT = {
  /** Formatted for humans */
  phoneDisplay: "+260 97 900 3311",
  /** For tel: links */
  phoneE164: "+260979003311",
  /** Digits only — wa.me rejects symbols */
  whatsappNumber: "260979003311",
  email: "supplementworldzed@gmail.com",
  messengerName: "Supplement World - Zambia",
} as const;

/**
 * Provinces the shop delivers to. Their Facebook page listed 7; North-Western
 * was added because their Instagram bio lists a **Solwezi branch**, and a
 * physical store there without delivery cover would be odd. Northern and
 * Muchinga are still absent, so don't describe delivery as "nationwide".
 *
 * This list is also the intended source for the cart's location dropdown
 * (ARCHITECTURE.md §5a), which is currently a free-text field.
 */
export const SERVICE_AREAS = [
  "Lusaka Province",
  "Copperbelt Province",
  "Central Province",
  "Southern Province",
  "Eastern Province",
  "North-Western Province",
  "Western Province",
  "Luapula Province",
] as const;

export type ServiceArea = (typeof SERVICE_AREAS)[number];

/**
 * Real numbers from their verified Facebook page — the only stats we show.
 * `followersLabel`/`viewsLabel` are pre-formatted because that's how the shop
 * states them publicly ("120K followers • 20M reel views").
 */
export const SOCIAL_PROOF = {
  recommendPercent: 94,
  reviewCount: 29,
  followersLabel: "120K",
  viewsLabel: "20M",
} as const;

/**
 * Physical branches, taken from their Instagram bio. Names are kept close to
 * how the shop writes them; only unambiguous abbreviations were expanded
 * ("L/stone" → Livingstone).
 *
 * These are a real trust signal for a supplement shop — counterfeit stock is
 * the buyer's main worry, and "you can walk into one of our stores" answers it
 * better than any badge. They also back the in-store pickup line in §3a.
 */
export interface Store {
  /** Branch name as the shop refers to it */
  name: string;
  city: string;
  province: ServiceArea;
  /** Full street address, where we have one */
  address?: string;
}

export const STORES: Store[] = [
  {
    name: "Oasis Mall",
    city: "Lusaka",
    province: "Lusaka Province",
    address: "32 Oasis Mall, Lusaka 10101",
  },
  { name: "Active Fitness", city: "Lusaka", province: "Lusaka Province" },
  { name: "East Park", city: "Lusaka", province: "Lusaka Province" },
  { name: "Ibex 88", city: "Lusaka", province: "Lusaka Province" },
  { name: "Kabwata (KCC)", city: "Lusaka", province: "Lusaka Province" },
  { name: "Kitwe", city: "Kitwe", province: "Copperbelt Province" },
  { name: "Ndola", city: "Ndola", province: "Copperbelt Province" },
  { name: "Livingstone", city: "Livingstone", province: "Southern Province" },
  { name: "Solwezi", city: "Solwezi", province: "North-Western Province" },
  { name: "Chipata", city: "Chipata", province: "Eastern Province" },
];

/** Branches grouped by city, Lusaka first. */
export function storesByCity(): { city: string; stores: Store[] }[] {
  const order = ["Lusaka", "Kitwe", "Ndola", "Livingstone", "Solwezi", "Chipata"];
  const map = new Map<string, Store[]>();
  for (const s of STORES) {
    map.set(s.city, [...(map.get(s.city) ?? []), s]);
  }
  return [...map.entries()]
    .map(([city, stores]) => ({ city, stores }))
    .sort((a, b) => order.indexOf(a.city) - order.indexOf(b.city));
}

/** Maps *search* link — safe even where we don't hold an exact address. */
export function mapsSearchUrl(store: Store): string {
  const q = store.address
    ? `Supplement World Zambia, ${store.address}`
    : `Supplement World Zambia ${store.name}, ${store.city}, Zambia`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

/** The shop's own motto, as it appears on their page. */
export const TAGLINE = {
  line1: "FITNESS NEEDS",
  line2: "IN ONE PLACE.",
  bio: "All Your Fitness and Health Needs In One Place",
} as const;

/**
 * Official social profiles.
 *
 * `url: null` means "we don't have the real link yet" — those entries are
 * skipped at render time rather than shipped as dead links. Fill in the real
 * URLs here and the icons appear automatically in the footer; nothing else
 * needs to change.
 */
export interface SocialLink {
  /** Matches an exported icon name in components/icons/BrandIcons.tsx */
  key: "facebook" | "instagram" | "tiktok" | "youtube" | "messenger";
  label: string;
  url: string | null;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    key: "facebook",
    label: "Facebook",
    url: "https://www.facebook.com/supplementworldzambia",
  },
  {
    key: "instagram",
    label: "Instagram",
    url: "https://www.instagram.com/supplementworldzambia/",
  },
  { key: "tiktok", label: "TikTok", url: null },
  { key: "messenger", label: "Messenger", url: null },
];

/** Only the profiles we actually have links for. */
export const activeSocialLinks = () =>
  SOCIAL_LINKS.filter(
    (s): s is SocialLink & { url: string } => typeof s.url === "string"
  );
