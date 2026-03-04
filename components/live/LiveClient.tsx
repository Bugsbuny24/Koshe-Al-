"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

export default function LiveClient() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [reply, setReply] = useState("");
  const [err, setErr] = useState("");

  const recRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.lang = "tr-TR";
    rec.interimResults = true;
    rec.continuous = true;

    rec.onresult = (e: any) => {
      let t = "";
      for (let i = e.resultIndex; i < e.results.length; i++) t += e.results[i][0].transcript;
      setTranscript(t.trim());
    };

    rec.onerror = (e: any) => {
      setErr(e?.error || "STT error");
      setListening(false);
    };

    rec.onend = () => setListening(false);

    recRef.current = rec;
  }, []);

  function speak(text: string) {
    try {
      (window as any).speechSynthesis?.cancel?.();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "tr-TR";
      u.rate = 1.0;
      (window as any).speechSynthesis?.speak?.(u);
    } catch {}
  }

  async function ask() {
    setErr("");
    const msg = transcript.trim();
    if (!msg) return;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({
          targetLang: "English",
          nativeLang: "Turkish",
          level: "A2",
          userName: "Kanka",
          text: msg
        })
      });
      const data = await res.json();
      if (!res.ok || data?.error) throw new Error(data?.error || "chat failed");
      setReply(data.reply || "");
      speak(data.reply || "");
    } catch (e: any) {
      setErr(e?.message || "error");
    }
  }

  function start() {
    setErr("");
    if (!recRef.current) return setErr("Tarayıcı STT desteklemiyor (Chrome/Android önerilir).");
    try { recRef.current.start(); setListening(true); } catch {}
  }

  function stop() {
    try { recRef.current?.stop?.(); } catch {}
    setListening(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {!listening ? <Button onClick={start}>Dinle</Button> : <Button onClick={stop} variant="secondary">Durdur</Button>}
        <Button onClick={ask} variant="secondary">Sor</Button>
        <Button onClick={() => { (window as any).speechSynthesis?.cancel?.(); }} variant="secondary">Sustur</Button>
      </div>

      {err && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm">{err}</div>}

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-white/60">Sen:</div>
          <div className="mt-2 whitespace-pre-wrap">{transcript || "Konuş ya da metin oluşmasını bekle..."}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-white/60">Koshei:</div>
          <div className="mt-2 whitespace-pre-wrap">{reply || "Cevap burada..."}</div>
        </div>
      </div>
    </div>
  );
      }
