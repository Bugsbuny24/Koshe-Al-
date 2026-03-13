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
      return NextResponse.json({ error: "Eksik ödeme bilgisi." }, { status: 400 });
    }

    await supabase.from("transactions").insert({
      user_id: metadata.userId || null,
      type: "payment",
      status: "completed",
      provider: "pi",
      provider_ref: paymentId,
      description: metadata.description || "Pi payment",
      metadata: { txid, ...metadata },
      amount: metadata.amount || 0,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Ödeme kaydedilemedi." }, { status: 500 });
  }
}
