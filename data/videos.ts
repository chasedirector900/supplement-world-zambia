import { StoreVideo } from "@/lib/types";

/**
 * Placeholder "How It's Used" video content — shaped like the future Django
 * `/api/videos/` response, same approach as `data/testimonials.ts`.
 *
 * `url` currently points at a YouTube *search* for the shop + title, the same
 * "search, not a guessed link" pattern `mapsSearchUrl` uses in lib/contact.ts
 * — safe until each clip is actually filmed and uploaded, at which point swap
 * it for the real `youtube.com/watch?v=...` link.
 */
function youtubeSearchUrl(title: string): string {
  const q = `Supplement World Zambia ${title}`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
}

export const videos: StoreVideo[] = [
  {
    id: "v1",
    title: "How to scoop and mix whey properly",
    category: "How To",
    platform: "youtube",
    url: youtubeSearchUrl("How to scoop and mix whey properly"),
    productId: "on-gold-standard-whey-choc",
  },
  {
    id: "v2",
    title: "Creatine: loading phase vs. maintenance dose",
    category: "How To",
    platform: "youtube",
    url: youtubeSearchUrl("Creatine loading phase vs maintenance dose"),
    productId: "usn-creatine-monohydrate",
  },
  {
    id: "v3",
    title: "Staff pick: our top pre-workout for morning sessions",
    category: "Staff Pick",
    platform: "youtube",
    url: youtubeSearchUrl("best pre-workout for morning sessions"),
    productId: "usn-19-anator-preworkout",
  },
  {
    id: "v4",
    title: "A customer's cutting stack, explained",
    category: "Customer Routine",
    platform: "youtube",
    url: youtubeSearchUrl("customer cutting stack explained"),
    productId: "nutritech-thermotech",
  },
  {
    id: "v5",
    title: "Whey vs. ISO — which one is right for you?",
    category: "How To",
    platform: "youtube",
    url: youtubeSearchUrl("Whey vs ISO which one is right for you"),
    productId: "dymatize-iso100-choc",
  },
];
