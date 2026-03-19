"use client";

import Link from "next/link";
import { useState } from "react";

const tools = [
  {
    id: "webapp",
    icon: "🌐",
    title: "Web/App Oluşturucu",
    subtitle: "AI ile saniyeler içinde web uygulaması",
    color: "from-green-500 to-emerald-400",
    border: "border-green-500/20",
    placeholder: "Örnek: Pi Network için bir e-ticaret sitesi oluştur...",
    badge: "AI Destekli",
    features: ["Next.js kod üretimi", "Tailwind CSS stili", "Pi SDK entegrasyonu", "Responsive tasarım"],
  },
  {
    id: "piapp",
    icon: "π",
    title: "Pi App Üretici",
    subtitle: "Pi Browser için optimize edilmiş uygulamalar",
    color: "from-purple-500 to-pink-400",
    border: "border-purple-500/20",
    placeholder: "Örnek: Pi ödemeli bir oyun uygulaması...",
    badge: "Pi Native",
    features: ["Pi Auth entegrasyonu", "Pi Payment akışı", "Pi Browser uyumlu", "Hızlı prototip"],
  },
  {
    id: "content",
    icon: "✍️",
    title: "İçerik Üretici",
    subtitle: "Blog, kurs, döküman ve daha fazlası",
    color: "from-blue-500 to-cyan-400",
    border: "border-blue-500/20",
    placeholder: "Örnek: Blockchain hakkında 10 bölümlük bir kurs...",
    badge: "Çok Dilli",
    features: ["Türkçe/İngilizce", "SEO optimizasyonu", "Kurs materyali", "Markdown çıktı"],
  },
  {
    id: "contract",
    icon: "📜",
    title: "Smart Contract Wizard",
    subtitle: "Güvenli akıllı kontrat şablonları",
    color: "from-yellow-500 to-orange-400",
    border: "border-yellow-500/20",
    placeholder: "Örnek: NFT satış kontratı oluştur...",
    badge: "Güvenli",
    features: ["Solidity şablonları", "Güvenlik denetimi", "Test senaryoları", "Deployment kılavuzu"],
  },
];

export default function BuildPage() {
  const [activeTool, setActiveTool] = useState(tools[0].id);
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState("");

  const tool = tools.find((t) => t.id === activeTool)!;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setOutput("");

    // Simulate AI generation
    await new Promise((r) => setTimeout(r, 1500));

    const sampleOutputs: Record<string, string> = {
      webapp: `// Next.js Web Uygulaması Oluşturuldu\n\n// app/page.tsx\nexport default function Home() {\n  return (\n    <main className="min-h-screen bg-gray-900">\n      <h1 className="text-4xl font-bold text-white">Hoş Geldiniz</h1>\n      {/* Pi SDK ile kimlik doğrulama */}\n    </main>\n  );\n}`,
      piapp: `// Pi App Üretildi\n\n// Pi SDK ile kimlik doğrulama\nwindow.Pi.authenticate(['username', 'payments'], onIncompletePaymentFound)\n  .then(auth => {\n    console.log('Hoş geldin:', auth.user.username);\n    // Ödeme akışını başlat\n  });`,
      content: `# Blockchain'e Giriş\n\n## Bölüm 1: Temel Kavramlar\n\nBlockchain, dağıtık bir defter teknolojisidir...\n\n### Öğrenme Hedefleri\n- Blockchain mimarisini anlamak\n- Pi Network'ün yapısını kavramak`,
      contract: `// SPDX-License-Identifier: MIT\npragma solidity ^0.8.0;\n\ncontract PiNFT {\n    mapping(uint256 => address) public owners;\n    \n    function mint(uint256 tokenId) public {\n        owners[tokenId] = msg.sender;\n    }\n}`,
    };

    setOutput(sampleOutputs[activeTool] || "// Kod üretildi...");
    setGenerating(false);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-green-700/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">Ana Sayfa</Link>
            <span className="text-zinc-700">/</span>
            <span className="text-green-400 text-sm">Geliştir</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">🤖</span>
            <div>
              <h1 className="text-4xl font-black text-white">GELİŞTİR</h1>
              <p className="text-green-400 font-mono text-sm">BUILD</p>
            </div>
          </div>
          <p className="text-zinc-400 max-w-2xl">
            AI destekli araçlarla hızlıca uygulama, içerik ve akıllı kontrat oluşturun.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {tools.map((t) => (
              <button
                key={t.id}
                onClick={() => { setActiveTool(t.id); setOutput(""); setPrompt(""); }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  activeTool === t.id
                    ? `${t.border} bg-[#0d0d20] border-opacity-100`
                    : "border-white/5 bg-white/2 hover:border-white/10"
                }`}
              >
                <span className="text-2xl block mb-2">{t.icon}</span>
                <p className="text-white text-sm font-semibold">{t.title}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${t.color} text-black font-medium`}>
                  {t.badge}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Active Tool */}
      <section className="px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className={`rounded-2xl bg-[#0d0d20] border ${tool.border} overflow-hidden`}>
            <div className={`px-8 py-5 border-b ${tool.border} bg-gradient-to-r from-transparent`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{tool.icon}</span>
                <div>
                  <h2 className={`text-xl font-bold bg-gradient-to-r ${tool.color} bg-clip-text text-transparent`}>
                    {tool.title}
                  </h2>
                  <p className="text-zinc-500 text-sm">{tool.subtitle}</p>
                </div>
              </div>
            </div>

            <div className="p-8 grid md:grid-cols-3 gap-8">
              {/* Left: Input */}
              <div className="md:col-span-2 space-y-4">
                <label className="block text-sm text-zinc-400 font-medium">Ne oluşturmak istiyorsunuz?</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={tool.placeholder}
                  rows={4}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 resize-none"
                />
                <button
                  onClick={handleGenerate}
                  disabled={generating || !prompt.trim()}
                  className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${tool.color} text-black font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50`}
                >
                  {generating ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Üretiliyor...
                    </>
                  ) : (
                    <>⚡ Oluştur</>
                  )}
                </button>

                {/* Output */}
                {output && (
                  <div className="rounded-xl bg-black/60 border border-white/10 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
                      <span className="text-xs text-zinc-500 font-mono">Üretilen Kod</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(output)}
                        className="text-xs text-zinc-500 hover:text-white transition-colors"
                      >
                        Kopyala
                      </button>
                    </div>
                    <pre className="p-4 text-sm text-green-300 font-mono overflow-x-auto whitespace-pre-wrap">
                      {output}
                    </pre>
                  </div>
                )}
              </div>

              {/* Right: Features */}
              <div>
                <h3 className="text-sm text-zinc-400 font-medium mb-4">Özellikler</h3>
                <ul className="space-y-3">
                  {tool.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-zinc-400">
                      <span className={`w-5 h-5 rounded-full bg-gradient-to-r ${tool.color} flex items-center justify-center flex-shrink-0`}>
                        <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
