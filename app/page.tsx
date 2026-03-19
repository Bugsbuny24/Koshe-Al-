import Link from "next/link";
import Image from "next/image"; // Image importunu eklemeyi unutma
import { MENTORS } from "@/lib/data/mentors";
import { FACULTIES } from "@/lib/data/academic-catalog";
import { CREDIT_PACKAGES_DEF } from "@/lib/data/credit-packages";

export default function HomePage() {
  return (
    <main className="min-h-screen text-white overflow-hidden">

      {/* ═══════════════════════════════════════════════════════════
          HERO (Görsel Odaklı Yeni Tasarım)
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center">

        {/* Arkaplan Görseli ve Efektler */}
        <div className="absolute inset-0 z-0">
          {/* Görselin üzerine metinlerin okunabilmesi için hafif koyu bir katman */}
          <div className="absolute inset-0 bg-[#050816]/60 z-10 mix-blend-multiply" />
          
          <Image 
            src="/hero-bg.jpg" 
            alt="Koschei Universe" 
            fill
            priority
            className="object-cover object-center"
          />

          {/* Sayfanın geri kalanına (koyu temaya) yumuşak geçiş */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#050816] via-[#050816]/80 to-transparent z-10" />
        </div>

        <div className="relative z-20 mx-auto max-w-5xl px-4 sm:px-6 flex flex-col items-center text-center mt-20">
          
          {/* Logo İkonu (Görseldeki kaskı temsil eden opsiyonel bir ikon/parıltı) */}
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-cyan-400/30 blur-[40px] rounded-full" />
            <span className="relative text-5xl">🛡️</span> {/* İstersen kask logosunu SVG olarak buraya ekleyebilirsin */}
          </div>

          <h1 className="text-6xl sm:text-8xl lg:text-[140px] font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400 uppercase drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            Koschei
          </h1>

          <div className="mt-4 flex items-center gap-4">
            <div className="h-px w-12 bg-cyan-500/50" />
            <p className="text-xl sm:text-3xl text-cyan-50 font-light tracking-[0.3em] drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
              Geleceğin Eğitimi
            </p>
            <div className="h-px w-12 bg-cyan-500/50" />
          </div>

          <p className="mt-8 text-lg text-slate-300 leading-8 max-w-2xl text-shadow-sm">
            AI mentor rehberliğinde akademik dil programları. Her konuşma skorlanır, her hata hafızaya alınır, her ilerleme sertifikayla kanıtlanır.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-5">
            <Link
              href="/register"
              className="group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 px-10 py-4 text-base font-semibold text-white shadow-[0_0_40px_rgba(8,145,178,0.4)] transition-all hover:shadow-[0_0_60px_rgba(8,145,178,0.6)] hover:scale-[1.02] border border-cyan-400/30"
            >
              <span>Ücretsiz Başla</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-black/40 px-10 py-4 text-base font-medium text-slate-100 backdrop-blur-md transition hover:bg-black/60 hover:border-white/40"
            >
              Programları Keşfet
            </Link>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          NASIL ÇALIŞIR (Aşağıdaki kodların kalanı aynı kalabilir)
      ═══════════════════════════════════════════════════════════ */}
      {/* ... kodun geri kalanı ... */}
