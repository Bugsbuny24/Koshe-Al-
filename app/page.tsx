import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 py-10 md:px-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">

        {/* Hero */}
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <span className="inline-block rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-xs text-blue-300 mb-4">
            Koshei AI · Beta
          </span>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Yabancı dil öğren.<br />
            <span className="text-blue-400">Konuşarak.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
            Koshei, seninle birebir konuşan bir AI dil öğretmeni. Mikrofona bas, konuş — Koshei dinler, düzeltir, öğretir.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/live" className="rounded-2xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-400">
              Konuşmayı Başlat
            </Link>
            <Link href="/lesson" className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
              Ders Al
            </Link>
          </div>
        </section>

        {/* Özellikler */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-2xl mb-2">🎙</div>
            <h2 className="text-base font-semibold">Sesli Pratik</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Mikrofona konuş, Koshei anında yanıt verir. Gerçek konuşma pratiği.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-2xl mb-2">🌍</div>
            <h2 className="text-base font-semibold">60+ Dil</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              İngilizce, Almanca, Japonca, Arapça ve daha fazlası. Seç ve başla.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-2xl mb-2">🧠</div>
            <h2 className="text-base font-semibold">AI Öğretmen</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Hatalarını nazikçe düzeltir, seviyene göre ayarlanır, asla sıkmaz.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl border border-blue-400/20 bg-blue-400/5 p-6 text-center">
          <p className="text-slate-300 text-sm">Kayıt gerekmez. Hemen başla.</p>
          <Link href="/live" className="mt-3 inline-block rounded-2xl bg-blue-500 px-8 py-3 font-semibold text-white transition hover:bg-blue-400">
            Şimdi Dene →
          </Link>
        </section>

      </div>
    </main>
  );
}
