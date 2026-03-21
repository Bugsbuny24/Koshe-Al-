import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { generateJson } from '@/lib/ai/gemini';
import { buildBriefCleanerPrompt } from '@/lib/ai/prompts';
import { AiBriefResult } from '@/types/freelancer';

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
      .select('description, prompt, title, tech_stack')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (pErr || !project) {
      return NextResponse.json({ success: false, error: 'Proje bulunamadı' }, { status: 404 });
    }

    const rawBrief = project.prompt || project.description || '';
    if (!rawBrief.trim()) {
      return NextResponse.json({ success: false, error: 'Ham brief boş olamaz' }, { status: 400 });
    }

    const prompt = buildBriefCleanerPrompt(rawBrief);

    let result: AiBriefResult;
    try {
      result = await generateJson<AiBriefResult>(prompt);
    } catch (aiErr) {
      const errMsg = aiErr instanceof Error ? aiErr.message : 'AI hatası';
      await logAiRun(supabase, {
        project_id: id,
        user_id: userId,
        run_type: 'brief',
        input: rawBrief,
        output: JSON.stringify({ error: errMsg }),
      });
      return NextResponse.json({ success: false, error: errMsg }, { status: 500 });
    }

    // Persist cleaned brief to project description
    const cleanedBrief = `${result.suggested_title ? `[${result.suggested_title}]\n\n` : ''}${result.summary}`;
    await supabase
      .from('projects')
      .update({ description: cleanedBrief, updated_at: new Date().toISOString() })
      .eq('id', id);

    await logAiRun(supabase, {
      project_id: id,
      user_id: userId,
      run_type: 'brief',
      input: rawBrief,
      output: JSON.stringify(result),
    });

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error('Brief POST error:', err);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}
