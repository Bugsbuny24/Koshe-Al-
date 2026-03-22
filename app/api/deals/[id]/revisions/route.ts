import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase/server';
import { generateJson } from '@/lib/common/gemini';
import { buildRevisionParsePrompt } from '@/lib/common/prompts';
import { AiRevisionParseResult, DealRevision } from '@/types/deals';
import { mapDealRevisionToExecution } from '@/lib/flow/mapDealRevisionToExecution';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from('deal_revisions')
      .select('*')
      .eq('deal_id', id)
      .order('created_at', { ascending: false });
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, revisions: data || [] });
  } catch (err) {
    console.error('Revisions GET error:', err);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = createSupabaseAdmin();

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Geçersiz istek gövdesi' }, { status: 400 });
    }

    const { milestoneId, rawFeedback } = body as { milestoneId?: string; rawFeedback?: string };

    if (!rawFeedback?.trim()) {
      return NextResponse.json({ success: false, error: 'Geri bildirim gerekli' }, { status: 400 });
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
        raw_feedback: rawFeedback.trim(),
        parsed_feedback_json: aiResult,
        scope_status: aiResult?.scope_status || 'in_scope',
        action_items_json: aiResult?.action_items || [],
        status: 'open',
      })
      .select()
      .single();

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    if (milestoneId) {
      await supabase
        .from('deal_milestones')
        .update({ status: 'revision_requested', updated_at: new Date().toISOString() })
        .eq('id', milestoneId);
    }

    await supabase.from('deal_activity_logs').insert({
      deal_id: id,
      actor_type: 'user',
      event_type: 'revision_requested',
      payload_json: { milestone_id: milestoneId, scope_status: aiResult?.scope_status },
    });

    // ── Back-link revision feedback to execution run ──────────────────────────
    // Find an execution run linked to this deal and append the revision note.
    try {
      const { data: linkedRuns } = await supabase
        .from('execution_runs')
        .select('id, revision_notes_json')
        .eq('deal_id', id)
        .limit(1);

      const linkedRun = linkedRuns?.[0];
      if (linkedRun && revision) {
        const revisionData = revision as DealRevision;
        const summary = mapDealRevisionToExecution(revisionData);

        const revisionNote = {
          type: 'deal_revision' as const,
          deal_id: id,
          revision_id: revisionData.id,
          created_at: revisionData.created_at,
          milestone_id: milestoneId ?? null,
          summary: summary.summary,
          requested_changes: aiResult?.requested_changes ?? [],
          action_items: summary.action_items,
          severity: (summary.scope_impact ? 'high' : 'low') as 'low' | 'medium' | 'high',
        };

        // Existing notes — safely parse as array, then append
        let existing: unknown[] = [];
        if (Array.isArray(linkedRun.revision_notes_json)) {
          existing = linkedRun.revision_notes_json as unknown[];
        } else if (linkedRun.revision_notes_json !== null && linkedRun.revision_notes_json !== undefined && typeof linkedRun.revision_notes_json === 'object') {
          existing = [linkedRun.revision_notes_json];
        }

        await supabase
          .from('execution_runs')
          .update({ revision_notes_json: [...existing, revisionNote] })
          .eq('id', linkedRun.id);
      }
    } catch (linkErr) {
      // Non-fatal: log but don't block revision creation
      console.error('execution run revision back-link failed:', linkErr);
    }

    return NextResponse.json({ success: true, revision, aiResult }, { status: 201 });
  } catch (err) {
    console.error('Revisions POST error:', err);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}
