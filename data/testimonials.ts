import { Testimonial } from "@/lib/types";

/**
 * Placeholder "Real Results" content — shaped exactly like the Django
 * `/api/testimonials/` response will be once Phase 2 lands (ARCHITECTURE.md
 * §8), so swapping this array for a fetch is a one-line change. Names,
 * photos and quotes below are illustrative and must be replaced with real
 * customer content before this goes live with the client.
 */
export const testimonials: Testimonial[] = [
  {
    id: "t1",
    customerName: "Mwansa K.",
    location: "Kabulonga, Lusaka",
    quote:
      "Dropped from a skinny frame to actually filling out my shirts in four months. The Gold Standard whey mixes clean, no bloating like the cheap stuff I tried before.",
    rating: 5,
    productId: "on-gold-standard-whey-choc",
  },
  {
    id: "t2",
    customerName: "Chola B.",
    location: "Woodlands, Lusaka",
    quote:
      "I was buying from guys reselling out of car boots and never knew what I was getting. Ordering on WhatsApp and picking up from an actual store changed that completely.",
    rating: 5,
    productId: "usn-whey-premium-choc",
  },
  {
    id: "t3",
    customerName: "Natasha M.",
    location: "Roma, Lusaka",
    quote:
      "The creatine loading guide they sent me on WhatsApp made all the difference — strength went up within the first two weeks and no stomach issues.",
    rating: 5,
    productId: "usn-creatine-monohydrate",
  },
  {
    id: "t4",
    customerName: "Joseph T.",
    location: "Chelstone, Lusaka",
    quote:
      "Cut eight kilos using the Thermotech alongside my training. Staff actually knew what they were talking about when I asked how to stack it.",
    rating: 4,
    productId: "nutritech-thermotech",
  },
  {
    id: "t5",
    customerName: "Grace P.",
    location: "Chalala, Lusaka",
    quote:
      "ISO 100 is the only whey that doesn't upset my stomach. Ordered three times now, delivery has been fast every time.",
    rating: 5,
    productId: "dymatize-iso100-choc",
  },
  {
    id: "t6",
    customerName: "Brian S.",
    location: "Avondale, Lusaka",
    quote:
      "Pre-workout actually hits like it should. Ordered on WhatsApp in the evening, collected the next morning before the gym.",
    rating: 4,
    productId: "usn-19-anator-preworkout",
  },
];
