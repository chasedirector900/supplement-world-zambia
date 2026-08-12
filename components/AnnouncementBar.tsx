"use client";

import { useEffect, useState } from "react";
import { X, Truck, ShieldCheck, Star, Users, Store } from "lucide-react";
import { CONTACT, SERVICE_AREAS, SOCIAL_PROOF, STORES } from "@/lib/contact";

const MESSAGES = [
  {
    Icon: Truck,
    text: `Delivery across ${SERVICE_AREAS.length} provinces`,
  },
  {
    Icon: ShieldCheck,
    text: "100% genuine USN stock — authenticity guaranteed",
  },
  {
    Icon: Star,
    text: `${SOCIAL_PROOF.recommendPercent}% recommend us (${SOCIAL_PROOF.reviewCount} reviews)`,
  },
  {
    Icon: Users,
    text: `Trusted by ${SOCIAL_PROOF.followersLabel} followers`,
  },
  {
    Icon: Store,
    text: `${STORES.length} walk-in branches — or we deliver`,
  },
];

const DISMISS_KEY = "swz-announcement-dismissed";

/**
 * Thin strip above the nav (§3a). Rotates trust messages, dismissible for the
 * session. Deliberately NOT sticky — it scrolls away, so the sticky nav keeps
 * its --header-h and the goal filter stays anchored correctly beneath it.
 */
export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  // starts hidden and reveals after the sessionStorage check, so server and
  // client render the same thing on first paint
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY) !== "1") setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // don't auto-rotate for users who opted out of motion
    const id = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 4000);
    return () => clearInterval(id);
  }, [visible]);

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  const { Icon, text } = MESSAGES[index];

  return (
    <div className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2">
        <p
          key={index}
          className="flex min-w-0 flex-1 animate-fadeIn items-center justify-center gap-2 text-center text-[11px] text-brand sm:text-xs"
        >
          <Icon size={13} className="shrink-0" />
          <span className="truncate">{text}</span>
        </p>

        <a
          href={`tel:${CONTACT.phoneE164}`}
          className="hidden shrink-0 text-xs text-muted transition hover:text-ink sm:block"
        >
          {CONTACT.phoneDisplay}
        </a>

        <button
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="relative shrink-0 text-muted transition hover:text-ink before:absolute before:-inset-[17px] before:content-['']"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
