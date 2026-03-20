import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const { paymentId } = await req.json();

  // Pi API'ye approve isteği gönder
  const piRes = await fetch(
    `https://api.minepi.com/v2/payments/${paymentId}/approve`,
    {
      method: 'POST',
      headers: {
        Authorization: `Key ${process.env.PI_API_KEY}`,
      },
    }
  );

  const supabase = createSupabaseServer();
  await supabase.from('pi_payments').upsert({
    payment_id: paymentId,
    status: 'approved',
    amount: 0,
    memo: '',
    payment_type: 'subscription',
    user_id: '00000000-0000-0000-0000-000000000000',
  });

  return NextResponse.json({ success: piRes.ok });
}
