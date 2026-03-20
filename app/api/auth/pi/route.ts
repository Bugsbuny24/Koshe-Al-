import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    const accessToken =
      typeof body?.accessToken === 'string' ? body.accessToken.trim() : '';
    const uid = typeof body?.uid === 'string' ? body.uid.trim() : '';
    const username =
      typeof body?.username === 'string' ? body.username.trim() : '';

    if (!accessToken || !uid || !username) {
      return jsonError('Missing required fields', 400);
    }

    const isSandbox =
      process.env.NEXT_PUBLIC_PI_SANDBOX === 'true' ||
      process.env.PI_SANDBOX === 'true';

    if (!isSandbox) {
      const piRes = await fetch('https://api.minepi.com/v2/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      });

      const piText = await piRes.text();

      if (!piRes.ok) {
        return jsonError(
          `Invalid Pi token (${piRes.status})${piText ? `: ${piText}` : ''}`,
          401
        );
      }

      let piUser: { uid?: string } | null = null;

      try {
        piUser = piText ? JSON.parse(piText) : null;
      } catch {
        return jsonError('Pi verify response parse failed', 500);
      }

      if (!piUser?.uid) {
        return jsonError('Pi verify response missing uid', 401);
      }

      if (piUser.uid !== uid) {
        return jsonError('UID mismatch', 401);
      }
    }

    const supabase = createSupabaseServer();

    const { data: existingProfile, error: existingProfileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('pi_uid', uid)
      .maybeSingle();

    if (existingProfileError) {
      return jsonError(
        `Profile lookup failed: ${existingProfileError.message}`,
        500
      );
    }

    let profileId = existingProfile?.id ?? '';

    if (existingProfile) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          username,
          full_name: username,
          pi_uid: uid,
          role: 'pioneer',
        })
        .eq('id', existingProfile.id);

      if (updateError) {
        return jsonError(`Profile update failed: ${updateError.message}`, 500);
      }

      profileId = existingProfile.id;
    } else {
      profileId = crypto.randomUUID();

      const { error: insertError } = await supabase.from('profiles').insert({
        id: profileId,
        pi_uid: uid,
        username,
        full_name: username,
        role: 'pioneer',
      });

      if (insertError) {
        return jsonError(`Profile insert failed: ${insertError.message}`, 500);
      }
    }

    const { data: existingWallet, error: walletLookupError } = await supabase
      .from('wallets')
      .select('id')
      .eq('user_id', profileId)
      .maybeSingle();

    if (walletLookupError) {
      return jsonError(`Wallet lookup failed: ${walletLookupError.message}`, 500);
    }

    if (!existingWallet) {
      const { error: walletInsertError } = await supabase.from('wallets').insert({
        id: crypto.randomUUID(),
        user_id: profileId,
        balance: 0,
        pending_balance: 0,
        total_earned: 0,
        total_spent: 0,
        currency: 'Pi',
      });

      if (walletInsertError) {
        return jsonError(`Wallet insert failed: ${walletInsertError.message}`, 500);
      }
    }

    const { data: existingQuota, error: quotaLookupError } = await supabase
      .from('user_quotas')
      .select('user_id')
      .eq('user_id', profileId)
      .maybeSingle();

    if (quotaLookupError) {
      return jsonError(`Quota lookup failed: ${quotaLookupError.message}`, 500);
    }

    if (!existingQuota) {
      const { error: quotaInsertError } = await supabase
        .from('user_quotas')
        .insert({
          user_id: profileId,
          tier: 'starter',
          plan: 'starter',
          plan_id: 'starter',
          credits_remaining: 50,
          credits_total: 50,
          is_active: true,
        });

      if (quotaInsertError) {
        return jsonError(`Quota insert failed: ${quotaInsertError.message}`, 500);
      }
    }

    const { data: profile, error: profileReadError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .single();

    if (profileReadError) {
      return jsonError(`Profile read failed: ${profileReadError.message}`, 500);
    }

    return NextResponse.json({ ...profile, _pi_uid: uid });
  } catch (err) {
    return jsonError(
      err instanceof Error ? err.message : 'Unexpected auth error',
      500
    );
  }
    }
