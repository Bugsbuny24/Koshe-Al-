import type { CreditBalance, CreditTransaction } from "@/types/credit";

// ── Mock / fallback data ───────────────────────────────────────────────────────
// These are ONLY for development and fallback scenarios.
// Never present mock data as real balance to production users.

export function getMockCreditBalance(userId?: string): CreditBalance {
  return {
    userId: userId ?? "mock",
    balance: 75,
    totalEarned: 100,
    totalSpent: 25,
    lastUpdated: new Date().toISOString(),
  };
}

export function getMockCreditTransactions(
  userId?: string
): CreditTransaction[] {
  const now = Date.now();
  return [
    {
      id: "1",
      userId: userId ?? "mock",
      type: "credit",
      amount: 100,
      description: "Starter paketi satın alındı",
      createdAt: new Date(now - 7 * 86_400_000).toISOString(),
    },
    {
      id: "2",
      userId: userId ?? "mock",
      type: "debit",
      amount: 5,
      usageType: "lesson_generation",
      description: "Ders oluşturma",
      createdAt: new Date(now - 3 * 86_400_000).toISOString(),
    },
    {
      id: "3",
      userId: userId ?? "mock",
      type: "debit",
      amount: 15,
      usageType: "live_voice_minute",
      description: "Canlı pratik (5 dakika)",
      createdAt: new Date(now - 86_400_000).toISOString(),
    },
    {
      id: "4",
      userId: userId ?? "mock",
      type: "debit",
      amount: 5,
      usageType: "lesson_generation",
      description: "Ders oluşturma",
      createdAt: new Date(now - 3_600_000).toISOString(),
    },
  ];
}
