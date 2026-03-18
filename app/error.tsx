"use client";

import Link from "next/link";

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {

  return (
    <html lang="tr">
      <body className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-2xl font-semibold mb-2">Bir hata oluştu</h1>
          <p className="text-slate-400 text-sm mb-8">
            Beklenmeyen bir sorun çıktı. Sayfayı yenilemeyi deneyin.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row justify-center">
            <button
              onClick={reset}
              className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Tekrar Dene
            </button>
            <Link
              href="/dashboard"
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm text-slate-300 transition hover:bg-white/10"
            >
              Dashboard&apos;a Dön
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
