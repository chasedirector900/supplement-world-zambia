import { Flame, Star, Sparkles, Zap } from "lucide-react";
import { Badge } from "@/lib/types";

/**
 * One look per badge so they read as distinct signals at a glance instead of
 * a wall of identical green pills — a shopper should be able to tell "this
 * one's popular" (Best Seller) from "this one's new" (New) without reading
 * the text. Shared between the product card and the homepage rail.
 */
export const BADGE_STYLE: Record<Badge, { icon: typeof Flame; className: string }> = {
  "Best Seller": { icon: Flame, className: "bg-brand text-charcoal" },
  "Staff Pick": { icon: Star, className: "bg-amber-400 text-charcoal" },
  New: { icon: Sparkles, className: "bg-sky-400 text-charcoal" },
  "High Stim": { icon: Zap, className: "bg-orange-500 text-charcoal" },
};
