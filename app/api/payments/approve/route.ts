import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

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

type ApproveBody = {
  paymentId?: string;
  userId?: string;
  type?: string;
  planId?: string | null;
  packageId?: string | null;
  amount?: number;
  memo?: string | null;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ApproveBody;

    const paymentId = body.paymentId?.trim();
    const userId = body.userId?.trim();
    const type = body.type?.trim() || 'subscription';
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

    if (!userId) {
      return jsonError('Missing userId', 400);
    }

    if (amount === null) {
      return jsonError('Missing or invalid amount', 400);
    }

    const apiKey = process.env.PI_API_KEY;
    if (!apiKey) {
      return jsonError('Missing PI_API_KEY', 500);
    }

    const piRes = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {
        method: 'POST',
        headers: {
          Authorization: `Key ${apiKey}`,
        },
      }
    );

    if (!piRes.ok) {
      const text = await piRes.text().catch(() => '');
      return jsonError(
        `Pi approve failed (${piRes.status})${text ? `: ${text}` : ''}`,
        502
      );
    }

    const supabase = createSupabaseServer();

    const { error: paymentError } = await supabase.from('pi_payments').upsert(
      {
        payment_id: paymentId,
        user_id: userId,
        payment_type: type,
        plan_id: planId,
        package_id: packageId,
        amount,
        memo,
        status: 'approved',
        approved_at: new Date().toISOString(),
      },
      {
        onConflict: 'payment_id',
      }
    );

    if (paymentError) {
      return jsonError(`Failed to save approved payment: ${paymentError.message}`, 500);
    }

    return NextResponse.json({
      success: true,
      paymentId,
    });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : 'Unexpected payment approve error',
      500
    );
  }
}
