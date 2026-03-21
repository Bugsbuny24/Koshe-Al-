'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProjectHeader } from '@/components/projects/ProjectHeader';
import { ProjectTabs } from '@/components/projects/ProjectTabs';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Project } from '@/types/freelancer';

const ACTIONS = [
  { label: 'Generate Brief', icon: '✨', href: 'brief' },
  { label: 'Build Scope', icon: '🏗️', href: 'scope' },
  { label: 'Generate Drafts', icon: '📝', href: 'drafts' },
  { label: 'Review Feedback', icon: '🔄', href: 'revisions' },
  { label: 'Prepare Delivery', icon: '📦', href: 'delivery' },
];

export default function ProjectOverviewPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetch(`/api/projects/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.project) setProject(d.project);
        else setError(d.error || 'Proje bulunamadı');
      })
      .catch(() => setError('Bağlantı hatası'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400">{error || 'Proje bulunamadı'}</p>
        <Link href="/dashboard" className="text-accent-blue text-sm mt-3 block hover:underline">← Dashboard&apos;a dön</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <ProjectHeader project={project} />
      <ProjectTabs projectId={id} />

      <div className="space-y-6">
        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Hızlı Aksiyonlar</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {ACTIONS.map((action) => (
              <Link key={action.href} href={`/projects/${id}/${action.href}`}>
                <Card hover className="p-4 text-center group">
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <p className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">
                    {action.label}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Brief Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card className="p-5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Ham Brief</h3>
            <p className="text-sm text-slate-300 line-clamp-6 leading-relaxed">
              {project.raw_brief || <span className="text-slate-600 italic">Brief henüz eklenmemiş</span>}
            </p>
            <Link href={`/projects/${id}/brief`}>
              <Button variant="ghost" size="sm" className="mt-3 px-0 text-accent-blue">
                Brief&apos;e git →
              </Button>
            </Link>
          </Card>

          <Card className="p-5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Temizlenmiş Brief</h3>
            {project.cleaned_brief ? (
              <p className="text-sm text-slate-300 line-clamp-6 leading-relaxed">{project.cleaned_brief}</p>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-slate-600 mb-3">Henüz oluşturulmadı</p>
                <Link href={`/projects/${id}/brief`}>
                  <Button size="sm" variant="outline">✨ Brief Oluştur</Button>
                </Link>
              </div>
            )}
          </Card>
        </div>

        {/* Meta */}
        <Card className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Niş</p>
              <p className="text-sm font-medium text-white capitalize">{project.niche}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Hizmet</p>
              <p className="text-sm font-medium text-white">{project.service_type}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Oluşturulma</p>
              <p className="text-sm font-medium text-white">
                {new Date(project.created_at).toLocaleDateString('tr-TR')}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Güncelleme</p>
              <p className="text-sm font-medium text-white">
                {new Date(project.updated_at).toLocaleDateString('tr-TR')}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
