import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* LOGO */}
        <Link href="/" className="text-lg font-semibold text-white">
          Koshei AI
        </Link>

        {/* NAV LINKS */}
        <nav className="flex items-center gap-5">
          <Link
            href="/dashboard"
            className="text-sm text-slate-300 transition hover:text-white"
          >
            Dashboard
          </Link>

          <Link
            href="/live"
            className="text-sm text-slate-300 transition hover:text-white"
          >
            Speak
          </Link>

          <Link
            href="/lesson"
            className="text-sm text-slate-300 transition hover:text-white"
          >
            Lesson
          </Link>

          <Link
            href="/pricing"
            className="text-sm text-slate-300 transition hover:text-white"
          >
            Pricing
          </Link>

          <Link
            href="/feedback"
            className="text-sm text-slate-300 transition hover:text-white"
          >
            Feedback
          </Link>
        </nav>

        {/* ACTION */}
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
          >
            Profile
          </Link>
        </div>
      </div>
    </header>
  );
}
