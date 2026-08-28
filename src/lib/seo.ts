import { business } from "@data/site";

export type SeoProps = {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
};

const SITE_URL = "https://www.jimdandysewer.com";
const SITE_NAME = business.name;

export function resolveCanonical(path: string) {
  return new URL(path, SITE_URL).toString();
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Plumber",
    name: business.name,
    image: `${SITE_URL}/shared/seo/og-default.jpg`,
    "@id": SITE_URL,
    url: SITE_URL,
    telephone: business.phoneHref.replace("tel:", ""),
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.line1,
      addressLocality: "Mountlake Terrace",
      addressRegion: "WA",
      postalCode: "98043",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 47.7906,
      longitude: -122.3079,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
        description: "24/7 emergency dispatch",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: business.rating.value,
      reviewCount: business.rating.count,
    },
    sameAs: [business.social.facebook, business.social.google],
    foundingDate: `${business.founded}`,
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: { "@type": "GeoCoordinates", latitude: 47.6062, longitude: -122.3321 },
      geoRadius: "40000",
    },
  };
}

export function faqSchema(items: readonly { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: resolveCanonical(item.path),
    })),
  };
}

export { SITE_URL, SITE_NAME };
