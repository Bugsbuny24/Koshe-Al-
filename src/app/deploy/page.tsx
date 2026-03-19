import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Yayınla — KOSHEİ",
  description: "Uygulamanızı Pi Browser, Web veya Marketplace'e yayınlayın.",
};

const targets = [
  {
    id: "pibrowser",
    icon: "π",
    title: "Pi Browser",
    subtitle: "Pi Network'ün yerel tarayıcısı",
    color: "from-purple-600 to-pink-500",
    glow: "shadow-purple-500/20",
    border: "border-purple-500/20",
    badge: "Önerilen",
    description:
      "Uygulamanızı 35 milyondan fazla Pi kullanıcısına ulaştırın. Pi Browser'da yayınlanan uygulamalar Pi Marketplace'te de yer alabilir.",
    steps: [
      "Pi Developer Portal'da hesap açın",
      "Uygulama bilgilerini doldurun",
      "Pi SDK entegrasyonunu tamamlayın",
      "İnceleme için gönderin",
    ],
    requirements: ["Pi Auth implementasyonu", "HTTPS desteği", "Pi Browser uyumluluğu"],
    cta: "Pi Developer Portal",
    ctaHref: "https://developer.minepi.com",
  },
  {
    id: "web",
    icon: "🌐",
    title: "Web",
    subtitle: "Herhangi bir web barındırma platformu",
    color: "from-blue-600 to-cyan-500",
    glow: "shadow-blue-500/20",
    border: "border-blue-500/20",
    badge: "Esnek",
    description:
      "Vercel, Netlify veya kendi sunucunuza deploy edin. Pi SDK ile birlikte çalışan standart web uygulaması.",
    steps: [
      "Projenizi GitHub'a yükleyin",
      "Hosting platformunu seçin",
      "Ortam değişkenlerini ayarlayın",
      "Deploy butona tıklayın",
    ],
    requirements: ["Domain adı", "SSL sertifikası", "Build konfigürasyonu"],
    cta: "Vercel'e Deploy Et",
    ctaHref: "https://vercel.com/new",
  },
  {
    id: "marketplace",
    icon: "🛒",
    title: "Marketplace",
    subtitle: "KOSHEİ içerik pazarı",
    color: "from-yellow-600 to-orange-500",
    glow: "shadow-yellow-500/20",
    border: "border-yellow-500/20",
    badge: "Kazanç",
    description:
      "Geliştirdiğiniz kursları, modülleri ve projeleri KOSHEİ Marketplace'te satışa çıkarın. Pi ile ödeme alın.",
    steps: [
      "Satıcı hesabı oluşturun",
      "Ürününüzü hazırlayın",
      "Fiyatlandırma yapın (Pi cinsinden)",
      "Yayınla butonuna basın",
    ],
    requirements: ["KYC doğrulaması", "Pi cüzdanı", "İçerik kalite incelemesi"],
    cta: "Marketplace'e Git",
    ctaHref: "/earn",
  },
];

export default function DeployPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-yellow-700/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">Ana Sayfa</Link>
            <span className="text-zinc-700">/</span>
            <span className="text-yellow-400 text-sm">Yayınla</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">🚀</span>
            <div>
              <h1 className="text-4xl font-black text-white">YAYINLA</h1>
              <p className="text-yellow-400 font-mono text-sm">DEPLOY</p>
            </div>
          </div>
          <p className="text-zinc-400 max-w-2xl">
            Uygulamanızı Pi Browser, web platformları veya KOSHEİ Marketplace&apos;e gönderin.
          </p>
        </div>
      </section>

      {/* Deployment Targets */}
      <section className="px-4 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {targets.map((target) => (
            <div
              key={target.id}
              id={target.id}
              className={`rounded-2xl bg-[#0d0d20] border ${target.border} p-8 flex flex-col shadow-xl ${target.glow}`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${target.color} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                    {target.icon}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{target.title}</h2>
                    <p className="text-zinc-500 text-xs">{target.subtitle}</p>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full bg-gradient-to-r ${target.color} text-black font-semibold`}>
                  {target.badge}
                </span>
              </div>

              <p className="text-zinc-400 text-sm leading-relaxed mb-6">{target.description}</p>

              <div className="mb-6">
                <h3 className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-3">Adımlar</h3>
                <ol className="space-y-2">
                  {target.steps.map((step, i) => (
                    <li key={step} className="flex items-start gap-2.5 text-sm text-zinc-400">
                      <span className={`w-5 h-5 rounded-full bg-gradient-to-r ${target.color} text-black text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mb-8">
                <h3 className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-3">Gereksinimler</h3>
                <ul className="space-y-1.5">
                  {target.requirements.map((req) => (
                    <li key={req} className="flex items-center gap-2 text-xs text-zinc-500">
                      <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${target.color}`} />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto">
                <a
                  href={target.ctaHref}
                  target={target.ctaHref.startsWith("http") ? "_blank" : undefined}
                  rel={target.ctaHref.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r ${target.color} text-black font-semibold hover:opacity-90 transition-opacity`}
                >
                  {target.cta}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pi SDK Section */}
      <section className="px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl bg-gradient-to-br from-purple-950/60 to-pink-950/30 border border-purple-500/20 p-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🔗</span>
              <div>
                <h2 className="text-xl font-bold text-white">Pi SDK Entegrasyonu</h2>
                <p className="text-purple-400 text-sm">Auth, Payment, Blockchain</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Pi Auth",
                  code: `window.Pi.authenticate(\n  ['username', 'payments'],\n  onIncompletePayment\n)`,
                },
                {
                  title: "Pi Payment",
                  code: `window.Pi.createPayment(\n  { amount: 1, memo: 'Kurs' },\n  callbacks\n)`,
                },
                {
                  title: "Pi Share",
                  code: `window.Pi.openShareDialog(\n  'KOSHEİ',\n  'Pi ile öğren!'\n)`,
                },
              ].map((snippet) => (
                <div key={snippet.title} className="rounded-xl bg-black/40 border border-white/10 overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-white/10">
                    <span className="text-xs text-zinc-500 font-mono">{snippet.title}</span>
                  </div>
                  <pre className="p-4 text-sm text-purple-300 font-mono">{snippet.code}</pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
