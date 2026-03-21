import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

const PLAN_CREDITS: Record<string, number> = {
  starter: 400,
  pro: 1500,
  ultra: 5000,
};

export async function POST(req: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe yapılandırılmamış' }, { status: 503 });
  }

  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(stripeSecretKey, { apiVersion: '2026-02-25.clover' });

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'İmza eksik' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook imza hatası:', err);
    return NextResponse.json({ error: 'Geçersiz imza' }, { status: 400 });
  }

  const supabase = createSupabaseServer();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as {
          metadata?: Record<string, string>;
          subscription?: string;
        };
        const metadata = session.metadata || {};
        const userId = metadata.user_id;
        if (!userId) break;

        if (metadata.type === 'topup') {
          const credits = parseInt(metadata.credits || '0', 10);
          await supabase.rpc('add_credits' as never, { uid: userId, amount: credits } as never);

          await supabase.from('transactions').insert({
            user_id: userId,
            type: 'topup',
            amount: credits,
            description: `${credits} kredi satın alındı`,
          });
        } else if (metadata.type === 'subscription') {
          const planId = metadata.plan_id;
          const credits = PLAN_CREDITS[planId] || 400;
          const expiresAt = new Date();
          expiresAt.setMonth(expiresAt.getMonth() + 1);

          await supabase.from('user_quotas').upsert({
            user_id: userId,
            plan_id: planId,
            credits_remaining: credits,
            is_active: true,
            plan_expires_at: expiresAt.toISOString(),
            stripe_subscription_id: session.subscription || null,
          });

          await supabase.from('orders').insert({
            user_id: userId,
            plan_id: planId,
            status: 'completed',
            stripe_session_id: (event.data.object as { id: string }).id,
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as {
          metadata?: Record<string, string>;
          status: string;
        };
        const userId = sub.metadata?.user_id;
        if (!userId) break;

        if (sub.status === 'active') {
          await supabase
            .from('user_quotas')
            .update({ is_active: true })
            .eq('user_id', userId);
        } else if (sub.status === 'past_due' || sub.status === 'unpaid') {
          await supabase
            .from('user_quotas')
            .update({ is_active: false })
            .eq('user_id', userId);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as { metadata?: Record<string, string> };
        const userId = sub.metadata?.user_id;
        if (!userId) break;

        await supabase
          .from('user_quotas')
          .update({ is_active: false, plan_id: 'starter', plan_expires_at: null })
          .eq('user_id', userId);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    return NextResponse.json({ error: 'Webhook işleme hatası' }, { status: 500 });
  }
}
