"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { LANGUAGES, STAGES } from "@/lib/constants/languages";

const GOALS = [
  { value: "conversation", label: "Günlük Konuşma" },
  { value: "business",     label: "İş Dili" },
  { value: "travel",       label: "Seyahat" },
  { value: "academic",     label: "Akademik" },
  { value: "exam",         label: "Sınav Hazırlığı" },
];

export default function EditProfilePage() {
  const supabase = createClient();

  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving]     = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState("");

  const [fullName,       setFullName]       = useState("");
  const [nativeLanguage, setNativeLanguage] = useState("Turkish");
  const [targetLanguage, setTargetLanguage] = useState("English");
  const [level,          setLevel]          = useState("A1");
  const [goal,           setGoal]           = useState("conversation");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }

      const { data } = await supabase
        .from("profiles")
        .select("full_name,native_language,target_language,difficulty_level,learning_stage")
        .eq("id", user.id)
        .single();

      if (data) {
        setFullName(data.full_name ?? "");
        setNativeLanguage(data.native_language ?? "Turkish");
        setTargetLanguage(data.target_language ?? "English");
        setLevel(data.difficulty_level ?? "A1");
        setGoal(data.learning_stage ?? "conversation");
      }
      setPageLoading(false);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess(false);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }

    const { error: err } = await supabase
      .from("profiles")
      .update({
        full_name:        fullName.trim(),
        native_language:  nativeLanguage,
        target_language:  targetLanguage,
        difficulty_level: level,
        learning_stage:   goal,
      })
      .eq("id", user.id);

    if (err) {
      setError(err.message);
    } else {
      setSuccess(true);
    }
    setSaving(false);
  }

  if (pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050816]">
        <div className="text-slate-400 text-sm">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-xl">

        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/profile"
            className="text-sm text-slate-400 hover:text-white transition"
          >
            ← Profil Dön
          </Link>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-2xl font-bold mb-8">Profili Düzenle</h1>

          <div className="space-y-6">

            {/* Ad Soyad */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Ad Soyad
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40 transition"
                placeholder="Adın ve soyadın"
              />
            </div>

            {/* Ana Dil */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Ana Dil
              </label>
              <select
                value={nativeLanguage}
                onChange={(e) => setNativeLanguage(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-cyan-400/40 transition"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.name}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Hedef Dil */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Öğrendiğin Dil
              </label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-cyan-400/40 transition"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.name}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Seviye */}
            <div>
              <label className="mb-3 block text-sm font-medium text-slate-300">
                Seviye
              </label>
              <div className="flex flex-wrap gap-2">
                {STAGES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setLevel(s)}
                    className={[
                      "rounded-xl border px-4 py-2 text-sm font-medium transition",
                      level === s
                        ? "border-fuchsia-400/40 bg-fuchsia-400/15 text-fuchsia-300"
                        : "border-white/10 bg-white/5 text-slate-400 hover:text-white",
                    ].join(" ")}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Hedef */}
            <div>
              <label className="mb-3 block text-sm font-medium text-slate-300">
                Öğrenme Hedefi
              </label>
              <div className="space-y-2">
                {GOALS.map((g) => (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => setGoal(g.value)}
                    className={[
                      "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition",
                      goal === g.value
                        ? "border-cyan-400/40 bg-cyan-400/10 text-white"
                        : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/8",
                    ].join(" ")}
                  >
                    <span className="flex-1">{g.label}</span>
                    {goal === g.value && (
                      <span className="text-cyan-400 text-xs">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Hata / Başarı */}
            {error && (
              <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                ✓ Profil güncellendi
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(34,211,238,0.2)] transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>

          </div>
        </div>
      </div>
    </main>
  );
}
