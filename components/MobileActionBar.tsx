"use client";

import { ShoppingBag } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/BrandIcons";
import { useCartStore } from "@/lib/store";
import { products } from "@/data/products";
import {
  buildInquiryMessage,
  buildWhatsAppLink,
  buildWhatsAppMessage,
} from "@/lib/whatsapp";

/**
 * Sticky bottom action bar — mobile only (§3c). Keeps Cart and "Order on
 * WhatsApp" inside thumb reach at all times, which the spec calls the
 * highest-leverage mobile decision given traffic arrives from Instagram.
 * Hidden while the drawer is open so it doesn't sit on top of the overlay.
 */
export default function MobileActionBar() {
  const { lines, isOpen, open } = useCartStore();
  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);

  const handleWhatsApp = () => {
    // Express path: whatever is in the cart goes straight to WhatsApp with no
    // form. Empty cart opens a blank inquiry instead.
    const message =
      lines.length > 0
        ? buildWhatsAppMessage(lines, products)
        : buildInquiryMessage();
    window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
  };

  if (isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-charcoal/95 backdrop-blur pb-[env(safe-area-inset-bottom)] sm:hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          onClick={open}
          aria-label={`Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
          className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-ink transition active:scale-95"
        >
          <ShoppingBag size={20} className="text-brand" />
          {itemCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-xs font-semibold text-charcoal">
              {itemCount}
            </span>
          )}
        </button>

        <button
          onClick={handleWhatsApp}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-charcoal transition active:scale-[0.98] hover:bg-brand-light"
        >
          <WhatsAppIcon size={18} />
          {itemCount > 0 ? "Order on WhatsApp" : "Chat on WhatsApp"}
        </button>
      </div>
    </div>
  );
}
