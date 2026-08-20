# Supplement World Zambia — Frontend Architecture

Living design + behavior spec for the Phase 1 prototype. This is the document
to hand to anyone (including a future backend engineer, or Claude Code) who
picks up work on this project. Code should follow this doc; when they
diverge, update this doc first, then the code.

---

## 1. Design System

| Token | Value | Used for |
|---|---|---|
| `charcoal` (background) | `#121212` | Page canvas |
| `surface` (card/modal) | `#1E1E1E` | Cards, drawer, modals |
| `border` | `#2E2E2E` | Card edges, dividers |
| `brand` (accent) | `#70B21D` | CTAs, active filter, badges, prices-on-hover, category indicators |
| `ink` (primary text) | `#FFFFFF` | Titles, prices |
| `muted` (secondary text) | `#A1A1AA` | Metadata, captions, passive icons |

**Type:** a bold condensed display face (Anton) for headlines/hero, a neutral
grotesque (Inter) for body and UI. Display type is used sparingly — hero
headline, section titles, price emphasis — never for body copy.

**Scrollbars:** styled globally in `globals.css` — transparent track, `#3a3a3a`
pill thumb, brand green while dragging, plus `.scrollbar-slim` (6px) for scroll
areas nested inside a panel. `color-scheme: dark` is set on `:root` so native
chrome renders dark rather than stark white.

> Chrome supports **both** the standard `scrollbar-width`/`scrollbar-color` and
> the `::-webkit-scrollbar` pseudo-elements — but setting the standard ones makes
> it silently ignore the pseudo-elements, losing the hover/active states and the
> slim variant. The standard properties are therefore wrapped in
> `@supports not selector(::-webkit-scrollbar)` so only Firefox takes them.
> Don't "tidy" that wrapper away.

**Avoid nested scroll areas.** A scrollbar inside an already-scrolling column
puts two bars side by side and steals the wheel. Long facet lists use a
"Show all N" toggle instead (see the flavour filter), not `max-h-* overflow-y-auto`.

**Icons:** `lucide-react` for all UI/utility icons. Lucide ships **no**
WhatsApp, Messenger or TikTok glyph, and its facebook/instagram/twitter icons
are deprecated Feather outlines that don't match the real marks — so official
brand logos live in `components/icons/BrandIcons.tsx` as filled SVG paths with
a lucide-compatible API (`size`, `className`, inherits `currentColor`). Never
substitute a generic `MessageCircle` for the WhatsApp mark; WhatsApp is the
primary conversion path and must be instantly recognisable.

**Form controls:** native `<select>` is not used — its dropdown is drawn by
the OS and ignores the dark palette entirely. `components/Select.tsx` is the
themed listbox replacement: full keyboard support, and it renders its panel
through a **portal with fixed positioning** because the cart drawer's body is
`overflow-y-auto` and would clip a normally-positioned panel. It flips above
the trigger when there isn't room below.

**Never publish the stock count.** The catalog size is the shop's commercial
information, not a selling point — a small number reads as a small business.
So: no "N products" on the homepage CTAs, no total in the `/shop` subtitle, and
the result counter only appears **once the user has narrowed** (search or a
filter). Unfiltered it reads "Showing the full range", in the visible counter
*and* the screen-reader live region. Facet counts stay, since they're a
filtering aid rather than a headline — revisit if the shop objects.

**Physical branches** (`STORES` in `lib/contact.ts`, rendered by
`components/StoreLocator.tsx`, mounted under the homepage catalog). Ten walk-in
stores across six cities is the strongest trust signal this business has —
counterfeit stock is the buyer's main worry, and a store you can walk into
answers it better than any badge. Branches link to a Google Maps **search**
rather than a pinned coordinate, so they stay correct without us storing
coordinates we can't verify.

**Social links:** `SOCIAL_LINKS` in `lib/contact.ts` holds one entry per
profile with `url: null` until the real URL is known. The footer renders only
entries that have a URL, so half-known profiles never ship as dead links.

**Touch targets:** every interactive element (filter pill, variant swatch,
quantity stepper, nav icon) is a minimum 48×48px hit area on mobile, even
where the visible element is smaller.

**Radius & elevation:** cards and the drawer use rounded corners (`1–1.25rem`)
and a soft inset+drop shadow (`shadow-card`) rather than hard borders alone,
so the dark-on-dark surfaces still read as separate layers.

