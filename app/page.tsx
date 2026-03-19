import Link from "next/link";
import { MENTORS } from "@/lib/data/mentors";
import { FACULTIES } from "@/lib/data/academic-catalog";

const SHOPIER_LINKS = {
  starter: "https://www.shopier.com/TradeVisual/45362316",
  growth: "https://www.shopier.com/TradeVisual/45362403",
  pro: "https://www.shopier.com/TradeVisual/45362552",
  prestige: "https://www.shopier.com/TradeVisual/45362662",
} as const;

const featuredMentor = MENTORS[0];
const topFaculties = FACULTIES.slice(0, 4);

const badgeTiers = [
  {
    title: "Başlangıç",
    level: "A1–A2",
    icon: "🌱",
    desc: "Temel diyalog",
    gradient: "from-emerald-900/80 via-emerald-950 to-teal-950",
    line: "from-emerald-400 to-cyan-400",
  },
  {
    title: "Orta",
    level: "B1–B2",
    icon: "🚀",
    desc: "Akıcı iletişim",
    gradient: "from-cyan-900/80 via-sky-950 to-blue-950",
    line: "from-cyan-400 to-blue-400",
  },
  {
    title: "İleri",
    level: "C1",
    icon: "⚡",
    desc: "Akademik yazım",
    gradient: "from-violet-900/80 via-fuchsia-950 to-purple-950",
    line: "from-violet-400 to-fuchsia-400",
  },
  {
    title: "Usta",
    level: "C2",
    icon: "👑",
    desc: "Yerli akıcılık",
    gradient: "from-amber-900/80 via-orange-950 to-amber-950",
    line: "from-amber-400 to-orange-400",
  },
] as const;

