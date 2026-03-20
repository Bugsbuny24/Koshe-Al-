import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

const PLAN_CREDITS: Record<string, number> = {
  starter: 400,
  pro: 1500,
  ultra: 5000,
};

const CREDIT_PACKAGES: Record<string, number> = {
  pack_100: 100,
  pack_500: 500,
  pack_1000: 1000,
};

function jsonError(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(details ? { details } : {}),
    },
    { status }
  );
}

type CompleteBody = {
  paymentId?: string;
  txid?: string | null;
  userId?: string | null;
  type?: string;
  planId?: string | null;
  packageId?: string | null;
  amount?: number;
  memo?: string | null;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CompleteBody;

    const paymentId = body.paymentId?.trim();
    const txid =
      typeof body.txid === 'string' && body.txid.trim().length > 0
        ? body.txid.trim()
        : null;
    const userId =
      typeof body.userId === 'string' && body.userId.trim().length > 0
        ? body.userId.trim()
        : null;
    const type = body.type?.trim() || 'unknown';
    const planId = body.planId ?? null;
    const packageId = body.packageId ?? null;
    const amount =
      typeof body.amount === 'number' && Number.isFinite(body.amount)
        ? body.amount
        : null;
    const memo =
      typeof body.memo === 'string' && body.memo.trim().length > 0
        ? body.memo.trim()
        : null;

    if (!paymentId) {
      return jsonError('Missing paymentId', 400);
    }

    const apiKey = process.env.PI_API_KEY;
    if (!apiKey) {
      return jsonError('Missing PI_API_KEY', 500);
    }

    const supabase = createSupabaseServer();

    const completePayload = txid ? { txid } : {};

    const piRes = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      {
        method: 'POST',
        headers: {
          Authorization: `Key ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completePayload),
      }
    );

    if (!piRes.ok) {
      const text = await piRes.text().catch(() => '');
      return jsonError(
        `Pi complete failed (${piRes.status})${text ? `: ${text}` : ''}`,
        502
      );
    }

    if (!userId) {
      return jsonError(
        'Payment was completed on Pi side but local userId is missing. Recovery data is insufficient.',
        400
      );
    }

    const paymentUpsertPayload = {
      payment_id: paymentId,
      txid,
      user_id: userId,
      payment_type: type,
      plan_id: planId,
      package_id: packageId,
      amount: amount ?? 0,
      memo,
      status: 'completed',
      completed_at: new Date().toISOString(),
    };

    const { error: paymentError } = await supabase.from('pi_payments').upsert(
      paymentUpsertPayload,
      {
        onConflict: 'payment_id',
      }
    );

    if (paymentError) {
      return jsonError(`Failed to save completed payment: ${paymentError.message}`, 500);
    }

    if (type === 'subscription') {
      if (!planId) {
        return jsonError('Missing planId for subscription payment', 400);
      }

      const credits = PLAN_CREDITS[planId];
      if (!credits) {
        return jsonError(`Unknown subscription plan: ${planId}`, 400);
      }

      const now = new Date();
      const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const { error: quotaError } = await supabase.from('user_quotas').upsert(
        {
          user_id: userId,
          plan_id: planId,
          tier: planId,
          plan: planId,
          credits_total: credits,
          credits_remaining: credits,
          is_active: true,
          plan_started_at: now.toISOString(),
          plan_expires_at: expiresAt.toISOString(),
          updated_at: now.toISOString(),
        },
        {
          onConflict: 'user_id',
        }
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

    if (type === 'credits') {
      if (!packageId) {
        return jsonError('Missing packageId for credit payment', 400);
      }

      const creditsToAdd = CREDIT_PACKAGES[packageId];
      if (!creditsToAdd) {
        return jsonError(`Unknown credit package: ${packageId}`, 400);
      }

      const { data: existingQuota, error: quotaReadError } = await supabase
        .from('user_quotas')
        .select('user_id, credits_remaining, credits_total, plan_id, plan, tier, is_active')
        .eq('user_id', userId)
        .maybeSingle();

      if (quotaReadError) {
        return jsonError(`Quota read failed: ${quotaReadError.message}`, 500);
      }

      if (!existingQuota) {
        const { error: quotaCreateError } = await supabase.from('user_quotas').upsert(
          {
            user_id: userId,
            credits_total: creditsToAdd,
            credits_remaining: creditsToAdd,
            is_active: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

        if (quotaCreateError) {
          return jsonError(`Quota create failed: ${quotaCreateError.message}`, 500);
        }
      } else {
        const { error: quotaUpdateError } = await supabase
          .from('user_quotas')
          .update({
            credits_total: Number(existingQuota.credits_total ?? 0) + creditsToAdd,
            credits_remaining: Number(existingQuota.credits_remaining ?? 0) + creditsToAdd,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId);

        if (quotaUpdateError) {
          return jsonError(`Quota credit update failed: ${quotaUpdateError.message}`, 500);
        }
      }
    }

    return NextResponse.json({
      success: true,
      paymentId,
      txid,
      appliedPlan: planId ?? null,
    });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : 'Unexpected payment completion error',
      500
    );
  }
  }
