import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDepartment, getCourseId } from "@/lib/data/curriculum";
import { EnrollButton, RewardCard } from "./CourseActions";

interface Props {
  params: Promise<{ language: string; level: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { language, level } = await params;
  const dept = getDepartment(language);
  const courseLevel = dept?.levels.find((l) => l.level === level);
  return {
    title: courseLevel
      ? `${dept!.name} ${level} — ${courseLevel.title} | Koshei AI`
      : "Kurs Bulunamadı",
  };
}

export default async function CourseLevelPage({ params }: Props) {
  const { language, level } = await params;

  const dept = getDepartment(language);
  if (!dept) notFound();

  const courseLevel = dept.levels.find((l) => l.level === level);
  if (!courseLevel) notFound();

  const courseId = getCourseId(language, level);

  // Fetch enrollment status (optional — user might not be logged in)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let enrollment: {
    progress_percent: number | null;
    status: string | null;
    completed_units_count: number | null;
  } | null = null;

  if (user) {
    const { data } = await supabase
      .from("course_enrollments")
      .select("progress_percent,status,completed_units_count")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .maybeSingle();
    enrollment = data;
  }

  const isEnrolled = !!enrollment;
  const progress = enrollment?.progress_percent ?? 0;

  const levelIdx = dept.levels.findIndex((l) => l.level === level);
  const prevLevel = levelIdx > 0 ? dept.levels[levelIdx - 1] : null;
  const nextLevel = levelIdx < dept.levels.length - 1 ? dept.levels[levelIdx + 1] : null;

  return (
    <main className="min-h-screen px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-400">
          <Link href="/courses" className="hover:text-white transition-colors">Kurslar</Link>
          <span>/</span>
          <Link href={`/courses/${language}`} className="hover:text-white transition-colors">{dept.name}</Link>
          <span>/</span>
          <span className="text-white">{level}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Left column — content */}
          <div>
            {/* Course header */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{dept.icon}</span>
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">
                    {dept.name} • {level}
                  </div>
                  <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                    {courseLevel.title}
                  </h1>
                </div>
              </div>
              <p className="mt-4 text-slate-300">{courseLevel.description}</p>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-center">
                  <div className="text-xl font-bold text-white">{courseLevel.units.length}</div>
                  <div className="mt-1 text-xs text-slate-500">Unit</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-center">
                  <div className="text-xl font-bold text-white">AI</div>
                  <div className="mt-1 text-xs text-slate-500">Öğretmen</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-center">
                  <div className="text-xl font-bold text-white">3</div>
                  <div className="mt-1 text-xs text-slate-500">Ödül</div>
                </div>
              </div>
            </div>

            {/* Unit list */}
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold">Müfredat</h2>
              <div className="mt-4 space-y-3">
                {courseLevel.units.map((unit, i) => {
                  const isDone =
                    isEnrolled &&
                    (enrollment?.completed_units_count ?? 0) > i;

                  return (
                    <div
                      key={unit.id}
                      className={`flex items-start gap-4 rounded-2xl border p-4 transition-colors ${
                        isDone
                          ? "border-cyan-400/20 bg-cyan-400/8"
                          : "border-white/10 bg-black/10"
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          isDone
                            ? "bg-cyan-500 text-white"
                            : "bg-white/10 text-slate-400"
                        }`}
                      >
                        {isDone ? "✓" : unit.order}
                      </div>
                      <div>
                        <div className="font-medium text-white">{unit.title}</div>
                        <div className="mt-1 text-sm text-slate-400">
                          {unit.description}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {unit.topics.map((t) => (
                            <span
                              key={t}
                              className="rounded-lg bg-white/5 px-2 py-0.5 text-xs text-slate-400"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation between levels */}
            <div className="mt-6 flex gap-4">
              {prevLevel && (
                <Link
                  href={`/courses/${language}/${prevLevel.level}`}
                  className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-sm text-slate-400 transition hover:bg-white/8 hover:text-white"
                >
                  ← {prevLevel.title} ({prevLevel.level})
                </Link>
              )}
              {nextLevel && (
                <Link
                  href={`/courses/${language}/${nextLevel.level}`}
                  className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-sm text-slate-400 transition hover:bg-white/8 hover:text-white"
                >
                  {nextLevel.title} ({nextLevel.level}) →
                </Link>
              )}
            </div>
          </div>

          {/* Right column — enrollment + rewards */}
          <div className="space-y-5">
            {/* Enrollment card */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold">
                {isEnrolled ? "Kurs İlerlemen" : "Kursa Başla"}
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                {isEnrolled
                  ? "AI öğretmeninle pratik yaparak unit'leri tamamla."
                  : "Kayıt ol, rozet ve sertifika kazan."}
              </p>
              <div className="mt-5">
                {user ? (
                  <EnrollButton
                    dept={dept}
                    courseLevel={courseLevel}
                    isEnrolled={isEnrolled}
                    progress={progress}
                  />
                ) : (
                  <Link
                    href="/login"
                    className="block w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-[0_0_30px_rgba(34,211,238,0.35)] transition hover:opacity-90"
                  >
                    Giriş Yap & Başla
                  </Link>
                )}
              </div>
            </div>

            {/* Rewards card */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h3 className="mb-4 text-lg font-semibold">Bu Kursun Ödülleri</h3>
              <div className="grid grid-cols-2 gap-3">
                <RewardCard
                  imageUrl={courseLevel.badgeImageUrl}
                  label="Rozet"
                  sublabel={`${level} Badge`}
                />
                {courseLevel.certificateImageUrl ? (
                  <RewardCard
                    imageUrl={courseLevel.certificateImageUrl}
                    label="Sertifika"
                    sublabel={`${level} Certificate`}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 rounded-2xl border border-white/5 bg-black/10 p-4 opacity-40">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-white/10 text-2xl">
                      🎓
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-semibold text-white">Sertifika</div>
                      <div className="mt-0.5 text-xs text-slate-500">B1+ gerekli</div>
                    </div>
                  </div>
                )}
                <RewardCard
                  imageUrl="/rewards/reward-placeholder.svg"
                  label="NFT Koleksiyonel"
                  sublabel="Dijital varlık"
                />
              </div>
              <p className="mt-4 text-xs text-slate-500">
                Kursu %100 tamamlayınca tüm ödüller otomatik verilir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
