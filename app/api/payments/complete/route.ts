import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

const PLAN_CREDITS: Record<string, number> = {
  starter: 400,
  pro: 1500,
  ultra: 5000,
};

export async function POST(req: NextRequest) {
  const { paymentId, txid, userId, type, planId, packageId } = await req.json();

  const supabase = createSupabaseServer();

  // Pi API'ye complete isteği gönder
  await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
    method: 'POST',
    headers: { Authorization: `Key ${process.env.PI_API_KEY}` },
  });

  // Ödemeyi kaydet
  await supabase.from('pi_payments').upsert({
    payment_id: paymentId,
    txid,
    status: 'completed',
    completed_at: new Date().toISOString(),
    user_id: userId,
    payment_type: type,
    amount: 0,
    memo: '',
  });

  // Plan aktivasyonu
  if (type === 'subscription' && planId && userId) {
    const credits = PLAN_CREDITS[planId] ?? 0;
    await supabase.from('user_quotas').upsert(
      {
        user_id: userId,
        plan_id: planId,
        tier: planId,
        credits_total: credits,
        credits_remaining: credits,
        is_active: true,
        plan_started_at: new Date().toISOString(),
        plan_expires_at: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
      { onConflict: 'user_id' }
    );
  }

  // Ek kredi satın alma
  if (type === 'credits' && packageId && userId) {
    const PACKAGES: Record<string, number> = {
      pack_100: 100,
      pack_500: 500,
      pack_1000: 1000,
    };
    const credits = PACKAGES[packageId] ?? 0;
    if (credits > 0) {
      const { data: quota } = await supabase
        .from('user_quotas')
        .select('credits_remaining')
        .eq('user_id', userId)
        .single();

      await supabase
        .from('user_quotas')
        .update({
          credits_remaining: (quota?.credits_remaining ?? 0) + credits,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);
    }
  }

  return NextResponse.json({ success: true });
}
