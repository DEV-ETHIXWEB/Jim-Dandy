import { z } from "zod";

export const fullNameField = z.string().trim().min(2, "Enter your full name").max(80, "That name looks too long");
export const emailField = z.string().trim().pipe(z.email("Enter a valid email address"));
export const phoneField = z
  .string()
  .trim()
  .regex(/^[\d\s()+-]{7,20}$/, "Enter a valid phone number");
export const consentField = z.literal(true, {
  message: "Please confirm you consent to be contacted",
});
