'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface Thread {
  id: string;
  title: string;
  author: string;
  avatar: string;
  replies: number;
  views: number;
  tags: string[];
  time: string;
  pinned?: boolean;
  solved?: boolean;
}

const THREADS: Thread[] = [
  {
    id: '1',
    title: 'Python\'da asenkron programlama nasıl çalışır?',
    author: 'ahmet_dev',
    avatar: '🧑‍💻',
    replies: 12,
    views: 342,
    tags: ['Python', 'Async'],
    time: '2 saat önce',
    solved: true,
  },
  {
    id: '2',
    title: '[Duyuru] Haftalık AI Meydan Okuması - 3. Hafta',
    author: 'admin',
    avatar: '👑',
    replies: 28,
    views: 891,
    tags: ['Duyuru', 'Meydan Okuma'],
    time: '1 gün önce',
    pinned: true,
  },
  {
    id: '3',
    title: 'React hooks kullanırken sonsuz döngüye giriyorum',
    author: 'zeynep_code',
    avatar: '👩‍💻',
    replies: 7,
    views: 156,
    tags: ['React', 'Hooks', 'Debug'],
    time: '3 saat önce',
  },
  {
    id: '4',
    title: 'Machine learning için en iyi başlangıç kaynakları?',
    author: 'musa_ml',
    avatar: '🤖',
    replies: 19,
    views: 543,
    tags: ['ML', 'Başlangıç', 'Kaynaklar'],
    time: '5 saat önce',
    solved: true,
  },
  {
    id: '5',
    title: 'SQL JOIN türleri arasındaki fark nedir?',
    author: 'fatma_db',
    avatar: '🗄️',
    replies: 4,
    views: 89,
    tags: ['SQL', 'Database'],
    time: '1 saat önce',
  },
];

const CHALLENGES = [
  { title: 'Fibonacci Üreteci', desc: 'En verimli Fibonacci algoritmasını yaz', prize: '50 kredi', entries: 34 },
  { title: 'CSS Animasyonu', desc: 'Saf CSS ile bir loader animasyonu oluştur', prize: '30 kredi', entries: 21 },
  { title: 'API Tasarımı', desc: 'RESTful API best practice\'leri ile tasarla', prize: '75 kredi', entries: 12 },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'threads' | 'challenges'>('threads');
  const [newThread, setNewThread] = useState('');

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black text-white">Topluluk</h1>
        <p className="text-slate-400 mt-1">Sorular sor, cevaplar ver ve toplulukla birlikte büyü.</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['threads', 'challenges'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab
                ? 'bg-accent-blue text-white'
                : 'bg-bg-card border border-white/8 text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'threads' ? '💬 Tartışmalar' : '🏆 Meydan Okumalar'}
          </button>
        ))}
      </div>

      {activeTab === 'threads' && (
        <>
          {/* New Thread */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-4 mb-6">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent-blue/15 border border-accent-blue/20 flex items-center justify-center text-lg shrink-0">
                  👤
                </div>
                <div className="flex-1 flex gap-3">
                  <input
                    value={newThread}
                    onChange={(e) => setNewThread(e.target.value)}
                    placeholder="Bir soru sor veya tartışma başlat..."
                    className="flex-1 bg-bg-deep border border-white/8 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accent-blue/40"
                  />
                  <Button disabled={!newThread.trim()} size="md">
                    Gönder
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Thread List */}
          <div className="space-y-3">
            {THREADS.map((thread, i) => (
              <motion.div
                key={thread.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
              >
                <Card hover className="p-4 group">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl shrink-0 mt-0.5">{thread.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {thread.pinned && (
                          <span className="text-xs text-pi-gold">📌</span>
                        )}
                        <h3 className="font-semibold text-white group-hover:text-accent-blue transition-colors text-sm">
                          {thread.title}
                        </h3>
                        {thread.solved && (
                          <Badge variant="green">✓ Çözüldü</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                        <span>@{thread.author}</span>
                        <span>·</span>
                        <span>{thread.time}</span>
                        <span>·</span>
                        <span>{thread.replies} yanıt</span>
                        <span>·</span>
                        <span>{thread.views} görüntüleme</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {thread.tags.map((tag) => (
                          <span key={tag} className="text-xs px-2 py-0.5 bg-bg-deep border border-white/5 rounded-md text-slate-500">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'challenges' && (
        <div className="space-y-4">
          {CHALLENGES.map((challenge, i) => (
            <motion.div
              key={challenge.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card glow="gold" className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">🏆</span>
                      <h3 className="font-bold text-white">{challenge.title}</h3>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">{challenge.desc}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>🎯 {challenge.entries} katılımcı</span>
                      <span>⏰ 3 gün kaldı</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-pi-gold font-bold text-lg">{challenge.prize}</div>
                    <div className="text-xs text-slate-500 mb-3">ödül</div>
                    <Button size="sm" variant="outline">Katıl</Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
