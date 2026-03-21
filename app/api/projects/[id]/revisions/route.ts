import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { generateJson } from '@/lib/ai/gemini';
import { buildRevisionInterpreterPrompt } from '@/lib/ai/prompts';
import { AiRevisionResult } from '@/types/freelancer';

async function getUserId(req: NextRequest, supabase: ReturnType<typeof createSupabaseServer>): Promise<string | undefined> {
  const authHeader = req.headers.get('authorization');
  if (authHeader) {
    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (user?.id) return user.id;
  }
  const cookieHeader = req.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/sb-[^-]+-auth-token=([^;]+)/);
  if (tokenMatch) {
    try {
      const decoded = JSON.parse(decodeURIComponent(tokenMatch[1]));
      const { data: { user: u } } = await supabase.auth.getUser(decoded?.access_token);
      if (u?.id) return u.id;
    } catch { /* ignore */ }
  }
  return undefined;
}

async function logAiRun(
  supabase: ReturnType<typeof createSupabaseServer>,
  data: Record<string, unknown>
) {
  try {
    await supabase.from('ai_runs').insert(data);
  } catch { /* ignore logging errors */ }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createSupabaseServer();
    const userId = await getUserId(req, supabase);
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Kimlik doğrulaması gerekli' }, { status: 401 });
    }

    const { data: revisions } = await supabase
      .from('project_revisions')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false });

    return NextResponse.json({ success: true, data: revisions ?? [] });
  } catch (err) {
    console.error('Revisions GET error:', err);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createSupabaseServer();
    const userId = await getUserId(req, supabase);
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Kimlik doğrulaması gerekli' }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Geçersiz istek gövdesi' }, { status: 400 });
    }

    const rawFeedback = typeof body.raw_feedback === 'string' ? body.raw_feedback.trim() : '';
    if (!rawFeedback) {
      return NextResponse.json({ success: false, error: 'Geri bildirim gerekli' }, { status: 400 });
    }

    // Verify project ownership
    const { data: project, error: pErr } = await supabase
      .from('projects')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (pErr || !project) {
      return NextResponse.json({ success: false, error: 'Proje bulunamadı' }, { status: 404 });
    }

    // Get current scope for context
    const { data: scopeRow } = await supabase
      .from('project_scope')
      .select('summary, deliverables_json, exclusions_json')
      .eq('project_id', id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const currentScope = scopeRow
      ? [
          scopeRow.summary ? `Özet: ${scopeRow.summary}` : '',
          Array.isArray(scopeRow.deliverables_json)
            ? `Deliverables: ${(scopeRow.deliverables_json as string[]).join(', ')}`
            : '',
          Array.isArray(scopeRow.exclusions_json)
            ? `Kapsam dışı: ${(scopeRow.exclusions_json as string[]).join(', ')}`
            : '',
        ]
          .filter(Boolean)
          .join('\n')
      : 'Scope henüz oluşturulmamış.';

    const prompt = buildRevisionInterpreterPrompt(rawFeedback, currentScope);

    let result: AiRevisionResult;
    try {
      result = await generateJson<AiRevisionResult>(prompt);
    } catch (aiErr) {
      const errMsg = aiErr instanceof Error ? aiErr.message : 'AI hatası';
      await logAiRun(supabase, {
        project_id: id,
        user_id: userId,
        run_type: 'revision',
        input: rawFeedback,
        output: JSON.stringify({ error: errMsg }),
      });
      return NextResponse.json({ success: false, error: errMsg }, { status: 500 });
    }

    const revisionData = {
      project_id: id,
      raw_feedback: rawFeedback,
      parsed_feedback_json: result,
      scope_status: result.scope_status,
      action_items_json: result.action_items,
    };

    const { data: revision, error: insertErr } = await supabase
      .from('project_revisions')
      .insert(revisionData)
      .select()
      .single();

    if (insertErr) {
      return NextResponse.json({ success: false, error: insertErr.message }, { status: 500 });
    }

    await supabase
      .from('projects')
      .update({ status: 'revision', updated_at: new Date().toISOString() })
      .eq('id', id);

    await logAiRun(supabase, {
      project_id: id,
      user_id: userId,
      run_type: 'revision',
      input: rawFeedback,
      output: JSON.stringify(result),
    });

    return NextResponse.json({ success: true, data: { revision, result } });
  } catch (err) {
    console.error('Revisions POST error:', err);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}
