import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createSupabaseServer();
    const userId = await getUserId(req, supabase);
    if (!userId) return NextResponse.json({ error: 'Kimlik doğrulaması gerekli' }, { status: 401 });

    const { data: project, error: pErr } = await supabase
      .from('projects')
      .select('raw_brief, niche, service_type')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (pErr || !project) return NextResponse.json({ error: 'Proje bulunamadı' }, { status: 404 });

    // Stub brief result – replace with real AI call when ready
    const brief = {
      cleaned_brief: `[AI Brief – ${project.service_type} / ${project.niche}]\n\n${project.raw_brief}`,
      missing_info: ['Bütçe netleştirilmeli', 'Hedef kitle tanımı eksik'],
      risks: ['Deadline dar olabilir'],
      objectives: ['Rezervasyon artışı sağlamak', 'Marka bilinirliğini güçlendirmek'],
      deliverables: ['Landing page kopyası', 'CTA haritası', 'Başlık seti'],
    };

    // Persist cleaned_brief back to project
    await supabase
      .from('projects')
      .update({ cleaned_brief: brief.cleaned_brief, updated_at: new Date().toISOString() })
      .eq('id', id);

    // Log AI run (best effort)
    try {
      await supabase.from('ai_runs').insert({
        project_id: id,
        user_id: userId,
        run_type: 'brief',
        input: project.raw_brief,
        output: JSON.stringify(brief),
      });
    } catch {
      // ignore logging errors
    }

    return NextResponse.json({ brief });
  } catch (err) {
    console.error('Brief POST error:', err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
