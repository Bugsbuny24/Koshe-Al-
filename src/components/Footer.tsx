import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a1a] border-t border-purple-900/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">🎓 Öğren</h3>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="/learn?cat=nextjs" className="hover:text-purple-400 transition-colors">Next.js</Link></li>
              <li><Link href="/learn?cat=react" className="hover:text-purple-400 transition-colors">React / Vue</Link></li>
              <li><Link href="/learn?cat=python" className="hover:text-purple-400 transition-colors">Python / C++</Link></li>
              <li><Link href="/learn?cat=blockchain" className="hover:text-purple-400 transition-colors">Blockchain</Link></li>
              <li><Link href="/learn?cat=aiml" className="hover:text-purple-400 transition-colors">AI / ML</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">🤖 Geliştir</h3>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="/build?tool=webapp" className="hover:text-purple-400 transition-colors">Web/App Oluşturucu</Link></li>
              <li><Link href="/build?tool=piapp" className="hover:text-purple-400 transition-colors">Pi App Üretici</Link></li>
              <li><Link href="/build?tool=content" className="hover:text-purple-400 transition-colors">İçerik Üretici</Link></li>
              <li><Link href="/build?tool=contract" className="hover:text-purple-400 transition-colors">Smart Contract</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">🚀 Yayınla</h3>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="/deploy?target=pibrowser" className="hover:text-purple-400 transition-colors">Pi Browser</Link></li>
              <li><Link href="/deploy?target=web" className="hover:text-purple-400 transition-colors">Web</Link></li>
              <li><Link href="/deploy?target=marketplace" className="hover:text-purple-400 transition-colors">Marketplace</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">💰 Kazan</h3>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="/earn?method=course" className="hover:text-purple-400 transition-colors">Kurs Sat</Link></li>
              <li><Link href="/earn?method=project" className="hover:text-purple-400 transition-colors">Proje Sat</Link></li>
              <li><Link href="/earn?method=freelance" className="hover:text-purple-400 transition-colors">Freelance</Link></li>
              <li><Link href="/earn?method=module" className="hover:text-purple-400 transition-colors">Modül Sat</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-purple-900/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-sm">
              K
            </div>
            <span className="text-zinc-500 text-sm">KOSHEİ — Pi Network&apos;ün AI İşletim Sistemi</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-600">
            <span>Pi SDK entegrasyonu</span>
            <span>•</span>
            <span>Auth • Payment • Blockchain</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
