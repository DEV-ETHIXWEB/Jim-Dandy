/**
 * Read-only adapter over the site's single source of truth (@data/site,
 * @data/coupons). Re-shapes real business content into lookup-friendly
 * structures for the chatbot engine. Never invents or duplicates facts -
 * every value here is derived from src/data/site.ts or src/data/coupons.ts.
 */
import {
  business,
  services,
  serviceExtras,
  serviceGuides,
  serviceAreaCities,
  serviceCounties,
  faqs,
  financing,
  differentiators,
} from "@data/site";
import { coupons } from "@data/coupons";
import { additionalSymptomPhrases } from "./additionalSymptomPhrases";

export type ServiceSlug = (typeof services)[number]["slug"];

export { business, services, serviceExtras, serviceGuides, coupons, financing, differentiators };

export const serviceBySlug = new Map(services.map((s) => [s.slug, s]));

export type KnowledgeFaq = { question: string; answer: string; source: string };

export const allFaqs: KnowledgeFaq[] = [
  ...faqs.map((f) => ({ ...f, source: "general" })),
  ...services.flatMap((s) =>
    (serviceExtras[s.slug]?.faqs ?? []).map((f) => ({ ...f, source: `service:${s.slug}` })),
  ),
  ...services.flatMap((s) =>
    (serviceGuides[s.slug]?.extraFaqs ?? []).map((f) => ({ ...f, source: `service-guide:${s.slug}` })),
  ),
  ...financing.faqs.map((f) => ({ ...f, source: "financing" })),
];

function norm(s: string): string {
  return s.toLowerCase().trim();
}

export const citySet = new Set(serviceAreaCities.map(norm));
export const cityList = serviceAreaCities;

export const cityToCounty = new Map<string, string>();
for (const county of serviceCounties) {
  for (const rawCity of county.cities.split(",")) {
    const city = norm(rawCity.replace(/^and the surrounding.*$/i, "").trim());
    if (city && citySet.has(city)) cityToCounty.set(city, county.name);
  }
}

export type SymptomEntry = { phrase: string; slug: ServiceSlug; weight: number };

export const symptomIndex: SymptomEntry[] = [
  ...services.flatMap((s) => s.signs.map((sign): SymptomEntry => ({ phrase: norm(sign), slug: s.slug, weight: 6 }))),
  ...additionalSymptomPhrases.map((a): SymptomEntry => ({ phrase: norm(a.phrase), slug: a.slug, weight: 5 })),
];

/** Lowercased service label/slug lookup for entity extraction. */
export const serviceNameIndex: { name: string; slug: ServiceSlug }[] = services.flatMap((s) => [
  { name: norm(s.label), slug: s.slug },
  { name: norm(s.slug.replace(/-/g, " ")), slug: s.slug },
]);
