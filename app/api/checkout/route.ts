import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

const PLANS = {
  starter: {
    name: 'Starter',
    price_id: process.env.STRIPE_STARTER_PRICE_ID || 'price_starter',
    amount: 699,
    credits: 400,
  },
  pro: {
    name: 'Pro',
    price_id: process.env.STRIPE_PRO_PRICE_ID || 'price_pro',
    amount: 1499,
    credits: 1500,
  },
  ultra: {
    name: 'Ultra',
    price_id: process.env.STRIPE_ULTRA_PRICE_ID || 'price_ultra',
    amount: 4999,
    credits: 5000,
  },
};

const TOPUP_PACKAGES = {
  topup_100: { credits: 100, amount: 199 },
  topup_500: { credits: 500, amount: 799 },
  topup_1000: { credits: 1000, amount: 1399 },
};

export async function POST(req: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json({ error: 'Stripe yapılandırılmamış' }, { status: 503 });
    }

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2026-02-25.clover' });

    const supabase = createSupabaseServer();

    let userId: string | undefined;
    let userEmail: string | undefined;

    const authHeader = req.headers.get('authorization');
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      userId = user?.id;
      userEmail = user?.email;
    }

    if (!userId) {
      const cookieHeader = req.headers.get('cookie') || '';
      const tokenMatch = cookieHeader.match(/sb-[^-]+-auth-token=([^;]+)/);
      if (tokenMatch) {
        try {
          const decoded = JSON.parse(decodeURIComponent(tokenMatch[1]));
          const { data: { user: u } } = await supabase.auth.getUser(decoded?.access_token);
          userId = u?.id;
          userEmail = u?.email;
        } catch {
          // ignore
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Kimlik doğrulaması gerekli' }, { status: 401 });
    }

    const { plan, topup } = await req.json();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (topup && TOPUP_PACKAGES[topup as keyof typeof TOPUP_PACKAGES]) {
      const pkg = TOPUP_PACKAGES[topup as keyof typeof TOPUP_PACKAGES];
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: userEmail,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: { name: `${pkg.credits} Kredi Paketi` },
              unit_amount: pkg.amount,
            },
            quantity: 1,
          },
        ],
        metadata: { user_id: userId, type: 'topup', topup_package: topup, credits: String(pkg.credits) },
        success_url: `${appUrl}/plans?success=1`,
        cancel_url: `${appUrl}/plans?cancelled=1`,
      });
      return NextResponse.json({ url: session.url });
    }

    if (plan && PLANS[plan as keyof typeof PLANS]) {
      const planData = PLANS[plan as keyof typeof PLANS];
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        customer_email: userEmail,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: { name: `Koshei ${planData.name}` },
              unit_amount: planData.amount,
              recurring: { interval: 'month' },
            },
            quantity: 1,
          },
        ],
        metadata: { user_id: userId, type: 'subscription', plan_id: plan, credits: String(planData.credits) },
        success_url: `${appUrl}/plans?success=1`,
        cancel_url: `${appUrl}/plans?cancelled=1`,
      });
      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json({ error: 'Geçersiz plan veya paket' }, { status: 400 });
  } catch (err) {
    console.error('Checkout error:', err);
    const message = err instanceof Error ? err.message : 'Sunucu hatası';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
