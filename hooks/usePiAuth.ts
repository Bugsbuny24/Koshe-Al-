'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';

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
      const auth = await window.Pi.authenticate(
        ['username', 'payments'],
        async (payment) => {
          await fetch('/api/payments/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId: payment.identifier }),
          });
        }
      );

      const res = await fetch('/api/auth/pi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: auth.accessToken,
          uid: auth.user.uid,
          username: auth.user.username,
        }),
      });

      if (!res.ok) throw new Error('Auth failed');
      const user = await res.json();
      setUser(user);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  }, [router, setUser]);

  return { login, loading, error };
}
