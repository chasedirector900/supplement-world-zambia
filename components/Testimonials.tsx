import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { products } from "@/data/products";
import AvatarPlaceholder from "@/components/AvatarPlaceholder";

/**
 * "Real Results" — customer proof, tagged back to the product that produced
 * it. Sits right after the catalog: once someone knows what's for sale, the
 * next question is "did this actually work for someone like me".
 *
 * Horizontal snap-scroll on mobile (where most traffic lands) rather than a
 * grid — keeps each card full-width and readable instead of squeezing a
 * quote into a half-width column the way the product grid would.
 */
export default function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-xl tracking-wide text-ink sm:text-2xl">
          REAL RESULTS
        </h2>
        <p className="text-xs text-muted">From customers in Lusaka</p>
      </div>

      <div className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible lg:grid-cols-3">
        {testimonials.map((t) => {
          const product = products.find((p) => p.id === t.productId);
          return (
            <article
              key={t.id}
              className="flex w-[85%] shrink-0 snap-start flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-card sm:w-auto"
            >
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full">
                  {t.photo ? (
                    <Image
                      src={t.photo}
                      alt={t.customerName}
                      width={44}
                      height={44}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <AvatarPlaceholder name={t.customerName} seed={t.id} />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">
                    {t.customerName}
                  </p>
                  <p className="truncate text-xs text-muted">{t.location}</p>
                </div>
              </div>

              <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < t.rating
                        ? "fill-brand text-brand"
                        : "fill-transparent text-border"
                    }
                  />
                ))}
              </div>

              <p className="flex-1 text-sm leading-relaxed text-muted">
                &ldquo;{t.quote}&rdquo;
              </p>

              {product && (
                <Link
                  href={`/shop?q=${encodeURIComponent(product.name)}`}
                  className="mt-auto w-fit rounded-full border border-border bg-charcoal/60 px-3 py-1 text-[11px] font-medium text-brand transition hover:border-brand/60"
                >
                  Used: {product.name}
                </Link>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
