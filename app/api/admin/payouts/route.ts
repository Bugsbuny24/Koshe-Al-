import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

function jsonError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

async function requireAdmin(req: NextRequest) {
  const userId = req.headers.get('x-koshei-user-id')?.trim();

  if (!userId) {
    return { error: jsonError('Missing admin user id', 401), userId: null };
  }

  const supabase = createSupabaseServer();

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    return {
      error: jsonError(`Admin profile lookup failed: ${error.message}`, 500),
      userId: null,
    };
  }

  if (!profile || profile.role !== 'admin') {
    return { error: jsonError('Unauthorized', 403), userId: null };
  }

  return { error: null, userId };
}

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (admin.error) return admin.error;

  try {
    const supabase = createSupabaseServer();

    const { data: payouts, error: payoutsError } = await supabase
      .from('app_payouts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (payoutsError) {
      return jsonError(`Failed to load payouts: ${payoutsError.message}`, 500);
    }

    const { data: completedRows, error: completedError } = await supabase
      .from('app_payouts')
      .select('wallet_address')
      .eq('status', 'completed');

    if (completedError) {
      return jsonError(
        `Failed to calculate unique wallets: ${completedError.message}`,
        500
      );
    }

    const uniqueCompletedWallets = new Set(
      (completedRows ?? []).map((row) => row.wallet_address)
    ).size;

    return NextResponse.json({
      success: true,
      payouts: payouts ?? [],
      stats: {
        uniqueCompletedWallets,
        targetWallets: 10,
        remainingWallets: Math.max(0, 10 - uniqueCompletedWallets),
      },
    });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : 'Unexpected payout fetch error',
      500
    );
  }
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (admin.error) return admin.error;

  try {
    const body = await req.json().catch(() => null);

    const walletAddress =
      typeof body?.walletAddress === 'string' ? body.walletAddress.trim() : '';
    const ownerNote =
      typeof body?.ownerNote === 'string' ? body.ownerNote.trim() : null;
    const amount =
      typeof body?.amount === 'number' && Number.isFinite(body.amount)
        ? body.amount
        : null;

    if (!walletAddress) {
      return jsonError('Wallet address is required', 400);
    }

    if (walletAddress.length < 20) {
      return jsonError('Wallet address looks invalid', 400);
    }

    if (amount === null || amount <= 0) {
      return jsonError('Amount must be greater than 0', 400);
    }

    const supabase = createSupabaseServer();

    const { error: targetError } = await supabase.from('payout_targets').upsert(
      {
        wallet_address: walletAddress,
        owner_note: ownerNote,
      },
      {
        onConflict: 'wallet_address',
      }
    );

    if (targetError) {
      return jsonError(`Failed to save payout target: ${targetError.message}`, 500);
    }

    const { data: payout, error: payoutError } = await supabase
      .from('app_payouts')
      .insert({
        wallet_address: walletAddress,
        amount,
        owner_note: ownerNote,
        status: 'pending',
        sent_by: admin.userId,
      })
      .select('*')
      .single();

    if (payoutError) {
      return jsonError(`Failed to create payout: ${payoutError.message}`, 500);
    }

    return NextResponse.json({
      success: true,
      payout,
      message: 'Payout created. After sending from the wallet, mark it completed with txid.',
    });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : 'Unexpected payout create error',
      500
    );
  }
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (admin.error) return admin.error;

  try {
    const body = await req.json().catch(() => null);

    const id = typeof body?.id === 'string' ? body.id.trim() : '';
    const txid = typeof body?.txid === 'string' ? body.txid.trim() : null;
    const errorMessage =
      typeof body?.errorMessage === 'string' ? body.errorMessage.trim() : null;
    const status =
      body?.status === 'completed' || body?.status === 'failed'
        ? body.status
        : null;

    if (!id) {
      return jsonError('Missing payout id', 400);
    }

    if (!status) {
      return jsonError('Status must be completed or failed', 400);
    }

    if (status === 'completed' && !txid) {
      return jsonError('txid is required when marking payout completed', 400);
    }

    const supabase = createSupabaseServer();

    const payload: Record<string, unknown> = {
      status,
      txid,
      error_message: status === 'failed' ? errorMessage ?? 'Unknown payout failure' : null,
      completed_at: status === 'completed' ? new Date().toISOString() : null,
    };

    const { data: payout, error } = await supabase
      .from('app_payouts')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return jsonError(`Failed to update payout: ${error.message}`, 500);
    }

    return NextResponse.json({
      success: true,
      payout,
    });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : 'Unexpected payout update error',
      500
    );
  }
}
