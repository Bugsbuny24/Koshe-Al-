"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LANGUAGES, LEARNING_STAGES } from "@/lib/constants/languages";

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const popularLanguages = useMemo(
    () => LANGUAGES.filter((item) => item.isPopular),
    []
  );

  const [loading, setLoading] = useState(false);
  const [bootLoading, setBootLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  const [nativeLanguage, setNativeLanguage] = useState("Türkçe");
  const [targetLanguage, setTargetLanguage] = useState("English");
  const [level, setLevel] = useState("A1");
  const [goal, setGoal] = useState("conversation");

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

      const { data: profile } = await supabase
        .from("profiles")
        .select(
          "native_language,target_language,difficulty_level,learning_stage,onboarding_completed"
        )
        .eq("id", user.id)
        .single();

      if (!mounted) return;

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
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-[28px] border border-white/10 bg-gradient-to-r from-fuchsia-500/10 via-blue-500/10 to-cyan-500/10 p-6">
          <div className="text-sm uppercase tracking-[0.25em] text-cyan-300">
            Onboarding
          </div>
          <h1 className="mt-2 text-3xl font-semibold">
            Koshei AI seni tanısın
          </h1>
          <p className="mt-2 max-w-2xl text-slate-300">
            Ana dilini, hedef dilini, seviyeni ve öğrenme amacını seç. Böylece AI öğretmenin sana özel çalışır.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="text-lg font-semibold">Hızlı Bilgi</div>

            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
              <p>• Onboarding tamamlanmadan dashboard açılmaz.</p>
              <p>• Seçimlerin AI öğretmenin davranışını belirler.</p>
              <p>• Sonradan profil ekranından bu bilgileri değiştirebilirsin.</p>
            </div>

            <div className="mt-8">
              <div className="mb-3 text-sm uppercase tracking-[0.2em] text-cyan-300">
                Popüler Diller
              </div>
              <div className="flex flex-wrap gap-2">
                {popularLanguages.slice(0, 12).map((language) => (
                  <span
                    key={language.name}
                    className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs text-slate-200"
                  >
                    {language.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Ana Dilin
                </label>
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
                <label className="mb-2 block text-sm text-slate-300">
                  Seviyen
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
                >
                  {["A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2"].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Öğrenme Amacın
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
                >
                  {LEARNING_STAGES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {errorText ? (
              <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                {errorText}
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={finishOnboarding}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Kaydediliyor..." : "Onboarding'i Tamamla"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-slate-100 transition hover:bg-white/10"
              >
                Şimdilik Geç
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
