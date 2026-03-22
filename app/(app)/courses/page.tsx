'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const CATEGORIES = [
  'Tümü',
  'Web Geliştirme',
  'Yapay Zeka / ML',
  'Blockchain',
  'Mobil',
  'Veri Bilimi',
];

const COURSES = [
  {
    id: '1',
    title: 'Modern Web Geliştirme',
    category: 'Web Geliştirme',
    level: 'Başlangıç',
    duration: '12 saat',
    lessons: 24,
    progress: 65,
    image: '🌐',
    color: 'blue' as const,
    desc: 'HTML, CSS, JavaScript ve React ile modern web uygulamaları geliştirin.',
  },
  {
    id: '2',
    title: 'Makine Öğrenmesi Temelleri',
    category: 'Yapay Zeka / ML',
    level: 'Orta',
    duration: '18 saat',
    lessons: 36,
    progress: 30,
    image: '🤖',
    color: 'green' as const,
    desc: 'Python ile makine öğrenmesi algoritmalarını öğrenin ve uygulayın.',
  },
  {
    id: '3',
    title: 'Blockchain ve Web3',
    category: 'Blockchain',
    level: 'İleri',
    duration: '20 saat',
    lessons: 40,
    progress: 0,
    image: '⛓️',
    color: 'gold' as const,
    desc: 'Solidity, Ethereum ve akıllı sözleşmeler ile Web3 geliştirme.',
  },
  {
    id: '4',
    title: 'React Native ile Mobil Uygulama',
    category: 'Mobil',
    level: 'Orta',
    duration: '15 saat',
    lessons: 30,
    progress: 0,
    image: '📱',
    color: 'blue' as const,
    desc: 'Cross-platform mobil uygulamalar geliştirin.',
  },
  {
    id: '5',
    title: 'Veri Analizi ve Görselleştirme',
    category: 'Veri Bilimi',
    level: 'Başlangıç',
    duration: '10 saat',
    lessons: 20,
    progress: 80,
    image: '📊',
    color: 'green' as const,
    desc: 'Pandas, NumPy ve Matplotlib ile veri analizi yapın.',
  },
  {
    id: '6',
    title: 'TypeScript ile Gelişmiş React',
    category: 'Web Geliştirme',
    level: 'İleri',
    duration: '14 saat',
    lessons: 28,
    progress: 45,
    image: '⚡',
    color: 'blue' as const,
    desc: 'TypeScript ve React ile büyük ölçekli uygulamalar.',
  },
];

const levelColors: Record<string, 'blue' | 'green' | 'gold'> = {
  'Başlangıç': 'green',
  'Orta': 'blue',
  'İleri': 'gold',
};

export default function CoursesPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black text-white">Kurslar</h1>
        <p className="text-slate-400 mt-1">Binlerce kurs arasından sana uygun olanı seç ve öğrenmeye başla.</p>
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2 mb-8"
      >
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              i === 0
                ? 'bg-accent-blue text-white'
                : 'bg-bg-card border border-white/8 text-slate-400 hover:text-white hover:border-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {COURSES.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07 }}
          >
            <Link href={`/courses/${course.id}`}>
              <Card hover glow={course.color} className="p-5 group h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{course.image}</div>
                  <Badge variant={levelColors[course.level] || 'blue'}>{course.level}</Badge>
                </div>
                <h3 className="font-bold text-white text-lg mb-2 group-hover:text-accent-blue transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-400 mb-4 flex-1">{course.desc}</p>

                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                  <span>⏱ {course.duration}</span>
                  <span>📚 {course.lessons} ders</span>
                </div>

                {course.progress > 0 && (
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                      <span>İlerleme</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-bg-deep rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent-blue to-accent-green rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {course.progress === 0 && (
                  <div className="text-xs text-slate-600 py-1">Henüz başlanmadı</div>
                )}
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-10 grid grid-cols-3 gap-4"
      >
        {[
          { label: 'Toplam Kurs', value: '50+' },
          { label: 'Tamamlanan Ders', value: '12' },
          { label: 'Kazanılan Sertifika', value: '2' },
        ].map((stat) => (
          <Card key={stat.label} className="p-4 text-center">
            <div className="text-2xl font-black text-white">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
          </Card>
        ))}
      </motion.div>

      {/* build-your-own-x inspired challenges section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-10"
      >
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-black text-white">Kendi X&apos;ini İnşa Et</h2>
          <span className="text-[10px] border border-white/5 bg-bg-card text-slate-500 px-2 py-0.5 rounded-md">
            build-your-own-x ilhamlı
          </span>
        </div>
        <p className="text-sm text-slate-400 mb-5">
          Gerçek bir şey inşa ederek öğren. Her zorluk, popüler bir teknolojiyi sıfırdan
          oluşturma deneyimi sunar — adım adım, proje tabanlı öğrenme.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Kendi Git\'ini İnşa Et', desc: 'Version control sisteminin temellerini öğren — blob, tree, commit nesneleri.', icon: '🌿', difficulty: 'İleri' },
            { title: 'Kendi HTTP Sunucunu İnşa Et', desc: 'TCP soketlerinden başlayarak sıfırdan bir web sunucusu yaz.', icon: '🌐', difficulty: 'Orta' },
            { title: 'Kendi Redis\'ini İnşa Et', desc: 'Anahtar-değer deposu, TTL ve RESP protokolünü implement et.', icon: '🗄️', difficulty: 'İleri' },
            { title: 'Kendi Docker\'ını İnşa Et', desc: 'Linux namespace ve cgroups kullanarak konteyner izolasyonu yaz.', icon: '🐳', difficulty: 'İleri' },
            { title: 'Kendi Regex Motorunu İnşa Et', desc: 'NFA/DFA tabanlı düzenli ifade motorunu sıfırdan oluştur.', icon: '🔍', difficulty: 'Orta' },
            { title: 'Kendi Shell\'ini İnşa Et', desc: 'REPL, pipe, yönlendirme ve job kontrolü ile bir kabuk yaz.', icon: '💻', difficulty: 'Orta' },
          ].map((challenge) => (
            <Card key={challenge.title} className="p-4 flex flex-col gap-3 hover:border-white/10 transition-colors cursor-pointer">
              <div className="flex items-start justify-between gap-2">
                <span className="text-2xl">{challenge.icon}</span>
                <Badge
                  variant={
                    challenge.difficulty === 'İleri'
                      ? 'gold'
                      : challenge.difficulty === 'Orta'
                      ? 'blue'
                      : 'green'
                  }
                >
                  {challenge.difficulty}
                </Badge>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">{challenge.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{challenge.desc}</p>
              </div>
              <button className="mt-auto text-xs font-semibold text-accent-blue hover:underline text-left">
                Zorluğu Başlat →
              </button>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
