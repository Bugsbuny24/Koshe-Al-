import Link from "next/link";

const lessons = [
  {
    title: "Kendini Tanıtma",
    level: "Başlangıç",
    description: "Basit ve doğal cümlelerle kendini ifade etmeyi öğren.",
  },
  {
    title: "Günlük Konuşma",
    level: "Orta",
    description: "Günlük hayatta sık kullanılan kalıplarla konuş.",
  },
  {
    title: "İş Görüşmesi",
    level: "İleri",
    description: "İş görüşmelerinde güvenli ve net konuşma pratiği yap.",
  },
];

export default function LessonPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="rounded-[28px] border border-white/10 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-fuchsia-500/10 p-6">
          <div className="text-sm uppercase tracking-[0.25em] text-cyan-300">
            Lesson Hub
          </div>
          <h1 className="mt-2 text-3xl font-semibold">Dersler ve Senaryolar</h1>
          <p className="mt-2 max-w-2xl text-slate-300">
            Seviyene uygun konuşma derslerini aç, AI ile pratik yap ve anında geri bildirim al.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/live"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-5 py-3 font-medium text-white transition hover:opacity-90"
            >
              Canlı Pratiğe Geç
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-slate-100 transition hover:bg-white/10"
            >
              Dashboard
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="text-xl font-semibold">Filtreler</div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm text-slate-400">Dil</label>
                <select className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none">
                  <option>İngilizce</option>
                  <option>Almanca</option>
                  <option>Fransızca</option>
                  <option>Türkçe</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">Seviye</label>
                <select className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none">
                  <option>Başlangıç</option>
                  <option>Orta</option>
                  <option>İleri</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">Amaç</label>
                <select className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none">
                  <option>Günlük konuşma</option>
                  <option>İş hayatı</option>
                  <option>Seyahat</option>
                  <option>Sınav hazırlığı</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            {lessons.map((lesson) => (
              <div
                key={lesson.title}
                className="rounded-[28px] border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.25em] text-cyan-300">
                      {lesson.level}
                    </div>
                    <h2 className="mt-2 text-2xl font-semibold">{lesson.title}</h2>
                    <p className="mt-3 max-w-2xl text-slate-300">{lesson.description}</p>
                  </div>

                  <button className="inline-flex rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-5 py-3 font-medium text-white transition hover:opacity-90">
                    Dersi Başlat
                  </button>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-sm text-slate-400">Süre</div>
                    <div className="mt-1 text-lg font-semibold">10 dk</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-sm text-slate-400">Format</div>
                    <div className="mt-1 text-lg font-semibold">AI Diyalog</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-sm text-slate-400">Hedef</div>
                    <div className="mt-1 text-lg font-semibold">Akıcılık</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
