"use client";

import { useState } from "react";
import { Check, Tag, ChevronDown, ChevronUp } from "lucide-react";
import { CatalogFilters, CatalogResult } from "@/lib/catalog";

/** Flavour list is long; show a preview and let the user expand it. */
const FLAVOR_PREVIEW = 6;

interface FilterPanelProps {
  filters: CatalogFilters;
  result: CatalogResult;
  onToggle: (key: "goals" | "brands" | "flavors", value: string) => void;
  onApply: (next: Partial<CatalogFilters>) => void;
}

/** Preset bands beat a slider on a phone — one tap, no dragging. */
const PRICE_BANDS: { label: string; min: number | null; max: number | null }[] = [
  { label: "Under K500", min: null, max: 499 },
  { label: "K500 – K1,000", min: 500, max: 1000 },
  { label: "K1,000 – K1,500", min: 1000, max: 1500 },
  { label: "Over K1,500", min: 1501, max: null },
];

const PROTEIN_STEPS = [20, 24, 30];

function Row({
  label,
  count,
  checked,
  onClick,
  disabled,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <li>
      <button
        onClick={onClick}
        disabled={disabled}
        role="checkbox"
        aria-checked={checked}
        className={`flex h-12 w-full items-center gap-3 rounded-lg px-2 text-left text-sm transition ${
          disabled
            ? "cursor-not-allowed text-muted/40"
            : checked
              ? "text-ink"
              : "text-muted hover:bg-charcoal/60 hover:text-ink"
        }`}
      >
        <span
          aria-hidden="true"
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border transition ${
            checked ? "border-brand bg-brand text-charcoal" : "border-border bg-charcoal"
          }`}
        >
          {checked && <Check size={13} strokeWidth={3} />}
        </span>
        <span className="flex-1 truncate">{label}</span>
        {count !== undefined && (
          <span className="shrink-0 text-xs tabular-nums text-muted">{count}</span>
        )}
      </button>
    </li>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border py-4 first:border-t-0 first:pt-0">
      <h3 className="mb-1 px-2 text-xs font-semibold uppercase tracking-widest text-ink">
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function FilterPanel({
  filters,
  result,
  onToggle,
  onApply,
}: FilterPanelProps) {
  const { facets } = result;
  const [showAllFlavors, setShowAllFlavors] = useState(false);

  // keep any flavour the user has already picked visible when collapsed
  const visibleFlavors = showAllFlavors
    ? facets.flavors
    : facets.flavors.filter(
        (f, i) => i < FLAVOR_PREVIEW || filters.flavors.includes(f.value)
      );

  const priceBandActive = (b: (typeof PRICE_BANDS)[number]) =>
    filters.minPrice === b.min && filters.maxPrice === b.max;

  return (
    <div>
      <Group title="Goal">
        <ul>
          {facets.goals.map((f) => (
            <Row
              key={f.value}
              label={f.value}
              count={f.count}
              checked={filters.goals.includes(f.value)}
              onClick={() => onToggle("goals", f.value)}
            />
          ))}
        </ul>
      </Group>

      <Group title="Brand">
        <ul>
          {facets.brands.map((f) => (
            <Row
              key={f.value}
              label={f.value}
              count={f.count}
              checked={filters.brands.includes(f.value)}
              onClick={() => onToggle("brands", f.value)}
            />
          ))}
        </ul>
      </Group>

      <Group title="Price">
        <ul>
          {PRICE_BANDS.map((b) => (
            <Row
              key={b.label}
              label={b.label}
              checked={priceBandActive(b)}
              onClick={() =>
                onApply(
                  priceBandActive(b)
                    ? { minPrice: null, maxPrice: null }
                    : { minPrice: b.min, maxPrice: b.max }
                )
              }
            />
          ))}
        </ul>
      </Group>

      <Group title="Protein per serving">
        <ul>
          {PROTEIN_STEPS.map((g) => (
            <Row
              key={g}
              label={`${g}g or more`}
              checked={filters.minProtein === g}
              onClick={() => onApply({ minProtein: filters.minProtein === g ? null : g })}
            />
          ))}
        </ul>
      </Group>

      <Group title="Flavour">
        {/* Collapsed rather than given its own scroll area — a scrollbar nested
            inside the already-scrolling filter column is a UI trap: it steals
            the wheel and puts two bars side by side. */}
        <ul>
          {visibleFlavors.map((f) => (
            <Row
              key={f.value}
              label={f.value}
              count={f.count}
              checked={filters.flavors.includes(f.value)}
              onClick={() => onToggle("flavors", f.value)}
            />
          ))}
        </ul>
        {facets.flavors.length > FLAVOR_PREVIEW && (
          <button
            onClick={() => setShowAllFlavors((v) => !v)}
            aria-expanded={showAllFlavors}
            className="flex h-12 items-center gap-1 px-2 text-xs font-semibold text-brand transition hover:text-brand-light"
          >
            {showAllFlavors ? (
              <>
                Show fewer <ChevronUp size={14} />
              </>
            ) : (
              <>
                Show all {facets.flavors.length} flavours <ChevronDown size={14} />
              </>
            )}
          </button>
        )}
      </Group>

      <Group title="Offers">
        <ul>
          <Row
            label="On promotion"
            count={facets.onSale}
            checked={filters.onSale}
            disabled={facets.onSale === 0 && !filters.onSale}
            onClick={() => onApply({ onSale: !filters.onSale })}
          />
        </ul>
      </Group>

      <p className="flex items-start gap-2 border-t border-border px-2 pt-4 text-xs text-muted">
        <Tag size={13} className="mt-0.5 shrink-0 text-brand" />
        Sort by <span className="text-ink">best value per serving</span> to compare
        real cost — a big gainer tub often works out cheaper per scoop.
      </p>
    </div>
  );
}
