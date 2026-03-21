import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { generateJson } from '@/lib/ai/gemini';
import { buildDraftGeneratorPrompt } from '@/lib/ai/prompts';
import { AiDraftResult } from '@/types/freelancer';

const DEFAULT_DELIVERABLES = [
  'landing-page-copy',
  'headlines',
  'cta-map',
  'whatsapp-script',
];

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

    const { data: drafts } = await supabase
      .from('project_drafts')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false });

    return NextResponse.json({ success: true, data: drafts ?? [] });
  } catch (err) {
    console.error('Drafts GET error:', err);
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

    // Get scope deliverables
    const { data: scopeRow } = await supabase
      .from('project_scope')
      .select('deliverables_json')
      .eq('project_id', id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const scopeDeliverables = scopeRow?.deliverables_json as string[] | null | undefined;
    const deliverables: string[] =
      Array.isArray(scopeDeliverables) && scopeDeliverables.length > 0
        ? scopeDeliverables
        : DEFAULT_DELIVERABLES;

    const contextParts = [
      project.title ? `Proje: ${project.title}` : '',
      project.niche ? `Sektör: ${project.niche}` : '',
      project.service_type ? `Hizmet: ${project.service_type}` : '',
      project.cleaned_brief || project.raw_brief
        ? `Brief:\n${project.cleaned_brief || project.raw_brief}`
        : '',
    ].filter(Boolean);
    const projectContext = contextParts.join('\n');

    const prompt = buildDraftGeneratorPrompt(projectContext, deliverables);

    let result: AiDraftResult;
    try {
      result = await generateJson<AiDraftResult>(prompt);
    } catch (aiErr) {
      const errMsg = aiErr instanceof Error ? aiErr.message : 'AI hatası';
      await logAiRun(supabase, {
        project_id: id,
        user_id: userId,
        run_type: 'drafts',
        input: projectContext,
        output: JSON.stringify({ error: errMsg }),
      });
      return NextResponse.json({ success: false, error: errMsg }, { status: 500 });
    }

    const draftRows = result.drafts.map((d) => ({
      project_id: id,
      draft_type: d.draft_type,
      title: d.title,
      content: d.content,
      version: 1,
    }));

    const { data: drafts, error: insertErr } = await supabase
      .from('project_drafts')
      .insert(draftRows)
      .select();

    if (insertErr) {
      return NextResponse.json({ success: false, error: insertErr.message }, { status: 500 });
    }

    await supabase
      .from('projects')
      .update({ status: 'in_progress', updated_at: new Date().toISOString() })
      .eq('id', id);

    await logAiRun(supabase, {
      project_id: id,
      user_id: userId,
      run_type: 'drafts',
      input: projectContext,
      output: JSON.stringify(result),
    });

    return NextResponse.json({ success: true, data: { drafts: drafts ?? [], result } });
  } catch (err) {
    console.error('Drafts POST error:', err);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}
