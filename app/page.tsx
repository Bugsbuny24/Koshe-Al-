import Link from "next/link";
import { MENTORS } from "@/lib/data/mentors";
import { FACULTIES } from "@/lib/data/academic-catalog";
import { CREDIT_PACKAGES_DEF } from "@/lib/data/credit-packages";

const HOW_IT_WORKS = [
  { step: "01", title: "Programını Seç", desc: "Fakülten ve seviyene göre akademik programını belirle." },
  { step: "02", title: "Mentorla Çalış", desc: "AI mentorın sana özel ders ve speaking practice yap." },
  { step: "03", title: "Rozet & Sertifika Kazan", desc: "Her ilerleme adımında rozet kazan, bitirince sertifikanı al." },
  { step: "04", title: "İlerlemeni Kanıtla", desc: "Speaking score, hafıza ve istatistiklerle gelişimini izle." },
] as const;

const FEATURES = [
  { icon: "🎤", title: "Live Speaking Practice", desc: "AI mentorla gerçek zamanlı konuşma pratiği" },
  { icon: "🧠", title: "Error Memory", desc: "Hatalarını hatırlar, tekrar yapmamanı sağlar" },
  { icon: "🏅", title: "Badges", desc: "Her ilerlemende özel rozetler kazanırsın" },
  { icon: "📜", title: "Certificates", desc: "Tamamladığın programlar için sertifika" },
  { icon: "📊", title: "Speaking Score", desc: "Fluency, grammar ve vocabulary puanları" },
  { icon: "✨", title: "NFT Collection", desc: "Nadir koleksiyon ödülleri" },
] as const;

