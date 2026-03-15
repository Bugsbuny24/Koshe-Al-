"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      if (mode === "signup") {
        if (password.length < 6) {
          setError("Şifre en az 6 karakter olmalı.");
          return;
        }
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("Kayıt başarılı. Şimdi giriş yapabilirsin.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = "/live";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_18%),linear-gradient(180deg,#030712_0%,#061127_52%,#020617_100%)] text-white">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-8">
        <div className="w-full rounded-[28px] border border-cyan-300/10 bg-white/[0.03] p-6 backdrop-blur-xl">
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">Koshei V1</p>
          <h1 className="mt-2 text-3xl font-semibold">
            {mode === "login" ? "Giriş Yap" : "Kayıt Ol"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Koshei AI konuşma öğretmenini kullanmak için hesabına giriş yap.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm text-slate-200">E-posta</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 text-white outline-none"
                placeholder="ornek@mail.com"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-200">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 text-white outline-none"
                placeholder="En az 6 karakter"
              />
            </div>

            {message && (
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                {message}
              </div>
            )}
            {error && (
              <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-2xl bg-blue-500 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:opacity-50"
            >
              {loading ? "Bekle..." : mode === "login" ? "Giriş Yap" : "Kayıt Ol"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setMessage(""); }}
            className="mt-4 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200 transition hover:bg-white/[0.08]"
          >
            {mode === "login" ? "Hesabın yok mu? Kayıt ol" : "Zaten hesabın var mı? Giriş yap"}
          </button>
        </div>
      </div>
    </main>
  );
}
