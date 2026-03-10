"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import MainBoard from "@/components/board/MainBoard";
import AnswerBoard from "@/components/board/AnswerBoard";
import CorrectionBoard from "@/components/board/CorrectionBoard";
import GrammarBoard from "@/components/board/GrammarBoard";
import VocabBoard from "@/components/board/VocabBoard";
import NextActionBoard from "@/components/board/NextActionBoard";

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

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognitionType;
    SpeechRecognition?: new () => SpeechRecognitionType;
  }
}

type AiBoardResponse = {
  reply: string;
  correction?: string;
  grammarNotes?: string[];
  vocab?: string[];
  nextAction?: string;
  nextQuestion?: string;
};

const FALLBACK_QUESTION = "Describe your city. Is it big, small, crowded, or quiet?";

export default function LiveClient() {
  const [topic] = useState("Daily Life");
  const [level] = useState("A2");
  const [question, setQuestion] = useState(FALLBACK_QUESTION);
  const [helper, setHelper] = useState(
    "Speak in simple English. Use 1-3 sentences. Koshei will correct you and ask the next question."
  );
  const [input, setInput] = useState("");
  const [lastUserAnswer, setLastUserAnswer] = useState("");
  const [correction, setCorrection] = useState("");
  const [grammarNotes, setGrammarNotes] = useState<string[]>([
    "Use short and clear sentences.",
  ]);
  const [vocab, setVocab] = useState<string[]>([
    "big",
    "small",
    "crowded",
    "quiet",
    "beautiful",
  ]);
  const [nextAction, setNextAction] = useState(
    "Answer the speaking task using your own words."
  );
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en-US");
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionType | null>(null);

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

    recognition.onresult = async (event) => {
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

  function speakText(text: string) {
    if (!autoSpeak || typeof window === "undefined" || !("speechSynthesis" in window)) {
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
    setIsThinking(true);
    setLastUserAnswer(userAnswer);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "board",
          targetLanguage: "English",
          userNativeLanguage: "Turkish",
          level,
          topic,
          question,
          answer: userAnswer,
        }),
      });

      const data = (await response.json()) as AiBoardResponse & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data?.error || "Koshei response failed.");
      }

      setCorrection(data.correction || data.reply || "");
      setGrammarNotes(data.grammarNotes || ["Keep going."]);
      setVocab(data.vocab || []);
      setNextAction(data.nextAction || "Answer the next speaking task.");
      setQuestion(data.nextQuestion || question);
      setInput("");

      if (data.reply) {
        setHelper(data.reply);
        speakText(data.reply);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setIsThinking(false);
    }
  }

  async function nextQuestion() {
    setError(null);
    setIsThinking(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "next-question",
          targetLanguage: "English",
          userNativeLanguage: "Turkish",
          level,
          topic,
          previousQuestion: question,
          previousAnswer: lastUserAnswer,
        }),
      });

      const data = (await response.json()) as AiBoardResponse & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data?.error || "Next question failed.");
      }

      const nextQ = data.nextQuestion || data.reply || FALLBACK_QUESTION;
      setQuestion(nextQ);
      setHelper("Answer in simple English. Koshei will continue the lesson.");
      setCorrection("");
      setGrammarNotes(["Read the new task and answer naturally."]);
      setVocab(data.vocab || []);
      setNextAction("Answer the new speaking task.");
      speakText(nextQ);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setIsThinking(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_18%),linear-gradient(180deg,#040816_0%,#06112a_55%,#020617_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-8">
        <div className="mb-5 flex flex-col gap-4 rounded-3xl border border-cyan-300/15 bg-white/[0.03] px-4 py-4 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">
              Koshei V1 • Digital Board
            </p>
            <h1 className="mt-2 text-2xl font-semibold md:text-3xl">
              AI Speaking Teacher
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="de-DE">Deutsch</option>
              <option value="fr-FR">Français</option>
              <option value="es-ES">Español</option>
            </select>

            <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={autoSpeak}
                onChange={(e) => setAutoSpeak(e.target.checked)}
              />
              Voice
            </label>
          </div>
        </div>

        {error ? (
          <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-12 md:grid-rows-[auto_auto_auto]">
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
            <VocabBoard items={vocab} />
          </div>

          <div className="md:col-span-7">
            <AnswerBoard
              input={input}
              isListening={isListening}
              isThinking={isThinking}
              recognitionSupported={recognitionSupported}
              onInputChange={setInput}
              onSpeak={startListening}
              onStop={stopListening}
              onSubmit={submitAnswer}
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
            <NextActionBoard action={nextAction} onNext={nextQuestion} />
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
          Status: {isListening ? "Listening..." : isThinking ? "Koshei is thinking..." : "Ready"}
        </div>
      </div>
    </div>
  );
          }
