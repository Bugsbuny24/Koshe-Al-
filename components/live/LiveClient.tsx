"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function LiveClient() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [reply, setReply] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  const recRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.lang = "tr-TR";
    rec.interimResults = true;
    rec.continuous = true;

    rec.onresult = (e: any) => {
      let t = "";
      for (let i = e.resultIndex; i < e.results.length; i++)
        t += e.results[i][0].transcript;
      setTranscript(t.trim());
    };

    rec.onerror = (e: any) => {
      setErr(e?.error || "STT error");
      setListening(false);
    };

    rec.onend = () => setListening(false);
    recRef.current = rec;
  }, []);

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
          targetLang: "English",
          nativeLang: "Turkish",
          level: "A2",
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
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      }
    } catch (e: any) {
      setErr(e?.message || "error");
    } finally {
      setLoading(false);
    }
  }

  function playAudio() {
    if (!audioUrl) return;
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.onplay = () => setPlaying(true);
    audio.onended = () => setPlaying(false);
    audio.onerror = () => setPlaying(false);
    audio.play();
  }

  function start() {
    setErr("");
    if (!recRef.current)
      return setErr("Tarayıcı mikrofonu desteklemiyor (Chrome önerilir).");
    try {
      recRef.current.start();
      setListening(true);
    } catch {}
  }

  function stop() {
    try { recRef.current?.stop?.(); } catch {}
    setListening(false);
  }

  function silence() {
    audioRef.current?.pause?.();
    setPlaying(false);
    (window as any).speechSynthesis?.cancel?.();
  }

  return (
    <div className="space-y-4">
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
