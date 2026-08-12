"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, SlidersHorizontal, X, SearchX } from "lucide-react";
import { products } from "@/data/products";
import {
  queryCatalog,
  activeFilterCount,
  suggestTerms,
  SORT_LABELS,
  SortKey,
} from "@/lib/catalog";
import { useCatalogParams } from "@/lib/useCatalogParams";
import ProductCard from "@/components/ProductCard";
import Select from "@/components/Select";
import SearchBar from "@/components/shop/SearchBar";
import FilterPanel from "@/components/shop/FilterPanel";
import ActiveFilters from "@/components/shop/ActiveFilters";

const SORT_KEYS = Object.keys(SORT_LABELS) as SortKey[];
const SORT_OPTIONS = SORT_KEYS.map((k) => SORT_LABELS[k]);

function ShopContent() {
  const { filters, apply, toggle, clearAll } = useCatalogParams();
  const [sheetOpen, setSheetOpen] = useState(false);

  const result = useMemo(() => queryCatalog(products, filters), [filters]);
  const appliedCount = activeFilterCount(filters);
  const isNarrowed = appliedCount > 0 || filters.q.trim().length > 0;
  const suggestions = useMemo(
    () => (result.total === 0 && filters.q ? suggestTerms(products, filters.q) : []),
    [result.total, filters.q]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 pb-8">
      <div className="flex items-center gap-3 pt-6">
        <Link
          href="/"
          className="flex h-12 items-center gap-2 text-sm text-muted transition hover:text-ink"
        >
          <ArrowLeft size={16} />
          Home
        </Link>
      </div>

      <h1 className="font-display text-3xl tracking-wide text-ink sm:text-4xl">
        SHOP ALL SUPPLEMENTS
      </h1>
      <p className="mt-1 text-sm text-muted">
        Filter by goal, brand or budget, compare cost per serving, and send your
        order straight to WhatsApp.
      </p>

      <div className="mt-5">
        <SearchBar
          value={filters.q}
          onChange={(q) => apply({ q })}
          resultCount={result.total}
          announceCount={isNarrowed}
        />
      </div>

      {/* toolbar */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setSheetOpen(true)}
          className="flex h-12 items-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm text-ink transition hover:border-brand lg:hidden"
        >
          <SlidersHorizontal size={16} className="text-brand" />
          Filters
          {appliedCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-xs font-semibold text-charcoal">
              {appliedCount}
            </span>
          )}
        </button>

        {/* A count is only shown once the user has narrowed things down — an
            unfiltered total would just publish how much stock the shop holds. */}
        <p className="text-sm text-muted" aria-live="polite">
          {isNarrowed ? (
            <>
              <span className="font-semibold text-ink">{result.total}</span>{" "}
              {result.total === 1 ? "product" : "products"}
              {filters.q && (
                <>
                  {" "}
                  for <span className="text-ink">&ldquo;{filters.q}&rdquo;</span>
                </>
              )}
            </>
          ) : (
            "Showing the full range"
          )}
        </p>

        <div className="ml-auto w-full sm:w-56">
          <Select
            label="Sort products by"
            value={SORT_LABELS[filters.sort]}
            options={SORT_OPTIONS}
            onChange={(label) => {
              const key = SORT_KEYS.find((k) => SORT_LABELS[k] === label);
              if (key) apply({ sort: key });
            }}
          />
        </div>
      </div>

      <div className="mt-4">
        <ActiveFilters
          filters={filters}
          onToggle={toggle}
          onApply={apply}
          onClearAll={clearAll}
        />
      </div>

      <div className="mt-6 flex gap-8">
        {/* desktop sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="scrollbar-slim sticky top-[calc(var(--header-h)+1rem)] max-h-[calc(100vh-var(--header-h)-3rem)] overflow-y-auto pr-2">
            <FilterPanel
              filters={filters}
              result={result}
              onToggle={toggle}
              onApply={apply}
            />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {result.total > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {result.items.map((product) => (
                <ProductCard key={product.id} product={product} showValue />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-surface px-6 py-14 text-center">
              <SearchX size={28} className="mx-auto text-muted" />
              <p className="mt-3 text-sm text-ink">
                Nothing matches{" "}
                {filters.q ? (
                  <>
                    &ldquo;<span className="text-brand">{filters.q}</span>&rdquo;
                  </>
                ) : (
                  "those filters"
                )}
                .
              </p>

              {suggestions.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-widest text-muted">
                    Try instead
                  </p>
                  <div className="mt-2 flex flex-wrap justify-center gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => apply({ q: s })}
                        className="flex h-9 items-center rounded-full border border-border bg-charcoal px-3 text-xs text-ink transition hover:border-brand"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {appliedCount > 0 && (
                <button
                  onClick={clearAll}
                  className="mt-5 h-12 rounded-xl border border-brand px-5 text-sm font-semibold text-brand transition hover:bg-brand/10"
                >
                  Clear {appliedCount} {appliedCount === 1 ? "filter" : "filters"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* mobile filter sheet */}
      {sheetOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Close filters"
            onClick={() => setSheetOpen(false)}
            className="absolute inset-0 bg-black/60 animate-fadeIn"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            className="absolute inset-y-0 left-0 flex w-full max-w-sm flex-col bg-surface shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="font-display text-xl tracking-wide">Filters</h2>
              <button
                onClick={() => setSheetOpen(false)}
                aria-label="Close"
                className="flex h-12 w-12 items-center justify-center rounded-lg text-muted hover:text-ink"
              >
                <X size={22} />
              </button>
            </div>

            <div className="scrollbar-slim flex-1 overflow-y-auto px-3 py-4">
              <FilterPanel
                filters={filters}
                result={result}
                onToggle={toggle}
                onApply={apply}
              />
            </div>

            <div className="flex gap-3 border-t border-border p-4">
              {appliedCount > 0 && (
                <button
                  onClick={clearAll}
                  className="h-12 shrink-0 rounded-xl border border-border px-4 text-sm text-muted transition hover:text-ink"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setSheetOpen(false)}
                className="h-12 flex-1 rounded-xl bg-brand text-sm font-semibold text-charcoal transition hover:bg-brand-light"
              >
                {isNarrowed
                  ? `Show ${result.total} ${result.total === 1 ? "result" : "results"}`
                  : "Show results"}
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  // useSearchParams needs a Suspense boundary for the route to prerender
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-16 text-sm text-muted">
          Loading catalog…
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
