import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; milestoneId: string }> }
) {
  try {
    const { id, milestoneId } = await params;
    const supabase = createSupabaseServer();
    const body = await req.json();
    const { title, description, amount, status, deadline } = body;

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (amount !== undefined) updates.amount = amount;
    if (status !== undefined) updates.status = status;
    if (deadline !== undefined) updates.deadline = deadline;

    const { data: milestone, error } = await supabase
      .from('deal_milestones')
      .update(updates)
      .eq('id', milestoneId)
      .eq('deal_id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabase.from('deal_activity_logs').insert({
      deal_id: id,
      actor_type: 'system',
      event_type: 'milestone_updated',
      payload_json: { milestone_id: milestoneId, updates },
    });

    return NextResponse.json({ milestone });
  } catch (err) {
    console.error('Milestone PATCH error:', err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
