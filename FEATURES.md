# Feature Roadmap — Trust & Standout Features

Tracking list for the 7 features agreed on 2026-08-12, aimed at building buyer trust and
giving Supplement World something a competitor site doesn't have. Tick items off as they
ship; add notes under each when a design decision gets made so we don't relitigate it later.

## 1. "Real Results" gallery — ✅ shipped (2026-08-12)
- [x] Customer transformation photos / testimonials, tagged to the product they used
- [x] Data source: `data/testimonials.ts`, shaped like the future Django `/api/testimonials/` response (swap array for a fetch later)
- [x] Design: `components/Testimonials.tsx` — snap-scroll cards on mobile, grid on `sm:`+, `components/AvatarPlaceholder.tsx` for customers without a real photo yet
- [x] Tagged to product id, links out to `/shop?q=<product name>`
- [x] Placement: homepage, between the catalog and the store locator
- [ ] **TODO before going live:** swap placeholder names/quotes/photos in `data/testimonials.ts` for real customer content

## 2. Video library ("How It's Used") — ✅ shipped (2026-08-12, redesigned 2026-08-12)
- [x] Short clips: mixing/scooping demos, staff picks, customer routines
- [x] Hosting: links out to YouTube (`StoreVideo.url` + `platform`) — no file hosting needed
- [x] **Moved off the homepage** into its own page at `/videos`, linked from the centred nav in the header
- [x] Styled as a YouTube-feed: 16:9 thumbnails, title + channel row below, stacked full-width on mobile / grid on larger screens (not the original horizontal reel rail)
- [x] Tapping a video opens the real YouTube result in a new tab
- [x] Data: `data/videos.ts`, `components/VideoLibrary.tsx` (now the `/videos` feed grid), `components/VideoPlaceholder.tsx` (16:9 placeholder, same visual family as products/testimonials)
- [ ] **TODO before going live:** replace placeholder `url`s in `data/videos.ts` (currently YouTube *search* links, same "search not a guess" pattern as `mapsSearchUrl`) with real `youtube.com/watch?v=...` links once filmed and uploaded

## 3. Usage guides per product/category — ✅ shipped (2026-08-12)
- [x] "How to take Creatine," "Whey timing," dosage FAQs, one per category (8 guides covering all ~30 products)
- [x] Structure: **per-category**, not per-product — added `ProductCategory` to `lib/types.ts` + `Product.category` (backfilled on every entry in `data/products.ts`), since "how do I take creatine" doesn't change between brands
- [x] Content: `data/guides.ts` — What it's for / How to take it / When to take it / Tips per category, plus a standard "check your label, ask a doctor if..." disclaimer line. General, well-established supplement-label knowledge, not medical advice
- [x] Pages: `/guides` (hub, `app/guides/page.tsx`) and `/guides/[slug]` (detail, `app/guides/[slug]/page.tsx`) — detail page also lists every product in that category so it doubles as a category landing page
- [x] Linked from: header nav (`Guides`, alongside Home/Shop/Videos) and every Product Detail Page ("Not sure how to use this?" callout, `components/ProductDetail.tsx`)
- [x] `lib/guideIcons.tsx` — one icon per category, shared between the hub and detail page

## 4. Featured / Best Sellers rail — ✅ shipped (2026-08-12)
- [x] Badges made explicit and typed: `Badge` type in `lib/types.ts` (`"Best Seller" | "Staff Pick" | "New" | "High Stim"`), was a free-text string before. Documented as an editorial flag, not computed from sales data — there's no backend tracking real orders yet
- [x] Each badge gets its own icon + colour (`lib/badges.tsx`) so they read as distinct signals at a glance — Best Seller (flame, brand green), Staff Pick (star, amber), New (sparkles, sky blue), High Stim (bolt, orange) — instead of one identical green pill for everything
- [x] Applied to both the product card and the PDP gallery badge
- [x] Added a `"Staff Pick"` badge to one product (`on-gold-standard-preworkout` in `data/products.ts`) so all 4 badge styles are actually visible in the demo, not just described
- [x] New homepage **Best Sellers rail** (`components/BestSellers.tsx`) — right after the hero, before the goal filter, so it's the first trust signal before someone starts browsing. Pulls every `badge === "Best Seller"` product, snap-scroll cards on mobile / 4-col grid on `sm:`+, same rail pattern as Testimonials and the video library
- [x] Confirmed badge source of truth stays `data/products.ts` — one field, read everywhere it's shown

## 5. Goal-based stacks/bundles — ✅ shipped (2026-08-12)
- [x] 4 bundles, one per `Goal` — Lean Muscle Stack, Fat Loss Stack, Pre-Workout Stack, Mass Gainer Stack — `data/bundles.ts`, `Bundle` type in `lib/types.ts`
- [x] **Pricing decided:** plain sum of the included products, no bundle discount — that's a real pricing call for the client to make later, not a default to bake into the UI (noted in the data file itself)
- [x] **Add-to-cart decided:** one tap adds every item in the stack as its own normal cart line (default size, qty 1) — no new cart/store logic, customer can still edit or drop one item afterward in the drawer same as any other line
- [x] `components/BundleCard.tsx` — thumbnail collage, itemised product links, total price, "Add Stack to Cart"
- [x] Slotted into the existing goal-filter system: picking a goal on the homepage (not "All") surfaces the matching stack right above the product grid

