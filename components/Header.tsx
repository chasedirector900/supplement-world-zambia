"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/BrandIcons";
import { useCartStore } from "@/lib/store";
import { CONTACT } from "@/lib/contact";
import { buildInquiryMessage, buildWhatsAppLink } from "@/lib/whatsapp";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/videos", label: "Videos" },
  { href: "/guides", label: "Guides" },
];

export default function Header() {
  const { lines, open } = useCartStore();
  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
  const pathname = usePathname();

  const navLink = (link: (typeof NAV_LINKS)[number]) => {
    const active =
      link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
    return (
      <Link
        key={link.href}
        href={link.href}
        className={`relative flex h-10 items-center px-4 text-sm font-medium transition ${
          active ? "text-brand" : "text-muted hover:text-ink"
        }`}
      >
        {link.label}
        {active && (
          <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand" />
        )}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-30 bg-charcoal/90 backdrop-blur border-b border-border">
      {/* md+: logo / nav / icons share one row via a 3-column grid, so the
          nav sits truly centred in the space that's otherwise empty on a
          wide viewport. Below md there isn't room for that, so the nav drops
          to its own row instead — that's the width most of this shop's
          traffic arrives at, coming from Instagram. */}
      <div className="mx-auto grid max-w-6xl grid-cols-2 items-center gap-3 px-4 py-4 md:grid-cols-[1fr_auto_1fr]">
        <Link href="/" className="flex h-12 items-center gap-2">
          <span className="font-display text-2xl tracking-wide text-ink">
            SUPPLEMENT<span className="text-brand">WORLD</span>
          </span>
          <span className="hidden sm:inline text-xs text-muted uppercase tracking-widest">
            Zambia
          </span>
        </Link>

        <nav className="hidden md:flex md:items-center md:justify-center md:gap-1">
          {NAV_LINKS.map(navLink)}
        </nav>

        <div className="flex items-center justify-self-end gap-2">
          {/* "just talk to us" traffic that doesn't want to browse (§3b) */}
          <a
            href={buildWhatsAppLink(buildInquiryMessage())}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Chat with us on WhatsApp, ${CONTACT.phoneDisplay}`}
            title={CONTACT.phoneDisplay}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface text-brand transition hover:border-brand hover:shadow-glow"
          >
            <WhatsAppIcon size={20} />
          </a>

          <button
            onClick={open}
            aria-label={`Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
            className="relative flex h-12 items-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm text-ink transition hover:border-brand hover:shadow-glow"
          >
            <ShoppingBag size={18} className="text-brand" />
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-xs font-semibold text-charcoal">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Below md: nav drops to its own row instead of sharing the logo row. */}
      <nav className="border-t border-border/60 md:hidden">
        <div className="mx-auto flex max-w-6xl justify-center gap-1 px-4">
          {NAV_LINKS.map(navLink)}
        </div>
      </nav>
    </header>
  );
}
