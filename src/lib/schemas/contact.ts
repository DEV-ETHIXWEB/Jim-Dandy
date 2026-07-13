import { z } from "zod";

export const serviceOptions = [
  { value: "plumbing", label: "Plumbing", icon: "wrench" },
  { value: "heating", label: "Heating", icon: "flame" },
  { value: "sewers", label: "Sewers", icon: "search" },
  { value: "commercial", label: "Commercial", icon: "building-2" },
] as const;

export const contactSchema = z.object({
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
  serviceNeeded: z.enum(["plumbing", "heating", "sewers", "commercial"], {
    message: "Select the service you need",
  }),
  consent: z.literal(true, {
    message: "Please confirm you consent to be contacted",
  }),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