## 6. Authenticity / trust badges — ✅ shipped (2026-08-12)
- [x] 4 trust points, each answering the fake/expired-stock objection directly rather than a generic "quality guaranteed" badge — `lib/trust.ts`: 100% Genuine Stock, Batch & Expiry Checked, Walk In & Verify, Confirmed by a Real Person
- [x] `components/TrustBadges.tsx` — two layouts: `full` (icon + label + one-line detail, 2x2 grid) and `compact` (icon + label, single wrapping row)
- [x] **Placement:** PDP, `full` variant right under the Add to Cart / Instant WhatsApp buttons — the exact moment "is this genuine?" gets decided, not buried lower on the page. Footer, `compact` variant — a persistent sitewide reminder
- [x] **Not on the product card grid** — deliberately skipped. Cards were just scaled down for mobile (they were running too tall); adding a badge row back would undo that, and PDP + footer already cover the objection without every card needing to re-state it

## 7. Ask-a-question CTA — ✅ shipped (2026-08-12)
- [x] "Not sure if this is right for you? Ask us on WhatsApp — we'll help you pick." on the PDP, right after the description/usage-guide callout
- [x] `buildProductQuestionMessage(product)` in `lib/whatsapp.ts` — reuses the existing `buildWhatsAppLink` pattern, opens WhatsApp with `"...I have a question about [Product] ([Flavour]) — "` pre-filled and trailing off (not a full stop) so the cursor sits ready for the customer's actual question
- [x] Copy deliberately reads as "we'll help you pick," not "buy this" — sits right next to the usage-guide link as the two ways to get unstuck: guide for a how-to-use question, WhatsApp for anything more specific (allergies, stacking with what they already take, etc.)
- [x] **Not added to the product card grid**, same reasoning as #6's trust badges — cards were just trimmed for mobile height, and every product already gets this on its own PDP, one tap away from the card

