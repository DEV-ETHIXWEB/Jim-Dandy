/**
 * Current offers - transcribed from the coupon artwork on the previous
 * jimdandysewerandplumbing.com/coupons (fetched 2026-09-21), including each
 * offer's own terms and expiry. Do not invent offers or codes here: the
 * coupons a customer sees must match what the office will honour.
 *
 * Tapping one on /coupons adds it to the quote form at the top of that page
 * (the form also reads ?coupon=<id>), and the lead email tells the dispatcher
 * which offer the customer chose.
 *
 * `eligibility` is for offers with a condition the website can't check - the
 * customer ticks it to apply the coupon, and the dispatcher confirms it at
 * booking. `service` preselects the matching service when none is chosen yet.
 */
export const coupons = [
  {
    id: "drain-cleaning-63",
    code: "DRAIN63",
    value: "$63",
    unit: "Or Free",
    title: "$63 Drain Cleaning - Or It's Free",
    description:
      "Drain cleaning for $63 with a one-year guarantee, and a complimentary camera inspection included. If the drain doesn't clear, it's free.",
    terms:
      "Mainlines included. Offer not valid with any other offers or discounts. Must present coupon at time of service. Expires 9/30/2026.",
    expires: "2026-09-30",
    service: "drains-clogs",
  },
  {
    id: "water-heater-2863",
    code: "WH2863",
    value: "$2,863",
    unit: "Installed",
    title: "$2,863 Fully Installed Water Heater",
    description: "Price includes a select 50-gallon electric water heater and installation.",
    terms:
      "Select water heater models only. Offer not valid with any other offers or discounts. Must present coupon at time of service. Expires 9/30/2026.",
    expires: "2026-09-30",
    service: "water-heaters",
  },
  {
    id: "tankless-500",
    code: "TANKLESS500",
    value: "$500",
    unit: "Off",
    title: "$500 Off Any Tankless Water Heater",
    description: "With the purchase and installation of your new tankless water heater.",
    terms:
      "Offer not valid with any other offers or discounts. Must present coupon at time of service. Expires 9/30/2026.",
    expires: "2026-09-30",
    service: "water-heaters",
  },
  {
    id: "plumbing-100",
    code: "PLUMB100",
    value: "$100",
    unit: "Off",
    title: "$100 Off Any Plumbing Service",
    description: "Take $100 off any plumbing service from our licensed team.",
    terms:
      "Offer not valid with any other offers or discounts. Must present coupon at time of service. Expires 9/30/2026.",
    expires: "2026-09-30",
    service: "all-plumbing",
  },
  {
    id: "toilet-bogo",
    code: "BOGO",
    value: "BOGO",
    unit: "Toilets",
    title: "Buy One Toilet, Get One Free",
    description:
      "Buy one qualifying Jim Dandy Select Model toilet and get a second toilet of equal or lesser value free.",
    terms:
      "Valid on the purchase and installation of any model within the Jim Dandy Select Series collection (Toto, American Standard, Kohler, Glacier Bay). Not valid with any other offers or discounts. Must present coupon at time of service. Expires 9/30/2026.",
    expires: "2026-09-30",
    service: "all-plumbing",
  },
  {
    id: "moen-faucet-200",
    code: "MOEN200",
    value: "$200",
    unit: "Off",
    title: "$200 Off a Moen Arbor Touchless Kitchen Faucet",
    description:
      "With the purchase and installation of your new chrome, matte black, oil-rubbed bronze, or spot-resistant stainless steel Moen Arbor kitchen faucet.",
    terms:
      "Offer not valid with any other offers or discounts. Must present coupon at time of service. Expires 9/30/2026.",
    expires: "2026-09-30",
    service: "all-plumbing",
  },
  {
    id: "second-opinion",
    code: "2NDLOOK",
    value: "Free",
    unit: "2nd Opinion",
    title: "Free Second Opinions",
    description: "Getting the run-around from the competition? Call today for your free second opinion.",
    terms:
      "Offer not valid with any other offers or discounts. Must present coupon at time of service. Expires 9/30/2026.",
    expires: "2026-09-30",
  },
  {
    id: "service-5-percent",
    code: "SERVE5",
    value: "5%",
    unit: "Off",
    title: "5% Off for Military, First Responders & Seniors",
    description: "Military, first responders and seniors save 5% on their next plumbing service.",
    terms: "Offer not valid with any other offers or discounts. Maximum discount of $250.",
    eligibility: "I'm military, a first responder, or a senior",
  },
] as const satisfies readonly CouponDef[];

type CouponDef = {
  id: string;
  code: string;
  value: string;
  unit: string;
  title: string;
  description: string;
  terms: string;
  /** ISO date the printed coupon expires, when the artwork states one. */
  expires?: string;
  eligibility?: string;
  service?: "emergency" | "drains-clogs" | "sewer-services" | "water-heaters" | "all-plumbing" | "commercial";
};

export type CouponId = (typeof coupons)[number]["id"];
export type Coupon = CouponDef & { id: CouponId };

export function findCoupon(id: string | null | undefined): Coupon | undefined {
  return id ? (coupons as readonly Coupon[]).find((c) => c.id === id) : undefined;
}

/** Offers whose printed expiry has passed are hidden rather than shown as live. */
export function activeCoupons(now = new Date()): readonly Coupon[] {
  return (coupons as readonly Coupon[]).filter((c) => !c.expires || new Date(`${c.expires}T23:59:59`) >= now);
}

/** Custom events between the coupon cards and the quote form on /coupons. */
export const COUPON_APPLY_EVENT = "jd:apply-coupon";
export const COUPON_CHANGED_EVENT = "jd:coupon-changed";
