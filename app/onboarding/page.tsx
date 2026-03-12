"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const nativeLanguages = [
  "Turkish",
  "English",
  "German",
  "Spanish",
  "French",
  "Arabic",
  "Russian",
  "Japanese",
  "Chinese",
  "Korean",
  "Italian",
  "Portuguese",
  "Dutch",
  "Hindi",
  "Polish",
  "Swedish",
  "Norwegian",
  "Danish",
  "Finnish",
  "Greek",
  "Czech",
  "Romanian",
  "Hungarian",
  "Ukrainian",
  "Persian",
  "Vietnamese",
  "Thai",
  "Indonesian",
  "Malay",
  "Bengali",
];

const targetLanguages = [
  "English",
  "German",
  "Spanish",
  "French",
  "Italian",
  "Portuguese",
  "Arabic",
  "Japanese",
  "Chinese",
  "Korean",
  "Russian",
  "Dutch",
  "Swedish",
  "Norwegian",
  "Danish",
  "Finnish",
  "Polish",
  "Turkish",
  "Greek",
  "Czech",
  "Romanian",
  "Hungarian",
  "Ukrainian",
  "Persian",
  "Hindi",
  "Vietnamese",
  "Thai",
  "Indonesian",
  "Malay",
  "Bengali",
  "Swahili",
  "Afrikaans",
  "Croatian",
  "Serbian",
  "Bulgarian",
  "Slovak",
  "Slovenian",
  "Lithuanian",
  "Latvian",
  "Estonian",
  "Catalan",
  "Hebrew",
  "Urdu",
];

const startingLevels = [
  {
    id: "A1",
    title: "Hiç bilmiyorum",
    desc: "Alfabe ve seslerden başlayacağım.",
  },
  {
    id: "B1",
    title: "Biraz biliyorum",
    desc: "Kelime ve cümle kurma seviyesinden başlayacağım.",
  },
  {
    id: "D1",
    title: "Pratik yapmak istiyorum",
    desc: "Doğrudan konuşma ve karşılıklı diyalog istiyorum.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [nativeLanguage, setNativeLanguage] = useState("Turkish");
  const [targetLanguage, setTargetLanguage] = useState("English");
  const [learningStage, setLearningStage] = useState("A1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Oturum bulunamadı. Lütfen tekrar giriş yap.");
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          native_language: nativeLanguage,
          target_language: targetLanguage,
          learning_stage: learningStage,
          onboarding_completed: true,
        })
        .eq("id", user.id);

      if (updateError) {
        throw updateError;
      }

      router.push("/live");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_18%),linear-gradient(180deg,#030712_0%,#061127_52%,#020617_100%)] text-white">
      <div className="mx-auto max-w-4xl px-4 py-6 md:px-6 md:py-10">
        <div className="rounded-[28px] border border-cyan-300/10 bg-white/[0.03] p-6 backdrop-blur-xl md:p-8">
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">
            Koshei V1
          </p>
          <h1 className="mt-2 text-3xl font-semibold md:text-4xl">
            Öğrenme yolunu seç
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
            Koshei sana göre öğretim planı oluştursun. Ana dilini, öğrenmek
            istediğin dili ve başlangıç seviyeni seç.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <section className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
              <label className="mb-3 block text-sm font-medium text-slate-200">
                Ana dilin
              </label>
              <select
                value={nativeLanguage}
                onChange={(e) => setNativeLanguage(e.target.value)}
                className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 text-white outline-none"
              >
                {nativeLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>

              <label className="mb-3 mt-6 block text-sm font-medium text-slate-200">
                Öğrenmek istediğin dil
              </label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 text-white outline-none"
              >
                {targetLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </section>

            <section className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm font-medium text-slate-200">
                Başlangıç seviyen
              </p>

              <div className="mt-4 space-y-3">
                {startingLevels.map((level) => {
                  const active = learningStage === level.id;

                  return (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setLearningStage(level.id)}
                      className={[
                        "w-full rounded-2xl border px-4 py-4 text-left transition",
                        active
                          ? "border-cyan-300/20 bg-cyan-400/10"
                          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
                      ].join(" ")}
                    >
                      <p className="text-sm font-semibold text-white">
                        {level.title}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-300">
                        {level.desc}
                      </p>
                      <p className="mt-2 text-xs uppercase tracking-[0.16em] text-cyan-200/70">
                        Stage: {level.id}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="mt-6 rounded-[24px] border border-cyan-300/12 bg-cyan-400/[0.07] p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-100/70">
              Seçilen yol
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              {nativeLanguage} → {targetLanguage}
            </p>
            <p className="mt-2 text-sm leading-6 text-cyan-50">
              Başlangıç seviyesi: {learningStage}
            </p>
          </div>

          {error ? (
            <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          ) : null}

          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="mt-6 h-12 w-full rounded-2xl bg-blue-500 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:opacity-50"
          >
            {loading ? "Kaydediliyor..." : "Devam Et"}
          </button>
        </div>
      </div>
    </main>
  );
                }
