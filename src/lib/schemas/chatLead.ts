import { z } from "zod";
import { fullNameField, emailField, phoneField, consentField } from "./shared";
import type { ServiceSlug } from "@data/chatbot/knowledge";

export const chatbotLeadSchema = z.object({
  fullName: fullNameField,
  email: emailField,
  phone: phoneField,
  serviceNeeded: z.enum(["plumbing", "heating", "sewers", "commercial", "other"]),
  problem: z.string().trim().min(3, "Tell us briefly what's going on").max(300),
  urgency: z.enum(["emergency", "today", "this-week", "flexible"]),
  audience: z.enum(["residential", "commercial"]),
  city: z.string().trim().min(2, "Let us know your city").max(60),
  timing: z.string().trim().max(120).optional(),
  notes: z.string().trim().max(500).optional(),
  consent: consentField,
  source: z.literal("chat"),
});

export type ChatbotLeadValues = z.infer<typeof chatbotLeadSchema>;

/** Maps a chatbot service slug to the shared serviceNeeded enum used by both lead forms. */
export function serviceNeededFromSlug(slug: ServiceSlug): ChatbotLeadValues["serviceNeeded"] {
  switch (slug) {
    case "water-heaters":
      return "heating";
    case "sewer-services":
      return "sewers";
    case "commercial":
      return "commercial";
    case "drains-clogs":
    case "all-plumbing":
    case "emergency":
    default:
      return "plumbing";
  }
}
