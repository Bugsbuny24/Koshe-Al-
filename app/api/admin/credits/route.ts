import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type AdminCreditBody = {
  userId: string;
  amount: number;
  description?: string;
};

type ProfileRow = {
  role: string | null;
};

type QuotaRow = {
  credits_remaining: number | null;
};

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single<ProfileRow>();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await req.json()) as AdminCreditBody;
    const { userId, amount, description } = body;

    if (!userId || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "userId and positive amount are required" },
        { status: 400 }
      );
    }

    const { data: quota } = await supabase
      .from("user_quotas")
      .select("credits_remaining")
      .eq("user_id", userId)
      .maybeSingle<QuotaRow>();

    const current = Number(quota?.credits_remaining ?? 0);
    const newBalance = current + amount;

    const { error: upsertError } = await supabase
      .from("user_quotas")
      .upsert(
        {
          user_id: userId,
          credits_remaining: newBalance,
          is_active: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (upsertError) {
      return NextResponse.json(
        { error: "Failed to update quota" },
        { status: 500 }
      );
    }

    const { error: txError } = await supabase.from("transactions").insert({
      user_id: userId,
      type: "credit",
      amount,
      balance_after: newBalance,
      status: "completed",
      provider: "manual",
      description: description ?? "Admin kredi yüklemesi",
    });

    if (txError) {
      return NextResponse.json(
        { error: "Quota updated but transaction log failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, newBalance });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
