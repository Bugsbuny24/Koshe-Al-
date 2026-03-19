import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Öğren — KOSHEİ",
  description: "Next.js, React, Python, Blockchain ve AI/ML kurslarıyla kendinizi geliştirin.",
};

const categories = [
  {
    id: "nextjs",
    icon: "▲",
    title: "Next.js",
    color: "from-white to-zinc-300",
    border: "border-zinc-700/50",
    description: "Full-stack React framework ile modern web uygulamaları oluşturun.",
    courses: [
      { title: "Next.js 14 ile App Router", level: "Başlangıç", duration: "8 saat", pi: 5 },
      { title: "Server Components Derinlemesine", level: "Orta", duration: "6 saat", pi: 8 },
      { title: "Next.js ile Pi App Geliştirme", level: "İleri", duration: "12 saat", pi: 15 },
    ],
  },
  {
    id: "react",
    icon: "⚛️",
    title: "React / Vue",
    color: "from-cyan-400 to-blue-400",
    border: "border-cyan-500/20",
    description: "Modern UI kütüphaneleri ile etkileşimli arayüzler tasarlayın.",
    courses: [
      { title: "React 19 Temelleri", level: "Başlangıç", duration: "10 saat", pi: 5 },
      { title: "Vue 3 ile Composition API", level: "Orta", duration: "8 saat", pi: 8 },
      { title: "React ile Pi SDK Entegrasyonu", level: "İleri", duration: "6 saat", pi: 10 },
    ],
  },
  {
    id: "python",
    icon: "🐍",
    title: "Python / C++",
    color: "from-yellow-400 to-green-400",
    border: "border-yellow-500/20",
    description: "Güçlü backend ve sistem programlama için temel diller.",
    courses: [
      { title: "Python ile Veri Analizi", level: "Başlangıç", duration: "12 saat", pi: 6 },
      { title: "C++ ile Yüksek Performans", level: "Orta", duration: "15 saat", pi: 12 },
      { title: "Python ile AI Model Eğitimi", level: "İleri", duration: "20 saat", pi: 20 },
    ],
  },
  {
    id: "blockchain",
    icon: "⛓️",
    title: "Blockchain",
    color: "from-purple-400 to-pink-400",
    border: "border-purple-500/20",
    description: "Dağıtık sistemler, kripto ve Pi Network mimarisi.",
    courses: [
      { title: "Blockchain Temelleri", level: "Başlangıç", duration: "8 saat", pi: 7 },
      { title: "Pi Network Geliştirici Kılavuzu", level: "Orta", duration: "10 saat", pi: 12 },
      { title: "DeFi Protokolleri ile Çalışmak", level: "İleri", duration: "14 saat", pi: 18 },
    ],
  },
  {
    id: "aiml",
    icon: "🧠",
    title: "AI / ML",
    color: "from-orange-400 to-pink-400",
    border: "border-orange-500/20",
    description: "Makine öğrenimi ve yapay zeka modelleri ile geleceği inşa edin.",
    courses: [
      { title: "Makine Öğrenimine Giriş", level: "Başlangıç", duration: "15 saat", pi: 8 },
      { title: "Büyük Dil Modelleri (LLM)", level: "Orta", duration: "12 saat", pi: 15 },
      { title: "AI Ajan Geliştirme", level: "İleri", duration: "18 saat", pi: 22 },
    ],
  },
];

const levelColors: Record<string, string> = {
  Başlangıç: "text-green-400 bg-green-400/10",
  Orta: "text-yellow-400 bg-yellow-400/10",
  İleri: "text-red-400 bg-red-400/10",
};

export default function LearnPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-700/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">Ana Sayfa</Link>
            <span className="text-zinc-700">/</span>
            <span className="text-blue-400 text-sm">Öğren</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">🎓</span>
            <div>
              <h1 className="text-4xl font-black text-white">ÖĞREN</h1>
              <p className="text-blue-400 font-mono text-sm">LEARN</p>
            </div>
          </div>
          <p className="text-zinc-400 max-w-2xl">
            Pi Network ekosistemi için gerekli tüm teknolojileri öğrenin. Her kurs Pi ile satın alınabilir.
          </p>
        </div>
      </section>

      {/* Course Categories */}
      <section className="px-4 pb-24">
        <div className="max-w-7xl mx-auto space-y-12">
          {categories.map((cat) => (
            <div key={cat.id} id={cat.id}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <h2 className={`text-xl font-bold bg-gradient-to-r ${cat.color} bg-clip-text text-transparent`}>
                    {cat.title}
                  </h2>
                  <p className="text-zinc-500 text-sm">{cat.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cat.courses.map((course) => (
                  <div
                    key={course.title}
                    className={`rounded-xl bg-[#0d0d20] border ${cat.border} p-6 hover:border-opacity-60 transition-all group cursor-pointer`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${levelColors[course.level]}`}>
                        {course.level}
                      </span>
                      <span className="text-xs text-zinc-500">{course.duration}</span>
                    </div>
                    <h3 className="text-white font-semibold mb-4 group-hover:text-blue-300 transition-colors">
                      {course.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-purple-400">
                        π {course.pi}
                      </span>
                      <button className={`text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r ${cat.color} text-black font-semibold opacity-80 hover:opacity-100 transition-opacity`}>
                        Satın Al
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
