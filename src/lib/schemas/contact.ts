import { z } from "zod";
import { fullNameField, emailField, phoneField, consentField } from "./shared";

export const serviceOptions = [
  { value: "plumbing", label: "Plumbing", icon: "wrench" },
  { value: "heating", label: "Heating", icon: "flame" },
  { value: "sewers", label: "Sewers", icon: "search" },
  { value: "commercial", label: "Commercial", icon: "building-2" },
  { value: "other", label: "Other", icon: "more-horizontal" },
] as const;

export const contactSchema = z
  .object({
    fullName: fullNameField,
    email: emailField,
    phone: phoneField,
    serviceNeeded: z
      .array(z.enum(["plumbing", "heating", "sewers", "commercial", "other"]))
      .min(1, "Select at least one service"),
    otherServiceDetail: z.string().trim().max(120).optional(),
    consent: consentField,
  })
  .refine((data) => !data.serviceNeeded.includes("other") || Boolean(data.otherServiceDetail?.trim()), {
    message: "Tell us briefly what you need",
    path: ["otherServiceDetail"],
  });

export type ContactFormValues = z.infer<typeof contactSchema>;
