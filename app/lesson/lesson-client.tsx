"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type LessonResponse = {
  lessonTitle: string;
  exampleSentence: string;
  explanation: string;
  practiceTask: string;
  conversationQuestion: string;
};

export default function LessonClient({
  nativeLanguage,
  targetLanguage,
  stage,
  difficulty,
}: {
  nativeLanguage: string;
  targetLanguage: string;
  stage: string;
  difficulty: number;
}) {
  const [lesson, setLesson] = useState<LessonResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLesson() {
      setLoading(true);

      const res = await fetch("/api/lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nativeLanguage,
          targetLanguage,
          level: stage,
          difficulty,
          topic: "Daily Life",
        }),
      });

      const data = await res.json();
      setLesson(data);
      setLoading(false);
    }

    loadLesson();
  }, [nativeLanguage, targetLanguage, stage, difficulty]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-[32px] border border-cyan-300/10 bg-white/[0.03] p-6 backdrop-blur-xl">
          {loading ? (
            <p>Koshei ders hazırlıyor...</p>
          ) : lesson ? (
            <>
              <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">
                Daily Lesson
              </p>
              <h1 className="mt-3 text-3xl font-semibold">{lesson.lessonTitle}</h1>

              <div className="mt-6 space-y-4">
                <Card label="Örnek">{lesson.exampleSentence}</Card>
                <Card label="Açıklama">{lesson.explanation}</Card>
                <Card label="Pratik">{lesson.practiceTask}</Card>
                <Card label="Konuşma Sorusu">{lesson.conversationQuestion}</Card>
              </div>

              <Link
                href="/live"
                className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl bg-blue-500 px-6 text-sm font-semibold transition hover:bg-blue-400"
              >
                Konuşma Pratiğine Geç
              </Link>
            </>
          ) : (
            <p>Ders üretilemedi.</p>
          )}
        </div>
      </div>
    </main>
  );
}

function Card({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <div className="mt-2 text-sm leading-6 text-slate-200">{children}</div>
    </div>
  );
}
