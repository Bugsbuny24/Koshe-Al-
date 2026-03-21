import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = createSupabaseServer();
    const body = await req.json();
    const { milestoneId, decision, note, approvedBy } = body;

    if (!milestoneId || !decision) {
      return NextResponse.json({ error: 'Milestone ve karar gerekli' }, { status: 400 });
    }

    const { data: approval, error } = await supabase
      .from('deal_approvals')
      .insert({
        deal_id: id,
        milestone_id: milestoneId,
        approved_by: approvedBy || null,
        decision,
        note: note || '',
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const newStatus = decision === 'approved' ? 'approved' : 'revision_requested';
    await supabase.from('deal_milestones').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', milestoneId);

    await supabase.from('deal_activity_logs').insert({
      deal_id: id,
      actor_id: approvedBy || null,
      actor_type: 'user',
      event_type: decision === 'approved' ? 'milestone_approved' : 'milestone_rejected',
      payload_json: { milestone_id: milestoneId, decision, note },
    });

    return NextResponse.json({ approval }, { status: 201 });
  } catch (err) {
    console.error('Approvals POST error:', err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
