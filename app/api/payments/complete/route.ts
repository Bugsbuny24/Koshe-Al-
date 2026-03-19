import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const { paymentId, txid } = await req.json();

  if (!paymentId || !txid) {
    return NextResponse.json({ error: 'Payment ID and txid required' }, { status: 400 });
  }

  const supabase = createSupabaseServer();

  // Pi API'ye complete isteği gönder
  const res = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
    method: 'POST',
    headers: {
      Authorization: `Key ${process.env.PI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ txid }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Pi completion failed' }, { status: 500 });
  }

  // Update payment status
  await supabase
    .from('pi_payments')
    .update({ status: 'completed', txid, completed_at: new Date().toISOString() })
    .eq('payment_id', paymentId);

  return NextResponse.json({ success: true });
}
