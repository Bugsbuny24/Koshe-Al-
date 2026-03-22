import type { RevenueSignal } from '@/types/revenue';

const TREND_ICON: Record<RevenueSignal['trend'], string> = {
  up: '↑',
  down: '↓',
  stable: '→',
};

const TREND_COLOR: Record<RevenueSignal['trend'], string> = {
  up: 'text-green-400',
  down: 'text-red-400',
  stable: 'text-slate-400',
};

interface RevenueSignalCardProps {
  signal: RevenueSignal;
}

export default function RevenueSignalCard({ signal }: RevenueSignalCardProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-5 py-4 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-widest text-slate-500">
          {signal.type.replace(/_/g, ' ')}
        </span>
        <span className={`text-xs font-semibold ${TREND_COLOR[signal.trend]}`}>
          {TREND_ICON[signal.trend]} {signal.period}
        </span>
      </div>
      <p className="text-sm font-medium text-white">{signal.title}</p>
      <p className="text-2xl font-bold text-white">
        {signal.value.toLocaleString()}
        <span className="ml-1 text-sm font-normal text-slate-400">{signal.unit}</span>
      </p>
      {signal.insight && (
        <p className="text-xs text-slate-400">{signal.insight}</p>
      )}
    </div>
  );
}
