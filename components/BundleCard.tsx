"use client";

import Link from "next/link";
import { Package, Plus } from "lucide-react";
import { Bundle } from "@/lib/types";
import { products } from "@/data/products";
import { useCartStore } from "@/lib/store";
import ProductMedia from "@/components/ProductMedia";

/**
 * A goal's whole stack in one card — everything for "Build Lean Muscle" (or
 * whichever goal is active) bundled into a single add-to-cart tap instead of
 * hunting down each product individually. Sits right above the product grid
 * when a specific goal is selected on the homepage.
 *
 * "Add Stack to Cart" adds each product as its own normal cart line (default
 * size, qty 1) rather than inventing a combined bundle line — the customer
 * can still edit or drop one item in the cart drawer afterward, and no new
 * cart/store logic was needed to ship this.
 */
export default function BundleCard({ bundle }: { bundle: Bundle }) {
  const addLine = useCartStore((s) => s.addLine);

  const items = bundle.productIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const total = items.reduce((sum, p) => sum + p.priceZMW, 0);

  const handleAddStack = () => {
    for (const p of items) addLine(p.id, p.sizeOptions[0]);
  };

  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-brand/30 bg-surface p-4 shadow-card sm:flex-row sm:items-center sm:gap-6 sm:p-5">
      <div className="flex shrink-0 -space-x-3">
        {items.slice(0, 3).map((p) => (
          <div
            key={p.id}
            className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 border-surface bg-charcoal shadow-md"
          >
            <ProductMedia product={p} sizes="64px" decorative />
          </div>
        ))}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-brand">
          <Package size={14} />
          <span className="text-[11px] font-semibold uppercase tracking-widest">
            Goal Stack
          </span>
        </div>
        <h3 className="mt-0.5 text-base font-semibold text-ink sm:text-lg">
          {bundle.name}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-muted sm:text-sm">
          {bundle.description}
        </p>
        <p className="mt-2 text-xs text-muted">
          {items.map((p, i) => (
            <span key={p.id}>
              <Link
                href={`/product/${p.id}`}
                className="underline decoration-border underline-offset-2 transition hover:text-brand hover:decoration-brand"
              >
                {p.name}
              </Link>
              {i < items.length - 1 && " + "}
            </span>
          ))}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
        <span className="text-lg font-bold text-ink">ZMW {total.toFixed(2)}</span>
        <button
          onClick={handleAddStack}
          className="flex h-11 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-charcoal shadow-glow transition hover:bg-brand-light active:scale-[0.98]"
        >
          <Plus size={16} />
          Add Stack to Cart
        </button>
      </div>
    </div>
  );
}
