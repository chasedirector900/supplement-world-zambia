"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Minus, Plus } from "lucide-react";
import { Product } from "@/lib/types";
import { products } from "@/data/products";
import { videos } from "@/data/videos";
import { guides } from "@/data/guides";
import { siblingFlavors } from "@/lib/catalog";
import { useCartStore } from "@/lib/store";
import {
  buildProductQuestionMessage,
  buildWhatsAppLink,
  buildWhatsAppMessage,
} from "@/lib/whatsapp";
import { WhatsAppIcon, YouTubeIcon } from "@/components/icons/BrandIcons";
import { GUIDE_ICON } from "@/lib/guideIcons";
import { BADGE_STYLE } from "@/lib/badges";
import ProductMedia from "@/components/ProductMedia";
import VideoPlaceholder from "@/components/VideoPlaceholder";
import TrustBadges from "@/components/TrustBadges";

/**
 * Product Detail Page content (ARCHITECTURE.md §4b). Client component: size
 * selection, quantity and the two order actions all need local state and the
 * cart store, so it's simplest to keep the whole thing client-side and let
 * the route file stay a plain server wrapper that does the `notFound()` check.
 */
export default function ProductDetail({ product }: { product: Product }) {
  const [size, setSize] = useState(product.sizeOptions[0]);
  const [qty, setQty] = useState(1);
  const addLine = useCartStore((s) => s.addLine);

  // Gallery is capped at 4 photos — see the note on Product.images.
  const gallery = (product.images ?? []).slice(0, 4);
  const [activeImage, setActiveImage] = useState(0);

  const flavors = siblingFlavors(product, products);
  const relatedVideos = videos.filter((v) => v.productId === product.id);
  const guide = guides.find((g) => g.category === product.category);
  const GuideIcon = guide ? GUIDE_ICON[guide.category] : null;
  const badge = product.badge ? BADGE_STYLE[product.badge] : null;

  const handleAddToCart = () => addLine(product.id, size, qty);

  const handleInstantOrder = () => {
    const message = buildWhatsAppMessage(
      [{ productId: product.id, size, quantity: qty }],
      products
    );
    window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24">
      <div className="flex items-center gap-3 pt-6">
        <Link
          href="/shop"
          className="flex h-12 items-center gap-2 text-sm text-muted transition hover:text-ink"
        >
          <ArrowLeft size={16} />
          Shop
        </Link>
      </div>

      <div className="mt-2 grid gap-6 lg:grid-cols-2 lg:gap-10">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-charcoal">
            <ProductMedia
              product={product}
              src={gallery[activeImage]}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {badge && (
              <span
                className={`absolute left-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${badge.className}`}
              >
                <badge.icon size={12} />
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnail strip — only shows up once a product actually has more
              than one real photo; a single/no-photo product just shows the
              placeholder above with nothing underneath it. */}
          {gallery.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {gallery.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  aria-label={`Show photo ${i + 1} of ${product.name}`}
                  aria-current={i === activeImage}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 bg-charcoal transition ${
                    i === activeImage
                      ? "border-brand"
                      : "border-border opacity-70 hover:opacity-100"
                  }`}
                >
                  <ProductMedia product={product} src={img} sizes="25vw" decorative />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Purchase engine */}
        <div className="flex flex-col">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            {product.brand}
          </p>
          <h1 className="mt-1 font-display text-2xl tracking-wide text-ink sm:text-3xl">
            {product.name}
          </h1>
          <p className="mt-1 text-sm text-muted">{product.flavor}</p>

          {flavors.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                Flavour
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full border border-brand bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand">
                  {product.flavor}
                </span>
                {flavors.map((f) => (
                  <Link
                    key={f.id}
                    href={`/product/${f.id}`}
                    className="rounded-full border border-border px-3 py-1.5 text-xs text-muted transition hover:border-brand hover:text-ink"
                  >
                    {f.flavor}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Size</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizeOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    s === size
                      ? "border-brand bg-brand/10 text-brand"
                      : "border-border text-muted hover:border-brand/60 hover:text-ink"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-baseline gap-2">
            {product.compareAtZMW && (
              <span className="text-sm text-muted line-through">
                ZMW {product.compareAtZMW}
              </span>
            )}
            <span className="text-2xl font-bold text-ink">ZMW {product.priceZMW}</span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Qty</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-border text-ink transition hover:border-brand"
              >
                <Minus size={16} />
              </button>
              <span className="w-6 text-center text-base font-semibold tabular-nums">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-border text-ink transition hover:border-brand"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Same recipe as the hero's Browse Catalog / Order via WhatsApp
              buttons (app/page.tsx) — h-12, px-6, text-sm — on desktop
              (`sm:` and up), where they sit side by side (roughly half
              width each) and read fine at that height.
              On mobile they're full-width and stacked, so the same 48px
              height reads as a thin flat strip against that much width —
              bumped to h-16/text-base there so the touch target actually
              looks as substantial as it is. */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleAddToCart}
              className="flex h-16 sm:h-12 flex-1 items-center justify-center whitespace-nowrap rounded-xl bg-brand px-6 sm:px-4 text-base sm:text-sm font-semibold text-charcoal shadow-glow transition hover:bg-brand-light active:scale-[0.98]"
            >
              Add to Cart
            </button>
            <button
              onClick={handleInstantOrder}
              className="flex h-16 sm:h-12 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-brand bg-charcoal/40 px-6 sm:px-4 text-base sm:text-sm font-semibold text-brand backdrop-blur-sm transition hover:bg-brand/10 active:scale-[0.98]"
            >
              <WhatsAppIcon size={18} className="shrink-0" />
              Instant WhatsApp Order
            </button>
          </div>

          {/* Right at the moment of deciding to buy — this is where "is this
              actually genuine?" gets answered, not buried in the footer. */}
          <div className="mt-5">
            <TrustBadges />
          </div>

          {/* Nutrition table */}
          <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: "Protein", value: `${product.macros.protein}g` },
              { label: "Carbs", value: `${product.macros.carbs}g` },
              { label: "Fat", value: `${product.macros.fat}g` },
              { label: "Calories", value: `${product.macros.calories}` },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-xl border border-border bg-surface p-3 text-center"
              >
                <p className="text-lg font-bold text-brand">{m.value}</p>
                <p className="text-[11px] uppercase tracking-wide text-muted">{m.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted">
            Per serving — {product.macros.servingSize}
          </p>

          <p className="mt-6 text-sm leading-relaxed text-muted">{product.description}</p>

          {guide && GuideIcon && (
            <Link
              href={`/guides/${guide.slug}`}
              className="group mt-6 flex items-center gap-3 rounded-xl border border-border bg-surface p-3 transition hover:border-brand/60"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                <GuideIcon size={16} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-ink transition group-hover:text-brand">
                  Not sure how to use this?
                </span>
                <span className="block text-xs text-muted">{guide.title}</span>
              </span>
              <ArrowRight
                size={16}
                className="shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-brand"
              />
            </Link>
          )}

          {/* Feels like a nutrition consult, not a sales pitch — for the
              question a guide can't answer (allergies, stacking with what
              they already take, whether this is even the right product). */}
          <a
            href={buildWhatsAppLink(buildProductQuestionMessage(product))}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-3 flex items-center gap-3 rounded-xl border border-border bg-surface p-3 transition hover:border-brand/60"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
              <WhatsAppIcon size={16} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-ink transition group-hover:text-brand">
                Not sure if this is right for you?
              </span>
              <span className="block text-xs text-muted">
                Ask us on WhatsApp — we&apos;ll help you pick.
              </span>
            </span>
            <ArrowRight
              size={16}
              className="shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-brand"
            />
          </a>
        </div>
      </div>

      {/* How it's used — only shows up when this product actually has a guide */}
      {relatedVideos.length > 0 && (
        <div className="mt-12">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-lg tracking-wide text-ink sm:text-xl">
              HOW TO USE THIS
            </h2>
            <Link
              href="/videos"
              className="text-xs font-semibold text-brand transition hover:text-brand-light"
            >
              See all videos
            </Link>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {relatedVideos.map((v) => (
              <Link
                key={v.id}
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex gap-3 rounded-xl border border-border bg-surface p-2.5 transition hover:border-brand/60"
              >
                <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-lg bg-charcoal sm:w-40">
                  <VideoPlaceholder title={v.title} seed={v.id} />
                </div>
                <div className="flex min-w-0 flex-col justify-center">
                  <p className="line-clamp-2 text-sm font-semibold leading-snug text-ink transition group-hover:text-brand">
                    {v.title}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                    <YouTubeIcon size={12} />
                    {v.category}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
