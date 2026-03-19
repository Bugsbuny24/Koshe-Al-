'use client';

import { usePiAuth } from '@/hooks/usePiAuth';

export default function LoginPage() {
  const { login, loading, error } = usePiAuth();

  return (
    <main className="min-h-screen bg-[#060608] flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[rgba(240,165,0,0.12)] bg-[#111116] p-8 text-center">
        <div className="mb-6 text-5xl">🪐</div>
        <h1 className="mb-2 text-2xl font-bold">Koshei&apos;e Hoş Geldin</h1>
        <p className="mb-8 text-[#8A8680]">Pi Browser ile giriş yaparak başla</p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <button
          onClick={login}
          disabled={loading}
          className="w-full rounded-xl bg-[#F0A500] py-3.5 font-semibold text-[#060608] hover:bg-[#C47F00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-[#060608] border-t-transparent animate-spin" />
              Giriş yapılıyor...
            </>
          ) : (
            '🟣 Pi ile Giriş Yap'
          )}
        </button>

        <p className="mt-6 text-xs text-[#4A4845]">
          Pi Browser&apos;da açmanız gerekmektedir
        </p>
      </div>
    </main>
  );
}
