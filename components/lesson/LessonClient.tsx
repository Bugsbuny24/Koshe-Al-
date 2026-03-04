"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LessonClient() {
  const [targetLang, setTargetLang] = useState("English");
  const [level, setLevel] = useState("A2");
  const [topic, setTopic] = useState("Günlük konuşma");
  const [lesson, setLesson] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    setLesson("");

    const prompt = `Bugün ${targetLang} dilinde ${level} seviyesi için "${topic}" konusunda 10 dakikalık mini ders hazırla.
- 4 kısa bölüm: (1) açıklama (2) 6 kelime (3) 3 örnek cümle (4) 5 soruluk mini pratik
- Kullanıcı Türkçe, ama örnekler hedef dilde olsun.
- Ton: sıcak, mizahlı ama disiplinli öğretmen.`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({
          targetLang,
          nativeLang: "Turkish",
          level,
          userName: "Kanka",
          text: prompt
        })
      });
      const data = await res.json();
      if (!res.ok || data?.error) throw new Error(data?.error || "lesson failed");
      setLesson(data.reply || "");
    } catch (e: any) {
      setLesson(`Hata: ${e?.message || "unknown"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2 md:grid-cols-3">
        <Input value={targetLang} onChange={(e) => setTargetLang(e.target.value)} placeholder="Hedef dil (English)" />
        <Input value={level} onChange={(e) => setLevel(e.target.value)} placeholder="Seviye (A1..C2)" />
        <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Konu (örn: travel)" />
      </div>

      <Button onClick={generate} disabled={loading}>
        {loading ? "Hazırlıyorum..." : "Mini ders üret"}
      </Button>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 min-h-[180px] whitespace-pre-wrap">
        {lesson || "Ders burada görünecek."}
      </div>
    </div>
  );
}
