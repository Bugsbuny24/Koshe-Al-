import Link from "next/link";
import { MENTORS } from "@/lib/data/mentors";
import { FACULTIES } from "@/lib/data/academic-catalog";
import { CREDIT_PACKAGES_DEF } from "@/lib/data/credit-packages";

export default function HomePage() {
  return (
    <main className="min-h-screen text-white overflow-hidden">

      {/* ═══════════════════════════════════════════════════════════
          HERO (Yeni Görsel Odaklı Tasarım)
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center">

        {/* Arkaplan Görseli ve Efektler */}
        <div className="absolute inset-0 z-0">
          {/* Görselin üzerine metinlerin okunabilmesi için hafif koyu bir katman */}
          <div className="absolute inset-0 bg-[#050816]/40 z-10" />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://github.com/user-attachments/assets/df444298-181a-4482-b34c-2fe097a2989f"
            alt="Koshei Universe"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Sayfanın geri kalanına (koyu temaya) yumuşak geçiş */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#050816] via-[#050816]/80 to-transparent z-10" />
        </div>

        <div className="relative z-20 mx-auto max-w-5xl px-4 sm:px-6 flex flex-col items-center text-center mt-20">

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
          NASIL ÇALIŞIR
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-28 border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-400 mb-4">Süreç</p>
            <h2 className="text-4xl sm:text-5xl font-bold">4 adımda ustalaş</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-px bg-white/5 rounded-3xl overflow-hidden">
            {[
              { n: "01", icon: "🎓", title: "Programını Seç", desc: "Fakülte, dil ve CEFR seviyene göre akademik programını belirle.", href: "/courses" },
              { n: "02", icon: "🤖", title: "Mentorla Çalış", desc: "AI mentorın gerçek zamanlı speaking practice yapar, anında düzeltir.", href: "/live" },
              { n: "03", icon: "🏅", title: "Rozet & Sertifika", desc: "Her ünite tamamlandığında rozet, her program sonunda sertifika.", href: "/profile" },
              { n: "04", icon: "📊", title: "İlerlemeni Kanıtla", desc: "Fluency, Grammar, Vocabulary skorlarınla gelişimini izle.", href: "/dashboard" },
            ].map((item) => (
              <Link key={item.n} href={item.href} className="group relative bg-[#07101f] p-8 hover:bg-[#0b1628] transition-colors">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-xs font-mono text-slate-600 mb-4">{item.n}</div>
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-6">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          MENTORLAR
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-400 mb-4">Ekip</p>
            <h2 className="text-4xl sm:text-5xl font-bold">AI Mentor Kadrosu</h2>
            <p className="mt-4 text-slate-400 max-w-lg mx-auto">Her mentorun farklı uzmanlığı var. Programına göre sana en uygun mentor atanır.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {MENTORS.map((m, i) => (
              <div key={m.id} className="shine-card group relative rounded-3xl border border-white/8 bg-gradient-to-b from-white/5 to-transparent p-8 hover:border-white/15 transition-all hover:-translate-y-1">
                <div className="flex items-start justify-between mb-6">
                  <div className={`relative h-16 w-16 rounded-2xl bg-gradient-to-br ${m.gradientFrom} ${m.gradientTo} flex items-center justify-center text-xl font-bold shadow-lg`}>
                    {m.avatarInitials}
                    <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 border-2 border-[#050816]" />
                  </div>
                  <span className="text-xs text-slate-600 font-mono">0{i + 1}</span>
                </div>
                <h3 className="text-xl font-bold mb-1">{m.name}</h3>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-4">{m.title}</p>
                <p className="text-sm text-slate-400 leading-6">{m.specialization}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FAKÜLTELer
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-28 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-cyan-400 mb-4">Akademik Yapı</p>
              <h2 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
                4 Fakülte,<br />
                <span className="text-slate-400">Sınırsız Program</span>
              </h2>
              <p className="text-slate-400 leading-8 mb-8">İş İngilizcesi, AI teknolojisi, yaratıcı yazarlık ve daha fazlası için akademik programlar.</p>
              <Link href="/courses" className="inline-flex items-center gap-2 rounded-2xl bg-white/8 border border-white/10 px-6 py-3 text-sm font-medium hover:bg-white/12 transition">
                Tüm Programları Gör →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {FACULTIES.map((f) => (
                <Link key={f.code} href="/courses" className="group rounded-2xl border border-white/8 bg-white/4 p-5 hover:border-cyan-400/25 hover:bg-cyan-400/5 transition-all">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <div className="text-sm font-semibold mb-1 group-hover:text-cyan-300 transition-colors">{f.name}</div>
                  <div className="text-xs text-slate-500">{f.programs.length} program</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          ÖZELLİKLER
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-28 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-400 mb-4">Platform</p>
            <h2 className="text-4xl sm:text-5xl font-bold">Her şey dahil</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "🎤", title: "Canlı Speaking Practice", desc: "Gerçek zamanlı AI konuşma. Sessiz kalmana izin vermez, seni konuşturur." },
              { icon: "🧠", title: "Hata Hafızası", desc: "Yaptığın hataları hafızaya alır. Bir daha aynı hatayı yaparsan hatırlatır." },
              { icon: "📊", title: "Speaking Score", desc: "Her konuşma sonrası Fluency, Grammar ve Vocabulary puanın hesaplanır." },
              { icon: "🏅", title: "Rozet Sistemi", desc: "Her tamamlanan ünite ve program için özel başarı rozeti." },
              { icon: "🎓", title: "Akademik Sertifika", desc: "Programı bitirdiğinde gerçek bir tamamlama sertifikası alırsın." },
              { icon: "💎", title: "NFT Koleksiyon", desc: "Nadir rozetler dijital varlığa dönüşür. Koleksiyonunda saklarsın." },
            ].map((f) => (
              <div key={f.title} className="rounded-3xl border border-white/8 bg-white/3 p-7 hover:border-white/15 hover:bg-white/5 transition-all">
                <div className="text-3xl mb-5">{f.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-6">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FİYATLANDIRMA
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-28 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-400 mb-4">Kredi Sistemi</p>
            <h2 className="text-4xl sm:text-5xl font-bold">Kullandığın kadar öde</h2>
            <p className="mt-5 text-slate-400 max-w-lg mx-auto leading-7">
              Aylık abonelik yok. Kredi al, istediğin zaman harca. Süre sınırı yok.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {CREDIT_PACKAGES_DEF.map((pkg) => (
              <div
                key={pkg.id}
                className={[
                  "relative rounded-3xl p-8 transition-all hover:-translate-y-1",
                  pkg.isPopular
                    ? "border border-violet-400/40 bg-gradient-to-b from-violet-500/15 to-fuchsia-500/10 shadow-[0_0_60px_rgba(139,92,246,0.2)]"
                    : "border border-white/8 bg-white/4",
                ].join(" ")}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-1 text-xs font-semibold text-white shadow-lg">
                      En Popüler
                    </span>
                  </div>
                )}
                <div className="text-sm uppercase tracking-[0.2em] text-slate-400 mb-2">{pkg.name}</div>
                <div className="text-4xl font-bold mb-1">{pkg.priceTRY}</div>
                <div className="text-3xl font-bold text-cyan-300 mb-6">
                  {pkg.credits.toLocaleString("tr-TR")}
                  <span className="text-base font-normal text-slate-400 ml-1">kredi</span>
                </div>
                <div className="space-y-2.5 mb-8 text-sm text-slate-300">
                  {[`${pkg.credits} konuşma mesajı`, `${pkg.credits} ders oluşturma`, "Tüm AI özellikleri", "Süresiz geçerli"].map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span>{f}
                    </div>
                  ))}
                </div>
                {pkg.shopierUrl ? (
                  <a
                    href={pkg.shopierUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={[
                      "block w-full rounded-2xl py-3 text-center text-sm font-semibold transition hover:opacity-90",
                      pkg.isPopular
                        ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
                        : "border border-white/15 bg-white/8 text-white hover:bg-white/12",
                    ].join(" ")}
                  >
                    Satın Al
                  </a>
                ) : (
                  <button disabled className="block w-full rounded-2xl border border-white/8 py-3 text-center text-sm font-semibold text-slate-500 cursor-not-allowed">
                    Yakında
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-slate-600">
            Shopier üzerinden ödeme · Kısa sürede manuel yükleme
          </p>
          <div className="mt-4 text-center">
            <Link href="/pricing" className="text-sm text-slate-400 hover:text-cyan-300 transition">
              Kredi kullanım detaylarını gör →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-28 border-t border-white/5">
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-violet-600/15 blur-[100px]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-cyan-400 mb-6">Başlamak için bir sebep yeter</p>
          <h2 className="text-5xl sm:text-6xl font-bold leading-tight mb-6">
            Bugün başla.<br />
            <span className="text-slate-400">Yarın konuş.</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto mb-10 leading-8">
            Mentor, rozet, sertifika ve gerçek ilerleme. Koshei AI University ile dil öğrenmek bir yolculuğa dönüşür.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-10 py-4 text-base font-semibold text-white shadow-[0_0_50px_rgba(168,85,247,0.4)] transition-all hover:shadow-[0_0_70px_rgba(168,85,247,0.6)] hover:scale-[1.02]"
            >
              <span>Ücretsiz Kayıt Ol</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-10 py-4 text-base font-medium text-slate-200 transition hover:bg-white/10"
            >
              Programları İncele
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
