import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_18%),linear-gradient(180deg,#030712_0%,#061127_52%,#020617_100%)] text-white">
      <div className="mx-auto max-w-4xl px-4 py-6 md:px-6 md:py-10">

        {/* Nav */}
        <header className="mb-8 flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight">Koshei</span>
          <div className="flex gap-2">
            <Link href="/login" className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/[0.08]">
              Giriş Yap
            </Link>
            <Link href="/login" className="rounded-2xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-400">
              Ücretsiz Başla
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="rounded-[28px] border border-cyan-300/12 bg-white/[0.03] p-6 backdrop-blur-xl mb-4 md:p-10">
          <span className="inline-block rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200 mb-5">
            Beta · Ücretsiz
          </span>
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl mb-4">
            AI ile <span className="text-cyan-300">gerçek</span><br />dil pratiği.
          </h1>
          <p className="text-base leading-7 text-slate-300 max-w-lg mb-6">
            Koshei sana soru sorar, cevabını dinler, hatanı düzeltir. Duolingo gibi quiz değil — gerçek konuşma pratiği.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/login" className="rounded-2xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-400">
              Hemen Başla →
            </Link>
            <Link href="/lesson" className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/[0.08]">
              Örnek Ders
            </Link>
          </div>
        </section>

        {/* Fark */}
        <section className="grid gap-4 md:grid-cols-3 mb-4">
          {[
            { label: "Duolingo", desc: "Quiz. Tekrar. Quiz. Tekrar.", bad: true },
            { label: "Cambly", desc: "İnsan öğretmen. Pahalı. Randevu.", bad: true },
            { label: "Koshei", desc: "AI öğretmen. Seninle konuşur, düzeltir, hafızalarda tutar.", bad: false },
          ].map(f => (
            <div key={f.label} className={`rounded-[24px] border p-5 ${f.bad ? "border-white/10 bg-white/[0.02]" : "border-cyan-300/20 bg-cyan-400/[0.07]"}`}>
              <p className={`text-sm font-bold mb-2 ${f.bad ? "text-slate-400 line-through" : "text-cyan-200"}`}>{f.label}</p>
              <p className={`text-sm leading-6 ${f.bad ? "text-slate-500" : "text-slate-200"}`}>{f.desc}</p>
            </div>
          ))}
        </section>

        {/* Nasıl çalışır */}
        <section className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 mb-4">
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-4">Nasıl çalışır</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Dil ve seviyeni seç (A1'den C2'ye)",
              "Koshei sana konuşma görevi verir",
              "Cevabını yaz veya mikrofona söyle",
              "Koshei hatanı düzeltir, sonraki soruya geçer",
            ].map((s, i) => (
              <div key={i} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <span className="text-cyan-400 font-bold text-sm w-5 shrink-0">{i + 1}</span>
                <p className="text-sm leading-6 text-slate-200">{s}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-[28px] border border-blue-400/20 bg-blue-500/10 p-6 text-center">
          <p className="text-slate-300 text-sm mb-3">Kayıt ücretsiz. Kredi kartı gerekmez.</p>
          <Link href="/login" className="inline-block rounded-2xl bg-blue-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-blue-400">
            Şimdi Ücretsiz Dene
          </Link>
        </section>

      </div>
    </main>
  );
}