---

## 2. Page / Route Map

```
/                     Homepage — announcement bar, hero, goal selector,
                      featured grid (8), social proof
/shop                 Full catalog — search, faceted filters, sorting.
                      All state lives in the query string (see §4c)
/product/[slug]       Product Detail Page (PDP)
/cart                 (no dedicated route — cart is a global slide-over,
                      reachable from any page via the header icon)
```

Phase 1 ships `/`, `/shop` and the cart drawer. `/product/[slug]` is the next
build target (see §4B) — currently product detail is inline on the card only.

The homepage is a **shop window, not the catalog**: it shows the first 8 of the
active goal and hands off to `/shop` via "See all N", carrying the selected goal
across as `?goal=…` so the user's context survives the jump.

---

## 3. Global Layout (present on every page)

### 3a. Announcement bar
Thin strip above the main nav. Dark background, `#70B21D` text. Rotates
through: delivery coverage, authenticity guarantee, and the real review stat.
Dismissible; once dismissed it doesn't re-show for the session. Deliberately
**not** sticky — it scrolls away so the sticky nav keeps a fixed
`--header-h` and the goal filter stays anchored beneath it.

> **Delivery wording — do not say "nationwide."** The shop's own page lists 7
> of Zambia's 10 provinces (no Northern, North-Western or Muchinga), so the
> bar says "Delivery across 7 provinces" instead. See `lib/contact.ts`.
> If the shop confirms they cover all 10, update `SERVICE_AREAS` and the
> copy can go back to "nationwide."

### 3b. Main navigation (sticky)
- **Left:** wordmark, `SUPPLEMENT` in white + `WORLD` in brand green, "Zambia"
  as a small muted kicker.
- **Center (desktop only):** jump links — *Shop*, *By Goal*, *Brands*,
  *Contact*. Hidden on mobile; mobile relies on the goal selector + bottom bar
  instead of a hamburger, to keep the flow to "browse → add → order."
- **Right:** search trigger (icon only until tapped, then expands to a full-
  width input on mobile), cart icon with a green count badge, and a
  WhatsApp quick-link icon for "just talk to us" traffic that doesn't want to
  browse.
- Nav is sticky with a blurred charcoal backdrop so content scrolls under it
  without a hard seam.

### 3c. Sticky bottom action bar (mobile only, <640px)
Fixed to the viewport bottom, always within thumb reach:
- Left: Cart toggle (with badge).
- Right: "Order on WhatsApp" — jumps straight to the express flow (§5b) using
  whatever is currently in the cart, or opens a blank inquiry if the cart is
  empty.
