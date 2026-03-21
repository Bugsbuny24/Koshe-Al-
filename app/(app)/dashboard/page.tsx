'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Project } from '@/types/freelancer';

export default function DashboardPage() {
  const { profile } = useStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((d) => {
        if (d.projects) setProjects(d.projects);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const deployed = projects.filter((p) => p.is_deployed).length;
  const published = projects.filter((p) => p.is_published).length;
  const total = projects.length;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">
            Merhaba, {profile?.full_name?.split(' ')[0] || 'Kullanıcı'} 👋
          </h1>
          <p className="text-slate-400 mt-1">Koschei AI Work Operator — işini anlat, doğru akışa yönlenelim.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/templates">
            <Button variant="ghost" size="sm">📋 Templates</Button>
          </Link>
          <Link href="/projects/new">
            <Button size="sm">⚡ New Project</Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard label="Toplam Proje" value={total} icon="🚀" color="blue" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <StatCard label="Deployed" value={deployed} icon="🌐" color="green" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StatCard label="Yayınlanan" value={published} icon="📦" color="gold" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <StatCard label="Aktif İş" value={0} icon="🗂️" color="blue" />
        </motion.div>
      </div>

      {/* Projects List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Projeler</h2>
          <Link href="/projects/new">
            <Button variant="outline" size="sm">+ Yeni Proje</Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="text-4xl mb-3">📁</p>
            <h3 className="text-white font-bold mb-2">Henüz proje yok</h3>
            <p className="text-slate-500 text-sm mb-5">İlk işini başlat — brief&apos;inden scope&apos;a, execution&apos;dan teslimata Koschei halleder.</p>
            <Link href="/projects/new">
              <Button size="sm">⚡ İlk Projeyi Oluştur</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                <Link href={`/projects/${project.id}`}>
                  <Card hover className="p-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{project.title}</p>
                      {project.description && (
                        <p className="text-sm text-slate-500 mt-0.5 truncate">{project.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {project.tech_stack && (
                        <span className="text-xs text-slate-400 hidden md:block">{project.tech_stack}</span>
                      )}
                      {project.is_deployed && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-accent-green">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                          Deployed
                        </span>
                      )}
                      <span className="text-xs text-slate-500 hidden md:block">
                        {new Date(project.created_at).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
