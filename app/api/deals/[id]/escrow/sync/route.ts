import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { ESCROW_STATUS_LABEL } from '@/lib/deals/status';

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

    const { status, fundedAmount, releasedAmount, eventType, payload } = body as {
      status?: string;
      fundedAmount?: number;
      releasedAmount?: number;
      eventType?: string;
      payload?: Record<string, unknown>;
    };

    const { data: latest } = await supabase
      .from('escrow_transactions')
      .select('id, funded_amount, released_amount, amount')
      .eq('deal_id', id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (!latest?.[0]?.id) {
      return NextResponse.json({ success: false, error: 'Escrow transaction bulunamadı' }, { status: 404 });
    }

    const escrowId = latest[0].id;
    const currentFunded = latest[0].funded_amount ?? 0;
    const currentReleased = latest[0].released_amount ?? 0;
    const escrowTotal = latest[0].amount ?? 0;

    const newFunded = fundedAmount !== undefined ? Number(fundedAmount) : currentFunded;
    const newReleased = releasedAmount !== undefined ? Number(releasedAmount) : currentReleased;

    // Validation
    if (newFunded < 0) {
      return NextResponse.json({ success: false, error: 'Funded amount negatif olamaz' }, { status: 400 });
    }
    if (newReleased < 0) {
      return NextResponse.json({ success: false, error: 'Released amount negatif olamaz' }, { status: 400 });
    }
    if (newReleased > newFunded) {
      return NextResponse.json(
        { success: false, error: 'Released amount, funded amount\'dan büyük olamaz' },
        { status: 400 }
      );
    }
    if (newFunded > escrowTotal && escrowTotal > 0) {
      return NextResponse.json(
        { success: false, error: 'Funded amount, toplam escrow tutarından büyük olamaz' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const updates: Record<string, unknown> = {
      updated_at: now,
      last_synced_at: now,
    };
    if (status) updates.status = status;
    if (fundedAmount !== undefined) updates.funded_amount = newFunded;
    if (releasedAmount !== undefined) updates.released_amount = newReleased;

    const { error: updateError } = await supabase
      .from('escrow_transactions')
      .update(updates)
      .eq('id', escrowId);

    if (updateError) {
      return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
    }

    await supabase.from('escrow_events').insert({
      escrow_transaction_id: escrowId,
      external_event_type: eventType || 'manual_sync',
      payload_json: { ...(payload || {}), synced_at: now },
    });

    await supabase.from('deal_activity_logs').insert({
      deal_id: id,
      actor_type: 'system',
      event_type: 'escrow_synced',
      payload_json: {
        status,
        funded_amount: newFunded,
        released_amount: newReleased,
        label: status ? (ESCROW_STATUS_LABEL[status] || status) : undefined,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Escrow sync error:', err);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}
