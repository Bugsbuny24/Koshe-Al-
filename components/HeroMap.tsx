import Link from "next/link";

const languages = [
  { label: "English", x: "10%", y: "20%", delay: "0s" },
  { label: "Deutsch", x: "22%", y: "55%", delay: "0.6s" },
  { label: "Español", x: "36%", y: "18%", delay: "1.2s" },
  { label: "Français", x: "52%", y: "60%", delay: "0.4s" },
  { label: "Türkçe",  x: "66%", y: "22%", delay: "1.8s" },
  { label: "日本語",  x: "78%", y: "50%", delay: "0.9s" },
  { label: "中文",    x: "88%", y: "28%", delay: "1.5s" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-cyan-400/10 bg-[#040816] px-6 py-16 text-white">

      {/* glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(34,211,238,0.12),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.12),transparent_30%)]" />

      {/* grid */}
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:40px_40px]" />

      {/* floating language pills */}
      {languages.map((lang) => (
        <div
          key={lang.label}
          className="absolute hidden md:block text-xs border border-cyan-300/20 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-full text-slate-300"
          style={{
            left: lang.x,
            top: lang.y,
            animation: `floatPill 4s ease-in-out infinite`,
            animationDelay: lang.delay,
          }}
        >
          {lang.label}
        </div>
      ))}

      <div className="relative max-w-2xl">
        <p className="text-[11px] tracking-[0.22em] uppercase text-cyan-300/60">
          Koshei · AI Dil Öğretmeni
        </p>

        <h1 className="mt-5 text-4xl md:text-5xl font-bold leading-tight tracking-tight">
          AI ile konuş,<br />
          <span className="text-cyan-300">gerçekten öğren.</span>
        </h1>

        <p className="mt-5 text-base leading-7 text-slate-400 max-w-lg">
          Sana soru sorar. Cevabını dinler. Hatanı düzeltir.
          Duolingo gibi quiz değil — gerçek konuşma pratiği.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-400 transition"
          >
            Hemen Başla →
          </Link>
          <Link
            href="/lesson"
            className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm text-slate-200 hover:bg-white/[0.08] transition"
          >
            Örnek Ders
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-500">
          <span>✓ 63 dil</span>
          <span>✓ Ücretsiz başla</span>
          <span>✓ Kayıt gerekmiyor</span>
        </div>
      </div>

      <style>{`
        @keyframes floatPill {
          0%, 100% { transform: translateY(0px); opacity: 0.5; }
          50%       { transform: translateY(-10px); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
