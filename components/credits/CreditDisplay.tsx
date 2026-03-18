"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  buildCreditWarningState,
  formatCreditBalance,
  isLowCreditState,
} from "@/lib/credits/credit-helpers";
import type { CreditTransaction, CreditWarningState } from "@/types/credit";

type CreditApiResponse = {
  credits: number;
  isActive: boolean;
  exists: boolean;
  plan: string | null;
  expiresAt: string | null;
  usageLogs: CreditTransaction[];
  transactions: CreditTransaction[];
};

interface CreditDisplayProps {
  variant?: "compact" | "full";
}

const warningMessages: Record<CreditWarningState, string | null> = {
  ok: null,
  low: "Krediniz azalıyor. Kesintisiz öğrenme için yükleyin.",
  critical: "Krediniz kritik seviyede. Yakında tükenecek.",
  empty: "Krediniz bitti. Devam etmek için kredi yükleyin.",
};

export default function CreditDisplay({ variant = "full" }: CreditDisplayProps) {
  const [data, setData] = useState<CreditApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/credits")
      .then((res) => {
        if (!res.ok) return null;
        return res.json() as Promise<CreditApiResponse>;
      })
      .then((json) => {
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 animate-pulse">
        <div className="h-4 w-24 rounded bg-white/10" />
        <div className="mt-4 h-10 w-32 rounded bg-white/10" />
      </div>
    );
  }

  if (!data) return null;

  if (!data.exists) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">
          Kredi Hesabı
        </p>
        <p className="mt-3 text-sm text-slate-400">
          Henüz kredi hesabınız yok.
        </p>
        <Link
          href="/pricing"
          className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(34,211,238,0.2)] transition hover:opacity-90"
        >
          ✦ Paketleri Gör
        </Link>
      </div>
    );
  }

  const warningState = buildCreditWarningState(data.credits);
  const isLow = isLowCreditState(warningState);
  const warningMsg = warningMessages[warningState];

  const borderColor = isLow ? "border-amber-400/30" : "border-cyan-400/20";

  const badgeColor =
    warningState === "empty"
      ? "bg-red-500/20 text-red-300 border-red-400/20"
      : warningState === "critical"
      ? "bg-orange-500/20 text-orange-300 border-orange-400/20"
      : warningState === "low"
      ? "bg-amber-500/20 text-amber-300 border-amber-400/20"
      : "bg-cyan-500/20 text-cyan-300 border-cyan-400/20";

  if (variant === "compact") {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-2xl border ${borderColor} bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-300`}
      >
        <span>✦</span>
        <span>{formatCreditBalance(data.credits)} kredi</span>
        {data.plan && (
          <span className="text-slate-400">· {data.plan}</span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`rounded-3xl border ${borderColor} bg-gradient-to-br from-cyan-500/5 to-blue-600/5 p-6`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">
            Kredi Bakiyesi
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">
              {formatCreditBalance(data.credits)}
            </span>
            <span className="text-sm text-slate-400">kredi</span>
          </div>
          {data.plan && (
            <p className="mt-1 text-xs text-slate-500">Plan: {data.plan}</p>
          )}
          {data.expiresAt && (
            <p className="mt-0.5 text-xs text-slate-500">
              Bitiş: {new Date(data.expiresAt).toLocaleDateString("tr-TR")}
            </p>
          )}
        </div>

        <span
          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${badgeColor}`}
        >
          {warningState === "ok"
            ? "✦ Aktif"
            : warningState === "low"
            ? "⚠ Azalıyor"
            : warningState === "critical"
            ? "⚠ Kritik"
            : "✕ Bitti"}
        </span>
      </div>

      {/* Warning banner */}
      {isLow && warningMsg && (
        <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          {warningMsg}
        </div>
      )}

      {/* Recent usage */}
      {data.usageLogs.length > 0 && (
        <div className="mt-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Son Kullanım
          </p>
          <div className="mt-3 space-y-2">
            {data.usageLogs.slice(0, 3).map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2"
              >
                <span className="text-xs text-slate-400">{tx.description}</span>
                <span className="text-xs font-medium text-slate-300">
                  -{tx.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent top-ups */}
      {data.transactions.filter((t) => t.type === "credit").length > 0 && (
        <div className="mt-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Son Yüklemeler
          </p>
          <div className="mt-3 space-y-2">
            {data.transactions
              .filter((t) => t.type === "credit")
              .slice(0, 2)
              .map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2"
                >
                  <span className="text-xs text-slate-400">
                    {tx.description}
                  </span>
                  <span className="text-xs font-medium text-emerald-400">
                    +{tx.amount}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(34,211,238,0.2)] transition hover:opacity-90"
        >
          ✦ Kredi Yükle
        </Link>
      </div>
    </div>
  );
}
