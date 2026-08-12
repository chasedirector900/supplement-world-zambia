"use client";

import { X } from "lucide-react";
import { CatalogFilters } from "@/lib/catalog";

interface ActiveFiltersProps {
  filters: CatalogFilters;
  onToggle: (key: "goals" | "brands" | "flavors", value: string) => void;
  onApply: (next: Partial<CatalogFilters>) => void;
  onClearAll: () => void;
}

const money = (n: number) => `K${n.toLocaleString()}`;

/**
 * Every applied filter as an individually removable chip. Without this, a
 * narrowed-to-nothing result set looks broken rather than over-filtered —
 * the user can see exactly what's on and drop one thing at a time.
 */
export default function ActiveFilters({
  filters,
  onToggle,
  onApply,
  onClearAll,
}: ActiveFiltersProps) {
  const chips: { key: string; label: string; remove: () => void }[] = [];

  filters.goals.forEach((v) =>
    chips.push({ key: `goal-${v}`, label: v, remove: () => onToggle("goals", v) })
  );
  filters.brands.forEach((v) =>
    chips.push({ key: `brand-${v}`, label: v, remove: () => onToggle("brands", v) })
  );
  filters.flavors.forEach((v) =>
    chips.push({ key: `flavor-${v}`, label: v, remove: () => onToggle("flavors", v) })
  );

  if (filters.minPrice !== null || filters.maxPrice !== null) {
    const label =
      filters.minPrice !== null && filters.maxPrice !== null
        ? `${money(filters.minPrice)} – ${money(filters.maxPrice)}`
        : filters.maxPrice !== null
          ? `Under ${money(filters.maxPrice + 1)}`
          : `Over ${money(filters.minPrice! - 1)}`;
    chips.push({
      key: "price",
      label,
      remove: () => onApply({ minPrice: null, maxPrice: null }),
    });
  }

  if (filters.minProtein !== null) {
    chips.push({
      key: "protein",
      label: `${filters.minProtein}g+ protein`,
      remove: () => onApply({ minProtein: null }),
    });
  }

  if (filters.onSale) {
    chips.push({ key: "sale", label: "On promotion", remove: () => onApply({ onSale: false }) });
  }

  if (chips.length === 0) return null;

  return (
    // gap-y-3 leaves room for the chips' expanded (48px) hit areas to sit
    // between wrapped rows without overlapping each other
    <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
      {chips.map((chip) => (
        <button
          key={chip.key}
          onClick={chip.remove}
          aria-label={`Remove filter: ${chip.label}`}
          className="relative flex h-10 items-center gap-1.5 rounded-full border border-brand/40 bg-brand/10 pl-3 pr-2 text-xs text-ink transition before:absolute before:-inset-y-1 before:content-[''] hover:border-brand hover:bg-brand/20"
        >
          {chip.label}
          <X size={13} className="text-muted" />
        </button>
      ))}
      <button
        onClick={onClearAll}
        className="relative flex h-10 min-w-12 items-center justify-center rounded-full px-3 text-xs text-muted underline underline-offset-4 transition before:absolute before:-inset-y-1 before:content-[''] hover:text-ink"
      >
        Clear all
      </button>
    </div>
  );
}
