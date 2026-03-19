"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LANGUAGES, STAGES } from "@/lib/constants/languages";
import { FACULTIES } from "@/lib/data/academic-catalog";
import type { AcademicProgram } from "@/lib/data/academic-catalog";

const GOALS = [
  { value: "conversation", label: "Günlük Konuşma", icon: "💬" },
  { value: "business", label: "İş Dili", icon: "💼" },
  { value: "travel", label: "Seyahat", icon: "✈️" },
  { value: "academic", label: "Akademik", icon: "🎓" },
  { value: "exam", label: "Sınav Hazırlığı", icon: "📝" },
];

type Step = 1 | 2 | 3 | 4;

export default function OnboardingPage() {
  const supabase = createClient();

  const popularLanguages = useMemo(() => LANGUAGES.filter((item) => item.isPopular), []);

  const [step, setStep] = useState<Step>(1);
  const [bootLoading, setBootLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const [nativeLanguage, setNativeLanguage] = useState("Turkish");
  const [targetLanguage, setTargetLanguage] = useState("English");
  const [level, setLevel] = useState("A1");
  const [goal, setGoal] = useState("conversation");
  const [facultyCode, setFacultyCode] = useState("");
  const [programSlug, setProgramSlug] = useState("");

  const selectedFaculty = useMemo(
    () => FACULTIES.find((f) => f.code === facultyCode) ?? null,
    [facultyCode]
  );
  const availablePrograms: AcademicProgram[] = selectedFaculty?.programs ?? [];

  useEffect(() => {
    async function bootstrap() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("native_language,target_language,difficulty_level,learning_stage,onboarding_completed")
        .eq("id", user.id)
        .single();

      if (profile?.onboarding_completed) {
        window.location.href = "/dashboard";
        return;
      }

      if (profile?.native_language) setNativeLanguage(profile.native_language);
      if (profile?.target_language) setTargetLanguage(profile.target_language);
      if (profile?.difficulty_level) setLevel(profile.difficulty_level);
      if (profile?.learning_stage) setGoal(profile.learning_stage);

      setBootLoading(false);
    }

    bootstrap();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleFinish() {
    setLoading(true);
    setErrorText("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        native_language: nativeLanguage,
        target_language: targetLanguage,
        difficulty_level: level,
        learning_stage: goal,
        onboarding_completed: true,
      })
      .eq("id", user.id);

    if (error) {
      setErrorText(error.message);
      setLoading(false);
      return;
    }

    // Program seçildiyse kayıt ol
    if (programSlug) {
      const dept = FACULTIES.flatMap((f) => f.programs).find((p) => p.slug === programSlug);
      if (dept) {
        const firstCourse = dept.courses[0];
        if (firstCourse) {
          await supabase.from("course_enrollments").upsert(
            {
              user_id: user.id,
              course_id: firstCourse.id,
              language_code: targetLanguage.slice(0, 2).toLowerCase(),
              level: level,
              progress_percent: 0,
              completed_units_count: 0,
              total_units_count: firstCourse.units.length,
              status: "active",
            },
            { onConflict: "user_id,course_id" }
          );
        }
      }
    }

    window.location.href = "/dashboard";
  }

  if (bootLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050816]">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/30 to-fuchsia-500/30">
            <span className="text-lg font-bold text-white animate-pulse">K</span>
          </div>
          <p className="text-sm text-slate-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const stepTitles: Record<Step, string> = {
    1: "Dil Seçimi",
    2: "Öğrenme Hedefin",
    3: "Fakülte Seç",
    4: "Program Seç",
  };

  return (
    <main className="min-h-screen bg-[#050816] px-4 py-12 text-white">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="text-xs uppercase tracking-[0.35em] text-cyan-300 mb-3">Koshei AI University</div>
          <h1 className="text-3xl font-bold">Profilini Oluştur</h1>
          <p className="mt-2 text-slate-400 text-sm">
            Adım {step} / 4 — {stepTitles[step]}
          </p>
          {/* Progress bar */}
          <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 transition-all duration-500"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1 — Dil seçimi */}
        {step === 1 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-xl font-semibold mb-6">Hangi dili öğrenmek istiyorsun?</h2>

            <div className="mb-6">
              <label className="text-sm text-slate-400 mb-2 block">Ana dilin</label>
              <select
                value={nativeLanguage}
                onChange={(e) => setNativeLanguage(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-cyan-400/40"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="text-sm text-slate-400 mb-3 block">Öğrenmek istediğin dil</label>
              <div className="grid gap-2 sm:grid-cols-2">
                {popularLanguages.map((lang) => (
                  <button
                    key={lang.value}
                    type="button"
                    onClick={() => setTargetLanguage(lang.value)}
                    className={[
                      "flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition",
                      targetLanguage === lang.value
                        ? "border-cyan-400/40 bg-cyan-400/10 text-white"
                        : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/8",
                    ].join(" ")}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="text-sm text-slate-400 mb-3 block">Seviyeni seç</label>
              <div className="flex flex-wrap gap-2">
                {(STAGES as { value: string; label: string }[]).map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setLevel(s.value)}
                    className={[
                      "rounded-xl border px-4 py-2 text-sm font-medium transition",
                      level === s.value
                        ? "border-fuchsia-400/40 bg-fuchsia-400/15 text-fuchsia-300"
                        : "border-white/10 bg-white/5 text-slate-400 hover:text-white",
                    ].join(" ")}
                  >
                    {s.value}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!targetLanguage}
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
            >
              Devam →
            </button>
          </div>
        )}

        {/* Step 2 — Hedef */}
        {step === 2 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-xl font-semibold mb-6">Ne için öğreniyorsun?</h2>
            <div className="space-y-3 mb-8">
              {GOALS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setGoal(g.value)}
                  className={[
                    "flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition",
                    goal === g.value
                      ? "border-fuchsia-400/40 bg-fuchsia-400/10 text-white"
                      : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/8",
                  ].join(" ")}
                >
                  <span className="text-2xl">{g.icon}</span>
                  <span className="font-medium">{g.label}</span>
                  {goal === g.value && <span className="ml-auto text-fuchsia-400">✓</span>}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-3.5 text-sm font-medium text-slate-300 transition hover:bg-white/10"
              >
                ← Geri
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Devam →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Fakülte */}
        {step === 3 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-xl font-semibold mb-2">Fakülte Seç</h2>
            <p className="text-sm text-slate-400 mb-6">İstersen atlayabilirsin, daha sonra da seçebilirsin.</p>
            <div className="grid gap-3 sm:grid-cols-2 mb-8">
              {FACULTIES.map((f) => (
                <button
                  key={f.code}
                  type="button"
                  onClick={() => setFacultyCode(f.code)}
                  className={[
                    "flex items-start gap-3 rounded-2xl border p-4 text-left transition",
                    facultyCode === f.code
                      ? "border-cyan-400/40 bg-cyan-400/10"
                      : "border-white/10 bg-white/5 hover:bg-white/8",
                  ].join(" ")}
                >
                  <span className="text-2xl mt-0.5">{f.icon}</span>
                  <div>
                    <div className="text-sm font-medium text-white">{f.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{f.programs.length} program</div>
                  </div>
                  {facultyCode === f.code && <span className="ml-auto text-cyan-400 text-sm">✓</span>}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-3.5 text-sm font-medium text-slate-300 transition hover:bg-white/10">
                ← Geri
              </button>
              <button
                onClick={() => facultyCode ? setStep(4) : handleFinish()}
                className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {facultyCode ? "Devam →" : "Atla ve Başla"}
              </button>
            </div>
          </div>
        )}

        {/* Step 4 — Program */}
        {step === 4 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-xl font-semibold mb-2">Program Seç</h2>
            <p className="text-sm text-slate-400 mb-6">{selectedFaculty?.name} fakültesindeki programlar</p>
            <div className="space-y-3 mb-8">
              {availablePrograms.map((p) => (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => setProgramSlug(p.slug)}
                  className={[
                    "flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition",
                    programSlug === p.slug
                      ? "border-fuchsia-400/40 bg-fuchsia-400/10"
                      : "border-white/10 bg-white/5 hover:bg-white/8",
                  ].join(" ")}
                >
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">{p.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{p.durationLabel} · {p.difficultyLabel}</div>
                    <div className="text-xs text-slate-400 mt-1">{p.shortDescription}</div>
                  </div>
                  {programSlug === p.slug && <span className="text-fuchsia-400">✓</span>}
                </button>
              ))}
            </div>

            {errorText && (
              <div className="mb-4 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {errorText}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-3.5 text-sm font-medium text-slate-300 transition hover:bg-white/10">
                ← Geri
              </button>
              <button
                onClick={handleFinish}
                disabled={loading}
                className="flex-1 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Kaydediliyor..." : "🚀 Başla!"}
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
