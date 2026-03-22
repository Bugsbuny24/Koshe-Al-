import type { SectorUseCase } from '@/types/industry';

interface SectorUseCaseCardProps {
  useCase: SectorUseCase;
}

export default function SectorUseCaseCard({ useCase }: SectorUseCaseCardProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-4 py-4 space-y-2">
      <p className="text-sm font-semibold text-white">{useCase.title}</p>
      <p className="text-xs text-slate-400">{useCase.description}</p>
      <div className="flex items-center gap-2 pt-1">
        <span className="text-xs text-slate-500">Time to value:</span>
        <span className="text-xs font-medium text-accent-blue">
          {useCase.estimated_time_to_value}
        </span>
      </div>
    </div>
  );
}
