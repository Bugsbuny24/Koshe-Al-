"use client";

import { useState } from "react";
import { initPi, isPiBrowser } from "@/lib/pi";

export default function PiPaymentButton({
  amount,
  memo,
  metadata,
}: {
  amount: number;
  memo: string;
  metadata: Record<string, unknown>;
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handlePayment() {
    setMessage("");

    if (!isPiBrowser()) {
      setMessage("Pi ödemeleri yalnızca Pi Browser içinde çalışır.");
      return;
    }

    try {
      setLoading(true);
      initPi();

      window.Pi!.createPayment(
        { amount, memo, metadata },
        {
          onReadyForServerApproval: async (paymentId: string) => {
            await fetch("/api/pi/payment/approve", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId }),
            });
          },
          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            const res = await fetch("/api/pi/payment/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId, txid, metadata }),
            });

            const data = await res.json();
            if (!res.ok) {
              throw new Error(data?.error || "Ödeme tamamlanamadı.");
            }

            setMessage("Ödeme tamamlandı.");
            setLoading(false);
          },
          onCancel: async (paymentId: string) => {
            await fetch("/api/pi/payment/cancel", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId }),
            });

            setMessage("Ödeme iptal edildi.");
            setLoading(false);
          },
          onError: () => {
            setMessage("Pi ödeme hatası oluştu.");
            setLoading(false);
          },
        }
      );
    } catch {
      setMessage("Pi ödeme başlatılamadı.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handlePayment}
        disabled={loading}
        className="inline-flex h-10 items-center justify-center rounded-xl bg-[#6b3df5] px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Açılıyor..." : `Pi ile Öde (${amount} π)`}
      </button>
      {message ? <p className="text-xs text-cyan-200">{message}</p> : null}
    </div>
  );
}
