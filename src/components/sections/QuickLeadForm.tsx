import { useEffect, useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ChevronDown, Loader2, Phone, TicketCheck, X } from "lucide-react";
import { quickLeadSchema, quickServiceOptions, type QuickLeadValues, type QuickServiceValue } from "@lib/schemas/quickLead";
import { CONSENT_TEXT } from "@lib/schemas/shared";
import { business } from "@data/site";
import { COUPON_APPLY_EVENT, COUPON_CHANGED_EVENT, findCoupon, type Coupon } from "@data/coupons";
import { trackLeadConversion } from "@lib/analytics";
import TurnstileWidget, { turnstileConfigured } from "@components/security/TurnstileWidget";
import { SubmitErrorBanner } from "./ContactForm";

type Props = {
  /** Preselects this service - a service page passes its own slug. */
  defaultService?: QuickServiceValue;
  /** "card" sits in a page hero; "ribbon" is the horizontal band under the home hero. */
  variant?: "card" | "ribbon";
};

/**
 * Short quote form: name, phone, email, service (the site's real services plus
 * "Other" with a text box) and consent. Posts to /api/quick-lead, which runs the
 * same pipeline as the full contact form - origin check, rate limit, honeypot,
 * fill timing, Turnstile, validation, then the office + customer emails.
 */
