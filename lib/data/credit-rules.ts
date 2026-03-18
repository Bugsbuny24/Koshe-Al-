import type { UsageCostRule } from "@/types/credit";

// ── Usage cost rules ──────────────────────────────────────────────────────────
// Adjust costPerUnit to tune credit consumption across AI features.
export const CREDIT_COST_RULES: UsageCostRule[] = [
  {
    usageType: "text_chat_message",
    costPerUnit: 1,
    unit: "mesaj",
    label: "Chat Mesajı",
  },
  {
    usageType: "lesson_generation",
    costPerUnit: 1,
    unit: "ders",
    label: "Ders Oluşturma",
  },
  {
    usageType: "live_voice_minute",
    costPerUnit: 1,
    unit: "dakika",
    label: "Canlı Sesli Pratik",
  },
  {
    usageType: "certificate_issue",
    costPerUnit: 5,
    unit: "sertifika",
    label: "Sertifika Düzenleme",
  },
  {
    usageType: "premium_ai_action",
    costPerUnit: 1,
    unit: "işlem",
    label: "Premium AI Aksiyonu",
  },
];

// ── Balance thresholds ────────────────────────────────────────────────────────
export const LOW_CREDIT_THRESHOLD = 20;
export const CRITICAL_CREDIT_THRESHOLD = 5;
