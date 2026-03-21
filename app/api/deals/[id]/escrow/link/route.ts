import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = createSupabaseServer();
    const body = await req.json();
    const { provider, externalTransactionId, amount, currency } = body;

    if (!externalTransactionId?.trim()) {
      return NextResponse.json({ error: 'External transaction ID gerekli' }, { status: 400 });
    }

    const { data: escrow, error } = await supabase
      .from('escrow_transactions')
      .insert({
        deal_id: id,
        provider: provider || 'escrow.com',
        external_transaction_id: externalTransactionId,
        amount: amount || 0,
        currency: currency || 'USD',
        status: 'pending',
        funded_amount: 0,
        released_amount: 0,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabase.from('deals').update({ status: 'active', updated_at: new Date().toISOString() }).eq('id', id);

    await supabase.from('deal_activity_logs').insert({
      deal_id: id,
      actor_type: 'user',
      event_type: 'escrow_linked',
      payload_json: { provider, external_transaction_id: externalTransactionId, amount },
    });

    return NextResponse.json({ escrow }, { status: 201 });
  } catch (err) {
    console.error('Escrow link error:', err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
