import Link from "next/link";
import { getAvailableLanguages } from "@/lib/constants/curriculum";
import { LANGUAGES } from "@/lib/constants/languages";

const LEVEL_COLORS: Record<string, string> = {
  A1: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  A2: "bg-teal-500/15 text-teal-300 border-teal-500/30",
  B1: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  B2: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  C1: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  C2: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

const LEVEL_LABELS: Record<string, string> = {
  A1: "Başlangıç",
  A2: "Temel",
  B1: "Orta",
  B2: "Orta-İleri",
  C1: "İleri",
  C2: "Ustalık",
};

export const metadata = {
  title: "Kurslar | Yabancı Dil Üniversitesi",
  description: "80'den fazla dil için yapılandırılmış dil kursları",
};

export default function CoursesPage() {
  const availableLanguages = getAvailableLanguages();

  const popularLanguageCodes = LANGUAGES.filter((l) => l.isPopular).map(
    (l) => l.code
  );

  const popularCourses = availableLanguages.filter((l) =>
    popularLanguageCodes.includes(l.code)
  );

  const otherCourses = availableLanguages.filter(
    (l) => !popularLanguageCodes.includes(l.code)
  );

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 rounded-[28px] border border-white/10 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-fuchsia-500/10 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">
            Yabancı Dil Üniversitesi
          </p>
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Dil Kursları
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            A1'den C2'ye kadar yapılandırılmış müfredat, AI konuşma pratiği ve
            gerçek zamanlı geri bildirim ile dil öğren.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {(["A1", "A2", "B1", "B2", "C1", "C2"] as const).map((level) => (
              <span
                key={level}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${LEVEL_COLORS[level]}`}
              >
                {level} — {LEVEL_LABELS[level]}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="text-3xl font-bold text-white">
              {availableLanguages.length}
            </div>
            <div className="mt-1 text-sm text-slate-400">Dil Bölümü</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="text-3xl font-bold text-white">
              {availableLanguages.reduce((sum, l) => sum + l.courseCount, 0)}
            </div>
            <div className="mt-1 text-sm text-slate-400">Toplam Kurs</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="text-3xl font-bold text-white">AI</div>
            <div className="mt-1 text-sm text-slate-400">
              Kişiselleştirilmiş Öğretmen
            </div>
          </div>
        </div>

        {/* Popular Languages */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <h2 className="text-xl font-semibold text-white">
              Popüler Dil Bölümleri
            </h2>
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
              {popularCourses.length} bölüm
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {popularCourses.map((lang) => (
              <LanguageCard key={lang.code} lang={lang} />
            ))}
          </div>
        </section>

        {/* Other Languages */}
        {otherCourses.length > 0 && (
          <section>
            <div className="mb-6 flex items-center gap-3">
              <h2 className="text-xl font-semibold text-white">
                Diğer Dil Bölümleri
              </h2>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
                {otherCourses.length} bölüm
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {otherCourses.map((lang) => (
                <LanguageCard key={lang.code} lang={lang} />
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="mt-14 rounded-[32px] border border-white/10 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-fuchsia-500/10 px-6 py-10 text-center backdrop-blur-xl sm:px-12">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            AI Öğretmenle Pratik Yap
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">
            Kurs materyallerini tamamladıktan sonra AI konuşma pratiği ile
            öğrendiklerini pekiştir.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/live"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-6 py-3 font-medium text-white transition hover:opacity-90"
            >
              Konuşma Pratiği Başlat
            </Link>
            <Link
              href="/lesson"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-slate-100 transition hover:border-white/20 hover:bg-white/10"
            >
              Günlük Derse Git
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function LanguageCard({
  lang,
}: {
  lang: { code: string; name: string; flag: string; courseCount: number; levels: string[] };
}) {
  return (
    <Link
      href={`/courses/${lang.code}`}
      className="group block rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/10"
    >
      <div className="flex items-center gap-3">
        <span className="text-4xl">{lang.flag}</span>
        <div>
          <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
            {lang.name}
          </div>
          <div className="text-xs text-slate-400">
            {lang.courseCount} kurs seviyesi
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {lang.levels.map((level) => (
          <span
            key={level}
            className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-xs text-slate-300"
          >
            {level}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-slate-400">Bölümü İncele →</span>
      </div>
    </Link>
  );
}
