import { Project } from '@/types/freelancer';

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-white">{project.title}</h1>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {project.tech_stack && (
              <span className="text-xs text-slate-600 uppercase font-medium">{project.tech_stack.join(', ')}</span>
            )}
            {project.is_deployed && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-accent-green">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                Deployed
              </span>
            )}
            {project.deploy_url && (
              <a
                href={project.deploy_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent-blue hover:underline"
              >
                {project.deploy_url}
              </a>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-400">
          {project.price_pi != null && project.price_pi > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600">Fiyat:</span>
              <span className="font-semibold text-white">π {project.price_pi}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
