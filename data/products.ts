import { Product } from "@/lib/types";

/**
 * Mock catalog for the prototype demo. Prices are illustrative ZMW figures —
 * swap for real Supplement World Zambia stock/pricing before go-live.
 *
 * No `images` field: cards fall back to a generated on-brand placeholder
 * (components/ProductPlaceholder.tsx). Add `images: ["/products/<file>.jpg", ...]`
 * (up to 4 — see the note on Product.images) to a product once its real
 * photos land, and the card/PDP gallery switches over on its own.
 *
 * Deliberately multi-brand — the shop's own strapline is "all your fitness and
 * health needs in one place", and their hero shot carries both USN and
 * Optimum Nutrition tubs.
 */
export const products: Product[] = [
  // ── Build Lean Muscle ────────────────────────────────────────────────────
  {
    id: "usn-whey-premium-choc",
    name: "USN Whey Premium",
    brand: "USN",
    flavor: "Chocolate Peanut Butter",
    goals: ["Build Lean Muscle"],
    category: "Whey Protein",
    priceZMW: 850,
    compareAtZMW: 950,
    badge: "Best Seller",
    macros: { servingSize: "1 scoop (30g)", protein: 22.6, carbs: 4.1, fat: 1.5, calories: 121 },
    description:
      "A fast-absorbing whey protein blend built for lean muscle recovery after training, with a rich chocolate peanut butter taste.",
    sizeOptions: ["908g", "2kg"],
  },
  {
    id: "usn-whey-premium-vanilla",
    name: "USN Whey Premium",
    brand: "USN",
    flavor: "Vanilla",
    goals: ["Build Lean Muscle"],
    category: "Whey Protein",
    priceZMW: 850,
    macros: { servingSize: "1 scoop (30g)", protein: 22.0, carbs: 3.8, fat: 1.4, calories: 118 },
    description:
      "The same fast-absorbing lean muscle formula in a smooth vanilla flavour, easy to stack with fruit or oats.",
    sizeOptions: ["908g", "2kg"],
  },
  {
    id: "on-gold-standard-whey-choc",
    name: "Optimum Nutrition Gold Standard 100% Whey",
    brand: "Optimum Nutrition",
    flavor: "Double Rich Chocolate",
    goals: ["Build Lean Muscle"],
    category: "Whey Protein",
    priceZMW: 1250,
    badge: "Best Seller",
    macros: { servingSize: "1 scoop (30g)", protein: 24.0, carbs: 3.0, fat: 1.0, calories: 120 },
    description:
      "The benchmark whey isolate blend — 24g of protein per scoop and a clean mixing profile that shakes up without clumping.",
    sizeOptions: ["908g", "2.27kg"],
  },
  {
    id: "on-gold-standard-whey-vanilla",
    name: "Optimum Nutrition Gold Standard 100% Whey",
    brand: "Optimum Nutrition",
    flavor: "Vanilla Ice Cream",
    goals: ["Build Lean Muscle"],
    category: "Whey Protein",
    priceZMW: 1250,
    macros: { servingSize: "1 scoop (30g)", protein: 24.0, carbs: 3.0, fat: 1.0, calories: 120 },
    description:
      "Gold Standard whey in a mild vanilla, the easiest flavour to blend into smoothies, oats or coffee.",
    sizeOptions: ["908g", "2.27kg"],
  },
  {
    id: "dymatize-iso100-choc",
    name: "Dymatize ISO 100 Hydrolyzed",
    brand: "Dymatize",
    flavor: "Gourmet Chocolate",
    goals: ["Build Lean Muscle", "Lose Fat"],
    category: "Whey Protein",
    priceZMW: 1580,
    macros: { servingSize: "1 scoop (32g)", protein: 25.0, carbs: 2.0, fat: 0.5, calories: 110 },
    description:
      "Hydrolysed whey isolate that digests fast and sits light — near-zero carbs and fat for anyone tracking macros tightly.",
    sizeOptions: ["900g", "2.2kg"],
  },
  {
    id: "muscletech-nitrotech-choc",
    name: "MuscleTech Nitro-Tech",
    brand: "MuscleTech",
    flavor: "Milk Chocolate",
    goals: ["Build Lean Muscle"],
    category: "Whey Protein",
    priceZMW: 1180,
    macros: { servingSize: "1 scoop (46g)", protein: 30.0, carbs: 4.0, fat: 2.5, calories: 160 },
    description:
      "Whey peptides and isolate with added creatine — a heavier 30g protein scoop aimed at strength as well as size.",
    sizeOptions: ["1.8kg"],
  },
  {
    id: "on-gold-standard-casein",
    name: "Optimum Nutrition Gold Standard Casein",
    brand: "Optimum Nutrition",
    flavor: "Chocolate Supreme",
    goals: ["Build Lean Muscle"],
    category: "Casein Protein",
    priceZMW: 1350,
    macros: { servingSize: "1 scoop (34g)", protein: 24.0, carbs: 3.0, fat: 1.0, calories: 120 },
    description:
      "Slow-release micellar casein for overnight recovery — thick, filling, and best taken before bed.",
    sizeOptions: ["909g"],
  },
  {
    id: "nutritech-whey-strawberry",
    name: "Nutritech Premium Whey",
    brand: "Nutritech",
    flavor: "Strawberry",
    goals: ["Build Lean Muscle"],
    category: "Whey Protein",
    priceZMW: 690,
    macros: { servingSize: "1 scoop (30g)", protein: 21.0, carbs: 4.5, fat: 2.0, calories: 125 },
    description:
      "A well-priced everyday whey for consistent daily protein without the imported-brand premium.",
    sizeOptions: ["908g", "2kg"],
  },
  {
    id: "usn-creatine-monohydrate",
    name: "USN Creatine Monohydrate",
    brand: "USN",
    flavor: "Unflavoured",
    goals: ["Build Lean Muscle", "Mass Gainers"],
    category: "Creatine",
    priceZMW: 320,
    macros: { servingSize: "1 scoop (5g)", protein: 0, carbs: 0, fat: 0, calories: 0 },
    description:
      "Pure micronized creatine monohydrate to support strength, power output, and muscle recovery between sessions.",
    sizeOptions: ["250g", "500g"],
  },
  {
    id: "applied-creatine-mono",
    name: "Applied Nutrition Creatine Monohydrate",
    brand: "Applied Nutrition",
    flavor: "Unflavoured",
    goals: ["Build Lean Muscle", "Mass Gainers"],
    category: "Creatine",
    priceZMW: 380,
    macros: { servingSize: "1 scoop (5g)", protein: 0, carbs: 0, fat: 0, calories: 0 },
    description:
      "Creapure-grade micronized creatine, dissolves cleanly into water or your shake with no grit.",
    sizeOptions: ["250g", "500g"],
  },
  {
    id: "usn-bcaa-amino-fuel",
    name: "USN BCAA Amino Fuel",
    brand: "USN",
    flavor: "Blue Raspberry",
    goals: ["Lose Fat", "Build Lean Muscle"],
    category: "BCAA & Aminos",
    priceZMW: 390,
    macros: { servingSize: "1 scoop (7g)", protein: 5.0, carbs: 1.0, fat: 0, calories: 24 },
    description:
      "A branched-chain amino acid drink to sip during training, helping curb muscle breakdown on a cut.",
    sizeOptions: ["400g"],
  },
  {
    id: "applied-amino-hydrate",
    name: "Applied Nutrition BCAA Amino-Hydrate",
    brand: "Applied Nutrition",
    flavor: "Fruit Burst",
    goals: ["Build Lean Muscle", "Lose Fat"],
    category: "BCAA & Aminos",
    priceZMW: 520,
    macros: { servingSize: "1 scoop (14g)", protein: 6.0, carbs: 1.5, fat: 0, calories: 30 },
    description:
      "BCAAs with added electrolytes and coconut water powder — built for training through Zambian heat.",
    sizeOptions: ["450g"],
  },

  // ── Lose Fat ─────────────────────────────────────────────────────────────
  {
    id: "usn-diet-fuel-vanilla",
    name: "USN Diet Fuel Ultralean",
    brand: "USN",
    flavor: "Vanilla",
    goals: ["Lose Fat"],
    category: "Meal Replacement",
    priceZMW: 920,
    macros: { servingSize: "2 scoops (60g)", protein: 17.0, carbs: 12.5, fat: 3.2, calories: 210 },
    description:
      "A meal-replacement shake formulated to support fat loss while preserving lean muscle, with added fibre for satiety.",
    sizeOptions: ["908g"],
  },
  {
    id: "usn-diet-fuel-choc",
    name: "USN Diet Fuel Ultralean",
    brand: "USN",
    flavor: "Chocolate",
    goals: ["Lose Fat"],
    category: "Meal Replacement",
    priceZMW: 920,
    macros: { servingSize: "2 scoops (60g)", protein: 17.0, carbs: 12.8, fat: 3.4, calories: 214 },
    description:
      "The same meal-replacement formula in chocolate — a filling stand-in for a rushed breakfast or lunch.",
    sizeOptions: ["908g"],
  },
  {
    id: "usn-thermo-fatburn",
    name: "USN Thermo Fatburn",
    brand: "USN",
    flavor: "Capsules",
    goals: ["Lose Fat"],
    category: "Fat Burner",
    priceZMW: 410,
    badge: "New",
    macros: { servingSize: "2 capsules", protein: 0, carbs: 0, fat: 0, calories: 0 },
    description:
      "A thermogenic capsule stack designed to support metabolism and energy while working toward a fat-loss goal.",
    sizeOptions: ["60 caps"],
  },
  {
    id: "usn-phedracut-lipo-x",
    name: "USN Phedracut Lipo X",
    brand: "USN",
    flavor: "Capsules",
    goals: ["Lose Fat"],
    category: "Fat Burner",
    priceZMW: 560,
    macros: { servingSize: "1 capsule", protein: 0, carbs: 0, fat: 0, calories: 0 },
    description:
      "A stimulant-based cutting capsule with green tea extract and L-carnitine, taken before morning training.",
    sizeOptions: ["80 caps"],
  },
  {
    id: "applied-l-carnitine",
    name: "Applied Nutrition L-Carnitine Liquid",
    brand: "Applied Nutrition",
    flavor: "Green Apple",
    goals: ["Lose Fat"],
    category: "Fat Burner",
    priceZMW: 470,
    macros: { servingSize: "1 shot (25ml)", protein: 0, carbs: 0.5, fat: 0, calories: 4 },
    description:
      "A stimulant-free liquid carnitine shot supporting fat metabolism — pairs with fasted cardio.",
    sizeOptions: ["480ml"],
  },
  {
    id: "muscletech-hydroxycut",
    name: "MuscleTech Hydroxycut Hardcore",
    brand: "MuscleTech",
    flavor: "Capsules",
    goals: ["Lose Fat"],
    category: "Fat Burner",
    priceZMW: 640,
    badge: "High Stim",
    macros: { servingSize: "1 capsule", protein: 0, carbs: 0, fat: 0, calories: 0 },
    description:
      "A high-stimulant thermogenic for experienced users — start on a half dose to assess tolerance.",
    sizeOptions: ["60 caps"],
  },
  {
    id: "nutritech-thermotech",
    name: "Nutritech Thermotech",
    brand: "Nutritech",
    flavor: "Capsules",
    goals: ["Lose Fat"],
    category: "Fat Burner",
    priceZMW: 350,
    macros: { servingSize: "2 capsules", protein: 0, carbs: 0, fat: 0, calories: 0 },
    description:
      "An entry-level thermogenic with a milder caffeine load, suited to a first cutting phase.",
    sizeOptions: ["60 caps"],
  },

  // ── Pre-Workout ──────────────────────────────────────────────────────────
  {
    id: "usn-19-anator-preworkout",
    name: "USN 19 Anator Pre-Workout",
    brand: "USN",
    flavor: "Fruit Punch",
    goals: ["Pre-Workout"],
    category: "Pre-Workout",
    priceZMW: 480,
    badge: "High Stim",
    macros: { servingSize: "1 scoop (11g)", protein: 0, carbs: 2.0, fat: 0, calories: 12 },
    description:
      "A high-stimulant pre-workout with beta-alanine and caffeine for explosive energy and focus going into a session.",
    sizeOptions: ["250g"],
  },
  {
    id: "applied-abe-blue-raz",
    name: "Applied Nutrition ABE All Black Everything",
    brand: "Applied Nutrition",
    flavor: "Icy Blue Raz",
    goals: ["Pre-Workout"],
    category: "Pre-Workout",
    priceZMW: 720,
    badge: "Best Seller",
    macros: { servingSize: "1 scoop (10g)", protein: 0, carbs: 1.0, fat: 0, calories: 8 },
    description:
      "Citrulline, beta-alanine and 200mg caffeine — the tingle-and-pump pre-workout that sells itself on repeat.",
    sizeOptions: ["315g"],
  },
  {
    id: "on-gold-standard-preworkout",
    name: "Optimum Nutrition Gold Standard Pre-Workout",
    brand: "Optimum Nutrition",
    flavor: "Blueberry Lemonade",
    goals: ["Pre-Workout"],
    category: "Pre-Workout",
    badge: "Staff Pick",
    priceZMW: 780,
    macros: { servingSize: "1 scoop (12g)", protein: 0, carbs: 2.0, fat: 0, calories: 10 },
    description:
      "A moderate 175mg caffeine dose with creatine and beta-alanine — clean energy without the crash.",
    sizeOptions: ["330g"],
  },
  {
    id: "bsn-no-xplode",
    name: "BSN N.O.-Xplode",
    brand: "BSN",
    flavor: "Green Apple",
    goals: ["Pre-Workout"],
    category: "Pre-Workout",
    priceZMW: 690,
    macros: { servingSize: "1 scoop (17g)", protein: 0, carbs: 4.0, fat: 0, calories: 20 },
    description:
      "The long-running pump-and-focus pre-workout, still a favourite for heavy compound sessions.",
    sizeOptions: ["555g"],
  },
  {
    id: "muscletech-vapor-x5",
    name: "MuscleTech Vapor X5",
    brand: "MuscleTech",
    flavor: "Fruit Punch",
    goals: ["Pre-Workout"],
    category: "Pre-Workout",
    priceZMW: 610,
    macros: { servingSize: "1 scoop (13g)", protein: 0, carbs: 2.0, fat: 0, calories: 10 },
    description:
      "A five-in-one pre-workout covering energy, pumps and focus in a single scoop.",
    sizeOptions: ["232g"],
  },

  // ── Mass Gainers ─────────────────────────────────────────────────────────
  {
    id: "usn-hyperbolic-mass",
    name: "USN Hyperbolic Mass",
    brand: "USN",
    flavor: "Chocolate",
    goals: ["Mass Gainers", "Build Lean Muscle"],
    category: "Mass Gainer",
    priceZMW: 1150,
    macros: { servingSize: "4 scoops (150g)", protein: 24.0, carbs: 82.0, fat: 6.5, calories: 570 },
    description:
      "A calorie-dense mass gainer for hardgainers who need extra carbs and protein on top of regular meals to grow.",
    sizeOptions: ["2kg", "4kg"],
  },
  {
    id: "on-serious-mass-choc",
    name: "Optimum Nutrition Serious Mass",
    brand: "Optimum Nutrition",
    flavor: "Chocolate",
    goals: ["Mass Gainers"],
    category: "Mass Gainer",
    priceZMW: 1720,
    badge: "Best Seller",
    macros: { servingSize: "2 scoops (334g)", protein: 50.0, carbs: 252.0, fat: 4.5, calories: 1250 },
    description:
      "1,250 calories a serving — the heaviest gainer on the shelf, for anyone who genuinely struggles to eat enough.",
    sizeOptions: ["2.72kg", "5.44kg"],
  },
  {
    id: "muscletech-mass-tech-elite",
    name: "MuscleTech Mass-Tech Elite",
    brand: "MuscleTech",
    flavor: "Vanilla",
    goals: ["Mass Gainers"],
    category: "Mass Gainer",
    priceZMW: 1480,
    macros: { servingSize: "4 scoops (139g)", protein: 40.0, carbs: 106.0, fat: 5.0, calories: 630 },
    description:
      "A gainer with a higher protein-to-carb ratio, aimed at adding size with less of the extra fluff.",
    sizeOptions: ["3.18kg"],
  },
  {
    id: "usn-muscle-fuel-anabolic",
    name: "USN Muscle Fuel Anabolic",
    brand: "USN",
    flavor: "Chocolate",
    goals: ["Mass Gainers", "Build Lean Muscle"],
    category: "Mass Gainer",
    priceZMW: 1080,
    macros: { servingSize: "3 scoops (110g)", protein: 26.0, carbs: 56.0, fat: 8.0, calories: 430 },
    description:
      "An all-in-one with creatine and glutamine built in — a mid-weight gainer for lean bulking.",
    sizeOptions: ["2kg", "4kg"],
  },
  {
    id: "nutritech-mass-builder",
    name: "Nutritech Mass Builder",
    brand: "Nutritech",
    flavor: "Banana",
    goals: ["Mass Gainers"],
    category: "Mass Gainer",
    priceZMW: 780,
    macros: { servingSize: "3 scoops (120g)", protein: 22.0, carbs: 70.0, fat: 5.0, calories: 420 },
    description:
      "An affordable everyday gainer for adding calories consistently without a big weekly spend.",
    sizeOptions: ["3kg"],
  },
];

export const goals = [
  "Build Lean Muscle",
  "Lose Fat",
  "Pre-Workout",
  "Mass Gainers",
] as const;
