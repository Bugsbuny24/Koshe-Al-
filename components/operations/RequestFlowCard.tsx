import type { RequestFlow } from '@/types/operations';
import { REQUEST_FLOW_TYPE_LABELS } from '@/lib/operations/requestTypes';

interface RequestFlowCardProps {
  flow: RequestFlow;
}

export default function RequestFlowCard({ flow }: RequestFlowCardProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-5 py-4 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-widest text-slate-500">
          {REQUEST_FLOW_TYPE_LABELS[flow.type]}
        </span>
        {flow.sla_hours !== undefined && (
          <span className="text-xs text-slate-400">
            SLA: <span className="font-semibold text-slate-300">{flow.sla_hours}h</span>
          </span>
        )}
      </div>
      <p className="text-sm font-semibold text-white">{flow.name}</p>
      <p className="text-xs text-slate-400">{flow.description}</p>
      {flow.steps.length > 0 && (
        <ol className="space-y-0.5 list-decimal list-inside">
          {flow.steps.map((step, i) => (
            <li key={i} className="text-xs text-slate-500">
              {step}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
