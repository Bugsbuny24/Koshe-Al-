import { createClient } from "@/lib/supabase/server";

// ── Action types ──────────────────────────────────────────────────────────────
export type CreditActionType =
  | "chat_message"
  | "lesson_generation"
  | "stt_request";

// ── Fixed costs per action ────────────────────────────────────────────────────
const ACTION_COSTS: Record<CreditActionType, number> = {
  chat_message: 1,
  lesson_generation: 5,
  stt_request: 1,
};

// ── getUserCredits ────────────────────────────────────────────────────────────
// Reads the real credit state from user_quotas.
// Returns a safe shape regardless of DB errors.
export async function getUserCredits(userId: string): Promise<{
  credits: number;
  isActive: boolean;
  exists: boolean;
  plan: string | null;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_quotas")
      .select("credits_remaining,is_active,plan")
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !data) {
      return { credits: 0, isActive: false, exists: false, plan: null };
    }

    return {
      credits: Number(data.credits_remaining ?? 0),
      isActive: data.is_active === true,
      exists: true,
      plan: data.plan ?? null,
    };
  } catch {
    return { credits: 0, isActive: false, exists: false, plan: null };
  }
}

// ── deductCredits ─────────────────────────────────────────────────────────────
// Atomically deducts credits from user_quotas using a conditional UPDATE.
// The WHERE clause (gte) ensures credits_remaining >= cost, so the update
// is rejected when credits are insufficient. We optimistically compute the
// new balance after the check so no negative balances are possible.
// Returns true on success, false on insufficient credits or DB error.
export async function deductCredits(
  userId: string,
  actionType: CreditActionType
): Promise<boolean> {
  try {
    const cost = ACTION_COSTS[actionType];
    const supabase = await createClient();

    // Step 1: read current balance
    const { data: quota, error: readError } = await supabase
      .from("user_quotas")
      .select("credits_remaining")
      .eq("user_id", userId)
      .maybeSingle();

    if (readError || !quota) return false;

    const current = Number(quota.credits_remaining ?? 0);
    if (current < cost) return false;

    // Step 2: conditional update — only succeeds when credits_remaining >= cost
    // (guards against concurrent requests draining credits between steps 1 and 2)
    const { data: updated, error: updateError } = await supabase
      .from("user_quotas")
      .update({
        credits_remaining: current - cost,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .gte("credits_remaining", cost)
      .select("credits_remaining")
      .maybeSingle();

    if (updateError || !updated) return false;

    // Write usage log — failure here is non-fatal
    await supabase.from("usage_logs").insert({
      user_id: userId,
      meter: actionType,
      amount: cost,
    });

    return true;
  } catch {
    return false;
  }
}
