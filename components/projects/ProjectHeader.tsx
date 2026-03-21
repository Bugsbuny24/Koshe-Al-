import { Badge } from '@/components/ui/Badge';
import { Project } from '@/types/freelancer';

interface ProjectHeaderProps {
  project: Project;
}

const STATUS_LABELS: Record<string, { label: string; color: 'blue' | 'green' | 'gold' | 'red' | 'gray' }> = {
  new: { label: 'Yeni', color: 'blue' },
  in_progress: { label: 'Devam Ediyor', color: 'green' },
  revision: { label: 'Revizyon', color: 'gold' },
  delivery: { label: 'Teslim Aşaması', color: 'blue' },
  done: { label: 'Tamamlandı', color: 'gray' },
};

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const status = STATUS_LABELS[project.status] ?? { label: project.status, color: 'gray' as const };

  return (
    <div className="mb-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-white">{project.title}</h1>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="text-sm text-slate-400">
              {project.client_name || project.client?.name || 'Müşteri'}
              {(project.brand_name || project.client?.brand_name) && (
                <span className="text-slate-600"> · {project.brand_name || project.client?.brand_name}</span>
              )}
            </span>
            <Badge variant={status.color}>{status.label}</Badge>
            <span className="text-xs text-slate-600 uppercase font-medium">{project.service_type}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-400">
          {project.budget && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600">Bütçe:</span>
              <span className="font-semibold text-white">{project.budget}</span>
            </div>
          )}
          {project.deadline && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600">Deadline:</span>
              <span className="font-semibold text-white">
                {new Date(project.deadline).toLocaleDateString('tr-TR')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
