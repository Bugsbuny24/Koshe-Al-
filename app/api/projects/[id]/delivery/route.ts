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

    const { data: delivery } = await supabase
      .from('project_deliveries')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    return NextResponse.json({ delivery: delivery ?? null });
  } catch (err) {
    console.error('Delivery GET error:', err);
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
      .select('title, client_name, service_type')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (pErr || !project) return NextResponse.json({ error: 'Proje bulunamadı' }, { status: 404 });

    // Stub delivery package – replace with real AI call when ready
    const deliveryData = {
      project_id: id,
      delivery_summary: `${project.title} projesi tamamlandı. Tüm deliverable'lar hazır ve teslime uygun durumda.`,
      client_message: `Merhaba,\n\n${project.title} projesi tamamlandı. Aşağıda teslim paketini bulabilirsiniz.\n\nProjeyi inceleyin ve geri bildirimlerinizi bizimle paylaşın.\n\nİyi çalışmalar!`,
      assets_json: [
        'landing-page-copy-v1.docx',
        'headline-variations.txt',
        'cta-map.pdf',
      ],
      next_steps_json: [
        'Dosyaları inceleyin ve onaylayın',
        'Varsa son revizyonları bildirin',
        'Tasarım ekibinize iletebilirsiniz',
      ],
    };

    const { data: delivery, error } = await supabase
      .from('project_deliveries')
      .insert(deliveryData)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabase.from('projects').update({ status: 'delivery', updated_at: new Date().toISOString() }).eq('id', id);

    return NextResponse.json({ delivery });
  } catch (err) {
    console.error('Delivery POST error:', err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
