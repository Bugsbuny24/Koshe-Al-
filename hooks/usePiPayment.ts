'use client';

import { useState, useCallback } from 'react';

type PaymentType = 'course' | 'subscription' | 'module' | 'freelance' | 'credits';

interface PaymentMeta {
  userId?: string;
  type?: PaymentType;
  planId?: string;
  packageId?: string;
  [key: string]: unknown;
}

interface PaymentOptions {
  amount: number;
  memo: string;
  metadata: PaymentMeta;
  onSuccess?: (txid: string) => void;
  onError?: (error: Error) => void;
}

export function usePiPayment() {
  const [loading, setLoading] = useState(false);

  const pay = useCallback(async (options: PaymentOptions) => {
    if (typeof window === 'undefined' || !window?.Pi) {
      options.onError?.(new Error('Pi Browser gerekli'));
      return;
    }

    setLoading(true);

    const { amount, memo, metadata } = options;
    const { userId, type, planId, packageId } = metadata;

    window.Pi.createPayment(
      { amount, memo, metadata },
      {
        onReadyForServerApproval: async (paymentId) => {
          const res = await fetch('/api/payments/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentId,
              userId,
              type,
              planId,
              packageId,
              amount,
              memo,
            }),
          });
          if (!res.ok) {
            const data = await res.json().catch(() => null);
            throw new Error(data?.error || 'Payment approval failed');
          }
        },
        onReadyForServerCompletion: async (paymentId, txid) => {
          const res = await fetch('/api/payments/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentId,
              txid,
              userId,
              type,
              planId,
              packageId,
              amount,
              memo,
            }),
          });
          if (!res.ok) {
            const data = await res.json().catch(() => null);
            throw new Error(data?.error || 'Payment completion failed');
          }
          options.onSuccess?.(txid);
          setLoading(false);
        },
        onCancel: () => setLoading(false),
        onError: (err) => {
          options.onError?.(err);
          setLoading(false);
        },
      }
    );
  }, []);

  return { pay, loading };
}
