"use client";

import { useEffect, useState } from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { X, Minus, Plus, Trash2, Truck, Wallet, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { products } from "@/data/products";
import { SERVICE_AREAS } from "@/lib/contact";
import Select from "@/components/Select";
import ProductMedia from "@/components/ProductMedia";
import {
  buildWhatsAppLink,
  buildWhatsAppMessage,
  PAYMENT_LABELS,
  PaymentPreference,
} from "@/lib/whatsapp";
import {
  buildFlutterwaveConfig,
  cartTotal,
  generateTxRef,
  isFlutterwaveConfigured,
} from "@/lib/flutterwave";
import { isValidEmail, isValidPhone } from "@/lib/validation";

const PAYMENT_OPTIONS: { value: PaymentPreference; icon: typeof Truck }[] = [
  { value: "on_delivery", icon: Truck },
  { value: "pay_online", icon: Wallet },
];

export default function CartDrawer() {
  const { lines, isOpen, close, clear, updateQuantity, removeLine } = useCartStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState<PaymentPreference>("on_delivery");
  const [notes, setNotes] = useState("");
  const [txRef, setTxRef] = useState(generateTxRef);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const touch = (field: string) => setTouched((t) => ({ ...t, [field]: true }));

  const phoneError = phone.trim() && !isValidPhone(phone) ? "Enter a valid Zambian number, e.g. 0979003311" : null;
  const emailError = email.trim() && !isValidEmail(email) ? "Enter a valid email address" : null;

  // Fresh transaction reference every time the drawer opens for a new
  // checkout attempt — Flutterwave rejects a re-used tx_ref.
  useEffect(() => {
    if (isOpen) setTxRef(generateTxRef());
  }, [isOpen]);

  const detailedLines = lines
    .map((line) => ({
      line,
      product: products.find((p) => p.id === line.productId),
    }))
    .filter((l) => l.product);

  const total = cartTotal(lines, products);

  const canSend =
    detailedLines.length > 0 &&
    name.trim() &&
    phone.trim() &&
    isValidPhone(phone) &&
    area.trim() &&
    address.trim();

  const canPayOnline =
    canSend && email.trim() && isValidEmail(email) && isFlutterwaveConfigured;

  const sendOrder = (paymentRef?: string) => {
    const message = buildWhatsAppMessage(lines, products, {
      name,
      phone,
      email,
      area,
      address,
      payment,
      paymentRef,
      notes: notes.trim() || undefined,
    });
    window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
  };

  const handleSend = () => {
    if (!canSend) return;
    sendOrder();
  };

  const flutterwaveConfig = buildFlutterwaveConfig(
    lines,
    products,
    { name, email, phone },
    txRef
  );
  const handleFlutterPayment = useFlutterwave(flutterwaveConfig);

  const handlePayOnline = () => {
    if (!canPayOnline) return;
    handleFlutterPayment({
      callback: (response) => {
        closePaymentModal();
        if (response.status === "successful" || response.status === "completed") {
          sendOrder(response.flw_ref);
          clear();
          close();
        }
      },
      onClose: () => {},
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40">
      <button
        aria-label="Close cart"
        onClick={close}
        className="absolute inset-0 bg-black/60 animate-fadeIn"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-surface shadow-2xl animate-slideIn sm:border-l sm:border-border">
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <h2 className="font-display text-xl tracking-wide">Your Order</h2>
          <button
            onClick={close}
            aria-label="Close"
            className="flex h-12 w-12 items-center justify-center rounded-lg text-muted hover:text-ink"
          >
            <X size={22} />
          </button>
        </div>

        <div className="scrollbar-slim flex-1 overflow-y-auto px-4 py-4">
          {detailedLines.length === 0 ? (
            <p className="mt-8 text-center text-sm text-muted">
              Your cart is empty. Add a product to get started.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {detailedLines.map(({ line, product }) => (
                <li
                  key={`${line.productId}-${line.size}`}
                  className="flex gap-3 rounded-xl border border-border bg-charcoal/60 p-3"
                >
                  {/* Same artwork the customer tapped on the card (§5a) */}
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-charcoal">
                    <ProductMedia product={product!} sizes="56px" decorative />
                  </div>

                  {/* Two stacked rows rather than one long line: at 375px a
                      single row leaves ~90px for the name, and the stepper's
                      48px hit areas reach back over the price. */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">
                          {product!.name}
                        </p>
                        <p className="truncate text-xs text-muted">
                          {product!.flavor} · {line.size}
                        </p>
                      </div>
                      <button
                        onClick={() => removeLine(line.productId, line.size)}
                        aria-label={`Remove ${product!.name} from cart`}
                        className="-mr-2 -mt-2 flex h-12 w-12 shrink-0 items-center justify-center text-muted transition hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="mt-1 flex items-center justify-between gap-3">
                      <p className="text-sm font-bold text-brand">
                        ZMW {(product!.priceZMW * line.quantity).toFixed(2)}
                      </p>
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(line.productId, line.size, line.quantity - 1)
                          }
                          aria-label={`Decrease ${product!.name} quantity`}
                          className="relative flex h-7 w-7 items-center justify-center rounded-full border border-border text-ink transition hover:border-brand before:absolute before:-inset-2.5 before:content-['']"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-5 text-center text-sm tabular-nums">
                          {line.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(line.productId, line.size, line.quantity + 1)
                          }
                          aria-label={`Increase ${product!.name} quantity`}
                          className="relative flex h-7 w-7 items-center justify-center rounded-full border border-border text-ink transition hover:border-brand before:absolute before:-inset-2.5 before:content-['']"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {detailedLines.length > 0 && (
            <div className="mt-6 flex flex-col gap-3 border-t border-border pt-4">
              <p className="text-xs uppercase tracking-widest text-muted">
                Delivery details
              </p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="h-12 rounded-lg border border-border bg-charcoal px-3 text-base text-ink placeholder:text-muted focus:border-brand sm:text-sm"
              />
              <div>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => touch("phone")}
                  type="tel"
                  inputMode="tel"
                  placeholder="Phone number, e.g. 0979003311"
                  aria-invalid={touched.phone && !!phoneError}
                  className={`h-12 w-full rounded-lg border bg-charcoal px-3 text-base text-ink placeholder:text-muted focus:border-brand sm:text-sm ${
                    touched.phone && phoneError ? "border-red-500/70" : "border-border"
                  }`}
                />
                {touched.phone && phoneError && (
                  <p className="mt-1 text-xs text-red-400">{phoneError}</p>
                )}
              </div>
              {/* Optional for a WhatsApp order — only required to unlock "Pay
                  online now" below. Captured either way for a future
                  customer record (lib/types.ts's Customer), not sent in the
                  WhatsApp message itself. */}
              <div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => touch("email")}
                  type="email"
                  inputMode="email"
                  placeholder="Email (optional — needed to pay online)"
                  aria-invalid={touched.email && !!emailError}
                  className={`h-12 w-full rounded-lg border bg-charcoal px-3 text-base text-ink placeholder:text-muted focus:border-brand sm:text-sm ${
                    touched.email && emailError ? "border-red-500/70" : "border-border"
                  }`}
                />
                {touched.email && emailError && (
                  <p className="mt-1 text-xs text-red-400">{emailError}</p>
                )}
              </div>
              {/* Structured province (§5a) so delivery-fee logic can hook in
                  later; the actual street address is its own field below. */}
              <Select
                value={area}
                onChange={setArea}
                options={SERVICE_AREAS}
                placeholder="Select your province"
                label="Delivery province"
              />
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address / landmark"
                className="h-12 rounded-lg border border-border bg-charcoal px-3 text-base text-ink placeholder:text-muted focus:border-brand sm:text-sm"
              />

              <div className="mt-2">
                <p className="text-xs uppercase tracking-widest text-muted">
                  How would you like to pay?
                </p>
                <div className="mt-2 flex flex-col gap-2">
                  {PAYMENT_OPTIONS.map(({ value, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setPayment(value)}
                      className={`flex items-center gap-3 rounded-lg border px-3 py-3 text-left text-sm transition ${
                        payment === value
                          ? "border-brand bg-brand/10 text-ink"
                          : "border-border text-muted hover:border-brand/60"
                      }`}
                    >
                      <Icon
                        size={18}
                        className={payment === value ? "text-brand" : "text-muted"}
                      />
                      <span className="flex-1">{PAYMENT_LABELS[value]}</span>
                      <span
                        className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                          payment === value
                            ? "border-brand bg-brand"
                            : "border-border bg-transparent"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {payment === "pay_online" && (
                  <p className="mt-2 flex items-start gap-1.5 text-xs text-muted">
                    <ShieldCheck size={14} className="mt-0.5 shrink-0 text-brand" />
                    {isFlutterwaveConfigured
                      ? "You'll pay securely through Flutterwave — card details are entered on their checkout, never stored on this site."
                      : "Online payment isn't connected yet — pick this and we'll follow up with a payment link on WhatsApp instead."}
                  </p>
                )}
              </div>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything else we should know? (optional)"
                rows={2}
                className="rounded-lg border border-border bg-charcoal px-3 py-3 text-base text-ink placeholder:text-muted focus:border-brand sm:text-sm"
              />
            </div>
          )}
        </div>

        {detailedLines.length > 0 && (
          <div className="border-t border-border px-4 py-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-muted">Total</span>
              <span className="text-lg font-bold text-ink">
                ZMW {total.toFixed(2)}
              </span>
            </div>
            {payment === "pay_online" && isFlutterwaveConfigured ? (
              <>
                <button
                  onClick={handlePayOnline}
                  disabled={!canPayOnline}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-charcoal transition hover:bg-brand-light active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
                >
                  <ShieldCheck size={16} />
                  Pay ZMW {total.toFixed(2)} with Flutterwave
                </button>
                {!canPayOnline && (
                  <p className="mt-2 text-center text-xs text-muted">
                    Add your name, phone, email, delivery area and address to continue.
                  </p>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={handleSend}
                  disabled={!canSend}
                  className="flex h-12 w-full items-center justify-center rounded-xl bg-brand text-sm font-semibold text-charcoal transition hover:bg-brand-light active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
                >
                  Send Order on WhatsApp
                </button>
                {!canSend && (
                  <p className="mt-2 text-center text-xs text-muted">
                    Add your name, phone, delivery area and address to continue.
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
