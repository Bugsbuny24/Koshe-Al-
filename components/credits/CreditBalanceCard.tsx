import Link from "next/link";
import {
  buildCreditWarningState,
  formatCreditBalance,
  isLowCreditState,
} from "@/lib/credits/credit-helpers";
import type { CreditBalance, CreditTransaction } from "@/types/credit";

interface CreditBalanceCardProps {
  balance: CreditBalance;
  recentTransactions?: CreditTransaction[];
}

export default function CreditBalanceCard({
  balance,
  recentTransactions = [],
}: CreditBalanceCardProps) {
  const warningState = buildCreditWarningState(balance.balance);
  const isLow = isLowCreditState(warningState);

  const borderColor = isLow
    ? "border-amber-400/30"
    : "border-cyan-400/20";

  const badgeColor =
    warningState === "empty"
      ? "bg-red-500/20 text-red-300 border-red-400/20"
      : warningState === "critical"
      ? "bg-orange-500/20 text-orange-300 border-orange-400/20"
      : warningState === "low"
      ? "bg-amber-500/20 text-amber-300 border-amber-400/20"
      : "bg-cyan-500/20 text-cyan-300 border-cyan-400/20";

  const warningMessages: Record<string, string> = {
    empty: "Krediniz bitti. Devam etmek için kredi yükleyin.",
    critical: "Krediniz kritik seviyede. Yakında tükenecek.",
    low: "Krediniz azalıyor. Kesintisiz öğrenme için yükleyin.",
  };

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
              {formatCreditBalance(balance.balance)}
            </span>
            <span className="text-sm text-slate-400">kredi</span>
          </div>
          <div className="mt-1 flex gap-4 text-xs text-slate-500">
            <span>Kazanılan: {balance.totalEarned}</span>
            <span>Harcanan: {balance.totalSpent}</span>
          </div>
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
      {isLow && (
        <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          {warningMessages[warningState]}
        </div>
      )}

      {/* Recent usage */}
      {recentTransactions.length > 0 && (
        <div className="mt-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Son Kullanım
          </p>
          <div className="mt-3 space-y-2">
            {recentTransactions.slice(0, 3).map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2"
              >
                <span className="text-xs text-slate-400">{tx.description}</span>
                <span
                  className={`text-xs font-medium ${
                    tx.type === "credit" ? "text-emerald-400" : "text-slate-300"
                  }`}
                >
                  {tx.type === "credit" ? "+" : "-"}
                  {tx.amount}
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
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10"
        >
          Tüm İşlemler
        </Link>
      </div>
    </div>
  );
}
