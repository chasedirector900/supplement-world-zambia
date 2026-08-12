import { TRUST_POINTS } from "@/lib/trust";

/**
 * "full" — 2x2 grid with icon, label and the one-line detail, used at the
 * moment someone's about to buy (the PDP, right under the order buttons —
 * exactly where "is this actually genuine?" gets decided).
 *
 * "compact" — icon + label only, wraps into a single row, used sitewide in
 * the footer as a persistent reminder rather than a hard sell.
 */
export default function TrustBadges({
  variant = "full",
}: {
  variant?: "full" | "compact";
}) {
  if (variant === "compact") {
    return (
      <ul className="flex flex-wrap gap-x-5 gap-y-2">
        {TRUST_POINTS.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-1.5 text-xs text-muted">
            <Icon size={14} className="shrink-0 text-brand" />
            {label}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {TRUST_POINTS.map(({ icon: Icon, label, detail }) => (
        <div
          key={label}
          className="flex items-start gap-2.5 rounded-xl border border-border bg-surface p-3"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
            <Icon size={15} />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-ink">{label}</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-muted">{detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
