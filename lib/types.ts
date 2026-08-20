export type Goal =
  | "Build Lean Muscle"
  | "Lose Fat"
  | "Pre-Workout"
  | "Mass Gainers";

/**
 * What the product *is*, distinct from `Goal` (what training outcome it's
 * for) — one product can serve multiple goals, but only belongs to one
 * category. Drives the usage-guide grouping (§ data/guides.ts): one guide per
 * category rather than one per product, since "how do I take creatine"
 * doesn't change between brands.
 */
export type ProductCategory =
  | "Whey Protein"
  | "Casein Protein"
  | "Creatine"
  | "BCAA & Aminos"
  | "Mass Gainer"
  | "Pre-Workout"
  | "Fat Burner"
  | "Meal Replacement";

export interface Macros {
  servingSize: string; // e.g. "1 scoop (30g)"
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  calories: number;
}

/**
 * Editorial flag, not a computed stat — these are picked by the shop, not
 * derived from actual sales data (there's no backend tracking orders yet).
 * A fixed set rather than free text so the homepage/card styling can key off
 * it reliably (see lib/badges.tsx) instead of string-matching.
 */
export type Badge = "Best Seller" | "Staff Pick" | "New" | "High Stim";

export interface Product {
  id: string;
  name: string;
  brand: string;
  flavor: string;
  goals: Goal[];
  category: ProductCategory;
  priceZMW: number;
  compareAtZMW?: number;
  /**
   * Real product photos, front-of-pack first. Omit it (or leave empty) and
   * the card/gallery falls back to a generated on-brand placeholder, so the
   * catalog stays presentable while photos are still being gathered.
   *
   * Capped at 4 — that's what the PDP gallery's thumbnail strip is built
   * for, and it's plenty for a supplement tub (front, back/nutrition panel,
   * a lifestyle shot, maybe an angle). Anything past the 4th is ignored by
   * the gallery rather than erroring, so it's a soft cap, not a hard one.
   */
  images?: string[];
  badge?: Badge;
  macros: Macros;
  description: string;
  sizeOptions: string[];
}

export interface Bundle {
  id: string;
  name: string;
  goal: Goal;
  description: string;
  /** Product ids included — price is the plain sum of these, no bundle discount (that's a pricing call for the client to make later, not a UI default). */
  productIds: string[];
}

export interface CartLine {
  productId: string;
  size: string;
  quantity: number;
}

export type VideoPlatform = "instagram" | "tiktok" | "youtube";

export interface StoreVideo {
  id: string;
  title: string;
  /** e.g. "How to use", "Staff Pick", "Customer Routine" */
  category: string;
  platform: VideoPlatform;
  /** Link to the real reel/short once it exists */
  url: string;
  /** Optional: ties the clip back to a product, same pattern as Testimonial */
  productId?: string;
  /** Real thumbnail image. Omit and a generated placeholder is used instead. */
  thumbnail?: string;
}

export interface Testimonial {
  id: string;
  customerName: string;
  /** e.g. "Kabulonga, Lusaka" — keeps it local and specific, not generic */
  location: string;
  quote: string;
  rating: 1 | 2 | 3 | 4 | 5;
  /** Links back to the product they're talking about */
  productId: string;
  /**
   * Real customer photo. Omit it and the card falls back to a generated
   * initials avatar, same pattern as Product.image.
   */
  photo?: string;
}

/**
 * ---- Phase 2 groundwork — not persisted anywhere yet ----
 *
 * `Customer` and `Order` are the shapes the future backend (Postgres via a
 * Next.js API layer, see ARCHITECTURE.md §8) will be built against once it
 * exists. Nothing in this repo constructs, stores, or reads one today — the
 * checkout form still only builds a WhatsApp message (`lib/whatsapp.ts`).
 * They're defined now so the checkout form, API routes and admin dashboard
 * all get typed against the same shape from day one instead of it getting
 * invented ad hoc when the real database lands.
 */
export interface Customer {
  id: string;
  name: string;
  phone: string;
  /** Optional — captured at checkout for future marketing sends, never required to place an order. */
  email?: string;
  /** Delivery province, e.g. "Lusaka Province" — matches lib/contact.ts's SERVICE_AREAS. */
  area: string;
  /** ISO timestamp of this customer's first checkout. */
  firstSeenAt: string;
}

export type OrderStatus = "pending" | "confirmed" | "fulfilled" | "cancelled";

export interface Order {
  id: string;
  customerId: Customer["id"];
  lines: CartLine[];
  totalZMW: number;
  /** ISO timestamp. */
  placedAt: string;
  /** Staff-managed — orders arrive as "pending" until confirmed over WhatsApp/on delivery. */
  status: OrderStatus;
}
