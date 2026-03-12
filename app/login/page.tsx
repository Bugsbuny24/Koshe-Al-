"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleGoogleLogin() {
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google girişi başarısız.");
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        setMessage("Kayıt başarılı. Şimdi giriş yapabilirsin.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        router.push("/live");
        router.refresh();
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
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">
            Koshei V1
          </p>
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
                className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 text-white outline-none"
                placeholder="••••••••"
              />
            </div>

            {message ? (
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                {message}
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-2xl bg-blue-500 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:opacity-50"
            >
              {loading
                ? "Bekle..."
                : mode === "login"
                ? "Giriş Yap"
                : "Kayıt Ol"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError("");
              setMessage("");
            }}
            className="mt-4 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200 transition hover:bg-white/[0.08]"
          >
            {mode === "login"
              ? "Hesabın yok mu? Kayıt ol"
              : "Zaten hesabın var mı? Giriş yap"}
          </button>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 border-t border-white/10" />
            <p className="text-xs text-slate-400">ya da</p>
            <div className="flex-1 border-t border-white/10" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="mt-4 flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-medium text-slate-100 transition hover:bg-white/[0.1] disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.20454C17.64 8.56636 17.5827 7.95272 17.4764 7.36363H9V10.845H13.8436C13.635 11.97 13.0009 12.9231 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.20454Z" fill="#4285F4"/>
              <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z" fill="#34A853"/>
              <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
              <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
            </svg>
            Google ile Giriş Yap
          </button>
        </div>
      </div>
    </main>
  );
}
