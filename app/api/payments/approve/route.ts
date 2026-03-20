import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return jsonError('Invalid JSON body', 400);
    }

    const { paymentId, userId, type, planId, packageId, amount, memo } =
      body as Record<string, unknown>;

    if (!paymentId || typeof paymentId !== 'string') {
      return jsonError('Missing or invalid paymentId', 400);
    }

    const apiKey = process.env.PI_API_KEY;
    if (!apiKey) {
      return jsonError('Server configuration error: missing PI_API_KEY', 500);
    }

    // Approve payment on Pi Network
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

    // Persist payment record only when a real userId is available
    if (userId && typeof userId === 'string') {
      const supabase = createSupabaseServer();
      let referenceId: string | null = null;
      if (typeof planId === 'string') referenceId = planId;
      else if (typeof packageId === 'string') referenceId = packageId;

      const { error: upsertError } = await supabase
        .from('pi_payments')
        .upsert(
          {
            payment_id: paymentId,
            status: 'approved',
            user_id: userId,
            amount: typeof amount === 'number' ? amount : 0,
            memo: typeof memo === 'string' ? memo : null,
            payment_type: typeof type === 'string' ? type : 'subscription',
            reference_id: referenceId,
          },
          { onConflict: 'payment_id' }
        );

      if (upsertError) {
        // Payment was approved on Pi side; log but do not block the response
        console.error('Supabase upsert error during approve:', upsertError.message);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return jsonError(
      err instanceof Error ? err.message : 'Unexpected error during payment approval',
      500
    );
  }
}
