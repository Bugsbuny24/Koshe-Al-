"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorText("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setErrorText(
        error.message === "Invalid login credentials"
          ? "Email veya şifre hatalı."
          : error.message
      );
      setLoading(false);
      return;
    }

    // window.location kullan — router.push session cookie'yi beklemez
    window.location.href = "/dashboard";
  }

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[90vh] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-[0_0_80px_rgba(59,130,246,0.08)] lg:grid-cols-2">

          {/* Sol panel */}
          <div className="hidden border-r border-white/10 bg-gradient-to-br from-fuchsia-500/10 via-blue-500/10 to-cyan-500/10 p-10 lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-cyan-300">
                Koshei AI University
              </div>
              <h1 className="mt-8 text-4xl font-bold leading-tight">
                AI Mentorun<br />seni bekliyor.
              </h1>
              <p className="mt-4 text-base leading-8 text-slate-300 max-w-sm">
                Giriş yap ve kaldığın yerden devam et. Speaking practice, ders oluşturma ve tüm AI özellikleri seni bekliyor.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { icon: "🎤", text: "Canlı konuşma pratiği" },
                { icon: "🧠", text: "Hata hafızası — geçmişten öğren" },
                { icon: "📊", text: "Anlık speaking skoru" },
                { icon: "🏅", text: "Rozet ve sertifika sistemi" },
              ].map((f) => (
                <div key={f.text} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                  <span className="text-xl">{f.icon}</span>
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
                  Giriş Yap
                </div>
                <h2 className="text-3xl font-bold">Hesabına Giriş Yap</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Hesabın yok mu?{" "}
                  <Link href="/register" className="text-cyan-300 hover:text-cyan-200 font-medium">
                    Kayıt ol
                  </Link>
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
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
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Şifreni gir"
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition"
                  />
                </div>

                {errorText && (
                  <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {errorText}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(168,85,247,0.3)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
