import { Phone, Mail, MapPin, Star, Users, Store } from "lucide-react";
import {
  WhatsAppIcon,
  MessengerIcon,
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  type BrandIconProps,
} from "@/components/icons/BrandIcons";
import {
  CONTACT,
  SERVICE_AREAS,
  SOCIAL_PROOF,
  TAGLINE,
  STORES,
  activeSocialLinks,
} from "@/lib/contact";
import { buildInquiryMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import TrustBadges from "@/components/TrustBadges";

const SOCIAL_ICONS: Record<string, (p: BrandIconProps) => JSX.Element> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  messenger: MessengerIcon,
};

export default function Footer() {
  return (
    // extra bottom padding on mobile clears the sticky action bar (§3c)
    <footer className="mt-16 border-t border-border bg-surface pb-28 sm:pb-8">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand + real review data (§4a.4 — only shown because it's genuine) */}
          <div>
            <span className="font-display text-2xl tracking-wide text-ink">
              SUPPLEMENT<span className="text-brand">WORLD</span>
            </span>
            <p className="mt-1 text-xs uppercase tracking-widest text-muted">
              Zambia
            </p>
            <p className="mt-3 text-sm text-muted">{TAGLINE.bio}</p>

            {/* Real page stats — no invented figures (§4a.4) */}
            <ul className="mt-4 flex flex-col gap-2">
              <li className="flex items-center gap-2 text-sm text-muted">
                <Star size={15} className="shrink-0 text-brand" />
                <span>
                  <strong className="text-brand">
                    {SOCIAL_PROOF.recommendPercent}%
                  </strong>{" "}
                  recommend us ({SOCIAL_PROOF.reviewCount} reviews)
                </span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted">
                <Users size={15} className="shrink-0 text-brand" />
                <span>
                  <strong className="text-brand">
                    {SOCIAL_PROOF.followersLabel}
                  </strong>{" "}
                  followers ·{" "}
                  <strong className="text-brand">
                    {SOCIAL_PROOF.viewsLabel}
                  </strong>{" "}
                  reel views
                </span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-ink">
              Contact
            </h2>
            <ul className="mt-4 flex flex-col gap-1">
              <li>
                <a
                  href={buildWhatsAppLink(buildInquiryMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-12 items-center gap-3 text-sm text-muted transition hover:text-brand"
                >
                  <WhatsAppIcon size={16} className="shrink-0 text-brand" />
                  WhatsApp — order or ask
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT.phoneE164}`}
                  className="flex min-h-12 items-center gap-3 text-sm text-muted transition hover:text-brand"
                >
                  <Phone size={16} className="shrink-0 text-brand" />
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="flex min-h-12 items-center gap-3 text-sm text-muted transition hover:text-brand"
                >
                  <Mail size={16} className="shrink-0 text-brand" />
                  <span className="break-all">{CONTACT.email}</span>
                </a>
              </li>
              <li className="flex min-h-12 items-center gap-3 text-sm text-muted">
                {/* No m.me handle available yet — shown as plain text, not a link */}
                <MessengerIcon size={16} className="shrink-0 text-brand" />
                Messenger: {CONTACT.messengerName}
              </li>
            </ul>
          </div>

          {/* Delivery coverage — the same list that should feed the cart's
              location dropdown (§5a) once that replaces the free-text field. */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-ink">
              We deliver to
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {SERVICE_AREAS.map((area) => (
                <li
                  key={area}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-charcoal/60 px-2.5 py-1.5 text-xs text-muted"
                >
                  <MapPin size={12} className="shrink-0 text-brand" />
                  {area.replace(" Province", "")}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted">
              Not listed? Message us — we&apos;ll confirm what we can arrange.
            </p>
            <a
              href="/#stores"
              className="mt-2 flex min-h-12 items-center gap-1 text-xs font-semibold text-brand transition hover:text-brand-light"
            >
              <Store size={13} />
              Or visit one of our {STORES.length} branches
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <TrustBadges variant="compact" />
        </div>

        {/* Renders nothing until real URLs land in SOCIAL_LINKS — no dead links */}
        {activeSocialLinks().length > 0 && (
          <div className="mt-10 border-t border-border pt-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-ink">
              Follow us
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {activeSocialLinks().map(({ key, label, url }) => {
                const Icon = SOCIAL_ICONS[key];
                return (
                  <li key={key}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Supplement World Zambia on ${label}`}
                      title={label}
                      className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-charcoal/60 text-muted transition hover:border-brand hover:text-brand"
                    >
                      <Icon size={18} />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <p className="mt-10 border-t border-border pt-6 text-xs text-muted">
          © {new Date().getFullYear()} Supplement World Zambia. Prices in ZMW.
          Orders confirmed over WhatsApp.
        </p>
      </div>
    </footer>
  );
}
