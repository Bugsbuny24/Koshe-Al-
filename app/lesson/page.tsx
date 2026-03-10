"use client";

import { useMemo, useState } from "react";

const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
const topics = [
  "Kendini tanıtma",
  "Alışveriş",
  "Restoranda sipariş",
  "Yol tarifi",
  "İş görüşmesi",
  "Tatil planları",
  "Hava durumu",
  "Aile ve arkadaşlar",
  "Hobiler",
  "Sağlık ve doktor",
  "Telefon konuşması",
  "Otel rezervasyonu",
];

export default function LessonPage() {
  const [language, setLanguage] = useState("English");
  const [level, setLevel] = useState("A2");
  const [selectedTopic, setSelectedTopic] = useState("Kendini tanıtma");
  const [lessonReady, setLessonReady] = useState(false);

  const preview = useMemo(() => {
    return {
      title: `${selectedTopic} • ${level}`,
      target: "Kısa, doğal ve konuşma odaklı mikro ders",
      steps: [
        "Önce örnek cümleleri dinle",
        "Sonra kendi cevabını kur",
        "Koshei seni düzeltsin",
        "Aynı konuyu biraz daha zor seviyede tekrar et",
      ],
    };
  }, [selectedTopic, level]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_18%),linear-gradient(180deg,#030712_0%,#061127_52%,#020617_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-8">
        <header className="mb-5 rounded-[28px] border border-cyan-300/10 bg-white/[0.03] p-5 backdrop-blur md:p-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">
            Lesson Generator
          </p>
          <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Ders AI</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
            Dili, seviyeyi ve konuşma konusunu seç. Koshei sana konuşma pratiği
            için sade ve kullanışlı bir ders akışı hazırlasın.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-12">
          <section className="md:col-span-7 rounded-[28px] border border-cyan-300/10 bg-white/[0.03] p-5 backdrop-blur md:p-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Dil
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 text-white outline-none"
              >
                <option>English</option>
                <option>Deutsch</option>
                <option>Français</option>
                <option>Español</option>
              </select>
            </div>

            <div className="mt-6">
              <label className="mb-3 block text-sm font-medium text-slate-200">
                Seviye
              </label>
              <div className="flex flex-wrap gap-2">
                {levels.map((item) => {
                  const active = item === level;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setLevel(item)}
                      className={[
                        "rounded-2xl px-4 py-2.5 text-sm font-medium transition",
                        active
                          ? "bg-blue-500 text-white shadow-[0_0_24px_rgba(59,130,246,0.35)]"
                          : "border border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.08]",
                      ].join(" ")}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-3 block text-sm font-medium text-slate-200">
                Konu
              </label>
              <div className="flex flex-wrap gap-2">
                {topics.map((topic) => {
                  const active = topic === selectedTopic;
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => setSelectedTopic(topic)}
                      className={[
                        "rounded-2xl px-4 py-2.5 text-sm transition",
                        active
                          ? "border border-cyan-300/15 bg-cyan-400/12 text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.18)]"
                          : "border border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.08]",
                      ].join(" ")}
                    >
                      {topic}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setLessonReady(true)}
              className="mt-7 w-full rounded-2xl bg-blue-500 px-5 py-4 text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              Ders Oluştur
            </button>
          </section>

          <aside className="md:col-span-5 rounded-[28px] border border-cyan-300/10 bg-white/[0.03] p-5 backdrop-blur md:p-6">
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">
              Lesson Preview
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              {preview.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Dil: {language}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-300">
              Hedef: {preview.target}
            </p>

            <div className="mt-5 space-y-3">
              {preview.steps.map((step, index) => (
                <div
                  key={step}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-sm font-semibold text-cyan-200">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-6 text-slate-200">{step}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-cyan-300/12 bg-cyan-400/8 px-4 py-4 text-sm text-cyan-50">
              {lessonReady
                ? "Ders hazır. Şimdi bu akışı live practice ekranına bağlayabiliriz."
                : "Konuyu seç ve ders oluştur. Sağ panelde dersin akışını gör."}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
