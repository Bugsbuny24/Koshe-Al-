import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

function checkAdminKey(req: NextRequest): boolean {
  const key = req.headers.get('x-admin-key');
  const expected = process.env.ADMIN_SECRET || 'Koschei2024!';
  return key === expected;
}

export async function GET(req: NextRequest) {
  if (!checkAdminKey(req)) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  }

  try {
    const supabase = createSupabaseServer();
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, email, full_name, is_admin, created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    const { data: quotas } = await supabase
      .from('user_quotas')
      .select('user_id, plan_id, credits_remaining, is_active');

    const quotaMap = new Map((quotas || []).map((q: { user_id: string; plan_id: string; credits_remaining: number; is_active: boolean }) => [q.user_id, q]));

    const users = (profiles || []).map((p: { id: string; email: string; full_name: string; is_admin: boolean; created_at: string }) => ({
      ...p,
      quota: quotaMap.get(p.id) || null,
    }));

    return NextResponse.json({ users });
  } catch (err) {
    console.error('Admin users GET error:', err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!checkAdminKey(req)) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  }

  try {
    const supabase = createSupabaseServer();
    const { userId, plan_id, credits_remaining } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId gerekli' }, { status: 400 });
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (plan_id) updates.plan_id = plan_id;
    if (credits_remaining !== undefined) updates.credits_remaining = credits_remaining;

    const { error } = await supabase
      .from('user_quotas')
      .update(updates)
      .eq('user_id', userId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Admin users PATCH error:', err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
