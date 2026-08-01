import { services } from "./knowledge";
import type { ChatContext } from "@lib/chatbot/context";

export type IntentName =
  | "GREETING"
  | "GOODBYE"
  | "THANK_YOU"
  | "EMERGENCY"
  | "BOOK_SERVICE"
  | "GET_ESTIMATE"
  | "CONTACT"
  | "PHONE"
  | "EMAIL"
  | "ADDRESS"
  | "HOURS"
  | "SERVICES"
  | "SPECIFIC_SERVICE"
  | "SERVICE_RECOMMENDATION"
  | "SERVICE_AREA_CITY_CHECK"
  | "PRICING_COST"
  | "COUPONS_OFFERS"
  | "FINANCING"
  | "WARRANTY_GUARANTEE"
  | "REVIEWS_TESTIMONIALS"
  | "ABOUT_EXPERIENCE"
  | "RESIDENTIAL_COMMERCIAL"
  | "FAQ"
  | "CAREERS"
  | "COMPLAINT_HUMAN"
  | "UNKNOWN";

export type IntentDef = {
  name: IntentName;
  phrases: string[];
  keywords: { term: string; weight: number }[];
  negativeKeywords?: string[];
  contextBoost?: (ctx: ChatContext) => number;
  minScore: number;
  priority: number;
  /** For SPECIFIC_SERVICE variants: which service slug this definition represents. */
  serviceSlug?: string;
};

