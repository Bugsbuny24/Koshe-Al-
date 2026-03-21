import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = createSupabaseServer();

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Geçersiz istek gövdesi' }, { status: 400 });
    }

    const { provider, externalTransactionId, amount, currency } = body as {
      provider?: string;
      externalTransactionId?: string;
      amount?: number;
      currency?: string;
    };

    if (!externalTransactionId?.trim()) {
      return NextResponse.json({ success: false, error: 'External transaction ID gerekli' }, { status: 400 });
    }

    const parsedAmount = Number(amount) || 0;
    if (parsedAmount < 0) {
      return NextResponse.json({ success: false, error: 'Tutar negatif olamaz' }, { status: 400 });
    }

    // Verify deal exists
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .select('id, status')
      .eq('id', id)
      .single();

    if (dealError || !deal) {
      return NextResponse.json({ success: false, error: 'Deal bulunamadı' }, { status: 404 });
    }

    const { data: escrow, error } = await supabase
      .from('escrow_transactions')
      .insert({
        deal_id: id,
        provider: provider?.trim() || 'escrow.com',
        external_transaction_id: externalTransactionId.trim(),
        amount: parsedAmount,
        currency: currency || 'USD',
        status: 'pending',
        funded_amount: 0,
        released_amount: 0,
      })
      .select()
      .single();

    if (error) {
      // Detect duplicate external_transaction_id (unique constraint violation)
      if (error.code === '23505') {
        return NextResponse.json({ success: false, error: 'Bu transaction ID zaten kullanılıyor' }, { status: 409 });
      }
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    await supabase.from('deal_activity_logs').insert({
      deal_id: id,
      actor_type: 'user',
      event_type: 'escrow_linked',
      payload_json: {
        provider: provider?.trim() || 'escrow.com',
        external_transaction_id: externalTransactionId.trim(),
        amount: parsedAmount,
      },
    });

    return NextResponse.json({ success: true, escrow }, { status: 201 });
  } catch (err) {
    console.error('Escrow link error:', err);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}
