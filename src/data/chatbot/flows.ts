import { chatbotLeadSchema, type ChatbotLeadValues } from "@lib/schemas/chatLead";
import type { WizardStep } from "@lib/chatbot/context";

export const STEP_ORDER: WizardStep[] = [
  "problem",
  "urgency",
  "audience",
  "city",
  "timing",
  "name",
  "phone",
  "email",
  "notes",
  "confirm",
];

export const STEP_FIELD: Partial<Record<WizardStep, keyof ChatbotLeadValues>> = {
  problem: "problem",
  urgency: "urgency",
  audience: "audience",
  city: "city",
  timing: "timing",
  name: "fullName",
  phone: "phone",
  email: "email",
  notes: "notes",
};

export const STEP_PROMPT: Record<WizardStep, string> = {
  problem: "What do you need help with? A quick description is perfect.",
  urgency: "How urgent is this?",
  audience: "Is this for a home or a business?",
  city: "Which city are you located in?",
  timing: "Any preferred day or time? (Or say \"ASAP\" / \"flexible\")",
  name: "What's your full name?",
  phone: "Best phone number to reach you?",
  email: "And your email address?",
  notes: "Anything else we should know? (Optional - just say \"skip\" if not)",
  confirm: "Here's what I've got - send this to the team?",
  submitting: "Sending your request...",
  success: "You're all set!",
  error: "Something went wrong sending that.",
};

export const STEP_QUICK_REPLIES: Partial<Record<WizardStep, { label: string; value: string }[]>> = {
  urgency: [
    { label: "Emergency", value: "emergency" },
    { label: "Today", value: "today" },
    { label: "This week", value: "this-week" },
    { label: "Flexible", value: "flexible" },
  ],
  audience: [
    { label: "Residential", value: "residential" },
    { label: "Commercial", value: "commercial" },
  ],
  notes: [{ label: "Skip", value: "skip" }],
};

export function nextStep(current: WizardStep): WizardStep {
  const idx = STEP_ORDER.indexOf(current);
  if (idx === -1 || idx === STEP_ORDER.length - 1) return "confirm";
  return STEP_ORDER[idx + 1];
}

/** Validates a single step's answer against the matching slice of chatbotLeadSchema. */
export function validateStep(step: WizardStep, value: string): { ok: true; value: string } | { ok: false; error: string } {
  const field = STEP_FIELD[step];
  if (!field) return { ok: true, value };

  if (step === "notes" && value.trim().toLowerCase() === "skip") {
    return { ok: true, value: "" };
  }

  const shape = chatbotLeadSchema.shape as Record<string, { safeParse: (v: unknown) => { success: boolean; error?: { issues: { message: string }[] } } }>;
  const fieldSchema = shape[field];
  const result = fieldSchema.safeParse(value);
  if (!result.success) {
    return { ok: false, error: result.error?.issues[0]?.message ?? "That doesn't look right - try again." };
  }
  return { ok: true, value };
}

export function isWizardComplete(answers: Partial<ChatbotLeadValues>): boolean {
  return chatbotLeadSchema.omit({ consent: true, source: true }).safeParse(answers).success;
}
