import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
          <div className="flex flex-col gap-4">
            <span className="w-fit rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-sm text-blue-200">
              Koshei V1
            </span>

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Avatar yok. Bahane yok.
            </h1>

            <p className="max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              Bu sürüm tamamen konuşma pratiği, AI öğretmen cevabı ve sesli akış
              üstüne kurulu. Hedef: hızlı, temiz ve gerçek öğrenme deneyimi.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/live"
                className="rounded-2xl bg-blue-500 px-5 py-3 font-medium text-white transition hover:bg-blue-400"
              >
                Canlı Konuşmayı Başlat
              </Link>

              <Link
                href="/lesson"
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10"
              >
                Lesson Sayfası
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold">AI Teacher</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Konuşur, cevap verir, gerektiğinde düzeltir.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold">Speech First</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Mikrofonla konuş, yazıya dönsün, cevap sesi geri gelsin.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold">No Avatar</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Maliyet düşük, sistem temiz, odak öğretmen kalitesinde.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
