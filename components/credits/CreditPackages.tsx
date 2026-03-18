import Link from "next/link";
import { CREDIT_PACKAGES } from "@/lib/data/credit-rules";

export default function CreditPackages() {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">
        Kredi Paketleri
      </p>
      <h2 className="section-title mt-2">Paket Seç</h2>
      <p className="section-subtitle">
        İhtiyacına uygun kredi paketini seç ve AI özelliklerini kullanmaya devam
        et.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {CREDIT_PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className={[
              "relative rounded-3xl border p-6 transition",
              pkg.isPopular
                ? "border-fuchsia-500/40 bg-gradient-to-b from-fuchsia-500/10 to-violet-500/10"
                : "border-white/10 bg-white/5 hover:bg-white/8",
            ].join(" ")}
          >
            {pkg.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-fuchsia-500 px-3 py-1 text-xs font-semibold text-white shadow-[0_0_20px_rgba(217,70,239,0.4)]">
                  En Popüler
                </span>
              </div>
            )}

            <div className="text-2xl">{pkg.badge}</div>
            <div className="mt-3 text-sm uppercase tracking-[0.2em] text-slate-400">
              {pkg.name}
            </div>
            <div className="mt-1 text-3xl font-bold text-white">
              {pkg.priceDisplay}
            </div>
            <div className="mt-1 text-xs text-slate-500">{pkg.description}</div>

            <div className="mt-4 text-2xl font-semibold text-cyan-300">
              {pkg.credits.toLocaleString("tr-TR")}
              <span className="ml-1.5 text-sm font-normal text-slate-400">
                kredi
              </span>
            </div>

            <ul className="mt-4 space-y-2">
              {pkg.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="text-cyan-400">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            {/* TODO: Connect to payment backend (Shopier / Stripe) */}
            <Link
              href="/pricing"
              className={[
                "mt-6 block rounded-2xl px-4 py-2.5 text-center text-sm font-semibold transition",
                pkg.isPopular
                  ? "bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white hover:opacity-90"
                  : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
              ].join(" ")}
            >
              Satın Al
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-slate-600">
        * Ödeme entegrasyonu yakında aktif olacak.
      </p>
    </div>
  );
}
