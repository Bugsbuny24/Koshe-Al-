import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#050816] px-6 py-12 text-white">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="text-center mb-14">

          <div className="text-sm uppercase tracking-[0.3em] text-cyan-300">
            Koshei AI
          </div>

          <h1 className="mt-3 text-4xl font-semibold">
            Planını Seç
          </h1>

          <p className="mt-4 text-slate-300">
            Koshei ile gerçek konuşma pratiği yap.
            Hatalarını düzelt ve dil öğrenimini hızlandır.
          </p>

        </div>

        {/* PLANS */}

        <div className="grid md:grid-cols-2 gap-8">

          {/* STARTER */}

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-8">

            <div className="text-sm uppercase tracking-[0.2em] text-slate-400">
              Starter
            </div>

            <h2 className="mt-3 text-3xl font-semibold">
              Aylık
            </h2>

            <div className="mt-6 text-5xl font-semibold">
              ₺1.200
              <span className="text-lg text-slate-400"> / ay</span>
            </div>

            <ul className="mt-8 space-y-3 text-slate-200">

              <li>✔ 8 Dil Erişimi</li>
              <li>✔ Türk dili ailesi</li>
              <li>✔ AI konuşma pratiği</li>
              <li>✔ Hata düzeltme</li>
              <li>✔ Günlük konuşma dersleri</li>

            </ul>

            <a
              href="https://www.shopier.com/TradeVisual/45264454"
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-6 py-3 font-medium text-white transition hover:opacity-90"
            >
              Starter Aylık Al
            </a>

          </div>

          {/* ALL ACCESS */}

          <div className="rounded-[28px] border border-fuchsia-500/40 bg-gradient-to-b from-fuchsia-500/10 to-violet-500/10 p-8">

            <div className="inline-flex rounded-full bg-fuchsia-500/15 px-3 py-1 text-xs uppercase tracking-[0.2em] text-fuchsia-300">
              En Popüler
            </div>

            <h2 className="mt-4 text-3xl font-semibold">
              All Access
            </h2>

            <div className="mt-6 text-5xl font-semibold">
              ₺14.400
              <span className="text-lg text-slate-300"> / yıl</span>
            </div>

            <ul className="mt-8 space-y-3 text-slate-100">

              <li>✔ 80+ Dil Erişimi</li>
              <li>✔ Tüm Premium Özellikler</li>
              <li>✔ AI konuşma pratiği</li>
              <li>✔ Sınırsız konuşma egzersizi</li>
              <li>✔ Gelişmiş AI öğretmen</li>

            </ul>

            <a
              href="https://www.shopier.com/TradeVisual/45264598"
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-6 py-3 font-medium text-white transition hover:opacity-90"
            >
              All Access Yıllık Al
            </a>

          </div>

        </div>

        {/* NOTE */}

        <p className="mt-10 text-center text-sm text-slate-400">

          Ödeme yaptıktan sonra premium erişimin, Koshei hesabında
          kullandığın email adresine göre aktif edilir.

        </p>

        <div className="mt-6 text-center">
          <Link
            href="/dashboard"
            className="text-cyan-300 hover:text-cyan-200"
          >
            Dashboard'a dön
          </Link>
        </div>

      </div>

    </main>
  );
}
