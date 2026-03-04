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

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function LiveClient() {
  const [listening, setListening]   = useState(false);
  const [transcript, setTranscript] = useState("");
  const [reply, setReply]           = useState("");
  const [err, setErr]               = useState("");
  const [loading, setLoading]       = useState(false);
  const [audioUrl, setAudioUrl]     = useState<string | null>(null);
  const [playing, setPlaying]       = useState(false);

  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [level, setLevel]               = useState("A2");
  const [showLangPicker, setShowLangPicker] = useState(false);

  const recRef   = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.lang = selectedLang.code;
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
  }, [selectedLang]);

  async function ask() {
    setErr("");
    setAudioUrl(null);
    const msg = transcript.trim();
    if (!msg) return;
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
        setAudioUrl(URL.createObjectURL(blob));
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
    if (!recRef.current) return setErr("Tarayıcı mikrofonu desteklemiyor (Chrome önerilir).");
    try { recRef.current.start(); setListening(true); } catch {}
  }

  function stop()    { try { recRef.current?.stop?.(); } catch {} setListening(false); }
  function silence() { audioRef.current?.pause?.(); setPlaying(false); }

  return (
    <div className="space-y-4">

      {/* Dil & Seviye Seçici */}
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

        <div className="flex gap-1">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
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
      </div>

      {/* Avatar */}
      <Suspense fallback={
        <div style={{
          width: "100%", height: "320px", borderRadius: "1rem",
          background: "linear-gradient(180deg, #0a0a1a 0%, #1a0a2e 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "rgba(255,255,255,0.4)", fontSize: "14px"
        }}>
          Koshei yükleniyor...
        </div>
      }>
        <KosheiAvatar isSpeaking={playing} />
      </Suspense>

      {/* Kontroller */}
      <div className="flex flex-wrap gap-2">
        {!listening ? (
          <Button onClick={start}>🎙️ Dinle</Button>
        ) : (
          <Button onClick={stop} variant="secondary">⏹ Durdur</Button>
        )}
        <Button onClick={ask} variant="secondary" disabled={loading}>
          {loading ? "⏳ Düşünüyor..." : "✉️ Sor"}
        </Button>
        <Button onClick={silence} variant="secondary">🔇 Sustur</Button>
      </div>

      {err && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm">
          {err}
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-white/60">Sen:</div>
          <div className="mt-2 whitespace-pre-wrap">
            {transcript || "Konuş ya da metin oluşmasını bekle..."}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-white/60">Koshei:</div>
          <div className="mt-2 whitespace-pre-wrap">
            {loading ? "⏳ Yanıt geliyor..." : reply || "Cevap burada..."}
          </div>
          {audioUrl && !loading && (
            <button
              onClick={playAudio}
              className="mt-3 flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/20 transition"
            >
              {playing ? "🔊 Çalıyor..." : "▶️ Sesi Çal"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
           }
