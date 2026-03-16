import Link from "next/link";

const languageGroups = [
  {
    title: "Avrupa Dilleri",
    items: ["İngilizce", "Almanca", "Fransızca", "İspanyolca", "İtalyanca"],
  },
  {
    title: "Türk Dili Ailesi",
    items: ["Türkçe", "Kazakça", "Özbekçe", "Kırgızca", "Türkmence"],
  },
  {
    title: "Asya / Afrika / Orta Doğu",
    items: ["Arapça", "Farsça", "Hintçe", "Urduca", "Swahili"],
  },
];

const features = [
  "AI konuşma pratiği",
  "Anında hata düzeltme",
  "Gerçek konuşma senaryoları",
  "Günlük konuşma egzersizleri",
  "Akıcı konuşma geliştirme",
  "80+ dil desteği",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Koshei AI
          </Link>

          <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#features" className="hover:text-white">
              Özellikler
            </a>
            <a href="#languages" className="hover:text-white">
              Diller
            </a>
            <a href="#pricing" className="hover:text-white">
              Fiyatlar
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/5 md:inline-flex"
            >
              Giriş
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-[0_0_30px_rgba(168,85,247,0.25)] transition hover:opacity-90"
            >
              Konuşmaya Başla
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.25),transparent_40%),radial-gradient(circle_at_right,rgba(168,85,247,0.18),transparent_30%)]" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
          <div className="relative z-10 flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-cyan-300">
              80+ Dil • AI Speaking
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
              Konuşarak dil öğrenmenin
              <span className="block bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
                daha akıllı yolu
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
              Koshei AI ile gerçek konuşma pratiği yap, hatalarını anında gör,
              daha doğal ve daha akıcı konuşmaya başla.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-6 py-3 font-medium text-white shadow-[0_0_30px_rgba(168,85,247,0.25)] transition hover:opacity-90"
              >
                Konuşmaya Başla
              </Link>

              <a
                href="#pricing"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-slate-100 transition hover:border-white/20 hover:bg-white/10"
              >
                Planları Gör
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-semibold">80+</div>
                <div className="mt-1 text-sm text-slate-400">Desteklenen dil</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-semibold">AI</div>
                <div className="mt-1 text-sm text-slate-400">Gerçek zamanlı düzeltme</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-semibold">24/7</div>
                <div className="mt-1 text-sm text-slate-400">Sınırsız erişim hissi</div>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <div className="mx-auto max-w-xl rounded-[28px] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-4 shadow-[0_0_60px_rgba(59,130,246,0.08)] backdrop-blur">
              <div className="rounded-[24px] border border-white/10 bg-[#081122] p-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <div className="text-lg font-semibold">Koshei AI Tutor</div>
                    <div className="text-sm text-slate-400">Gerçek konuşma pratiği</div>
                  </div>
                  <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300">
                    Live
                  </div>
                </div>

                <div className="space-y-4 py-5">
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-white/5 px-4 py-3 text-sm text-slate-200">
                      Hello! Today we’ll practice a real conversation.
                      <br />
                      Tell me about yourself in English.
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-3 text-sm text-white">
                      Hi, my name is Onur. I live in Türkiye and I want improve my speaking.
                    </div>
                  </div>

                  <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-cyan-300">
                      AI Düzeltme
                    </div>
                    <div className="mt-2 text-sm text-slate-100">
                      I want <span className="text-cyan-300">to improve</span> my speaking.
                    </div>
                    <div className="mt-2 text-sm text-slate-300">
                      Küçük not: “want improve” yerine “want to improve” kullanılır.
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs text-slate-400">Fluency</div>
                    <div className="mt-1 text-lg font-semibold">72</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs text-slate-400">Grammar</div>
                    <div className="mt-1 text-lg font-semibold">65</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs text-slate-400">Vocabulary</div>
                    <div className="mt-1 text-lg font-semibold">70</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-lg">
                    🎤
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Konuşmayı dene</div>
                    <div className="text-xs text-slate-400">
                      Mikrofonla konuş, Koshei anında düzeltsin
                    </div>
                  </div>
                  <Link
                    href="/lesson"
                    className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/15"
                  >
                    Demo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-black/20">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-14 md:grid-cols-3 md:px-6">
          {[
            {
              title: "Dil Seç",
              text: "80+ dil arasından öğrenmek istediğin dili seç.",
            },
            {
              title: "Konuş",
              text: "AI ile gerçek konuşma pratiği yap.",
            },
            {
              title: "Geliş",
              text: "Koshei hatalarını anında düzeltir ve seni geliştirir.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <div className="text-xl font-semibold">{item.title}</div>
              <p className="mt-3 text-sm leading-7 text-slate-400">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="mb-10 text-center">
          <div className="text-sm uppercase tracking-[0.35em] text-cyan-300">
            Özellikler
          </div>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
            Koshei AI ile konuşarak öğren
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 text-slate-200"
            >
              <div className="flex items-center gap-3">
                <span className="text-cyan-300">✔</span>
                <span>{feature}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="languages"
        className="border-y border-white/5 bg-black/20 px-4 py-20 md:px-6"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <div className="text-sm uppercase tracking-[0.35em] text-cyan-300">
              Diller
            </div>
            <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
              80+ dil seni bekliyor
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {languageGroups.map((group) => (
              <div
                key={group.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="text-xl font-semibold">{group.title}</h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-slate-400">ve 70+ dil daha...</p>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="mb-12 text-center">
          <div className="text-sm uppercase tracking-[0.35em] text-cyan-300">
            Pricing
          </div>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
            Basit fiyatlandırma
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-8">
            <div className="text-sm uppercase tracking-[0.25em] text-slate-400">
              All Access
            </div>
            <h3 className="mt-3 text-3xl font-semibold">Aylık Plan</h3>
            <div className="mt-6 text-5xl font-semibold">
              ₺1.200
              <span className="text-lg font-normal text-slate-400"> / ay</span>
            </div>

            <ul className="mt-8 space-y-3 text-slate-200">
              <li>✔ 80+ dil erişimi</li>
              <li>✔ AI konuşma pratiği</li>
              <li>✔ Anında hata düzeltme</li>
              <li>✔ Gerçek konuşma senaryoları</li>
            </ul>

            <a
              href="https://www.shopier.com/TradeVisual/45264454"
              className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-6 py-3 font-medium text-white transition hover:opacity-90"
            >
              Aylık Başla
            </a>
          </div>

          <div className="rounded-[28px] border border-fuchsia-500/40 bg-gradient-to-b from-fuchsia-500/10 to-violet-500/10 p-8 shadow-[0_0_50px_rgba(168,85,247,0.12)]">
            <div className="inline-flex rounded-full bg-fuchsia-500/15 px-3 py-1 text-xs uppercase tracking-[0.25em] text-fuchsia-300">
              En Popüler
            </div>
            <h3 className="mt-4 text-3xl font-semibold">All Access Yıllık</h3>
            <div className="mt-6 text-5xl font-semibold">
              ₺14.400
              <span className="text-lg font-normal text-slate-300"> / yıl</span>
            </div>

            <ul className="mt-8 space-y-3 text-slate-100">
              <li>✔ 80+ dil erişimi</li>
              <li>✔ AI konuşma pratiği</li>
              <li>✔ Anında hata düzeltme</li>
              <li>✔ Sınırsız konuşma egzersizi</li>
              <li>✔ Tüm premium özellikler</li>
            </ul>

            <a
              href="https://www.shopier.com/TradeVisual/45264598"
              className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-6 py-3 font-medium text-white transition hover:opacity-90"
            >
              Yıllık Başla
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-6">
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-fuchsia-500/10 px-6 py-12 text-center md:px-12">
          <h2 className="text-3xl font-semibold md:text-4xl">
            Konuş. Hata yap. Geliş.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Koshei AI ile bugün başla ve dil öğrenmeyi gerçek konuşma pratiğine dönüştür.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-6 py-3 font-medium text-white transition hover:opacity-90"
            >
              Konuşmaya Başla
            </Link>

            <a
              href="#pricing"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-slate-100 transition hover:border-white/20 hover:bg-white/10"
            >
              Planları İncele
            </a>
          </div>
        </div>
      </section>
    </main>
  );
                  }
