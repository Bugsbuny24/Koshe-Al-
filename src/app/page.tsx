import Link from "next/link";

const sections = [
  {
    id: "learn",
    icon: "🎓",
    title: "ÖĞREN",
    subtitle: "LEARN",
    color: "from-blue-600 to-cyan-500",
    glow: "shadow-blue-500/20",
    border: "border-blue-500/20",
    href: "/learn",
    items: [
      "Next.js",
      "React / Vue",
      "Python / C++",
      "Blockchain",
      "AI / ML",
    ],
    cta: "Kurslara Bak",
  },
  {
    id: "build",
    icon: "🤖",
    title: "GELİŞTİR",
    subtitle: "BUILD",
    color: "from-green-600 to-emerald-500",
    glow: "shadow-green-500/20",
    border: "border-green-500/20",
    href: "/build",
    items: [
      "Web/App builder (AI)",
      "Pi App üretici",
      "İçerik üretici",
      "Smart contract wizard",
    ],
    cta: "Araçları Keşfet",
  },
  {
    id: "deploy",
    icon: "🚀",
    title: "YAYINLA",
    subtitle: "DEPLOY",
    color: "from-yellow-600 to-orange-500",
    glow: "shadow-yellow-500/20",
    border: "border-yellow-500/20",
    href: "/deploy",
    items: [
      "Pi Browser'a",
      "Web'e",
      "Marketplace'e",
    ],
    cta: "Yayınlamaya Başla",
  },
  {
    id: "earn",
    icon: "💰",
    title: "KAZAN",
    subtitle: "EARN",
    color: "from-pink-600 to-rose-500",
    glow: "shadow-pink-500/20",
    border: "border-pink-500/20",
    href: "/earn",
    items: [
      "Kurs sat",
      "Proje sat",
      "Freelance iş al",
      "Modül sat",
    ],
    cta: "Kazanmaya Başla",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-700/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            Pi Network üzerinde çalışıyor
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent">
              KOSHEİ
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-zinc-400 mb-4 font-medium">
            Pi Network&apos;ün AI İşletim Sistemi
          </p>
          <p className="text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Öğren, geliştir, yayınla ve kazan — hepsi Pi ağı üzerinde. AI destekli araçlar
            ile bir sonraki Pi uygulamanızı inşa edin.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/learn"
              className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/25"
            >
              Hemen Başla
            </Link>
            <Link
              href="/build"
              className="px-8 py-3.5 border border-purple-500/40 text-purple-300 font-semibold rounded-xl hover:bg-purple-500/10 hover:border-purple-500/70 transition-all"
            >
              Uygulama Oluştur
            </Link>
          </div>
        </div>
      </section>

      {/* Pi SDK Banner */}
      <section className="px-4 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {[
              { icon: "🔑", label: "Pi Auth", desc: "Güvenli kimlik doğrulama" },
              { icon: "💳", label: "Pi Payment", desc: "Anlık Pi ödemeleri" },
              { icon: "⛓️", label: "Pi Blockchain", desc: "Zincir üstü işlemler" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 px-5 py-3 rounded-xl bg-purple-950/40 border border-purple-800/30"
              >
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-white font-medium">{item.label}</p>
                  <p className="text-zinc-500 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Quadrant Grid */}
      <section className="px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {sections.map((section) => (
              <Link
                key={section.id}
                href={section.href}
                className={`group relative rounded-2xl bg-[#0d0d20] border ${section.border} p-8 hover:border-opacity-60 transition-all duration-300 shadow-xl ${section.glow} hover:shadow-2xl`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className="text-3xl mb-3 block">{section.icon}</span>
                    <h2 className="text-xl font-bold text-white">{section.title}</h2>
                    <p className={`text-xs font-mono font-semibold bg-gradient-to-r ${section.color} bg-clip-text text-transparent`}>
                      {section.subtitle}
                    </p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                <ul className="space-y-2.5 mb-8">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-zinc-400 text-sm">
                      <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${section.color} flex-shrink-0`} />
                      {item}
                    </li>
                  ))}
                </ul>

                <span className={`inline-flex items-center gap-2 text-sm font-medium bg-gradient-to-r ${section.color} bg-clip-text text-transparent group-hover:gap-3 transition-all`}>
                  {section.cta}
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl bg-gradient-to-br from-purple-950/60 to-pink-950/30 border border-purple-500/20 p-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "50+", label: "Kurs" },
                { value: "12+", label: "AI Araç" },
                { value: "3", label: "Platform" },
                { value: "π", label: "Pi SDK" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </p>
                  <p className="text-zinc-500 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
