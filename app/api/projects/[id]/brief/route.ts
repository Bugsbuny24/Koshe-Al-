import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin, createSupabaseRouteClient } from '@/lib/supabase/server';
import { generateJson } from '@/lib/ai/gemini';
import { buildBriefCleanerPrompt } from '@/lib/ai/prompts';
import { AiBriefResult } from '@/types/freelancer';

async function logAiRun(
  supabase: ReturnType<typeof createSupabaseAdmin>,
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
    const supabaseAuth = await createSupabaseRouteClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    if (!user?.id) {
      return NextResponse.json({ success: false, error: 'Kimlik doğrulaması gerekli' }, { status: 401 });
    }

    const supabase = createSupabaseAdmin();
    const { data: project, error: pErr } = await supabase
      .from('projects')
      .select('description, prompt, title, tech_stack')
      .eq('id', id)
      .eq('user_id', user.id)
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
        user_id: user.id,
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
      user_id: user.id,
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