## Store locator polish — ✅ shipped (2026-08-12)
- [x] Fixed cards stretching to match the tallest sibling in the row (`items-start`), which left single-branch cities with a lot of dead black space
- [x] Glass-style cards (`bg-surface/80` + `backdrop-blur`) so they sit on top of a background image instead of flat black boxes
- [x] Subtle per-card watermark icon so cards aren't bare even with one branch
- [x] Wired an optional background image at `public/store-locator-bg.jpg` (CSS `background-image`, not `next/image`, so it fails gracefully if the file isn't there yet)
- [x] Background image generated and saved to `public/store-locator-bg.jpg`. Prompt used:

  > A wide, dark, moody banner background image for a supplement/fitness store locator section. Abstract stylised map of Zambia at night, rendered as thin glowing outlines and dot-grid texture — not a literal road map, more like a data-visualization aesthetic. Scattered glowing pin/location markers in a vivid lime-green (#70B21D) across the map, faint connecting lines between them. Background is near-black charcoal (#121212) with a subtle dark green vignette. Cinematic, minimal, low detail density, lots of negative/dark space so text and UI cards can sit on top of it legibly. No text, no logos, no people, no product bottles. 16:9 or ultra-wide aspect ratio, subtle film-grain texture, premium fitness-brand feel similar to Nike/Gymshark dark-mode marketing pages.

  Save the result as `public/store-locator-bg.jpg` — the component already points at it and will pick it up with no code changes.
- [x] **(2026-08-12) Made desktop-only** (`hidden md:block`) — with the background art and a 5-branch Lusaka card, it didn't have room to breathe at mobile widths and isn't carrying essential weight there anyway (the sticky WhatsApp bar + per-branch Maps links elsewhere already cover reachability). Full section still shows on `md:`+ viewports

## Site structure — ✅ shipped (2026-08-12)
Groundwork that came out of the video library rework — also closes two items
`ARCHITECTURE.md` §9 had flagged as "next build":
- [x] **Header nav** — centred link row (Home / Shop / Videos) under the logo row, active link underlined in brand green. Kept on its own row rather than crammed next to the logo/cart icons, since 375px is the width most traffic actually arrives at
- [x] **Product Detail Page** at `/product/[id]` (`app/product/[id]/page.tsx`, `components/ProductDetail.tsx`) — gallery, flavour switcher (links across sibling flavour entries), size selector, quantity stepper, full nutrition table (protein/carbs/fat/calories), description
- [x] **Instant WhatsApp Order** — secondary action on the PDP that sends a single-item order straight to WhatsApp, bypassing the cart entirely (for someone who followed a link for one product and doesn't want to browse)
- [x] Product cards (`ProductCard.tsx`) now link through to their PDP; the Add-to-Cart button still adds directly from the card without navigating
- [x] PDP shows a "How To Use This" section pulling any videos tagged to that product from `data/videos.ts` — only appears when a product actually has one, since not every product will

## Checkout: payment method + address — ✅ shipped (2026-08-12)
Business decision needed here that's the client's to make, not ours: whether
orders eventually take real online payment (Visa/Mobile Money via a gateway
like Flutterwave/DPO/Airtel Money API) or stay WhatsApp-negotiated. That
needs a backend, a chosen gateway, and a merchant account, so it can't be
built for real yet — what shipped instead is the checkout **choice**, wired
honestly rather than faked:
- [x] Cart drawer now asks "How would you like to pay?" — **Cash / Mobile
      Money on delivery or pickup** vs. **Pay online now**. Neither option
      collects a card number or PIN on this site.
- [x] Picking "Pay online now" doesn't charge anything — it's included in the
      WhatsApp order message (`lib/whatsapp.ts` → `PAYMENT_LABELS`) so staff
      know to follow up with a Mobile Money/card payment link manually, which
      is how the shop already takes payment today
- [x] Added a dedicated **street address** field, separate from the province
      dropdown and the free-text notes — `CustomerLocation.address` in
      `lib/whatsapp.ts`, required to send the order same as name/phone/area
- [x] **Client-side validation** (2026-08-12) — `lib/validation.ts` checks
      phone format (Zambian mobile numbers) and email format before either
      checkout button becomes clickable, with an inline error shown once the
      field is blurred. Explicitly a UX layer, not a security boundary — the
      Django backend re-validates everything server-side in Phase 2; this
      just stops an obviously-wrong number reaching staff before that exists
- [x] **Decided:** gateway is **Flutterwave** — real frontend integration added (2026-08-12), see below

## Flutterwave checkout integration — ✅ frontend shipped (2026-08-12)
Real integration, not a mockup — using Flutterwave's official
`flutterwave-react-v3` SDK. What it can and can't do without a backend:
- [x] `npm install flutterwave-react-v3` — official React SDK
- [x] `lib/flutterwave.ts` — builds the Flutterwave config (amount, tx_ref,
      customer, ZMW currency) from the cart; reads the public key from
      `NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY`
- [x] Cart drawer: picking "Pay online now" swaps the primary button to
      **"Pay ZMW [total] with Flutterwave"**, which opens the real Flutterwave
      checkout modal (card/Mobile Money/USSD) via `useFlutterwave`
- [x] Added an **email field** to checkout — Flutterwave requires it
- [x] On a successful payment, still sends a WhatsApp message to staff with
      the order + the Flutterwave reference (`flw_ref`) attached — Flutterwave
      confirms *money arrived*, not *what was ordered*, so WhatsApp stays the
      order record either way
- [x] **Gracefully unconfigured out of the box:** no key is set in this repo
      (`.env.local.example` documents how), so right now picking "Pay online"
      falls back to the WhatsApp-handoff behaviour automatically — nothing
      breaks, nothing fakes a charge
- [ ] **TODO before this actually charges anyone:** the client needs to
      create a Flutterwave merchant account, confirm ZMW is enabled on it,
      and drop the public key into `.env.local`. Verifying a payment
      server-side (so a confirmed order can't be spoofed) needs the secret
      key on the Django backend in Phase 2 — that's out of scope for a
      frontend-only key

## Product card + PDP polish — ✅ shipped (2026-08-12)
- [x] Product cards scaled down on mobile only (desktop untouched): shorter 4:3 image crop instead of square, tighter padding/text sizes, smaller Add button — the square crop at 2-column mobile width was making cards run too tall
- [x] **Multi-photo gallery on the PDP** — `Product.image` (single) replaced with `Product.images` (array, capped at 4). `components/ProductDetail.tsx` shows a 4-thumbnail strip under the main photo when a product has more than one image; products with 0-1 photos look exactly as before (placeholder or single image, no strip). `components/ProductMedia.tsx` gained an optional `src` override so the gallery can swap the main photo without duplicating the placeholder-fallback logic
- [ ] **TODO:** no product has real photos yet — add `images: ["/products/<file>.jpg", ...]` (up to 4) to a product in `data/products.ts` once photos are gathered and both the card and the PDP gallery pick them up automatically

---
**Status: all 7 features shipped** (2026-08-12). Plus: store locator visually refreshed and desktop-only; header nav + Product Detail Page built (multi-photo gallery, flavour/size selectors, nutrition table, Instant WhatsApp Order); checkout captures address + payment preference with client-side validation, with a real (but unconfigured) Flutterwave integration behind "Pay online"; product cards scaled for mobile.

**Known TODOs before this goes live with the client** (collected from the notes above):
- Swap placeholder testimonial names/quotes/photos (`data/testimonials.ts`) for real customer content
- Replace placeholder video links (`data/videos.ts`) with real YouTube uploads
- Add real product photos (`Product.images` in `data/products.ts`, up to 4 each) once gathered
- Create a Flutterwave merchant account, confirm ZMW is enabled, add the public key to `.env.local`
- Decide on real pricing/discount (if any) for the goal-based bundles in `data/bundles.ts`
- Everything here is still Phase 1 (frontend only, mock data) — Phase 2 is wiring this up to the Django backend per `ARCHITECTURE.md`
