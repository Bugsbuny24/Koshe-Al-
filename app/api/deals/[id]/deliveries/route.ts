import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = createSupabaseServer();
    const { data, error } = await supabase
      .from('deal_deliveries')
      .select('*')
      .eq('deal_id', id)
      .order('created_at', { ascending: false });
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, deliveries: data || [] });
  } catch (err) {
    console.error('Deliveries GET error:', err);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}

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

    const { milestoneId, deliveryType, assetUrl, note, uploadedBy } = body as {
      milestoneId?: string;
      deliveryType?: string;
      assetUrl?: string;
      note?: string;
      uploadedBy?: string;
    };

    if (!milestoneId) {
      return NextResponse.json({ success: false, error: 'Milestone ID gerekli' }, { status: 400 });
    }
    if (!assetUrl?.trim()) {
      return NextResponse.json({ success: false, error: 'Asset URL gerekli' }, { status: 400 });
    }

    // Verify milestone belongs to this deal
    const { data: milestone, error: msError } = await supabase
      .from('deal_milestones')
      .select('id')
      .eq('id', milestoneId)
      .eq('deal_id', id)
      .single();

    if (msError || !milestone) {
      return NextResponse.json({ success: false, error: 'Milestone bulunamadı' }, { status: 404 });
    }

    const { data: latest } = await supabase
      .from('deal_deliveries')
      .select('version')
      .eq('deal_id', id)
      .eq('milestone_id', milestoneId)
      .order('version', { ascending: false })
      .limit(1);
    const nextVersion = (latest?.[0]?.version || 0) + 1;

    const { data: delivery, error } = await supabase
      .from('deal_deliveries')
      .insert({
        deal_id: id,
        milestone_id: milestoneId,
        delivery_type: deliveryType || 'other',
        asset_url: assetUrl.trim(),
        note: note?.trim() || '',
        version: nextVersion,
        uploaded_by: uploadedBy || null,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    await supabase
      .from('deal_milestones')
      .update({ status: 'delivered', updated_at: new Date().toISOString() })
      .eq('id', milestoneId);

    await supabase.from('deal_activity_logs').insert({
      deal_id: id,
      actor_id: uploadedBy || null,
      actor_type: 'user',
      event_type: 'delivery_uploaded',
      payload_json: { milestone_id: milestoneId, delivery_type: deliveryType, version: nextVersion },
    });

    return NextResponse.json({ success: true, delivery }, { status: 201 });
  } catch (err) {
    console.error('Deliveries POST error:', err);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}
