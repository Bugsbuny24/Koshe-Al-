"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/courses", label: "Kurslar" },
  { href: "/universities", label: "Üniversiteler" },
  { href: "/about", label: "Hakkımızda" },
  { href: "/login", label: "Giriş Yap" },
];

export default function LandingNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-fuchsia-500 flex items-center justify-center shadow-md">
            <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none">
              <circle cx="20" cy="20" r="18" fill="white" fillOpacity="0.2" />
              <path d="M10 24 Q14 12 20 10 Q26 12 30 24" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <circle cx="20" cy="27" r="4" fill="white" fillOpacity="0.85" />
              <circle cx="14" cy="16" r="2.5" fill="white" fillOpacity="0.6" />
              <circle cx="26" cy="16" r="2.5" fill="white" fillOpacity="0.6" />
            </svg>
          </div>
          <div>
            <div className="font-extrabold text-gray-900 text-lg leading-tight tracking-tight">
              Koshei-Al
            </div>
            <div className="text-[10px] text-gray-500 leading-none font-medium">
              Geleceğe Akademik Yolculuk
            </div>
          </div>
        </Link>

        {/* Nav items */}
        <nav className="hidden md:flex items-center gap-7">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "text-sm font-semibold transition-colors pb-1",
                  active
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-700 hover:text-blue-600",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA button */}
        <Link
          href="/register"
          className="bg-orange-500 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-orange-600 active:scale-95 transition-all shadow-md"
        >
          Kayıt Ol
        </Link>
      </div>
    </header>
  );
}
