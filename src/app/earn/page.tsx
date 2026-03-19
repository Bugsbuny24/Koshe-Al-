"use client";

import Link from "next/link";
import { useState } from "react";
import { usePiPayment } from "@/lib/pi-hooks";

const methods = [
  {
    id: "course",
    icon: "🎓",
    title: "Kurs Sat",
    subtitle: "Bilginizi para kazanın",
    color: "from-blue-600 to-cyan-500",
    glow: "shadow-blue-500/20",
    border: "border-blue-500/20",
    description:
      "Öğrendiğiniz konularda kurs hazırlayın ve Pi karşılığında satın. Her satıştan %85 komisyon alın.",
    earnings: "π 5–50 / kurs",
    example: ["Next.js kursu: π 10", "Blockchain temelleri: π 15", "AI/ML bootcamp: π 25"],
    steps: ["Kurs içeriğini hazırla", "Fiyatlandır (Pi cinsinden)", "Marketplace'e yükle", "Kazanmaya başla"],
  },
  {
    id: "project",
    icon: "💻",
    title: "Proje Sat",
    subtitle: "Hazır projeler pazarla",
    color: "from-green-600 to-emerald-500",
    glow: "shadow-green-500/20",
    border: "border-green-500/20",
    description:
      "Geliştirdiğiniz uygulamaları, şablonları ve starter paketleri satın. Kaynak kodu veya lisans olarak.",
    earnings: "π 20–200 / proje",
    example: ["Pi App şablonu: π 30", "E-ticaret starter: π 50", "DeFi template: π 100"],
    steps: ["Projeyi dokümante et", "GitHub'a yükle", "Lisanslama seç", "Marketplace'te sat"],
  },
  {
    id: "freelance",
    icon: "🤝",
    title: "Freelance İş Al",
    subtitle: "Pi ekosisteminde servis sun",
    color: "from-purple-600 to-pink-500",
    glow: "shadow-purple-500/20",
    border: "border-purple-500/20",
    description:
      "Geliştirici, tasarımcı veya içerik üretici olarak Pi ödemeli freelance projeler alın.",
    earnings: "π 50–500 / proje",
    example: ["Web geliştirme: π 200", "UI tasarım: π 150", "İçerik yazımı: π 80"],
    steps: ["Profil oluştur", "Becerilerini listele", "Teklifleri incele", "Pi ile kazan"],
  },
  {
    id: "module",
    icon: "📦",
    title: "Modül Sat",
    subtitle: "Kod bileşenleri ve paketler",
    color: "from-yellow-600 to-orange-500",
    glow: "shadow-yellow-500/20",
    border: "border-yellow-500/20",
    description:
      "React bileşenleri, npm paketleri, API entegrasyonları gibi hazır modüller satın.",
    earnings: "π 5–100 / modül",
    example: ["Pi Auth modülü: π 10", "Payment UI: π 15", "Blockchain utils: π 20"],
    steps: ["Modülü hazırla", "Dokümantasyon yaz", "Test et ve yükle", "Pasif gelir kazan"],
  },
];

