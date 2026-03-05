"use client";

import { useRef, useState, useEffect, lazy, Suspense } from "react";
import { Button } from "@/components/ui/Button";

const KosheiAvatar = lazy(() => import("@/components/avatar/KosheiAvatar"));

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

// A1/A2/B1 = Türkçe konuş, B2+ = hedef dil
const EARLY_LEVELS = ["A1", "A2", "B1"];
const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2"];

export default function LiveClient() {
  const [listening, setListening]   = useState(false);
  const [transcript, setTranscript] = useState("");
  const [reply, setReply]           = useState("");
  const [err, setErr]               = useState("");
  const [loading, setLoading]       = useState(false);
  const [audioUrl, setAudioUrl]     = useState<string | null>(null);
  const [playing, setPlaying]       = useState(false);

  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [level, setLevel]               = useState("A1");
  const [showLangPicker, setShowLangPicker] = useState(false);

  const recRef        = useRef<any>(null);
  const audioRef      = useRef<HTMLAudioElement | null>(null);
  const transcriptRef = useRef("");

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  // STT dili seviyeye göre otomatik ayarlanır
  const sttLang = EARLY_LEVELS.includes(level) ? "tr-TR" : selectedLang.code;
  const isEarlyLevel = EARLY_LEVELS.includes(level);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.lang = sttLang; // seviyeye göre TR veya hedef dil
    rec.interimResults = true;
    rec.continuous = true;

    rec.onresult = (e: any) => {
      let t = "";
      for (let i = e.resultIndex; i < e.results.length; i++)
        t += e.results[i][0].transcript;
      setTranscript(t.trim());
    };
    rec.onerror = (e: any) => { setErr(e?.error || "STT error"); setListening(false); };
    rec.onend   = () => setListening(false);

    recRef.current = rec;
  }, [selectedLang, level, sttLang]);

  async function ask(overrideMsg?: string) {
    const msg = (overrideMsg ?? transcript).trim();
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

      const ttsRes = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: replyText }),
      });
      if (ttsRes.ok) {
        const contentType = ttsRes.headers.get("Content-Type") || "audio/wav";
        const arrayBuf = await ttsRes.arrayBuffer();
        const blob = new Blob([arrayBuf], { type: contentType });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        // Otomatik oynat
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onplay  = () => setPlaying(true);
        audio.onended = () => setPlaying(false);
        audio.onerror = () => setPlaying(false);
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
    audioRef.current = audio;
    audio.onplay  = () => setPlaying(true);
    audio.onended = () => setPlaying(false);
    audio.onerror = () => setPlaying(false);
    audio.play();
  }

  function start() {
    setErr("");
    setTranscript("");
    if (!recRef.current) return setErr("Tarayici mikrofonu desteklemiyor (Chrome onerilir).");
    try { recRef.current.start(); setListening(true); } catch {}
  }

  function stop() {
    try { recRef.current?.stop?.(); } catch {}
    setListening(false);
    setTimeout(() => {
      const t = transcriptRef.current.trim();
      if (t) ask(t);
    }, 400);
  }

  function silence() { audioRef.current?.pause?.(); setPlaying(false); }

  return (
    <div className="space-y-4">

      {/* Dil & Seviye Secici */}
      <div className="flex flex-wrap items-center gap-2">

        {/* Dil */}
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

        {/* Seviye */}
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

        {/* Mikrofon dili gostergesi */}
        <div className={`rounded-xl px-3 py-1.5 text-xs font-semibold border ${
          isEarlyLevel
            ? "bg-orange-500/20 border-orange-500/40 text-orange-300"
            : "bg-green-500/20 border-green-500/40 text-green-300"
        }`}>
          {isEarlyLevel ? "Mikrofon: Turkce" : `Mikrofon: ${selectedLang.targetLang}`}
        </div>
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
      }>
        <KosheiAvatar isSpeaking={playing} />
      </Suspense>

      {/* Kontroller */}
      <div className="flex flex-wrap gap-2">
        {!listening ? (
          <Button onClick={start}>Dinle</Button>
        ) : (
          <Button onClick={stop} variant="secondary">Durdur</Button>
        )}
        <Button onClick={() => ask()} variant="secondary" disabled={loading || !transcript.trim()}>
          {loading ? "Dusunuyor..." : "Sor"}
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
            Sen {isEarlyLevel ? "(Turkce konusuyorsun)" : `(${selectedLang.targetLang} pratik)`}:
          </div>
          <div className="mt-2 whitespace-pre-wrap">
            {transcript || "Konus ya da metin olusmasini bekle..."}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-white/60">Koshei:</div>
          <div className="mt-2 whitespace-pre-wrap">
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
