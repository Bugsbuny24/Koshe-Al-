import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const { accessToken, uid, username } = await req.json();

  if (!accessToken || !uid || !username) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const isSandbox =
    process.env.NEXT_PUBLIC_PI_SANDBOX === 'true' ||
    process.env.PI_SANDBOX === 'true';

  if (!isSandbox) {
    const piRes = await fetch('https://api.minepi.com/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!piRes.ok) {
      return NextResponse.json({ error: 'Invalid Pi token' }, { status: 401 });
    }
    const piUser = await piRes.json();
    if (piUser.uid !== uid) {
      return NextResponse.json({ error: 'UID mismatch' }, { status: 401 });
    }
  }

  const supabase = createSupabaseServer();

  // Önce pi_uid ile mevcut profili ara
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('pi_uid', uid)
    .maybeSingle();

  let profileId: string;

  if (existing) {
    // Mevcut kullanıcı — güncelle
    profileId = existing.id;
    await supabase
      .from('profiles')
      .update({ username, full_name: username, updated_at: new Date().toISOString() })
      .eq('id', profileId);
  } else {
    // Yeni kullanıcı — oluştur
    const { data: newProfile, error } = await supabase
      .from('profiles')
      .insert({ pi_uid: uid, username, full_name: username, role: 'pioneer' })
      .select('id')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    profileId = newProfile.id;
  }

  // Wallet ve quota oluştur
  await supabase.from('wallets').upsert(
    { user_id: profileId, balance: 0, pending_balance: 0, total_earned: 0, total_spent: 0, currency: 'Pi' },
    { onConflict: 'user_id' }
  );

  await supabase.from('user_quotas').upsert(
    { user_id: profileId, tier: 'starter', plan_id: 'starter', credits_remaining: 50, is_active: true },
    { onConflict: 'user_id' }
  );

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .single();

  return NextResponse.json({ ...profile, _pi_uid: uid });
}
