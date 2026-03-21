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

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, deals: deals || [] });
  } catch (err) {
    console.error('Deals GET error:', err);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createSupabaseServer();

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Geçersiz istek gövdesi' }, { status: 400 });
    }

    const { title, buyerId, sellerId, totalAmount, currency } = body as {
      title?: string;
      buyerId?: string;
      sellerId?: string;
      totalAmount?: number;
      currency?: string;
    };

    if (!title?.trim()) {
      return NextResponse.json({ success: false, error: 'Başlık gerekli' }, { status: 400 });
    }

    const parsedAmount = Number(totalAmount) || 0;
    if (parsedAmount < 0) {
      return NextResponse.json({ success: false, error: 'Tutar negatif olamaz' }, { status: 400 });
    }

    const { data: deal, error } = await supabase
      .from('deals')
      .insert({
        title: title.trim(),
        buyer_id: buyerId || null,
        seller_id: sellerId || null,
        total_amount: parsedAmount,
        currency: currency || 'USD',
        status: 'draft',
      })
      .select()
      .single();

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    await supabase.from('deal_activity_logs').insert({
      deal_id: deal.id,
      actor_type: 'system',
      event_type: 'deal_created',
      payload_json: { title: deal.title },
    });

    return NextResponse.json({ success: true, deal }, { status: 201 });
  } catch (err) {
    console.error('Deals POST error:', err);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}
