"use client";

import Link from "next/link";
import { useState } from "react";
import { usePiAuth } from "@/lib/pi-hooks";

export default function Header() {
  const { user, loading, error, login } = usePiAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#0a0a1a] border-b border-purple-900/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-purple-500/25">
              K
            </div>
            <div>
              <span className="text-white font-bold text-lg tracking-tight">KOSHEİ</span>
              <span className="block text-xs text-purple-400 leading-none -mt-0.5">Pi Network AI OS</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: "/learn", label: "🎓 Öğren", color: "hover:text-blue-400" },
              { href: "/build", label: "🤖 Geliştir", color: "hover:text-green-400" },
              { href: "/deploy", label: "🚀 Yayınla", color: "hover:text-yellow-400" },
              { href: "/earn", label: "💰 Kazan", color: "hover:text-pink-400" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm text-zinc-400 ${item.color} hover:bg-white/5 transition-colors`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Button */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                  {user.user.username.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm text-zinc-300">
                  @{user.user.username}
                </span>
              </div>
            ) : (
              <button
                onClick={login}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-60 shadow-lg shadow-purple-500/25"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>π</span>
                )}
                Pi ile Giriş
              </button>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-zinc-400 hover:text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <nav className="md:hidden py-3 border-t border-purple-900/30">
            {[
              { href: "/learn", label: "🎓 Öğren" },
              { href: "/build", label: "🤖 Geliştir" },
              { href: "/deploy", label: "🚀 Yayınla" },
              { href: "/earn", label: "💰 Kazan" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Auth Error */}
        {error && (
          <div className="pb-3 text-xs text-red-400">{error}</div>
        )}
      </div>
    </header>
  );
}
