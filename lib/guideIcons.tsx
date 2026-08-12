import { Dumbbell, Moon, Zap, Droplets, TrendingUp, Rocket, Flame, Salad } from "lucide-react";
import { ProductCategory } from "@/lib/types";

/** One glyph per category, shared between the guides hub and detail page. */
export const GUIDE_ICON: Record<ProductCategory, typeof Dumbbell> = {
  "Whey Protein": Dumbbell,
  "Casein Protein": Moon,
  Creatine: Zap,
  "BCAA & Aminos": Droplets,
  "Mass Gainer": TrendingUp,
  "Pre-Workout": Rocket,
  "Fat Burner": Flame,
  "Meal Replacement": Salad,
};
