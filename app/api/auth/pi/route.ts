import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const { accessToken, uid, username } = await req.json();

  if (!accessToken || !uid || !username) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Pi API ile token doğrula
  const piRes = await fetch('https://api.minepi.com/v2/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!piRes.ok) return NextResponse.json({ error: 'Invalid Pi token' }, { status: 401 });

  const piUser = await piRes.json();
  if (piUser.uid !== uid) return NextResponse.json({ error: 'UID mismatch' }, { status: 401 });

  const supabase = createSupabaseServer();

  // profiles tablosuna upsert et
  const { data: profile, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: uid,
        username,
        full_name: username,
        role: 'pioneer',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Wallet yoksa oluştur
  await supabase
    .from('wallets')
    .upsert(
      { user_id: uid, balance: 0, pending_balance: 0, total_earned: 0, total_spent: 0, currency: 'Pi' },
      { onConflict: 'user_id' }
    );

  // user_quotas yoksa oluştur
  await supabase
    .from('user_quotas')
    .upsert(
      { user_id: uid, tier: 'free', plan: 'free', credits_remaining: 100, is_active: true },
      { onConflict: 'user_id' }
    );

  return NextResponse.json(profile);
}
