import Link from "next/link";
import { MENTORS } from "@/lib/data/mentors";
import { FACULTIES } from "@/lib/data/academic-catalog";

const SHOPIER_LINKS = {
  starter: "https://www.shopier.com/TradeVisual/45362316",
  growth: "https://www.shopier.com/TradeVisual/45362403",
  pro: "https://www.shopier.com/TradeVisual/45362552",
  prestige: "https://www.shopier.com/TradeVisual/45362662",
} as const;

const HOW_IT_WORKS = [
  { step: "01", title: "Programını Seç", icon: "🎓", desc: "Fakülten ve seviyene göre akademik yolunu belirle." },
  { step: "02", title: "Mentorla Çalış", icon: "🤖", desc: "AI mentorınla canlı speaking pratiği yap." },
  { step: "03", title: "Rozet Kazan",    icon: "🏅", desc: "Her ilerleme adımında rozet ve sertifika kazan." },
  { step: "04", title: "İlerlemeni Kanıtla", icon: "📊", desc: "Speaking skoru ve istatistiklerinle gelişimini izle." },
] as const;

const FACULTY_META: Record<string, { pill1: string; pill2: string }> = {
  LANG:     { pill1: "12 Program", pill2: "🗣️ Konuşma" },
  TECH:     { pill1: "2 Program",  pill2: "🤖 AI" },
  BUS:      { pill1: "2 Program",  pill2: "💼 İş" },
  CREATIVE: { pill1: "1 Program",  pill2: "🎨 Yaratıcı" },
};

const BADGE_SHOWCASE = [
  {
    level: "Başlangıç", cefrRange: "A1–A2", emoji: "🌱",
    colorGrad: "from-emerald-500/15 to-teal-500/15",
    border: "border-emerald-500/20", text: "text-emerald-300",
    desc: "Temel diyalog ve kelime",
  },
  {
    level: "Orta", cefrRange: "B1–B2", emoji: "🚀",
    colorGrad: "from-cyan-500/15 to-blue-500/15",
    border: "border-cyan-500/20", text: "text-cyan-300",
    desc: "Akıcı iletişim ve iş hayatı",
  },
  {
    level: "İleri", cefrRange: "C1", emoji: "⚡",
    colorGrad: "from-violet-500/15 to-fuchsia-500/15",
    border: "border-violet-500/20", text: "text-violet-300",
    desc: "Akademik yazım ve sunum",
  },
  {
    level: "Usta", cefrRange: "C2", emoji: "👑",
    colorGrad: "from-amber-500/15 to-orange-500/15",
    border: "border-amber-500/20", text: "text-amber-300",
    desc: "Yerli konuşmacı akıcılığı",
  },
] as const;

