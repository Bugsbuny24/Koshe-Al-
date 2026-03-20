import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const { accessToken, uid, username } = await req.json();

  if (!accessToken || !uid || !username) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Sandbox modda Pi API doğrulamasını atla
  const isSandbox = process.env.NEXT_PUBLIC_PI_SANDBOX === 'true' || process.env.PI_SANDBOX === 'true';

  
    const piRes = await fetch('https://api.minepi.com/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!piRes.ok) return NextResponse.json({ error: 'Invalid Pi token' }, { status: 401 });
    const piUser = await piRes.json();
    if (piUser.uid !== uid) return NextResponse.json({ error: 'UID mismatch' }, { status: 401 });
  }

  const supabase = createSupabaseServer();

  const { data: profile, error } = await supabase
    .from('profiles')
    .upsert(
      { id: uid, username, full_name: username, role: 'pioneer', updated_at: new Date().toISOString() },
      { onConflict: 'id' }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from('wallets').upsert(
    { user_id: uid, balance: 0, pending_balance: 0, total_earned: 0, total_spent: 0, currency: 'Pi' },
    { onConflict: 'user_id' }
  );

  await supabase.from('user_quotas').upsert(
    { user_id: uid, tier: 'starter', plan_id: 'starter', credits_remaining: 50, is_active: true },
    { onConflict: 'user_id' }
  );

  return NextResponse.json(profile);
}
