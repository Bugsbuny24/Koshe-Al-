import type { RiskSignal } from '@/types/intelligence';
import { getRiskSignalConfig } from '@/lib/intelligence/riskSignals';

interface RiskSignalCardProps {
  signal: RiskSignal;
}

export default function RiskSignalCard({ signal }: RiskSignalCardProps) {
  const config = getRiskSignalConfig(signal.level);
  return (
    <div className={`rounded-xl border border-white/5 ${config.bgColor} px-4 py-3`}>
      <div className="flex items-center justify-between">
        <p className={`text-sm font-medium ${config.color}`}>{signal.title}</p>
        <span className={`text-xs font-semibold uppercase ${config.color}`}>{config.label}</span>
      </div>
      <p className="mt-1 text-xs text-slate-400">{signal.description}</p>
      <p className="mt-1 text-xs text-slate-500">Module: {signal.affected_module}</p>
    </div>
  );
}
