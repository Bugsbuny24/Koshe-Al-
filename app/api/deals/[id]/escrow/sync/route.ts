import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = createSupabaseServer();
    const body = await req.json();
    const { status, fundedAmount, releasedAmount, eventType, payload } = body;

    const { data: latest } = await supabase
      .from('escrow_transactions')
      .select('id')
      .eq('deal_id', id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (!latest?.[0]?.id) {
      return NextResponse.json({ error: 'Escrow transaction bulunamadı' }, { status: 404 });
    }

    const escrowId = latest[0].id;
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (status) updates.status = status;
    if (fundedAmount !== undefined) updates.funded_amount = fundedAmount;
    if (releasedAmount !== undefined) updates.released_amount = releasedAmount;

    await supabase.from('escrow_transactions').update(updates).eq('id', escrowId);

    await supabase.from('escrow_events').insert({
      escrow_transaction_id: escrowId,
      external_event_type: eventType || 'manual_sync',
      payload_json: payload || {},
    });

    await supabase.from('deal_activity_logs').insert({
      deal_id: id,
      actor_type: 'system',
      event_type: 'escrow_synced',
      payload_json: { status, funded_amount: fundedAmount, released_amount: releasedAmount },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Escrow sync error:', err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
