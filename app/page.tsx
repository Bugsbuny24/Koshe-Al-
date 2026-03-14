  import Link from "next/link";
import PiLoginButton from "@/components/PiLoginButton";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.10),transparent_16%),linear-gradient(180deg,#020617_0%,#041127_48%,#020617_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-6">
        <header className="mb-4 rounded-[24px] border border-cyan-300/10 bg-white/[0.03] px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-medium text-white">Koshei</div>

            <div className="flex items-center gap-2">
              <PiLoginButton />
            </div>
          </div>
        </header>

        <section className="relative overflow-hidden rounded-[32px] border border-cyan-300/10 bg-[#030817] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.14),transparent_24%),radial-gradient(circle_at_82%_22%,rgba(59,130,246,0.14),transparent_26%),radial-gradient(circle_at_50%_82%,rgba(14,165,233,0.10),transparent_28%)]" />
          <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:40px_40px]" />

          <div className="relative grid gap-10 px-6 py-10 md:px-10 md:py-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center rounded-full border border-cyan-300/15 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-cyan-100/80">
                80+ dil • ücretsiz beta
              </div>

              <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
                Dil öğrenmenin{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                  daha akıllı yolu
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 md:text-lg">
                Konuş, hata yap, düzelt. AI öğretmenin seni gerçek konuşmaya hazırlar.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <div className="sm:min-w-[180px]">
                  <PiLoginButton />
                </div>

                <Link
                  href="/live"
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-6 text-sm font-medium text-slate-100 transition hover:bg-white/[0.08]"
                >
                  Demo: Konuş
                </Link>

                <Link
                  href="/pricing"
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-400/[0.08] px-6 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/[0.14]"
                >
                  Pi Planları
                </Link>
              </div>

              <p className="mt-4 text-sm text-slate-400">
                Pi Browser&apos;da aç → Pi ile giriş yap → konuşmaya başla
              </p>
            </div>

            <div className="relative mx-auto aspect-[1.28/1] w-full max-w-[720px] overflow-hidden rounded-[40px] border border-cyan-300/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015))] shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="absolute left-[18%] top-[32%] h-4 w-4 rounded-full bg-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.95)]" />
              <div className="absolute left-[40%] top-[42%] h-4 w-4 rounded-full bg-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.95)]" />
              <div className="absolute left-[44%] top-[36%] h-4 w-4 rounded-full bg-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.95)]" />
              <div className="absolute left-[49%] top-[30%] h-4 w-4 rounded-full bg-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.95)]" />
              <div className="absolute left-[56%] top-[40%] h-4 w-4 rounded-full bg-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.95)]" />
              <div className="absolute left-[82%] top-[41%] h-4 w-4 rounded-full bg-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.95)]" />

              <div className="absolute inset-x-[16%] top-[28%] h-px bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent" />
              <div className="absolute inset-x-[36%] top-[39%] h-px bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent" />
              <div className="absolute inset-x-[42%] top-[35%] h-px bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent" />
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-4 md:grid-cols-3">
          <FeatureCard
            title="Konuşma odaklı"
            desc="Koshei dili sadece göstermez. Seni aktif şekilde konuşturur."
          />
          <FeatureCard
            title="Anında düzeltme"
            desc="Cevabını analiz eder, hatanı düzeltir ve kısa notlarla seni ileri taşır."
          />
          <FeatureCard
            title="Sürekli ilerleme"
            desc="Her cevaptan sonra yeni görev verir. Öğrenme konuşma içinde devam eder."
            active
          />
        </section>

        <section className="mt-4 rounded-[28px] border border-cyan-300/10 bg-white/[0.03] p-5 backdrop-blur-xl">
          <div className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">
            Nasıl çalışır
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <StepCard number="1" text="Pi Browser içinde aç" />
            <StepCard number="2" text="Pi ile giriş yap" />
            <StepCard number="3" text="Sorulara yazarak veya konuşarak cevap ver" />
            <StepCard number="4" text="AI düzeltir ve sonraki adıma geçirir" />
          </div>
        </section>
      </div>
    </main>
  );
}

function FeatureCard({
  title,
  desc,
  active = false,
}: {
  title: string;
  desc: string;
  active?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-[24px] border p-5 backdrop-blur-xl",
        active
          ? "border-cyan-300/14 bg-cyan-400/[0.06]"
          : "border-white/10 bg-white/[0.03]",
      ].join(" ")}
    >
      <div
        className={[
          "text-sm font-semibold",
          active ? "text-cyan-100" : "text-white",
        ].join(" ")}
      >
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-300">{desc}</p>
    </div>
  );
}

function StepCard({ number, text }: { number: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-400/10 text-sm font-semibold text-cyan-200">
        {number}
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-200">{text}</p>
    </div>
  );
}
