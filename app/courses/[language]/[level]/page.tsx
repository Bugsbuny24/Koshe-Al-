import Link from "next/link";
import { notFound } from "next/navigation";
import { getProgram, getSemester } from "@/lib/constants/curriculum";

const YEAR_BADGE: Record<number, string> = {
  1: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  2: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  3: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  4: "bg-orange-500/15 text-orange-300 border-orange-500/30",
};

const YEAR_GRADIENT: Record<number, string> = {
  1: "from-emerald-500/20 to-teal-500/5 border-emerald-500/30",
  2: "from-blue-500/20 to-indigo-500/5 border-blue-500/30",
  3: "from-violet-500/20 to-purple-500/5 border-violet-500/30",
  4: "from-orange-500/20 to-amber-500/5 border-orange-500/30",
};

const ALL_SLUGS = ["y1s1","y1s2","y2s1","y2s2","y3s1","y3s2","y4s1","y4s2"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ language: string; level: string }>;
}) {
  const { language, level } = await params;
  const sem = getSemester(language, level);
  if (!sem) return { title: "Bulunamadı" };
  const program = getProgram(language);
  return {
    title: `${program?.programTitle} — ${sem.label} | Yabancı Dil Üniversitesi`,
    description: `${sem.subjects.length} ders, ${sem.totalCredits} AKTS`,
  };
}

