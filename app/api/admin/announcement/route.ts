import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

function checkAdminKey(req: NextRequest): boolean {
  const key = req.headers.get('x-admin-key');
  return key === process.env.ADMIN_SECRET_KEY;
}

export async function GET() {
  try {
    const supabase = createSupabaseServer();
    const { data } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'announcement')
      .single();

    return NextResponse.json({ announcement: data?.value || null });
  } catch {
    return NextResponse.json({ announcement: null });
  }
}

export async function POST(req: NextRequest) {
  if (!checkAdminKey(req)) {
    return NextResponse.json({ error: 'Yetkisiz', code: 'UNAUTHORIZED' }, { status: 401 });
  }

  try {
    const { message } = await req.json();
    const supabase = createSupabaseServer();

    await supabase
      .from('system_settings')
      .upsert({ key: 'announcement', value: message || null }, { onConflict: 'key' });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Announcement error:', err);
    return NextResponse.json({ error: 'Sunucu hatası', code: 'SERVER_ERROR' }, { status: 500 });
  }
}
