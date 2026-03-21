import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { generateJson } from '@/lib/ai/gemini';
import { buildRevisionParsePrompt } from '@/lib/ai/prompts';
import { AiRevisionParseResult } from '@/types/deals';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = createSupabaseServer();
    const { data, error } = await supabase
      .from('deal_revisions')
      .select('*')
      .eq('deal_id', id)
      .order('created_at', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ revisions: data || [] });
  } catch (err) {
    console.error('Revisions GET error:', err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = createSupabaseServer();
    const body = await req.json();
    const { milestoneId, rawFeedback } = body;

    if (!rawFeedback?.trim()) {
      return NextResponse.json({ error: 'Geri bildirim gerekli' }, { status: 400 });
    }

    const { data: scope } = await supabase
      .from('deal_scope_snapshots')
      .select('summary')
      .eq('deal_id', id)
      .order('version', { ascending: false })
      .limit(1);
    const scopeSummary = scope?.[0]?.summary || '';

    const prompt = buildRevisionParsePrompt(rawFeedback, scopeSummary);
    const aiResult = await generateJson<AiRevisionParseResult>(prompt);

    const { data: revision, error } = await supabase
      .from('deal_revisions')
      .insert({
        deal_id: id,
        milestone_id: milestoneId || null,
        raw_feedback: rawFeedback,
        parsed_feedback_json: aiResult,
        scope_status: aiResult?.scope_status || 'in_scope',
        action_items_json: aiResult?.action_items || [],
        status: 'open',
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (milestoneId) {
      await supabase.from('deal_milestones').update({ status: 'revision_requested', updated_at: new Date().toISOString() }).eq('id', milestoneId);
    }

    await supabase.from('deal_activity_logs').insert({
      deal_id: id,
      actor_type: 'user',
      event_type: 'revision_requested',
      payload_json: { milestone_id: milestoneId, scope_status: aiResult?.scope_status },
    });

    return NextResponse.json({ revision, aiResult }, { status: 201 });
  } catch (err) {
    console.error('Revisions POST error:', err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