export default async function SemesterDetailPage({
  params,
}: {
  params: Promise<{ language: string; level: string }>;
}) {
  const { language, level } = await params;
  const sem = getSemester(language, level);
  const program = getProgram(language);

  if (!sem || !program) notFound();

  const currentIdx = ALL_SLUGS.indexOf(level);
  const prevSlug = currentIdx > 0 ? ALL_SLUGS[currentIdx - 1] : null;
  const nextSlug = currentIdx < ALL_SLUGS.length - 1 ? ALL_SLUGS[currentIdx + 1] : null;
  const prevSem = prevSlug ? getSemester(language, prevSlug) : null;
  const nextSem = nextSlug ? getSemester(language, nextSlug) : null;

  const zorunlu = sem.subjects.filter((c) => c.type === "zorunlu");
  const secmeli = sem.subjects.filter((c) => c.type === "seçmeli");

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">

        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <Link href="/courses" className="hover:text-white transition-colors">Fakülte</Link>
          <span>/</span>
          <Link href={`/courses/${language}`} className="hover:text-white transition-colors">
            {program.programTitle}
          </Link>
          <span>/</span>
          <span className="text-white">{sem.label}</span>
        </nav>

        {/* Semester Header */}
        <div className={`mb-8 rounded-[28px] border bg-gradient-to-br ${YEAR_GRADIENT[sem.year]} p-6 sm:p-8`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{program.flag}</span>
                <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${YEAR_BADGE[sem.year]}`}>
                  {sem.year}. Yıl
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                  {sem.semester}. Yarıyıl
                </span>
              </div>
              <h1 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
                {program.programTitle}
              </h1>
              <p className="mt-1 text-slate-300">{sem.label}</p>
            </div>
          </div>

          {/* Semester Stats */}
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-2">
              <span>📚</span>
              <span className="text-slate-200">{sem.subjects.length} Ders</span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-2">
              <span>🏛️</span>
              <span className="text-slate-200">{sem.totalCredits} AKTS</span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
              <span>✅</span>
              <span className="text-emerald-300">{zorunlu.length} Zorunlu</span>
            </div>
            {secmeli.length > 0 && (
              <div className="flex items-center gap-2 rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/10 px-4 py-2">
                <span>⭐</span>
                <span className="text-fuchsia-300">{secmeli.length} Seçmeli</span>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/live" className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90">
              🎤 AI ile Konuşma Pratiği Yap
            </Link>
            <Link href="/lesson" className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10">
              📖 Günlük Derse Git
            </Link>
          </div>
        </div>

        {/* Zorunlu Dersler */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Zorunlu Dersler
            <span className="ml-2 text-sm font-normal text-slate-400">({zorunlu.length} ders)</span>
          </h2>
          <div className="space-y-4">
            {zorunlu.map((subj, idx) => (
              <div
                key={subj.code}
                className="rounded-[20px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-sm font-bold text-white">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-xs text-emerald-300">
                          {subj.code}
                        </span>
                        <h3 className="mt-2 font-semibold text-white">{subj.title}</h3>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1 text-xs text-slate-400">
                        <span>{subj.credits} AKTS</span>
                        <span>{subj.weeklyHours} saat/hafta</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{subj.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {subj.topics.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seçmeli Dersler */}
        {secmeli.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Seçmeli Dersler
              <span className="ml-2 text-sm font-normal text-slate-400">({secmeli.length} seçenek)</span>
            </h2>
            <div className="space-y-4">
              {secmeli.map((subj, idx) => (
                <div
                  key={subj.code}
                  className="rounded-[20px] border border-fuchsia-500/20 bg-fuchsia-500/5 p-5 backdrop-blur-xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/10 text-sm font-bold text-fuchsia-300">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded border border-fuchsia-500/30 bg-fuchsia-500/10 px-2 py-0.5 font-mono text-xs text-fuchsia-300">
                              {subj.code}
                            </span>
                            <span className="rounded-full bg-fuchsia-500/15 px-2 py-0.5 text-xs text-fuchsia-300">
                              seçmeli
                            </span>
                          </div>
                          <h3 className="mt-2 font-semibold text-white">{subj.title}</h3>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1 text-xs text-slate-400">
                          <span>{subj.credits} AKTS</span>
                          <span>{subj.weeklyHours} saat/hafta</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{subj.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {subj.topics.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-fuchsia-500/15 bg-black/20 px-3 py-1 text-xs text-slate-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prev / Next Semester Navigation */}
        <div className="grid gap-4 sm:grid-cols-2">
          {prevSem ? (
            <Link
              href={`/courses/${language}/${prevSem.slug}`}
              className="group flex items-center gap-4 rounded-[20px] border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/10"
            >
              <span className="text-2xl">←</span>
              <div>
                <div className="text-xs text-slate-400">Önceki Yarıyıl</div>
                <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  {prevSem.label}
                </div>
              </div>
            </Link>
          ) : <div />}

          {nextSem ? (
            <Link
              href={`/courses/${language}/${nextSem.slug}`}
              className="group flex items-center justify-end gap-4 rounded-[20px] border border-white/10 bg-white/5 p-5 text-right transition hover:border-white/20 hover:bg-white/10"
            >
              <div>
                <div className="text-xs text-slate-400">Sonraki Yarıyıl</div>
                <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  {nextSem.label}
                </div>
              </div>
              <span className="text-2xl">→</span>
            </Link>
          ) : (
            <div className="flex items-center justify-end gap-4 rounded-[20px] border border-emerald-500/20 bg-emerald-500/10 p-5 text-right">
              <div>
                <div className="text-xs text-emerald-400">Tebrikler!</div>
                <div className="font-semibold text-white">Programı tamamladın</div>
              </div>
              <span className="text-2xl">🏆</span>
            </div>
          )}
        </div>

        {/* All Semesters Quick Nav */}
        <div className="mt-8">
          <h2 className="mb-4 text-base font-semibold text-white">Tüm Yarıyıllar</h2>
          <div className="grid gap-2 sm:grid-cols-4">
            {program.semesters.map((s) => (
              <Link
                key={s.slug}
                href={`/courses/${language}/${s.slug}`}
                className={`rounded-2xl border p-3 text-sm transition ${
                  s.slug === level
                    ? `${YEAR_BADGE[s.year]} font-semibold`
                    : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                <div className="font-semibold">{s.year}. Yıl / {s.semester}. YY</div>
                <div className="mt-0.5 text-xs opacity-70">{s.subjects.length} ders · {s.totalCredits} AKTS</div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