export default function HomePage() {
  return (
    <main className="min-h-screen text-white">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.25),transparent_40%),radial-gradient(circle_at_right,rgba(168,85,247,0.18),transparent_30%)]" />

        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
          <div className="relative z-10 flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-cyan-300">
              Koshei AI University
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
              AI Mentor ile
              <span className="block bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
                Akademik Dil Programı
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
              Speaking practice, mentor rehberliği, rozet, sertifika ve kredi
              tabanlı AI öğrenme deneyimi. Gerçek bir üniversite hissiyle dil
              ustalaş.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-6 py-3 font-medium text-white shadow-[0_0_30px_rgba(168,85,247,0.25)] transition hover:opacity-90"
              >
                Ücretsiz Başla
              </Link>

              <Link
                href="/courses"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-slate-100 transition hover:border-white/20 hover:bg-white/10"
              >
                Programları Gör
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <div className="text-2xl font-semibold">{FACULTIES.length}</div>
                <div className="mt-1 text-sm text-slate-400">Fakülte</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <div className="text-2xl font-semibold">AI</div>
                <div className="mt-1 text-sm text-slate-400">Mentor eşliği</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <div className="text-2xl font-semibold">✦</div>
                <div className="mt-1 text-sm text-slate-400">Kredi bazlı kullanım</div>
              </div>
            </div>
          </div>

          {/* Mentor preview panel */}
          <div className="relative z-10">
            <div className="mx-auto max-w-xl rounded-[28px] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-4 shadow-[0_0_60px_rgba(59,130,246,0.08)] backdrop-blur-xl">
              <div className="rounded-[24px] border border-white/10 bg-[#081122] p-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r ${MENTORS[0].gradientFrom} ${MENTORS[0].gradientTo} text-sm font-bold`}>
                      {MENTORS[0].avatarInitials}
                    </div>
                    <div>
                      <div className="font-semibold">{MENTORS[0].name}</div>
                      <div className="text-xs text-slate-400">{MENTORS[0].title}</div>
                    </div>
                  </div>
                  <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300">
                    Live
                  </div>
                </div>

                <div className="space-y-4 py-5">
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-white/5 px-4 py-3 text-sm text-slate-200">
                      Hello! Today we&apos;ll practice a real conversation. Tell me about your goals.
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-3 text-sm text-white">
                      I want to improve my academic English for presentations.
                    </div>
                  </div>

                  <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-cyan-300">
                      AI Düzeltme
                    </div>
                    <div className="mt-2 text-sm text-slate-100">
                      Great! Let&apos;s focus on <span className="text-cyan-300">presentation language</span>.
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs text-slate-400">Fluency</div>
                    <div className="mt-1 text-lg font-semibold">84</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs text-slate-400">Grammar</div>
                    <div className="mt-1 text-lg font-semibold">78</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs text-slate-400">Vocab</div>
                    <div className="mt-1 text-lg font-semibold">72</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NASIL ÇALIŞIR ────────────────────────────────────────────────────── */}
      <section className="border-y border-white/5 bg-black/20">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
          <div className="mb-10 text-center">
            <div className="text-sm uppercase tracking-[0.35em] text-cyan-300">Nasıl Çalışır</div>
            <h2 className="mt-4 text-3xl font-semibold md:text-4xl">4 Adımda Ustalaş</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            {HOW_IT_WORKS.map((item) => (
              <div
                key={item.step}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <div className="text-xs font-mono text-cyan-400/60">{item.step}</div>
                <div className="mt-2 text-lg font-semibold">{item.title}</div>
                <p className="mt-3 text-sm leading-7 text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FACULTIES ────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="mb-10 text-center">
          <div className="text-sm uppercase tracking-[0.35em] text-cyan-300">Fakülteler</div>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Akademik Programlar</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {FACULTIES.map((f) => (
            <div
              key={f.code}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <div className="text-3xl">{f.icon}</div>
              <div className="mt-3 text-lg font-semibold">{f.name}</div>
              <p className="mt-2 text-sm text-slate-400">{f.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
          >
            Tüm Programları Gör →
          </Link>
        </div>
      </section>

      {/* ── MENTORS ──────────────────────────────────────────────────────────── */}
      <section className="border-y border-white/5 bg-black/20">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6">
          <div className="mb-10 text-center">
            <div className="text-sm uppercase tracking-[0.35em] text-cyan-300">Mentorlar</div>
            <h2 className="mt-4 text-3xl font-semibold md:text-4xl">AI Mentor Kadrosu</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {MENTORS.map((m) => (
              <div
                key={m.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r ${m.gradientFrom} ${m.gradientTo} text-lg font-bold`}>
                  {m.avatarInitials}
                </div>
                <div className="mt-4 text-xl font-semibold">{m.name}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{m.title}</div>
                <p className="mt-3 text-sm text-slate-400">{m.specialization}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="mb-10 text-center">
          <div className="text-sm uppercase tracking-[0.35em] text-cyan-300">Özellikler</div>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Neler Sunuyoruz</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <div className="font-semibold">{f.title}</div>
                  <p className="mt-0.5 text-sm text-slate-400">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING TEASER ────────────────────────────────────────────────────── */}
      <section id="pricing" className="border-y border-white/5 bg-black/20">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6">
          <div className="mb-10 text-center">
            <div className="text-sm uppercase tracking-[0.35em] text-cyan-300">Kredi Paketleri</div>
            <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Kullandıkça Öde</h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">
              Aylık abonelik yok. Kredi al, istediğinde harca. Süre sınırı yok.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
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
                    <span className="rounded-full bg-fuchsia-500 px-3 py-1 text-xs font-semibold text-white">
                      En Popüler
                    </span>
                  </div>
                )}
                <div className="mt-3 text-sm uppercase tracking-[0.2em] text-slate-400">{pkg.name}</div>
                <div className="mt-4 text-4xl font-bold">{pkg.priceTRY}</div>
                <div className="mt-3 text-2xl font-semibold text-cyan-300">
                  {pkg.credits.toLocaleString("tr-TR")}
                  <span className="ml-1.5 text-sm font-normal text-slate-400">kredi</span>
                </div>
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

          <p className="mt-8 text-center text-sm text-slate-500">
            Shopier üzerinden ödeme sonrası krediniz kısa sürede manuel olarak yüklenir.
          </p>

          <div className="mt-6 text-center">
            <Link
              href="/pricing"
              className="text-cyan-300 text-sm hover:text-cyan-200"
            >
              Tüm paket detaylarını gör →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-12 md:px-6">
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-fuchsia-500/10 px-6 py-12 text-center backdrop-blur-xl md:px-12">
          <h2 className="text-3xl font-semibold md:text-4xl">
            Akademik Yolculuğuna Başla
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Koshei AI University ile mentor eşliğinde dil öğren, rozet kazan,
            sertifikanı al ve gelişimini kanıtla.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-6 py-3 font-medium text-white transition hover:opacity-90"
            >
              Ücretsiz Kayıt Ol
            </Link>

            <Link
              href="/courses"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-slate-100 transition hover:border-white/20 hover:bg-white/10"
            >
              Programları İncele
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
