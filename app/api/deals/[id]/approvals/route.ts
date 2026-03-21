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

    const { milestoneId, decision, note, approvedBy } = body as {
      milestoneId?: string;
      decision?: string;
      note?: string;
      approvedBy?: string;
    };

    if (!milestoneId) {
      return NextResponse.json({ success: false, error: 'Milestone ID gerekli' }, { status: 400 });
    }
    if (!decision || !['approved', 'rejected'].includes(decision)) {
      return NextResponse.json({ success: false, error: 'Karar "approved" veya "rejected" olmalı' }, { status: 400 });
    }

    // Verify milestone belongs to this deal
    const { data: milestone, error: msError } = await supabase
      .from('deal_milestones')
      .select('id, status')
      .eq('id', milestoneId)
      .eq('deal_id', id)
      .single();

    if (msError || !milestone) {
      return NextResponse.json({ success: false, error: 'Milestone bulunamadı' }, { status: 404 });
    }

    const { data: approval, error } = await supabase
      .from('deal_approvals')
      .insert({
        deal_id: id,
        milestone_id: milestoneId,
        approved_by: approvedBy || null,
        decision,
        note: note?.trim() || '',
      })
      .select()
      .single();

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    const newStatus = decision === 'approved' ? 'approved' : 'revision_requested';
    await supabase
      .from('deal_milestones')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', milestoneId);

    const eventType = decision === 'approved' ? 'milestone_approved' : 'milestone_rejected';
    await supabase.from('deal_activity_logs').insert({
      deal_id: id,
      actor_id: approvedBy || null,
      actor_type: 'user',
      event_type: eventType,
      payload_json: { milestone_id: milestoneId, decision, note: note?.trim() || '' },
    });

    return NextResponse.json({ success: true, approval }, { status: 201 });
  } catch (err) {
    console.error('Approvals POST error:', err);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}
