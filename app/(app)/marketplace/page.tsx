'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface Project {
  id: string;
  title: string;
  desc: string;
  author: string;
  price: number;
  rating: number;
  reviews: number;
  tags: string[];
  icon: string;
  featured?: boolean;
}

const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'E-Ticaret Şablonu',
    desc: 'Next.js + Stripe ile hazır e-ticaret uygulaması. Ödeme entegrasyonu dahil.',
    author: 'ahmet_dev',
    price: 29,
    rating: 4.8,
    reviews: 142,
    tags: ['Next.js', 'Stripe', 'TypeScript'],
    icon: '🛒',
    featured: true,
  },
  {
    id: '2',
    title: 'Chat Uygulaması',
    desc: 'Socket.io ile gerçek zamanlı sohbet uygulaması. Oda desteği mevcut.',
    author: 'zeynep_code',
    price: 19,
    rating: 4.6,
    reviews: 89,
    tags: ['Socket.io', 'React', 'Node.js'],
    icon: '💬',
  },
  {
    id: '3',
    title: 'Dashboard Şablonu',
    desc: 'Tailwind CSS ile hazır admin dashboard. Grafik ve tablo bileşenleri.',
    author: 'can_ui',
    price: 0,
    rating: 4.9,
    reviews: 312,
    tags: ['React', 'Tailwind', 'Charts'],
    icon: '📊',
    featured: true,
  },
  {
    id: '4',
    title: 'Blog Motoru',
    desc: 'Markdown destekli blog motoru. SEO optimize, RSS desteği.',
    author: 'fatma_writes',
    price: 9,
    rating: 4.4,
    reviews: 56,
    tags: ['Next.js', 'MDX', 'SEO'],
    icon: '📝',
  },
  {
    id: '5',
    title: 'Auth Sistemi',
    desc: 'Supabase ile tam auth sistemi. Email, Google, GitHub OAuth.',
    author: 'ali_auth',
    price: 15,
    rating: 4.7,
    reviews: 201,
    tags: ['Supabase', 'OAuth', 'Next.js'],
    icon: '🔐',
  },
  {
    id: '6',
    title: 'API Şablonu',
    desc: 'Node.js + Express + Prisma ile REST API şablonu. Swagger dahil.',
    author: 'musa_api',
    price: 12,
    rating: 4.5,
    reviews: 78,
    tags: ['Node.js', 'Prisma', 'Swagger'],
    icon: '⚡',
  },
];

export default function MarketplacePage() {
  const [search, setSearch] = useState('');

  const filtered = PROJECTS.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black text-white">Pazar Yeri</h1>
        <p className="text-slate-400 mt-1">Topluluk tarafından yapılan projelere göz at veya kendi projeni sat.</p>
      </motion.div>

      {/* Search + Upload */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-3 mb-8"
      >
        <div className="flex-1 relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Proje veya teknoloji ara..."
            className="w-full pl-10 pr-4 py-2.5 bg-bg-card border border-white/8 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accent-blue/40"
          />
        </div>
        <Button variant="outline" size="md">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Proje Yükle
        </Button>
      </motion.div>

      {/* Featured */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mb-6"
      >
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Öne Çıkan</h2>
      </motion.div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07 }}
          >
            <Card hover className="p-5 group h-full flex flex-col">
              {project.featured && (
                <div className="flex justify-end mb-2">
                  <Badge variant="gold">⭐ Öne Çıkan</Badge>
                </div>
              )}
              <div className="flex items-start gap-3 mb-3">
                <div className="text-3xl">{project.icon}</div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-accent-blue transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-500">@{project.author}</p>
                </div>
              </div>

              <p className="text-sm text-slate-400 mb-4 flex-1">{project.desc}</p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 bg-bg-deep border border-white/5 rounded-md text-slate-400">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="text-pi-gold">★</span>
                  <span>{project.rating}</span>
                  <span className="text-slate-600">({project.reviews})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-sm ${project.price === 0 ? 'text-accent-green' : 'text-white'}`}>
                    {project.price === 0 ? 'Ücretsiz' : `$${project.price}`}
                  </span>
                  <Button size="sm" variant={project.price === 0 ? 'secondary' : 'primary'}>
                    {project.price === 0 ? 'İndir' : 'Satın Al'}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <div className="text-4xl mb-3">🔍</div>
          <p>Arama sonucu bulunamadı</p>
        </div>
      )}
    </div>
  );
}
