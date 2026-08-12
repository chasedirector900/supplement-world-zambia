import { MapPin, Store as StoreIcon, ArrowUpRight } from "lucide-react";
import { STORES, storesByCity, mapsSearchUrl } from "@/lib/contact";

/**
 * Physical branches.
 *
 * Placed directly under the catalog because it answers the question a Zambian
 * supplement buyer actually has at that moment — "are these people real, and is
 * the stock genuine?". Ten walk-in stores answer it more convincingly than any
 * trust badge, and it gives customers who'd rather not order online a route in.
 *
 * Each branch links to a Google Maps *search* (not a pinned coordinate) so it
 * stays correct without us holding exact coordinates we can't verify.
 *
 * Background art: drop a generated image at `public/store-locator-bg.jpg` (see
 * the prompt in FEATURES.md) and it picks it up automatically — plain CSS
 * `background-image`, not next/image, so a missing file just falls back to the
 * charcoal background instead of rendering a broken-image icon.
 *
 * Desktop-only (`hidden md:block`) — at mobile card widths the background art
 * and the multi-branch Lusaka card don't have room to breathe, and this isn't
 * the section carrying the weight on mobile anyway: the sticky WhatsApp bar
 * and Maps links elsewhere already cover "can I trust/reach this shop".
 */
export default function StoreLocator() {
  const cities = storesByCity();

  return (
    <section
      id="stores"
      className="relative hidden overflow-hidden border-t border-border md:block"
    >
      <div
        className="absolute inset-0 bg-cover bg-center [filter:saturate(1.3)_brightness(1.15)]"
        style={{ backgroundImage: "url(/store-locator-bg.jpg)" }}
        aria-hidden
      />
      {/* Fades only at the top/bottom seams so the map glow stays visible in
          the middle, instead of a flat wash that buries it (matches the
          hero's scrim treatment). */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-charcoal to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-charcoal to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-baseline gap-3">
          <h2 className="font-display text-2xl tracking-wide text-ink sm:text-3xl">
            FIND US IN STORE
          </h2>
        </div>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Walk in, check the seal yourself, and take it home the same day —
          across {cities.length} cities. Prefer delivery? Order on WhatsApp and
          we&apos;ll send it out.
        </p>

        <ul className="mt-8 grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map(({ city, stores }) => (
            <li
              key={city}
              className="group/card relative overflow-hidden rounded-2xl border border-border bg-surface/80 p-4 shadow-card backdrop-blur-sm transition hover:border-brand/50"
            >
              <StoreIcon
                size={88}
                strokeWidth={1}
                className="pointer-events-none absolute -bottom-4 -right-4 text-brand/[0.06] transition group-hover/card:text-brand/10"
                aria-hidden
              />

              <div className="relative flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/10">
                  <StoreIcon size={14} className="text-brand" />
                </span>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-ink">
                  {city}
                </h3>
                <span className="ml-auto rounded-full bg-charcoal px-2 py-0.5 text-[11px] text-muted">
                  {stores.length > 1 ? `${stores.length} branches` : "1 branch"}
                </span>
              </div>

              <ul className="relative mt-2">
                {stores.map((store) => (
                  <li key={store.name}>
                    <a
                      href={mapsSearchUrl(store)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex min-h-12 items-center gap-2 rounded-lg text-sm text-muted transition hover:text-brand"
                    >
                      <MapPin size={13} className="shrink-0 opacity-60" />
                      <span className="flex-1">
                        {store.name}
                        {store.address && (
                          <span className="block text-xs text-muted/70">
                            {store.address}
                          </span>
                        )}
                      </span>
                      <ArrowUpRight
                        size={14}
                        className="shrink-0 opacity-0 transition group-hover:opacity-100"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-xs text-muted">
          {STORES.length} branches nationwide · tap any branch to open it in Maps
        </p>
      </div>
    </section>
  );
}
