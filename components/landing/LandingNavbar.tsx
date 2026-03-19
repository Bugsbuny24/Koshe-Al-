"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/courses", label: "Kurslar" },
  { href: "/universities", label: "Üniversiteler" },
  { href: "/about", label: "Hakkımızda" },
  { href: "/pricing", label: "Fiyatlar" },
];

export default function LandingNavbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/8 bg-[#050816]/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">

        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/30 to-fuchsia-500/30 ring-1 ring-white/10">
            <span className="text-sm font-bold text-white">K</span>
          </div>
          <div className="hidden sm:block">
            <div className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">Koshei AI</div>
            <div className="-mt-0.5 text-base font-semibold text-white">University</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "rounded-xl px-4 py-2 text-sm font-medium transition",
                  active
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-slate-400 hover:text-white transition sm:block"
          >
            Giriş Yap
          </Link>
          <Link
            href="/register"
            className="rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] transition hover:opacity-90"
          >
            Ücretsiz Başla
          </Link>
        </div>

      </div>
    </header>
  );
}
