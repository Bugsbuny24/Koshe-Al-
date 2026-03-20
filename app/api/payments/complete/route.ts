import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

const PLAN_CREDITS: Record<string, number> = {
  starter: 400,
  pro: 1500,
  ultra: 5000,
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: NextRequest) {
  try {
    const { paymentId, txid, userId, type, planId, packageId } = await req.json();

    if (!paymentId) {
      return jsonError('Missing paymentId', 400);
    }

    const apiKey = process.env.PI_API_KEY;
    if (!apiKey) {
      return jsonError('Missing PI_API_KEY', 500);
    }

    const supabase = createSupabaseServer();

    const piRes = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      {
        method: 'POST',
        headers: { Authorization: `Key ${apiKey}` },
      }
    );

    if (!piRes.ok) {
      const text = await piRes.text().catch(() => '');
      return jsonError(
        `Pi complete failed (${piRes.status})${text ? `: ${text}` : ''}`,
        502
      );
    }

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

    if (type === 'subscription' && planId && userId) {
      const credits = PLAN_CREDITS[planId] ?? 0;

      const { error: quotaError } = await supabase.from('user_quotas').upsert(
        {
          user_id: userId,
          plan_id: planId,
          tier: planId,
          plan: planId,
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

      if (quotaError) {
        return jsonError(`Quota update failed: ${quotaError.message}`, 500);
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          plan_id: planId,
          is_premium: true,
        })
        .eq('id', userId);

      if (profileError) {
        return jsonError(`Profile update failed: ${profileError.message}`, 500);
      }
    }

    if (type === 'credits' && packageId && userId) {
      const PACKAGES: Record<string, number> = {
        pack_100: 100,
        pack_500: 500,
        pack_1000: 1000,
      };

      const credits = PACKAGES[packageId] ?? 0;

      if (credits > 0) {
        const { data: quota, error: quotaReadError } = await supabase
          .from('user_quotas')
          .select('credits_remaining')
          .eq('user_id', userId)
          .single();

        if (quotaReadError) {
          return jsonError(`Quota read failed: ${quotaReadError.message}`, 500);
        }

        const { error: quotaUpdateError } = await supabase
          .from('user_quotas')
          .update({
            credits_remaining: (quota?.credits_remaining ?? 0) + credits,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId);

        if (quotaUpdateError) {
          return jsonError(`Quota credit update failed: ${quotaUpdateError.message}`, 500);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return jsonError(
      err instanceof Error ? err.message : 'Unexpected payment completion error',
      500
    );
  }
}
