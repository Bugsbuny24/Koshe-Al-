'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProjectHeader } from '@/components/projects/ProjectHeader';
import { ProjectTabs } from '@/components/projects/ProjectTabs';
import { DraftsPanel } from '@/components/projects/DraftsPanel';
import { Project, ProjectDraft } from '@/types/freelancer';

export default function DraftsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [project, setProject] = useState<Project | null>(null);
  const [drafts, setDrafts] = useState<ProjectDraft[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    if (!id) return;
    Promise.all([
      fetch(`/api/projects/${id}`).then((r) => r.json()),
      fetch(`/api/projects/${id}/drafts`).then((r) => r.json()),
    ]).then(([pd, dd]) => {
      if (pd.project) setProject(pd.project);
      if (dd.drafts) setDrafts(dd.drafts);
    }).finally(() => setLoading(false));
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
      <DraftsPanel projectId={id} drafts={drafts} onUpdate={load} />
    </div>
  );
}
