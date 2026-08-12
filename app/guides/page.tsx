import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { guides } from "@/data/guides";
import { products } from "@/data/products";
import { GUIDE_ICON } from "@/lib/guideIcons";

export const metadata = {
  title: "Usage Guides — Supplement World Zambia",
};

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-12">
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
        USAGE GUIDES
      </h1>
      <p className="mt-1 text-sm text-muted">
        How to actually take what you bought — dosage, timing and tips for
        every category we stock.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {guides.map((guide) => {
          const Icon = GUIDE_ICON[guide.category];
          const count = products.filter((p) => p.category === guide.category).length;
          return (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 shadow-card transition hover:border-brand/60"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Icon size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-ink transition group-hover:text-brand">
                  {guide.title}
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-muted">{guide.summary}</p>
                <p className="mt-2 text-[11px] text-muted">
                  {count} product{count === 1 ? "" : "s"} in this category
                </p>
              </div>
              <ArrowRight
                size={16}
                className="mt-1 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-brand"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
