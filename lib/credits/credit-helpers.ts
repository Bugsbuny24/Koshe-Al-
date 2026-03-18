import {
  CREDIT_COST_RULES,
  LOW_CREDIT_THRESHOLD,
  CRITICAL_CREDIT_THRESHOLD,
} from "@/lib/data/credit-rules";
import type {
  CreditBalance,
  CreditUsageType,
  CreditWarningState,
} from "@/types/credit";

// ── Cost lookup ───────────────────────────────────────────────────────────────
export function getUsageCreditCost(
  usageType: CreditUsageType,
  units = 1
): number {
  const rule = CREDIT_COST_RULES.find((r) => r.usageType === usageType);
  return rule ? rule.costPerUnit * units : 0;
}

// ── Formatting ────────────────────────────────────────────────────────────────
export function formatCreditBalance(balance: number): string {
  if (balance >= 1000) return `${(balance / 1000).toFixed(1)}k`;
  return String(balance);
}

// ── Guard ─────────────────────────────────────────────────────────────────────
export function hasEnoughCredits(
  balance: CreditBalance,
  usageType: CreditUsageType,
  units = 1
): boolean {
  const cost = getUsageCreditCost(usageType, units);
  return balance.balance >= cost;
}

// ── Warning state ─────────────────────────────────────────────────────────────
export function buildCreditWarningState(balance: number): CreditWarningState {
  if (balance <= 0) return "empty";
  if (balance <= CRITICAL_CREDIT_THRESHOLD) return "critical";
  if (balance <= LOW_CREDIT_THRESHOLD) return "low";
  return "ok";
}

export function isLowCreditState(state: CreditWarningState): boolean {
  return state === "low" || state === "critical" || state === "empty";
}

// ── Session cost estimate ─────────────────────────────────────────────────────
export function estimateSessionCost(
  type: "live" | "lesson" | "chat",
  units = 1
): number {
  if (type === "live") return getUsageCreditCost("live_voice_minute", units);
  if (type === "lesson") return getUsageCreditCost("lesson_generation", units);
  return getUsageCreditCost("text_chat_message", units);
}
