'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProjectHeader } from '@/components/projects/ProjectHeader';
import { ProjectTabs } from '@/components/projects/ProjectTabs';
import { BriefPanel } from '@/components/projects/BriefPanel';
import { Project } from '@/types/freelancer';

export default function BriefPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    if (!id) return;
    fetch(`/api/projects/${id}`)
      .then((r) => r.json())
      .then((d) => { if (d.project) setProject(d.project); })
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!project) return (
    <div className="text-center py-16">
      <p className="text-slate-400">Proje bulunamadı</p>
      <Link href="/dashboard" className="text-accent-blue text-sm mt-3 block">← Dashboard&apos;a dön</Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      <ProjectHeader project={project} />
      <ProjectTabs projectId={id} />
      <BriefPanel project={project} onUpdate={load} />
    </div>
  );
}
