"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const supabase = createClient();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
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

    setSuccess("Kayıt başarılı. Giriş yapabilirsin.");
    setLoading(false);
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
        <form
          onSubmit={handleRegister}
          className="w-full rounded-[28px] border border-cyan-300/10 bg-white/[0.03] p-6 backdrop-blur-xl"
        >
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">
            Koshei
          </p>
          <h1 className="mt-3 text-3xl font-semibold">Kayıt Ol</h1>

          <div className="mt-6 space-y-4">
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ad Soyad"
              className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 outline-none"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta"
              type="email"
              className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 outline-none"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifre"
              type="password"
              className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 outline-none"
            />
          </div>

          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
          {success ? <p className="mt-4 text-sm text-emerald-300">{success}</p> : null}

          <button
            disabled={loading}
            className="mt-6 h-12 w-full rounded-2xl bg-blue-500 text-sm font-semibold transition hover:bg-blue-400 disabled:opacity-50"
          >
            {loading ? "Oluşturuluyor..." : "Hesap Oluştur"}
          </button>

          <p className="mt-4 text-sm text-slate-400">
            Zaten hesabın var mı?{" "}
            <Link href="/login" className="text-cyan-300">
              Giriş yap
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
