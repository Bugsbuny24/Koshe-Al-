'use client';

import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const COURSES: Record<
  string,
  {
    id: string;
    title: string;
    category: string;
    level: string;
    duration: string;
    lessons: number;
    progress: number;
    image: string;
    color: 'blue' | 'green' | 'gold';
    desc: string;
  }
> = {
  '1': {
    id: '1',
    title: 'Modern Web Geliştirme',
    category: 'Web Geliştirme',
    level: 'Başlangıç',
    duration: '12 saat',
    lessons: 24,
    progress: 65,
    image: '🌐',
    color: 'blue',
    desc: 'HTML, CSS, JavaScript ve React ile modern web uygulamaları geliştirin. Bu kurs, sıfırdan web geliştirmeye başlamak isteyen herkes için idealdir. Temel kavramlardan başlayarak React ekosistemi ile gerçek projeler geliştirmeye kadar kapsamlı bir yolculuk sunmaktadır.',
  },
  '2': {
    id: '2',
    title: 'Makine Öğrenmesi Temelleri',
    category: 'Yapay Zeka / ML',
    level: 'Orta',
    duration: '18 saat',
    lessons: 36,
    progress: 30,
    image: '🤖',
    color: 'green',
    desc: 'Python ile makine öğrenmesi algoritmalarını öğrenin ve uygulayın. Scikit-learn, NumPy ve Pandas ile gerçek veri setleri üzerinde çalışarak teorik bilgileri pratiğe dönüştüreceksiniz.',
  },
  '3': {
    id: '3',
    title: 'Blockchain ve Web3',
    category: 'Blockchain',
    level: 'İleri',
    duration: '20 saat',
    lessons: 40,
    progress: 0,
    image: '⛓️',
    color: 'gold',
    desc: 'Solidity, Ethereum ve akıllı sözleşmeler ile Web3 geliştirme. Kendi tokenınızı ve NFT projenizi oluşturun, merkeziyetsiz uygulamalar (DApp) geliştirmeye başlayın.',
  },
  '4': {
    id: '4',
    title: 'React Native ile Mobil Uygulama',
    category: 'Mobil',
    level: 'Orta',
    duration: '15 saat',
    lessons: 30,
    progress: 0,
    image: '📱',
    color: 'blue',
    desc: 'Cross-platform mobil uygulamalar geliştirin. Tek kod tabanıyla iOS ve Android uygulamaları oluşturun. Expo ve React Native CLI ile proje kurulumundan yayına kadar tüm süreçleri öğrenin.',
  },
  '5': {
    id: '5',
    title: 'Veri Analizi ve Görselleştirme',
    category: 'Veri Bilimi',
    level: 'Başlangıç',
    duration: '10 saat',
    lessons: 20,
    progress: 80,
    image: '📊',
    color: 'green',
    desc: 'Pandas, NumPy ve Matplotlib ile veri analizi yapın. Gerçek dünya veri setlerini analiz ederek anlamlı içgörüler çıkarın ve etkileyici görselleştirmeler oluşturun.',
  },
  '6': {
    id: '6',
    title: 'TypeScript ile Gelişmiş React',
    category: 'Web Geliştirme',
    level: 'İleri',
    duration: '14 saat',
    lessons: 28,
    progress: 45,
    image: '⚡',
    color: 'blue',
    desc: 'TypeScript ve React ile büyük ölçekli uygulamalar. Tip güvenliği, performans optimizasyonu ve gelişmiş state yönetimi konularını ustaca ele alarak kurumsal düzeyde React projeleri geliştirin.',
  },
};

const levelColors: Record<string, 'blue' | 'green' | 'gold'> = {
  'Başlangıç': 'green',
  'Orta': 'blue',
  'İleri': 'gold',
};

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const course = COURSES[id];

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto text-center py-24">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-2xl font-black text-white mb-2">Kurs Bulunamadı</h1>
        <p className="text-slate-400 mb-6">Bu kurs mevcut değil veya kaldırılmış.</p>
        <Link href="/courses">
          <Button variant="outline">← Kurslara Dön</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <Link href="/courses" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kurslara Dön
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card glow={course.color} className="p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="text-5xl shrink-0">{course.image}</div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant={levelColors[course.level] || 'blue'}>{course.level}</Badge>
                <span className="text-xs text-slate-500">{course.category}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white mb-3">{course.title}</h1>
              <p className="text-slate-400 text-sm leading-relaxed">{course.desc}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        {[
          { icon: '⏱', label: 'Süre', value: course.duration },
          { icon: '📚', label: 'Ders Sayısı', value: `${course.lessons} ders` },
          { icon: '📊', label: 'Seviye', value: course.level },
          { icon: '🎯', label: 'Kategori', value: course.category },
        ].map((stat) => (
          <Card key={stat.label} className="p-4 text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-sm font-semibold text-white">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
          </Card>
        ))}
      </motion.div>

      {/* Progress */}
      {course.progress > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">İlerleme</h2>
              <span className="text-sm font-bold text-white">{course.progress}%</span>
            </div>
            <div className="h-2 bg-bg-deep rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-blue to-accent-green rounded-full transition-all"
                style={{ width: `${course.progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {Math.round((course.lessons * course.progress) / 100)} / {course.lessons} ders tamamlandı
            </p>
          </Card>
        </motion.div>
      )}

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-white mb-1">
              {course.progress > 0 ? 'Derse Devam Et' : 'Derse Başla'}
            </h2>
            <p className="text-sm text-slate-400">
              İnteraktif ders akışı V1 kapsamında henüz aktif değil. Yakında erişilebilecek.
            </p>
          </div>
          <Button disabled className="shrink-0 opacity-60 cursor-not-allowed" size="lg">
            {course.progress > 0 ? '▶ Devam Et' : '▶ Derse Başla'}
          </Button>
        </Card>
      </motion.div>
    </div>
  );
}
