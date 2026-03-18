import Link from "next/link";
import { CREDIT_COST_RULES } from "@/lib/data/credit-rules";
import { CREDIT_PACKAGES_DEF } from "@/lib/data/credit-packages";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#050816] px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="mb-14 text-center">
          <div className="text-sm uppercase tracking-[0.3em] text-cyan-300">
            Koshei AI University
          </div>
          <h1 className="mt-3 text-4xl font-semibold">Kredi Paketi Seç</h1>
          <p className="mx-auto mt-3 max-w-md text-slate-400">
            Kullandıkça öde. Süre sınırı yok.
          </p>
        </div>

        {/* ── Credit packages ──────────────────────────────────────────────── */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CREDIT_PACKAGES_DEF.map((pkg) => (
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

              <div className="mt-3 text-sm uppercase tracking-[0.2em] text-slate-400">
                {pkg.name}
              </div>

              <div className="mt-4 text-4xl font-bold text-white">
                {pkg.priceTRY}
              </div>

              <div className="mt-4 text-2xl font-semibold text-cyan-300">
                {pkg.credits.toLocaleString("tr-TR")}
                <span className="ml-1.5 text-sm font-normal text-slate-400">kredi</span>
              </div>

              <p className="mt-3 text-sm text-slate-400">{pkg.description}</p>

              {pkg.shopierUrl ? (
                <a
                  href={pkg.shopierUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={[
                    "mt-8 block rounded-2xl px-4 py-3 text-center text-sm font-semibold transition",
                    pkg.isPopular
                      ? "bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white hover:opacity-90"
                      : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
                  ].join(" ")}
                >
                  {pkg.name} Paketi Al
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="mt-8 block w-full cursor-not-allowed rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-slate-500"
                >
                  Yakında
                </button>
              )}
            </div>
          ))}
        </div>

        {/* ── Usage costs breakdown ────────────────────────────────────────── */}
        <div className="mt-14 rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">
            Kredi Kullanımı
          </p>
          <h2 className="mt-2 text-xl font-semibold">Ne kadar kredi harcar?</h2>

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
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center text-sm text-slate-400">
          Shopier üzerinden ödeme yapıldıktan sonra krediniz kısa sürede manuel olarak hesabınıza yüklenir.
        </div>

        {/* ── Credit system FAQ ─────────────────────────────────────────────── */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            {
              q: "Kredi nasıl çalışır?",
              a: "Aylık ücret yok. Kredi al, istediğinde harca — ders, canlı pratik ve sertifika için kullanılır.",
            },
            {
              q: "Ödeme sonrası ne olur?",
              a: "Shopier üzerinden ödeme yaptıktan sonra ekip, krediyi kısa sürede manuel olarak hesabına yükler.",
            },
          ].map((item) => (
            <div
              key={item.q}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4"
            >
              <div className="text-sm font-medium text-slate-200">{item.q}</div>
              <p className="mt-2 text-xs leading-5 text-slate-400">{item.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link href="/dashboard" className="text-cyan-300 hover:text-cyan-200">
            Dashboard&apos;a dön
          </Link>
        </div>

      </div>
    </main>
  );
}
