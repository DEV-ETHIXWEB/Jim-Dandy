import type { APIRoute } from "astro";
import { chatbotLeadSchema } from "@lib/schemas/chatLead";
import { antiBotSchema, checkSpamSignals } from "@lib/security/antiBot";
import { verifyTurnstile } from "@lib/security/turnstile";
import { isRateLimited, clientIp, isSameOrigin } from "@lib/security/requestGuard";

export const prerender = false;

const JSON_HEADERS = { "Content-Type": "application/json" };

export const POST: APIRoute = async ({ request }) => {
  try {
    const ip = clientIp(request);

    // Same-origin only. Stated explicitly rather than left to browser defaults,
    // and it is what stops another site forging a submission. See requestGuard.
    const origin = isSameOrigin(request);
    if (!origin.ok) {
      console.warn("[chat-lead] rejected cross-origin request:", origin.reason, "ip:", ip);
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: JSON_HEADERS,
      });
    }

    if (isRateLimited(ip)) {
      return new Response(JSON.stringify({ error: "Too many requests. Please try again shortly." }), {
        status: 429,
        headers: JSON_HEADERS,
      });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: JSON_HEADERS,
      });
    }

    // The chat wizard is conversational, so there is no honeypot field and no
    // meaningful fill-time to measure - timing is not required here. Turnstile
    // still applies, so both lead paths sit behind the same gate.
    const signals = antiBotSchema.safeParse(body);
    const verdict = checkSpamSignals(signals.success ? signals.data : {});
    if (verdict.spam) {
      console.warn("[chat-lead] rejected submission:", verdict.reason, "ip:", ip);
      return new Response(JSON.stringify({ error: "Unable to process this submission." }), {
        status: 400,
        headers: JSON_HEADERS,
      });
    }

    const turnstile = await verifyTurnstile(signals.success ? signals.data.turnstileToken : undefined, ip);
    if (!turnstile.ok) {
      console.warn("[chat-lead] turnstile rejected:", turnstile.reason, "ip:", ip);
      return new Response(
        JSON.stringify({ error: "Verification failed. Please reload the page and try again." }),
        { status: 403, headers: JSON_HEADERS },
      );
    }

    const result = chatbotLeadSchema.safeParse(body);
    if (!result.success) {
      return new Response(
        JSON.stringify({ error: "Validation failed", issues: result.error.issues }),
        { status: 422, headers: JSON_HEADERS },
      );
    }

    // TODO(integration): forward result.data to the client's lead/CRM system
    // (email, ServiceTitan, Zapier webhook, etc.) once credentials are supplied.
    console.info("[chat-lead] new lead", result.data);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: JSON_HEADERS,
    });
  } catch (err) {
    // Anything unexpected is logged server-side only. The client gets a generic
    // message - never an exception message, stack, or request echo.
    console.error("[chat-lead] unhandled error", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong on our end. Please call us instead." }),
      { status: 500, headers: JSON_HEADERS },
    );
  }
};
