import { ProductCategory } from "@/lib/types";

export interface GuideSection {
  heading: string;
  body: string;
}

export interface Guide {
  slug: string;
  category: ProductCategory;
  title: string;
  summary: string;
  sections: GuideSection[];
}

/**
 * One guide per product category rather than per product — "how do I take
 * creatine" doesn't change between brands, and this keeps ~8 guides covering
 * the whole ~30-product catalog instead of 30 near-duplicates to maintain.
 *
 * Content here is general, well-established supplement usage guidance (the
 * kind printed on any tub's label), not medical advice — each guide closes
 * with a line pointing people to the product label and, where relevant, a
 * doctor. Written for the shop's actual catalog in data/products.ts.
 */
export const guides: Guide[] = [
  {
    slug: "whey-protein",
    category: "Whey Protein",
    title: "How to Use Whey Protein",
    summary:
      "The everyday muscle-recovery protein — fast-digesting, mixes easily, works any time of day.",
    sections: [
      {
        heading: "What it's for",
        body: "Whey protein tops up your daily protein intake, which is what your body actually uses to repair and build muscle after training. It's food, not a stimulant — there's no 'kick' to feel, the benefit shows up over weeks of consistent use alongside training.",
      },
      {
        heading: "How to mix it",
        body: "One scoop (check the exact size on your tub — it varies by brand, usually 30-46g) shaken or blended with 200-300ml of cold water or milk. Milk gives a thicker, creamier shake with extra calories and protein; water keeps it lighter if you're watching total calories.",
      },
      {
        heading: "When to take it",
        body: "Most useful within an hour or two after training, but total daily protein matters more than exact timing. Many people also use a scoop between meals or with breakfast on busy mornings — there's no wrong time of day for it.",
      },
      {
        heading: "Tips",
        body: "Shaking clumps? Add liquid first, then powder. Stomach a bit off? Try an isolate or hydrolysed option (like ISO 100) — less lactose, easier to digest. Store the tub sealed and dry; humidity is what turns whey into a brick.",
      },
    ],
  },
  {
    slug: "casein-protein",
    category: "Casein Protein",
    title: "How to Use Casein Protein",
    summary: "The slow-release protein — best taken before bed for overnight recovery.",
    sections: [
      {
        heading: "What it's for",
        body: "Casein digests much more slowly than whey, releasing amino acids over several hours instead of one quick hit. That makes it well suited to the long gap overnight when you're not eating.",
      },
      {
        heading: "How to mix it",
        body: "One scoop with 250-300ml of cold water or milk. It's naturally thicker than whey — some people prefer it closer to a pudding consistency with a bit less liquid.",
      },
      {
        heading: "When to take it",
        body: "30-60 minutes before bed is the classic use case. It can also work as a between-meal shake on a day where a long gap is coming up (a busy afternoon with no meal break, for example).",
      },
      {
        heading: "Tips",
        body: "It mixes slower and clumpier than whey — a shaker with a mixing ball or a quick blend helps. If you're combining supplements, casein and whey aren't an either/or — some people use whey post-workout and casein at night.",
      },
    ],
  },
  {
    slug: "creatine",
    category: "Creatine",
    title: "How to Use Creatine",
    summary:
      "One of the most researched supplements there is — cheap, simple, and it works. No loading phase required.",
    sections: [
      {
        heading: "What it's for",
        body: "Creatine helps your muscles produce energy faster during short, intense effort — think heavy lifts and sprints. It's stored in muscle over time, which is why consistency matters more than exact timing.",
      },
      {
        heading: "Loading phase vs. maintenance dose",
        body: "You don't need to load. A flat 5g every day works — it just takes about 3-4 weeks to fully saturate your muscles. Loading (20g/day split into 4 doses for 5-7 days) gets you there faster if you're impatient, then drop to 5g/day to maintain.",
      },
      {
        heading: "How to take it",
        body: "Mix 1 scoop (usually 5g) into water, juice, or your regular shake. It's flavourless in most products, so it blends into whatever you're already drinking. Any time of day is fine — with a meal is common, since some people find it sits better that way.",
      },
      {
        heading: "Tips",
        body: "Drink a bit more water than usual — creatine draws water into your muscles. A small amount of water weight gain in the first couple of weeks is normal and expected, not fat gain. Skip a day here and there and it's not a problem — it's the weeks-long average that matters, not any single dose.",
      },
    ],
  },
  {
    slug: "bcaa-aminos",
    category: "BCAA & Aminos",
    title: "How to Use BCAA & Amino Acid Drinks",
    summary: "A sippable drink for during training — helps curb muscle breakdown on a cut.",
    sections: [
      {
        heading: "What it's for",
        body: "Branched-chain amino acids (leucine, isoleucine, valine) are building blocks your body pulls from muscle tissue during hard training if it doesn't have enough available. Sipping them during a session helps reduce that breakdown — most useful for anyone training fasted or on a calorie deficit.",
      },
      {
        heading: "How to mix it",
        body: "One scoop in 400-600ml of water — it's designed to be sipped through a session like a sports drink, not downed in one go.",
      },
      {
        heading: "When to take it",
        body: "During training is the main use case. Some people also sip it through a fasted cardio session, or between meals on a cut when they want something in their system without the calories of a full shake.",
      },
      {
        heading: "Tips",
        body: "If you're already getting enough protein from meals and a whey shake, BCAAs are a nice-to-have rather than essential — they matter most when total daily protein is on the low side or training is fasted.",
      },
    ],
  },
  {
    slug: "mass-gainer",
    category: "Mass Gainer",
    title: "How to Use Mass Gainers",
    summary: "For hardgainers who struggle to eat enough — a calorie-dense shake on top of meals.",
    sections: [
      {
        heading: "What it's for",
        body: "Mass gainers pack significantly more carbs and calories per serving than a regular protein shake — some go past 1,000 calories a scoop. They're for people who genuinely struggle to eat enough food to grow, not a replacement for regular meals.",
      },
      {
        heading: "How to mix it",
        body: "Check your tub — servings and scoop counts vary a lot between products (some are 1 scoop, some are 3-4). Mix with milk rather than water if you want the extra calories; water keeps it lighter if a product already runs very calorie-dense for you.",
      },
      {
        heading: "When to take it",
        body: "Between meals or after training, on top of your normal eating — not instead of it. Splitting a serving across the day (half mid-morning, half evening) is easier to get down than one huge shake if the calorie count is high.",
      },
      {
        heading: "Tips",
        body: "Start with a half serving if you're new to gainers — the carb load can sit heavy until your system adjusts. If you're gaining fat faster than muscle, that's a sign to dial back the serving or the frequency, not to stop training.",
      },
    ],
  },
  {
    slug: "pre-workout",
    category: "Pre-Workout",
    title: "How to Use Pre-Workout",
    summary: "For energy and focus going into a session — start on a partial dose if you're new to it.",
    sections: [
      {
        heading: "What it's for",
        body: "Pre-workouts combine caffeine with ingredients like beta-alanine and citrulline for energy, focus and the 'pump' feeling during training. Stimulant content varies a lot between products — check the label, especially on anything badged High Stim.",
      },
      {
        heading: "How to take it",
        body: "One scoop in 200-300ml of water, 20-30 minutes before training so it has time to kick in.",
      },
      {
        heading: "When to take it",
        body: "Before training only — not as a general energy drink, and not late in the day unless you're comfortable with caffeine close to bedtime. Most pre-workouts carry 150-300mg of caffeine per scoop, roughly 1.5-3 cups of coffee.",
      },
      {
        heading: "Tips",
        body: "New to pre-workout, or trying a high-stim one for the first time? Start with a half scoop to check your tolerance — the tingling feeling from beta-alanine is normal and harmless, but a full dose of an unfamiliar stimulant load is not the place to find your limit. Don't stack two pre-workouts or add extra caffeine on top.",
      },
    ],
  },
  {
    slug: "fat-burner",
    category: "Fat Burner",
    title: "How to Use Fat Burners & Thermogenics",
    summary: "Support for metabolism and energy on a cut — not a substitute for diet and training.",
    sections: [
      {
        heading: "What it's for",
        body: "Fat burners/thermogenics use ingredients like caffeine, green tea extract and L-carnitine to support metabolism and energy while you're in a calorie deficit. They support fat loss, they don't cause it on their own — diet and training are still doing the actual work.",
      },
      {
        heading: "How to take it",
        body: "Follow the capsule count on your specific product — this varies a lot by brand and stimulant strength, from 1 capsule to 2. Take with water and a meal unless the label says otherwise.",
      },
      {
        heading: "When to take it",
        body: "Morning or early afternoon, ideally before training. Avoid taking it late in the day — most of these are stimulant-based and will affect sleep.",
      },
      {
        heading: "Tips",
        body: "If a product is stimulant-based (check for caffeine or similar on the label), start on a half dose to check tolerance, especially if you also drink coffee. The stimulant-free liquid L-Carnitine option is the gentler entry point if you'd rather skip the stimulant side entirely.",
      },
    ],
  },
  {
    slug: "meal-replacement",
    category: "Meal Replacement",
    title: "How to Use Meal Replacement Shakes",
    summary: "A filling, protein-forward stand-in for a rushed meal on a fat-loss plan.",
    sections: [
      {
        heading: "What it's for",
        body: "Meal replacement shakes are designed to genuinely replace a meal, not sit alongside one — they're higher in protein and fibre than a regular protein shake, and portioned to keep you full.",
      },
      {
        heading: "How to mix it",
        body: "Two scoops with 300-400ml of cold water or milk — check your product's label, as this is a bigger serving than a standard protein shake.",
      },
      {
        heading: "When to take it",
        body: "In place of breakfast or lunch when you don't have time to cook something proper, not as an extra shake on top of normal meals — that defeats the calorie-control purpose.",
      },
      {
        heading: "Tips",
        body: "Don't rely on it for every meal, every day — it's a convenient stand-in for busy days, not a full diet replacement. Add ice or blend with frozen fruit for a thicker, more filling texture.",
      },
    ],
  },
];
