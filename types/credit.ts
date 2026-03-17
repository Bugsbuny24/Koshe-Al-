// Credit system type definitions
// TODO: Sync these types with real DB schema when credit tables are created

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

export type CreditPackage = {
  id: string;
  name: string;
  credits: number;
  priceDisplay: string;
  description: string;
  isPopular?: boolean;
  badge: string;
  features: string[];
};

export type CreditWarningState = "ok" | "low" | "critical" | "empty";
