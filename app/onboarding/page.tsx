"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {

  const supabase = createClient();
  const router = useRouter();

  const [nativeLanguage, setNativeLanguage] = useState("Turkish");
  const [targetLanguage, setTargetLanguage] = useState("English");
  const [level, setLevel] = useState("beginner");
  const [goal, setGoal] = useState("conversation");

  async function finishOnboarding() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

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
      alert(error.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="flex justify-center items-center h-screen">

      <div className="w-96 space-y-6">

        <h1 className="text-2xl font-bold">
          Koshei AI Seni Tanısın
        </h1>

        {/* Native language */}

        <div>
          <p>Ana Dilin</p>

          <select
            className="border p-2 w-full"
            value={nativeLanguage}
            onChange={(e) => setNativeLanguage(e.target.value)}
          >
            <option>Turkish</option>
            <option>English</option>
            <option>German</option>
            <option>French</option>
          </select>
        </div>

        {/* Target language */}

        <div>
          <p>Öğrenmek istediğin dil</p>

          <select
            className="border p-2 w-full"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
          >
            <option>English</option>
            <option>German</option>
            <option>French</option>
            <option>Spanish</option>
          </select>
        </div>

        {/* Level */}

        <div>
          <p>Seviyen</p>

          <select
            className="border p-2 w-full"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Goal */}

        <div>
          <p>Amacın</p>

          <select
            className="border p-2 w-full"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          >
            <option value="conversation">Konuşma</option>
            <option value="business">İş dili</option>
            <option value="travel">Seyahat</option>
            <option value="academic">Akademik</option>
          </select>
        </div>

        <button
          onClick={finishOnboarding}
          className="bg-black text-white w-full p-3"
        >
          Başla
        </button>

      </div>
    </div>
  );
}
