import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { generateJson } from '@/lib/ai/gemini';
import { buildMilestonePlanPrompt } from '@/lib/ai/prompts';
import { AiMilestonePlanResult } from '@/types/deals';

const TEMPLATES: Record<string, { title: string; description: string; pct: number }[]> = {
  standard: [
    { title: 'Başlangıç', description: 'Proje başlangıç ödemesi', pct: 20 },
    { title: 'Orta Teslim', description: 'Ara teslim ödemesi', pct: 40 },
    { title: 'Final Teslim', description: 'Final teslim ödemesi', pct: 40 },
  ],
  fast: [
    { title: 'Ön Ödeme', description: 'Proje başlangıç ödemesi', pct: 50 },
    { title: 'Teslim Ödemesi', description: 'Final teslim ödemesi', pct: 50 },
  ],
  iterative: [
    { title: 'Sprint 1', description: '1. sprint ödemesi', pct: 25 },
    { title: 'Sprint 2', description: '2. sprint ödemesi', pct: 25 },
    { title: 'Sprint 3', description: '3. sprint ödemesi', pct: 25 },
    { title: 'Sprint 4', description: '4. sprint ödemesi', pct: 25 },
  ],
};

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = createSupabaseServer();
    const { data: milestones, error } = await supabase
      .from('deal_milestones')
      .select('*')
      .eq('deal_id', id)
      .order('sort_order');

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ milestones: milestones || [] });
  } catch (err) {
    console.error('Milestones GET error:', err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = createSupabaseServer();
    const body = await req.json();
    const { mode, rawPlanText, milestones: manualMilestones, template } = body;

    const { data: deal } = await supabase.from('deals').select('total_amount').eq('id', id).single();
    const totalAmount = deal?.total_amount || 0;

    let milestonesToInsert: { title: string; description: string; amount: number; sort_order: number }[] = [];

    if (mode === 'ai') {
      const { data: scope } = await supabase
        .from('deal_scope_snapshots')
        .select('summary')
        .eq('deal_id', id)
        .order('version', { ascending: false })
        .limit(1);
      const summary = scope?.[0]?.summary || rawPlanText || '';
      const prompt = buildMilestonePlanPrompt(summary, totalAmount, 'standard');
      const aiResult = await generateJson<AiMilestonePlanResult>(prompt);
      milestonesToInsert = (aiResult?.milestones || []).map((m) => ({
        title: m.title,
        description: m.description,
        amount: m.amount,
        sort_order: m.sort_order,
      }));
    } else if (template && TEMPLATES[template]) {
      milestonesToInsert = TEMPLATES[template].map((t, i) => ({
        title: t.title,
        description: t.description,
        amount: Math.round((totalAmount * t.pct) / 100),
        sort_order: i + 1,
      }));
    } else if (manualMilestones && Array.isArray(manualMilestones)) {
      milestonesToInsert = manualMilestones.map((m, i) => ({
        title: m.title,
        description: m.description || '',
        amount: m.amount || 0,
        sort_order: m.sort_order || i + 1,
      }));
    } else {
      return NextResponse.json({ error: 'Geçersiz mod' }, { status: 400 });
    }

    const inserts = milestonesToInsert.map((m) => ({ ...m, deal_id: id, status: 'pending' }));
    const { data: created, error } = await supabase.from('deal_milestones').insert(inserts).select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabase.from('deal_activity_logs').insert({
      deal_id: id,
      actor_type: 'system',
      event_type: 'milestones_created',
      payload_json: { count: created?.length, mode: mode || template },
    });

    return NextResponse.json({ milestones: created }, { status: 201 });
  } catch (err) {
    console.error('Milestones POST error:', err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
