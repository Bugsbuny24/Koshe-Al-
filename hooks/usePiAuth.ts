'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';

type AuthApiResponse = {
  error?: string;
  plan_id?: string | null;
  [key: string]: unknown;
};

export function usePiAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);

  const login = useCallback(async () => {
    if (typeof window === 'undefined' || !window?.Pi) {
      setError('Pi Browser gerekli. Lütfen Pi Browser üzerinden açın.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // payments scope ile authenticate
      const auth = await window.Pi.authenticate(
        ['username', 'payments'],
        async (payment) => {
          const meta = (payment.metadata ?? {}) as Record<string, unknown>;
          await fetch('/api/payments/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentId: payment.identifier,
              txid: payment.transaction?.txid ?? null,
              userId: typeof meta.userId === 'string' ? meta.userId : null,
              type: typeof meta.type === 'string' ? meta.type : null,
              planId: typeof meta.planId === 'string' ? meta.planId : null,
              packageId: typeof meta.packageId === 'string' ? meta.packageId : null,
            }),
          });
        }
      );

      if (!auth?.accessToken || !auth?.user?.uid || !auth?.user?.username) {
        throw new Error('Pi auth bilgisi eksik geldi');
      }

      const res = await fetch('/api/auth/pi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: auth.accessToken,
          uid: auth.user.uid,
          username: auth.user.username,
        }),
      });

      const data: AuthApiResponse | null = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || 'Auth failed');
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setUser(data as any);

      if (data?.plan_id) {
        router.push('/dashboard');
      } else {
        router.push('/plans');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  }, [router, setUser]);

  return { login, loading, error };
}
