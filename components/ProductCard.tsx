"use client";

import Link from "next/link";
import { Product } from "@/lib/types";
import ProductMedia from "@/components/ProductMedia";
import { pricePerServing, servingsPerPack } from "@/lib/catalog";
import { useCartStore } from "@/lib/store";
import { BADGE_STYLE } from "@/lib/badges";
import { Plus } from "lucide-react";

export default function ProductCard({
  product,
  showValue = false,
}: {
  product: Product;
  /** Shows cost per serving — the metric that actually decides a supplement
   *  purchase. On by default only where people compare (the shop page). */
  showValue?: boolean;
}) {
  const addLine = useCartStore((s) => s.addLine);
  const defaultSize = product.sizeOptions[0];
  const perServing = showValue ? pricePerServing(product) : null;
  const servings = showValue ? servingsPerPack(product) : null;
  const badge = product.badge ? BADGE_STYLE[product.badge] : null;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition hover:border-brand/60">
      <Link
        href={`/product/${product.id}`}
        className="absolute inset-0 z-10"
        aria-label={`View ${product.name} — ${product.flavor}`}
      />

      {/* Shorter than square on mobile — a 2-col grid at ~170px wide made a
          full square image plus all the text below run too tall for the
          viewport. Desktop keeps the square crop, unaffected. */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-charcoal sm:aspect-square">
        <div className="absolute inset-0 transition duration-300 group-hover:scale-105">
          <ProductMedia product={product} sizes="(max-width: 640px) 50vw, 25vw" />
        </div>
        {badge && (
          <span
            className={`absolute left-2 top-2 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide sm:text-[11px] ${badge.className}`}
          >
            <badge.icon size={11} />
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-2.5 sm:gap-2 sm:p-3">
        <div>
          <h3 className="text-xs font-semibold leading-tight text-ink sm:text-sm">
            {product.name}
          </h3>
          <p className="text-[11px] text-muted sm:text-xs">{product.flavor}</p>
        </div>

        {/* Macro transparency: the numbers a buyer actually shops on */}
        <div className="grid grid-cols-3 gap-1 rounded-lg border border-border bg-charcoal/60 px-1.5 py-1 text-center text-[9px] leading-tight text-muted sm:py-1.5 sm:text-[10px]">
          <span className="flex flex-col">
            <strong className="text-[11px] text-brand sm:text-xs">
              {product.macros.protein}g
            </strong>
            Protein
          </span>
          <span className="flex flex-col border-x border-border">
            <strong className="text-[11px] text-ink sm:text-xs">
              {product.macros.fat}g
            </strong>
            Fat
          </span>
          <span className="flex flex-col justify-center break-words">
            {product.macros.servingSize}
          </span>
        </div>

        {perServing !== null && (
          <p className="text-[10px] text-muted sm:text-[11px]">
            <span className="text-ink">ZMW {perServing.toFixed(2)}</span> / serving
            <span className="hidden text-muted sm:inline"> · {servings} servings</span>
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-0.5 sm:pt-1">
          <div className="flex min-w-0 flex-col">
            {product.compareAtZMW && (
              <span className="text-[10px] text-muted line-through sm:text-[11px]">
                ZMW {product.compareAtZMW}
              </span>
            )}
            <span className="truncate text-sm font-bold text-ink sm:text-base">
              ZMW {product.priceZMW}
            </span>
          </div>
          <button
            onClick={() => addLine(product.id, defaultSize)}
            aria-label={`Add ${product.name} to cart`}
            className="relative z-20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-charcoal transition hover:bg-brand-light active:scale-90 before:absolute before:-inset-1.5 before:content-[''] sm:h-9 sm:w-9"
          >
            <Plus size={16} className="sm:hidden" />
            <Plus size={18} className="hidden sm:block" />
          </button>
        </div>
      </div>
    </div>
  );
}
