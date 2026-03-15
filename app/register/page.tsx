"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalı.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: fullName || email.split("@")[0],
        email,
        role: "user",
      });
    }

    setSuccess("Kayıt başarılı! Giriş yapılıyor...");
    setLoading(false);

    // Hard redirect
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_18%),linear-gradient(180deg,#030712_0%,#061127_52%,#020617_100%)] text-white">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-8">
        <form
          onSubmit={handleRegister}
          className="w-full rounded-[28px] border border-cyan-300/10 bg-white/[0.03] p-6 backdrop-blur-xl"
        >
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">Koshei V1</p>
          <h1 className="mt-2 text-3xl font-semibold">Kayıt Ol</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Hesap oluştur, dil öğrenmeye hemen başla.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm text-slate-200">Ad Soyad</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Adın Soyadın"
                className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 text-white outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-200">E-posta</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@mail.com"
                type="email"
                required
                className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 text-white outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-200">Şifre</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="En az 6 karakter"
                type="password"
                required
                minLength={6}
                className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 text-white outline-none"
              />
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
          {success && <p className="mt-4 text-sm text-emerald-300">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 h-12 w-full rounded-2xl bg-blue-500 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:opacity-50"
          >
            {loading ? "Oluşturuluyor..." : "Hesap Oluştur"}
          </button>

          <p className="mt-4 text-center text-sm text-slate-400">
            Zaten hesabın var mı?{" "}
            <Link href="/login" className="text-cyan-300 hover:underline">
              Giriş yap
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
