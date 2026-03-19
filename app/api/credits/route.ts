import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // user_quotas oku
    let { data: quota } = await supabase
      .from("user_quotas")
      .select("credits_remaining, is_active, plan, tier, expires_at")
      .eq("user_id", user.id)
      .maybeSingle();

    // Kaydı yoksa otomatik oluştur (eski kullanıcılar için)
    if (!quota) {
      await supabase.from("user_quotas").upsert(
        {
          user_id: user.id,
          credits_remaining: 20,
          is_active: true,
          plan: "free_trial",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

      const { data: newQuota } = await supabase
        .from("user_quotas")
        .select("credits_remaining, is_active, plan, tier, expires_at")
        .eq("user_id", user.id)
        .maybeSingle();

      quota = newQuota;
    }

    const [logsRes, txRes] = await Promise.all([
      supabase
        .from("usage_logs")
        .select("meter, amount, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("transactions")
        .select("type, amount, description, status, created_at, provider")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    return NextResponse.json({
      credits: Number(quota?.credits_remaining ?? 0),
      isActive: quota?.is_active ?? false,
      exists: !!quota,
      plan: quota?.plan ?? null,
      expiresAt: quota?.expires_at ?? null,
      usageLogs: logsRes.data ?? [],
      transactions: txRes.data ?? [],
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
