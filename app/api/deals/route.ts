import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createSupabaseServer();
    const { data: deals, error } = await supabase
      .from('deals')
      .select(`
        *,
        deal_milestones(id, title, status, sort_order),
        escrow_transactions(id, status, funded_amount, released_amount)
      `)
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ deals: deals || [] });
  } catch (err) {
    console.error('Deals GET error:', err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createSupabaseServer();
    const body = await req.json();
    const { title, buyerId, sellerId, totalAmount, currency } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Başlık gerekli' }, { status: 400 });
    }

    const { data: deal, error } = await supabase
      .from('deals')
      .insert({
        title: title.trim(),
        buyer_id: buyerId || null,
        seller_id: sellerId || null,
        total_amount: totalAmount || 0,
        currency: currency || 'USD',
        status: 'draft',
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabase.from('deal_activity_logs').insert({
      deal_id: deal.id,
      actor_type: 'system',
      event_type: 'deal_created',
      payload_json: { title: deal.title },
    });

    return NextResponse.json({ deal }, { status: 201 });
  } catch (err) {
    console.error('Deals POST error:', err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
