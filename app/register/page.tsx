"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorText("");

    const trimmedEmail = email.trim();
    const trimmedName = fullName.trim();

    if (password.length < 6) {
      setErrorText("Şifre en az 6 karakter olmalı.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: { data: { full_name: trimmedName } },
    });

    if (error) {
      setErrorText(
        error.message.includes("already registered")
          ? "Bu email zaten kayıtlı. Giriş yap."
          : error.message
      );
      setLoading(false);
      return;
    }

    if (data.user) {
      const usernameFallback = trimmedEmail.split("@")[0];

      // Profil oluştur
      await supabase.from("profiles").upsert(
        {
          id: data.user.id,
          email: trimmedEmail,
          full_name: trimmedName,
          username: usernameFallback,
          onboarding_completed: false,
        },
        { onConflict: "id" }
      );

      // KRİTİK: Yeni kullanıcıya başlangıç kredisi ver
      // user_quotas kaydı olmadan hiçbir AI özelliği çalışmaz
      await supabase.from("user_quotas").upsert(
        {
          user_id: data.user.id,
          credits_remaining: 20, // Ücretsiz başlangıç kredisi
          is_active: true,
          plan: "free_trial",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    }

    window.location.href = "/onboarding";
  }

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[90vh] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-[0_0_80px_rgba(59,130,246,0.08)] lg:grid-cols-2">

          {/* Sol panel */}
          <div className="hidden border-r border-white/10 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-fuchsia-500/10 p-10 lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-cyan-300">
                Koshei AI University
              </div>
              <h1 className="mt-8 text-4xl font-bold leading-tight">
                Akademik dil<br />yolculuğuna<br />başla.
              </h1>
              <p className="mt-4 text-base leading-8 text-slate-300 max-w-sm">
                Kayıt ol, 20 ücretsiz kredi kazan ve AI mentorunla hemen konuşmaya başla.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { step: "1", text: "Hesabını oluştur" },
                { step: "2", text: "Dil ve seviyeni seç" },
                { step: "3", text: "20 ücretsiz krediyle başla" },
                { step: "4", text: "AI mentorla konuş" },
              ].map((f) => (
                <div key={f.step} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400/20 text-xs font-bold text-cyan-300">
                    {f.step}
                  </span>
                  <span className="text-sm text-slate-300">{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ panel — form */}
          <div className="p-8 sm:p-12">
            <div className="mx-auto max-w-sm">
              <div className="mb-10">
                <div className="text-xs uppercase tracking-[0.25em] text-cyan-300 mb-3">
                  Kayıt Ol
                </div>
                <h2 className="text-3xl font-bold">Hesap Oluştur</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Zaten hesabın var mı?{" "}
                  <Link href="/login" className="text-cyan-300 hover:text-cyan-200 font-medium">
                    Giriş yap
                  </Link>
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Adın ve soyadın"
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Email
                  </label>
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@mail.com"
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Şifre
                  </label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="En az 6 karakter"
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition"
                  />
                </div>

                {errorText && (
                  <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {errorText}
                  </div>
                )}

                {/* Ücretsiz kredi badge */}
                <div className="flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-500/8 px-4 py-3 text-sm text-emerald-300">
                  <span>🎁</span>
                  <span>Kayıt olunca <strong>20 ücretsiz kredi</strong> kazanırsın</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(168,85,247,0.3)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Hesap oluşturuluyor..." : "Kayıt Ol ve Başla"}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
