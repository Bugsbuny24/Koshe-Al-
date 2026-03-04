"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ChatClient() {
  const [text, setText] = useState("");
  const [reply, setReply] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // V1: hedef dil/level basit default; UI’dan seçtiririz
  const payloadBase = {
    targetLang: "English",
    nativeLang: "Turkish",
    level: "A2",
    userName: "Kanka"
  };

  async function send() {
    const msg = text.trim();
    if (!msg || loading) return;

    setLoading(true);
    setReply("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ ...payloadBase, text: msg })
      });
      const data = await res.json();
      if (!res.ok || data?.error) throw new Error(data?.error || "chat failed");
      setReply(data.reply || "");
    } catch (e: any) {
      setReply(`Hata: ${e?.message || "unknown"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Bir şey yaz... (örn: İngilizce pratik yapalım)"
          onKeyDown={(e) => { if (e.key === "Enter") send(); }}
        />
        <Button onClick={send} disabled={loading}>Gönder</Button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 min-h-[120px]">
        <div className="text-sm text-white/60">Koshei:</div>
        <div className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed">
          {reply || (loading ? "Yazıyorum..." : "Hazırım. Hadi başlayalım.")}
        </div>
      </div>
    </div>
  );
}
