import { CartLine, Product } from "@/lib/types";
import { CONTACT } from "@/lib/contact";

// Orders go to the shop's real WhatsApp line — see lib/contact.ts
export const ORDER_WHATSAPP_NUMBER = CONTACT.whatsappNumber;

export type PaymentPreference = "on_delivery" | "pay_online";

export const PAYMENT_LABELS: Record<PaymentPreference, string> = {
  on_delivery: "Cash / Mobile Money — on delivery or pickup",
  pay_online: "Card / Mobile Money — pay online now (Flutterwave)",
};

export interface CustomerLocation {
  name: string;
  phone: string;
  email: string;
  area: string; // e.g. "Woodlands, Lusaka" (province)
  address: string; // street address / landmark for delivery
  payment: PaymentPreference;
  /**
   * Flutterwave's transaction reference, set only once the online payment
   * actually succeeded. Order confirmation still goes over WhatsApp either
   * way — Flutterwave tells the shop money arrived, not *what* was ordered,
   * so this is the record staff work from either way.
   */
  paymentRef?: string;
  notes?: string;
}

/**
 * Builds the order message. `customer` is optional: the cart drawer collects
 * name/phone/area before sending, but the mobile bottom bar's express path
 * (§3c) fires straight to WhatsApp with just the items — staff collect the
 * delivery details in the chat that follows.
 */
export function buildWhatsAppMessage(
  lines: CartLine[],
  products: Product[],
  customer?: CustomerLocation
): string {
  const rows = lines.map((line) => {
    const product = products.find((p) => p.id === line.productId);
    if (!product) return "";
    const subtotal = product.priceZMW * line.quantity;
    return `• ${product.name} (${product.flavor}, ${line.size}) x${line.quantity} — ZMW ${subtotal.toFixed(2)}`;
  });

  const total = lines.reduce((sum, line) => {
    const product = products.find((p) => p.id === line.productId);
    return sum + (product ? product.priceZMW * line.quantity : 0);
  }, 0);

  const message = [
    `Hi Supplement World Zambia! I'd like to place an order:`,
    ``,
    ...rows,
    ``,
    `Total: ZMW ${total.toFixed(2)}`,
    ...(customer
      ? [
          ``,
          `Name: ${customer.name}`,
          `Phone: ${customer.phone}`,
          `Delivery area: ${customer.area}`,
          `Address: ${customer.address}`,
          customer.paymentRef
            ? `Payment: ✅ Paid online via Flutterwave — Ref ${customer.paymentRef}`
            : `Payment: ${PAYMENT_LABELS[customer.payment]}`,
          customer.notes ? `Notes: ${customer.notes}` : undefined,
        ]
      : []),
  ]
    .filter((line) => line !== undefined)
    .join("\n");

  return message;
}

/**
 * Opening line for someone who taps "Order on WhatsApp" with an empty cart —
 * the "just talk to us" traffic that doesn't want to browse (§3b, §3c).
 */
export function buildInquiryMessage(): string {
  return `Hi Supplement World Zambia! I'd like to ask about your products.`;
}

/**
 * Opening line for "Not sure if this is right for you? Ask on WhatsApp" on
 * the PDP (§ feature 7). Names the product so staff have context immediately,
 * then trails off with a space rather than a period — reads as a real
 * question started, not a finished statement, and puts the cursor right
 * where the customer should keep typing.
 */
export function buildProductQuestionMessage(product: Product): string {
  return `Hi Supplement World Zambia! I have a question about ${product.name} (${product.flavor}) — `;
}

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${ORDER_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
