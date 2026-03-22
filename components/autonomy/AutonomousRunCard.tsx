import type { AutonomousRun } from '@/types/autonomy';

interface AutonomousRunCardProps {
  run: AutonomousRun;
}

export default function AutonomousRunCard({ run }: AutonomousRunCardProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-4 py-3">
      <p className="text-sm font-medium text-white">{run.id}</p>
      <p className="mt-1 text-xs text-slate-400">Status: {run.status}</p>
      <p className="text-xs text-slate-500">Policy: {run.policy_id}</p>
    </div>
  );
}
