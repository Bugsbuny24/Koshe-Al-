"use client";

import { useState, useCallback } from "react";
import { piAuthenticate, piCreatePayment, piShare } from "@/lib/pi-sdk";
import type { AuthResult } from "@/types/pi-sdk";

export function usePiAuth() {
  const [user, setUser] = useState<AuthResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await piAuthenticate();
      setUser(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading, error, login };
}

export function usePiPayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const pay = useCallback(
    (amount: number, memo: string, metadata: Record<string, unknown> = {}) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      piCreatePayment(amount, memo, metadata, {
        onReadyForServerApproval: (paymentId) => {
          console.log("Ready for server approval:", paymentId);
        },
        onReadyForServerCompletion: (paymentId, txid) => {
          console.log("Payment complete:", paymentId, txid);
          setSuccess(true);
          setLoading(false);
        },
        onCancel: (paymentId) => {
          console.log("Payment cancelled:", paymentId);
          setLoading(false);
        },
        onError: (err) => {
          setError(err.message);
          setLoading(false);
        },
      });
    },
    []
  );

  return { pay, loading, error, success };
}

export function usePiShare() {
  const share = useCallback((title: string, message: string) => {
    piShare(title, message);
  }, []);

  return { share };
}