export default function QuickLeadForm({ defaultService, variant = "card" }: Props) {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const ribbon = variant === "ribbon";

  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [consentOpen, setConsentOpen] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  // The submit button ships disabled and is enabled once React has mounted:
  // before that, a click would do a plain GET and put the visitor's details in
  // the URL (same guard as ContactForm).
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const mountedAtRef = useRef<number>(Date.now());
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponFlash, setCouponFlash] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    setValue,
    getValues,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<QuickLeadValues>({
    resolver: zodResolver(quickLeadSchema),
    defaultValues: { service: defaultService, consent: undefined },
  });
  const service = watch("service");

  // Coupons: tapped on /coupons (a custom event) or linked with ?coupon=<id>.
  // The URL keeps the choice, so a tap before this form hydrated still lands.
  const applyCoupon = (next: Coupon | null, announce = true) => {
    setCoupon(next);
    // In the form values too, so the eligibility rule is checked in the browser.
    setValue("coupon", next?.id);
    setValue("couponEligible", undefined);
    clearErrors("couponEligible");
    if (next?.service && !getValues("service")) setValue("service", next.service, { shouldValidate: false });
    const url = new URL(window.location.href);
    if (next) url.searchParams.set("coupon", next.id);
    else url.searchParams.delete("coupon");
    window.history.replaceState(window.history.state, "", url);
    window.dispatchEvent(new CustomEvent(COUPON_CHANGED_EVENT, { detail: { id: next?.id ?? null } }));
    if (next && announce) {
      setCouponFlash(true);
      window.setTimeout(() => setCouponFlash(false), 1400);
    }
  };

  useEffect(() => {
    const fromUrl = findCoupon(new URLSearchParams(window.location.search).get("coupon"));
    if (fromUrl) applyCoupon(fromUrl, false);
    const onApply = (e: Event) => {
      const next = findCoupon((e as CustomEvent<{ id: string }>).detail?.id);
      if (!next) return;
      applyCoupon(next);
      // Keyboard/mouse users land in the first field; on touch screens that
      // would pop the keyboard over the coupon they just applied.
      if (window.matchMedia("(hover: hover)").matches) {
        window.setTimeout(() => document.getElementById(id("fullName"))?.focus({ preventScroll: true }), 450);
      }
    };
    window.addEventListener(COUPON_APPLY_EVENT, onApply);
    return () => window.removeEventListener(COUPON_APPLY_EVENT, onApply);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (values: QuickLeadValues) => {
    setSubmitError(null);
    let res: Response;
    try {
      res = await fetch("/api/quick-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          otherServiceDetail: values.service === "other" ? values.otherServiceDetail : undefined,
          coupon: coupon?.id,
          couponEligible: coupon?.eligibility ? values.couponEligible === true : undefined,
          sourcePage: window.location.pathname,
          company: honeypotRef.current?.value ?? "",
          elapsedMs: Date.now() - mountedAtRef.current,
          ...(turnstileToken ? { turnstileToken } : {}),
        }),
      });
    } catch {
      setSubmitError(`We couldn't reach our server - check your connection and try again, or call us at ${business.phone}.`);
      return;
    }

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string; issues?: { path: string[]; message: string }[] };
      const fieldIssues = (data.issues ?? []).filter((issue) => issue.path[0] && issue.path[0] in values);
      fieldIssues.forEach((issue) => setError(issue.path[0] as keyof QuickLeadValues, { type: "server", message: issue.message }));
      setSubmitError(
        fieldIssues.length ? "Please check the highlighted fields." : (data.error ?? `Something went wrong sending your request. Please call us at ${business.phone}.`),
      );
      return;
    }

    // Conversion only after the server confirmed the lead was delivered.
    trackLeadConversion("quick_form", { service: values.service, form_variant: variant, coupon: coupon?.id });
    setSent(true);
  };

  if (sent) {
    return (
      <div
        role="status"
        className={`flex flex-col items-center justify-center gap-3 text-center ${
          ribbon ? "rounded-2xl bg-white/95 px-6 py-8" : "min-h-[360px] rounded-[28px] bg-white p-8 shadow-2xl"
        }`}
      >
        <CheckCircle2 className="h-12 w-12 text-brand-green-600" aria-hidden="true" />
        <p className="font-heading text-2xl font-bold text-navy-800">Request received!</p>
        <p className="max-w-sm text-navy-600">
          A Jim Dandy dispatcher will call or text you shortly. We've also emailed you a confirmation.
        </p>
        {coupon && (
          <p className="inline-flex items-center gap-2 rounded-full bg-brand-green-50 px-4 py-1.5 text-sm font-semibold text-brand-green-600">
            <TicketCheck className="h-4 w-4" aria-hidden="true" />
            {coupon.title} is on your request
          </p>
        )}
      </div>
    );
  }

  const inputBase =
    "w-full rounded-xl border bg-white px-4 py-3 text-base text-navy-900 outline-none transition-colors placeholder:text-navy-300 focus:border-brand-green-500 focus:ring-2 focus:ring-brand-green-500/25";
  const inputClass = (invalid: boolean) => `${inputBase} ${invalid ? "border-red-500" : "border-navy-200"}`;
  const labelClass = ribbon ? "sr-only" : "text-sm font-semibold text-navy-700";
  // On the green ribbon plain red text is too low-contrast, so errors sit on a white chip.
  const errorClass = ribbon ? "self-start rounded-md bg-white px-2 py-0.5 text-sm font-semibold text-red-700" : "text-sm text-red-600";

  const field = (name: "fullName" | "phone" | "email", label: string, type: string, placeholder: string, autoComplete: string) => (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id(name)} className={labelClass}>
        {label}
      </label>
      <input
        id={id(name)}
        type={type}
        placeholder={ribbon ? label : placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? id(`${name}-error`) : undefined}
        className={inputClass(!!errors[name])}
        {...register(name)}
      />
      {errors[name] && (
        <p id={id(`${name}-error`)} role="alert" className={errorClass}>
          {errors[name]?.message}
        </p>
      )}
    </div>
  );

  const serviceSelect = (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id("service")} className={labelClass}>
        Service needed
      </label>
      <div className="relative">
        <select
          id={id("service")}
          aria-invalid={!!errors.service}
          aria-describedby={errors.service ? id("service-error") : undefined}
          className={`${inputClass(!!errors.service)} cursor-pointer appearance-none pr-10 ${service ? "" : "text-navy-400"}`}
          defaultValue={defaultService ?? ""}
          {...register("service")}
        >
          <option value="" disabled>
            Select a service
          </option>
          {quickServiceOptions.map((o) => (
            <option key={o.value} value={o.value} className="text-navy-900">
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" aria-hidden="true" />
      </div>
      {errors.service && (
        <p id={id("service-error")} role="alert" className={errorClass}>
          {errors.service.message}
        </p>
      )}
    </div>
  );

  const otherField = service === "other" && (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id("other")} className={ribbon ? "text-sm font-bold text-navy-900" : labelClass}>
        What do you need help with?
      </label>
      <input
        id={id("other")}
        type="text"
        maxLength={120}
        placeholder="Eg. Gas line inspection"
        aria-invalid={!!errors.otherServiceDetail}
        aria-describedby={errors.otherServiceDetail ? id("other-error") : undefined}
        className={inputClass(!!errors.otherServiceDetail)}
        {...register("otherServiceDetail")}
      />
      {errors.otherServiceDetail && (
        <p id={id("other-error")} role="alert" className={errorClass}>
          {errors.otherServiceDetail.message}
        </p>
      )}
    </div>
  );

  const couponBlock = coupon && (
    <div
      role="status"
      className={`relative flex flex-col gap-2 rounded-xl border-2 border-dashed border-brand-green-500 bg-brand-green-50 px-4 py-3 transition-shadow duration-500 ${
        couponFlash ? "shadow-[0_0_0_6px_rgba(105,190,40,0.35)]" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <TicketCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-green-600" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-green-600">Coupon applied</p>
          <p className="font-semibold leading-snug text-navy-800">
            {coupon.title} <span className="whitespace-nowrap font-mono text-sm text-navy-500">({coupon.code})</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => applyCoupon(null)}
          className="-m-1 inline-flex shrink-0 items-center gap-1 rounded-md p-1 text-sm font-semibold text-navy-500 hover:text-navy-900"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          Remove
        </button>
      </div>
      {coupon.eligibility && (
        <label className="flex cursor-pointer items-start gap-2.5 pl-8">
          <input
            type="checkbox"
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[#457c17]"
            aria-invalid={!!errors.couponEligible}
            {...register("couponEligible")}
          />
          <span className="text-sm font-semibold text-navy-800">
            {coupon.eligibility}
            <span className="block text-xs font-normal text-navy-500">Your dispatcher confirms eligibility when booking.</span>
          </span>
        </label>
      )}
      {errors.couponEligible && (
        <p role="alert" className="pl-8 text-sm text-red-600">
          {errors.couponEligible.message}
        </p>
      )}
    </div>
  );

  const consent = (
    <div className="flex flex-col gap-1">
      <label className="flex cursor-pointer items-start gap-2.5">
        <input
          type="checkbox"
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-navy-300 accent-[#457c17]"
          aria-invalid={!!errors.consent}
          {...register("consent")}
        />
        <span className={`text-sm leading-snug ${ribbon ? "font-semibold text-navy-900" : "text-navy-700"}`}>
          I agree to be contacted about my request.{" "}
          <button
            type="button"
            onClick={() => setConsentOpen((v) => !v)}
            aria-expanded={consentOpen}
            aria-controls={id("consent-text")}
            className={`-my-3 inline-block py-3 font-bold underline underline-offset-2 ${ribbon ? "text-navy-900" : "text-brand-green-600 hover:text-navy-700"}`}
          >
            {consentOpen ? "Hide details" : "Details"}
          </button>
        </span>
      </label>
      <p id={id("consent-text")} hidden={!consentOpen} className={`pl-7 text-xs leading-relaxed ${ribbon ? "text-navy-900/80" : "text-navy-400"}`}>
        {CONSENT_TEXT}
      </p>
      {errors.consent && (
        <p role="alert" className={`pl-7 ${errorClass}`}>
          {errors.consent.message}
        </p>
      )}
    </div>
  );

  const honeypot = (
    <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
      <label htmlFor={id("company")}>Company (leave this field empty)</label>
      <input id={id("company")} type="text" ref={honeypotRef} tabIndex={-1} autoComplete="off" defaultValue="" />
    </div>
  );

  if (ribbon) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Quick service request" className="relative flex flex-col gap-3">
        {honeypot}
        {/* Stacked (phones, tablets): fields -> other -> consent -> error -> button.
            Desktop: fields + button on one row, the rest on the rows below. */}
        <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.15fr_1.15fr_auto]">
          {field("fullName", "Full name", "text", "Eg. Paul Allen", "name")}
          {field("phone", "Phone number", "tel", "Eg. (206) 555-0134", "tel")}
          {field("email", "Email", "email", "Eg. paul@email.com", "email")}
          {serviceSelect}
          {otherField && <div className="sm:col-span-2 lg:order-1">{otherField}</div>}
          {couponBlock && <div className="sm:col-span-2 lg:order-1 lg:col-span-5">{couponBlock}</div>}
          <div className="sm:col-span-2 lg:order-1 lg:col-span-5">{consent}</div>
          {turnstileConfigured && (
            <div className="sm:col-span-2 lg:order-1 lg:col-span-5">
              <TurnstileWidget onToken={setTurnstileToken} />
            </div>
          )}
          {submitError && (
            <div className="sm:col-span-2 lg:order-1 lg:col-span-5">
              <SubmitErrorBanner message={submitError} />
            </div>
          )}
          <div className="sm:col-span-2 lg:col-span-1">{submitButton("navy")}</div>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-labelledby={id("title")}
      className="relative flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white p-6 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)] sm:p-7"
    >
      {honeypot}
      <div>
        <p id={id("title")} className="font-display text-[28px] font-bold italic leading-none text-navy-800">
          Request Service
        </p>
        <p className="mt-1.5 text-sm text-navy-500">Tell us what you need - a dispatcher will call or text you shortly.</p>
      </div>
      {field("fullName", "Full name", "text", "Eg. Paul Allen", "name")}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {field("phone", "Phone number", "tel", "Eg. (206) 555-0134", "tel")}
        {field("email", "Email", "email", "Eg. paul@email.com", "email")}
      </div>
      {serviceSelect}
      {otherField}
      {couponBlock}
      {consent}
      {turnstileConfigured && <TurnstileWidget onToken={setTurnstileToken} className="self-center" />}
      {submitError && <SubmitErrorBanner message={submitError} />}
      {submitButton("green")}
      <a
        href={business.phoneHref}
        className="-my-1 inline-flex min-h-11 items-center justify-center gap-1.5 self-center text-base font-semibold text-navy-700 hover:text-navy-900"
      >
        <Phone className="h-4 w-4 text-brand-green-600" aria-hidden="true" />
        Or call {business.phone} - 24/7
      </a>
    </form>
  );

  function submitButton(tone: "green" | "navy") {
    return (
      <button
        type="submit"
        disabled={!hydrated || isSubmitting}
        className={`inline-flex w-full items-center justify-center gap-2 whitespace-nowrap px-6 py-3 font-display text-[20px] leading-none transition-all duration-200 ease-brand hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 ${
          tone === "green"
            ? "rounded-full bg-[image:var(--btn-primary)] py-4 text-navy-900 shadow-[var(--shadow-btn-green)] hover:bg-[image:var(--btn-primary-hover)] hover:text-white"
            : "min-h-[50px] rounded-xl bg-navy-800 text-white shadow-[0_10px_24px_-10px_rgba(0,24,48,0.8)] hover:bg-navy-900"
        }`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            Sending...
          </>
        ) : ribbon ? (
          "Get a Quote"
        ) : (
          "Request Service"
        )}
      </button>
    );
  }
}
