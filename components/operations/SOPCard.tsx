import type { SOPDefinition } from '@/types/operations';
import { SOP_TYPE_LABELS, SOP_TYPE_ICONS } from '@/lib/operations/sopTypes';

interface SOPCardProps {
  sop: SOPDefinition;
}

export default function SOPCard({ sop }: SOPCardProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-5 py-4 space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-base">{SOP_TYPE_ICONS[sop.type]}</span>
        <span className="text-xs font-medium text-slate-400">{SOP_TYPE_LABELS[sop.type]}</span>
        <span className="ml-auto text-xs text-slate-500">v{sop.version}</span>
      </div>
      <p className="text-sm font-semibold text-white">{sop.name}</p>
      <p className="text-xs text-slate-400">{sop.description}</p>
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span>{sop.department}</span>
        <span>·</span>
        <span>{sop.steps.length} step{sop.steps.length !== 1 ? 's' : ''}</span>
      </div>
    </div>
  );
}
