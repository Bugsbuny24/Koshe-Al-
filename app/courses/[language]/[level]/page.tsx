import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse, getCoursesByLanguage } from "@/lib/constants/curriculum";

const LEVEL_COLORS: Record<string, string> = {
  A1: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
  A2: "from-teal-500/20 to-cyan-500/10 border-teal-500/30",
  B1: "from-blue-500/20 to-indigo-500/10 border-blue-500/30",
  B2: "from-violet-500/20 to-purple-500/10 border-violet-500/30",
  C1: "from-orange-500/20 to-amber-500/10 border-orange-500/30",
  C2: "from-rose-500/20 to-pink-500/10 border-rose-500/30",
};

const LEVEL_BADGE: Record<string, string> = {
  A1: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  A2: "bg-teal-500/15 text-teal-300 border-teal-500/30",
  B1: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  B2: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  C1: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  C2: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

const LEVELS_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ language: string; level: string }>;
}) {
  const { language, level } = await params;
  const course = getCourse(language, level.toUpperCase());
  if (!course) return { title: "Bulunamadı" };
  return {
    title: `${course.title} | Yabancı Dil Üniversitesi`,
    description: course.description,
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ language: string; level: string }>;
}) {
  const { language, level } = await params;
  const course = getCourse(language, level.toUpperCase());

  if (!course) {
    notFound();
  }

  const allCoursesForLanguage = getCoursesByLanguage(language);
  const currentIndex = LEVELS_ORDER.indexOf(course.level);
  const nextLevel = LEVELS_ORDER[currentIndex + 1];
  const nextCourse = nextLevel
    ? allCoursesForLanguage.find((c) => c.level === nextLevel)
    : null;
  const prevLevel = LEVELS_ORDER[currentIndex - 1];
  const prevCourse = prevLevel
    ? allCoursesForLanguage.find((c) => c.level === prevLevel)
    : null;

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <Link href="/courses" className="hover:text-white transition-colors">
            Kurslar
          </Link>
          <span>/</span>
          <Link
            href={`/courses/${language}`}
            className="hover:text-white transition-colors"
          >
            {course.languageName}
          </Link>
          <span>/</span>
          <span className="text-white">{course.level}</span>
        </nav>

        {/* Course Header */}
        <div
          className={`mb-8 rounded-[28px] border bg-gradient-to-br ${LEVEL_COLORS[course.level]} p-6 sm:p-8`}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{course.flag}</span>
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${LEVEL_BADGE[course.level]}`}
                >
                  {course.level}
                </span>
              </div>
              <h1 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
                {course.title}
              </h1>
              <p className="mt-3 max-w-2xl text-slate-300">
                {course.description}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-2">
              <span>📚</span>
              <span className="text-slate-200">
                {course.units.length} Ünite
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-2">
              <span>⏱️</span>
              <span className="text-slate-200">~{course.totalHours} Saat</span>
            </div>
            {course.prerequisites && (
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-2">
                <span>⬆️</span>
                <span className="text-slate-200">
                  Ön Koşul: {course.prerequisites}
                </span>
              </div>
            )}
            {!course.prerequisites && (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
                <span>✅</span>
                <span className="text-emerald-300">Ön Koşul Yok</span>
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/live"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              🎤 AI ile Konuşma Pratiği Yap
            </Link>
            <Link
              href="/lesson"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10"
            >
              📖 Günlük Derse Git
            </Link>
          </div>
        </div>

        {/* Units Curriculum */}
        <div className="mb-8">
          <h2 className="mb-5 text-xl font-semibold text-white">
            Kurs Müfredatı
          </h2>

          <div className="space-y-4">
            {course.units.map((unit, index) => (
              <div
                key={unit.id}
                className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
              >
                <div className="flex items-start gap-4">
                  {/* Unit Number */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/30 font-semibold text-white">
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-white">{unit.title}</h3>
                      <span className="shrink-0 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-400">
                        {unit.estimatedHours} saat
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {unit.topics.map((topic) => (
                        <span
                          key={topic}
                          className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-300"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Path Navigation */}
        <div className="grid gap-4 sm:grid-cols-2">
          {prevCourse ? (
            <Link
              href={`/courses/${language}/${prevCourse.level}`}
              className="group flex items-center gap-4 rounded-[24px] border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/10"
            >
              <span className="text-2xl">←</span>
              <div>
                <div className="text-xs text-slate-400">Önceki Seviye</div>
                <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  {prevCourse.title}
                </div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextCourse ? (
            <Link
              href={`/courses/${language}/${nextCourse.level}`}
              className="group flex items-center justify-end gap-4 rounded-[24px] border border-white/10 bg-white/5 p-5 text-right transition hover:border-white/20 hover:bg-white/10"
            >
              <div>
                <div className="text-xs text-slate-400">Sonraki Seviye</div>
                <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  {nextCourse.title}
                </div>
              </div>
              <span className="text-2xl">→</span>
            </Link>
          ) : (
            <div className="flex items-center justify-end gap-4 rounded-[24px] border border-emerald-500/20 bg-emerald-500/10 p-5 text-right">
              <div>
                <div className="text-xs text-emerald-400">Tebrikler!</div>
                <div className="font-semibold text-white">
                  En üst seviyeye ulaştın
                </div>
              </div>
              <span className="text-2xl">🏆</span>
            </div>
          )}
        </div>

        {/* All Levels for this language */}
        <div className="mt-8">
          <h2 className="mb-5 text-lg font-semibold text-white">
            {course.languageName} — Tüm Seviyeler
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {allCoursesForLanguage.map((c) => (
              <Link
                key={c.id}
                href={`/courses/${language}/${c.level}`}
                className={`rounded-2xl border p-4 text-sm transition ${
                  c.level === course.level
                    ? `${LEVEL_BADGE[c.level]} font-semibold`
                    : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                <div className="font-semibold">{c.level}</div>
                <div className="mt-0.5 text-xs opacity-80">{c.title}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
