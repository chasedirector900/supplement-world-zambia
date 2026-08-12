import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Flame } from "lucide-react";

/**
 * Homepage trust anchor, right after the hero and before the goal filter —
 * "here's what people actually buy" before someone starts browsing on their
 * own. Editorial badge (Product.badge === "Best Seller"), not computed from
 * real sales data — there's no backend tracking orders yet (see the note on
 * lib/types.ts's Badge type).
 *
 * Snap-scroll rail rather than a grid, same pattern as Testimonials/videos:
 * keeps every card full-size and readable instead of squeezing a "why buy
 * this" pitch into a half-width column.
 */
export default function BestSellers() {
  const bestSellers = products.filter((p) => p.badge === "Best Seller").slice(0, 8);
  if (bestSellers.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center gap-2">
        <Flame size={18} className="text-brand" />
        <h2 className="font-display text-xl tracking-wide text-ink sm:text-2xl">
          BEST SELLERS
        </h2>
      </div>
      <p className="mt-1 text-sm text-muted">What people actually buy on repeat.</p>

      <div className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible">
        {bestSellers.map((product) => (
          <div key={product.id} className="w-[46%] shrink-0 snap-start sm:w-auto">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