export default function EarnPage() {
  const [activeMethod, setActiveMethod] = useState(methods[0].id);
  const { pay, loading, error, success } = usePiPayment();

  const method = methods.find((m) => m.id === activeMethod) ?? methods[0];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-pink-700/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">Ana Sayfa</Link>
            <span className="text-zinc-700">/</span>
            <span className="text-pink-400 text-sm">Kazan</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">💰</span>
            <div>
              <h1 className="text-4xl font-black text-white">KAZAN</h1>
              <p className="text-pink-400 font-mono text-sm">EARN</p>
            </div>
          </div>
          <p className="text-zinc-400 max-w-2xl">
            Bilginizi, projelerinizi ve hizmetlerinizi Pi Network üzerinden pazarlayın.
          </p>
        </div>
      </section>

      {/* Method Tabs */}
      <section className="px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {methods.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveMethod(m.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  activeMethod === m.id
                    ? `${m.border} bg-[#0d0d20] border-opacity-100`
                    : "border-white/5 bg-white/2 hover:border-white/10"
                }`}
              >
                <span className="text-2xl block mb-2">{m.icon}</span>
                <p className="text-white text-sm font-semibold">{m.title}</p>
                <p className={`text-xs font-bold bg-gradient-to-r ${m.color} bg-clip-text text-transparent`}>
                  {m.earnings}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Active Method Detail */}
      <section className="px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className={`rounded-2xl bg-[#0d0d20] border ${method.border} overflow-hidden shadow-xl ${method.glow}`}>
            <div className={`px-8 py-5 border-b ${method.border}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{method.icon}</span>
                  <div>
                    <h2 className={`text-xl font-bold bg-gradient-to-r ${method.color} bg-clip-text text-transparent`}>
                      {method.title}
                    </h2>
                    <p className="text-zinc-500 text-sm">{method.subtitle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-500">Tahmini Kazanç</p>
                  <p className={`text-lg font-bold bg-gradient-to-r ${method.color} bg-clip-text text-transparent`}>
                    {method.earnings}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 grid md:grid-cols-3 gap-8">
              {/* Description & Steps */}
              <div className="md:col-span-2 space-y-6">
                <p className="text-zinc-400 leading-relaxed">{method.description}</p>

                <div>
                  <h3 className="text-sm text-zinc-400 font-semibold mb-4">Nasıl Başlarım?</h3>
                  <ol className="space-y-3">
                    {method.steps.map((step, i) => (
                      <li key={step} className="flex items-center gap-3 text-sm text-zinc-400">
                        <span className={`w-7 h-7 rounded-full bg-gradient-to-r ${method.color} text-black text-xs font-bold flex items-center justify-center flex-shrink-0`}>
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Demo Payment */}
                <div className={`rounded-xl border ${method.border} p-5`}>
                  <h3 className="text-sm text-white font-semibold mb-3">Pi Ödeme Testi</h3>
                  <p className="text-xs text-zinc-500 mb-4">
                    Pi SDK ödeme akışını test etmek için aşağıdaki butona tıklayın.
                  </p>
                  <button
                    onClick={() => pay(1, "KOSHEİ Test Ödemesi", { method: method.id })}
                    disabled={loading}
                    className={`flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${method.color} text-black text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50`}
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        İşleniyor...
                      </>
                    ) : (
                      <>π 1 Test Ödemesi</>
                    )}
                  </button>
                  {success && (
                    <p className="text-green-400 text-sm mt-3">✓ Ödeme başarıyla tamamlandı!</p>
                  )}
                  {error && (
                    <p className="text-red-400 text-sm mt-3">⚠ {error}</p>
                  )}
                </div>
              </div>

              {/* Examples */}
              <div>
                <h3 className="text-sm text-zinc-400 font-semibold mb-4">Örnek Kazançlar</h3>
                <div className="space-y-3">
                  {method.example.map((ex) => (
                    <div
                      key={ex}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black/40 border border-white/5"
                    >
                      <span className="text-lg">{method.icon}</span>
                      <span className="text-sm text-zinc-300">{ex}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl bg-gradient-to-br from-purple-950/60 to-pink-950/40 border border-purple-500/20 p-12 text-center">
            <h2 className="text-3xl font-black text-white mb-4">Kazanmaya Hazır Mısınız?</h2>
            <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
              Pi Network ekosisteminde yerinizi alın. Öğrenin, geliştirin, yayınlayın ve kazanın.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/learn"
                className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/25"
              >
                Öğrenmeye Başla
              </Link>
              <Link
                href="/build"
                className="px-8 py-3.5 border border-purple-500/40 text-purple-300 font-semibold rounded-xl hover:bg-purple-500/10 hover:border-purple-500/70 transition-all"
              >
                Uygulama Geliştir
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
