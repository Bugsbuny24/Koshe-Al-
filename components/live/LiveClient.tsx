"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import AnswerBoard from "@/components/board/AnswerBoard";
import MainBoard from "@/components/board/MainBoard";
import CorrectionBoard from "@/components/board/CorrectionBoard";
import GrammarBoard from "@/components/board/GrammarBoard";
import VocabBoard from "@/components/board/VocabBoard";
import NextActionBoard from "@/components/board/NextActionBoard";
import MentorCard from "@/components/live/MentorCard";
import CreditWarning from "@/components/credits/CreditWarning";
import type { ChatRouteResponse } from "@/lib/ai/types";
import {
  browserSupportsSpeechRecognition,
  browserSupportsSpeechSynthesis,
  createRecognition,
  speakText,
  stopSpeaking,
} from "@/lib/live/speech";
import { getSpeechLocaleByLanguageName } from "@/lib/constants/languages";
import { getMentorForLanguage } from "@/lib/data/mentors";
import type { MentorState } from "@/lib/data/mentors";
import type { CreditWarningState } from "@/types/credit";

type LiveClientProps = {
  nativeLanguage: string;
  targetLanguage: string;
  stage: string;
  /** Optional: language code (e.g. "en") for academic context & mentor lookup */
  languageCode?: string;
  /** Credit system — optional, fails safely when not provided */
  creditBalance?: number;
  estimatedCost?: number;
  creditWarningState?: CreditWarningState;
  canStart?: boolean;
};

type ConversationTurn = {
  role: "user" | "assistant";
  text: string;
};