const howItWorks = [
  {
    no: "01",
    title: "Programını Seç",
    desc: "Fakülte ve seviyene göre yolunu belirle.",
    icon: "🎓",
  },
  {
    no: "02",
    title: "Mentorla Çalış",
    desc: "AI mentorla canlı speaking pratiği yap.",
    icon: "🤖",
  },
  {
    no: "03",
    title: "Rozet Kazan",
    desc: "Her adımda rozet ve sertifika kazan.",
    icon: "🏅",
  },
  {
    no: "04",
    title: "İlerlemeni Kanıtla",
    desc: "Speaking skoru ile gelişimini izle.",
    icon: "📊",
  },
] as const;

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#030817] text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(168,85,247,0.16),transparent_28%),radial-gradient(circle_at_50%_90%,rgba(59,130,246,0.14),transparent_35%)]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute inset-y-0 left-0 w-[32%] bg-gradient-to-r from-cyan-500/10 via-cyan-500/5 to-transparent blur-3xl" />
        <div className="absolute inset-y-0 right-0 w-[30%] bg-gradient-to-l from-fuchsia-500/10 via-violet-500/5 to-transparent blur-3xl" />

        <div className="relative mx-auto grid min-h-[88svh] max-w-7xl items-center gap-10 px-4 pb-16 pt-24 md:grid-cols-[1.02fr_0.98fr] md:px-6 md:pb-24 md:pt-28 lg:gap-16">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-cyan-300">
              Koshei AI University
            </div>

            <h1 className="mt-6 text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              AI Mentor ile
              <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-sky-400 to-fuchsia-400 bg-clip-text text-transparent">
                Dil Ustalaş
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-slate-300 sm:text-lg">
              Speaking practice, rozet, sertifika ve AI rehberliği — tek platformda.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_28px_rgba(168,85,247,0.35)] transition hover:scale-[1.02] hover:opacity-95"
              >
                Ücretsiz Başla
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-medium text-slate-100 transition hover:bg-white/10"
              >
                Programları Gör
              </Link>
            </div>

            <div className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6">
              {[
                { value: "12+", label: "Dil Programı" },
                { value: "6", label: "CEFR Seviyesi" },
                { value: "AI", label: "Kişisel Mentor" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="text-3xl font-semibold text-white">{item.value}</div>
                  <div className="mt-1 text-xs text-slate-400">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[430px]">
            <div className="absolute -inset-8 rounded-[40px] bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-fuchsia-500/10 blur-3xl" />

            <div className="relative rounded-[32px] border border-white/10 bg-white/5 p-3 backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
              <div className="rounded-[26px] border border-white/10 bg-[#06101f] p-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r ${featuredMentor.gradientFrom} ${featuredMentor.gradientTo} text-sm font-bold text-white`}
                    >
                      {featuredMentor.avatarInitials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{featuredMentor.name}</div>
                      <div className="text-[11px] text-slate-400">{featuredMentor.title}</div>
                    </div>
                  </div>
                  <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] text-emerald-300">
                    Live
                  </div>
                </div>

                <div className="space-y-4 py-5">
                  <div className="flex justify-start">
                    <div className="max-w-[86%] rounded-2xl rounded-tl-md bg-white/5 px-4 py-3 text-sm text-slate-200">
                      Hello! Today we&apos;ll practice a real conversation. Tell me about your goals.
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="max-w-[86%] rounded-2xl rounded-tr-md bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-3 text-sm text-white">
                      I want to improve my academic English for presentations.
                    </div>
                  </div>

                  <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-cyan-300">
                      AI Düzeltme
                    </div>
                    <div className="mt-2 text-sm text-slate-100">
                      Great! Let&apos;s focus on <span className="text-cyan-300">presentation language</span>.
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Fluency", value: 84 },
                    { label: "Grammar", value: 78 },
                    { label: "Vocab", value: 72 },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/10 bg-white/5 p-3"
                    >
                      <div className="text-[11px] text-slate-400">{item.label}</div>
                      <div className="mt-1 text-xl font-semibold text-white">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-t border-white/5 border-b border-white/5 bg-black/20">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <div className="text-center">
            <div className="text-[11px] uppercase tracking-[0.35em] text-cyan-300">Nasıl Çalışır</div>
            <h2 className="mt-3 text-3xl font-semibold md:text-5xl">4 Adımda Ustalaş</h2>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {howItWorks.map((item) => (
              <div
                key={item.no}
                className="group rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.07]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-[11px] font-medium tracking-[0.25em] text-slate-600">
                    {item.no}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.35em] text-cyan-300">Fakülteler</div>
              <h2 className="mt-3 text-3xl font-semibold md:text-5xl">Akademik Programlar</h2>
            </div>
            <Link
              href="/courses"
              className="hidden rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200 transition hover:bg-white/10 md:inline-flex"
            >
              Tümünü Gör →
            </Link>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
            <Link
              href="/courses"
              className="group rounded-[32px] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-slate-950 to-slate-950 p-7 shadow-[0_0_50px_rgba(6,182,212,0.08)] transition hover:-translate-y-1 hover:border-cyan-400/35"
            >
              <div className="flex h-full flex-col justify-between">
                <div>
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500/10 text-3xl">
                    {topFaculties[0]?.icon ?? "🗣️"}
                  </div>
                  <h3 className="text-2xl font-semibold text-white">
                    {topFaculties[0]?.name ?? "Faculty of Languages"}
                  </h3>
                  <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">
                    {topFaculties[0]?.description ??
                      "AI destekli dil programları. Başlangıçtan ustalığa, gerçek zamanlı mentor koçluğu."}
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                    12 Program
                  </span>
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
                    🗣️ Konuşma
                  </span>
                </div>
              </div>
            </Link>

            <div className="grid gap-5 sm:grid-cols-2">
              {topFaculties.slice(1, 4).map((faculty) => (
                <Link
                  key={faculty.code}
                  href="/courses"
                  className="group rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-2xl">
                    {faculty.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{faculty.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{faculty.description}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 md:hidden">
            <Link
              href="/courses"
              className="inline-flex rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200"
            >
              Tüm Programları Gör →
            </Link>
          </div>
        </div>
      </section>

      <section className="relative border-t border-white/5 border-b border-white/5 bg-black/20">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6">
          <div className="text-center">
            <div className="text-[11px] uppercase tracking-[0.35em] text-cyan-300">Başarı Sistemi</div>
            <h2 className="mt-3 text-3xl font-semibold md:text-5xl">Rozetler & Sertifikalar</h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {badgeTiers.map((tier, index) => (
              <div
                key={tier.title}
                className={`relative overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br ${tier.gradient} p-6 shadow-[0_0_50px_rgba(0,0,0,0.18)]`}
              >
                <div className="absolute right-5 top-4 text-5xl font-bold text-white/8">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-3xl shadow-inner">
                  {tier.icon}
                </div>

                <h3 className="mt-5 text-3xl font-semibold text-white">{tier.title}</h3>
                <div className="mt-1 text-sm text-slate-300">{tier.level}</div>
                <p className="mt-4 text-sm text-slate-300">{tier.desc}</p>

                <div className="mt-6 h-1.5 rounded-full bg-white/10">
                  <div className={`h-full rounded-full bg-gradient-to-r ${tier.line}`} style={{ width: `${(index + 1) * 25}%` }} />
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-200">
                    🏅 Rozet
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-200">
                    📜 Sertifika
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="mx-auto max-w-5xl px-4 py-20 md:px-6">
          <div className="text-center">
            <div className="text-[11px] uppercase tracking-[0.35em] text-cyan-300">Kredi Paketleri</div>
            <h2 className="mt-3 text-3xl font-semibold md:text-5xl">Kullandıkça Öde</h2>
            <p className="mt-4 text-slate-400">Aylık abonelik yok — istediğin zaman kredi al.</p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-[0.9fr_1.1fr]">
            <a
              href={SHOPIER_LINKS.starter}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-[32px] border border-white/10 bg-white/5 p-7 transition hover:-translate-y-1 hover:border-white/20"
            >
              <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Starter</div>
              <div className="mt-5 text-5xl font-bold text-white">₺199</div>
              <div className="mt-3 text-3xl font-semibold text-cyan-300">100 <span className="text-base font-normal text-slate-400">kredi</span></div>
              <p className="mt-4 text-sm text-slate-400">Başlamak için ideal paket.</p>

              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                <li>✓ 100 speaking kredisi</li>
                <li>✓ AI mentor erişimi</li>
                <li>✓ Rozet sistemi</li>
              </ul>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-white transition group-hover:bg-white/10">
                Starter Paketi Al →
              </div>
            </a>

            <a
              href={SHOPIER_LINKS.growth}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-[34px] border border-fuchsia-400/25 bg-gradient-to-br from-fuchsia-500/15 via-violet-500/10 to-slate-950 p-7 shadow-[0_0_60px_rgba(168,85,247,0.18)] transition hover:-translate-y-1 hover:border-fuchsia-300/40"
            >
              <div className="absolute right-6 top-5 rounded-full bg-fuchsia-500 px-3 py-1 text-[11px] font-medium text-white shadow-[0_0_20px_rgba(217,70,239,0.45)]">
                En Popüler
              </div>

              <div className="text-[11px] uppercase tracking-[0.3em] text-fuchsia-200/80">Growth</div>
              <div className="mt-5 text-6xl font-bold text-white">₺499</div>
              <div className="mt-3 text-4xl font-semibold text-white">300 <span className="text-base font-normal text-slate-300">kredi</span></div>
              <p className="mt-4 text-sm text-slate-300">Düzenli öğrenciler için en iyi değer.</p>

              <ul className="mt-6 space-y-3 text-sm text-slate-100">
                <li>✓ 300 speaking kredisi</li>
                <li>✓ Tüm AI mentorlar</li>
                <li>✓ Sertifika ve rozet</li>
              </ul>

              <div className="mt-8 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_0_30px_rgba(168,85,247,0.35)] transition group-hover:opacity-95">
                Growth Paketi Al →
              </div>
            </a>
          </div>

          <div className="mt-8 text-center">
            <Link href="/pricing" className="text-sm text-cyan-300 hover:underline">
              Tüm paket detaylarını gör →
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 pt-10 md:px-6">
        <div className="mx-auto max-w-6xl rounded-[36px] border border-white/10 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-fuchsia-500/10 px-6 py-16 text-center shadow-[0_0_80px_rgba(59,130,246,0.08)] md:px-10">
          <div className="text-[11px] uppercase tracking-[0.35em] text-cyan-300">
            Başlamak İçin En İyi Zaman — Bugün
          </div>
          <h2 className="mt-5 text-4xl font-semibold md:text-6xl">Akademik Yolculuğuna Başla</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
            AI mentor, rozet, sertifika ve çok daha fazlası.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(168,85,247,0.3)]"
            >
              Ücretsiz Kayıt Ol
            </Link>
            <Link
              href="/courses"
              className="inline-flex rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-medium text-slate-100"
            >
              Programları İncele
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
            }
