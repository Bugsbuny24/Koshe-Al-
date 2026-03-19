'use client';
import { useState, useCallback } from 'react';

interface PaymentOptions {
  amount: number;
  memo: string;
  metadata: Record<string, unknown>;
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

    window.Pi.createPayment(
      { amount: options.amount, memo: options.memo, metadata: options.metadata },
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
            body: JSON.stringify({ paymentId, txid }),
          });
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
