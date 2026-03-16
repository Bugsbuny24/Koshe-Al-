"use client";

import { useMemo, useRef, useState } from "react";
import AnswerBoard from "@/components/board/AnswerBoard";
import MainBoard from "@/components/board/MainBoard";
import CorrectionBoard from "@/components/board/CorrectionBoard";
import GrammarBoard from "@/components/board/GrammarBoard";
import VocabBoard from "@/components/board/VocabBoard";
import NextActionBoard from "@/components/board/NextActionBoard";
import type { ChatRouteResponse } from "@/lib/ai/types";

type LiveClientProps = {
  nativeLanguage: string;
  targetLanguage: string;
  stage: string;
};

type SpeechRecognitionConstructor = new () => SpeechRecognition;

declare global {
  interface Window {
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
    SpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export default function LiveClient({
  nativeLanguage,
  targetLanguage,
  stage,
}: LiveClientProps) {
  const [answer, setAnswer] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [teacherReply, setTeacherReply] = useState(
    `Hello! I'm ready to help you practice ${targetLanguage}. Tell me about yourself.`
  );
  const [correction, setCorrection] = useState("");
  const [grammarNotes, setGrammarNotes] = useState<string[]>([]);
  const [vocabulary, setVocabulary] = useState<string[]>([]);
  const [nextAction, setNextAction] = useState("");
  const [nextQuestion, setNextQuestion] = useState(
    "Tell me about yourself in a few sentences."
  );
  const [speakingScore, setSpeakingScore] = useState<{
    fluency: number;
    grammar: number;
    vocabulary: number;
  } | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const browserSpeechSupported = useMemo(() => {
    if (typeof window === "undefined") return false;
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }, []);

  function startRecording() {
    if (typeof window === "undefined") return;

    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      alert("Bu tarayıcı konuşma tanımayı desteklemiyor.");
      return;
    }

    const recognition = new SpeechRecognitionClass();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      setAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }

  function stopRecording() {
    recognitionRef.current?.stop();
    setIsRecording(false);
  }

  async function submitAnswer() {
    if (!answer.trim()) return;

    try {
      setIsLoading(true);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: answer,
          conversationId,
        }),
      });

      const data = (await res.json()) as ChatRouteResponse | { error?: string };

      if (!res.ok) {
        alert((data as { error?: string }).error || "Chat hatası");
        return;
      }

      const typed = data as ChatRouteResponse;

      setConversationId(typed.conversationId);
      setTeacherReply(typed.teacherReply);
      setCorrection(typed.correction);
      setGrammarNotes(typed.grammarNotes || []);
      setVocabulary(typed.vocabulary || []);
      setNextAction(typed.nextAction);
      setNextQuestion(typed.nextQuestion);
      setSpeakingScore(typed.speakingScore || null);
      setAnswer("");
    } catch (error) {
      console.error(error);
      alert("Bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleShareScore() {
    if (!speakingScore) return;

    const text = `My Koshei speaking score

Fluency: ${speakingScore.fluency}
Grammar: ${speakingScore.grammar}
Vocabulary: ${speakingScore.vocabulary}`;

    if (navigator.share) {
      await navigator.share({
        title: "Koshei AI Speaking Score",
        text,
      });
      return;
    }

    await navigator.clipboard.writeText(text);
    alert("Skor panoya kopyalandı.");
  }

  return (
    <main className="min-h-screen bg-[#050816] px-4 py-8 text-white md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-[28px] border border-white/10 bg-gradient-to-r from-fuchsia-500/10 via-blue-500/10 to-cyan-500/10 p-6">
          <div className="text-sm uppercase tracking-[0.25em] text-cyan-300">
            Live Speaking
          </div>
          <h1 className="mt-2 text-3xl font-semibold">
            {targetLanguage} konuşma pratiği
          </h1>
          <p className="mt-2 text-slate-300">
            Ana dil: {nativeLanguage} • Seviye: {stage}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <MainBoard
            title="Bugünün görevi"
            content={nextQuestion || teacherReply}
          />

          <CorrectionBoard correction={correction} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <GrammarBoard notes={grammarNotes} />
          <VocabBoard items={vocabulary} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <NextActionBoard action={nextAction} question={nextQuestion} />

          <AnswerBoard
            value={answer}
            onChange={setAnswer}
            onSubmit={submitAnswer}
            onStartRecording={browserSpeechSupported ? startRecording : undefined}
            onStopRecording={browserSpeechSupported ? stopRecording : undefined}
            isLoading={isLoading}
            isRecording={isRecording}
            targetLanguage={targetLanguage}
          />
        </div>

        {speakingScore ? (
          <div className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-5 md:p-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-semibold">Speaking Score</h3>

              <button
                onClick={handleShareScore}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:bg-white/10"
              >
                Sonucu Paylaş
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm text-slate-400">Fluency</div>
                <div className="mt-2 text-2xl font-semibold">
                  {speakingScore.fluency}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm text-slate-400">Grammar</div>
                <div className="mt-2 text-2xl font-semibold">
                  {speakingScore.grammar}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm text-slate-400">Vocabulary</div>
                <div className="mt-2 text-2xl font-semibold">
                  {speakingScore.vocabulary}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
      }
