"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CatalogFilters, EMPTY_FILTERS, SortKey, SORT_LABELS } from "@/lib/catalog";

/**
 * The URL is the single source of truth for the shop's state.
 *
 * That buys three things a `useState` version wouldn't: a filtered view is
 * shareable (staff can WhatsApp a customer "here's our whey under K1000"),
 * the browser back button steps through filter changes, and a reload keeps
 * the results. Multi-value facets use repeated params rather than a delimiter
 * so values containing punctuation can never corrupt the parse.
 */

const KEYS = {
  q: "q",
  goal: "goal",
  brand: "brand",
  flavor: "flavor",
  min: "min",
  max: "max",
  protein: "protein",
  sale: "sale",
  sort: "sort",
} as const;

function toInt(value: string | null): number | null {
  if (value === null || value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function readFilters(params: URLSearchParams): CatalogFilters {
  const sort = params.get(KEYS.sort) as SortKey | null;
  return {
    q: params.get(KEYS.q) ?? "",
    goals: params.getAll(KEYS.goal),
    brands: params.getAll(KEYS.brand),
    flavors: params.getAll(KEYS.flavor),
    minPrice: toInt(params.get(KEYS.min)),
    maxPrice: toInt(params.get(KEYS.max)),
    minProtein: toInt(params.get(KEYS.protein)),
    onSale: params.get(KEYS.sale) === "1",
    sort: sort && sort in SORT_LABELS ? sort : "relevance",
  };
}

export function buildQuery(f: CatalogFilters): string {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set(KEYS.q, f.q.trim());
  f.goals.forEach((g) => p.append(KEYS.goal, g));
  f.brands.forEach((b) => p.append(KEYS.brand, b));
  f.flavors.forEach((v) => p.append(KEYS.flavor, v));
  if (f.minPrice !== null) p.set(KEYS.min, String(f.minPrice));
  if (f.maxPrice !== null) p.set(KEYS.max, String(f.maxPrice));
  if (f.minProtein !== null) p.set(KEYS.protein, String(f.minProtein));
  if (f.onSale) p.set(KEYS.sale, "1");
  if (f.sort !== "relevance") p.set(KEYS.sort, f.sort);
  return p.toString();
}

export function useCatalogParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => readFilters(new URLSearchParams(searchParams.toString())),
    [searchParams]
  );

  const apply = useCallback(
    (next: Partial<CatalogFilters>, opts?: { push?: boolean }) => {
      const merged = { ...filters, ...next };
      const qs = buildQuery(merged);
      const url = qs ? `${pathname}?${qs}` : pathname;

      // Search-only changes replace, so a debounced keystroke doesn't bury the
      // previous page under a dozen history entries. Everything else (facets,
      // sort, price band) pushes, so Back undoes exactly one deliberate action.
      const keys = Object.keys(next);
      const searchOnly = keys.length > 0 && keys.every((k) => k === "q");
      const push = opts?.push ?? !searchOnly;

      if (push) router.push(url, { scroll: false });
      else router.replace(url, { scroll: false });
    },
    [filters, pathname, router]
  );

  /** Add/remove one value from a multi-select facet. */
  const toggle = useCallback(
    (key: "goals" | "brands" | "flavors", value: string) => {
      const current = filters[key];
      apply({
        [key]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      } as Partial<CatalogFilters>);
    },
    [filters, apply]
  );

  const clearAll = useCallback(() => {
    // the search term survives "clear filters" — clearing it too tends to
    // read as the page having thrown the query away
    apply({ ...EMPTY_FILTERS, q: filters.q, sort: filters.sort });
  }, [apply, filters.q, filters.sort]);

  return { filters, apply, toggle, clearAll };
}
