import Link from "next/link";
import HeroMap from "@/components/HeroMap";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#030712_0%,#060d1f_50%,#020617_100%)] text-white overflow-hidden">

      {/* Nav */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <span className="text-base font-bold tracking-tight">Koshei</span>
        <div className="flex gap-2">
          <Link href="/login" className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]">
            Giriş Yap
          </Link>
          <Link href="/login" className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-400">
            Ücretsiz Başla
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pt-8 pb-4">
        <div className="relative rounded-[32px] border border-white/[0.06] bg-white/[0.02] overflow-hidden" style={{ minHeight: 420 }}>

          {/* Map background */}
          <div className="absolute inset-0">
            <HeroMap />
          </div>

          {/* Gradient overlay so text is readable */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(3,7,18,0.2)_0%,rgba(3,7,18,0.85)_60%)]" />

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center h-full px-6 py-12 md:px-10 md:max-w-[55%]">
            <span className="mb-4 inline-flex w-fit rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
              63 dil · Ücretsiz Beta
            </span>
            <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl mb-4">
              AI ile gerçek<br />
              <span className="text-cyan-300">dil pratiği.</span>
            </h1>
            <p className="text-sm leading-7 text-slate-300 mb-6 max-w-md">
              Koshei sana soru sorar, cevabını dinler, hatanı düzeltir ve seni ilerletir. Quiz değil — gerçek konuşma.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/login" className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400">
                Hemen Başla →
              </Link>
              <Link href="/lesson" className="rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.10]">
                Örnek Ders
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Vs section */}
      <section className="mx-auto max-w-6xl px-5 py-4">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { label: "Duolingo", desc: "Quiz. Quiz. Quiz. Gerçek konuşma yok.", muted: true },
            { label: "Cambly", desc: "İnsan öğretmen. Pahalı. Randevu gerekli.", muted: true },
            { label: "Koshei ✓", desc: "AI öğretmen. Seninle konuşur, düzeltir, hatırlar.", muted: false },
          ].map((f) => (
            <div key={f.label} className={`rounded-2xl border p-5 ${f.muted ? "border-white/[0.06] bg-white/[0.02]" : "border-cyan-400/20 bg-cyan-400/[0.06]"}`}>
              <p className={`text-sm font-bold mb-2 ${f.muted ? "text-slate-500 line-through" : "text-cyan-300"}`}>{f.label}</p>
              <p className={`text-sm leading-6 ${f.muted ? "text-slate-600" : "text-slate-300"}`}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-5 py-4">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-4">Nasıl çalışır</p>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {[
              "Dil ve seviyeni seç",
              "Koshei sana konuşma görevi verir",
              "Yaz veya mikrofona söyle",
              "AI düzeltir, sonraki soruya geçer",
            ].map((s, i) => (
              <div key={i} className="flex gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
                <span className="text-cyan-400 font-bold text-sm shrink-0">{i + 1}.</span>
                <p className="text-sm leading-6 text-slate-300">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 pt-4 pb-10 text-center">
        <p className="text-slate-500 text-sm mb-3">Kayıt ücretsiz. Kredi kartı gerekmez.</p>
        <Link href="/login" className="inline-block rounded-xl bg-blue-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-blue-400">
          Şimdi Ücretsiz Dene
        </Link>
      </section>

    </main>
  );
}
