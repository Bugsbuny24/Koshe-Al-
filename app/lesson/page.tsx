import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LessonClient from "./lesson-client";
import { DEPARTMENTS } from "@/lib/data/curriculum";
import { getUserCredits } from "@/lib/credits/credit-service";
import { buildCreditWarningState } from "@/lib/credits/credit-helpers";

export default async function LessonPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: profile }, { data: enrollment }] = await Promise.all([
    supabase
      .from("profiles")
      .select("target_language,difficulty_level")
      .eq("id", user.id)
      .single(),
    supabase
      .from("course_enrollments")
      .select("language_code,level,course_id,progress_percent,completed_units_count,total_units_count")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  // If no active enrollment, prompt the user to enroll in a course first
  if (!enrollment) {
    return (
      <main className="min-h-screen px-4 py-16 text-white sm:px-6">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-5xl mb-4">📚</p>
          <h1 className="text-2xl font-bold">Önce bir programa kayıt ol</h1>
          <p className="mt-3 text-slate-400">
            Ders başlatmak için aktif bir kursa kayıtlı olman gerekiyor. Bir
            programa katıl ve dersler otomatik açılsın.
          </p>
          <Link
            href="/courses"
            className="mt-6 inline-flex rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(34,211,238,0.35)] transition hover:opacity-90"
          >
            Programlara Göz At →
          </Link>
        </div>
      </main>
    );
  }

  // Prefer enrolled course data; fall back to profile
  const targetLanguage =
    DEPARTMENTS.find((d) => d.code === enrollment.language_code)?.name ??
    profile?.target_language ??
    "English";
  const level = enrollment.level ?? profile?.difficulty_level ?? "A1";
  const langCode = enrollment.language_code;
  const lessonCourseId = enrollment.course_id;

  // Find next uncompleted unit
  const dept = DEPARTMENTS.find((d) => d.code === langCode);
  const currentLevel = dept?.levels.find((l) => l.level === level);

  const { data: completedUnits, error: progressError } = await supabase
    .from("unit_progress")
    .select("unit_id")
    .eq("user_id", user.id)
    .eq("course_id", lessonCourseId)
    .eq("completed", true);

  if (progressError) {
    return (
      <main className="min-h-screen px-4 py-16 text-white sm:px-6">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-5xl mb-4">⚠️</p>
          <h1 className="text-2xl font-bold">İlerleme yüklenemedi</h1>
          <p className="mt-3 text-slate-400">
            Ders bilgisi alınırken bir sorun oluştu. Lütfen daha sonra tekrar dene.
          </p>
          <Link href="/dashboard" className="mt-6 inline-block rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-slate-300 hover:bg-white/10">
            ← Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const completedIds = new Set(
    (completedUnits ?? []).map((u: { unit_id: string }) => u.unit_id)
  );

  const nextUnit = currentLevel?.units.find((u) => !completedIds.has(u.id));

  const lessonCreditCost = 1;
  const creditState = await getUserCredits(user.id);
  const canGenerateLesson =
    creditState.exists && creditState.isActive && creditState.credits >= lessonCreditCost;
  const creditWarningState = buildCreditWarningState(creditState.credits);

  return (
    <LessonClient
      targetLanguage={targetLanguage}
      level={level}
      languageCode={langCode}
      canGenerateLesson={canGenerateLesson}
      creditWarningState={creditWarningState}
      currentCredits={creditState.credits}
      lessonCreditCost={lessonCreditCost}
      unitId={nextUnit?.id}
      courseId={lessonCourseId}
      unitTitle={nextUnit?.title}
      completedCount={completedIds.size}
      totalUnits={currentLevel?.units.length ?? 0}
    />
  );
}

