'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

function StarField() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const stars = Array.from({ length: 120 }, () => {
      const star = document.createElement('div');
      const size = Math.random() * 2 + 0.5;
      star.className = 'star';
      star.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        --duration: ${Math.random() * 3 + 2}s;
        --delay: ${Math.random() * 4}s;
      `;
      return star;
    });

    stars.forEach((s) => container.appendChild(s));
    return () => stars.forEach((s) => s.remove());
  }, []);

  return <div ref={containerRef} className="stars-bg" />;
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <StarField />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-accent-green/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Mascot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, type: 'spring' }}
          className="mb-8 flex justify-center"
        >
          <div className="animate-float">
            <svg width="100" height="110" viewBox="0 0 100 110" fill="none">
              {/* Graduation hat */}
              <rect x="20" y="12" width="60" height="6" rx="2" fill="#F0A500" />
              <polygon points="50,2 20,18 80,18" fill="#F0A500" />
              <line x1="80" y1="12" x2="90" y2="30" stroke="#F0A500" strokeWidth="2.5" />
              <circle cx="91" cy="32" r="4" fill="#F0A500" />
              {/* Head */}
              <rect x="25" y="22" width="50" height="45" rx="12" fill="#1a1f2e" stroke="#3D7BFF" strokeWidth="1.5" />
              {/* Eyes */}
              <rect x="35" y="35" width="10" height="10" rx="3" fill="#3D7BFF" />
              <rect x="55" y="35" width="10" height="10" rx="3" fill="#3D7BFF" />
              <rect x="38" y="38" width="4" height="4" rx="1" fill="white" opacity="0.8" />
              <rect x="58" y="38" width="4" height="4" rx="1" fill="white" opacity="0.8" />
              {/* Mouth */}
              <path d="M40 55 Q50 62 60 55" stroke="#00D16C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              {/* Body */}
              <rect x="30" y="68" width="40" height="30" rx="8" fill="#1a1f2e" stroke="#3D7BFF" strokeWidth="1.5" />
              {/* Circuit lines on body */}
              <line x1="40" y1="78" x2="60" y2="78" stroke="#3D7BFF" strokeWidth="1" opacity="0.5" />
              <line x1="40" y1="85" x2="55" y2="85" stroke="#00D16C" strokeWidth="1" opacity="0.5" />
              <circle cx="62" cy="85" r="2" fill="#00D16C" opacity="0.7" />
              {/* Arms */}
              <rect x="10" y="70" width="18" height="8" rx="4" fill="#1a1f2e" stroke="#3D7BFF" strokeWidth="1.5" />
              <rect x="72" y="70" width="18" height="8" rx="4" fill="#1a1f2e" stroke="#3D7BFF" strokeWidth="1.5" />
            </svg>
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <span className="inline-flex items-center gap-2 bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-semibold px-4 py-1.5 rounded-full tracking-widest uppercase">
            <span className="w-1.5 h-1.5 bg-accent-blue rounded-full animate-pulse" />
            Yapay Zeka Destekli Dijital Üniversite
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-6xl md:text-8xl font-black tracking-tight mb-6 leading-none"
        >
          <span className="gradient-text">GELECEĞİN</span>
          <br />
          <span className="text-white">EĞİTİMİ</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10"
        >
          AI Mentor&apos;unla öğren, kod üret, ses ve görsel içerikler yarat.
          Kişiselleştirilmiş yapay zeka eğitimi ile sınırları aş.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/register"
            className="group relative inline-flex items-center gap-2 bg-accent-blue hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-base transition-all duration-200 shadow-lg shadow-accent-blue/30 hover:shadow-accent-blue/50 hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Ücretsiz Başla
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-semibold px-8 py-4 rounded-xl text-base transition-all duration-200 hover:-translate-y-0.5"
          >
            Özellikleri Keşfet
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { label: 'Aktif Öğrenci', value: '10K+' },
            { label: 'AI Özelliği', value: '7' },
            { label: 'Memnuniyet', value: '98%' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600"
      >
        <div className="w-0.5 h-8 bg-gradient-to-b from-transparent to-accent-blue/50" />
        <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.div>
    </section>
  );
}
