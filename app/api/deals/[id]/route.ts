import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = createSupabaseServer();

    const { data: deal, error } = await supabase
      .from('deals')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !deal) return NextResponse.json({ success: false, error: 'Deal bulunamadı' }, { status: 404 });

    const [scopeRes, milestonesRes, escrowRes, activityRes, deliveriesRes, revisionsRes, approvalsRes] = await Promise.all([
      supabase.from('deal_scope_snapshots').select('*').eq('deal_id', id).order('version', { ascending: false }).limit(1),
      supabase.from('deal_milestones').select('*').eq('deal_id', id).order('sort_order'),
      supabase.from('escrow_transactions').select('*').eq('deal_id', id).order('created_at', { ascending: false }).limit(1),
      supabase.from('deal_activity_logs').select('*').eq('deal_id', id).order('created_at', { ascending: false }).limit(20),
      supabase.from('deal_deliveries').select('id, milestone_id, created_at').eq('deal_id', id).order('created_at', { ascending: false }),
      supabase.from('deal_revisions').select('id, status').eq('deal_id', id),
      supabase.from('deal_approvals').select('id, milestone_id, decision, created_at').eq('deal_id', id).order('created_at', { ascending: false }),
    ]);

    const deliveries = deliveriesRes.data || [];
    const revisions = revisionsRes.data || [];
    const approvals = approvalsRes.data || [];

    const openRevisionsCount = revisions.filter((r) => r.status === 'open').length;
    const latestDelivery = deliveries[0] || null;
    const approvedMilestonesCount = (milestonesRes.data || []).filter((m) => m.status === 'approved' || m.status === 'released').length;

    return NextResponse.json({
      success: true,
      deal,
      scope: scopeRes.data?.[0] || null,
      milestones: milestonesRes.data || [],
      escrow: escrowRes.data?.[0] || null,
      activity: activityRes.data || [],
      deliveries_count: deliveries.length,
      revisions_count: revisions.length,
      open_revisions_count: openRevisionsCount,
      approved_milestones_count: approvedMilestonesCount,
      latest_delivery: latestDelivery,
      approvals,
    });
  } catch (err) {
    console.error('Deal GET error:', err);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}