export default function LiveClient({
  nativeLanguage,
  targetLanguage,
  stage,
  languageCode,
  creditBalance = 999,
  estimatedCost = 0,
  creditWarningState = "ok",
  canStart = true,
}: LiveClientProps) {
  // ── Derive mentor + academic context ────────────────────────────────────────
  const mentor = useMemo(
    () => getMentorForLanguage(languageCode ?? targetLanguage.slice(0, 2).toLowerCase()),
    [languageCode, targetLanguage]
  );
  const [answer, setAnswer] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [speechError, setSpeechError] = useState("");

  // ── Rate limit: 2-second cooldown between submissions ───────────────────────
  const lastSubmitRef = useRef<number>(0);
  const SUBMIT_COOLDOWN_MS = 2000;

  // ── Session limit: 10-minute maximum ────────────────────────────────────────
  const SESSION_LIMIT_MS = 10 * 60 * 1000;
  const sessionStartRef = useRef<number>(Date.now());
  const [sessionExpired, setSessionExpired] = useState(false);
  const [teacherReply, setTeacherReply] = useState(
    `Hello! I'm ready to help you practice ${targetLanguage}. Tell me about yourself.`
  );
  const [correction, setCorrection] = useState("");
  const [grammarNotes, setGrammarNotes] = useState<string[]>([]);
  const [vocabulary, setVocabulary] = useState<string[]>([]);
  const [nextAction, setNextAction] = useState(
    "Try answering with a full sentence."
  );
  const [nextQuestion, setNextQuestion] = useState(
    "Tell me about yourself in a few sentences."
  );
  const [speakingScore, setSpeakingScore] = useState<{
    fluency: number;
    grammar: number;
    vocabulary: number;
  } | null>(null);
  const [history, setHistory] = useState<ConversationTurn[]>([
    {
      role: "assistant",
      text: `Hello! I'm ready to help you practice ${targetLanguage}. Tell me about yourself.`,
    },
  ]);

  // ── Derive mentor state from recording / loading flags ──────────────────────
  const mentorState: MentorState = isLoading
    ? "thinking"
    : isRecording
    ? "listening"
    : teacherReply
    ? "idle"
    : "idle";

  const recognitionRef = useRef<ReturnType<typeof createRecognition> | null>(
    null
  );
  const historyEndRef = useRef<HTMLDivElement | null>(null);

  const speechLocale = useMemo(
    () => getSpeechLocaleByLanguageName(targetLanguage) || "en-US",
    [targetLanguage]
  );

  const recognitionSupported = useMemo(
    () => browserSupportsSpeechRecognition(),
    []
  );
  const synthesisSupported = useMemo(
    () => browserSupportsSpeechSynthesis(),
    []
  );

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    if (!autoSpeak || !teacherReply || !synthesisSupported) return;

    const textToSpeak = teacherReply || nextQuestion;

    void speakText({
      text: textToSpeak,
      lang: speechLocale,
      rate: 0.98,
      pitch: 1,
      volume: 1,
    });

    return () => {
      stopSpeaking();
    };
  }, [teacherReply, nextQuestion, autoSpeak, synthesisSupported, speechLocale]);

  function startRecording() {
    if (!canStart) return;
    if (sessionExpired) {
      setSpeechError("Oturum süresi doldu (10 dk). Yeni oturum başlatın.");
      return;
    }
    if (Date.now() - sessionStartRef.current > SESSION_LIMIT_MS) {
      setSessionExpired(true);
      setSpeechError("Oturum süresi doldu (10 dk). Yeni oturum başlatın.");
      return;
    }
    if (!recognitionSupported) {
      setSpeechError("Bu tarayıcı mikrofon konuşma tanımayı desteklemiyor.");
      return;
    }

    setSpeechError("");

    try {
      stopSpeaking();

      const recognition = createRecognition({
        lang: speechLocale,
        onStart: () => setIsRecording(true),
        onEnd: () => setIsRecording(false),
        onError: (message) => {
          setIsRecording(false);
          setSpeechError(message);
        },
        onFinalText: (text) => {
          setAnswer(text);
        },
      });

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsRecording(false);
      setSpeechError("Mikrofon başlatılamadı.");
    }
  }

  function stopRecordingHandler() {
    recognitionRef.current?.stop();
    setIsRecording(false);
  }

  async function submitAnswer() {
    if (!canStart) return;
    if (sessionExpired) {
      setSpeechError("Oturum süresi doldu (10 dk). Yeni oturum başlatın.");
      return;
    }
    if (Date.now() - sessionStartRef.current > SESSION_LIMIT_MS) {
      setSessionExpired(true);
      setSpeechError("Oturum süresi doldu (10 dk). Yeni oturum başlatın.");
      return;
    }
    const now = Date.now();
    if (now - lastSubmitRef.current < SUBMIT_COOLDOWN_MS) {
      setSpeechError("Lütfen iki saniye bekleyin...");
      return;
    }
    const trimmed = answer.trim();
    if (!trimmed || isLoading) return;

    setSpeechError("");
    setIsLoading(true);
    lastSubmitRef.current = Date.now();

    const nextHistory: ConversationTurn[] = [
      ...history,
      { role: "user", text: trimmed },
    ];
    setHistory(nextHistory);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmed,
          conversationId,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setSpeechError(json?.error || "Chat hatası oluştu.");
        setIsLoading(false);
        return;
      }

      const data = json as ChatRouteResponse;

      setConversationId(data.conversationId);
      setTeacherReply(data.teacherReply || "");
      setCorrection(data.correction || "");
      setGrammarNotes(data.grammarNotes || []);
      setVocabulary(data.vocabulary || []);
      setNextAction(data.nextAction || "");
      setNextQuestion(data.nextQuestion || "");
      setSpeakingScore(data.speakingScore || null);

      setHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.teacherReply || data.nextQuestion || "Let's continue.",
        },
      ]);

      setAnswer("");
    } catch {
      setSpeechError("Bağlantı hatası oluştu.");
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
        {/* ── Credit warning / session cost ───────────────────────────────── */}
        {(creditWarningState !== "ok" || estimatedCost > 0) && (
          <div className="mb-6">
            <CreditWarning
              warningState={creditWarningState}
              balance={creditBalance}
              estimatedCost={estimatedCost}
              featureLabel="Canlı Pratik (10 dk)"
            />
          </div>
        )}

        {/* ── Mentor + Academic Context Header ────────────────────────────── */}
        <div className="mb-8 rounded-[28px] border border-white/10 bg-gradient-to-r from-fuchsia-500/10 via-blue-500/10 to-cyan-500/10 p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              {/* Mentor card */}
              <MentorCard mentor={mentor} state={mentorState} />

              <div className="border-l border-white/10 pl-5">
                <div className="text-xs uppercase tracking-[0.25em] text-cyan-300">
                  Canlı Konuşma Pratiği
                </div>
                <h1 className="mt-1.5 text-2xl font-semibold">
                  {targetLanguage} · {stage}
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/10"
              >
                ← Dashboard
              </Link>

              <button
                type="button"
                onClick={() => setAutoSpeak((prev) => !prev)}
                className={`rounded-2xl px-4 py-2.5 text-sm font-medium transition ${
                  autoSpeak
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-400/20"
                    : "bg-white/5 text-slate-300 border border-white/10"
                }`}
              >
                {autoSpeak ? "🔊 Ses Açık" : "🔇 Ses Kapalı"}
              </button>

              <button
                type="button"
                onClick={() => setMicEnabled((prev) => !prev)}
                className={`rounded-2xl px-4 py-2.5 text-sm font-medium transition ${
                  micEnabled
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-400/20"
                    : "bg-white/5 text-slate-300 border border-white/10"
                }`}
              >
                {micEnabled ? "🎤 Mic Aktif" : "🎤 Mic Kapalı"}
              </button>
            </div>
          </div>
        </div>

        {speechError ? (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            {speechError}
          </div>
        ) : null}

        {sessionExpired && (
          <div className="mb-6 rounded-[28px] border border-amber-400/20 bg-amber-500/10 p-5">
            <p className="text-sm font-medium text-amber-300">
              ⏱ Oturum süresi doldu (10 dk). Sayfayı yenileyerek yeni oturum başlatabilirsiniz.
            </p>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <MainBoard title="Bugünün görevi" content={nextQuestion || teacherReply} />

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 md:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Konuşma Geçmişi</h3>
                <div className="text-sm text-slate-400">
                  {history.length} mesaj
                </div>
              </div>

              <div className="max-h-[460px] space-y-4 overflow-y-auto pr-1">
                {history.map((item, index) => (
                  <div
                    key={`${item.role}-${index}`}
                    className={`flex ${
                      item.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7 ${
                        item.role === "user"
                          ? "bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white"
                          : "border border-white/10 bg-black/20 text-slate-100"
                      }`}
                    >
                      {item.text}
                    </div>
                  </div>
                ))}
                <div ref={historyEndRef} />
              </div>
            </div>

            {speakingScore ? (
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 md:p-6">
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

          <div className="space-y-6">
            <CorrectionBoard correction={correction} />
            <GrammarBoard notes={grammarNotes} />
            <VocabBoard items={vocabulary} />
            <NextActionBoard action={nextAction} question={nextQuestion} />

            <AnswerBoard
              value={answer}
              onChange={setAnswer}
              onSubmit={submitAnswer}
              onStartRecording={
                micEnabled && recognitionSupported && canStart ? startRecording : undefined
              }
              onStopRecording={stopRecordingHandler}
              isLoading={isLoading}
              isRecording={isRecording}
              targetLanguage={targetLanguage}
            />

            {!canStart && (
              <div className="rounded-[28px] border border-amber-400/20 bg-amber-500/10 p-5">
                <p className="text-sm font-medium text-amber-300">
                  ⚠ Yeterli krediniz yok. Konuşmaya başlamak için kredi yükleyin.
                </p>
                <div className="mt-3 flex gap-3">
                  <a
                    href="/pricing"
                    className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    ✦ Kredi Yükle
                  </a>
                  <a
                    href="/profile"
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10"
                  >
                    Profil
                  </a>
                </div>
              </div>
            )}

            {/* ── Navigation CTAs ────────────────────────────────────────── */}
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-500">
                Sonraki Adım
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/lesson"
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10"
                >
                  <span>📖 Derse Git</span>
                  <span className="text-slate-500">→</span>
                </Link>
                <Link
                  href="/courses"
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10"
                >
                  <span>🎓 Programa Dön</span>
                  <span className="text-slate-500">→</span>
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10"
                >
                  <span>🏆 Rozetlerimi Gör</span>
                  <span className="text-slate-500">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
