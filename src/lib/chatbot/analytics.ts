/**
 * No analytics/dataLayer integration exists in this project yet. pushEvent
 * pushes to window.dataLayer only if something else has already initialized
 * it (e.g. GTM added later); otherwise it's a silent no-op. Never assume or
 * fabricate an analytics integration.
 */
export const CHAT_EVENTS = {
  OPENED: "chat_opened",
  CLOSED: "chat_closed",
  MESSAGE_SENT: "chat_message_sent",
  INTENT_MATCHED: "chat_intent_matched",
  EMERGENCY_DETECTED: "chat_emergency_detected",
  QUICK_REPLY_CLICKED: "chat_quick_reply_clicked",
  WIZARD_STARTED: "chat_wizard_started",
  WIZARD_STEP: "chat_wizard_step",
  WIZARD_ABANDONED: "chat_wizard_abandoned",
  WIZARD_SUBMITTED: "chat_wizard_submitted",
  WIZARD_SUCCESS: "chat_wizard_success",
  WIZARD_ERROR: "chat_wizard_error",
  HUMAN_ESCALATION: "chat_human_escalation",
  RESTARTED: "chat_restarted",
} as const;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function pushEvent(name: string, payload?: Record<string, unknown>): void {
  try {
    if (typeof window === "undefined" || !Array.isArray(window.dataLayer)) return;
    window.dataLayer.push({ event: name, ...payload });
  } catch {
    // Analytics must never break the chat experience.
  }
}
