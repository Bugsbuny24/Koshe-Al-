"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
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
      setErrorText(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-[0_0_80px_rgba(59,130,246,0.08)] lg:grid-cols-2">
          <div className="hidden border-r border-white/10 bg-gradient-to-br from-fuchsia-500/10 via-blue-500/10 to-cyan-500/10 p-10 lg:block">
            <div className="text-sm uppercase tracking-[0.3em] text-cyan-300">
              Koshei AI
            </div>
            <h1 className="mt-6 text-4xl font-semibold leading-tight">
              Konuşarak öğren.
              <br />
              Hata yap.
              <br />
              Geliş.
            </h1>
            <p className="mt-6 max-w-md text-base leading-8 text-slate-300">
              Gerçek konuşma pratiği yap, anında düzeltme al ve 80+ dilde akıcılığını geliştir.
            </p>

            <div className="mt-10 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm text-slate-400">AI Speaking</div>
                <div className="mt-1 text-lg font-medium">Canlı konuşma pratiği</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm text-slate-400">Correction</div>
                <div className="mt-1 text-lg font-medium">Anında hata düzeltme</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm text-slate-400">Memory Engine</div>
                <div className="mt-1 text-lg font-medium">Seni hatırlayan AI öğretmen</div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="mx-auto max-w-md">
              <div className="mb-8">
                <div className="text-sm uppercase tracking-[0.25em] text-cyan-300">
                  Giriş
                </div>
                <h2 className="mt-3 text-3xl font-semibold">Hesabına giriş yap</h2>
                <p className="mt-2 text-sm leading-7 text-slate-400">
                  Koshei AI ile konuşma pratiğine kaldığın yerden devam et.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
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
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Şifreni gir"
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
                  {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-slate-400">
                Hesabın yok mu?{" "}
                <Link
                  href="/register"
                  className="font-medium text-cyan-300 hover:text-cyan-200"
                >
                  Kayıt ol
                </Link>
              </div>

              <div className="mt-10 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-400">
                Giriş yaptıktan sonra onboarding tamamlanmadıysa otomatik olarak yönlendirilirsin.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
