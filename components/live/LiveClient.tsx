"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import MainBoard from "@/components/board/MainBoard";
import CorrectionBoard from "@/components/board/CorrectionBoard";
import GrammarBoard from "@/components/board/GrammarBoard";
import VocabBoard from "@/components/board/VocabBoard";
import NextActionBoard from "@/components/board/NextActionBoard";
import { getSpeechLocaleByLanguageName } from "@/lib/constants/languages";

type SpeechRecognitionType = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionEventLike = {
  results: ArrayLike<{
    0: {
      transcript: string;
    };
  }>;
};

type ChatApiResponse = {
  conversationId: string;
  teacherReply: string;
  correction: string;
  grammarNotes: string[];
  nextAction: string;
  nextQuestion: string;
  difficulty: "easier" | "same" | "harder";
  scores?: {
    fluency: number;
    grammar: number;
    vocabulary: number;
  } | null;
  memoryItems?: Array<{
    errorType: string;
    wrongSentence: string;
    correctSentence: string;
    explanation: string;
  }>;
  message?: string;
  error?: string;
};

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognitionType;
    SpeechRecognition?: new () => SpeechRecognitionType;
  }
}

const INITIAL_HELPER =
  "Speak in simple sentences. Koshei will correct you and continue the lesson.";

const INITIAL_NOTES = ["Use short and clear sentences."];
const INITIAL_ACTION = "Answer the current speaking task using your own words.";
const INITIAL_VOCAB = ["speak", "learn", "answer", "question", "practice"];

