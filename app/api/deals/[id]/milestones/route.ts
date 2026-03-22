import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { generateJson } from '@/lib/common/gemini';
import { buildMilestonePlanPrompt } from '@/lib/common/prompts';
import { buildMilestonesFromTemplate, isMilestoneTemplateKey } from '@/lib/deals/milestoneTemplates';
import { AiMilestonePlanResult } from '@/types/deals';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = createSupabaseServer();
    const { data: milestones, error } = await supabase
      .from('deal_milestones')
      .select('*')
      .eq('deal_id', id)
      .order('sort_order');

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, milestones: milestones || [] });
  } catch (err) {
    console.error('Milestones GET error:', err);
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

    const { mode, rawPlanText, milestones: manualMilestones, template } = body as {
      mode?: string;
      rawPlanText?: string;
      milestones?: { title: string; description?: string; amount?: number; sort_order?: number }[];
      template?: string;
    };

    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .select('total_amount, status')
      .eq('id', id)
      .single();

    if (dealError || !deal) {
      return NextResponse.json({ success: false, error: 'Deal bulunamadı' }, { status: 404 });
    }

    const totalAmount = deal.total_amount || 0;
    let milestonesToInsert: { title: string; description: string; amount: number; sort_order: number }[] = [];

    if (mode === 'ai') {
      const { data: scope } = await supabase
        .from('deal_scope_snapshots')
        .select('summary')
        .eq('deal_id', id)
        .order('version', { ascending: false })
        .limit(1);
      const summary = scope?.[0]?.summary || (rawPlanText as string) || '';
      const prompt = buildMilestonePlanPrompt(summary, totalAmount, 'standard');
      const aiResult = await generateJson<AiMilestonePlanResult>(prompt);
      milestonesToInsert = (aiResult?.milestones || []).map((m) => ({
        title: m.title,
        description: m.description,
        amount: m.amount,
        sort_order: m.sort_order,
      }));
    } else if (template && isMilestoneTemplateKey(template)) {
      milestonesToInsert = buildMilestonesFromTemplate(template, totalAmount);
    } else if (manualMilestones && Array.isArray(manualMilestones)) {
      milestonesToInsert = manualMilestones.map((m, i) => ({
        title: m.title || `Milestone ${i + 1}`,
        description: m.description || '',
        amount: m.amount || 0,
        sort_order: m.sort_order || i + 1,
      }));
    } else {
      return NextResponse.json({ success: false, error: 'Geçersiz mod veya şablon' }, { status: 400 });
    }

    if (milestonesToInsert.length === 0) {
      return NextResponse.json({ success: false, error: 'Oluşturulacak milestone bulunamadı' }, { status: 400 });
    }

    const inserts = milestonesToInsert.map((m) => ({ ...m, deal_id: id, status: 'in_progress' }));
    const { data: created, error } = await supabase.from('deal_milestones').insert(inserts).select();

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    // Advance deal to in_progress when milestones are created (if still at scoped/draft)
    if (deal.status === 'scoped' || deal.status === 'draft') {
      const { error: statusError } = await supabase
        .from('deals')
        .update({ status: 'in_progress', updated_at: new Date().toISOString() })
        .eq('id', id);
      if (statusError) {
        console.error('Deal status update error:', statusError);
      }
    }

    await supabase.from('deal_activity_logs').insert({
      deal_id: id,
      actor_type: 'system',
      event_type: 'milestones_created',
      payload_json: { count: created?.length, mode: mode || template },
    });

    return NextResponse.json({ success: true, milestones: created }, { status: 201 });
  } catch (err) {
    console.error('Milestones POST error:', err);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}
