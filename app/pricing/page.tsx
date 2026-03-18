import Link from "next/link";
import { CREDIT_PACKAGES, CREDIT_COST_RULES } from "@/lib/data/credit-rules";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#050816] px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="mb-14 text-center">
          <div className="text-sm uppercase tracking-[0.3em] text-cyan-300">
            Koshei AI
          </div>
          <h1 className="mt-3 text-4xl font-semibold">Kredi Paketi Seç</h1>
          <p className="mx-auto mt-4 max-w-xl text-slate-300">
            Kredinle istediğin zaman ders oluştur, canlı pratik yap ve AI
            özelliklerini kullan. Süre sınırı yok — kullandıkça ödersin.
          </p>
        </div>

        {/* ── Credit packages ──────────────────────────────────────────────── */}
        <div className="grid gap-6 sm:grid-cols-3">
          {CREDIT_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={[
                "relative rounded-3xl border p-8 transition",
                pkg.isPopular
                  ? "border-fuchsia-500/40 bg-gradient-to-b from-fuchsia-500/10 to-violet-500/10"
                  : "border-white/10 bg-white/5",
              ].join(" ")}
            >
              {pkg.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-fuchsia-500 px-3 py-1 text-xs font-semibold text-white shadow-[0_0_20px_rgba(217,70,239,0.4)]">
                    En Popüler
                  </span>
                </div>
              )}

              <div className="text-3xl">{pkg.badge}</div>

              <div className="mt-3 text-sm uppercase tracking-[0.2em] text-slate-400">
                {pkg.name}
              </div>

              <div className="mt-4 text-4xl font-bold text-white">
                {pkg.priceDisplay}
              </div>
              <div className="mt-1 text-xs text-slate-500">{pkg.description}</div>

              <div className="mt-4 text-2xl font-semibold text-cyan-300">
                {pkg.credits.toLocaleString("tr-TR")}
                <span className="ml-1.5 text-sm font-normal text-slate-400">kredi</span>
              </div>

              <ul className="mt-6 space-y-2">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-cyan-400">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* TODO: Connect to payment backend (Shopier / Stripe) */}
              <Link
                href="/dashboard"
                className={[
                  "mt-8 block rounded-2xl px-4 py-3 text-center text-sm font-semibold transition",
                  pkg.isPopular
                    ? "bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white hover:opacity-90"
                    : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
                ].join(" ")}
              >
                {pkg.name} Paketi Al
              </Link>
            </div>
          ))}
        </div>

        {/* ── Usage costs breakdown ────────────────────────────────────────── */}
        <div className="mt-14 rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">
            Kredi Kullanımı
          </p>
          <h2 className="mt-2 text-xl font-semibold">Ne kadar kredi harcar?</h2>
          <p className="mt-2 text-sm text-slate-400">
            Her AI özelliği aşağıdaki oranlarda kredi kullanır.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {CREDIT_COST_RULES.map((rule) => (
              <div
                key={rule.usageType}
                className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-4 py-3"
              >
                <span className="text-sm text-slate-300">{rule.label}</span>
                <span className="rounded-full bg-cyan-500/10 px-3 py-0.5 text-xs font-semibold text-cyan-300">
                  {rule.costPerUnit} kredi / {rule.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer note ──────────────────────────────────────────────────── */}
        <p className="mt-10 text-center text-sm text-slate-500">
          * Ödeme entegrasyonu yakında aktif olacak. Krediler satın alma sonrası
          hesabınıza otomatik yüklenir.
        </p>

        <div className="mt-6 text-center">
          <Link href="/dashboard" className="text-cyan-300 hover:text-cyan-200">
            Dashboard&apos;a dön
          </Link>
        </div>

      </div>
    </main>
  );
}
