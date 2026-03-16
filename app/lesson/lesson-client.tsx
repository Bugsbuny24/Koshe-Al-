"use client";

import { useState } from "react";

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
}: {
  targetLanguage: string;
  level: string;
}) {

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadLesson() {

    setLoading(true);

    const res = await fetch("/api/lesson", {
      method: "POST",
      body: JSON.stringify({
        language: targetLanguage,
        level,
      }),
    });

    const data = await res.json();

    setLesson(data);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white px-6 py-10">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-semibold mb-6">
          Daily Lesson
        </h1>

        <button
          onClick={loadLesson}
          className="bg-purple-600 px-6 py-3 rounded-xl"
        >
          {loading ? "Loading..." : "Generate Lesson"}
        </button>

        {lesson && (
          <div className="mt-8 space-y-6">

            <div className="border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl mb-2">
                {lesson.lessonTitle}
              </h2>

              <p>{lesson.explanation}</p>
            </div>

            <div className="border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg mb-2">
                Example Sentence
              </h3>

              <p>{lesson.exampleSentence}</p>
            </div>

            <div className="border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg mb-2">
                Practice
              </h3>

              <p>{lesson.practiceTask}</p>
            </div>

            <div className="border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg mb-2">
                Conversation Question
              </h3>

              <p>{lesson.conversationQuestion}</p>
            </div>

          </div>
        )}

      </div>

    </main>
  );
}
