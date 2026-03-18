import Link from "next/link";
import { CREDIT_COST_RULES } from "@/lib/data/credit-rules";

const SHOPIER_LINKS = {
  starter:  "https://www.shopier.com/TradeVisual/45362316",
  growth:   "https://www.shopier.com/TradeVisual/45362403",
  pro:      "https://www.shopier.com/TradeVisual/45362552",
  prestige: "https://www.shopier.com/TradeVisual/45362662",
} as const;

const PACKAGES = [
  {
    id: "starter",
    name: "Starter",
    price: "₺199",
    credits: 100,
    desc: "Başlamak için ideal",
    bullets: ["Konuşmaya başla", "Ders oluştur", "Temel AI pratik"],
    shopierUrl: SHOPIER_LINKS.starter,
    isPopular: false,
  },
  {
    id: "growth",
    name: "Growth",
    price: "₺499",
    credits: 300,
    desc: "Düzenli öğrenciler için",
    bullets: ["Daha fazla canlı pratik", "Düzenli ders akışı", "En dengeli paket"],
    shopierUrl: SHOPIER_LINKS.growth,
    isPopular: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "₺1.299",
    credits: 1000,
    desc: "Yoğun öğrenme için",
    bullets: ["Yoğun kullanım", "Daha yüksek kredi hacmi", "Hızlı ilerleme"],
    shopierUrl: SHOPIER_LINKS.pro,
    isPopular: false,
  },
  {
    id: "prestige",
    name: "Prestige",
    price: "₺2.999",
    credits: 3000,
    desc: "Sınırsız akademik deneyim",
    bullets: ["En yüksek kredi hacmi", "Uzun dönem kullanım", "Tam akademik akış"],
    shopierUrl: SHOPIER_LINKS.prestige,
    isPopular: false,
  },
] as const;

const FAQ = [
  {
    q: "Neden abonelik değil kredi?",
    a: "Kullanmadığın özellik için aylık ücret ödemezsin. Sadece ihtiyacın kadar kredi al.",
  },
  {
    q: "Krediyle tam olarak ne yapabilirim?",
    a: "Ders oluşturma, konuşma pratiği, AI özellikleri ve sertifika düzenleme krediyle çalışır.",
  },
  {
    q: "Ödeme sonrası ne olur?",
    a: "Ödeme sonrası kredi manuel olarak yüklenir. Genellikle birkaç saat içinde hesabına geçer.",
  },
  {
    q: "Kredi yükleme nasıl yapılır?",
    a: "Siparişte girilen e-posta ile hesabın eşleştirilir ve kredi otomatik olarak tanımlanır.",
  },
] as const;

export default function PricingPage() {
  return (
    <main className="min-h-screen text-white">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.25),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.15),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-16 text-center md:px-6 md:pt-20">
          <div className="text-xs uppercase tracking-[0.35em] text-cyan-300">Koshei AI University</div>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl lg:text-6xl">Kredi Paketi Seç</h1>
          <p className="mx-auto mt-4 max-w-lg text-base text-slate-300">
            Kredinle istediğin zaman ders oluştur, canlı pratik yap ve AI özelliklerini kullan.
          </p>
          <div className="mt-5 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-400">
            Abonelik yok · kullandıkça öde
          </div>
        </div>
      </section>

      {/* ── PACKAGES ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-4 pt-8 md:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={[
                "relative flex flex-col rounded-3xl border p-8 transition",
                pkg.isPopular
                  ? "border-fuchsia-500/40 bg-gradient-to-b from-fuchsia-500/10 to-violet-500/10 shadow-[0_8px_40px_rgba(168,85,247,0.18)]"
                  : "border-white/10 bg-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.3)]",
              ].join(" ")}
            >
              {pkg.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-fuchsia-500 px-3 py-1 text-xs font-semibold text-white shadow-[0_0_20px_rgba(217,70,239,0.5)]">
                    En Popüler
                  </span>
                </div>
              )}

              <div className="text-sm uppercase tracking-[0.2em] text-slate-400">{pkg.name}</div>
              <div className="mt-4 text-5xl font-bold">{pkg.price}</div>
              <div className="mt-3 text-2xl font-semibold text-cyan-300">
                {pkg.credits.toLocaleString("tr-TR")}
                <span className="ml-1.5 text-sm font-normal text-slate-400">kredi</span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{pkg.desc}</p>

              <ul className="mt-5 space-y-2 border-t border-white/8 pt-5">
                {pkg.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-cyan-400">✓</span> {b}
                  </li>
                ))}
              </ul>

              <a
                href={pkg.shopierUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={[
                  "mt-auto block rounded-2xl px-4 py-3.5 text-center text-sm font-semibold transition",
                  pkg.isPopular
                    ? "mt-8 bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.25)] hover:opacity-90"
                    : "mt-8 border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
                ].join(" ")}
              >
                {pkg.name} Paketi Al
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── CREDIT USAGE MATRIX ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
          <div className="text-xs uppercase tracking-[0.35em] text-cyan-300">Kredi Kullanımı</div>
          <h2 className="mt-2 text-2xl font-bold">Ne kadar kredi harcar?</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CREDIT_COST_RULES.map((rule) => (
              <div
                key={rule.usageType}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5"
              >
                <span className="text-sm text-slate-300">{rule.label}</span>
                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                  {rule.costPerUnit} / {rule.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="relative border-y border-white/5 bg-black/20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.05),transparent_70%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-6">
          <div className="mb-8 text-center">
            <div className="text-xs uppercase tracking-[0.35em] text-cyan-300">Sık Sorulanlar</div>
            <h2 className="mt-3 text-2xl font-bold md:text-3xl">Merak ettiklerin</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {FAQ.map((item) => (
              <div
                key={item.q}
                className="rounded-3xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-xl"
              >
                <div className="font-semibold text-slate-100">{item.q}</div>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-fuchsia-500/10 px-6 py-16 text-center shadow-[0_8px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl md:px-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.12),transparent_70%)]" />
          <div className="relative">
            <h2 className="text-3xl font-bold md:text-4xl">Akademik Yolculuğuna Başla</h2>
            <p className="mt-3 text-sm text-slate-400">Koshei AI ile konuş, öğren, sertifika kazan.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-8 py-3.5 font-semibold text-white shadow-[0_0_30px_rgba(168,85,247,0.3)] transition hover:opacity-90"
              >
                Ücretsiz Kayıt Ol
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-8 py-3.5 font-medium text-slate-100 transition hover:border-white/20 hover:bg-white/10"
              >
                Programları İncele
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
