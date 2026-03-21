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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createSupabaseServer();
    const userId = await getUserId(req, supabase);
    if (!userId) return NextResponse.json({ error: 'Kimlik doğrulaması gerekli' }, { status: 401 });

    const { data: revisions } = await supabase
      .from('project_revisions')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false });

    return NextResponse.json({ revisions: revisions ?? [] });
  } catch (err) {
    console.error('Revisions GET error:', err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
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
    if (!userId) return NextResponse.json({ error: 'Kimlik doğrulaması gerekli' }, { status: 401 });

    const body = await req.json();
    const { raw_feedback } = body;

    if (!raw_feedback?.trim()) {
      return NextResponse.json({ error: 'Geri bildirim gerekli' }, { status: 400 });
    }

    // Verify project ownership
    const { data: project, error: pErr } = await supabase
      .from('projects')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (pErr || !project) return NextResponse.json({ error: 'Proje bulunamadı' }, { status: 404 });

    // Stub revision interpretation – replace with real AI call when ready
    const revisionData = {
      project_id: id,
      raw_feedback: raw_feedback.trim(),
      parsed_feedback_json: {
        in_scope: ['Landing page başlıklarını revize et', 'CTA metnini güncelle'],
        out_of_scope: ['Ek sayfa oluşturma', 'Video içerik üretimi'],
        notes: ['Müşteri tonu daha sıcak istiyor'],
      },
      scope_status: 'partial' as const,
      action_items_json: [
        'Başlık varyasyonlarını yeniden yaz',
        'CTA buton metinlerini güncel et',
        'Ton analizi yap',
      ],
    };

    const { data: revision, error } = await supabase
      .from('project_revisions')
      .insert(revisionData)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabase.from('projects').update({ status: 'revision', updated_at: new Date().toISOString() }).eq('id', id);

    return NextResponse.json({ revision });
  } catch (err) {
    console.error('Revisions POST error:', err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
