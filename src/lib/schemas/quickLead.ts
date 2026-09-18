import { z } from "zod";
import { services } from "@data/site";
import { coupons, findCoupon, type CouponId } from "@data/coupons";
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
const couponIds = coupons.map((c) => c.id) as [CouponId, ...CouponId[]];

export const quickLeadSchema = z
  .object({
    fullName: fullNameField,
    phone: phoneField,
    email: emailField,
    service: z.enum(serviceValues, { message: "Choose a service" }),
    otherServiceDetail: shortTextField(120).optional(),
    consent: consentField,
    sourcePage: sourcePageField,
    /** A coupon tapped on /coupons. Unknown ids are dropped, not rejected. */
    coupon: z.enum(couponIds).optional().catch(undefined),
    /** The customer's tick on a conditional offer ("I'm a first-time customer"). */
    couponEligible: z.boolean().optional(),
  })
  .refine((data) => data.service !== "other" || Boolean(data.otherServiceDetail?.trim()), {
    message: "Tell us briefly what you need",
    path: ["otherServiceDetail"],
  })
  .refine((data) => !findCoupon(data.coupon)?.eligibility || data.couponEligible === true, {
    message: "Confirm you qualify for this offer, or remove the coupon",
    path: ["couponEligible"],
  });

export type QuickLeadValues = z.infer<typeof quickLeadSchema>;

/** How a chosen coupon reads in the lead emails. */
export function couponSummary(id: CouponId | undefined, eligible?: boolean): string | undefined {
  const coupon = findCoupon(id);
  if (!coupon) return undefined;
  const confirmed = coupon.eligibility && eligible ? ` - customer confirmed: "${coupon.eligibility}"` : "";
  return `${coupon.title} (code ${coupon.code})${confirmed}`;
}

export function quickServiceLabel(value: QuickServiceValue): string {
  return value === "other" ? "Other" : (services.find((s) => s.slug === value)?.label ?? value);
}
