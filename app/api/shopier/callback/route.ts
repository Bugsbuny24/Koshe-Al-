import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

const PLAN_CREDITS: Record<string, number> = {
  starter: 100,
  growth: 300,
  pro: 1000,
  prestige: 3000,
};

const PLAN_DURATION_DAYS = 30;

async function handleCallback(plan: string | null, userId: string | null, token: string | null) {
  const secret = process.env.SHOPIER_CALLBACK_SECRET;

  if (!secret || !token || token !== secret) {
    return NextResponse.redirect(new URL('/plans?error=invalid', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  }

  if (!plan || !userId || !(plan in PLAN_CREDITS)) {
    return NextResponse.redirect(new URL('/plans?error=invalid', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  }

  const credits = PLAN_CREDITS[plan];
  const now = new Date();
  const expiresAt = new Date(now.getTime() + PLAN_DURATION_DAYS * 24 * 60 * 60 * 1000);

  const supabase = createSupabaseServer();

  const { error } = await supabase.from('user_quotas').upsert(
    {
      user_id: userId,
      plan_id: plan,
      credits_remaining: credits,
      credits_total: credits,
      is_active: true,
      plan_started_at: now.toISOString(),
      plan_expires_at: expiresAt.toISOString(),
      updated_at: now.toISOString(),
    },
    { onConflict: 'user_id' }
  );

  if (error) {
    console.error('Shopier callback upsert error:', error);
    return NextResponse.redirect(new URL('/plans?error=invalid', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  }

  return NextResponse.redirect(new URL('/dashboard?plan_activated=true', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const plan = searchParams.get('plan');
  const userId = searchParams.get('user_id');
  const token = searchParams.get('token');

  return handleCallback(plan, userId, token);
}

export async function POST(request: NextRequest) {
  let plan: string | null = null;
  let userId: string | null = null;
  let token: string | null = null;

  try {
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      plan = body.plan ?? null;
      userId = body.user_id ?? null;
      token = body.token ?? null;
    } else {
      const formData = await request.formData();
      plan = formData.get('plan') as string | null;
      userId = formData.get('user_id') as string | null;
      token = formData.get('token') as string | null;
    }
  } catch {
    return NextResponse.redirect(new URL('/plans?error=invalid', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  }

  return handleCallback(plan, userId, token);
}
