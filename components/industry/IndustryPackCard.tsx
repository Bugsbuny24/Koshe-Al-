import type { IndustryPack } from '@/types/industry';
import { SECTOR_LABELS } from '@/lib/industry/packs';

interface IndustryPackCardProps {
  pack: IndustryPack;
}

const statusStyles = {
  planned: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  scaffolded: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  active: 'bg-green-500/10 text-green-400 border-green-500/20',
} as const;

const statusLabels = {
  planned: 'Planned',
  scaffolded: 'Scaffolded',
  active: 'Active',
} as const;

export default function IndustryPackCard({ pack }: IndustryPackCardProps) {
  const statusStyle = statusStyles[pack.status];
  const statusLabel = statusLabels[pack.status];

  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-4 py-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{pack.name}</p>
          <p className="text-xs text-slate-500 mt-0.5">{SECTOR_LABELS[pack.sector]}</p>
        </div>
        <span
          className={`shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium ${statusStyle}`}
        >
          {statusLabel}
        </span>
      </div>
      <p className="text-xs text-slate-400">{pack.description}</p>
      <p className="text-xs text-slate-600 font-mono">v{pack.version_introduced}</p>
    </div>
  );
}
