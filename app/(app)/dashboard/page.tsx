'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Project } from '@/types/freelancer';

const STATUS_COLORS: Record<string, 'blue' | 'green' | 'gold' | 'red' | 'gray'> = {
  new: 'blue',
  in_progress: 'green',
  revision: 'gold',
  delivery: 'blue',
  done: 'gray',
};

const STATUS_LABELS: Record<string, string> = {
  new: 'Yeni',
  in_progress: 'Devam Ediyor',
  revision: 'Revizyon',
  delivery: 'Teslim',
  done: 'Tamamlandı',
};

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

  const active = projects.filter((p) => p.status === 'in_progress').length;
  const revision = projects.filter((p) => p.status === 'revision').length;
  const delivery = projects.filter((p) => p.status === 'delivery').length;
  const todayDrafts = 0; // placeholder – computed from project_drafts if needed

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">
            Merhaba, {profile?.full_name?.split(' ')[0] || 'Freelancer'} 👋
          </h1>
          <p className="text-slate-400 mt-1">Koschei Freelancer OS — müşteri brief&apos;inden teslime.</p>
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
          <StatCard label="Aktif Projeler" value={active} icon="🚀" color="blue" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <StatCard label="Revizyon Bekleyen" value={revision} icon="🔄" color="gold" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StatCard label="Teslime Hazır" value={delivery} icon="📦" color="green" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <StatCard label="Bugünkü Taslaklar" value={todayDrafts} icon="✍️" color="blue" />
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
            <p className="text-slate-500 text-sm mb-5">İlk projen ile müşteri brief&apos;ini dakikalar içinde yapılandırılmış projeye çevir.</p>
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
                      <p className="text-sm text-slate-500 mt-0.5">
                        {project.client_name || 'Müşteri'} · {project.service_type}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {project.deadline && (
                        <span className="text-xs text-slate-500 hidden md:block">
                          {new Date(project.deadline).toLocaleDateString('tr-TR')}
                        </span>
                      )}
                      <Badge variant={STATUS_COLORS[project.status] ?? 'gray'}>
                        {STATUS_LABELS[project.status] ?? project.status}
                      </Badge>
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
