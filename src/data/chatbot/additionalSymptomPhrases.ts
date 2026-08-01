import type { ServiceSlug } from "./knowledge";

/**
 * Casual user-phrasing aliases of the real `services[].signs` copy in
 * @data/site - NOT new business claims. Each entry paraphrases something
 * already implied by that service's professionally-written `signs` array,
 * so the intent engine can match how customers actually type, not just how
 * the site's editorial copy reads.
 */
export const additionalSymptomPhrases: { phrase: string; slug: ServiceSlug }[] = [
  { phrase: "no hot water", slug: "water-heaters" },
  { phrase: "hot water ran out", slug: "water-heaters" },
  { phrase: "water heater not working", slug: "water-heaters" },
  { phrase: "water heater leaking", slug: "water-heaters" },
  { phrase: "cold showers", slug: "water-heaters" },

  { phrase: "toilet won't flush", slug: "all-plumbing" },
  { phrase: "toilet running", slug: "all-plumbing" },
  { phrase: "faucet dripping", slug: "all-plumbing" },
  { phrase: "low water pressure", slug: "all-plumbing" },
  { phrase: "leaky pipe", slug: "all-plumbing" },
  { phrase: "need a fixture installed", slug: "all-plumbing" },

  { phrase: "sink won't drain", slug: "drains-clogs" },
  { phrase: "shower won't drain", slug: "drains-clogs" },
  { phrase: "tub won't drain", slug: "drains-clogs" },
  { phrase: "drain clogged", slug: "drains-clogs" },
  { phrase: "toilet clogged", slug: "drains-clogs" },
  { phrase: "kitchen sink backed up", slug: "drains-clogs" },

  { phrase: "sewage smell in yard", slug: "sewer-services" },
  { phrase: "sewer backup", slug: "sewer-services" },
  { phrase: "main line backed up", slug: "sewer-services" },
  { phrase: "yard is soggy", slug: "sewer-services" },
  { phrase: "roots in sewer line", slug: "sewer-services" },

  { phrase: "pipe burst", slug: "emergency" },
  { phrase: "flooding", slug: "emergency" },
  { phrase: "water everywhere", slug: "emergency" },
  { phrase: "no water in the house", slug: "emergency" },
  { phrase: "gas smell", slug: "emergency" },

  { phrase: "restaurant plumbing", slug: "commercial" },
  { phrase: "office building plumbing", slug: "commercial" },
  { phrase: "grease trap", slug: "commercial" },
  { phrase: "property management plumbing", slug: "commercial" },
];
