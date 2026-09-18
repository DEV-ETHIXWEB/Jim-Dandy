import type { APIRoute } from "astro";
import { quickLeadSchema, quickServiceLabel } from "@lib/schemas/quickLead";
import { CONSENT_TEXT } from "@lib/schemas/shared";
import { handleLeadRequest } from "@lib/leads/handleLead";

export const prerender = false;

export const POST: APIRoute = ({ request }) =>
  handleLeadRequest(request, {
    tag: "[quick-lead]",
    schema: quickLeadSchema,
    // A real HTML form: it always reports fill time and carries the honeypot.
    requireTiming: true,
    toLead: (data, meta) => ({
      ...meta,
      source: "quick_form",
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      services: [quickServiceLabel(data.service)],
      otherServiceDetail: data.service === "other" ? data.otherServiceDetail : undefined,
      sourcePage: data.sourcePage,
      consentText: CONSENT_TEXT,
    }),
  });
