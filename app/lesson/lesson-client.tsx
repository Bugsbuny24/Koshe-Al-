"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getMentorForLanguage } from "@/lib/data/mentors";
import MentorCard from "@/components/live/MentorCard";
import type { CreditWarningState } from "@/types/credit";

type Lesson = {
  lessonTitle: string;
  explanation: string;
  exampleSentence: string;
  practiceTask: string;
  conversationQuestion: string;
};

export default function LessonClient({
  targetLanguage,
  level,
  languageCode,
  canGenerateLesson = true,
  creditWarningState = "ok",
  currentCredits = 0,
  lessonCreditCost = 1,
  unitId,
  courseId,
  unitTitle,
  completedCount = 0,
  totalUnits = 0,
}: {
  targetLanguage: string;
  level: string;
  languageCode?: string;
  canGenerateLesson?: boolean;
  creditWarningState?: CreditWarningState;
  currentCredits?: number;
  lessonCreditCost?: number;
  unitId?: string;
  courseId?: string;
  unitTitle?: string;
  completedCount?: number;
  totalUnits?: number;
}) {
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [lessonError, setLessonError] = useState<string | null>(null);

  const langCode = languageCode ?? targetLanguage.slice(0, 2).toLowerCase();
  const mentor = getMentorForLanguage(langCode);
  const allDone = totalUnits > 0 && completedCount >= totalUnits;

  async function loadLesson() {
    if (!canGenerateLesson) return;
    setLoading(true);
    setCompleted(false);
    setLessonError(null);

    try {
      const res = await fetch("/api/lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: targetLanguage, level }),
      });

      if (!res.ok) {
        const json = await res.json() as Record<string, unknown>;
        const msg = typeof json.error === "string" ? json.error : "Ders oluşturulamadı.";
        setLessonError(msg);
        setLoading(false);
        return;
      }

      const data = await res.json() as Lesson;
      setLesson(data);
    } catch {
      setLessonError("Bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050816] px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="mb-8 rounded-[28px] border border-white/10 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-fuchsia-500/10 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <MentorCard mentor={mentor} state="idle" />
              <div className="border-l border-white/10 pl-4">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">
                  Günlük Ders
                </p>
                <h1 className="mt-1 text-2xl font-semibold">
                  {targetLanguage} · {level}
                </h1>
                {totalUnits > 0 && (
                  <p className="mt-0.5 text-xs text-slate-500">
                    {completedCount}/{totalUnits} ünite tamamlandı
                  </p>
                )}
              </div>
            </div>

            <Link
              href="/dashboard"
              className="self-start rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 sm:self-auto"
            >
              ← Dashboard
            </Link>
          </div>
        </div>

        {/* ── All units completed banner ────────────────────────────────────── */}
        {allDone && !lesson && (
          <div className="rounded-[28px] border border-amber-400/20 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 p-8 text-center">
            <p className="text-5xl mb-3">🎓</p>
            <h2 className="text-2xl font-bold text-amber-300">Tebrikler!</h2>
            <p className="mt-2 text-sm text-slate-300">
              Bu seviyedeki tüm üniteleri tamamladın. Bir sonraki seviyeye geçmeye hazırsın.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href="/courses"
                className="rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Sonraki Seviyeye Geç →
              </Link>
              <Link
                href="/live"
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm text-slate-300 transition hover:bg-white/10"
              >
                🎤 Konuşmaya Devam Et
              </Link>
            </div>
          </div>
        )}

        {/* ── Generate button ───────────────────────────────────────────────── */}
        {!lesson && !allDone ? (
          <div className="space-y-5">
            {/* Generate area */}
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-10 text-center">
              <div className="mb-6 text-5xl">📖</div>
              <h2 className="text-2xl font-semibold">
                {unitTitle ?? "Ders Oluştur"}
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                {targetLanguage} · {level}
              </p>

              {!canGenerateLesson && (
                <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
                  {currentCredits === 0
                    ? "Krediniz bitti. Ders oluşturmak için kredi yükleyin."
                    : `Ders için ${lessonCreditCost} kredi gerekli. Mevcut: ${currentCredits} kredi.`}
                  <div className="mt-2">
                    <Link
                      href="/pricing"
                      className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
                    >
                      ✦ Kredi Yükle
                    </Link>
                  </div>
                </div>
              )}

              {lessonError && (
                <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {lessonError}
                </div>
              )}

              <button
                onClick={loadLesson}
                disabled={loading || !canGenerateLesson}
                className="mt-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(34,211,238,0.25)] transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Ders hazırlanıyor..."
                  : !canGenerateLesson
                  ? "Yetersiz Kredi"
                  : "Dersi Oluştur"}
              </button>
            </div>
          </div>
        ) : null}

        {/* ── Lesson content ─────────────────────────────────────────────────── */}
        {lesson ? (
          <div className="space-y-5">
            {/* Title */}
            <div className="rounded-[28px] border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-300/80">
                Ders Konusu
              </p>
              <h2 className="mt-2 text-2xl font-semibold">{lesson.lessonTitle}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {lesson.explanation}
              </p>
            </div>

            {/* Example sentence */}
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                Örnek Cümle
              </p>
              <p className="mt-3 text-lg font-medium text-cyan-100">
                {lesson.exampleSentence}
              </p>
            </div>

            {/* Practice task */}
            <div className="rounded-[28px] border border-fuchsia-400/20 bg-fuchsia-500/5 p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-400/80">
                Pratik Görevi
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-200">
                {lesson.practiceTask}
              </p>
            </div>

            {/* Conversation question */}
            <div className="rounded-[28px] border border-violet-400/20 bg-violet-500/5 p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-violet-400/80">
                Konuşma Sorusu
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-200">
                {lesson.conversationQuestion}
              </p>
            </div>

            {/* ── Completion / CTA ─────────────────────────────────────────── */}
            {!completed ? (
              <div className="rounded-[28px] border border-emerald-400/20 bg-emerald-500/5 p-6">
                <p className="text-sm text-slate-300">
                  Dersi okudun ve örneği anladın mı?
                </p>
                <button
                  onClick={() => {
                    setCompleted(true);
                    // Unit progress kaydet — hata olursa sessizce geç
                    if (unitId && courseId) {
                      fetch("/api/lesson/complete", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ unitId, courseId }),
                      }).catch(() => {});
                    }
                  }}
                  className="mt-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  ✓ Dersi Tamamla
                </button>
              </div>
            ) : (
              <div className="rounded-[28px] border border-emerald-400/30 bg-emerald-500/10 p-6">
                <p className="font-semibold text-emerald-300">
                  🎉 Ders tamamlandı!
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Şimdi öğrendiklerini pratikte kullanmanın zamanı.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/live"
                    className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(34,211,238,0.25)] transition hover:opacity-90"
                  >
                    🎤 Canlı Pratiğe Geç
                  </Link>
                  <button
                    onClick={() => router.refresh()}
                    className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(16,185,129,0.25)] transition hover:opacity-90"
                  >
                    📖 Sonraki Derse Geç →
                  </button>
                  <Link
                    href="/courses"
                    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-slate-300 transition hover:bg-white/10"
                  >
                    📚 Programa Dön
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </main>
  );
}

