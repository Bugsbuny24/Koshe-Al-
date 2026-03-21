import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

function checkAdminKey(req: NextRequest): boolean {
  const key = req.headers.get('x-admin-key');
  const expected = process.env.ADMIN_SECRET;
  if (!expected || !key) return false;
  return key === expected;
}

export async function GET(req: NextRequest) {
  if (!checkAdminKey(req)) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  }

  try {
    const supabase = createSupabaseServer();

    const [profilesRes, usageRes, quotasRes] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('ai_usage').select('id', { count: 'exact', head: true }),
      supabase.from('user_quotas').select('credits_remaining'),
    ]);

    const totalUsers = profilesRes.count || 0;
    const totalAPICalls = usageRes.count || 0;
    const totalCredits = (quotasRes.data || []).reduce(
      (sum: number, q: { credits_remaining: number }) => sum + (q.credits_remaining || 0),
      0
    );

    const { data: recentUsage } = await supabase
      .from('ai_usage')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    return NextResponse.json({
      totalUsers,
      totalAPICalls,
      totalCredits: Math.round(totalCredits),
      recentUsage: recentUsage || [],
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
