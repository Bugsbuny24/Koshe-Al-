"use client";

import { useRef, useState, useEffect, lazy, Suspense } from "react";
import { Button } from "@/components/ui/Button";

const KosheiAvatar = lazy(() => import("@/components/avatar/KosheiAvatar"));

// Minimal type definitions for the Web Speech API (not fully typed in older DOM libs)
interface ISpeechRecognitionResult {
  readonly length: number;
  [index: number]: { transcript: string; confidence: number };
}
interface ISpeechRecognitionResultList {
  readonly length: number;
  [index: number]: ISpeechRecognitionResult;
  [Symbol.iterator](): Iterator<ISpeechRecognitionResult>;
}
interface ISpeechRecognitionEvent extends Event {
  readonly results: ISpeechRecognitionResultList;
}
interface ISpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}
interface SpeechRecognitionConstructor {
  new(): ISpeechRecognition;
}
function getSpeechRecognitionAPI(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const LANGUAGES = [
  { code: "en-US",  label: "🇬🇧 English",    targetLang: "English"    },
  { code: "de-DE",  label: "🇩🇪 Deutsch",    targetLang: "German"     },
  { code: "fr-FR",  label: "🇫🇷 Français",   targetLang: "French"     },
  { code: "es-ES",  label: "🇪🇸 Español",    targetLang: "Spanish"    },
  { code: "it-IT",  label: "🇮🇹 Italiano",   targetLang: "Italian"    },
  { code: "ru-RU",  label: "🇷🇺 Русский",    targetLang: "Russian"    },
  { code: "ar-SA",  label: "🇸🇦 العربية",    targetLang: "Arabic"     },
  { code: "ja-JP",  label: "🇯🇵 日本語",     targetLang: "Japanese"   },
  { code: "zh-CN",  label: "🇨🇳 中文",       targetLang: "Chinese"    },
  { code: "ko-KR",  label: "🇰🇷 한국어",     targetLang: "Korean"     },
  { code: "pt-BR",  label: "🇧🇷 Português",  targetLang: "Portuguese" },
  { code: "nl-NL",  label: "🇳🇱 Nederlands", targetLang: "Dutch"      },
];

const EARLY_LEVELS = ["A1", "A2", "B1"];
const ALL_LEVELS   = ["A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2"];

export default function LiveClient() {
  const [listening, setListening]   = useState(false);
  const [transcript, setTranscript] = useState("");
  const [reply, setReply]           = useState("");
  const [err, setErr]               = useState("");
  const [loading, setLoading]       = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [audioUrl, setAudioUrl]     = useState<string | null>(null);
  const [playing, setPlaying]       = useState(false);
  const [score, setScore]           = useState(0);

  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [level, setLevel]               = useState("A1");
  const [showLangPicker, setShowLangPicker] = useState(false);

  const mediaRecRef   = useRef<MediaRecorder | null>(null);
  const chunksRef     = useRef<Blob[]>([]);
  const audioRef      = useRef<HTMLAudioElement | null>(null);
  const transcriptRef = useRef("");
  const speechRecRef  = useRef<ISpeechRecognition | null>(null);

  const isEarlyLevel = EARLY_LEVELS.includes(level);
  const sttLang      = isEarlyLevel ? "tr-TR" : selectedLang.code;

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  async function startRecording() {
    setErr("");
    setTranscript("");

    // --- Web Speech API fallback for browsers without MediaRecorder (e.g. iOS Safari) ---
    const SpeechRecognitionAPI = getSpeechRecognitionAPI();
    const mediaRecorderSupported =
      typeof MediaRecorder !== "undefined" &&
      (MediaRecorder.isTypeSupported("audio/webm") || MediaRecorder.isTypeSupported("audio/mp4"));

    if (!mediaRecorderSupported && SpeechRecognitionAPI) {
      const recognition = new SpeechRecognitionAPI();
      recognition.lang = sttLang;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: ISpeechRecognitionEvent) => {
        const results = event.results;
        const parts: string[] = [];
        for (let i = 0; i < results.length; i++) {
          parts.push(results[i][0].transcript);
        }
        const text = parts.join(" ").trim();
        setTranscript(text);
        if (text) setTimeout(() => ask(text), 300);
      };

      recognition.onerror = (event: { error: string }) => {
        if (event.error !== "no-speech") {
          setErr("Ses tanıma hatası: " + event.error);
        }
        setListening(false);
      };

      recognition.onend = () => setListening(false);

      speechRecRef.current = recognition;
      recognition.start();
      setListening(true);
      return;
    }

    // --- Primary path: MediaRecorder + Gemini STT ---
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4";
      const rec = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      rec.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: mimeType });
        if (blob.size < 1000) return; // çok kısa ses, yoksay
        await transcribeAudio(blob, mimeType);
      };

      rec.start(250);
      mediaRecRef.current = rec;
      setListening(true);
    } catch {
      setErr("Mikrofon erişimi reddedildi. Tarayıcı ayarlarından izin ver.");
    }
  }

  async function stopRecording() {
    // Stop MediaRecorder if active
    if (mediaRecRef.current && mediaRecRef.current.state !== "inactive") {
      mediaRecRef.current.stop();
    }
    // Stop Web Speech API if active
    if (speechRecRef.current) {
      speechRecRef.current.stop();
      speechRecRef.current = null;
    }
    setListening(false);
  }

  async function transcribeAudio(blob: Blob, mimeType: string) {
    setTranscribing(true);
    try {
      const fd = new FormData();
      fd.append("audio", new File([blob], "audio.webm", { type: mimeType }));
      fd.append("lang", sttLang);

      const res  = await fetch("/api/stt", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok || data.error) throw new Error(data.error || "STT failed");

      const text = data.transcript?.trim() || "";
      setTranscript(text);
      if (text) {
        // Transcript gelince otomatik sor
        setTimeout(() => ask(text), 300);
      }
    } catch (e: any) {
      setErr(e?.message || "Ses anlasilamadi, tekrar deneyin.");
    } finally {
      setTranscribing(false);
    }
  }

  async function ask(overrideMsg?: string) {
    const msg = (overrideMsg ?? transcriptRef.current).trim();
    if (!msg) return;
    setErr("");
    setAudioUrl(null);
    setLoading(true);

    try {
      const chatRes = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetLang: selectedLang.targetLang,
          nativeLang: "Turkish",
          level,
          text: msg,
          nativeMode: isEarlyLevel,
        }),
      });
      const chatData = await chatRes.json();
      if (!chatRes.ok || chatData?.error) throw new Error(chatData?.error || "chat failed");
      const replyText = chatData.reply || "";
      setReply(replyText);

      // Skoru parse et (+10, +5 gibi)
      const scoreMatch = replyText.match(/\+(\d+)\s*puan/i);
      if (scoreMatch) setScore(s => s + parseInt(scoreMatch[1]));

      const ttsRes = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: replyText }),
      });
      if (ttsRes.ok) {
        const contentType = ttsRes.headers.get("Content-Type") || "audio/wav";
        const arrayBuf    = await ttsRes.arrayBuffer();
        const blob2       = new Blob([arrayBuf], { type: contentType });
        const url         = URL.createObjectURL(blob2);
        setAudioUrl(url);
        const audio = new Audio(url);
        audioRef.current  = audio;
        audio.onplay      = () => setPlaying(true);
        audio.onended     = () => setPlaying(false);
        audio.onerror     = () => setPlaying(false);
        audio.play().catch(() => {});
      }
    } catch (e: any) {
      setErr(e?.message || "error");
    } finally {
      setLoading(false);
    }
  }

  function playAudio() {
    if (!audioUrl) return;
    audioRef.current?.pause();
    const audio = new Audio(audioUrl);
    audioRef.current  = audio;
    audio.onplay      = () => setPlaying(true);
    audio.onended     = () => setPlaying(false);
    audio.onerror     = () => setPlaying(false);
    audio.play();
  }

  function silence() { audioRef.current?.pause?.(); setPlaying(false); }

  const statusText = transcribing
    ? "Ses analiz ediliyor..."
    : loading
    ? "Koshei dusunuyor..."
    : listening
    ? "Dinleniyor..."
    : "Hazir";

  return (
    <div className="space-y-4">

      {/* Dil & Seviye */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setShowLangPicker(!showLangPicker)}
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm hover:bg-white/20 transition"
          >
            <span>{selectedLang.label}</span>
            <span className="text-white/50">▾</span>
          </button>
          {showLangPicker && (
            <div className="absolute left-0 top-10 z-50 w-48 rounded-xl border border-white/20 bg-[#0d0d1f] shadow-2xl overflow-hidden">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { setSelectedLang(lang); setShowLangPicker(false); setTranscript(""); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition ${
                    selectedLang.code === lang.code ? "bg-white/15 font-semibold" : ""
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-1 flex-wrap">
          {ALL_LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => { setLevel(l); setTranscript(""); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                level === l
                  ? "bg-violet-600 text-white"
                  : "border border-white/20 bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Mikrofon dili + Skor */}
        <div className={`rounded-xl px-3 py-1.5 text-xs font-semibold border ${
          isEarlyLevel
            ? "bg-orange-500/20 border-orange-500/40 text-orange-300"
            : "bg-green-500/20 border-green-500/40 text-green-300"
        }`}>
          {isEarlyLevel ? "Mikrofon: Turkce" : `Mikrofon: ${selectedLang.targetLang}`}
        </div>

        {score > 0 && (
          <div className="rounded-xl px-3 py-1.5 text-xs font-semibold border bg-yellow-500/20 border-yellow-500/40 text-yellow-300">
            Puan: {score}
          </div>
        )}
      </div>

      {/* Avatar */}
      <Suspense fallback={
        <div style={{
          width: "100%", height: "320px", borderRadius: "1rem",
          background: "linear-gradient(180deg, #0a0a1a 0%, #1a0a2e 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "rgba(255,255,255,0.4)", fontSize: "14px"
        }}>
          Koshei yukleniyor...
        </div>
      <KosheiAvatar isSpeaking={playing} />
      </Suspense>

      {/* Durum */}
      <div className="text-center text-sm text-white/50">{statusText}</div>

      {/* Kontroller */}
      <div className="flex flex-wrap gap-2 justify-center">
        {!listening ? (
          <Button onClick={startRecording} disabled={transcribing || loading}>
            Dinle
          </Button>
        ) : (
          <Button onClick={stopRecording} variant="secondary">
            Durdur ve Gonder
          </Button>
        )}
        <Button onClick={() => ask()} variant="secondary" disabled={loading || transcribing || !transcript.trim()}>
          Tekrar Sor
        </Button>
        <Button onClick={silence} variant="secondary">Sustur</Button>
      </div>

      {err && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm">
          {err}
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-white/60">
            Sen {isEarlyLevel ? "(Turkce)" : `(${selectedLang.targetLang})`}:
          </div>
          <div className="mt-2 whitespace-pre-wrap text-sm">
            {transcribing
              ? "Ses analiz ediliyor..."
              : transcript || "Konusmak icin 'Dinle' butonuna bas..."}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-white/60">Koshei:</div>
          <div className="mt-2 whitespace-pre-wrap text-sm">
            {loading ? "Yanit geliyor..." : reply || "Cevap burada..."}
          </div>
          {audioUrl && !loading && (
            <button
              onClick={playAudio}
              className="mt-3 flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/20 transition"
            >
              {playing ? "Caliyor..." : "Sesi Cal"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
