import Link from "next/link";

const features = [
  {
    title: "Konuşarak öğren",
    desc: "Koshei seni pasif bırakmaz. Soru sorar, dinler, düzeltir, devam ettirir.",
  },
  {
    title: "Anında düzeltme",
    desc: "Yanlış cümleni doğruya çevirir, kısa not verir, tekrar ettirir.",
  },
  {
    title: "Dijital tahta sistemi",
    desc: "Chat karmaşası yok. Soru, cevap, düzeltme ve sonraki adım net görünür.",
  },
];

const steps = [
  "Dili ve seviyeni seç",
  "Konuşma görevini dinle",
  "Cevabını söyle veya yaz",
  "Düzeltmeyi gör ve devam et",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_18%),linear-gradient(180deg,#030712_0%,#061127_52%,#020617_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-8">
        <header className="mb-6 flex items-center justify-between rounded-3xl border border-cyan-300/10 bg-white/[0.03] px-4 py-4 backdrop-blur md:px-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/70">
              Koshei V1
            </p>
            <h1 className="mt-1 text-xl font-semibold md:text-2xl">
              AI Speaking Teacher
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/lesson"
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:bg-white/[0.08]"
            >
              Ders AI
            </Link>
            <Link
              href="/live"
              className="rounded-2xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              Başlat
            </Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="relative overflow-hidden rounded-[28px] border border-cyan-300/15 bg-white/[0.04] p-6 shadow-[0_0_0_1px_rgba(34,211,238,0.05),0_0_50px_rgba(34,211,238,0.08)] backdrop-blur-xl md:p-8">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_28%)]" />

              <div className="relative z-10">
                <span className="inline-flex rounded-full border border-cyan-300/15 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-100">
                  Dijital Konuşma Sınıfı
                </span>

                <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
                  Yabancı dili{" "}
                  <span className="text-cyan-300">konuşarak</span> öğren.
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 md:text-lg">
                  Koshei bir chatbot gibi yazışmaz. Sana görev verir, cevabını
                  alır, hatanı düzeltir ve seni bir sonraki adıma taşır.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/live"
                    className="rounded-2xl bg-blue-500 px-5 py-4 text-center text-sm font-semibold text-white transition hover:bg-blue-400 md:px-6"
                  >
                    Konuşmayı Başlat
                  </Link>
                  <Link
                    href="/lesson"
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-center text-sm font-medium text-slate-100 transition hover:bg-white/[0.08] md:px-6"
                  >
                    Ders Oluştur
                  </Link>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <MiniStat label="Odak" value="Konuşma pratiği" />
                  <MiniStat label="Sistem" value="Dijital tahta" />
                  <MiniStat label="Deneyim" value="Kolay ve hızlı" />
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="h-full rounded-[28px] border border-cyan-300/10 bg-white/[0.03] p-5 backdrop-blur-xl">
              <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">
                Nasıl çalışır
              </p>

              <div className="mt-5 space-y-3">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-sm font-semibold text-cyan-200">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-6 text-slate-200">{step}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/live"
                className="mt-5 block rounded-2xl border border-cyan-300/15 bg-cyan-400/10 px-4 py-3 text-center text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/15"
              >
                Hemen Dene →
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-[24px] border border-cyan-300/10 bg-white/[0.03] p-5 backdrop-blur"
            >
              <div className="mb-4 h-10 w-10 rounded-2xl bg-cyan-400/10 shadow-[0_0_20px_rgba(34,211,238,0.16)]" />
              <h3 className="text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {feature.desc}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-5 rounded-[28px] border border-cyan-300/10 bg-white/[0.03] p-6 text-center backdrop-blur md:p-8">
          <p className="text-sm uppercase tracking-[0.22em] text-cyan-200/70">
            Koshei farkı
          </p>
          <h3 className="mx-auto mt-3 max-w-3xl text-2xl font-semibold leading-tight md:text-4xl">
            Kelime ezberletmez. Seni o dilde{" "}
            <span className="text-cyan-300">konuşturur.</span>
          </h3>
          <Link
            href="/live"
            className="mt-6 inline-flex rounded-2xl bg-blue-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-blue-400"
          >
            Şimdi Başla
          </Link>
        </section>
      </div>
    </main>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-white">{value}</p>
    </div>
  );
}
