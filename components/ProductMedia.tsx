import Image from "next/image";
import { Product } from "@/lib/types";
import ProductPlaceholder from "@/components/ProductPlaceholder";

interface ProductMediaProps {
  product: Product;
  /** next/image `sizes` hint — set it per usage so the right file is fetched */
  sizes: string;
  /** Decorative in contexts where the name is already adjacent (cart rows) */
  decorative?: boolean;
  /**
   * Show this specific photo instead of `product.images[0]` — the PDP
   * gallery uses this to swap the main image when a thumbnail is picked,
   * without duplicating the "real photo vs. placeholder" fallback logic.
   */
  src?: string;
}

/**
 * Real photo when the product has one, generated placeholder when it doesn't.
 *
 * Shared so the grid card and the cart row can never drift apart — a product
 * must look the same in the cart as it did on the card the customer tapped.
 * Fills its container; the caller owns size, aspect ratio and rounding.
 */
export default function ProductMedia({
  product,
  sizes,
  decorative = false,
  src,
}: ProductMediaProps) {
  const photo = src ?? product.images?.[0];

  if (photo) {
    return (
      <Image
        src={photo}
        alt={decorative ? "" : `${product.name} — ${product.flavor}`}
        fill
        sizes={sizes}
        className="object-cover"
      />
    );
  }

  return (
    <ProductPlaceholder
      name={product.name}
      seed={product.id}
      brand={product.brand}
      decorative={decorative}
    />
  );
}
