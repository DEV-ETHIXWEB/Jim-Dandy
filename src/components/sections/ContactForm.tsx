import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { contactSchema, serviceOptions, type ContactFormValues } from "@lib/schemas/contact";
import ServiceIcon from "@components/ui/ServiceIcon";

export default function ContactForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { consent: undefined },
  });

  const selectedService = watch("serviceNeeded");
  const consent = watch("consent");

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        throw new Error("Request failed");
      }
      reset();
    } catch {
      setSubmitError("Something went wrong sending your request. Please call us instead - we're happy to help.");
    }
  };

  if (isSubmitSuccessful) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 rounded-[32px] bg-brand-green-50 p-10 text-center">
        <CheckCircle2 className="h-14 w-14 text-brand-green-600" aria-hidden="true" />
        <h3 className="font-heading text-2xl font-bold text-navy-800">You're all set!</h3>
        <p className="max-w-sm text-navy-600">
          Thanks for reaching out - a Jim Dandy dispatcher will call or text you shortly to
          confirm your appointment.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="fullName" className="font-sans text-sm font-semibold text-navy-700">
            Full Name*
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="Eg. Paul Allen"
            autoComplete="name"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            className="rounded-2xl border border-navy-200 bg-navy-50/60 px-5 py-3.5 text-navy-900 shadow-[var(--shadow-inset)] outline-none transition-colors placeholder:text-navy-300 focus:border-brand-green-500 focus:bg-white"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p id="fullName-error" role="alert" className="text-sm text-red-600">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-sans text-sm font-semibold text-navy-700">
            Email*
          </label>
          <input
            id="email"
            type="email"
            placeholder="Eg. paul.allen@email.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="rounded-2xl border border-navy-200 bg-navy-50/60 px-5 py-3.5 text-navy-900 outline-none transition-colors placeholder:text-navy-300 focus:border-brand-green-500 focus:bg-white"
            {...register("email")}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="font-sans text-sm font-semibold text-navy-700">
            Phone number*
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="Eg. (206) 555-0134"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className="rounded-2xl border border-navy-200 bg-navy-50/60 px-5 py-3.5 text-navy-900 outline-none transition-colors placeholder:text-navy-300 focus:border-brand-green-500 focus:bg-white"
            {...register("phone")}
          />
          {errors.phone && (
            <p id="phone-error" role="alert" className="text-sm text-red-600">
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="font-sans text-sm font-semibold text-navy-700">Service needed*</legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {serviceOptions.map((option) => {
            const isActive = selectedService === option.value;
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border border-l-4 p-4 transition-colors ${
                  isActive
                    ? "border-navy-800 bg-white"
                    : "border-navy-200 border-l-navy-800 bg-white hover:border-navy-300"
                }`}
              >
                <input
                  type="radio"
                  value={option.value}
                  className="sr-only"
                  {...register("serviceNeeded")}
                />
                <ServiceIcon
                  name={option.icon}
                  className="h-6 w-6 shrink-0 text-navy-800"
                  aria-hidden="true"
                />
                <span className="text-sm font-semibold text-navy-800">
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>
        {errors.serviceNeeded && (
          <p role="alert" className="text-sm text-red-600">
            {errors.serviceNeeded.message}
          </p>
        )}
      </fieldset>

      <div className="flex flex-col gap-3">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 h-5 w-5 shrink-0 rounded border-navy-300 text-brand-green-600 focus-visible:outline-brand-green-500"
            checked={consent === true}
            onChange={(e) => setValue("consent", e.target.checked as true, { shouldValidate: true })}
          />
          <span className="text-sm font-semibold text-navy-700">Communication consent</span>
        </label>
        <p className="text-xs leading-relaxed text-navy-400">
          By submitting this form and signing up for texts, you consent to receive messages from
          Jim Dandy Sewer &amp; Plumbing at the number provided regarding your request, updates
          about appointments and services or promotions and offers, including messages sent by
          autodialer. Consent is not a condition of purchase. Msg &amp; data rates may apply. Msg
          frequency varies. Unsubscribe at any time by replying STOP. Reply HELP for help.
        </p>
        {errors.consent && (
          <p role="alert" className="text-sm text-red-600">
            {errors.consent.message}
          </p>
        )}
      </div>

      {submitError && <SubmitErrorBanner message={submitError} />}
      <SubmitState isSubmitting={isSubmitting} />
    </form>
  );
}

function SubmitState({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="relative inline-flex items-center justify-center gap-2 self-start rounded-full bg-[linear-gradient(135deg,#9bd36f_0%,#69be28_55%,#4b871c_100%)] px-10 py-5 font-display text-[21px] font-bold text-navy-900 shadow-[var(--shadow-pill-green)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isSubmitting ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            Sending...
          </motion.span>
        ) : (
          <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            Schedule Online
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export function SubmitErrorBanner({ message }: { message: string }) {
  return (
    <div role="alert" className="flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
      <XCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
      {message}
    </div>
  );
}
