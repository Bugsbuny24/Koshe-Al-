import Link from "next/link";

const languageNodes = [
  { city: "London",   language: "English",  x: "18%", y: "28%" },
  { city: "Berlin",   language: "Deutsch",  x: "49%", y: "24%" },
  { city: "Paris",    language: "Français", x: "44%", y: "31%" },
  { city: "Madrid",   language: "Español",  x: "40%", y: "38%" },
  { city: "İstanbul", language: "Türkçe",   x: "56%", y: "35%" },
  { city: "Tokyo",    language: "日本語",    x: "86%", y: "36%" },
];

const FEATURES = [
  {
    icon: "🎤",
    title: "Konuş, düzelt, tekrar et",
    desc: "AI öğretmen her cevabını analiz eder, hataları düzeltir ve seni bir sonraki seviyeye taşır.",
  },
  {
    icon: "🧠",
    title: "Hafıza sistemi",
    desc: "Yaptığın hatalar kayıt altına alınır. Koshei aynı hataları tekrar yapmaман için seni yönlendirir.",
  },
  {
    icon: "📊",
    title: "Speaking score",
    desc: "Her oturum sonunda fluency, grammar ve vocabulary puanın hesaplanır. İlerlemeyi takip et.",
  },
  {
    icon: "🌍",
    title: "80 dil",
    desc: "Kolay Türk dili ailesinden Japonca ve Çince'ye kadar 80 dilde konuşma pratiği.",
  },
  {
    icon: "⚡",
    title: "7/24 erişim",
    desc: "Randevu yok, bekleme yok. İstediğin zaman, istediğin yerden başla.",
  },
  {
    icon: "π",
    title: "Pi Network ile öde",
    desc: "Gerçek para yok. Pi cüzdanınla öde, anında premium aç.",
  },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.10),transparent_16%),linear-gradient(180deg,#020617_0%,#041127_48%,#020617_100%)] text-white">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes nodePulse {
          0%, 100% { opacity: 0.3; transform: translate(-50%,-50%) scale(1); }
          50%       { opacity: 0.9; transform: translate(-50%,-50%) scale(1.8); }
        }
        @keyframes nodeIn {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        .fade-1 { animation: fadeUp 0.5s ease both; }
        .fade-2 { animation: fadeUp 0.5s ease 0.1s both; }
        .fade-3 { animation: fadeUp 0.5s ease 0.2s both; }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-6">

        {/* Nav */}
        <header className="mb-4 flex items-center justify-between rounded-[24px] border border-cyan-300/10 bg-white/[0.03] px-4 py-3 backdrop-blur-xl">
          <div className="text-sm font-semibold text-white">Koshei</div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="inline-flex h-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-slate-100 transition hover:bg-white/[0.08]">
              Giriş Yap
            </Link>
            <Link href="/register" className="inline-flex h-9 items-center justify-center rounded-xl bg-blue-500 px-4 text-sm font-semibold text-white transition hover:bg-blue-400">
              Ücretsiz Başla
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-[32px] border border-cyan-300/10 bg-[#030817]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.14),transparent_24%),radial-gradient(circle_at_82%_22%,rgba(59,130,246,0.14),transparent_26%)]" />
          <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:40px_40px]" />

          <div className="relative grid gap-10 px-6 py-10 md:px-10 md:py-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div className="max-w-2xl">
              <div className="fade-1 inline-flex items-center rounded-full border border-cyan-300/15 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-cyan-100/80">
                80+ dil · ücretsiz beta
              </div>

              <h1 className="fade-2 mt-5 text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
                Dil öğrenmenin{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                  daha akıllı yolu
                </span>
              </h1>

              <p className="fade-3 mt-5 max-w-xl text-base leading-7 text-slate-300 md:text-lg">
                Konuş, hata yap, düzelt. AI öğretmenin seni gerçek konuşmaya hazırlar.
              </p>

              <div className="fade-3 mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/register" className="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-500 px-6 text-sm font-semibold text-white transition hover:bg-blue-400">
                  Ücretsiz Başla
                </Link>
                <Link href="/live" className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-6 text-sm font-medium text-slate-100 transition hover:bg-white/[0.08]">
                  Demo: Konuş
                </Link>
              </div>

              <p className="mt-4 text-xs text-slate-500">
                Pi Browser'da aç → Pi ile öde → anında başla
              </p>
            </div>

            {/* Dil haritası */}
            <div className="relative mx-auto aspect-[1.28/1] w-full max-w-[720px] overflow-hidden rounded-[40px] border border-cyan-300/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015))] shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              {languageNodes.map((node, i) => (
                <div
                  key={node.city}
                  className="absolute"
                  style={{ left: node.x, top: node.y, animation: `nodeIn 0.4s ease ${0.08 * i}s both` }}
                >
                  <div className="relative">
                    <div
                      className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/20 blur-md"
                      style={{ animation: `nodePulse ${2.4 + (i % 3) * 0.5}s ease-in-out infinite` }}
                    />
                    <div className="relative h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.95)]" />
                  </div>
                  <div className="ml-3 mt-[-10px] hidden rounded-2xl border border-white/10 bg-[#081326]/85 px-3 py-2 text-left shadow-xl backdrop-blur-md md:block">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">{node.city}</div>
                    <div className="mt-1 text-xs font-medium text-cyan-100">{node.language}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature cards */}
        <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl transition hover:bg-white/[0.05]">
              <div className="text-2xl">{f.icon}</div>
              <h3 className="mt-3 text-base font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* Nasıl çalışır */}
        <section className="mt-4 rounded-[28px] border border-cyan-300/10 bg-white/[0.03] p-5 backdrop-blur-xl">
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">Nasıl çalışır</p>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {[
              "Dil ve seviyeni seç",
              "Koshei sana konuşma görevi verir",
              "Yaz veya mikrofonla cevap ver",
              "AI düzeltir, puanlar, devam eder",
            ].map((text, i) => (
              <div key={text} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-400/10 text-sm font-semibold text-cyan-200">
                  {i + 1}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-200">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-4 rounded-[28px] border border-cyan-300/12 bg-cyan-400/[0.06] p-8 text-center">
          <h2 className="text-3xl font-bold text-white">Bugün başla, ücretsiz</h2>
          <p className="mx-auto mt-3 max-w-lg text-base text-slate-300">
            Günde 20 konuşma sorusu ücretsiz. Premium için Pi cüzdanın yeterli.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register" className="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-500 px-8 text-sm font-semibold text-white transition hover:bg-blue-400">
              Ücretsiz Kayıt Ol
            </Link>
            <Link href="/pricing" className="inline-flex h-12 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-400/10 px-8 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/15">
              Planları Gör →
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
