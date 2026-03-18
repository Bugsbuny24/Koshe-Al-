"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LANGUAGES, STAGES } from "@/lib/constants/languages";
import { FACULTIES } from "@/lib/data/academic-catalog";
import type { AcademicProgram } from "@/lib/data/academic-catalog";

const GOALS = [
  { value: "conversation", label: "Günlük Konuşma" },
  { value: "business", label: "İş Dili" },
  { value: "travel", label: "Seyahat" },
  { value: "academic", label: "Akademik" },
  { value: "exam", label: "Sınav Hazırlığı" },
];

type Step = 1 | 2 | 3 | 4;

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const popularLanguages = useMemo(
    () => LANGUAGES.filter((item) => item.isPopular),
    []
  );

  const [step, setStep] = useState<Step>(1);
  const [bootLoading, setBootLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  // Step 1 — language
  const [nativeLanguage, setNativeLanguage] = useState("Turkish");
  const [targetLanguage, setTargetLanguage] = useState("English");
  const [level, setLevel] = useState("A1");

  // Step 2 — goal
  const [goal, setGoal] = useState("conversation");

  // Step 3 — faculty
  const [facultyCode, setFacultyCode] = useState("");

  // Step 4 — program
  const [programSlug, setProgramSlug] = useState("");

  const selectedFaculty = useMemo(
    () => FACULTIES.find((f) => f.code === facultyCode) ?? null,
    [facultyCode]
  );
  const availablePrograms: AcademicProgram[] = selectedFaculty?.programs ?? [];

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select(
          "native_language,target_language,difficulty_level,learning_stage,onboarding_completed"
        )
        .eq("id", user.id)
        .single();

      if (!mounted) return;

      if (error) {
        setErrorText(error.message);
        setBootLoading(false);
        return;
      }

      if (profile?.onboarding_completed) {
        router.push("/dashboard");
        return;
      }

      if (profile?.native_language) setNativeLanguage(profile.native_language);
      if (profile?.target_language) setTargetLanguage(profile.target_language);
      if (profile?.difficulty_level) setLevel(profile.difficulty_level);
      if (profile?.learning_stage) setGoal(profile.learning_stage);

      setBootLoading(false);
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [router, supabase]);

  function nextStep() {
    setErrorText("");
    if (step === 3 && !facultyCode) {
      setErrorText("Lütfen bir fakülte seçin.");
      return;
    }
    if (step < 4) setStep((s) => (s + 1) as Step);
  }

  function prevStep() {
    setErrorText("");
    if (step > 1) setStep((s) => (s - 1) as Step);
  }

  async function finishOnboarding() {
    setLoading(true);
    setErrorText("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErrorText("Kullanıcı bulunamadı.");
      setLoading(false);
      return;
    }

    const metadata = {
      faculty_id: facultyCode || null,
      program_id: programSlug || null,
    };

    const { error } = await supabase
      .from("profiles")
      .update({
        native_language: nativeLanguage,
        target_language: targetLanguage,
        difficulty_level: level,
        learning_stage: goal,
        onboarding_completed: true,
        metadata,
      })
      .eq("id", user.id);

    if (error) {
      setErrorText(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  if (bootLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-slate-300">
          Onboarding hazırlanıyor...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto max-w-2xl">
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="mb-8 rounded-[28px] border border-white/10 bg-gradient-to-r from-fuchsia-500/10 via-blue-500/10 to-cyan-500/10 p-6">
          <div className="text-sm uppercase tracking-[0.25em] text-cyan-300">
            Onboarding — Adım {step} / 4
          </div>
          <h1 className="mt-2 text-3xl font-semibold">Koshei AI seni tanısın</h1>
          <p className="mt-2 text-slate-300 text-sm">
            Tercihlerini belirle. AI öğretmenin buna göre çalışır.
          </p>

          {/* Progress bar */}
          <div className="mt-4 flex gap-1">
            {([1, 2, 3, 4] as const).map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-all ${
                  s <= step ? "bg-cyan-400" : "bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          {/* ── Step 1: Language ──────────────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold">Dil Seçimi</h2>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Ana Dilin</label>
                <select
                  value={nativeLanguage}
                  onChange={(e) => setNativeLanguage(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
                >
                  {LANGUAGES.map((language) => (
                    <option key={`native-${language.code}`} value={language.name}>
                      {language.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Öğrenmek İstediğin Dil
                </label>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
                >
                  {LANGUAGES.map((language) => (
                    <option key={`target-${language.code}`} value={language.name}>
                      {language.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Seviyen</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
                >
                  {STAGES.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="mb-2 text-xs text-slate-500">Popüler Diller</p>
                <div className="flex flex-wrap gap-2">
                  {popularLanguages.slice(0, 10).map((language) => (
                    <button
                      key={language.code}
                      type="button"
                      onClick={() => setTargetLanguage(language.name)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition ${
                        targetLanguage === language.name
                          ? "border-cyan-400/40 bg-cyan-500/20 text-cyan-300"
                          : "border-white/10 bg-black/20 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      {language.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Goal ──────────────────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold">Hedef Seçimi</h2>
              <p className="text-sm text-slate-400">
                Öğrenme amacın ne? AI öğretmenin buna göre dersleri şekillendirir.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {GOALS.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setGoal(item.value)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      goal === item.value
                        ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-300"
                        : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 3: Faculty ───────────────────────────────────────────── */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold">Fakülte Seçimi</h2>
              <p className="text-sm text-slate-400">
                Hangi fakültede okumak istiyorsun?
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {FACULTIES.map((f) => (
                  <button
                    key={f.code}
                    type="button"
                    onClick={() => {
                      setFacultyCode(f.code);
                      setProgramSlug("");
                    }}
                    className={`rounded-2xl border p-4 text-left transition ${
                      facultyCode === f.code
                        ? "border-cyan-400/40 bg-cyan-500/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-2xl">{f.icon}</span>
                    <div className="mt-2 font-medium text-white">{f.name}</div>
                    <p className="mt-1 text-xs text-slate-400">{f.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 4: Program ───────────────────────────────────────────── */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold">Program Seçimi</h2>
              {selectedFaculty ? (
                <p className="text-sm text-slate-400">
                  {selectedFaculty.name} fakültesindeki programlardan birini seç.
                </p>
              ) : (
                <p className="text-sm text-slate-400">
                  Program seçimi isteğe bağlıdır.
                </p>
              )}
              {availablePrograms.length > 0 && (
                <div className="grid gap-3">
                  {availablePrograms.map((prog) => (
                    <button
                      key={prog.slug}
                      type="button"
                      onClick={() => setProgramSlug(prog.slug)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        programSlug === prog.slug
                          ? "border-cyan-400/40 bg-cyan-500/10"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div className="font-medium text-white">{prog.title}</div>
                      <p className="mt-1 text-xs text-slate-400">
                        {prog.shortDescription}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-500">
                          {prog.durationLabel}
                        </span>
                        <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-500">
                          {prog.difficultyLabel}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <p className="text-xs text-slate-500">
                Program seçmeden de devam edebilirsin, sonradan değiştirebilirsin.
              </p>
            </div>
          )}

          {/* ── Errors ───────────────────────────────────────────────────── */}
          {errorText && (
            <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
              {errorText}
            </div>
          )}

          {/* ── Navigation ───────────────────────────────────────────────── */}
          <div className="mt-8 flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-300 transition hover:bg-white/10"
              >
                ← Geri
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Devam →
              </button>
            ) : (
              <button
                type="button"
                onClick={finishOnboarding}
                disabled={loading}
                className="flex-1 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Kaydediliyor..." : "Onboarding'i Tamamla"}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
