import {
  CREDIT_COST_RULES,
  LOW_CREDIT_THRESHOLD,
  CRITICAL_CREDIT_THRESHOLD,
} from "@/lib/data/credit-rules";
import type {
  CreditBalance,
  CreditTransaction,
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

// ── Mock data (fail-safe fallbacks) ───────────────────────────────────────────
// TODO: Replace getMockCreditBalance with a real Supabase query once the
//       `credit_balances` table exists. Shape: { user_id, balance,
//       total_earned, total_spent, updated_at }.
export function getMockCreditBalance(userId?: string): CreditBalance {
  return {
    userId: userId ?? "mock",
    balance: 75,
    totalEarned: 100,
    totalSpent: 25,
    lastUpdated: new Date().toISOString(),
  };
}

// TODO: Replace getMockCreditTransactions with a real Supabase query once the
//       `credit_transactions` table exists. Shape: { id, user_id, type,
//       amount, usage_type, description, created_at }.
export function getMockCreditTransactions(
  _userId?: string
): CreditTransaction[] {
  const now = Date.now();
  return [
    {
      id: "1",
      userId: _userId ?? "mock",
      type: "credit",
      amount: 100,
      description: "Starter paketi satın alındı",
      createdAt: new Date(now - 7 * 86_400_000).toISOString(),
    },
    {
      id: "2",
      userId: _userId ?? "mock",
      type: "debit",
      amount: 5,
      usageType: "lesson_generation",
      description: "Ders oluşturma",
      createdAt: new Date(now - 3 * 86_400_000).toISOString(),
    },
    {
      id: "3",
      userId: _userId ?? "mock",
      type: "debit",
      amount: 15,
      usageType: "live_voice_minute",
      description: "Canlı pratik (5 dakika)",
      createdAt: new Date(now - 86_400_000).toISOString(),
    },
    {
      id: "4",
      userId: _userId ?? "mock",
      type: "debit",
      amount: 5,
      usageType: "lesson_generation",
      description: "Ders oluşturma",
      createdAt: new Date(now - 3_600_000).toISOString(),
    },
  ];
}
