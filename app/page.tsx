export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-800">
        <div className="text-2xl font-bold">Koshei AI</div>

        <div className="flex gap-6 text-gray-300">
          <a href="#features">Özellikler</a>
          <a href="#languages">Diller</a>
          <a href="#pricing">Fiyatlar</a>
        </div>

        <button className="bg-purple-600 px-5 py-2 rounded-lg hover:bg-purple-700">
          Konuşmaya Başla
        </button>
      </nav>


      {/* HERO */}
      <section className="px-8 py-24 text-center max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">
          80+ dili konuşarak öğren
        </h1>

        <p className="text-gray-400 text-lg mb-8">
          Koshei AI ile gerçek konuşma pratiği yap.  
          Hatalarını anında düzelt ve akıcı konuşmaya başla.
        </p>

        <div className="flex justify-center gap-4">
          <button className="bg-purple-600 px-6 py-3 rounded-lg hover:bg-purple-700">
            Konuşmaya Başla
          </button>

          <button className="border border-gray-700 px-6 py-3 rounded-lg hover:bg-gray-900">
            Planları Gör
          </button>
        </div>
      </section>


      {/* NASIL ÇALIŞIR */}
      <section className="px-8 py-20 bg-neutral-950 text-center">
        <h2 className="text-3xl font-bold mb-12">
          Dil öğrenmenin en doğal yolu
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">

          <div className="p-6 border border-gray-800 rounded-xl">
            <h3 className="text-xl font-semibold mb-3">Dil Seç</h3>
            <p className="text-gray-400">
              80+ dil arasından öğrenmek istediğin dili seç.
            </p>
          </div>

          <div className="p-6 border border-gray-800 rounded-xl">
            <h3 className="text-xl font-semibold mb-3">Konuş</h3>
            <p className="text-gray-400">
              AI ile gerçek konuşma pratiği yap.
            </p>
          </div>

          <div className="p-6 border border-gray-800 rounded-xl">
            <h3 className="text-xl font-semibold mb-3">Geliş</h3>
            <p className="text-gray-400">
              Koshei AI hatalarını anında düzeltir.
            </p>
          </div>

        </div>
      </section>


      {/* FEATURES */}
      <section id="features" className="px-8 py-24 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Koshei AI ile konuşarak öğren
        </h2>

        <div className="grid md:grid-cols-2 gap-10 text-gray-300">

          <ul className="space-y-4">
            <li>✔ 80+ dil erişimi</li>
            <li>✔ AI konuşma pratiği</li>
            <li>✔ Anında hata düzeltme</li>
          </ul>

          <ul className="space-y-4">
            <li>✔ Gerçek konuşma senaryoları</li>
            <li>✔ Günlük konuşma egzersizleri</li>
            <li>✔ Akıcı konuşma geliştirme</li>
          </ul>

        </div>
      </section>


      {/* LANGUAGES */}
      <section id="languages" className="px-8 py-20 bg-neutral-950 text-center">
        <h2 className="text-3xl font-bold mb-10">
          80+ dil seni bekliyor
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-gray-300 max-w-5xl mx-auto">
          <div>🇬🇧 İngilizce</div>
          <div>🇩🇪 Almanca</div>
          <div>🇫🇷 Fransızca</div>
          <div>🇪🇸 İspanyolca</div>
          <div>🇮🇹 İtalyanca</div>
          <div>🇹🇷 Türkçe</div>
          <div>🇰🇿 Kazakça</div>
          <div>🇺🇿 Özbekçe</div>
          <div>🇰🇬 Kırgızca</div>
          <div>🇹🇲 Türkmence</div>
        </div>

        <p className="text-gray-500 mt-6">
          ve 70+ dil daha...
        </p>
      </section>


      {/* PRICING */}
      <section id="pricing" className="px-8 py-24 text-center">
        <h2 className="text-3xl font-bold mb-14">
          Basit fiyatlandırma
        </h2>

        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">

          {/* AYLIK */}
          <div className="border border-gray-800 p-10 rounded-xl">
            <h3 className="text-2xl font-semibold mb-4">
              All Access
            </h3>

            <p className="text-gray-400 mb-6">
              80+ dil erişimi
            </p>

            <div className="text-4xl font-bold mb-6">
              ₺1.200
              <span className="text-lg text-gray-400"> / ay</span>
            </div>

            <a
              href="https://www.shopier.com/TradeVisual/45264454"
              className="bg-purple-600 px-6 py-3 rounded-lg hover:bg-purple-700 inline-block"
            >
              Başla
            </a>
          </div>


          {/* YILLIK */}
          <div className="border border-purple-600 p-10 rounded-xl">
            <div className="text-purple-400 mb-3">EN POPÜLER</div>

            <h3 className="text-2xl font-semibold mb-4">
              All Access Yıllık
            </h3>

            <p className="text-gray-400 mb-6">
              80+ dil erişimi
            </p>

            <div className="text-4xl font-bold mb-6">
              ₺14.400
              <span className="text-lg text-gray-400"> / yıl</span>
            </div>

            <a
              href="https://www.shopier.com/TradeVisual/45264598"
              className="bg-purple-600 px-6 py-3 rounded-lg hover:bg-purple-700 inline-block"
            >
              Yıllık Başla
            </a>
          </div>

        </div>
      </section>


      {/* FOOTER */}
      <footer className="border-t border-gray-800 text-center py-10 text-gray-500">
        © 2026 Koshei AI
      </footer>

    </main>
  );
}