export default function HomePage() {
  return (
    <main className="min-h-screen text-white">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.3),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.2),transparent_50%)]" />
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-[140px]" />

        <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
          <div className="relative z-10 flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-cyan-300">
              Koshei AI University
            </div>

            <h1 className="max-w-xl text-5xl font-bold leading-[1.1] md:text-6xl lg:text-7xl">
              AI Mentor ile
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent">
                Dil Ustalaş
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-base text-slate-300 md:text-lg">
              Speaking practice, rozet, sertifika ve AI rehberliği — tek platformda.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-7 py-3.5 font-semibold text-white shadow-[0_0_30px_rgba(168,85,247,0.3)] transition hover:opacity-90"
              >
                Ücretsiz Başla
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-7 py-3.5 font-medium text-slate-100 transition hover:border-white/20 hover:bg-white/10"
              >
                Programları Gör
              </Link>
            </div>

            <div className="mt-10 flex gap-8">
              <div>
                <div className="text-2xl font-bold">12+</div>
                <div className="mt-0.5 text-xs text-slate-400">Dil Programı</div>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <div className="text-2xl font-bold">6</div>
                <div className="mt-0.5 text-xs text-slate-400">CEFR Seviyesi</div>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <div className="text-2xl font-bold">AI</div>
                <div className="mt-0.5 text-xs text-slate-400">Kişisel Mentor</div>
              </div>
            </div>
          </div>

          {/* Mentor preview panel */}
          <div className="relative z-10">
            <div className="mx-auto max-w-sm rounded-[28px] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-4 shadow-[0_0_80px_rgba(59,130,246,0.12),0_0_40px_rgba(168,85,247,0.08)] backdrop-blur-xl">
              <div className="rounded-[20px] border border-white/10 bg-[#081122] p-4">
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
                  <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300">Live</div>
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
                    <div className="text-xs uppercase tracking-[0.2em] text-cyan-300">AI Düzeltme</div>
                    <div className="mt-2 text-sm text-slate-100">
                      Great! Let&apos;s focus on <span className="text-cyan-300">presentation language</span>.
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
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

              {/* Mini mentor row */}
              <div className="mt-3 flex items-center justify-center gap-2 pb-1">
                {MENTORS.map((m) => (
                  <div key={m.id} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r ${m.gradientFrom} ${m.gradientTo} text-[10px] font-bold`}>
                      {m.avatarInitials[0]}
                    </div>
                    <span className="text-xs text-slate-300">{m.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NASIL ÇALIŞIR ────────────────────────────────────────────────────── */}
      <section className="relative border-y border-white/5 bg-black/20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.06),transparent_70%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-6">
          <div className="mb-10 text-center">
            <div className="text-xs uppercase tracking-[0.35em] text-cyan-300">Nasıl Çalışır</div>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">4 Adımda Ustalaş</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-4">
            {HOW_IT_WORKS.map((item) => (
              <div
                key={item.step}
                className="rounded-3xl border border-white/10 bg-white/5 p-7 shadow-[0_4px_24px_rgba(0,0,0,0.3)] backdrop-blur-xl"
              >
                <div className="text-3xl">{item.icon}</div>
                <div className="mt-1 font-mono text-xs text-cyan-400/50">{item.step}</div>
                <div className="mt-3 text-lg font-semibold">{item.title}</div>
                <p className="mt-1.5 text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACADEMIC PROGRAMS ──────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_right,rgba(168,85,247,0.06),transparent_60%)]" />
        <div className="relative mb-10 text-center">
          <div className="text-xs uppercase tracking-[0.35em] text-cyan-300">Fakülteler</div>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Akademik Programlar</h2>
        </div>
        <div className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {FACULTIES.map((f) => {
            const meta = FACULTY_META[f.code];
            return (
              <Link
                key={f.code}
                href="/courses"
                className="group rounded-3xl border border-white/10 bg-white/5 p-7 shadow-[0_4px_24px_rgba(0,0,0,0.3)] backdrop-blur-xl transition hover:border-white/20 hover:bg-white/[0.08]"
              >
                <div className="text-4xl">{f.icon}</div>
                <div className="mt-4 text-lg font-semibold">{f.name}</div>
                <p className="mt-1 line-clamp-1 text-sm text-slate-400">{f.description}</p>
                {meta && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-400">{meta.pill1}</span>
                    <span className="rounded-lg border border-cyan-400/15 bg-cyan-500/[0.08] px-2.5 py-1 text-xs text-cyan-300/80">{meta.pill2}</span>
                  </div>
                )}
                <div className="mt-4 text-xs text-slate-500 transition group-hover:text-slate-400">Keşfet →</div>
              </Link>
            );
          })}
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

      {/* ── ACHIEVEMENT / BADGE SHOWCASE ─────────────────────────────────────── */}
      <section className="relative border-y border-white/5 bg-black/20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(245,158,11,0.06),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-6">
          <div className="mb-10 text-center">
            <div className="text-xs uppercase tracking-[0.35em] text-cyan-300">Başarı Sistemi</div>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Rozetler & Sertifikalar</h2>
            <p className="mt-2 text-sm text-slate-400">Her seviyede kazan, her başarıyı belgele.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BADGE_SHOWCASE.map((b) => (
              <div
                key={b.level}
                className={`shine-card rounded-3xl border ${b.border} bg-gradient-to-b ${b.colorGrad} p-8 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl`}
              >
                <div className="text-5xl">{b.emoji}</div>
                <div className={`mt-5 text-xl font-bold ${b.text}`}>{b.level}</div>
                <div className="mt-1 font-mono text-sm text-slate-400">{b.cefrRange}</div>
                <p className="mt-3 text-sm text-slate-400">{b.desc}</p>
                <div className="mt-5 flex gap-2">
                  <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-500">🏅 Rozet</span>
                  <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-500">📜 Sertifika</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING TEASER ────────────────────────────────────────────────────── */}
      <section id="pricing" className="relative mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08),transparent_60%)]" />
        <div className="relative mb-12 text-center">
          <div className="text-xs uppercase tracking-[0.35em] text-cyan-300">Kredi Paketleri</div>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Kullandıkça Öde</h2>
          <p className="mt-2 text-sm text-slate-400">Aylık abonelik yok. İstediğin zaman kredi al.</p>
        </div>

        <div className="relative mx-auto grid max-w-2xl gap-6 sm:grid-cols-2">
          {/* Starter */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Starter</div>
            <div className="mt-4 text-5xl font-bold">₺199</div>
            <div className="mt-3 text-2xl font-semibold text-cyan-300">
              100 <span className="text-sm font-normal text-slate-400">kredi</span>
            </div>
            <p className="mt-2 text-sm text-slate-500">Başlamak için ideal</p>
            <a
              href={SHOPIER_LINKS.starter}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 block rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-center text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Starter Paketi Al
            </a>
          </div>

          {/* Growth */}
          <div className="relative rounded-3xl border border-fuchsia-500/40 bg-gradient-to-b from-fuchsia-500/10 to-violet-500/10 p-8 shadow-[0_8px_40px_rgba(168,85,247,0.15)] backdrop-blur-xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-fuchsia-500 px-3 py-1 text-xs font-semibold text-white">En Popüler</span>
            </div>
            <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Growth</div>
            <div className="mt-4 text-5xl font-bold">₺499</div>
            <div className="mt-3 text-2xl font-semibold text-cyan-300">
              300 <span className="text-sm font-normal text-slate-400">kredi</span>
            </div>
            <p className="mt-2 text-sm text-slate-500">Düzenli öğrenciler için</p>
            <a
              href={SHOPIER_LINKS.growth}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 block rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-3.5 text-center text-sm font-semibold text-white shadow-[0_0_20px_rgba(168,85,247,0.2)] transition hover:opacity-90"
            >
              Growth Paketi Al
            </a>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/pricing" className="text-sm text-cyan-300 transition hover:text-cyan-200">
            Tüm paket detaylarını gör →
          </Link>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-4 md:px-6">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-fuchsia-500/10 px-6 py-16 text-center shadow-[0_8px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl md:px-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.12),transparent_70%)]" />
          <div className="relative">
            <div className="text-xs uppercase tracking-[0.35em] text-cyan-300">Başlamak İçin En İyi Zaman — Bugün</div>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">Akademik Yolculuğuna Başla</h2>
            <p className="mt-3 text-sm text-slate-400">AI mentor, rozet, sertifika ve çok daha fazlası.</p>

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

            <div className="mx-auto mt-10 flex max-w-sm justify-around border-t border-white/10 pt-8">
              {[
                { value: "12+", label: "Dil Programı" },
                { value: "6",   label: "CEFR Seviyesi" },
                { value: "AI",  label: "Kişisel Mentor" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="mt-1 text-xs text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
