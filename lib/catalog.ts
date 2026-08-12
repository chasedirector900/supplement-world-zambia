import { Product, Goal } from "@/lib/types";

/**
 * Catalog query engine — search, faceting, sorting and the derived value
 * metrics. Deliberately pure and UI-free: the shop page composes it, and when
 * Phase 2 swaps the mock array for a Django endpoint the same functions can run
 * server-side against the same `Product` shape (ARCHITECTURE.md §8).
 */

export type SortKey =
  | "relevance"
  | "price-asc"
  | "price-desc"
  | "protein-desc"
  | "value-asc"
  | "name-asc";

export const SORT_LABELS: Record<SortKey, string> = {
  relevance: "Best match",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  "protein-desc": "Most protein per serving",
  "value-asc": "Best value per serving",
  "name-asc": "Name: A–Z",
};

export interface CatalogFilters {
  q: string;
  goals: string[];
  brands: string[];
  flavors: string[];
  minPrice: number | null;
  maxPrice: number | null;
  minProtein: number | null;
  onSale: boolean;
  sort: SortKey;
}

export const EMPTY_FILTERS: CatalogFilters = {
  q: "",
  goals: [],
  brands: [],
  flavors: [],
  minPrice: null,
  maxPrice: null,
  minProtein: null,
  onSale: false,
  sort: "relevance",
};

/* ── derived value metrics ────────────────────────────────────────────────
   Price per serving is the number that actually decides a supplement
   purchase — a 5kg gainer looking "expensive" next to a 900g tub is usually
   the cheaper product. Nothing else on the page surfaces that, so we derive
   it rather than asking the shop to maintain another field.
   ───────────────────────────────────────────────────────────────────────── */

interface Amount {
  value: number;
  /** normalised unit family so size and serving can be compared */
  unit: "g" | "ml" | "unit";
}

/** "2kg" → 2000g · "480ml" → 480ml · "60 caps" → 60 units */
function parseSize(size: string): Amount | null {
  const m = size.match(/([\d.]+)\s*(kg|g|ml|l|caps?|capsules?|tabs?)/i);
  if (!m) return null;
  const value = parseFloat(m[1]);
  const unit = m[2].toLowerCase();
  if (!Number.isFinite(value)) return null;
  if (unit === "kg") return { value: value * 1000, unit: "g" };
  if (unit === "g") return { value, unit: "g" };
  if (unit === "l") return { value: value * 1000, unit: "ml" };
  if (unit === "ml") return { value, unit: "ml" };
  return { value, unit: "unit" }; // caps / tabs
}

/** "1 scoop (30g)" → 30g · "2 capsules" → 2 units · "1 shot (25ml)" → 25ml */
function parseServing(serving: string): Amount | null {
  const bracketed = serving.match(/\(([\d.]+)\s*(g|ml)\)/i);
  if (bracketed) {
    const value = parseFloat(bracketed[1]);
    if (Number.isFinite(value)) {
      return { value, unit: bracketed[2].toLowerCase() === "ml" ? "ml" : "g" };
    }
  }
  const counted = serving.match(/^([\d.]+)\s*(caps?|capsules?|tabs?)/i);
  if (counted) {
    const value = parseFloat(counted[1]);
    if (Number.isFinite(value)) return { value, unit: "unit" };
  }
  return null;
}

/** Servings in the pack the listed price refers to (the first size option). */
export function servingsPerPack(product: Product): number | null {
  const size = parseSize(product.sizeOptions[0] ?? "");
  const serving = parseServing(product.macros.servingSize);
  if (!size || !serving) return null;
  if (size.unit !== serving.unit) return null;
  if (serving.value <= 0) return null;
  const servings = size.value / serving.value;
  return servings >= 1 ? Math.round(servings) : null;
}

/**
 * Other flavours of the same product — each flavour is its own catalog entry
 * rather than a variant field, so "flavour switching" on the PDP means
 * linking across sibling entries that share a brand + name.
 */
export function siblingFlavors(product: Product, all: Product[]): Product[] {
  return all.filter(
    (p) => p.id !== product.id && p.brand === product.brand && p.name === product.name
  );
}

/** ZMW per serving, or null when the pack/serving units can't be reconciled. */
export function pricePerServing(product: Product): number | null {
  const servings = servingsPerPack(product);
  if (!servings) return null;
  return product.priceZMW / servings;
}

/* ── search ───────────────────────────────────────────────────────────── */

const normalise = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s%.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Token-AND scoring: every token must appear somewhere, so "usn chocolate"
 * doesn't drag in every chocolate product. Weighting favours name and brand
 * hits over an incidental description match.
 */
