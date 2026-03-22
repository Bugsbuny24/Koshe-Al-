import type { SectorWorkflowTemplate } from '@/types/industry';
import { WORKFLOW_CATEGORY_LABELS } from '@/lib/industry/workflowTemplates';

interface SectorWorkflowCardProps {
  template: SectorWorkflowTemplate;
}

const statusStyles = {
  planned: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  scaffolded: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  active: 'bg-green-500/10 text-green-400 border-green-500/20',
} as const;

export default function SectorWorkflowCard({ template }: SectorWorkflowCardProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-4 py-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{template.name}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {WORKFLOW_CATEGORY_LABELS[template.category]}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium ${statusStyles[template.status]}`}
        >
          {template.status}
        </span>
      </div>
      <p className="text-xs text-slate-400">{template.description}</p>
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span>{template.steps.length} steps</span>
        <span>~{template.estimated_duration_hours}h</span>
      </div>
    </div>
  );
}
