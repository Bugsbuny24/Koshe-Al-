import Link from "next/link";

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="font-semibold tracking-tight">
            Koshei AI
          </Link>
          <nav className="flex items-center gap-3 text-sm text-white/70">
            <Link className="hover:text-white" href="/dashboard">Dashboard</Link>
            <Link className="hover:text-white" href="/live">Live</Link>
            <Link className="hover:text-white" href="/lesson">Ders</Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
