import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { generateJson } from '@/lib/ai/gemini';
import { buildScopeBuilderPrompt } from '@/lib/ai/prompts';
import { AiScopeResult } from '@/types/freelancer';

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

    const { data: scope } = await supabase
      .from('project_scope')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    return NextResponse.json({ success: true, data: scope ?? null });
  } catch (err) {
    console.error('Scope GET error:', err);
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

    const { data: project, error: pErr } = await supabase
      .from('projects')
      .select('raw_brief, cleaned_brief, niche, service_type, title')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (pErr || !project) {
      return NextResponse.json({ success: false, error: 'Proje bulunamadı' }, { status: 404 });
    }

    const contextParts = [
      project.title ? `Proje: ${project.title}` : '',
      project.niche ? `Sektör: ${project.niche}` : '',
      project.service_type ? `Hizmet: ${project.service_type}` : '',
      project.cleaned_brief || project.raw_brief
        ? `Brief:\n${project.cleaned_brief || project.raw_brief}`
        : '',
    ].filter(Boolean);
    const projectContext = contextParts.join('\n');

    const prompt = buildScopeBuilderPrompt(projectContext);

    let result: AiScopeResult;
    try {
      result = await generateJson<AiScopeResult>(prompt);
    } catch (aiErr) {
      const errMsg = aiErr instanceof Error ? aiErr.message : 'AI hatası';
      await logAiRun(supabase, {
        project_id: id,
        user_id: userId,
        run_type: 'scope',
        input: projectContext,
        output: JSON.stringify({ error: errMsg }),
      });
      return NextResponse.json({ success: false, error: errMsg }, { status: 500 });
    }

    const scopeData = {
      project_id: id,
      summary: result.summary,
      objectives: result.objectives,
      deliverables_json: result.deliverables,
      exclusions_json: result.exclusions,
      risks_json: result.risks,
      questions_json: result.questions,
      estimated_timeline_json: result.estimated_timeline,
    };

    const { data: scope, error: scopeErr } = await supabase
      .from('project_scope')
      .insert(scopeData)
      .select()
      .single();

    if (scopeErr) {
      return NextResponse.json({ success: false, error: scopeErr.message }, { status: 500 });
    }

    await supabase
      .from('projects')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', id);

    await logAiRun(supabase, {
      project_id: id,
      user_id: userId,
      run_type: 'scope',
      input: projectContext,
      output: JSON.stringify(result),
    });

    return NextResponse.json({ success: true, data: { scope, result } });
  } catch (err) {
    console.error('Scope POST error:', err);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}
