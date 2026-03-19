import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { HeroTyping } from '@/components/landing/HeroTyping';
import { Surface } from '@/components/ui/Surface';
import { 
  BeakerIcon, CpuChipIcon, AcademicCapIcon, 
  GlobeAltIcon, ScaleIcon, HeartIcon, 
  UserGroupIcon, BookOpenIcon 
} from '@heroicons/react/24/outline';

// Görseldeki kategorileri repo yapısındaki 'academic-catalog.ts' ile uyumlu hale getiriyoruz
const faculties = [
  {
    title: "Fen Bilimleri",
    color: "bg-blue-600",
    items: ["Matematik", "Fizik", "Kimya", "Biyoloji"],
    icon: <BeakerIcon className="w-8 h-8 text-blue-100" />
  },
  {
    title: "Mühendislik",
    color: "bg-orange-500",
    items: ["Bilgisayar", "Makine", "Elektrik", "İnşaat"],
    icon: <CpuChipIcon className="w-8 h-8 text-orange-100" />
  },
  {
    title: "Beşeri Bilimler",
    color: "bg-red-700",
    items: ["Felsefe", "Tarih", "Edebiyat", "Sanat"],
    icon: <BookOpenIcon className="w-8 h-8 text-red-100" />
  },
  {
    title: "Sosyal Bilimler",
    color: "bg-red-500",
    items: ["Psikoloji", "Sosyoloji", "Ekonomi", "Siyaset"],
    icon: <UserGroupIcon className="w-8 h-8 text-red-100" />
  },
  {
    title: "Tıp Fakültesi (Temel)",
    color: "bg-green-700",
    items: ["Psikoloji", "Sosyoloji", "Ekonomi", "Uluslararası İlişkiler"],
    icon: <AcademicCapIcon className="w-8 h-8 text-green-100" />
  },
  {
    title: "Tıp Fakülteleri (Klinik)",
    color: "bg-blue-500",
    items: ["Anatomi", "Nörobilim", "Farmakoloji"],
    icon: <HeartIcon className="w-8 h-8 text-blue-100" />
  },
  {
    title: "Yabancı Diller",
    color: "bg-yellow-500",
    items: ["İngilizce", "Fransızca", "Almanca", "İtalyanca"],
    icon: <GlobeAltIcon className="w-8 h-8 text-yellow-100" />
  },
  {
    title: "Hukuk & İşletme",
    color: "bg-amber-800",
    items: ["Hukuk", "İşletme", "Kamu Yönetimi"],
    icon: <ScaleIcon className="w-8 h-8 text-amber-100" />
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      
      {/* Hero Section - Görseldeki üst kısım */}
      <section className="relative pt-20 pb-12 px-4 text-center bg-[url('/hero-bg.jpg')] bg-cover bg-center">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-6">
             {/* Görseldeki açık kitap ve ışık saçan ikonlar */}
             <div className="relative">
                <img src="/book-hero.png" alt="Koschei University" className="w-64 h-auto" />
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 animate-pulse">
                   {/* Atom, Dişli, Kep ikonları buraya gelecek */}
                </div>
             </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
             Geleceğe Akademik Yolculuk
          </h1>
          <HeroTyping /> {/* lib/ai/teacher-engine'den gelen metinlerle */}
        </div>
      </section>

      {/* Fakülte Grid - Görseldeki 2 satırlı yapı */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {faculties.map((fac, index) => (
            <Surface key={index} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow">
              <div className={`${fac.color} p-4 flex items-center justify-between text-white`}>
                <h2 className="font-bold text-lg">{fac.title}</h2>
                {fac.icon}
              </div>
              <div className="p-4 bg-white">
                <ul className="grid grid-cols-2 gap-2">
                  {fac.items.map((item, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Surface>
          ))}
        </div>
      </section>

      {/* Alt Aksiyon Butonları */}
      <section className="text-center py-12 bg-gray-50">
        <h3 className="text-2xl font-semibold mb-8 italic text-gray-700">
          Hayalindeki Bölümü Keşfet, Hemen Başla!
        </h3>
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/courses" className="px-8 py-4 bg-blue-900 text-white rounded-full font-bold hover:bg-blue-800 transition-colors shadow-lg">
            Üniversitelere Göz At ▾
          </Link>
          <Link href="/courses/explore" className="px-8 py-4 bg-orange-500 text-white rounded-full font-bold hover:bg-orange-600 transition-colors shadow-lg">
            Kursları İncele ▾
          </Link>
        </div>
      </section>
    </main>
  );
}
