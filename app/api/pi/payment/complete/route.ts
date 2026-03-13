import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await req.json();

    const paymentId = body?.paymentId;
    const txid = body?.txid;
    const metadata = body?.metadata || {};

    if (!paymentId || !txid) {
      return NextResponse.json(
        { error: "Eksik ödeme bilgisi." },
        { status: 400 }
      );
    }

    const userId = metadata.userId || null;
    const entitlement = metadata.entitlement || "single_language";
    const language = metadata.language || null;

    const { error: txError } = await supabase.from("transactions").insert({
      user_id: userId,
      type: "payment",
      status: "completed",
      provider: "pi",
      provider_ref: paymentId,
      description: metadata.description || "Pi payment",
      metadata: { txid, ...metadata },
      amount: metadata.amount || 0,
    });

    if (txError) {
      return NextResponse.json(
        { error: txError.message },
        { status: 500 }
      );
    }

    if (userId) {
      const quotaPayload =
        entitlement === "all_languages"
          ? {
              user_id: userId,
              plan: "all_languages",
              is_active: true,
              language: null,
              updated_at: new Date().toISOString(),
            }
          : entitlement === "premium_language"
          ? {
              user_id: userId,
              plan: "premium_language",
              is_active: true,
              language,
              updated_at: new Date().toISOString(),
            }
          : {
              user_id: userId,
              plan: "single_language",
              is_active: true,
              language,
              updated_at: new Date().toISOString(),
            };

      await supabase.from("user_quotas").upsert(quotaPayload, {
        onConflict: "user_id",
      });
    }

    return NextResponse.json({
      ok: true,
      entitlement,
      userId,
    });
  } catch (error) {
    console.error("Pi complete route error:", error);
    return NextResponse.json(
      { error: "Pi ödeme tamamlama hatası." },
      { status: 500 }
    );
  }
}
