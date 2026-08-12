import { FlutterWaveTypes } from "flutterwave-react-v3";
import { CartLine, Product } from "@/lib/types";

/**
 * Public key only — Flutterwave's public keys are designed to be exposed
 * client-side (they can only *start* a checkout, never move money or read
 * account data on their own). The secret key that verifies a transaction
 * server-side stays out of this repo entirely; that's Phase 2/Django's job.
 *
 * Unset in this build on purpose — the client hasn't created a Flutterwave
 * merchant account yet. Set NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY in .env.local
 * (test key while building, live key at go-live) and the "Pay online" button
 * lights up with no other code changes.
 */
export const FLUTTERWAVE_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY ?? "";

export const isFlutterwaveConfigured = FLUTTERWAVE_PUBLIC_KEY.length > 0;

export interface FlutterwaveCustomer {
  name: string;
  email: string;
  phone: string;
}

/** Unique per attempt — Flutterwave requires this and rejects re-used refs. */
export function generateTxRef(): string {
  return `SWZ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export function cartTotal(lines: CartLine[], products: Product[]): number {
  return lines.reduce((sum, line) => {
    const product = products.find((p) => p.id === line.productId);
    return sum + (product ? product.priceZMW * line.quantity : 0);
  }, 0);
}

export function buildFlutterwaveConfig(
  lines: CartLine[],
  products: Product[],
  customer: FlutterwaveCustomer,
  txRef: string
): FlutterWaveTypes.FlutterwaveConfig {
  return {
    public_key: FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: txRef,
    amount: cartTotal(lines, products),
    // Flutterwave supports ZMW for merchants onboarded in Zambia — confirm
    // this is enabled on the client's account before go-live.
    currency: "ZMW",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: customer.email,
      phone_number: customer.phone,
      name: customer.name,
    },
    customizations: {
      title: "Supplement World Zambia",
      description: "Order payment",
      logo: "",
    },
  };
}
