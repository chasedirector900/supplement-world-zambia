"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/BrandIcons";
import { products, goals } from "@/data/products";
import { bundles } from "@/data/bundles";
import { Goal } from "@/lib/types";
import GoalFilter from "@/components/GoalFilter";
import BestSellers from "@/components/BestSellers";
import BundleCard from "@/components/BundleCard";
import ProductCard from "@/components/ProductCard";
import StoreLocator from "@/components/StoreLocator";
import Testimonials from "@/components/Testimonials";
import { buildInquiryMessage, buildWhatsAppLink } from "@/lib/whatsapp";

export default function Home() {
  const [activeGoal, setActiveGoal] = useState<Goal | "All">("All");

  const openInquiry = () => {
    window.open(
      buildWhatsAppLink(buildInquiryMessage()),
      "_blank",
      "noopener,noreferrer"
    );
  };

  const filtered = useMemo(() => {
    if (activeGoal === "All") return products;
    return products.filter((p) => p.goals.includes(activeGoal));
  }, [activeGoal]);

  // the homepage is a shop window, not the catalog — the full set lives at /shop
  const featured = useMemo(() => filtered.slice(0, 8), [filtered]);

  const activeBundle =
    activeGoal === "All" ? null : bundles.find((b) => b.goal === activeGoal) ?? null;

  return (
    <>
      {/*
        Full-bleed hero. The photograph already has deep negative space on its
        left and green rim light that matches the brand, so it's treated as a
        backdrop the copy sits inside rather than a picture placed next to text.

        Three scrims do the blending:
          1. horizontal — solid charcoal behind the copy, clearing toward the
             athlete so he's never veiled
          2. bottom — melts the photo into the page so there's no cut-off edge
          3. top — keeps the sticky nav from colliding with the bright areas
      */}
      {/* The left-column layout only holds once the viewport is wide enough to
          push the athlete clear of the copy — below `lg` the cover-crop drags
          him back under the text, so the bottom-band treatment runs until then. */}
      <section className="relative isolate flex min-h-[560px] items-end overflow-hidden lg:min-h-[620px] lg:items-center">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/hero-athlete.png"
            alt="USN Hyperbolic Mass, whey protein and creatine beside an athlete in a gym"
            fill
            priority
            sizes="100vw"
            /* mobile favours the athlete's upper body, which sits above the
               copy; desktop recentres so the product tubs come into frame */
            className="object-cover object-[68%_22%] lg:object-[60%_center]"
          />

          {/* Mobile: copy sits in a near-solid band at the bottom, so the
              athlete stays clear above it instead of being veiled all over.
              Explicit stops keep the scrim opaque across the whole text block
              (measured: everything clears WCAG AA) then drop away fast so the
              top of the frame reads as photograph, not fog. */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal from-40% via-charcoal/90 via-70% to-charcoal/5 lg:hidden" />
          {/* Desktop: copy sits left, so the scrim clears toward the athlete. */}
          <div className="hidden lg:absolute lg:inset-0 lg:block lg:bg-gradient-to-r lg:from-charcoal lg:via-charcoal/75 lg:to-transparent" />

          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-charcoal via-charcoal/70 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-charcoal/90 to-transparent" />
        </div>

        <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-24 lg:py-24">
          <p className="text-xs uppercase tracking-[0.2em] text-brand">
            Lusaka&apos;s Supplement Store
          </p>
          {/* The shop's own motto, styled the way it reads on their page:
              first line white, payoff line in brand green. */}
          <h1 className="mt-2 max-w-xl font-display text-5xl leading-[0.95] tracking-wide text-ink drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)] sm:text-7xl">
            FITNESS NEEDS
            <br />
            <span className="text-brand">IN ONE PLACE.</span>
          </h1>
          <p className="mt-4 max-w-md text-sm text-muted sm:text-base">
            Filter by the goal you&apos;re actually training for — every product
            shows the protein and fat that matters, and every order goes
            straight to our WhatsApp.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="#catalog"
              className="flex h-12 items-center justify-center rounded-xl bg-brand px-6 text-sm font-semibold text-charcoal shadow-glow transition hover:bg-brand-light active:scale-[0.98] sm:w-auto"
            >
              Browse Catalog
            </a>
            <button
              onClick={openInquiry}
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-brand bg-charcoal/40 px-6 text-sm font-semibold text-brand backdrop-blur-sm transition hover:bg-brand/10 active:scale-[0.98] sm:w-auto"
            >
              <WhatsAppIcon size={18} />
              Order via WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* Right after the hero, before someone starts browsing on their own —
          "here's what people actually buy" as an immediate trust anchor. */}
      <BestSellers />

      <div className="mx-auto max-w-6xl px-4 pb-8">
        <section
          id="catalog"
          className="sticky top-[var(--header-h)] z-20 -mx-4 bg-charcoal/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:bg-transparent sm:px-0 sm:py-4 sm:backdrop-blur-0"
        >
          <GoalFilter goals={goals} active={activeGoal} onChange={setActiveGoal} />
        </section>

        {/* Everything for the selected goal, one tap — only shows up once a
            specific goal is picked, not on "All". */}
        {activeBundle && (
          <div className="mt-6">
            <BundleCard bundle={activeBundle} />
          </div>
        )}

        <div className="mt-6 flex items-baseline justify-between gap-4">
          <h2 className="font-display text-xl tracking-wide text-ink sm:text-2xl">
            {activeGoal === "All" ? "TOP PICKS FOR YOU" : activeGoal.toUpperCase()}
          </h2>
          {/* carries the active goal into the shop so the context survives */}
          <Link
            href={
              activeGoal === "All"
                ? "/shop"
                : `/shop?goal=${encodeURIComponent(activeGoal)}`
            }
            className="flex h-12 shrink-0 items-center gap-1 text-sm font-semibold text-brand transition hover:text-brand-light"
          >
            See all
            <ArrowRight size={16} />
          </Link>
        </div>

        <section className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>

        {filtered.length > featured.length && (
          <div className="mt-6 flex justify-center">
            <Link
              href={
                activeGoal === "All"
                  ? "/shop"
                  : `/shop?goal=${encodeURIComponent(activeGoal)}`
              }
              className="flex h-12 items-center gap-2 rounded-xl border border-border bg-surface px-6 text-sm font-semibold text-ink transition hover:border-brand"
            >
              Browse the full range
              <ArrowRight size={16} className="text-brand" />
            </Link>
          </div>
        )}

        {filtered.length === 0 && (
          <p className="mt-12 text-center text-sm text-muted">
            No products match that goal yet — check back soon.
          </p>
        )}
      </div>

      {/* Sits right after the catalog: the buyer's next question after "what do
          they sell" is "did this actually work for someone like me". */}
      <Testimonials />

      {/* Then: "are these people real and is the stock genuine". */}
      <StoreLocator />
    </>
  );
}