export function scoreProduct(product: Product, query: string): number {
  const tokens = normalise(query).split(" ").filter(Boolean);
  if (tokens.length === 0) return 1;

  const fields: [string, number][] = [
    [normalise(product.name), 10],
    [normalise(product.brand), 6],
    [normalise(product.flavor), 5],
    [normalise(product.goals.join(" ")), 3],
    [normalise(product.sizeOptions.join(" ")), 2],
    [normalise(product.description), 1],
  ];

  let total = 0;
  for (const token of tokens) {
    let best = 0;
    for (const [text, weight] of fields) {
      if (!text.includes(token)) continue;
      // whole-word and prefix hits rank above a mid-word substring
      const boundary = new RegExp(`(^|\\s)${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
      best = Math.max(best, boundary.test(text) ? weight * 2 : weight);
    }
    if (best === 0) return 0; // token matched nothing — product is out
    total += best;
  }
  return total;
}

/* ── filtering ────────────────────────────────────────────────────────── */

/** Every predicate except the named one — the basis for facet counts. */
function passesExcept(
  product: Product,
  f: CatalogFilters,
  except: "goals" | "brands" | "flavors" | "price" | "protein" | "sale" | null
): boolean {
  if (except !== "goals" && f.goals.length && !f.goals.some((g) => product.goals.includes(g as Goal)))
    return false;
  if (except !== "brands" && f.brands.length && !f.brands.includes(product.brand)) return false;
  if (except !== "flavors" && f.flavors.length && !f.flavors.includes(product.flavor)) return false;
  if (except !== "price") {
    if (f.minPrice !== null && product.priceZMW < f.minPrice) return false;
    if (f.maxPrice !== null && product.priceZMW > f.maxPrice) return false;
  }
  if (except !== "protein" && f.minProtein !== null && product.macros.protein < f.minProtein)
    return false;
  if (except !== "sale" && f.onSale && !product.compareAtZMW) return false;
  return true;
}

export interface CatalogResult {
  items: Product[];
  total: number;
  facets: {
    brands: { value: string; count: number }[];
    goals: { value: string; count: number }[];
    flavors: { value: string; count: number }[];
    onSale: number;
  };
  priceBounds: { min: number; max: number };
}

export function queryCatalog(all: Product[], f: CatalogFilters): CatalogResult {
  // search first — facet counts should reflect the current query
  const searched = f.q.trim()
    ? all
        .map((p) => ({ p, score: scoreProduct(p, f.q) }))
        .filter((x) => x.score > 0)
    : all.map((p) => ({ p, score: 1 }));

  const matching = searched.filter((x) => passesExcept(x.p, f, null));

  const countBy = (
    key: "brands" | "goals" | "flavors",
    pick: (p: Product) => string[]
  ) => {
    const counts = new Map<string, number>();
    for (const { p } of searched) {
      if (!passesExcept(p, f, key)) continue;
      for (const value of pick(p)) counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
  };

  const sorters: Record<SortKey, (a: { p: Product; score: number }, b: { p: Product; score: number }) => number> = {
    relevance: (a, b) => b.score - a.score || a.p.name.localeCompare(b.p.name),
    "price-asc": (a, b) => a.p.priceZMW - b.p.priceZMW,
    "price-desc": (a, b) => b.p.priceZMW - a.p.priceZMW,
    "protein-desc": (a, b) => b.p.macros.protein - a.p.macros.protein,
    "value-asc": (a, b) => {
      // products we can't price per serving sink to the bottom rather than
      // silently sorting as if they were free
      const av = pricePerServing(a.p) ?? Infinity;
      const bv = pricePerServing(b.p) ?? Infinity;
      return av - bv;
    },
    "name-asc": (a, b) => a.p.name.localeCompare(b.p.name),
  };

  const items = [...matching].sort(sorters[f.sort]).map((x) => x.p);
  const prices = all.map((p) => p.priceZMW);

  return {
    items,
    total: items.length,
    facets: {
      brands: countBy("brands", (p) => [p.brand]),
      goals: countBy("goals", (p) => p.goals as unknown as string[]),
      flavors: countBy("flavors", (p) => [p.flavor]),
      onSale: searched.filter((x) => passesExcept(x.p, f, "sale") && x.p.compareAtZMW).length,
    },
    priceBounds: { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) },
  };
}

/** Count of filters the user has actively applied (search excluded). */
export function activeFilterCount(f: CatalogFilters): number {
  return (
    f.goals.length +
    f.brands.length +
    f.flavors.length +
    (f.minPrice !== null || f.maxPrice !== null ? 1 : 0) +
    (f.minProtein !== null ? 1 : 0) +
    (f.onSale ? 1 : 0)
  );
}

/**
 * "Did you mean" fallbacks for a zero-result search: the closest brands and
 * product words by shared-prefix, so the dead end still offers a way forward.
 */
export function suggestTerms(all: Product[], query: string, limit = 4): string[] {
  const q = normalise(query);
  if (!q) return [];
  const vocab = new Set<string>();
  for (const p of all) {
    vocab.add(p.brand);
    for (const word of p.name.split(/\s+/)) if (word.length > 3) vocab.add(word);
    vocab.add(p.flavor);
  }
  return [...vocab]
    .map((term) => {
      const t = normalise(term);
      let shared = 0;
      while (shared < t.length && shared < q.length && t[shared] === q[shared]) shared++;
      return { term, shared, includes: t.includes(q) || q.includes(t) };
    })
    .filter((x) => x.shared >= 2 || x.includes)
    .sort((a, b) => Number(b.includes) - Number(a.includes) || b.shared - a.shared)
    .slice(0, limit)
    .map((x) => x.term);
}
