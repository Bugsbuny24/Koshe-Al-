import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { generateJson } from '@/lib/ai/gemini';
import { buildScopeLockPrompt } from '@/lib/ai/prompts';
import { AiScopeLockResult } from '@/types/deals';

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

    const { rawScopeText, lockedBy } = body as { rawScopeText?: string; lockedBy?: string };

    if (!rawScopeText?.trim()) {
      return NextResponse.json({ success: false, error: 'Scope metni gerekli' }, { status: 400 });
    }

    // Verify deal exists
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .select('id')
      .eq('id', id)
      .single();

    if (dealError || !deal) {
      return NextResponse.json({ success: false, error: 'Deal bulunamadı' }, { status: 404 });
    }

    const prompt = buildScopeLockPrompt(rawScopeText);
    const aiResult = await generateJson<AiScopeLockResult>(prompt);

    const { data: latest } = await supabase
      .from('deal_scope_snapshots')
      .select('version')
      .eq('deal_id', id)
      .order('version', { ascending: false })
      .limit(1);

    const nextVersion = (latest?.[0]?.version || 0) + 1;

    const { data: snapshot, error } = await supabase
      .from('deal_scope_snapshots')
      .insert({
        deal_id: id,
        version: nextVersion,
        summary: aiResult?.summary || '',
        deliverables_json: aiResult?.deliverables || [],
        exclusions_json: aiResult?.exclusions || [],
        revision_policy_json: aiResult?.revision_policy || [],
        acceptance_criteria_json: aiResult?.acceptance_criteria || [],
        locked_by: lockedBy || null,
        locked_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    const { error: statusError } = await supabase
      .from('deals')
      .update({ status: 'scoped', updated_at: new Date().toISOString() })
      .eq('id', id);

    if (statusError) {
      console.error('Deal status update error:', statusError);
    }

    await supabase.from('deal_activity_logs').insert({
      deal_id: id,
      actor_id: lockedBy || null,
      actor_type: 'user',
      event_type: 'scope_locked',
      payload_json: { version: nextVersion, summary: aiResult?.summary },
    });

    return NextResponse.json({ success: true, snapshot, aiResult });
  } catch (err) {
    console.error('Scope lock error:', err);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}
