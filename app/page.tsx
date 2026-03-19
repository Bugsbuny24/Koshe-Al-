import Link from "next/link";
import { MENTORS } from "@/lib/data/mentors";
import { FACULTIES } from "@/lib/data/academic-catalog";

const SHOPIER_LINKS = {
  starter: "https://www.shopier.com/TradeVisual/45362316",
  growth: "https://www.shopier.com/TradeVisual/45362403",
  pro: "https://www.shopier.com/TradeVisual/45362552",
  prestige: "https://www.shopier.com/TradeVisual/45362662",
} as const;

const FACULTY_META: Record<string, { pill1: string; pill2: string; accent: string; glow: string }> = {
  LANG:     { pill1: "12 Program", pill2: "🗣️ Konuşma", accent: "border-cyan-500/30 bg-cyan-500/10",     glow: "shadow-[0_0_40px_rgba(6,182,212,0.12)]" },
  TECH:     { pill1: "2 Program",  pill2: "🤖 AI",       accent: "border-violet-500/30 bg-violet-500/10", glow: "shadow-[0_0_40px_rgba(139,92,246,0.12)]" },
  BUS:      { pill1: "2 Program",  pill2: "💼 İş",       accent: "border-blue-500/30 bg-blue-500/10",     glow: "shadow-[0_0_40px_rgba(59,130,246,0.12)]" },
  CREATIVE: { pill1: "1 Program",  pill2: "🎨 Yaratıcı", accent: "border-fuchsia-500/30 bg-fuchsia-500/10", glow: "shadow-[0_0_40px_rgba(217,70,239,0.12)]" },
};

const BADGE_TIERS = [
  {
    level: "Başlangıç", cefrRange: "A1–A2", emoji: "🌱", rank: "01",
    grad: "from-emerald-950 to-teal-950",
    border: "border-emerald-500/25",
    glow: "shadow-[0_0_60px_rgba(16,185,129,0.15)]",
    accent: "text-emerald-300",
    bar: "bg-emerald-500",
    barWidth: "w-[30%]",
    desc: "Temel diyalog ve kelime hakimiyeti",
  },
  {
    level: "Orta", cefrRange: "B1–B2", emoji: "🚀", rank: "02",
    grad: "from-cyan-950 to-blue-950",
    border: "border-cyan-500/25",
    glow: "shadow-[0_0_60px_rgba(6,182,212,0.15)]",
    accent: "text-cyan-300",
    bar: "bg-cyan-500",
    barWidth: "w-[55%]",
    desc: "Akıcı iletişim ve iş hayatı dili",
  },
  {
    level: "İleri", cefrRange: "C1", emoji: "⚡", rank: "03",
    grad: "from-violet-950 to-fuchsia-950",
    border: "border-violet-500/25",
    glow: "shadow-[0_0_60px_rgba(139,92,246,0.15)]",
    accent: "text-violet-300",
    bar: "bg-violet-500",
    barWidth: "w-[75%]",
    desc: "Akademik yazım ve sunum dili",
  },
  {
    level: "Usta", cefrRange: "C2", emoji: "👑", rank: "04",
    grad: "from-amber-950 to-orange-950",
    border: "border-amber-500/25",
    glow: "shadow-[0_0_60px_rgba(245,158,11,0.2)]",
    accent: "text-amber-300",
    bar: "bg-amber-500",
    barWidth: "w-full",
    desc: "Yerli konuşmacı akıcılığı",
  },
] as const;

