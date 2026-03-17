import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCoursesByLanguage,
  type Course,
} from "@/lib/constants/curriculum";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ language: string }>;
}) {
  const { language } = await params;
  const courses = getCoursesByLanguage(language);
  if (!courses.length) return { title: "Bulunamadı" };
  return {
    title: `${courses[0].languageName} Bölümü | Yabancı Dil Üniversitesi`,
    description: `${courses[0].languageName} dili için A1'den C2'ye yapılandırılmış kurslar`,
  };
}

export default async function LanguageDepartmentPage({
  params,
}: {
  params: Promise<{ language: string }>;
}) {
  const { language } = await params;
  const courses = getCoursesByLanguage(language);

  if (!courses.length) {
    notFound();
  }

  const { languageName, flag } = courses[0];
  const totalHours = courses.reduce((sum, c) => sum + c.totalHours, 0);
  const totalUnits = courses.reduce((sum, c) => sum + c.units.length, 0);

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-400">
          <Link href="/courses" className="hover:text-white transition-colors">
            Kurslar
          </Link>
          <span>/</span>
          <span className="text-white">{languageName}</span>
        </nav>

        {/* Department Header */}
        <div className="mb-10 rounded-[28px] border border-white/10 bg-gradient-to-r from-white/5 to-white/[0.02] p-6 sm:p-8">
          <div className="flex items-start gap-5">
            <span className="text-6xl">{flag}</span>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">
                Yabancı Dil Üniversitesi
              </p>
              <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
                {languageName} Bölümü
              </h1>
              <p className="mt-3 max-w-2xl text-slate-300">
                A1 başlangıç seviyesinden C2 ustalık seviyesine kadar{" "}
                {courses.length} kurs ile {languageName} dilini sistematik
                olarak öğren.
              </p>

              <div className="mt-5 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-cyan-300">📚</span>
                  <span>{courses.length} Kurs Seviyesi</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-fuchsia-300">🎯</span>
                  <span>{totalUnits} Ünite</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-blue-300">⏱️</span>
                  <span>~{totalHours} Saat İçerik</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-emerald-300">🤖</span>
                  <span>AI Konuşma Pratiği</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {courses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 rounded-[28px] border border-white/10 bg-gradient-to-r from-fuchsia-500/10 to-violet-500/10 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-white">
            AI Öğretmenle Pratik Yap
          </h2>
          <p className="mt-2 text-slate-300">
            Kurs materyallerini inceleyin, ardından AI konuşma pratiği ile
            öğrendiklerinizi pekiştirin.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/live"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              🎤 Konuşma Pratiği Başlat
            </Link>
            <Link
              href="/lesson"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10"
            >
              📖 Günlük Derse Git
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function CourseCard({
  course,
  index,
}: {
  course: Course;
  index: number;
}) {
  return (
    <div
      className={`rounded-[28px] border bg-gradient-to-br ${LEVEL_COLORS[course.level]} p-6 backdrop-blur-xl`}
    >
      {/* Course Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${LEVEL_BADGE[course.level]}`}
          >
            {course.level}
          </span>
          <h3 className="mt-3 text-xl font-semibold text-white">
            {course.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {course.description}
          </p>
        </div>
        <div className="shrink-0 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-center">
          <div className="text-lg font-bold text-white">{index + 1}</div>
          <div className="text-xs text-slate-400">Seviye</div>
        </div>
      </div>

      {/* Prerequisites */}
      {course.prerequisites && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-2">
          <span className="text-xs text-slate-400">Ön Koşul:</span>
          <span className="text-xs text-white">{course.prerequisites}</span>
        </div>
      )}

      {/* Units */}
      <div className="mt-5">
        <div className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-400">
          Üniteler ({course.units.length})
        </div>
        <div className="space-y-2">
          {course.units.map((unit, uIndex) => (
            <div
              key={unit.id}
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs text-slate-400">
                    {uIndex + 1}
                  </span>
                  <span className="text-sm font-medium text-white">
                    {unit.title}
                  </span>
                </div>
                <span className="shrink-0 text-xs text-slate-400">
                  {unit.estimatedHours}s
                </span>
              </div>
              <div className="mt-2 ml-9 flex flex-wrap gap-1.5">
                {unit.topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-300"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between">
        <div className="text-sm text-slate-400">
          ~{course.totalHours} saat içerik
        </div>
        <Link
          href={`/courses/${course.languageCode}/${course.level}`}
          className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
        >
          Kurs Detayı →
        </Link>
      </div>
    </div>
  );
}
