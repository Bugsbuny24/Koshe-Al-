"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LANGUAGES, STAGES } from "@/lib/constants/languages";

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [nativeLanguage, setNativeLanguage] = useState("Turkish");
  const [targetLanguage, setTargetLanguage] = useState("English");
  const [learningStage, setLearningStage] = useState<(typeof STAGES)[number]>("A1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Oturum bulunamadı.");

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          native_language: nativeLanguage,
          target_language: targetLanguage,
          learning_stage: learningStage,
          onboarding_completed: true,
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-[32px] border border-cyan-300/10 bg-white/[0.03] p-6 backdrop-blur-xl">
          <h1 className="text-3xl font-semibold">Öğrenme yolunu seç</h1>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Ana dil</label>
              <select
                value={nativeLanguage}
                onChange={(e) => setNativeLanguage(e.target.value)}
                className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.name}>
                    {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Öğrenmek istediğin dil</label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.name}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-3 block text-sm text-slate-300">Başlangıç seviyen</label>
            <div className="flex flex-wrap gap-2">
              {STAGES.map((stage) => (
                <button
                  key={stage}
                  type="button"
                  onClick={() => setLearningStage(stage)}
                  className={[
                    "rounded-2xl px-4 py-2.5 text-sm transition",
                    learningStage === stage
                      ? "bg-blue-500 text-white"
                      : "border border-white/10 bg-white/[0.03] text-slate-200",
                  ].join(" ")}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>

          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="mt-6 h-12 rounded-2xl bg-blue-500 px-6 text-sm font-semibold transition hover:bg-blue-400 disabled:opacity-50"
          >
            {loading ? "Kaydediliyor..." : "Başla"}
          </button>
        </div>
      </div>
    </main>
  );
            }
