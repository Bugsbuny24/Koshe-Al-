import Link from "next/link";
import { notFound } from "next/navigation";
import { getProgram, type ProgramSemester } from "@/lib/constants/curriculum";

const YEAR_COLORS: Record<number, string> = {
  1: "from-emerald-500/15 to-teal-500/5 border-emerald-500/25",
  2: "from-blue-500/15 to-indigo-500/5 border-blue-500/25",
  3: "from-violet-500/15 to-purple-500/5 border-violet-500/25",
  4: "from-orange-500/15 to-amber-500/5 border-orange-500/25",
};

const YEAR_BADGE: Record<number, string> = {
  1: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  2: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  3: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  4: "bg-orange-500/15 text-orange-300 border-orange-500/30",
};

const YEAR_LABELS: Record<number, string> = {
  1: "Birinci Sınıf",
  2: "İkinci Sınıf",
  3: "Üçüncü Sınıf",
  4: "Dördüncü Sınıf",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ language: string }>;
}) {
  const { language } = await params;
  const program = getProgram(language);
  if (!program) return { title: "Bulunamadı" };
  return {
    title: `${program.programTitle} | Yabancı Dil Üniversitesi`,
    description: program.description,
  };
}

export default async function LanguageDepartmentPage({
  params,
}: {
  params: Promise<{ language: string }>;
}) {
  const { language } = await params;
  const program = getProgram(language);

  if (!program) notFound();

  const years = [1, 2, 3, 4] as const;
  const totalZorunlu = program.semesters.reduce(
    (sum, s) => sum + s.subjects.filter((c) => c.type === "zorunlu").length,
    0
  );
  const totalSecmeli = program.semesters.reduce(
    (sum, s) => sum + s.subjects.filter((c) => c.type === "seçmeli").length,
    0
  );

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">

        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <Link href="/courses" className="hover:text-white transition-colors">Fakülte</Link>
          <span>/</span>
          <span className="text-white">{program.programTitle}</span>
        </nav>

        {/* Department Header */}
        <div className="mb-10 rounded-[28px] border border-white/10 bg-gradient-to-r from-white/5 to-white/[0.02] p-6 sm:p-8">
          <div className="flex items-start gap-5">
            <span className="text-6xl">{program.flag}</span>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">
                Yabancı Dil Üniversitesi
              </p>
              <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
                {program.programTitle}
              </h1>
              <p className="mt-1 text-sm text-slate-400">{program.department}</p>
              <p className="mt-3 max-w-2xl text-slate-300">{program.description}</p>

              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-2">
                  <span>🎓</span>
                  <span className="text-slate-200">{program.duration}</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-2">
                  <span>📚</span>
                  <span className="text-slate-200">{program.semesters.reduce((s, sem) => s + sem.subjects.length, 0)} Ders</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
                  <span>✅</span>
                  <span className="text-emerald-300">{totalZorunlu} Zorunlu</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/10 px-4 py-2">
                  <span>⭐</span>
                  <span className="text-fuchsia-300">{totalSecmeli} Seçmeli</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-2">
                  <span>🏛️</span>
                  <span className="text-slate-200">~{program.semesters.reduce((s, sem) => s + sem.totalCredits, 0)} AKTS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Year-by-Year Curriculum */}
        <div className="space-y-10">
          {years.map((year) => {
            const yearSemesters = program.semesters.filter((s) => s.year === year);
            if (!yearSemesters.length) return null;
            const yearCredits = yearSemesters.reduce((s, sem) => s + sem.totalCredits, 0);
            const yearSubjects = yearSemesters.reduce((s, sem) => s + sem.subjects.length, 0);

            return (
              <div key={year}>
                {/* Year Header */}
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className={`inline-flex rounded-full border px-4 py-1 text-sm font-semibold ${YEAR_BADGE[year]}`}>
                    {year}. Yıl
                  </span>
                  <h2 className="text-xl font-semibold text-white">{YEAR_LABELS[year]}</h2>
                  <span className="text-sm text-slate-400">— {yearSubjects} ders, ~{yearCredits} AKTS</span>
                </div>

                {/* Two Semesters Side by Side */}
                <div className="grid gap-6 lg:grid-cols-2">
                  {yearSemesters.map((sem) => (
                    <SemesterCard
                      key={sem.slug}
                      sem={sem}
                      language={language}
                      yearColor={YEAR_COLORS[year]}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-[28px] border border-white/10 bg-gradient-to-r from-fuchsia-500/10 to-violet-500/10 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-white">AI Öğretmenle Pratik Yap</h2>
          <p className="mt-2 text-slate-300">Ders materyallerini inceleyin, ardından AI konuşma pratiği ile öğrendiklerinizi pekiştirin.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/live" className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90">
              🎤 Konuşma Pratiği Başlat
            </Link>
            <Link href="/lesson" className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10">
              📖 Günlük Derse Git
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}

function SemesterCard({
  sem,
  language,
  yearColor,
}: {
  sem: ProgramSemester;
  language: string;
  yearColor: string;
}) {
  const zorunlu = sem.subjects.filter((c) => c.type === "zorunlu");
  const secmeli = sem.subjects.filter((c) => c.type === "seçmeli");

  return (
    <div className={`rounded-[24px] border bg-gradient-to-br ${yearColor} p-5 backdrop-blur-xl`}>
      {/* Semester Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
            {sem.semester}. Yarıyıl
          </div>
          <h3 className="mt-0.5 font-semibold text-white">{sem.label}</h3>
        </div>
        <div className="shrink-0 rounded-2xl border border-white/10 bg-black/20 px-3 py-1.5 text-center">
          <div className="text-base font-bold text-white">{sem.totalCredits}</div>
          <div className="text-xs text-slate-400">AKTS</div>
        </div>
      </div>

      {/* Zorunlu Dersler */}
      <div className="space-y-2">
        {zorunlu.map((subj) => (
          <div key={subj.code} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-xs font-mono text-emerald-300">
                  {subj.code}
                </span>
                <span className="text-sm text-white">{subj.title}</span>
              </div>
              <span className="shrink-0 text-xs text-slate-400">{subj.credits} AKTS</span>
            </div>
          </div>
        ))}

        {secmeli.map((subj) => (
          <div key={subj.code} className="rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/5 px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 rounded border border-fuchsia-500/30 bg-fuchsia-500/10 px-1.5 py-0.5 text-xs font-mono text-fuchsia-300">
                  {subj.code}
                </span>
                <span className="text-sm text-white">{subj.title}</span>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-xs text-slate-400">{subj.credits} AKTS</span>
                <span className="rounded-full bg-fuchsia-500/15 px-1.5 py-0.5 text-xs text-fuchsia-300">seçmeli</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detay Linki */}
      <Link
        href={`/courses/${language}/${sem.slug}`}
        className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white transition hover:bg-white/10"
      >
        <span>Yarıyıl Detayı</span>
        <span>→</span>
      </Link>
    </div>
  );
}
