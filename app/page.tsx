import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#060608] flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(240,165,0,0.35)] px-4 py-1.5 text-sm text-[#F0A500]">
          <span className="h-2 w-2 rounded-full bg-[#F0A500] animate-pulse" />
          Pi Network&apos;s AI Operating System
        </div>
        <h1 className="mb-4 text-5xl font-bold md:text-7xl" style={{ fontFamily: "'Syne', sans-serif" }}>
        <h1 className="mb-4 text-5xl font-bold md:text-7xl">
          <span className="text-[#F0A500]">Koshei</span>
        </h1>

        <p className="mb-3 text-2xl font-semibold text-[#F0EDE6] md:text-3xl">
          Learn. Build. Earn.
        </p>

        <p className="mb-10 max-w-xl text-[#8A8680] text-base md:text-lg">
          AI destekli eğitim platformu. Yazılım öğren, uygulama üret, Pi kazan.
          Hiç kod bilmeyen bir Pioneer bile Koshei ile her şeyini yapabilir.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/login"
            className="rounded-xl bg-[#F0A500] px-8 py-3.5 font-semibold text-[#060608] hover:bg-[#C47F00] transition-colors"
          >
            Pi ile Giriş Yap
          </Link>
          <Link
            href="#features"
            className="rounded-xl border border-[rgba(240,165,0,0.35)] px-8 py-3.5 font-semibold text-[#F0EDE6] hover:bg-[#111116] transition-colors"
          >
            Daha Fazla
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 py-20 max-w-5xl mx-auto w-full">
        <h2 className="mb-12 text-center text-3xl font-bold">Ne yapabilirsin?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '📚', title: 'Öğren', desc: 'Next.js, React, Python, Blockchain, AI — her seviyeden kurs ve üniversite programları.' },
            { icon: '🤖', title: 'Üret', desc: 'AI ile uygulama, web sitesi, içerik ve akıllı sözleşme üret. Pi Network\'e deploy et.' },
            { icon: '💰', title: 'Kazan', desc: 'Kurs sat, freelance iş al, AI modül yayınla. Pi kazanmaya başla.' },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-[rgba(240,165,0,0.12)] bg-[#111116] p-6 hover:bg-[#16161E] transition-colors"
            >
              <div className="mb-3 text-4xl">{f.icon}</div>
              <h3 className="mb-2 text-xl font-semibold">{f.title}</h3>
              <p className="text-[#8A8680]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgba(240,165,0,0.12)] py-8 text-center text-[#4A4845] text-sm">
        Koshei © 2024 — Pi Network&apos;in AI İşletim Sistemi
      </footer>
    </main>
  );
}
