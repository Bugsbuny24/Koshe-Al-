"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Role = "user" | "assistant" | "system";

type Message = {
  id: string;
  role: Role;
  content: string;
};

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
    isFinal?: boolean;
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

const INITIAL_MESSAGES: Message[] = [
  {
    id: cryptoSafeId(),
    role: "assistant",
    content:
      "Hello. I am Koshei. We can practice English speaking together. Press start and speak when you are ready.",
  },
];

export default function LiveClient() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en-US");
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionType | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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

      await sendUserMessage(transcript);
    };

    recognition.onerror = (event) => {
      setError(`Ses tanıma hatası: ${event.error}`);
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const canStartListening = useMemo(() => {
    return recognitionSupported && !isListening && !isThinking;
  }, [recognitionSupported, isListening, isThinking]);

  function startListening() {
    setError(null);

    if (!recognitionRef.current) {
      setError("Tarayıcı speech recognition desteklemiyor.");
      return;
    }

    try {
      recognitionRef.current.lang = selectedLang;
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      setError("Mikrofon başlatılamadı.");
      console.error(err);
    }
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setIsListening(false);
  }

  function speakText(text: string) {
    if (!autoSpeak || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLang;
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  }

  async function sendUserMessage(rawText?: string) {
    const userText = (rawText ?? input).trim();
    if (!userText) return;

    setError(null);
    setIsThinking(true);

    const nextUserMessage: Message = {
      id: cryptoSafeId(),
      role: "user",
      content: userText,
    };

    const conversationForApi = [...messages, nextUserMessage];

    setMessages((prev) => [...prev, nextUserMessage]);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversationForApi,
          targetLanguage: "English",
          userNativeLanguage: "Turkish",
          level: "A2-B1",
          mode: "conversation",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "AI cevap alınamadı.");
      }

      const assistantText =
        typeof data?.reply === "string" ? data.reply.trim() : "";

      if (!assistantText) {
        throw new Error("Boş cevap döndü.");
      }

      const assistantMessage: Message = {
        id: cryptoSafeId(),
        role: "assistant",
        content: assistantText,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      speakText(assistantText);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu.";

      setError(message);
    } finally {
      setIsThinking(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void sendUserMessage();
  }

  function clearConversation() {
    window.speechSynthesis?.cancel?.();
    setMessages(INITIAL_MESSAGES);
    setError(null);
    setInput("");
  }

  return (
    <div className="grid gap-6 md:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <h1 className="text-2xl font-bold">Koshei Live</h1>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Avatar yok. Direkt konuşma pratiği, AI öğretmen cevabı ve sesli akış.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Dil</label>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none"
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="de-DE">Deutsch</option>
              <option value="fr-FR">Français</option>
              <option value="es-ES">Español</option>
            </select>
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <input
              type="checkbox"
              checked={autoSpeak}
              onChange={(e) => setAutoSpeak(e.target.checked)}
            />
            <span className="text-sm">AI cevabını sesli okut</span>
          </label>

          <button
            onClick={clearConversation}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition hover:bg-white/10"
            type="button"
          >
            Konuşmayı Sıfırla
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-blue-400/20 bg-blue-400/10 p-4 text-sm text-blue-100">
          <p className="font-medium">Durum</p>
          <p className="mt-2">
            {isListening
              ? "Dinliyorum..."
              : isThinking
              ? "Koshei düşünüyor..."
              : "Hazır"}
          </p>
        </div>

        {!recognitionSupported && (
          <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
            Bu tarayıcı SpeechRecognition desteklemiyor. Yazı yazarak da devam
            edebilirsin.
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-100">
            {error}
          </div>
        )}
      </aside>

      <section className="flex min-h-[75vh] flex-col rounded-3xl border border-white/10 bg-white/5">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="text-lg font-semibold">Conversation</h2>
          <p className="text-sm text-slate-300">
            Speak naturally. Koshei will answer like a teacher.
          </p>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 md:px-5">
          {messages.map((message) => {
            const isUser = message.role === "user";

            return (
              <div
                key={message.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 md:max-w-[75%] ${
                    isUser
                      ? "bg-blue-500 text-white"
                      : "border border-white/10 bg-slate-900/60 text-slate-100"
                  }`}
                >
                  <div className="mb-1 text-[11px] uppercase tracking-wider text-white/70">
                    {isUser ? "You" : "Koshei"}
                  </div>
                  <div>{message.content}</div>
                </div>
              </div>
            );
          })}

          {isThinking && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-300">
                Koshei düşünüyor...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-white/10 p-4 md:p-5">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={startListening}
                disabled={!canStartListening}
                className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Mikrofonu Başlat
              </button>

              <button
                type="button"
                onClick={stopListening}
                disabled={!isListening}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Durdur
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:flex-row">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Mesaj yaz veya mikrofonu kullan..."
                className="h-12 flex-1 rounded-2xl border border-white/10 bg-slate-900/70 px-4 text-white outline-none placeholder:text-slate-500"
              />

              <button
                type="submit"
                disabled={isThinking || !input.trim()}
                className="h-12 rounded-2xl bg-blue-500 px-5 font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Gönder
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function cryptoSafeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }
