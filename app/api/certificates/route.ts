import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

function generateCertificateId(): string {
  return `KOSH-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createSupabaseServer();

    let userId: string | undefined;

    const authHeader = req.headers.get('authorization');
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      userId = user?.id;
    }

    if (!userId) {
      const cookieHeader = req.headers.get('cookie') || '';
      const tokenMatch = cookieHeader.match(/sb-[^-]+-auth-token=([^;]+)/);
      if (tokenMatch) {
        try {
          const decoded = JSON.parse(decodeURIComponent(tokenMatch[1]));
          const { data: { user: u } } = await supabase.auth.getUser(decoded?.access_token);
          userId = u?.id;
        } catch {
          // ignore
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Kimlik doğrulaması gerekli' }, { status: 401 });
    }

    const { course_id } = await req.json();

    if (!course_id) {
      return NextResponse.json({ error: 'Kurs ID gerekli' }, { status: 400 });
    }

    // Validate course_id is a valid UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(course_id)) {
      return NextResponse.json({ error: 'Geçersiz kurs ID formatı' }, { status: 400 });
    }

    // Check if already has certificate
    const { data: existing } = await supabase
      .from('certificates')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', course_id)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Bu kurs için sertifika zaten mevcut' }, { status: 409 });
    }

    const certificateId = generateCertificateId();

    const { data, error } = await supabase
      .from('certificates')
      .insert({
        user_id: userId,
        course_id,
        certificate_id: certificateId,
        issued_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      certificate: data,
      certificate_id: certificateId,
      message: 'Sertifika başarıyla oluşturuldu!',
    });
  } catch (err) {
    console.error('Certificate error:', err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