export default function LiveClient({
  nativeLanguage,
  targetLanguage,
  stage,
}: {
  nativeLanguage: string;
  targetLanguage: string;
  stage: string;
}) {
  const topic = "Daily Life";
  const level = stage;

  const [question, setQuestion] = useState(
    getInitialQuestion(stage, targetLanguage)
  );
  const [helper, setHelper] = useState(INITIAL_HELPER);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const [input, setInput] = useState("");
  const [lastUserAnswer, setLastUserAnswer] = useState("");
  const [correction, setCorrection] = useState("");
  const [grammarNotes, setGrammarNotes] = useState<string[]>(INITIAL_NOTES);
  const [vocab, setVocab] = useState<string[]>(INITIAL_VOCAB);
  const [nextAction, setNextAction] = useState(INITIAL_ACTION);

  const [scores, setScores] = useState<{
    fluency: number;
    grammar: number;
    vocabulary: number;
  } | null>(null);

  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const [selectedLang, setSelectedLang] = useState(
    getSpeechLocaleByLanguageName(targetLanguage)
  );
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quotaMessage, setQuotaMessage] = useState<string | null>(null);
  const [submittedCount, setSubmittedCount] = useState(0);

  const recognitionRef = useRef<SpeechRecognitionType | null>(null);

  useEffect(() => {
    setSelectedLang(getSpeechLocaleByLanguageName(targetLanguage));
  }, [targetLanguage]);

  useEffect(() => {
    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      setRecognitionSupported(false);
      return;
    }

    setRecognitionSupported(true);

    const recognition = new Recognition();
    recognition.lang = selectedLang;
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript || "")
        .join(" ")
        .trim();

      if (!transcript) return;
      setInput(transcript);
    };

    recognition.onerror = (event) => {
      setError(`Speech error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [selectedLang]);

  const canSpeak = useMemo(() => {
    return recognitionSupported && !isListening && !isThinking;
  }, [recognitionSupported, isListening, isThinking]);

  const statusText = useMemo(() => {
    if (isListening) return "Listening";
    if (isThinking) return "Koshei is thinking";
    return "Ready";
  }, [isListening, isThinking]);

  function speakText(text: string) {
    if (
      !autoSpeak ||
      typeof window === "undefined" ||
      !("speechSynthesis" in window)
    ) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLang;
    utterance.rate = 0.96;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  }

  function handleListenQuestion() {
    speakText(question);
  }

  function startListening() {
    setError(null);

    if (!recognitionRef.current) {
      setError("This browser does not support speech recognition.");
      return;
    }

    try {
      recognitionRef.current.lang = selectedLang;
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      setError("Microphone could not start.");
    }
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setIsListening(false);
  }

  async function submitAnswer() {
    const userAnswer = input.trim();
    if (!userAnswer) return;

    setError(null);
    setQuotaMessage(null);
    setIsThinking(true);
    setLastUserAnswer(userAnswer);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
          targetLanguage,
          nativeLanguage,
          level,
          mode: normalizeMode(level),
          topic,
          currentQuestion: question,
          userAnswer,
        }),
      });

      const data = (await response.json()) as ChatApiResponse;

      if (!response.ok) {
        if (response.status === 429) {
          setQuotaMessage(
            data.message ||
              "Daily free limit reached. Upgrade to continue speaking."
          );
          return;
        }

        throw new Error(data?.error || "Koshei response failed.");
      }

      setConversationId(data.conversationId || conversationId);
      setHelper(data.teacherReply || "Good. Let's continue.");
      setCorrection(data.correction || "Good. Let's continue.");
      setGrammarNotes(
        data.grammarNotes?.length
          ? data.grammarNotes
          : ["Keep going. Use short and clear sentences."]
      );
      setNextAction(data.nextAction || "Read the correction and continue.");
      setQuestion(data.nextQuestion || question);
      setInput("");
      setSubmittedCount((prev) => prev + 1);

      setScores(
        data.scores || {
          fluency: 70,
          grammar: 70,
          vocabulary: 70,
        }
      );

      const nextVocab = extractWordsFromText(
        `${data.correction || ""} ${data.nextQuestion || ""}`
      );
      setVocab(nextVocab.length ? nextVocab : INITIAL_VOCAB);

      speakText(data.teacherReply || "Good. Let's continue.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setIsThinking(false);
    }
  }

  function nextQuestion() {
    setHelper("Answer in a natural way. Koshei will continue the lesson.");
    setCorrection("");
    setGrammarNotes(["Read the new task and answer naturally."]);
    setNextAction("Answer the new speaking task.");
  }

  function resetLesson() {
    stopListening();

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setConversationId(null);
    setQuestion(getInitialQuestion(stage, targetLanguage));
    setHelper(INITIAL_HELPER);
    setInput("");
    setLastUserAnswer("");
    setCorrection("");
    setGrammarNotes(INITIAL_NOTES);
    setVocab(INITIAL_VOCAB);
    setNextAction(INITIAL_ACTION);
    setScores(null);
    setError(null);
    setQuotaMessage(null);
    setSubmittedCount(0);
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_18%),linear-gradient(180deg,#040816_0%,#06112a_48%,#020617_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-6">
        <header className="mb-4 rounded-[28px] border border-cyan-300/12 bg-white/[0.035] p-4 backdrop-blur-xl md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/70">
                Koshei V1 • Speaking Board
              </p>
              <h1 className="mt-2 text-2xl font-semibold md:text-3xl">
                AI Speaking Teacher
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Speak, get corrected, continue. Clear flow, real speaking
                practice.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center">
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="h-11 rounded-2xl border border-white/10 bg-slate-950/45 px-4 text-sm text-white outline-none"
              >
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="de-DE">Deutsch</option>
                <option value="fr-FR">Français</option>
                <option value="es-ES">Español</option>
                <option value="it-IT">Italiano</option>
                <option value="tr-TR">Türkçe</option>
                <option value="ja-JP">日本語</option>
                <option value="zh-CN">中文</option>
                <option value="ko-KR">한국어</option>
                <option value="ar-SA">العربية</option>
              </select>

              <label className="flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-slate-200">
                <input
                  type="checkbox"
                  checked={autoSpeak}
                  onChange={(e) => setAutoSpeak(e.target.checked)}
                />
                Voice
              </label>

              <button
                type="button"
                onClick={handleListenQuestion}
                className="h-11 rounded-2xl border border-cyan-300/15 bg-cyan-400/10 px-4 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/15"
              >
                Listen Task
              </button>

              <button
                type="button"
                onClick={resetLesson}
                className="h-11 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-slate-100 transition hover:bg-white/[0.08]"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <TopMiniCard label="Topic" value={topic} />
            <TopMiniCard label="Level" value={level} />
            <TopMiniCard label="Answers" value={String(submittedCount)} />
            <TopMiniCard label="Status" value={statusText} />
          </div>
        </header>

        {error ? (
          <div className="mb-4 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        ) : null}

        {quotaMessage ? (
          <div className="mb-4 rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span>{quotaMessage}</span>
              <Link
                href="/pricing"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-amber-400/15 px-4 text-sm font-medium text-amber-50 transition hover:bg-amber-400/20"
              >
                View Pricing
              </Link>
            </div>
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-12">
          <div className="md:col-span-8">
            <MainBoard
              topic={topic}
              level={level}
              question={question}
              helper={helper}
              onListen={handleListenQuestion}
            />
          </div>

          <div className="md:col-span-4">
            <SessionOverviewCard
              submittedCount={submittedCount}
              nextAction={nextAction}
              isListening={isListening}
              isThinking={isThinking}
            />
          </div>

          <div className="md:col-span-7">
            <EnhancedAnswerSection
              input={input}
              setInput={setInput}
              submitAnswer={submitAnswer}
              startListening={startListening}
              stopListening={stopListening}
              canSpeak={canSpeak}
              isListening={isListening}
              isThinking={isThinking}
              recognitionSupported={recognitionSupported}
            />
          </div>

          <div className="md:col-span-5">
            <GrammarBoard notes={grammarNotes} />
          </div>

          <div className="md:col-span-7">
            <CorrectionBoard
              userAnswer={lastUserAnswer}
              correction={correction}
            />
          </div>

          <div className="md:col-span-5">
            <SpeakingScoreCard scores={scores} />
          </div>

          <div className="md:col-span-5 space-y-4">
            <VocabBoard items={vocab} />
            <NextActionBoard action={nextAction} onNext={nextQuestion} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TopMiniCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-white">{value}</p>
    </div>
  );
}

function SessionOverviewCard({
  submittedCount,
  nextAction,
  isListening,
  isThinking,
}: {
  submittedCount: number;
  nextAction: string;
  isListening: boolean;
  isThinking: boolean;
}) {
  return (
    <div className="h-full rounded-[28px] border border-cyan-300/12 bg-white/[0.035] p-5 backdrop-blur-xl">
      <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">
        Lesson Flow
      </p>
      <h2 className="mt-3 text-xl font-semibold text-white">
        Session Overview
      </h2>

      <div className="mt-5 space-y-3">
        <FlowRow
          title="1. Listen"
          desc="Read or listen to the current speaking task."
          active={!isListening && !isThinking}
        />
        <FlowRow
          title="2. Answer"
          desc="Speak or type your sentence naturally."
          active={isListening}
        />
        <FlowRow
          title="3. Correction"
          desc="Koshei reviews and improves your answer."
          active={isThinking}
        />
        <FlowRow
          title="4. Continue"
          desc="Move to the next question and keep speaking."
          active={!isListening && !isThinking}
        />
      </div>

      <div className="mt-5 rounded-2xl border border-cyan-300/12 bg-cyan-400/[0.08] px-4 py-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-100/70">
          Progress
        </p>
        <p className="mt-2 text-2xl font-semibold text-cyan-50">
          {submittedCount}
        </p>
        <p className="mt-1 text-sm text-cyan-100/80">answers submitted</p>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
          Current focus
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-200">{nextAction}</p>
      </div>
    </div>
  );
}

function FlowRow({
  title,
  desc,
  active,
}: {
  title: string;
  desc: string;
  active?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl border px-4 py-4 transition",
        active
          ? "border-cyan-300/18 bg-cyan-400/[0.07]"
          : "border-white/10 bg-white/[0.03]",
      ].join(" ")}
    >
      <p className="text-sm font-medium text-white">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-300">{desc}</p>
    </div>
  );
}

function EnhancedAnswerSection({
  input,
  setInput,
  submitAnswer,
  startListening,
  stopListening,
  canSpeak,
  isListening,
  isThinking,
  recognitionSupported,
}: {
  input: string;
  setInput: (value: string) => void;
  submitAnswer: () => void;
  startListening: () => void;
  stopListening: () => void;
  canSpeak: boolean;
  isListening: boolean;
  isThinking: boolean;
  recognitionSupported: boolean;
}) {
  return (
    <div className="rounded-[28px] border border-cyan-300/12 bg-white/[0.035] p-5 backdrop-blur-xl">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">
            Answer Board
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            Your Response
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-300">
            Speak with the microphone or type manually.
          </p>
        </div>

        <div className="flex gap-2">
          <StatusPill active={isListening} text="Mic" />
          <StatusPill active={isThinking} text="AI" />
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_220px]">
        <div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer here..."
            rows={8}
            className="w-full rounded-[24px] border border-cyan-300/10 bg-slate-950/45 px-4 py-4 text-base text-white outline-none placeholder:text-slate-500"
          />

          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Keep it short and natural.
            </p>
            <p className="text-xs text-slate-400">{input.length} chars</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={startListening}
            disabled={!recognitionSupported || !canSpeak}
            className="h-14 rounded-2xl bg-emerald-500 px-4 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            🎤 {isListening ? "Listening..." : "Speak"}
          </button>

          <button
            type="button"
            onClick={stopListening}
            disabled={!isListening}
            className="h-14 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-white transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Stop
          </button>

          <button
            type="button"
            onClick={submitAnswer}
            disabled={!input.trim() || isThinking}
            className="h-14 rounded-2xl bg-blue-500 px-4 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isThinking ? "Submitting..." : "Submit Answer"}
          </button>

          <div className="rounded-2xl border border-cyan-300/12 bg-cyan-400/[0.07] px-4 py-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-100/70">
              Tip
            </p>
            <p className="mt-2 text-sm leading-6 text-cyan-50">
              One or two clear sentences are enough.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusPill({
  active,
  text,
}: {
  active: boolean;
  text: string;
}) {
  return (
    <span
      className={[
        "rounded-full border px-3 py-1 text-xs font-medium transition",
        active
          ? "border-cyan-300/20 bg-cyan-400/10 text-cyan-100"
          : "border-white/10 bg-white/[0.03] text-slate-300",
      ].join(" ")}
    >
      {text}
    </span>
  );
}

function SpeakingScoreCard({
  scores,
}: {
  scores: { fluency: number; grammar: number; vocabulary: number } | null;
}) {
  const hasScores =
    !!scores &&
    (scores.fluency > 0 || scores.grammar > 0 || scores.vocabulary > 0);

  async function handleShare() {
    if (!scores) return;

    const text = `My Koshei speaking score
Fluency: ${scores.fluency}
Grammar: ${scores.grammar}
Vocabulary: ${scores.vocabulary}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Koshei Speaking Score",
          text,
        });
        return;
      }

      await navigator.clipboard.writeText(text);
      alert("Score copied to clipboard.");
    } catch {
      alert("Share failed.");
    }
  }

  return (
    <div className="rounded-[28px] border border-cyan-300/12 bg-white/[0.035] p-5 backdrop-blur-xl">
      <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">
        Speaking Score
      </p>
      <h2 className="mt-2 text-xl font-semibold text-white">
        Son konuşma sonucu
      </h2>

      {hasScores && scores ? (
        <>
          <div className="mt-5 space-y-4">
            <ScoreRow label="Fluency" value={scores.fluency} />
            <ScoreRow label="Grammar" value={scores.grammar} />
            <ScoreRow label="Vocabulary" value={scores.vocabulary} />
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="mt-5 h-11 w-full rounded-2xl border border-cyan-300/15 bg-cyan-400/10 px-4 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/15"
          >
            Sonucu Paylaş
          </button>
        </>
      ) : (
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
          İlk cevabını gönder. Koshei konuşma puanını oluştursun.
        </div>
      )}
    </div>
  );
}

function ScoreRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-slate-200">{label}</span>
        <span className="text-sm font-semibold text-white">{value}</span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-blue-400"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function getInitialQuestion(stage: string, targetLanguage: string) {
  if (stage === "A1") return `Listen: My name is Koshei. Repeat in ${targetLanguage}.`;
  if (stage === "A2") return `Read this word and repeat it in ${targetLanguage}.`;
  if (stage === "B1") return `Describe your city in simple ${targetLanguage}.`;
  if (stage === "B2") return `Tell me about your daily life in ${targetLanguage}.`;
  if (stage === "C1") return `Practice speaking about your favorite topic in ${targetLanguage}.`;
  if (stage === "C2") return `Explain your opinion clearly and naturally in ${targetLanguage}.`;
  if (stage === "D1") return `Let's have a real conversation in ${targetLanguage}.`;
  return `Speak naturally in ${targetLanguage}.`;
}

function normalizeMode(stage: string) {
  if (stage === "A1" || stage === "A2") return "foundation";
  if (stage === "B1" || stage === "B2") return "lesson";
  if (stage === "C1" || stage === "C2") return "practice";
  return "conversation";
}

function extractWordsFromText(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-zA-ZğüşöçıİĞÜŞÖÇ\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 5);
}
