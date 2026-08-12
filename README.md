# Supplement World Zambia — Prototype

Mobile-first e-commerce prototype built for the Supplement World Zambia pitch.
Mock data only — no backend required for this phase.

## Stack

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS (custom dark athletic theme)
- Zustand (cart state, persisted to localStorage)
- WhatsApp order handoff — no payment gateway needed for Phase 1

## Run locally

```bash
npm install
npm run dev
```

Visit http://localhost:3000. Test on your phone by running `npm run dev -- -H 0.0.0.0`
and opening your machine's local IP on the same Wi-Fi.

### If the site suddenly renders with no styling

`next build` writes into the same `.next/` folder `next dev` serves from, so
running a build (or deleting `.next/`) while the dev server is up strips the
dev CSS chunk — the page 404s on `layout.css` and falls back to raw HTML. The
code is fine; **restart the dev server** and it comes back.

To build while a dev server is running, use `npm run build:safe`, which outputs
to `.next-build/` and leaves `.next/` alone.

## Deploy to Vercel (for the live demo link)

1. Push this folder to a new GitHub repo.
2. Go to https://vercel.com/new and import the repo.
3. Leave all settings as default (Next.js is auto-detected) and click Deploy.
4. Share the generated `*.vercel.app` link — that's the live prototype for
   Supplement World Zambia to test on their phones.

Alternatively, with the Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Where things live

- `data/products.ts` — mock catalog. Replace with real USN stock, prices (ZMW),
  and photos before the live demo, or swap for a real API call in Phase 2.
- `lib/whatsapp.ts` — builds the pre-filled WhatsApp message and link. The
  order number is set to `+260979003311`.
- `lib/store.ts` — Zustand cart store (persisted).
- `tailwind.config.ts` — brand palette (`charcoal`, `surface`, `brand`, `ink`,
  `muted`).
- `components/` — `Header`, `GoalFilter`, `ProductCard`, `CartDrawer`.

## Phase 2 (future)

Swap `data/products.ts` for a Django REST API that returns live stock and
pricing. The component layer already expects the same `Product` shape
(`lib/types.ts`), so this should be a data-layer swap rather than a rebuild.
