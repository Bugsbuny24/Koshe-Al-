import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-8xl font-bold bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent mb-4">
          404
        </div>
        <h1 className="text-2xl font-semibold mb-2">Sayfa bulunamadı</h1>
        <p className="text-slate-400 text-sm mb-8">
          Aradığın sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row justify-center">
          <Link
            href="/dashboard"
            className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Dashboard&apos;a Dön
          </Link>
          <Link
            href="/"
            className="rounded-2xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm text-slate-300 transition hover:bg-white/10"
          >
            Ana Sayfa
          </Link>
        </div>
      </div>
    </main>
  );
}
