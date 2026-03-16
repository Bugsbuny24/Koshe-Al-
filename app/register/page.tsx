"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
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

    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: {
          full_name: trimmedName,
        },
      },
    });

    if (error) {
      setErrorText(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const usernameFallback = trimmedEmail.split("@")[0];

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
    }

    router.push("/onboarding");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-[0_0_80px_rgba(59,130,246,0.08)] lg:grid-cols-2">
          <div className="hidden border-r border-white/10 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-fuchsia-500/10 p-10 lg:block">
            <div className="text-sm uppercase tracking-[0.3em] text-cyan-300">
              Koshei AI
            </div>
            <h1 className="mt-6 text-4xl font-semibold leading-tight">
              Kendi AI
              <br />
              dil öğretmenini
              <br />
              şimdi aç.
            </h1>
            <p className="mt-6 max-w-md text-base leading-8 text-slate-300">
              Kayıt ol, hedef dilini seç, seviyeni belirle ve konuşma pratiğine hemen başla.
            </p>

            <div className="mt-10 grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm text-slate-400">1. Adım</div>
                <div className="mt-1 text-lg font-medium">Hesap oluştur</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm text-slate-400">2. Adım</div>
                <div className="mt-1 text-lg font-medium">Dil ve seviye seç</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm text-slate-400">3. Adım</div>
                <div className="mt-1 text-lg font-medium">Konuşmaya başla</div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="mx-auto max-w-md">
              <div className="mb-8">
                <div className="text-sm uppercase tracking-[0.25em] text-cyan-300">
                  Register
                </div>
                <h2 className="mt-3 text-3xl font-semibold">Yeni hesap oluştur</h2>
                <p className="mt-2 text-sm leading-7 text-slate-400">
                  Kayıt olduktan sonra onboarding akışı başlar.
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Onur Sel"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/30"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Email
                  </label>
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@mail.com"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/30"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
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
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/30"
                  />
                </div>

                {errorText ? (
                  <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                    {errorText}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-5 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Hesap oluşturuluyor..." : "Kayıt Ol"}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-slate-400">
                Zaten hesabın var mı?{" "}
                <Link
                  href="/login"
                  className="font-medium text-cyan-300 hover:text-cyan-200"
                >
                  Giriş yap
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
