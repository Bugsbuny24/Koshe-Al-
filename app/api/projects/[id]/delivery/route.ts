import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { generateJson } from '@/lib/ai/gemini';
import { buildDeliveryComposerPrompt } from '@/lib/ai/prompts';
import { AiDeliveryResult } from '@/types/freelancer';

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

    const { data: delivery } = await supabase
      .from('project_deliveries')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    return NextResponse.json({ success: true, data: delivery ?? null });
  } catch (err) {
    console.error('Delivery GET error:', err);
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
      .select('title, client_name, service_type, niche, cleaned_brief, raw_brief')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (pErr || !project) {
      return NextResponse.json({ success: false, error: 'Proje bulunamadı' }, { status: 404 });
    }

    const { data: scopeRow } = await supabase
      .from('project_scope')
      .select('summary, deliverables_json')
      .eq('project_id', id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: draftsRows } = await supabase
      .from('project_drafts')
      .select('draft_type, title, content')
      .eq('project_id', id)
      .order('created_at', { ascending: false });

    const contextParts = [
      project.title ? `Proje: ${project.title}` : '',
      project.client_name ? `Müşteri: ${project.client_name}` : '',
      project.niche ? `Sektör: ${project.niche}` : '',
      project.service_type ? `Hizmet: ${project.service_type}` : '',
      project.cleaned_brief || project.raw_brief
        ? `Brief:\n${project.cleaned_brief || project.raw_brief}`
        : '',
      scopeRow?.summary ? `Scope özeti: ${scopeRow.summary}` : '',
    ].filter(Boolean);
    const projectContext = contextParts.join('\n');

    const draftsText = (draftsRows ?? [])
      .map((d) => `### ${d.title} (${d.draft_type})\n${d.content}`)
      .join('\n\n');

    const prompt = buildDeliveryComposerPrompt(projectContext, draftsText || 'Taslak yok.');

    let result: AiDeliveryResult;
    try {
      result = await generateJson<AiDeliveryResult>(prompt);
    } catch (aiErr) {
      const errMsg = aiErr instanceof Error ? aiErr.message : 'AI hatası';
      await logAiRun(supabase, {
        project_id: id,
        user_id: userId,
        run_type: 'delivery',
        input: projectContext,
        output: JSON.stringify({ error: errMsg }),
      });
      return NextResponse.json({ success: false, error: errMsg }, { status: 500 });
    }

    const deliveryData = {
      project_id: id,
      delivery_summary: result.delivery_summary,
      client_message: result.client_message,
      assets_json: result.assets,
      next_steps_json: result.next_steps,
    };

    const { data: delivery, error: insertErr } = await supabase
      .from('project_deliveries')
      .insert(deliveryData)
      .select()
      .single();

    if (insertErr) {
      return NextResponse.json({ success: false, error: insertErr.message }, { status: 500 });
    }

    await supabase
      .from('projects')
      .update({ status: 'delivery', updated_at: new Date().toISOString() })
      .eq('id', id);

    await logAiRun(supabase, {
      project_id: id,
      user_id: userId,
      run_type: 'delivery',
      input: projectContext,
      output: JSON.stringify(result),
    });

    return NextResponse.json({ success: true, data: { delivery, result } });
  } catch (err) {
    console.error('Delivery POST error:', err);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}
