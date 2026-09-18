import { z } from "zod";
import { services } from "@data/site";
import { fullNameField, emailField, phoneField, consentField, shortTextField, sourcePageField } from "./shared";

/**
 * The short quote form in page heroes and the home-page ribbon. It lists the
 * site's actual services (not the contact form's broad categories), so the
 * office email names exactly what the visitor picked - "Drains & Clogs",
 * not "Plumbing" - plus "Other" with a free-text description.
 */
export const quickServiceOptions = [
  ...services.map((s) => ({ value: s.slug, label: s.label })),
  { value: "other", label: "Other (tell us)" },
] as const;

export type QuickServiceValue = (typeof services)[number]["slug"] | "other";

const serviceValues = quickServiceOptions.map((o) => o.value) as [QuickServiceValue, ...QuickServiceValue[]];

export const quickLeadSchema = z
  .object({
    fullName: fullNameField,
    phone: phoneField,
    email: emailField,
    service: z.enum(serviceValues, { message: "Choose a service" }),
    otherServiceDetail: shortTextField(120).optional(),
    consent: consentField,
    sourcePage: sourcePageField,
  })
  .refine((data) => data.service !== "other" || Boolean(data.otherServiceDetail?.trim()), {
    message: "Tell us briefly what you need",
    path: ["otherServiceDetail"],
  });

export type QuickLeadValues = z.infer<typeof quickLeadSchema>;

export function quickServiceLabel(value: QuickServiceValue): string {
  return value === "other" ? "Other" : (services.find((s) => s.slug === value)?.label ?? value);
}
