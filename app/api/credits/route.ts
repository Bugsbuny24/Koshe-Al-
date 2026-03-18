import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { CreditTransaction } from "@/types/credit";

type UserQuotaRow = {
  credits_remaining: number | null;
  is_active: boolean | null;
  plan: string | null;
  tier: string | null;
  expires_at: string | null;
};

type UsageLogRow = {
  id: string;
  meter: string;
  amount: number;
  created_at: string | null;
};

type TransactionRow = {
  id: string;
  type: string;
  amount: number;
  balance_after: number | null;
  status: string | null;
  provider: string | null;
  description: string | null;
  created_at: string | null;
};

function mapUsageLogToCreditTransaction(
  row: UsageLogRow,
  userId: string
): CreditTransaction {
  return {
    id: row.id,
    userId,
    type: "debit",
    amount: row.amount,
    description: row.meter,
    createdAt: row.created_at ?? new Date().toISOString(),
  };
}

function mapTransactionRowToCreditTransaction(
  row: TransactionRow,
  userId: string
): CreditTransaction {
  return {
    id: row.id,
    userId,
    type: row.type === "credit" ? "credit" : "debit",
    amount: row.amount,
    description: row.description ?? row.provider ?? row.type,
    createdAt: row.created_at ?? new Date().toISOString(),
  };
}

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      { data: quota },
      { data: usageLogs },
      { data: transactions },
    ] = await Promise.all([
      supabase
        .from("user_quotas")
        .select("credits_remaining,is_active,plan,tier,expires_at")
        .eq("user_id", user.id)
        .maybeSingle<UserQuotaRow>(),
      supabase
        .from("usage_logs")
        .select("id,meter,amount,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10)
        .returns<UsageLogRow[]>(),
      supabase
        .from("transactions")
        .select("id,type,amount,balance_after,status,provider,description,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10)
        .returns<TransactionRow[]>(),
    ]);

    const mappedUsageLogs = (usageLogs ?? []).map((row) =>
      mapUsageLogToCreditTransaction(row, user.id)
    );
    const mappedTransactions = (transactions ?? []).map((row) =>
      mapTransactionRowToCreditTransaction(row, user.id)
    );

    return NextResponse.json({
      credits: Number(quota?.credits_remaining ?? 0),
      isActive: quota?.is_active === true,
      exists: quota !== null,
      plan: quota?.plan ?? null,
      expiresAt: quota?.expires_at ?? null,
      usageLogs: mappedUsageLogs,
      transactions: mappedTransactions,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch credits" },
      { status: 500 }
    );
  }
}