const BASE_INTENTS: IntentDef[] = [
  {
    name: "EMERGENCY",
    phrases: ["burst pipe", "pipe burst", "sewage backup", "no water at all", "water everywhere", "flooding my house"],
    keywords: [
      { term: "emergency", weight: 10 },
      { term: "urgent", weight: 6 },
      { term: "flooding", weight: 8 },
      { term: "burst", weight: 8 },
      { term: "leaking", weight: 4 },
      { term: "gas smell", weight: 9 },
      { term: "asap", weight: 5 },
      { term: "right now", weight: 4 },
    ],
    minScore: 8,
    priority: 100,
  },
  {
    name: "GREETING",
    phrases: ["good morning", "good afternoon", "good evening"],
    keywords: [
      { term: "hello", weight: 8 },
      { term: "hi", weight: 8 },
      { term: "hey", weight: 7 },
    ],
    negativeKeywords: ["price", "emergency", "coupon"],
    minScore: 7,
    priority: 10,
  },
  {
    name: "GOODBYE",
    phrases: ["that's all", "that is all", "nothing else"],
    keywords: [
      { term: "bye", weight: 8 },
      { term: "goodbye", weight: 8 },
      { term: "later", weight: 4 },
    ],
    minScore: 7,
    priority: 10,
  },
  {
    name: "THANK_YOU",
    phrases: ["thank you", "thanks a lot", "thanks so much"],
    keywords: [{ term: "thanks", weight: 8 }],
    minScore: 7,
    priority: 10,
  },
  {
    name: "BOOK_SERVICE",
    phrases: ["book a service", "schedule an appointment", "set up an appointment", "book it", "let's book it", "sign me up"],
    keywords: [
      { term: "book", weight: 7 },
      { term: "schedule", weight: 6 },
      { term: "appointment", weight: 6 },
    ],
    minScore: 7,
    priority: 60,
  },
  {
    name: "GET_ESTIMATE",
    phrases: ["get an estimate", "get a quote", "want a quote", "how much would it cost", "i want a quote", "i need a quote"],
    keywords: [
      { term: "estimate", weight: 8 },
      { term: "quote", weight: 7 },
    ],
    minScore: 7,
    priority: 55,
  },
  {
    name: "CONTACT",
    phrases: ["contact you", "get in touch", "reach you"],
    keywords: [{ term: "contact", weight: 6 } as { term: string; weight: number }],
    minScore: 6,
    priority: 20,
  },
  {
    name: "PHONE",
    phrases: ["phone number", "your number", "call you"],
    keywords: [{ term: "phone", weight: 7 }, { term: "call", weight: 4 }, { term: "number", weight: 4 }],
    minScore: 7,
    priority: 25,
  },
  {
    name: "EMAIL",
    phrases: ["email address", "your email"],
    keywords: [{ term: "email", weight: 8 }],
    minScore: 7,
    priority: 25,
  },
  {
    name: "ADDRESS",
    phrases: ["your address", "where are you located", "where are you based"],
    keywords: [
      { term: "address", weight: 8 },
      { term: "located", weight: 6 },
      { term: "location", weight: 3 },
    ],
    minScore: 7,
    priority: 25,
  },
  {
    name: "HOURS",
    phrases: ["business hours", "what are your hours", "when are you open"],
    keywords: [
      { term: "hours", weight: 8 },
      { term: "open", weight: 5 },
      { term: "closed", weight: 4 },
    ],
    negativeKeywords: ["price", "cost"],
    minScore: 7,
    priority: 30,
  },
  {
    name: "SERVICES",
    phrases: ["what services do you offer", "what do you do", "what do you offer", "list your services"],
    keywords: [
      { term: "services", weight: 6 },
      { term: "offer", weight: 3 },
    ],
    minScore: 6,
    priority: 20,
  },
  {
    name: "SERVICE_AREA_CITY_CHECK",
    phrases: ["do you service", "do you cover", "service area", "service my area"],
    keywords: [
      { term: "area", weight: 6 },
      { term: "cover", weight: 5 },
      { term: "serve", weight: 5 },
    ],
    minScore: 6,
    priority: 40,
  },
  {
    name: "PRICING_COST",
    phrases: ["how much does it cost", "how much will it cost", "how much do you charge", "what's the price"],
    keywords: [
      { term: "price", weight: 8 },
      { term: "cost", weight: 8 },
      { term: "charge", weight: 6 },
      { term: "expensive", weight: 5 },
    ],
    minScore: 7,
    priority: 45,
  },
  {
    name: "COUPONS_OFFERS",
    phrases: ["any coupons", "any discounts", "current specials", "any deals"],
    keywords: [
      { term: "coupon", weight: 8 },
      { term: "discount", weight: 7 },
      { term: "offer", weight: 5 },
      { term: "deal", weight: 5 },
      { term: "special", weight: 4 },
    ],
    minScore: 7,
    priority: 35,
  },
  {
    name: "FINANCING",
    phrases: ["do you offer financing", "can i finance", "payment plan", "pay monthly"],
    keywords: [
      { term: "financing", weight: 9 },
      { term: "finance", weight: 8 },
      { term: "monthly", weight: 4 },
    ],
    minScore: 7,
    priority: 35,
  },
  {
    name: "WARRANTY_GUARANTEE",
    phrases: ["is your work guaranteed", "do you offer a warranty"],
    keywords: [
      { term: "warranty", weight: 8 },
      { term: "guarantee", weight: 8 },
      { term: "covered", weight: 3 },
    ],
    minScore: 7,
    priority: 30,
  },
  {
    name: "REVIEWS_TESTIMONIALS",
    phrases: ["read your reviews", "see your reviews", "what do customers say"],
    keywords: [
      { term: "review", weight: 8 },
      { term: "testimonial", weight: 8 },
      { term: "rating", weight: 5 },
    ],
    minScore: 7,
    priority: 25,
  },
  {
    name: "ABOUT_EXPERIENCE",
    phrases: ["how long have you been in business", "are you licensed", "are you insured", "tell me about your company"],
    keywords: [
      { term: "license", weight: 7 },
      { term: "insured", weight: 7 },
      { term: "experience", weight: 5 },
      { term: "years", weight: 3 },
      { term: "history", weight: 3 },
    ],
    minScore: 6,
    priority: 25,
  },
  {
    name: "RESIDENTIAL_COMMERCIAL",
    phrases: ["do you do commercial work", "residential or commercial", "for my business", "for my restaurant"],
    keywords: [
      { term: "commercial", weight: 8 },
      { term: "residential", weight: 6 },
      { term: "business", weight: 4 },
    ],
    minScore: 7,
    priority: 30,
  },
  {
    name: "CAREERS",
    phrases: ["are you hiring", "job openings", "want to work for you"],
    keywords: [
      { term: "hiring", weight: 8 },
      { term: "career", weight: 8 },
      { term: "job", weight: 6 },
      { term: "apply", weight: 4 },
    ],
    minScore: 7,
    priority: 20,
  },
  {
    name: "COMPLAINT_HUMAN",
    phrases: ["talk to a person", "talk to a human", "speak to someone", "real person", "this isn't helping", "not helpful"],
    keywords: [
      { term: "human", weight: 9 },
      { term: "person", weight: 7 },
      { term: "representative", weight: 8 },
      { term: "complaint", weight: 8 },
      { term: "upset", weight: 6 },
      { term: "frustrated", weight: 6 },
    ],
    minScore: 7,
    priority: 70,
  },
  {
    name: "FAQ",
    phrases: [],
    keywords: [{ term: "question", weight: 3 }],
    minScore: 999,
    priority: 15,
  },
  {
    name: "SERVICE_RECOMMENDATION",
    phrases: [],
    keywords: [],
    minScore: 999,
    priority: 50,
  },
];

/** SPECIFIC_SERVICE variants generated once from the real services list - one authored place (site.ts). */
const SPECIFIC_SERVICE_INTENTS: IntentDef[] = services.map((s) => ({
  name: "SPECIFIC_SERVICE" as const,
  serviceSlug: s.slug,
  phrases: [s.label.toLowerCase(), s.slug.replace(/-/g, " ")],
  keywords: s.label
    .toLowerCase()
    .split(" ")
    .filter((w) => w.length > 3)
    .map((term) => ({ term, weight: 6 })),
  contextBoost: (ctx: ChatContext) => (ctx.pageContext.serviceSlug === s.slug ? 5 : 0),
  minScore: 6,
  priority: 42,
}));

export const INTENTS: IntentDef[] = [...BASE_INTENTS, ...SPECIFIC_SERVICE_INTENTS];
