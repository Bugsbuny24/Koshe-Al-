"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/courses", label: "Courses" },
  { href: "/live", label: "Speak" },
  { href: "/lesson", label: "Lesson" },
  { href: "/pricing", label: "Pricing" },
  { href: "/feedback", label: "Feedback" },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/70 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/30 to-fuchsia-500/30 ring-1 ring-white/10 shadow-[0_0_30px_rgba(59,130,246,0.25)]">
            <span className="text-sm font-bold text-white">K</span>
          </div>
          <div className="hidden sm:block">
            <div className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">
              Koshei AI
            </div>
            <div className="-mt-1 text-lg font-semibold text-white">
              University
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "rounded-2xl px-4 py-2 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.08)] ring-1 ring-white/10"
                    : "text-slate-400 hover:bg-white/5 hover:text-white",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/profile"
            className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 sm:inline-flex"
          >
            Profile
          </Link>

          <Link
            href="/live"
            className="inline-flex rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_30px_rgba(34,211,238,0.35)] transition hover:opacity-90"
          >
            Start
          </Link>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-3 md:hidden sm:px-6">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "whitespace-nowrap rounded-2xl px-4 py-2 text-sm font-medium transition-all",
                active
                  ? "bg-white/10 text-white ring-1 ring-white/10"
                  : "bg-white/5 text-slate-400 hover:text-white",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