- This bar sits above the safe-area inset and never overlaps page content
  (page has bottom padding equal to the bar's height).
- The bar hides itself while the cart drawer is open, so it never sits on top
  of the drawer's own primary action.
- **Express path detail:** the bar's WhatsApp button deliberately does *not*
  collect name/phone/area — it sends the item list alone and lets staff take
  the delivery details in the chat that follows. That's what makes it feel
  instant rather than a shortened checkout. The drawer (§5a) remains the path
  that captures structured customer details, and still requires them.

---

## 4. Page Specs

### 4a. Homepage

1. **Hero** — full-bleed brand photograph (`public/hero-athlete.png`) used as a
   backdrop the copy sits *inside*, not a picture beside text. It carries its
   own green rim light and deep negative space, so it needs scrims rather than
   cropping:

   - **Below `lg`** the cover-crop drags the athlete under the copy, so the
     text sits in a near-solid band at the bottom
     (`from-charcoal from-40% via-charcoal/90 via-70% to-charcoal/5`) and the
     athlete stays clear above it.
   - **At `lg` and up** there's room to put the copy in a left column, so the
     scrim runs horizontally and clears toward the athlete.

   Contrast was measured by sampling the actual image pixels under each glyph
   and compositing the scrim over them — every text element clears WCAG AA
   (worst case 5.4:1) at 375 / 768 / 1024 / 1280 / 1440. **If you retune a
   scrim, object-position or the hero height, re-check contrast** — a change
   that looks fine on desktop can put the athlete's lit torso straight behind
   the mobile copy (that exact regression measured 1.19:1).

   Over the photo sits the shop's **own motto** as the headline — "FITNESS NEEDS / IN ONE
   PLACE." with the payoff line in brand green, matching how it reads on their
   Facebook cover — one sentence of support copy, and two CTAs: primary
   (`Browse Catalog`, brand-green fill) and secondary (`Order via WhatsApp`,
   outlined). Motto strings live in `TAGLINE` (`lib/contact.ts`); prefer the
   shop's real words over invented marketing lines.
2. **Goal selector** — horizontal, swipeable pill row: *Build Muscle*, *Lose
   Fat*, *Energy & Pre-Workout*, *Mass Gain* (+ "All"). Selecting a goal
   filters the grid below in place — no page navigation, no loading spinner
   for a mock-data set this size.
3. **Featured grid** — 2-up on mobile, up to 4-up on desktop. Each card:
   image, badge (Best Seller / New, optional), name + flavor, a macro callout
   (protein + fat, the two numbers a buyer actually compares), price in ZMW
   (with a struck-through compare-at price if discounted), and a quick "add"
   button that skips the PDP for repeat buyers.
4. **Social proof** — a strip stating follower/view counts (e.g. 120K
   followers, 20M views) as trust signals, plus 2–3 short local customer
   quotes. Numbers in brand green, quotes in muted gray, no star-rating
   widget unless real review data backs it.

### 4c. Shop page (`/shop`)

The catalog surface. Engine lives in `lib/catalog.ts` (pure, UI-free) and URL
state in `lib/useCatalogParams.ts`, so Phase 2 can run the same query logic
server-side against a Django endpoint without touching the components.

**The URL is the state.** Every filter, the search term and the sort key live
in the query string. That's what makes a filtered view shareable — staff can
send a customer `?/shop?goal=Lose+Fat&max=1000` over WhatsApp and it opens
exactly right. It also means Back undoes one filter and a reload keeps results.
Search typing uses `replace` (a debounced keystroke must not stack history);
every other change uses `push`.

**Faceting follows the Amazon rule:** a facet does not narrow its own counts.
Selecting brand USN re-counts the *goal* facet to USN-only, while brand counts
stay at their full values so the user can still see what switching brands would
give. `passesExcept()` in `lib/catalog.ts` implements this — don't "simplify" it
into a single filter pass, that behaviour is deliberate.

**Search** is token-AND with field weighting (name 10 · brand 6 · flavour 5 ·
goal 3 · size 2 · description 1, doubled on a word-boundary hit). Every token
must match something, so "usn chocolate" can't drag in every chocolate product.
A zero-result search offers closest-term suggestions rather than dead-ending.

**Price per serving** (`pricePerServing`) is derived, not stored — pack size ÷
serving size, handling g/kg, ml/l and capsule counts. It's the metric that
actually decides a supplement purchase: a 5.44kg gainer that looks expensive
next to a 900g tub is usually far cheaper per scoop. It drives the "Best value
per serving" sort, where unparseable products sink to the bottom rather than
sorting as if they were free. Shown on shop cards only (`showValue`), since
that's where people compare.

**Layout:** filters are a sticky sidebar at `lg`, and a full-height sheet below
it whose primary button reads "Show N results" and updates live as facets are
picked.

### 4b. Product Detail Page (next build)

- **Gallery:** large primary image, thumbnail strip below (or beside, on
  desktop) to switch angles/flavors.
- **Purchase engine:** title, one-line subtitle, ZMW price, flavor variant
  buttons (selected variant gets a brand-green outline + fill on the swatch,
  not just a text change — must be visually obvious at a glance), quantity
  stepper (48px targets), and a **nutrition table** (Protein / Carbs / Fat /
  Servings per scoop) — same numbers as the card badge, just fuller.
- **Actions:**
  - Primary: `Add to Cart` → opens the slide-over drawer with this item just
    added, rest of cart intact.
  - Secondary: `Instant WhatsApp Order` → skips the cart entirely, opens
    WhatsApp with a message for *this one item* pre-filled (see §5c). This is
    for a buyer who came from an Instagram link for one product and doesn't
    want to browse further.

---

## 5. Cart & Order Flow

### 5a. Slide-over drawer (global, current build)
- **Trigger:** opens automatically on "Add to Cart," or manually via the
  header/bottom-bar cart icon.
- **Animation:** slides in from the right (~250ms ease-out), backdrop fades
  in behind it. Closing reverses both. Respects `prefers-reduced-motion` by
  cutting the animation to near-instant rather than removing the
  interaction.
- **Item rows:** thumbnail, name + flavor + selected variant, quantity
  stepper, line price, single-tap remove (trash icon, no confirm dialog —
  removal is easily reversible by re-adding).
  The thumbnail comes from `components/ProductMedia.tsx`, the same component
  the grid card uses, so a product can never look different in the cart from
  the card the customer tapped. It renders the real photo when `image` is set
  and the generated placeholder otherwise.
  Content is stacked in **two rows** beside the thumbnail (name+remove above,
  price+stepper below). A single row leaves roughly 90px for the name at 375px
  and pushes the stepper's 48px hit areas back over the price, so a tap near
  the price would change the quantity — don't flatten it back.
- **Order calculation panel:** subtotal in ZMW, and a **location selector** —
  now a dropdown of the shop's 7 real serviceable provinces, sourced from
  `SERVICE_AREAS` in `lib/contact.ts`, so delivery-fee logic can hook into a
  known set of values later. Street address and free-text delivery notes stay
  in the optional field underneath.
- **Primary action:** `Send Order on WhatsApp` — disabled until name, phone,
  and location are filled. No traditional multi-step checkout form; this
  button *is* the checkout.

### 5b. Direct WhatsApp order generator (from the cart)
Tapping the button builds one pre-formatted text message and opens it in
WhatsApp addressed to `+260979003311`:

```
Hi Supplement World Zambia! I'd like to place an order:

• USN Whey Premium (Chocolate Peanut Butter, 908g) x1 — ZMW 850.00
• USN Creatine Monohydrate (Unflavoured, 250g) x1 — ZMW 320.00

Total: ZMW 1170.00

Name: ...
Phone: ...
Delivery area: Lusaka
Notes: ...
```

No payment gateway, no account creation — the message *is* the order, and
Supplement World's staff confirm and take payment over WhatsApp/on delivery.

### 5c. Instant WhatsApp order (from a PDP, next build)
Same mechanism as 5b but scoped to a single product/variant/quantity chosen
on that page, for the "one-item impulse buy" path. Bypasses the drawer
entirely — tapping it should feel instant, not like a shortened checkout.

---

## 6. Motion & Micro-interactions

Keep motion purposeful and restrained — this is a supplement store, not a
game. One orchestrated moment (the drawer) beats scattered hover effects
everywhere.

- **Drawer open/close:** slide + backdrop fade, ~250ms, ease-out.
- **Add-to-cart:** the tapped button gives a brief scale/opacity pulse so the
  add registers even before the drawer finishes opening.
- **Filter switch:** grid re-renders instantly (no fade/skeleton needed at
  this catalog size); the selected pill transitions background color over
  ~150ms rather than snapping.
- **Image hover (desktop only):** subtle scale-up (~1.05×) on the product
  card image, communicates interactivity without a shadow/border change that
  would fight the card's existing border.
- Everything above collapses to near-zero duration under
  `prefers-reduced-motion`.

---

## 7. Mobile UX Rules

- Design mobile-first; desktop is an expansion, not a separate layout.
- Minimum 48px touch targets on every interactive element.
- Sticky bottom action bar keeps Cart + WhatsApp Order within thumb reach at
  all times (§3c) — this is the highest-leverage mobile decision, since over
  90% of traffic is expected to come from Instagram/WhatsApp on a phone.
- Avoid horizontal scroll traps except where intentional (goal pills, PDP
  thumbnail strip) — both get a subtle edge fade or visible partial-next-item
  to signal "more to scroll."

---

## 8. Data & Future Backend Swap

Everything above is written against a `Product` shape (name, brand, flavor,
goals[], priceZMW, macros, image?, badge, sizeOptions) that's already
backend-agnostic.

**Product imagery:** `image` is **optional**. When it's absent the card renders
`components/ProductPlaceholder.tsx` — a generated SVG whose gradient, angle and
circle layout are derived deterministically from the product id, with hues held
in a narrow band around the brand green so a full grid reads as one palette.
Drop a real photo in `public/products/` and set `image` on that product; the
card switches over on its own, one product at a time. No external placeholder
service is used, so the catalog renders offline.

**Catalog seed:** 29 products across 7 brands (USN, Optimum Nutrition,
MuscleTech, Dymatize, Applied Nutrition, BSN, Nutritech), spread over the four
goals — 14 / 10 / 5 / 7, with overlaps where a product genuinely serves two.
Multi-brand is deliberate: the shop's strapline is "all your fitness and health
needs in one place" and their own hero shot carries both USN and ON tubs. Phase 2 swaps the mock catalog for a Django REST endpoint
returning the same shape — no component above should need to change, only
the data-fetching layer. Order submission stays WhatsApp-based in Phase 2
unless/until a real payment gateway is scoped separately.

**Customer capture, orders & email marketing (planned — "Option B"):** the
client wants to move beyond WhatsApp-only ordering toward capturing customer
data at checkout, sending marketing emails, and an admin dashboard showing
customers and purchase stats. No real product data or a confirmed
backend/hosting choice exists yet, so nothing below is built — this is the
shape the frontend groundwork (`Customer`/`Order` in `lib/types.ts`, the
optional `email` field on `CartDrawer`'s checkout form, the `/admin` route
stub) is aimed at, so that wiring it up later is additive rather than a
rebuild:

- **API layer:** a lightweight layer — Next.js API routes in this same repo,
  or a small separate service — sitting in front of the database. Whether
  that coexists with or replaces the Django catalog endpoint above is not
  decided; either way the frontend keeps talking to the same `Product`,
  `Customer` and `Order` shapes regardless of what's behind the API.
- **Storage:** Postgres. The checkout form in `CartDrawer` already collects
  everything a `Customer` record needs (name, phone, optional email, area) —
  submitting it creates/updates a `Customer` row and an `Order` row (cart
  lines, total, timestamp, status), keyed the same way `lib/whatsapp.ts`
  already builds the WhatsApp message today. The WhatsApp handoff (§5) isn't
  replaced by this — it stays the order-confirmation channel; the database
  record is what makes a customer/order **queryable** afterward.
- **Email marketing:** a transactional/marketing email integration (e.g.
  Resend) triggered from the admin dashboard, sending to the `email` column
  on stored `Customer` rows. Nothing sends automatically off a checkout —
  captured email is a passive future-marketing signal, not an opt-in
  confirmation flow, until that's explicitly built and the client has
  decided what "opted in" means.
- **Dashboard:** `/admin` — currently a static "coming soon" stub
  (`app/admin/page.tsx`), unlinked from the storefront and with no real
  authentication. Real staff login is a prerequisite for wiring any customer
  data into it, not an afterthought once the backend exists.

---

## 9. Open Items / Not Yet Built

- [x] Announcement bar — built (`components/AnnouncementBar.tsx`), rotating +
      session-dismissible
- [x] Search + faceted filtering — built as the `/shop` page (§4c)
- [ ] Search trigger in the **nav** (icon that expands to an input) — the nav
      currently links to `/shop` instead. A nav search should just push to
      `/shop?q=…` rather than growing a second search implementation.
- [x] WhatsApp quick-link icon in nav — built (§3b)
- [x] Product Detail Page (`/product/[id]`) — built (`app/product/[id]/page.tsx`, `components/ProductDetail.tsx`), see FEATURES.md
- [x] Instant WhatsApp order (single-item, bypasses cart) — built on the PDP
- [ ] Social proof section on the homepage — partially covered: the real
      review stat now appears in the announcement bar and footer, but the
      follower/view counts and local customer quotes are still outstanding
- [x] Location dropdown in cart — built, backed by `SERVICE_AREAS`
- [x] Footer with contact details + delivery coverage (`components/Footer.tsx`)
- [x] Sticky bottom mobile action bar — built (`components/MobileActionBar.tsx`)
- [x] Hero CTAs (`Browse Catalog` / `Order via WhatsApp`) — built (§4a.1)
- [x] Option B groundwork — `Customer`/`Order` types (`lib/types.ts`), optional
      email capture at checkout (`CartDrawer`, `lib/whatsapp.ts`), `/admin`
      stub route — built (2026-08-20), see §8. No backend, no real dashboard,
      no persistence — groundwork only
