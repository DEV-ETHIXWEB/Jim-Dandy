// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

// DEPLOYMENT CONFIG - SOURCE OF TRUTH
// Two files affect the deploy. They own strictly separate concerns; keep it
// that way, because a setting defined in both places has no obvious winner.
//
//   astro.config.mjs (this file) OWNS: routing - redirects, output mode,
//     adapter, integrations. The Vercel adapter compiles these into
//     .vercel/output/config.json. Defining redirects here (not in vercel.json)
//     also means they work in `astro dev`.
//
//   vercel.json OWNS: HTTP response headers only. @astrojs/vercel cannot
//     express headers, so they must live there; Vercel applies them at the
//     platform layer and they never appear in the adapter's output config.
//
// Do NOT add `redirects`, `rewrites`, or `routes` to vercel.json - they would
// compete with the adapter's generated routes. Add them here instead.

// https://astro.build/config
export default defineConfig({
  // Production domain. This is the single source of truth for the site origin -
  // canonicals, the sitemap, OG URLs and schema.org all derive from it via
  // `import.meta.env.SITE` (see src/lib/seo.ts). Do not hardcode the domain
  // anywhere else.
  //
  // jimdandysewer.com is a secondary domain that 301s here; the live business
  // site (previously Squarespace) is served from this origin.
  site: 'https://www.jimdandysewerandplumbing.com',
  output: 'static',
  adapter: vercel(),
  redirects: {
    // /commercial and /services/commercial shipped as two full pages with the
    // same <title>, both indexable. The service-detail page is canonical; this
    // retires the parallel one instead of leaving it to compete.
    '/commercial': { status: 301, destination: '/services/commercial' },
  },
  integrations: [
    react(),
    sitemap({
      // /privacy-policy is served with `noindex`. Listing it here as well is a
      // direct contradiction and shows up in Search Console as "Submitted URL
      // marked noindex", so it is excluded from the sitemap instead.
      filter: (page) => !page.includes('/privacy-policy'),
      // The integration emits directory URLs with a trailing slash ("/about/"),
      // but every canonical is emitted without one ("/about"). Google treats
      // those as different URLs; strip the slash so the two agree. The homepage
      // keeps its slash, because its canonical has one.
      serialize: (item) => {
        const url = new URL(item.url);
        if (url.pathname !== '/') url.pathname = url.pathname.replace(/\/$/, '');
        return { ...item, url: url.toString() };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    domains: [],
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
