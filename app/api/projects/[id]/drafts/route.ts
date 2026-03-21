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

    const { data: drafts } = await supabase
      .from('project_drafts')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false });

    return NextResponse.json({ drafts: drafts ?? [] });
  } catch (err) {
    console.error('Drafts GET error:', err);
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
      .select('raw_brief, cleaned_brief, niche, service_type, title')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (pErr || !project) return NextResponse.json({ error: 'Proje bulunamadı' }, { status: 404 });

    // Stub drafts – replace with real AI call when ready
    const stubDrafts = [
      {
        project_id: id,
        draft_type: 'landing-page-copy',
        title: 'Ana Landing Page Kopyası',
        content: `# ${project.title}\n\nSizin için özel hazırlanmış, dönüşüm odaklı landing page kopyası.\n\n## Hero Bölümü\n\nKonaklamanın en seçkin adresi. Rezervasyonunuzu hemen yapın.\n\n## Neden Biz?\n\n✓ Eşsiz konum\n✓ Üstün hizmet kalitesi\n✓ En iyi fiyat garantisi`,
        version: 1,
      },
      {
        project_id: id,
        draft_type: 'headlines',
        title: 'Başlık Varyasyonları',
        content: `1. "Hayalinizin Tatilini Şimdi Rezerve Edin"\n2. "Lüks ve Konforun Buluşma Noktası"\n3. "Her Geceyi Unutulmaz Kılın"\n4. "En İyi Fiyat Garantisiyle Rezervasyon"\n5. "Ailenizle Unutulmaz Anlar Yaratın"`,
        version: 1,
      },
      {
        project_id: id,
        draft_type: 'cta-map',
        title: 'CTA Haritası',
        content: `Hero CTA: "Şimdi Rezervasyon Yap →"\nOdalar Bölümü: "Müsaitliği Kontrol Et"\nGaleri: "Tüm Fotoğrafları Gör"\nTeklifler: "Özel Fırsatları Keşfet"\nİletişim: "Bize Yazın"`,
        version: 1,
      },
    ];

    const { data: drafts, error } = await supabase
      .from('project_drafts')
      .insert(stubDrafts)
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabase.from('projects').update({ status: 'in_progress', updated_at: new Date().toISOString() }).eq('id', id);

    return NextResponse.json({ drafts: drafts ?? [] });
  } catch (err) {
    console.error('Drafts POST error:', err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
