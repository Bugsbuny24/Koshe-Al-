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

    const { data: scope } = await supabase
      .from('project_scope')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    return NextResponse.json({ scope: scope ?? null });
  } catch (err) {
    console.error('Scope GET error:', err);
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

    const { data: project, error: pErr } = await supabase
      .from('projects')
      .select('raw_brief, cleaned_brief, niche, service_type')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (pErr || !project) return NextResponse.json({ error: 'Proje bulunamadı' }, { status: 404 });

    // Stub scope result – replace with real AI call when ready
    const scopeData = {
      project_id: id,
      summary: `${project.service_type} projesi için kapsamlı içerik ve pazarlama paketi.`,
      objectives: ['Rezervasyon artışı', 'Marka bilinirliği', 'Dönüşüm optimizasyonu'],
      deliverables_json: ['Landing page kopyası (TR/EN)', 'CTA haritası', '10 başlık varyasyonu'],
      exclusions_json: ['Tasarım', 'Teknik geliştirme', 'Reklam bütçesi yönetimi'],
      risks_json: ['Müşteri onay süreci uzayabilir', 'Görseller müşteriden temin edilmeli'],
      questions_json: ['Hedef rezervasyon kanalı nedir?', 'Mevcut dönüşüm oranı biliyor musunuz?'],
      estimated_timeline_json: {
        'Brief & Scope': '1 gün',
        'İlk Taslaklar': '2-3 gün',
        'Revizyonlar': '1-2 gün',
        'Teslim': '1 gün',
      },
    };

    const { data: scope, error } = await supabase
      .from('project_scope')
      .insert(scopeData)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabase.from('projects').update({ updated_at: new Date().toISOString() }).eq('id', id);

    return NextResponse.json({ scope });
  } catch (err) {
    console.error('Scope POST error:', err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
