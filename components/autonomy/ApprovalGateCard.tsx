import type { ApprovalGate } from '@/types/autonomy';

interface ApprovalGateCardProps {
  gate: ApprovalGate;
}

export default function ApprovalGateCard({ gate }: ApprovalGateCardProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-4 py-3">
      <p className="text-sm font-medium text-white">{gate.name}</p>
      <p className="mt-1 text-xs text-slate-400">{gate.description}</p>
      <p className="mt-1 text-xs text-slate-500">Stage: {gate.stage} · Type: {gate.type}</p>
    </div>
  );
}
