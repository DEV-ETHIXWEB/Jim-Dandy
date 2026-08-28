# Jim Dandy Sewer & Plumbing

Production Astro site for Jim Dandy Sewer & Plumbing, built from the Figma design
(`Jim Dandy Sewer & Plumbing`, node `279-1603`).

## Stack

Astro 7 · TypeScript (strict) · Tailwind CSS 4 · React islands · Framer Motion ·
Swiper · React Hook Form + Zod · Lucide icons · `@astrojs/vercel` adapter.

## Commands

| Command           | Action                                      |
| :----------------- | :------------------------------------------ |
| `npm install`       | Install dependencies                        |
| `npm run dev`       | Start dev server at `localhost:4321`        |
| `npm run build`     | Type-check + build to `./dist` and `.vercel/output` |
| `npm run preview`   | Preview the production build locally        |
| `npx astro check`   | Type-check only                             |

## Project structure

```
src/
├── assets/
│   ├── photos/     Real photography, cropped from Figma exports (astro:assets)
│   ├── logos/      BBB/Angi/PHCC certification badge logos
│   └── icons/      3D service icons (Emergency, Drains & Clogs, ...)
├── components/
│   ├── layout/     Header, Footer, Logo, Seo (React islands + Astro)
│   ├── sections/   One file per section (Hero, ServicesGrid, FaqSection, ...)
│   └── ui/         Reusable primitives (Button, SectionHeading, YearsBadge, ...)
├── data/
│   ├── site.ts     Single source of truth for business info, nav, services, FAQs, copy
│   └── coupons.ts  Coupon offers shown on /coupons
├── layouts/        Base HTML shell
├── lib/            SEO/schema.org helpers, Zod schemas
└── pages/
    ├── index.astro             Home
    ├── services/index.astro    Services hub
    ├── services/[slug].astro   6 service detail pages (data-driven)
    ├── commercial.astro
    ├── coupons.astro
    ├── service-area.astro
    ├── about.astro
    ├── contact.astro
    ├── privacy-policy.astro
    └── api/contact.ts          Contact form submission endpoint
```

Design tokens (colors, type scale, shadows) live in `src/styles/global.css` under
`@theme`, extracted from the Figma file's variables - change them there and every
component picks it up.

## Status

**Built:** All 14 required pages/routes exist and pass `astro check` + a clean
production build - Home, Services hub, 6 service detail pages, Commercial,
Coupons, Service Area, About, Contact, and Privacy Policy. Fully responsive
(verified 320px–1920px, zero horizontal overflow), keyboard accessible, with
`Plumber`, `FAQPage`, and `BreadcrumbList` schema.org markup wired up via
`src/lib/seo.ts`. Real photography and certification/service icon assets are
wired in via `astro:assets`.

The 16 per-city `/service-area/[city]` links (from the homepage search widget)
currently point to anchors on the `/service-area` hub page rather than
standalone routes - deferred per a scope decision to avoid thin, duplicate
per-city content; each city has a real (short) blurb on the hub page in the
meantime.

## Needs client input before launch

1. **Photography for inner pages.** The 6 service detail pages still use the
   stylized `PhotoFrame.astro` placeholder for their hero image slot - only
   the Home page has real cropped photography so far. Swap in real per-service
   Jim Dandy photos via `astro:assets` `<Image>` once supplied.
2. **Lead delivery.** `src/pages/api/contact.ts` validates and accepts
   submissions but only logs them - it needs to be wired to the client's real
   CRM/email/SMS system (ServiceTitan, SendGrid, Zapier webhook, etc.).
3. **Interactive map.** The Service Area section uses a hand-built SVG map
   illustration, not a real map embed (no Google Maps API key configured).
4. **Coupon offers.** `src/data/coupons.ts` contains standard, low-risk
   industry offers as placeholders (e.g. "$50 Off Any Repair Over $500") -
   confirm exact terms, amounts, and expirations with the client before launch.
5. **Verify exact license numbers, address, and hours** in `src/data/site.ts` -
   these were transcribed from the Figma mockup and should be confirmed against
   the client's actual licensing documents.
6. **Privacy Policy legal review.** `src/pages/privacy-policy.astro` is a
   complete, standard policy (SMS/TCPA language included) but should get a
   pass from the client's counsel before launch, like any legal page.
7. **A known upstream `path-to-regexp` ReDoS advisory** exists in
   `@astrojs/vercel`'s dependency chain (`npm audit`). No fix is available yet
   without a breaking downgrade; low real-world risk (build-time/adapter code,
   not client-facing), but worth revisiting when Vercel ships a patched release.
