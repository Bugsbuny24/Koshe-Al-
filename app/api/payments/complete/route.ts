import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const { paymentId, txid, userId, type, planId, packageId } = await req.json();

  const supabase = createSupabaseServer();

  // Pi payments tablosunu güncelle
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

  // Plan satın alma
  if (type === 'subscription' && planId) {
    await supabase.rpc('activate_plan', { uid: userId, plan: planId });
  }

  // Ek kredi satın alma
  if (type === 'credits' && packageId) {
    const PACKAGES: Record<string, number> = {
      pack_100:  100,
      pack_500:  500,
      pack_1000: 1000,
    };
    const credits = PACKAGES[packageId] ?? 0;
    if (credits > 0) {
      await supabase
        .from('user_quotas')
        .update({
          credits_remaining: supabase.rpc('increment_credits', { uid: userId, amount: credits }) as never,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);
    }
  }

  return NextResponse.json({ success: true });
}
