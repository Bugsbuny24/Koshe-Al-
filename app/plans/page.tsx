'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';

const PLANS = [
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

export default function PlansPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const user = useUserStore((s) => s.user);

  const handlePurchase = async (plan: typeof PLANS[0]) => {
    if (!window?.Pi) {
      setError('Pi Browser gerekli.');
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
            userId: user?.id,
            type: 'subscription',
          },
        },
        {
          onReadyForServerApproval: async (paymentId) => {
            await fetch('/api/payments/approve', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId }),
            });
          },
          onReadyForServerCompletion: async (paymentId, txid) => {
            await fetch('/api/payments/complete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paymentId,
                txid,
                userId: user?.id,
                type: 'subscription',
                planId: plan.id,
              }),
            });
            router.push('/dashboard');
          },
          onCancel: () => setLoading(null),
          onError: (err) => {
            setError(err.message);
            setLoading(null);
          },
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
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
      {/* Header */}
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
        <p style={{ color: '#8A8680', fontSize: 15 }}>
          Pi ile öde, hemen başla
        </p>
      </div>

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
          }}
        >
          {error}
        </div>
      )}

      {/* Plans */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          maxWidth: 480,
          margin: '0 auto',
        }}
      >
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            style={{
              background: '#111116',
              border: `1px solid ${plan.color}33`,
              borderRadius: 16,
              padding: 24,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top accent */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: plan.color,
              }}
            />

            {/* Plan header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 20,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: plan.color,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {plan.name}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#4A4845',
                    fontFamily: "'DM Mono', monospace",
                    marginTop: 2,
                  }}
                >
                  {plan.credits} kredi/ay
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: '#F0EDE6',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {plan.price} π
                </div>
                <div style={{ fontSize: 11, color: '#4A4845' }}>
                  ≈ ${(plan.price * 0.1826).toFixed(2)}/ay
                </div>
              </div>
            </div>

            {/* Features */}
            <div style={{ marginBottom: 20 }}>
              {plan.features.map((f) => (
                <div
                  key={f}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 0',
                    fontSize: 13,
                    color: '#8A8680',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  <span style={{ color: plan.color, fontSize: 14 }}>✓</span>
                  {f}
                </div>
              ))}
            </div>

            {/* Button */}
            <button
              onClick={() => handlePurchase(plan)}
              disabled={loading === plan.id}
              style={{
                width: '100%',
                padding: '14px',
                background: loading === plan.id ? '#2A2A30' : plan.color,
                color: loading === plan.id ? '#8A8680' : '#000',
                border: 'none',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "'Syne', sans-serif",
                letterSpacing: '0.04em',
                cursor: loading === plan.id ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {loading === plan.id ? (
                <>
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      border: '2px solid #8A8680',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                      display: 'inline-block',
                    }}
                  />
                  İşleniyor...
                </>
              ) : (
                `${plan.price} π ile Satın Al`
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p
        style={{
          textAlign: 'center',
          color: '#4A4845',
          fontSize: 12,
          marginTop: 32,
          fontFamily: "'DM Mono', monospace",
        }}
      >
        Her ay otomatik yenilenmez. Dilediğinde iptal edebilirsin.
      </p>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
            }
