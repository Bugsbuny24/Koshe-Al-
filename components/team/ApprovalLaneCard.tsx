import type { ApprovalFlow } from '@/types/team';

interface ApprovalLaneCardProps {
  flow: ApprovalFlow;
}

export default function ApprovalLaneCard({ flow }: ApprovalLaneCardProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-4 py-3">
      <p className="text-sm font-medium text-white">{flow.name}</p>
      <p className="mt-1 text-xs text-slate-400">{flow.description}</p>
      <p className="mt-1 text-xs text-slate-500">{flow.stages.length} stage{flow.stages.length !== 1 ? 's' : ''}</p>
    </div>
  );
}
