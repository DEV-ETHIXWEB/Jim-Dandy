import { SYNONYM_CANONICAL, TYPO_ALIASES } from "@data/chatbot/synonyms";
import { serviceNameIndex, cityList } from "@data/chatbot/knowledge";

const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "am",
  "i", "you", "we", "they", "it", "he", "she", "my", "your", "our",
  "to", "of", "in", "on", "at", "for", "with", "and", "or", "but",
  "do", "does", "did", "can", "could", "will", "would", "should",
  "this", "that", "these", "those", "have", "has", "had", "me", "us",
]);

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s$%'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenize(text: string): string[] {
  return normalize(text)
    .split(" ")
    .filter((t) => t.length > 0 && !STOPWORDS.has(t));
}

/** Bounded Damerau-Levenshtein edit distance. Returns Infinity past maxDist (cheap early exit). */
export function damerauLevenshtein(a: string, b: string, maxDist: number): number {
  if (Math.abs(a.length - b.length) > maxDist) return Infinity;
  const al = a.length;
  const bl = b.length;
  const d: number[][] = Array.from({ length: al + 1 }, () => new Array(bl + 1).fill(0));
  for (let i = 0; i <= al; i++) d[i][0] = i;
  for (let j = 0; j <= bl; j++) d[0][j] = j;

  for (let i = 1; i <= al; i++) {
    let rowMin = Infinity;
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let val = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        val = Math.min(val, d[i - 2][j - 2] + cost);
      }
      d[i][j] = val;
      if (val < rowMin) rowMin = val;
    }
    if (rowMin > maxDist) return Infinity;
  }
  return d[al][bl] <= maxDist ? d[al][bl] : Infinity;
}

/**
 * Curated domain vocabulary the typo corrector is allowed to snap tokens
 * onto. Kept small and specific so correction never mangles ordinary
 * English or produces false positives.
 */
const DOMAIN_VOCAB: string[] = Array.from(
  new Set([
    ...Object.values(TYPO_ALIASES),
    ...Array.from(SYNONYM_CANONICAL.values()),
    ...serviceNameIndex.flatMap((s) => s.name.split(" ")),
    ...cityList.map((c) => c.toLowerCase()),
    "emergency", "plumber", "plumbing", "drain", "sewer", "water", "heater",
    "service", "coupon", "financing", "warranty", "guarantee",
  ]),
).filter((w) => w.length >= 3);

/**
 * Common, correctly-spelled English words that happen to sit within one or
 * two edits of a domain term (e.g. "shower" vs "sewer") - these must never
 * be auto-corrected, or an ordinary sentence gets silently rewritten into a
 * different topic.
 */
const CORRECTION_BLOCKLIST = new Set([
  "shower", "showers", "slower", "power", "tower", "lower",
  "sink", "think", "since",
  "leak", "leaking",
  "weather", "whether", "wonder", "wander",
]);

function maxDistFor(word: string): number {
  return word.length <= 5 ? 1 : 2;
}

export function correctToken(token: string): string {
  if (token.length < 3) return token;
  const alias = TYPO_ALIASES[token];
  if (alias) return alias;
  if (CORRECTION_BLOCKLIST.has(token)) return token;

  let best: { word: string; dist: number } | null = null;
  const md = maxDistFor(token);
  for (const vocabWord of DOMAIN_VOCAB) {
    if (vocabWord === token) return token;
    if (Math.abs(vocabWord.length - token.length) > md) continue;
    // Typos rarely change the first letter - requiring a shared first
    // letter cuts down on false-positive corrections between unrelated
    // but edit-distance-close real words (e.g. "shower" vs "sewer").
    if (vocabWord[0] !== token[0]) continue;
    const dist = damerauLevenshtein(token, vocabWord, md);
    if (dist < md + 1 && (!best || dist < best.dist)) {
      best = { word: vocabWord, dist };
      if (dist === 0) break;
    }
  }
  return best ? best.word : token;
}

export function applyTypoCorrection(tokens: string[]): string[] {
  return tokens.map(correctToken);
}

export function canonicalOf(term: string): string {
  return SYNONYM_CANONICAL.get(term) ?? term;
}
