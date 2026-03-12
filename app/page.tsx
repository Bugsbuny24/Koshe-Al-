import Link from "next/link";
import Hero from "@/components/Hero";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#030712_0%,#060d1f_60%,#020617_100%)] text-white">
      <div className="mx-auto max-w-5xl px-4 py-5 md:px-6 md:py-8">

        {/* Nav */}
        <nav className="mb-5 flex items-center justify-between">
          <span className="text-base font-bold tracking-tight">Koshei</span>
          <div className="flex gap-2">
            <Link href="/login" className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/[0.08] transition">
              Giriş Yap
            </Link>
            <Link href="/login" className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-400 transition">
              Ücretsiz Başla
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <Hero />

        {/* Vs */}
        <section className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            { label: "Duolingo", desc: "Quiz. Quiz. Quiz. Gerçek konuşma yok.", muted: true },
            { label: "Cambly", desc: "İnsan öğretmen. Pahalı. Randevu gerekli.", muted: true },
            { label: "Koshei ✓", desc: "AI öğretmen. Konuşur, düzeltir, hatırlar.", muted: false },
          ].map((f) => (
            <div key={f.label} className={`rounded-2xl border p-5 ${f.muted ? "border-white/[0.06] bg-white/[0.02]" : "border-cyan-400/20 bg-cyan-400/[0.06]"}`}>
              <p className={`text-sm font-bold mb-2 ${f.muted ? "text-slate-500 line-through" : "text-cyan-300"}`}>{f.label}</p>
              <p className={`text-sm leading-6 ${f.muted ? "text-slate-600" : "text-slate-300"}`}>{f.desc}</p>
            </div>
          ))}
        </section>

        {/* Steps */}
        <section className="mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-4">Nasıl çalışır</p>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {[
              "Dil ve seviyeni seç",
              "Koshei konuşma görevi verir",
              "Yaz veya mikrofona söyle",
              "AI düzeltir, devam eder",
            ].map((s, i) => (
              <div key={i} className="flex gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
                <span className="text-cyan-400 font-bold text-sm shrink-0">{i + 1}.</span>
                <p className="text-sm leading-6 text-slate-300">{s}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-4 rounded-2xl border border-blue-500/20 bg-blue-500/[0.06] p-6 text-center">
          <p className="text-slate-400 text-sm mb-3">Kayıt ücretsiz. Kredi kartı gerekmez.</p>
          <Link href="/login" className="inline-block rounded-xl bg-blue-500 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-400 transition">
            Şimdi Ücretsiz Dene
          </Link>
        </section>

      </div>
    </main>
  );
}
