import { Lock } from "lucide-react";

/**
 * Staff dashboard — stub only.
 *
 * Not linked from anywhere a customer would find it (no nav entry, no
 * footer link). There's no real backend yet (see ARCHITECTURE.md §8) and no
 * confirmed hosting/auth choice, so this deliberately isn't wired to fake
 * data or a fake login — it exists to reserve the route and describe what
 * lands here once Customer + Order records (lib/types.ts) are real.
 *
 * `noindex` since this is a staff URL, not a page for search engines.
 */
export const metadata = {
  title: "Staff Dashboard — Supplement World Zambia",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
        <Lock size={24} />
      </span>
      <h1 className="mt-5 font-display text-3xl tracking-wide text-ink">
        STAFF DASHBOARD
      </h1>
      <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-brand">
        Coming soon
      </p>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
        Once orders are captured by a real backend, this page will show
        customers, order history and purchase stats, and let staff trigger
        marketing email sends — see ARCHITECTURE.md §8 for the planned
        shape.
      </p>
      <p className="mt-4 max-w-md text-xs leading-relaxed text-muted">
        This route isn&apos;t linked from the storefront and has no real
        authentication yet — it&apos;s a placeholder for the URL, not a
        working dashboard. Real staff login goes in before any customer data
        is ever wired up here.
      </p>
    </div>
  );
}
