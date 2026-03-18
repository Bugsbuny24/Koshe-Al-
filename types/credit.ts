// Credit system type definitions

export type CreditUsageType =
  | "text_chat_message"
  | "live_voice_minute"
  | "lesson_generation"
  | "certificate_issue"
  | "premium_ai_action";

export type CreditBalance = {
  userId: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  lastUpdated: string | null;
};

export type CreditTransaction = {
  id: string;
  userId: string;
  type: "credit" | "debit";
  amount: number;
  usageType?: CreditUsageType;
  description: string;
  createdAt: string;
};

export type UsageCostRule = {
  usageType: CreditUsageType;
  costPerUnit: number;
  unit: string;
  label: string;
};

export type CreditWarningState = "ok" | "low" | "critical" | "empty";
