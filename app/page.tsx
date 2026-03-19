import React from 'react';
import Link from 'next/link';
import LandingNavbar from '@/components/landing/LandingNavbar';

const faculties = [
  {
    title: "Fen Bilimleri",
    color: "bg-blue-600",
    textColor: "text-white",
    items: ["Matematik", "Fizik", "Kimya", "Biyoloji"],
    emoji: "⚗️",
    icons: ["🔢", "⚛️", "🧪", "🧬"],
  },
  {
    title: "Mühendislik",
    color: "bg-orange-500",
    textColor: "text-white",
    items: ["Bilgisayar", "Makine", "Elektrik", "İnşaat"],
    emoji: "⚙️",
    icons: ["💻", "⚙️", "⚡", "🏗️"],
  },
  {
    title: "Beşeri Bilimler",
    color: "bg-red-700",
    textColor: "text-white",
    items: ["Felsefe", "Tarih", "Edebiyat", "Sanat"],
    emoji: "📚",
    icons: ["🤔", "🏛️", "📖", "🎨"],
  },
  {
    title: "Sosyal Bilimler",
    color: "bg-red-500",
    textColor: "text-white",
    items: ["Psikoloji", "Sosyoloji", "Ekonomi", "Siyaset"],
    emoji: "🌍",
    icons: ["🧠", "👥", "📊", "⚖️"],
  },
  {
    title: "Tıp (Temel Bilimler)",
    color: "bg-green-700",
    textColor: "text-white",
    items: ["Anatomi", "Fizyoloji", "Biyokimya", "Patoloji"],
    emoji: "🎓",
    icons: ["🦴", "🫁", "🧪", "🔬"],
  },
  {
    title: "Tıp (Klinik Bilimler)",
    color: "bg-blue-500",
    textColor: "text-white",
    items: ["Anatomi", "Nörobilim", "Farmakoloji"],
    emoji: "❤️",
    icons: ["🫀", "🧬", "💊"],
  },
  {
    title: "Yabancı Diller",
    color: "bg-yellow-500",
    textColor: "text-white",
    items: ["İngilizce", "Fransızca", "Almanca", "İtalyanca"],
    emoji: "🌏",
    icons: ["🇬🇧", "🇫🇷", "🇩🇪", "🇮🇹"],
  },
  {
    title: "Hukuk & İşletme",
    color: "bg-amber-800",
    textColor: "text-white",
    items: ["Hukuk", "İşletme", "Kamu Yönetimi"],
    emoji: "⚖️",
    icons: ["⚖️", "💼", "🏛️"],
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <LandingNavbar />

      {/* ── Hero Section ── */}
      <section
        className="relative w-full overflow-hidden"
        style={{
          minHeight: "calc(100vh - 64px)",
          background:
            "linear-gradient(180deg, #87CEEB 0%, #b8e4f9 30%, #d6f0fd 55%, #e8f8ff 70%, #f5fbff 85%, #ffffff 100%)",
        }}
      >
        {/* Cloud shapes */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div
            className="absolute rounded-full bg-white opacity-70 blur-2xl"
            style={{ width: 320, height: 120, top: "8%", left: "5%" }}
          />
          <div
            className="absolute rounded-full bg-white opacity-60 blur-2xl"
            style={{ width: 260, height: 100, top: "12%", left: "15%" }}
          />
          <div
            className="absolute rounded-full bg-white opacity-70 blur-2xl"
            style={{ width: 300, height: 110, top: "5%", right: "8%" }}
          />
          <div
            className="absolute rounded-full bg-white opacity-60 blur-2xl"
            style={{ width: 200, height: 80, top: "14%", right: "18%" }}
          />
          <div
            className="absolute rounded-full bg-white opacity-50 blur-3xl"
            style={{ width: 400, height: 150, top: "2%", left: "38%" }}
          />
        </div>

        {/* Left building silhouette */}
        <div className="absolute bottom-0 left-0 pointer-events-none select-none hidden lg:block">
          <svg viewBox="0 0 220 380" width="220" height="380" fill="none">
            <rect x="30" y="120" width="60" height="260" fill="#2d4a7a" opacity="0.85" />
            <rect x="20" y="160" width="20" height="220" fill="#1e3560" opacity="0.7" />
            <rect x="90" y="180" width="40" height="200" fill="#3a5f9a" opacity="0.7" />
            {[130,150,170,190,210,230,250,270,290,310,330].map((y, i) => (
              <React.Fragment key={i}>
                <rect x="36" y={y} width="12" height="12" rx="2" fill="#7eb8f7" opacity="0.6" />
                <rect x="56" y={y} width="12" height="12" rx="2" fill="#7eb8f7" opacity="0.5" />
                <rect x="76" y={y} width="12" height="12" rx="2" fill="#7eb8f7" opacity="0.4" />
              </React.Fragment>
            ))}
            <path d="M30 120 L60 80 L90 120Z" fill="#2d4a7a" opacity="0.9" />
          </svg>
        </div>

        {/* Right building silhouette */}
        <div className="absolute bottom-0 right-0 pointer-events-none select-none hidden lg:block">
          <svg viewBox="0 0 260 400" width="260" height="400" fill="none">
            <rect x="80" y="80" width="80" height="320" fill="#8B4513" opacity="0.85" />
            <rect x="60" y="180" width="30" height="220" fill="#6B3410" opacity="0.7" />
            <rect x="160" y="160" width="40" height="240" fill="#9B5523" opacity="0.7" />
            <path d="M80 80 L120 40 L160 80Z" fill="#6B3410" opacity="0.9" />
            <rect x="100" y="50" width="40" height="30" fill="#8B4513" opacity="0.8" />
            <circle cx="120" cy="42" r="14" fill="#c8a46e" opacity="0.6" />
            {[100,125,150,175,200,225,250,275,300,325,350].map((y, i) => (
              <React.Fragment key={i}>
                <rect x="88" y={y} width="14" height="14" rx="2" fill="#f5d98b" opacity="0.55" />
                <rect x="110" y={y} width="14" height="14" rx="2" fill="#f5d98b" opacity="0.45" />
                <rect x="132" y={y} width="14" height="14" rx="2" fill="#f5d98b" opacity="0.35" />
              </React.Fragment>
            ))}
          </svg>
        </div>

        {/* Floating educational icons */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <span className="absolute text-3xl animate-bounce" style={{ top: "10%", left: "22%", animationDuration: "3s" }}>⚛️</span>
          <span className="absolute text-2xl animate-bounce" style={{ top: "6%", left: "32%", animationDuration: "4s", animationDelay: "0.5s" }}>⚙️</span>
          <span className="absolute text-4xl animate-bounce" style={{ top: "4%", right: "32%", animationDuration: "3.5s", animationDelay: "1s" }}>🎓</span>
          <span className="absolute text-2xl animate-bounce" style={{ top: "14%", right: "22%", animationDuration: "4s", animationDelay: "0.3s" }}>✏️</span>
          <span className="absolute text-2xl animate-bounce" style={{ top: "18%", left: "40%", animationDuration: "5s", animationDelay: "0.8s" }}>✨</span>
        </div>

        {/* Central hero content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-10 pb-16" style={{ minHeight: "calc(100vh - 64px)" }}>
          {/* Open Book illustration */}
          <div className="relative mb-6">
            {/* Glow behind book */}
            <div
              className="absolute inset-0 rounded-full blur-3xl"
              style={{
                background: "radial-gradient(circle, rgba(255,220,80,0.55) 0%, rgba(255,160,20,0.3) 40%, transparent 70%)",
                transform: "scale(1.5)",
              }}
            />
            <svg
              viewBox="0 0 320 200"
              className="relative z-10 drop-shadow-2xl"
              style={{ width: "min(360px, 80vw)", height: "auto" }}
              fill="none"
            >
              {/* Book base shadow */}
              <ellipse cx="160" cy="185" rx="110" ry="12" fill="rgba(0,0,0,0.12)" />

              {/* Left page */}
              <path
                d="M160 170 Q130 140 90 110 Q60 88 30 80 L30 40 Q60 48 90 70 Q130 100 160 130Z"
                fill="#fff8e7"
                stroke="#d4b483"
                strokeWidth="1.5"
              />
              <path d="M155 165 Q128 137 88 107 Q60 86 34 78" stroke="#e8d5a3" strokeWidth="0.8" opacity="0.8" />
              <path d="M150 158 Q124 132 84 102 Q58 82 38 76" stroke="#e8d5a3" strokeWidth="0.8" opacity="0.6" />
              <path d="M145 151 Q120 127 80 97 Q56 78 42 74" stroke="#e8d5a3" strokeWidth="0.8" opacity="0.4" />

              {/* Right page */}
              <path
                d="M160 170 Q190 140 230 110 Q260 88 290 80 L290 40 Q260 48 230 70 Q190 100 160 130Z"
                fill="#fff8e7"
                stroke="#d4b483"
                strokeWidth="1.5"
              />
              <path d="M165 165 Q192 137 232 107 Q260 86 286 78" stroke="#e8d5a3" strokeWidth="0.8" opacity="0.8" />
              <path d="M170 158 Q196 132 236 102 Q262 82 282 76" stroke="#e8d5a3" strokeWidth="0.8" opacity="0.6" />
              <path d="M175 151 Q200 127 240 97 Q264 78 278 74" stroke="#e8d5a3" strokeWidth="0.8" opacity="0.4" />

              {/* Book spine */}
              <path d="M155 130 Q158 145 160 170 Q162 145 165 130" fill="#d4b483" />

              {/* Light rays from spine */}
              {[...Array(9)].map((_, i) => {
                const angle = -80 + i * 20;
                const rad = (angle * Math.PI) / 180;
                const len = 85 + (i % 2) * 15;
                return (
                  <line
                    key={i}
                    x1="160"
                    y1="140"
                    x2={160 + Math.cos(rad) * len}
                    y2={140 + Math.sin(rad) * len}
                    stroke="rgba(255,220,80,0.55)"
                    strokeWidth={2 - i * 0.1}
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-3 tracking-tight leading-tight">
            Geleceğe Akademik Yolculuk
          </h1>
          <p className="text-base md:text-lg text-blue-700 font-semibold mb-8 max-w-xl">
            AI destekli öğrenme ile hayalindeki üniversiteye ve kariyere ulaş
          </p>
        </div>
      </section>

      {/* ── Faculty Grid ── */}
      <section className="max-w-7xl mx-auto px-4 py-10 -mt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {faculties.map((fac, index) => (
            <div
              key={index}
              className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-200 bg-white border border-gray-100 cursor-pointer hover:-translate-y-1 transform transition-transform"
            >
              {/* Colored header */}
              <div className={`${fac.color} px-4 py-3 flex items-center justify-between`}>
                <h2 className={`font-bold text-base md:text-lg ${fac.textColor} leading-tight`}>
                  {fac.title}
                </h2>
                <span className="text-2xl">{fac.emoji}</span>
              </div>

              {/* Icons row */}
              <div className="flex items-center gap-3 px-4 pt-3 pb-1">
                {fac.icons.slice(0, 4).map((icon, i) => (
                  <span key={i} className="text-xl">{icon}</span>
                ))}
              </div>

              {/* Items list */}
              <div className="px-4 pb-4 pt-1">
                <p className="text-xs text-gray-600 leading-relaxed">
                  {fac.items.map((item, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <span className="mx-1 text-gray-400">•</span>}
                      {item}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="text-center py-12 bg-gray-50 border-t border-gray-100 mt-4">
        <h3 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">
          Hayalindeki Bölümü Keşfet,{" "}
          <em className="text-blue-600 not-italic font-extrabold">Hemen Başla!</em>
        </h3>
        <p className="text-gray-500 mb-8 text-sm">
          Binlerce öğrenci zaten yolculuğuna başladı
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/universities"
            className="px-8 py-4 bg-blue-900 text-white rounded-full font-bold text-base hover:bg-blue-800 transition-colors shadow-lg inline-flex items-center gap-2"
          >
            Üniversitelere Göz At
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="currentColor">
              <path d="M8 11L3 6h10L8 11z" />
            </svg>
          </Link>
          <Link
            href="/courses"
            className="px-8 py-4 bg-orange-500 text-white rounded-full font-bold text-base hover:bg-orange-600 transition-colors shadow-lg inline-flex items-center gap-2"
          >
            Kursları İncele
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="currentColor">
              <path d="M8 11L3 6h10L8 11z" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