export default function HomePage() {
  return (
    <main className="min-h-screen text-white overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        {/* Layered background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_0%,rgba(99,102,241,0.35),transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_100%,rgba(168,85,247,0.25),transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_50%_50%,rgba(6,182,212,0.07),transparent)]" />
        {/* Grid texture */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 py-20 md:grid-cols-2 md:gap-14 md:px-8 md:py-28 lg:gap-20">

          {/* LEFT: Copy */}
          <div className="relative z-10 flex flex-col">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.08] px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] text-cyan-300">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400" />
              Koshei AI University
            </div>

            <h1 className="text-[clamp(2.6rem,7vw,5.5rem)] font-extrabold leading-[1.05] tracking-tight">
              AI Mentor ile
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent">
                Dil Ustalaş
              </span>
            </h1>

            <p className="mt-5 max-w-md text-base leading-relaxed text-slate-400 md:text-lg">
              Speaking pratiği, rozet ve AI rehberliği — tek platformda.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-8 py-4 text-base font-semibold text-white shadow-[0_0_40px_rgba(168,85,247,0.4)] transition hover:opacity-90 hover:shadow-[0_0_60px_rgba(168,85,247,0.5)]"
              >
                Ücretsiz Başla
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-8 py-4 text-base font-medium text-slate-200 backdrop-blur-sm transition hover:border-white/25 hover:bg-white/10"
              >
                Programları Gör
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-6 border-t border-white/10 pt-6">
              {[
                { value: "12+", label: "Dil Programı" },
                { value: "6",   label: "CEFR Seviyesi" },
                { value: "AI",  label: "Kişisel Mentor" },
              ].map((s, i) => (
                <div key={s.label} className="flex items-center gap-6">
                  {i > 0 && <div className="h-8 w-px bg-white/10" />}
                  <div>
                    <div className="text-2xl font-bold">{s.value}</div>
                    <div className="mt-0.5 text-xs text-slate-500">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Mentor mockup — cinematic panel */}
          <div className="relative z-10 flex justify-center">
            {/* Outer glow halo */}
            <div className="pointer-events-none absolute inset-0 rounded-[36px] bg-gradient-to-b from-cyan-500/20 to-fuchsia-500/20 blur-[60px]" />

            <div className="relative w-full max-w-[420px] rounded-[32px] border border-white/10 bg-gradient-to-b from-white/[0.09] to-white/[0.04] p-3 shadow-[0_30px_100px_rgba(0,0,0,0.6),0_0_80px_rgba(99,102,241,0.2)] backdrop-blur-2xl">
              <div className="rounded-[24px] border border-white/10 bg-[#060d1a] overflow-hidden">

                {/* Mentor header */}
                <div className="flex items-center justify-between border-b border-white/[0.07] bg-white/[0.03] px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-r ${MENTORS[0].gradientFrom} ${MENTORS[0].gradientTo} text-sm font-bold shadow-[0_0_20px_rgba(6,182,212,0.5)]`}>
                      {MENTORS[0].avatarInitials}
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#060d1a] bg-emerald-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{MENTORS[0].name}</div>
                      <div className="text-[11px] text-slate-400">{MENTORS[0].title}</div>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-medium text-emerald-300">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Live
                  </span>
                </div>

                {/* Chat */}
                <div className="space-y-3 px-4 py-5">
                  <div className="flex justify-start">
                    <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-white/[0.06] px-4 py-3 text-sm text-slate-200 leading-relaxed">
                      Hello! Let&apos;s practice a real conversation. Tell me about your goals.
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-[88%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-3 text-sm text-white leading-relaxed shadow-[0_4px_16px_rgba(139,92,246,0.35)]">
                      I want to improve my academic English for presentations.
                    </div>
                  </div>
                  <div className="rounded-xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/[0.08] to-blue-500/[0.06] px-4 py-3">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-cyan-300 font-medium">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                      AI Analiz
                    </div>
                    <p className="mt-1.5 text-sm text-slate-100">
                      Focus on <span className="font-medium text-cyan-300">presentation language</span> — confidence +12%
                    </p>
                  </div>
                </div>

                {/* Score bar */}
                <div className="grid grid-cols-3 gap-2 border-t border-white/[0.07] bg-white/[0.02] px-4 py-4">
                  {[
                    { label: "Fluency", val: 84, color: "bg-cyan-500" },
                    { label: "Grammar", val: 78, color: "bg-violet-500" },
                    { label: "Vocab",   val: 72, color: "bg-fuchsia-500" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl bg-white/[0.04] px-3 py-3">
                      <div className="text-[11px] text-slate-500">{s.label}</div>
                      <div className="mt-1 text-xl font-bold">{s.val}</div>
                      <div className="mt-2 h-1 w-full rounded-full bg-white/10">
                        <div className={`h-1 rounded-full ${s.color}`} style={{ width: `${s.val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mentor selector strip */}
              <div className="mt-2.5 flex items-center justify-center gap-2 px-1 pb-1">
                {MENTORS.map((m) => (
                  <div key={m.id} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs text-slate-300">
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r ${m.gradientFrom} ${m.gradientTo} text-[10px] font-bold`}>
                      {m.avatarInitials[0]}
                    </span>
                    {m.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom glow separator */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-[200px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[100px]" />
      </section>

      {/* ── HOW IT WORKS — compact numbered track ─────────────────────────────── */}
      <section className="relative overflow-hidden border-y border-white/[0.06]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08),transparent_70%)] bg-black/30" />
        <div className="relative mx-auto max-w-7xl px-5 py-14 md:px-8">
          <div className="mb-10 text-center">
            <div className="text-[11px] font-medium uppercase tracking-[0.35em] text-cyan-400">Nasıl Çalışır</div>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">4 Adımda Ustalaş</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {[
              { n: "01", icon: "🎓", title: "Program Seç",     sub: "Fakülten ve seviyene göre yolunu belirle" },
              { n: "02", icon: "🤖", title: "Mentorla Çalış",  sub: "AI mentorınla canlı speaking pratiği yap" },
              { n: "03", icon: "🏅", title: "Rozet Kazan",     sub: "Her adımda rozet ve sertifika kazan" },
              { n: "04", icon: "📊", title: "İlerlemeni Kanıtla",sub: "Speaking skoru ile gelişimini izle" },
            ].map((item, i) => (
              <div key={item.n} className="group relative flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition hover:border-white/[0.15] hover:bg-white/[0.06]">
                <span className="absolute right-4 top-4 font-mono text-[11px] font-bold text-white/10">{item.n}</span>
                <div className="mb-3 text-3xl">{item.icon}</div>
                <div className="text-sm font-semibold leading-tight">{item.title}</div>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{item.sub}</p>
                {i < 3 && (
                  <div className="pointer-events-none absolute -right-3 top-1/2 hidden -translate-y-1/2 text-white/20 md:block">›</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACADEMIC PROGRAMS — asymmetrical premium layout ───────────────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[500px] rounded-full bg-violet-500/[0.07] blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-8">
          <div className="mb-12 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-[0.35em] text-cyan-400">Fakülteler</div>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">Akademik Programlar</h2>
            </div>
            <Link href="/courses" className="self-start rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] md:self-auto">
              Tümünü Gör →
            </Link>
          </div>

          {/* Asymmetric grid: large feature card + 3 smaller */}
          <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2 md:gap-5">
            {FACULTIES.map((f, i) => {
              const meta = FACULTY_META[f.code];
              const isFeature = i === 0;
              return (
                <Link
                  key={f.code}
                  href="/courses"
                  className={[
                    "group relative flex flex-col overflow-hidden rounded-3xl border transition",
                    meta ? meta.accent : "border-white/10 bg-white/5",
                    meta ? meta.glow : "",
                    "backdrop-blur-xl",
                    isFeature ? "md:row-span-2 md:col-span-1" : "",
                  ].join(" ")}
                >
                  {/* Glow bg */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />

                  <div className={["relative flex flex-col p-7", isFeature ? "h-full justify-between" : ""].join(" ")}>
                    <div>
                      <div className={["mb-4 rounded-2xl border border-white/10 bg-black/20 p-3 text-center", isFeature ? "w-16 text-5xl" : "w-12 text-3xl"].join(" ")}>
                        {f.icon}
                      </div>
                      <div className={["font-bold", isFeature ? "text-2xl" : "text-lg"].join(" ")}>{f.name}</div>
                      <p className="mt-1 text-sm leading-relaxed text-slate-400 line-clamp-2">{f.description}</p>
                    </div>

                    <div className="mt-5">
                      {meta && (
                        <div className="mb-4 flex flex-wrap gap-2">
                          <span className="rounded-lg border border-white/10 bg-black/20 px-2.5 py-1 text-xs text-slate-400">{meta.pill1}</span>
                          <span className="rounded-lg border border-cyan-400/15 bg-cyan-500/[0.08] px-2.5 py-1 text-xs text-cyan-300/80">{meta.pill2}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-600 transition group-hover:text-slate-400">Keşfet</span>
                        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs text-slate-400 transition group-hover:border-white/20 group-hover:bg-white/10 group-hover:text-white">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── GLOW SEPARATOR ────────────────────────────────────────────────────── */}
      <div className="relative h-px overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fuchsia-500/40 to-transparent" />
        <div className="absolute left-1/2 top-0 h-[160px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/10 blur-[80px]" />
      </div>

      {/* ── REWARDS / BADGE SHOWCASE ────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-y border-white/[0.05] bg-black/30">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(245,158,11,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-8">
          <div className="mb-12 text-center">
            <div className="text-[11px] font-medium uppercase tracking-[0.35em] text-amber-400">Başarı Sistemi</div>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">Rozetler & Sertifikalar</h2>
            <p className="mt-2 text-sm text-slate-500">Her seviyede kazan. Her başarıyı belgele.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BADGE_TIERS.map((b) => (
              <div
                key={b.level}
                className={`group relative flex flex-col overflow-hidden rounded-3xl border ${b.border} bg-gradient-to-b ${b.grad} ${b.glow} p-6 transition hover:scale-[1.02]`}
              >
                {/* Rank watermark */}
                <span className="absolute right-4 top-4 font-mono text-5xl font-black text-white/[0.04] select-none">{b.rank}</span>

                {/* Collectible icon */}
                <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border ${b.border} bg-white/5 text-4xl shadow-inner`}>
                  {b.emoji}
                </div>

                <div className={`text-xl font-bold ${b.accent}`}>{b.level}</div>
                <div className="mt-0.5 font-mono text-xs text-slate-500">{b.cefrRange}</div>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{b.desc}</p>

                {/* Progress bar */}
                <div className="mt-5 h-1 w-full rounded-full bg-white/[0.07]">
                  <div className={`h-1 rounded-full ${b.bar} ${b.barWidth} transition-all duration-700 group-hover:opacity-80`} />
                </div>

                <div className="mt-4 flex gap-2">
                  <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-500">🏅 Rozet</span>
                  <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-500">📜 Sertifika</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────────────────── */}
      <section id="pricing" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.10),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-8">
          <div className="mb-12 text-center">
            <div className="text-[11px] font-medium uppercase tracking-[0.35em] text-cyan-400">Kredi Paketleri</div>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">Kullandıkça Öde</h2>
            <p className="mt-2 text-sm text-slate-500">Aylık abonelik yok — istediğin zaman kredi al.</p>
          </div>

          <div className="mx-auto grid max-w-2xl gap-5 sm:grid-cols-2">

            {/* Starter */}
            <div className="group relative flex flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_8px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl transition hover:border-white/20">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Starter</div>
                  <div className="mt-3 text-5xl font-extrabold tracking-tight">₺199</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-center">
                  <div className="text-xl font-bold text-cyan-300">100</div>
                  <div className="text-[10px] text-slate-500">kredi</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-500">Başlamak için ideal paket.</p>
              <ul className="mt-5 space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2"><span className="text-cyan-400">✓</span> 100 speaking kredisi</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400">✓</span> AI mentor erişimi</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400">✓</span> Rozet sistemi</li>
              </ul>
              <a
                href={SHOPIER_LINKS.starter}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 block rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-white/[0.12] hover:border-white/20"
              >
                Starter Paketi Al →
              </a>
            </div>

            {/* Growth — featured */}
            <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-fuchsia-500/50 bg-gradient-to-b from-fuchsia-950/80 to-violet-950/80 p-8 shadow-[0_0_80px_rgba(168,85,247,0.25),0_8px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl transition hover:shadow-[0_0_120px_rgba(168,85,247,0.35)]">
              {/* Spotlight */}
              <div className="pointer-events-none absolute -top-20 left-1/2 h-[200px] w-[300px] -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-[60px]" />

              <div className="absolute right-4 top-4">
                <span className="rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500 px-3 py-1 text-[11px] font-bold text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                  En Popüler
                </span>
              </div>

              <div className="relative flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-fuchsia-300">Growth</div>
                  <div className="mt-3 text-5xl font-extrabold tracking-tight">₺499</div>
                </div>
                <div className="rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/15 px-3 py-2 text-center">
                  <div className="text-xl font-bold text-fuchsia-200">300</div>
                  <div className="text-[10px] text-fuchsia-400">kredi</div>
                </div>
              </div>

              <p className="relative mt-4 text-sm text-slate-400">Düzenli öğrenciler için en iyi değer.</p>

              <ul className="relative mt-5 space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2"><span className="text-fuchsia-400">✓</span> 300 speaking kredisi</li>
                <li className="flex items-center gap-2"><span className="text-fuchsia-400">✓</span> Tüm AI mentorlar</li>
                <li className="flex items-center gap-2"><span className="text-fuchsia-400">✓</span> Sertifika ve rozet</li>
              </ul>

              <a
                href={SHOPIER_LINKS.growth}
                target="_blank"
                rel="noopener noreferrer"
                className="relative mt-8 block rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-4 text-center text-sm font-bold text-white shadow-[0_4px_30px_rgba(168,85,247,0.45)] transition hover:opacity-90 hover:shadow-[0_4px_40px_rgba(168,85,247,0.6)]"
              >
                Growth Paketi Al →
              </a>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/pricing" className="text-sm text-cyan-400 transition hover:text-cyan-300">
              Tüm paket detaylarını gör →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-5 pb-24 pt-8 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-indigo-950/80 via-[#0a0520] to-fuchsia-950/60 px-8 py-20 text-center shadow-[0_20px_100px_rgba(0,0,0,0.6)] backdrop-blur-xl md:px-16 md:py-28">

            {/* Background glows */}
            <div className="pointer-events-none absolute -left-20 -top-20 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-[400px] w-[400px] rounded-full bg-fuchsia-500/15 blur-[100px]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15),transparent_65%)]" />

            {/* Grid texture */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.025]"
              style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

            <div className="relative">
              <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.08] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.3em] text-cyan-300">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                Başlamak İçin En İyi Zaman — Bugün
              </div>
              <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight">
                Akademik Yolculuğuna
                <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Başla
                </span>
              </h2>
              <p className="mx-auto mt-4 max-w-md text-base text-slate-400">
                AI mentor, rozet, sertifika ve çok daha fazlası.
              </p>

              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-10 py-4 text-base font-bold text-white shadow-[0_0_50px_rgba(168,85,247,0.4)] transition hover:opacity-90 hover:shadow-[0_0_70px_rgba(168,85,247,0.5)]"
                >
                  Ücretsiz Kayıt Ol
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </Link>
                <Link
                  href="/courses"
                  className="inline-flex items-center rounded-2xl border border-white/15 bg-white/[0.05] px-10 py-4 text-base font-medium text-slate-200 backdrop-blur-sm transition hover:border-white/25 hover:bg-white/[0.10]"
                >
                  Programları İncele
                </Link>
              </div>

              <div className="mx-auto mt-12 flex max-w-xs justify-around border-t border-white/[0.08] pt-8">
                {[
                  { value: "12+", label: "Dil Programı" },
                  { value: "6",   label: "CEFR Seviyesi" },
                  { value: "AI",  label: "Kişisel Mentor" },
                ].map((s, i) => (
                  <div key={s.label} className="flex items-center gap-6">
                    {i > 0 && <div className="h-6 w-px bg-white/[0.08]" />}
                    <div>
                      <div className="text-2xl font-extrabold">{s.value}</div>
                      <div className="mt-0.5 text-xs text-slate-500">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
