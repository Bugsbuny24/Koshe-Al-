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

    if (error || !deal) return NextResponse.json({ error: 'Deal bulunamadı' }, { status: 404 });

    const [scopeRes, milestonesRes, escrowRes, activityRes, deliveriesRes, revisionsRes] = await Promise.all([
      supabase.from('deal_scope_snapshots').select('*').eq('deal_id', id).order('version', { ascending: false }).limit(1),
      supabase.from('deal_milestones').select('*').eq('deal_id', id).order('sort_order'),
      supabase.from('escrow_transactions').select('*').eq('deal_id', id).order('created_at', { ascending: false }).limit(1),
      supabase.from('deal_activity_logs').select('*').eq('deal_id', id).order('created_at', { ascending: false }).limit(10),
      supabase.from('deal_deliveries').select('id').eq('deal_id', id),
      supabase.from('deal_revisions').select('id').eq('deal_id', id),
    ]);

    return NextResponse.json({
      deal,
      scope: scopeRes.data?.[0] || null,
      milestones: milestonesRes.data || [],
      escrow: escrowRes.data?.[0] || null,
      activity: activityRes.data || [],
      deliveries_count: deliveriesRes.data?.length || 0,
      revisions_count: revisionsRes.data?.length || 0,
    });
  } catch (err) {
    console.error('Deal GET error:', err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
