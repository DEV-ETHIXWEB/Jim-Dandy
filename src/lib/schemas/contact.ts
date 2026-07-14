import { z } from "zod";

export const serviceOptions = [
  { value: "plumbing", label: "Plumbing", icon: "wrench" },
  { value: "heating", label: "Heating", icon: "flame" },
  { value: "sewers", label: "Sewers", icon: "search" },
  { value: "commercial", label: "Commercial", icon: "building-2" },
  { value: "other", label: "Other", icon: "more-horizontal" },
] as const;

export const contactSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Enter your full name")
      .max(80, "That name looks too long"),
    email: z.string().trim().pipe(z.email("Enter a valid email address")),
    phone: z
      .string()
      .trim()
      .regex(/^[\d\s()+-]{7,20}$/, "Enter a valid phone number"),
    serviceNeeded: z
      .array(z.enum(["plumbing", "heating", "sewers", "commercial", "other"]))
      .min(1, "Select at least one service"),
    otherServiceDetail: z.string().trim().max(120).optional(),
    consent: z.literal(true, {
      message: "Please confirm you consent to be contacted",
    }),
  })
  .refine((data) => !data.serviceNeeded.includes("other") || Boolean(data.otherServiceDetail?.trim()), {
    message: "Tell us briefly what you need",
    path: ["otherServiceDetail"],
  });

export type ContactFormValues = z.infer<typeof contactSchema>;
