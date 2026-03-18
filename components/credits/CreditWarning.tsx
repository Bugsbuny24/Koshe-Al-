"use client";

import Link from "next/link";
import type { CreditWarningState } from "@/types/credit";

type WarningConfig = {
  border: string;
  bg: string;
  icon: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeText: string;
};

interface CreditWarningProps {
  warningState: CreditWarningState;
  balance: number;
  estimatedCost: number;
  featureLabel: string;
  /** Optional children rendered when credits are sufficient */
  children?: React.ReactNode;
}

export default function CreditWarning({
  warningState,
  balance,
  estimatedCost,
  featureLabel,
  children,
}: CreditWarningProps) {
  if (warningState === "ok") {
    // Enough credits — render the feature content (cost hint only)
    return (
      <>
        {estimatedCost > 0 && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl border border-cyan-400/15 bg-cyan-500/8 px-4 py-2.5 text-sm text-cyan-300/80">
            <span>✦</span>
            <span>
              {featureLabel} için tahmini maliyet:{" "}
              <strong className="text-cyan-300">{estimatedCost} kredi</strong>
            </span>
          </div>
        )}
        {children}
      </>
    );
  }

  const configs = {
    empty: {
      border: "border-red-400/30",
      bg: "from-red-500/10 to-orange-500/10",
      icon: "🚫",
      title: "Krediniz Tükendi",
      subtitle:
        "Bu özelliği kullanmak için kredi yüklemeniz gerekiyor.",
      badge: "bg-red-500/20 text-red-300",
      badgeText: "0 kredi",
    },
    critical: {
      border: "border-orange-400/30",
      bg: "from-orange-500/10 to-amber-500/10",
      icon: "⚠️",
      title: "Krediniz Kritik Seviyede",
      subtitle: `Mevcut: ${balance} kredi · ${featureLabel} için ${estimatedCost} kredi gerekiyor.`,
      badge: "bg-orange-500/20 text-orange-300",
      badgeText: `${balance} kredi`,
    },
    low: {
      border: "border-amber-400/30",
      bg: "from-amber-500/10 to-yellow-500/10",
      icon: "⚡",
      title: "Krediniz Azalıyor",
      subtitle: `Mevcut: ${balance} kredi · ${featureLabel} için ${estimatedCost} kredi gerekiyor.`,
      badge: "bg-amber-500/20 text-amber-300",
      badgeText: `${balance} kredi`,
    },
  } satisfies Record<Exclude<CreditWarningState, "ok">, WarningConfig>;

  const cfg = configs[warningState as Exclude<CreditWarningState, "ok">];

  const canProceed = balance >= estimatedCost;

  return (
    <div
      className={`rounded-3xl border ${cfg.border} bg-gradient-to-br ${cfg.bg} p-6`}
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl">{cfg.icon}</span>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-semibold text-white">{cfg.title}</h3>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.badge}`}
            >
              {cfg.badgeText}
            </span>
          </div>
          <p className="mt-1.5 text-sm text-slate-400">{cfg.subtitle}</p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              ✦ Kredi Yükle
            </Link>
            {canProceed && children}
          </div>
        </div>
      </div>
    </div>
  );
}
