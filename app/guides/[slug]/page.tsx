import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { guides } from "@/data/guides";
import { products } from "@/data/products";
import { GUIDE_ICON } from "@/lib/guideIcons";
import ProductCard from "@/components/ProductCard";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const guide = guides.find((g) => g.slug === params.slug);
  if (!guide) return {};
  return {
    title: `${guide.title} | Supplement World Zambia`,
    description: guide.summary,
  };
}

export default function GuideDetailPage({ params }: { params: { slug: string } }) {
  const guide = guides.find((g) => g.slug === params.slug);
  if (!guide) notFound();

  const Icon = GUIDE_ICON[guide.category];
  const categoryProducts = products.filter((p) => p.category === guide.category);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16">
      <div className="flex items-center gap-3 pt-6">
        <Link
          href="/guides"
          className="flex h-12 items-center gap-2 text-sm text-muted transition hover:text-ink"
        >
          <ArrowLeft size={16} />
          Guides
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
          <Icon size={22} />
        </span>
        <div>
          <h1 className="font-display text-2xl tracking-wide text-ink sm:text-3xl">
            {guide.title}
          </h1>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted">{guide.summary}</p>

      <div className="mt-8 flex flex-col gap-6">
        {guide.sections.map((section) => (
          <div key={section.heading}>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-brand">
              {section.heading}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{section.body}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 rounded-xl border border-border bg-surface p-3 text-xs text-muted">
        General guidance only — always follow the dosage on your product&apos;s
        own label, and check with a doctor first if you&apos;re pregnant,
        on medication, or managing a health condition.
      </p>

      {categoryProducts.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-lg tracking-wide text-ink sm:text-xl">
            SHOP {guide.category.toUpperCase()}
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
