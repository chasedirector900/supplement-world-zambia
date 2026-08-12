import { Bundle } from "@/lib/types";

/**
 * One bundle per Goal, so it slots straight into the existing goal-filter
 * system (app/page.tsx) — picking a goal on the homepage surfaces the
 * matching stack right above the product grid.
 *
 * Price is the plain sum of the included products — no bundle discount.
 * Whether to discount stacked purchases is a pricing decision for the
 * client, not something to default to in the UI (see FEATURES.md #5).
 */
export const bundles: Bundle[] = [
  {
    id: "lean-muscle-stack",
    name: "Lean Muscle Stack",
    goal: "Build Lean Muscle",
    description:
      "Everything for a lean bulk in one order — protein for recovery, creatine for strength, BCAAs to protect muscle between sessions.",
    productIds: ["usn-whey-premium-choc", "usn-creatine-monohydrate", "usn-bcaa-amino-fuel"],
  },
  {
    id: "fat-loss-stack",
    name: "Fat Loss Stack",
    goal: "Lose Fat",
    description:
      "A low-carb whey to hit your protein target without the calories, a thermogenic for training days, and BCAAs to keep muscle while the scale moves.",
    productIds: ["dymatize-iso100-choc", "nutritech-thermotech", "applied-amino-hydrate"],
  },
  {
    id: "pre-workout-stack",
    name: "Pre-Workout Stack",
    goal: "Pre-Workout",
    description:
      "Energy and focus to start the session, aminos to sip through it — for anyone training hard enough to need both.",
    productIds: ["applied-abe-blue-raz", "usn-bcaa-amino-fuel"],
  },
  {
    id: "mass-gainer-stack",
    name: "Mass Gainer Stack",
    goal: "Mass Gainers",
    description:
      "Extra calories for hardgainers, plus creatine to make sure the added size comes with added strength.",
    productIds: ["usn-hyperbolic-mass", "usn-creatine-monohydrate"],
  },
];
