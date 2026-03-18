import type { UsageCostRule, CreditPackage } from "@/types/credit";

// ── Usage cost rules ──────────────────────────────────────────────────────────
// Adjust costPerUnit to tune credit consumption across AI features.
export const CREDIT_COST_RULES: UsageCostRule[] = [
  {
    usageType: "text_chat_message",
    costPerUnit: 1,
    unit: "mesaj",
    label: "Text Chat Mesajı",
  },
  {
    usageType: "live_voice_minute",
    costPerUnit: 3,
    unit: "dakika",
    label: "Canlı Sesli Pratik",
  },
  {
    usageType: "lesson_generation",
    costPerUnit: 5,
    unit: "ders",
    label: "Ders Oluşturma",
  },
  {
    usageType: "certificate_issue",
    costPerUnit: 10,
    unit: "sertifika",
    label: "Sertifika Düzenleme",
  },
  {
    usageType: "premium_ai_action",
    costPerUnit: 2,
    unit: "işlem",
    label: "Premium AI Aksiyonu",
  },
];

// ── Credit package definitions ────────────────────────────────────────────────
export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: "starter",
    name: "Starter",
    credits: 100,
    priceDisplay: "₺199",
    description: "Başlamak için ideal",
    badge: "🌱",
    features: [
      "100 kredi",
      "~20 ders oluşturma",
      "~33 dakika canlı pratik",
      "Standart destek",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    credits: 300,
    priceDisplay: "₺499",
    description: "Düzenli öğrenciler için",
    isPopular: true,
    badge: "🚀",
    features: [
      "300 kredi",
      "~60 ders oluşturma",
      "~100 dakika canlı pratik",
      "Öncelikli destek",
    ],
  },
  {
    id: "power",
    name: "Power",
    credits: 1000,
    priceDisplay: "₺1.299",
    description: "Yoğun öğrenme için",
    badge: "⚡",
    features: [
      "1000 kredi",
      "~200 ders oluşturma",
      "~333 dakika canlı pratik",
      "Premium destek + öncelik",
    ],
  },
];

// ── Balance thresholds ────────────────────────────────────────────────────────
export const LOW_CREDIT_THRESHOLD = 20;
export const CRITICAL_CREDIT_THRESHOLD = 5;
