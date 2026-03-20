'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';

type Plan = {
  id: 'starter' | 'pro' | 'ultra';
  name: string;
  price: number;
  credits: number;
  color: string;
  features: string[];
};

const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 35,
    credits: 400,
    color: '#F0A500',
    features: [
      '400 kredi/ay',
      'AI Mentor (basit sorular)',
      'Tüm kurslar',
      'Sesli ders',
      '1 proje deploy',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 80,
    credits: 1500,
    color: '#3D7BFF',
    features: [
      '1500 kredi/ay',
      'AI Mentor (gelişmiş)',
      'AI Builder',
      '5 proje deploy',
      'Görsel üretimi (30/ay)',
      'Canlı konuşma (60 dk/ay)',
    ],
  },
  {
    id: 'ultra',
    name: 'Ultra',
    price: 300,
    credits: 5000,
    color: '#00D16C',
    features: [
      '5000 kredi/ay',
      'Sınırsız AI Mentor',
      'Sınırsız Builder',
      'Sınırsız proje deploy',
      'Video üretimi (10/ay)',
      'Görsel üretimi (100/ay)',
      'Canlı konuşma (300 dk/ay)',
    ],
  },
];

type ApiErrorResponse = {
  success?: boolean;
  error?: string;
};

export default function PlansPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    let mounted = true;

    const bootstrapPi = async () => {
      if (typeof window === 'undefined' || !window?.Pi) {
        if (mounted) setReady(true);
        return;
      }

      try {
        await window.Pi.authenticate(
          ['username', 'payments'],
          async (incompletePayment) => {
            try {
              const res = await fetch('/api/payments/complete', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  paymentId: incompletePayment.identifier,
                  txid: incompletePayment.transaction?.txid ?? null,
                  userId: user?.id ?? null,
                  type: 'subscription',
                  planId:
                    typeof incompletePayment.metadata?.planId === 'string'
                      ? incompletePayment.metadata.planId
                      : null,
                  amount:
                    typeof incompletePayment.amount === 'number'
                      ? incompletePayment.amount
                      : undefined,
                  memo:
                    typeof incompletePayment.memo === 'string'
                      ? incompletePayment.memo
                      : null,
                }),
              });

              const data = (await res.json().catch(() => null)) as ApiErrorResponse | null;

              if (!res.ok) {
                console.error('Incomplete payment recovery failed:', data?.error || res.statusText);
              }
            } catch (recoveryError) {
              console.error('Incomplete payment recovery request failed:', recoveryError);
            }
          }
        );
      } catch (authError) {
        console.error('Pi authenticate on plans page failed:', authError);
      } finally {
        if (mounted) setReady(true);
      }
    };

    bootstrapPi();

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const handlePurchase = async (plan: Plan) => {
    if (!window?.Pi) {
      setError('Pi Browser gerekli.');
      return;
    }

    if (!user?.id) {
      setError('Önce giriş yapmalısın.');
      return;
    }

    setLoading(plan.id);
    setError(null);

    try {
      window.Pi.createPayment(
        {
          amount: plan.price,
          memo: `Koshei ${plan.name} - Aylık Plan`,
          metadata: {
            planId: plan.id,
            userId: user.id,
            type: 'subscription',
          },
        },
        {
          onReadyForServerApproval: async (paymentId) => {
            try {
              const res = await fetch('/api/payments/approve', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  paymentId,
                  userId: user.id,
                  type: 'subscription',
                  planId: plan.id,
                  amount: plan.price,
                  memo: `Koshei ${plan.name} - Aylık Plan`,
                }),
              });

              const data = (await res.json().catch(() => null)) as ApiErrorResponse | null;

              if (!res.ok) {
                throw new Error(data?.error || 'Payment approval failed');
              }
            } catch (approvalError) {
              const msg =
                approvalError instanceof Error
                  ? approvalError.message
                  : 'Ödeme onaylama sırasında hata oluştu';
              console.error('onReadyForServerApproval error:', approvalError);
              setError(msg);
              setLoading(null);
              throw approvalError;
            }
          },

          onReadyForServerCompletion: async (paymentId, txid) => {
            try {
              const res = await fetch('/api/payments/complete', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  paymentId,
                  txid,
                  userId: user.id,
                  type: 'subscription',
                  planId: plan.id,
                  amount: plan.price,
                  memo: `Koshei ${plan.name} - Aylık Plan`,
                }),
              });

              const data = (await res.json().catch(() => null)) as ApiErrorResponse | null;

              if (!res.ok) {
                throw new Error(data?.error || 'Payment completion failed');
              }

              setUser({
                ...user,
                plan_id: plan.id,
                is_premium: true,
              });
              setLoading(null);
              window.location.href = '/dashboard';
            } catch (completionError) {
              const msg =
                completionError instanceof Error
                  ? completionError.message
                  : 'Ödeme tamamlanırken hata oluştu';
              console.error('onReadyForServerCompletion error:', completionError);
              setError(msg);
              setLoading(null);
            }
          },

          onCancel: () => {
            setLoading(null);
          },

          onError: (piError) => {
            setError(piError?.message || 'Ödeme sırasında hata oluştu');
            setLoading(null);
          },
        }
      );
    } catch (purchaseError) {
      setError(
        purchaseError instanceof Error ? purchaseError.message : 'Hata oluştu'
      );
      setLoading(null);
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#060608',
        color: '#F0EDE6',
        fontFamily: "'Syne', sans-serif",
        padding: '40px 20px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🚀</div>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginBottom: 8,
          }}
        >
          Plan Seç
        </h1>
        <p style={{ color: '#8A8680', fontSize: 15 }}>Pi ile öde, hemen başla</p>
      </div>

      {!ready && (
        <div
          style={{
            textAlign: 'center',
            color: '#8A8680',
            marginBottom: 24,
          }}
        >
          Hazırlanıyor...
        </div>
      )}

      {error && (
        <div
          style={{
            background: 'rgba(255,100,100,0.1)',
            border: '1px solid rgba(255,100,100,0.3)',
            borderRadius: 12,
            padding: '12px 16px',
            marginBottom: 24,
            color: '#ff6464',
            fontSize: 14,
            textAlign: 'center',
            maxWidth: 480,
            marginInline: 'auto',
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          maxWidth: 480,
          margin: '0 auto',
          opacity: ready ? 1 : 0.5,
          pointerEvents: ready ? 'auto' : 'none',
        }}
      >
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            style={{
              background: '#111116',
              border: `1px solid ${plan.color}55`,
              borderRadius: 24,
              padding: 24,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: 16,
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: plan.color,
                    marginBottom: 6,
                  }}
                >
                  {plan.name}
                </h2>
                <p style={{ color: '#8A8680', fontSize: 14 }}>
                  {plan.credits} kredi/ay
                </p>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800 }}>{plan.price} π</div>
            </div>

            <div style={{ marginBottom: 24 }}>
              {plan.features.map((feature) => (
                <div
                  key={feature}
                  style={{
                    padding: '10px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    color: '#D4D0C8',
                    fontSize: 15,
                  }}
                >
                  ✓ {feature}
                </div>
              ))}
            </div>

            <button
              onClick={() => handlePurchase(plan)}
              disabled={loading === plan.id}
              style={{
                width: '100%',
                border: 'none',
                borderRadius: 16,
                padding: '16px 20px',
                background: loading === plan.id ? '#2A2A30' : plan.color,
                color: loading === plan.id ? '#8A8680' : '#060608',
                fontWeight: 800,
                fontSize: 18,
                cursor: loading === plan.id ? 'not-allowed' : 'pointer',
              }}
            >
              {loading === plan.id ? 'İşleniyor...' : `${plan.price} π ile Satın Al`}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
