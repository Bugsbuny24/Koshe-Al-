"use client";

import { useState } from "react";

const LANGUAGES = [
  "English", "German", "French", "Spanish", "Italian",
  "Portuguese", "Russian", "Japanese", "Chinese", "Korean",
  "Arabic", "Dutch", "Polish", "Turkish", "Hindi",
];

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

const TOPICS = [
  "Kendini tanıtma", "Alışveriş", "Restoranda sipariş",
  "Yol tarifi", "İş görüşmesi", "Tatil planları",
  "Hava durumu", "Aile ve arkadaşlar", "Hobiler",
  "Sağlık ve doktor", "Telefon konuşması", "Otel rezervasyonu",
];

export default function LessonPage() {
  const [lang, setLang]   = useState("English");
  const [level, setLevel] = useState("A2");
  const [topic, setTopic] = useState("Kendini tanıtma");
  const [lesson, setLesson] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setLoading(true);
    setLesson("");
    setError("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `${lang} dilinde ${level} seviyesi için "${topic}" konusunda kısa bir ders hazırla. Şunları içersin: 1) Konuya giriş (2-3 cümle) 2) 6 önemli kelime veya ifade (${lang} - Türkçe) 3) 3 örnek diyalog cümlesi 4) 3 soruluk mini pratik. Türkçe açıkla, örnekler ${lang} olsun.`,
          }],
          targetLanguage: lang,
          userNativeLanguage: "Turkish",
          level,
          mode: "lesson",
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Hata");
      setLesson(data.reply || "");
    } catch (e: any) {
      setError(e?.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-8 md:px-6">
      <div className="mx-auto max-w-3xl flex flex-col gap-6">

        <div>
          <h1 className="text-3xl font-bold">Ders Al</h1>
          <p className="mt-2 text-slate-400">Dil, seviye ve konu seç — Koshei sana özel bir ders hazırlasın.</p>
        </div>

        {/* Ayarlar */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Dil</label>
            <select
              value={lang}
              onChange={e => setLang(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none"
            >
              {LANGUAGES.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Seviye</label>
            <div className="flex gap-2 flex-wrap">
              {LEVELS.map(l => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    level === l
                      ? "bg-blue-500 text-white"
                      : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Konu</label>
            <div className="flex gap-2 flex-wrap">
              {TOPICS.map(t => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className={`rounded-xl px-3 py-2 text-sm transition ${
                    topic === t
                      ? "bg-blue-500 text-white font-semibold"
                      : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="w-full rounded-2xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Ders hazırlanıyor..." : "Ders Oluştur"}
          </button>
        </div>

        {/* Ders içeriği */}
        {error && (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {lesson && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-semibold text-blue-400">{lang}</span>
              <span className="text-slate-600">·</span>
              <span className="text-sm text-slate-400">{level}</span>
              <span className="text-slate-600">·</span>
              <span className="text-sm text-slate-400">{topic}</span>
            </div>
            <div className="whitespace-pre-wrap text-sm leading-7 text-slate-200">
              {lesson}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
