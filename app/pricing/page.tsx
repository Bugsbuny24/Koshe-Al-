import Link from "next/link";

const pricingPlans = [
  { language: "English", price: 159, flag: "🇬🇧", popular: true },
  { language: "German", price: 219, flag: "🇩🇪", popular: false },
  { language: "French", price: 189, flag: "🇫🇷", popular: false },
  { language: "Italian", price: 209, flag: "🇮🇹", popular: false },
  { language: "Spanish", price: 229, flag: "🇪🇸", popular: false },
  { language: "Portuguese", price: 189, flag: "🇵🇹", popular: false },
  { language: "Arabic", price: 259, flag: "🇸🇦", popular: false },
  { language: "Russian", price: 239, flag: "🇷🇺", popular: false },
  { language: "Japanese", price: 429, flag: "🇯🇵", popular: false },
  { language: "Chinese", price: 319, flag: "🇨🇳", popular: false },
  { language: "Korean", price: 289, flag: "🇰🇷", popular: false },
  { language: "Dutch", price: 199, flag: "🇳🇱", popular: false },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_18%),linear-gradient(180deg,#030712_0%,#061127_52%,#020617_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/70">
            Koshei V1 • Premium
          </p>
          <h1 className="mt-3 text-4xl font-semibold md:text-5xl">
            Sınırsız öğrenme başlar
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Her dil için özel fiyatlandırma. Bir kez öde, o dilde sınırsız
            konuş.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pricingPlans.map((plan) => (
            <div
              key={plan.language}
              className={[
                "relative rounded-[28px] border p-6 transition",
                plan.popular
                  ? "border-cyan-300/20 bg-cyan-400/[0.08]"
                  : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]",
              ].join(" ")}
            >
              {plan.popular ? (
                <span className="absolute -top-3 left-6 rounded-full border border-cyan-300/20 bg-cyan-500/20 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-cyan-200">
                  Popüler
                </span>
              ) : null}

              <div className="text-3xl">{plan.flag}</div>
              <h2 className="mt-3 text-xl font-semibold text-white">
                {plan.language}
              </h2>

              <div className="mt-4 flex items-end gap-1">
                <span className="text-4xl font-bold text-white">
                  {plan.price}₺
                </span>
                <span className="mb-1 text-sm text-slate-400">/ay</span>
              </div>

              <ul className="mt-5 space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400">✓</span> Sınırsız speaking sorusu
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400">✓</span> Tüm seviyeler (A1–D2)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400">✓</span> Mikrofon + yazma
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400">✓</span> AI düzeltme + puan
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400">✓</span> İlerleme geçmişi
                </li>
              </ul>

              <Link
                href="/login"
                className={[
                  "mt-6 block rounded-2xl px-4 py-3 text-center text-sm font-semibold transition",
                  plan.popular
                    ? "bg-blue-500 text-white hover:bg-blue-400"
                    : "border border-white/10 bg-white/[0.04] text-slate-100 hover:bg-white/[0.08]",
                ].join(" ")}
              >
                Başla
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[28px] border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">
                Free Plan
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Ücretsiz başla
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Hesap oluştururken hiçbir ödeme gerekmez. Günde 20 speaking
                sorusu ile Koshei&apos;yi dene.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400">✓</span> 20 speaking sorusu / gün
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400">✓</span> AI düzeltme
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400">✓</span> Temel kelime hafızası
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-slate-500">✗</span> Sınırsız erişim
                </li>
              </ul>
              <Link
                href="/login"
                className="mt-6 inline-block rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/[0.08]"
              >
                Ücretsiz Başla
              </Link>
            </div>

            <div className="rounded-[24px] border border-cyan-300/12 bg-cyan-400/[0.07] p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-100/70">
                Neden Premium?
              </p>
              <p className="mt-3 text-sm leading-7 text-cyan-50">
                Koshei sana her gün özel dersler hazırlar. Yaptığın her hatayı
                öğrenir ve sana en çok ihtiyaç duyduğun alanlarda pratik
                yapar. Premium ile günde istediğin kadar konuş, ilerleme
                grafiğinle motivasyonunu koru.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-cyan-300/12 bg-cyan-400/[0.08] p-3 text-center">
                  <p className="text-2xl font-bold text-cyan-100">∞</p>
                  <p className="mt-1 text-xs text-cyan-200/70">Soru / gün</p>
                </div>
                <div className="rounded-2xl border border-cyan-300/12 bg-cyan-400/[0.08] p-3 text-center">
                  <p className="text-2xl font-bold text-cyan-100">43+</p>
                  <p className="mt-1 text-xs text-cyan-200/70">Dil</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
