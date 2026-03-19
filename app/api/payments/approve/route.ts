import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const { paymentId } = await req.json();

  if (!paymentId) {
    return NextResponse.json({ error: 'Payment ID required' }, { status: 400 });
  }

  const supabase = createSupabaseServer();

  // Pi API'ye approve isteği gönder
  const res = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
    method: 'POST',
    headers: {
      Authorization: `Key ${process.env.PI_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Pi approval failed' }, { status: 500 });
  }

  const piPayment = await res.json();

  // Pi payments tablosuna kaydet
  await supabase.from('pi_payments').upsert({
    payment_id: paymentId,
    status: 'approved',
    amount: piPayment.amount || 0,
    memo: piPayment.memo || '',
    payment_type: 'course',
    user_id: piPayment.user_uid || '',
  }, { onConflict: 'payment_id' });

  return NextResponse.json({ success: true });
}
