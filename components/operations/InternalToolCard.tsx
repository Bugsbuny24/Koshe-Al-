import type { InternalTool } from '@/types/operations';
import { INTERNAL_TOOL_CATEGORY_LABELS, TOOL_STATUS_CONFIG } from '@/lib/operations/internalToolTypes';

interface InternalToolCardProps {
  tool: InternalTool;
}

export default function InternalToolCard({ tool }: InternalToolCardProps) {
  const statusConfig = TOOL_STATUS_CONFIG[tool.status];

  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-5 py-4 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-widest text-slate-500">
          {INTERNAL_TOOL_CATEGORY_LABELS[tool.category]}
        </span>
        <span className={`text-xs font-semibold text-${statusConfig.color}-400`}>
          {statusConfig.label}
        </span>
      </div>
      <p className="text-sm font-semibold text-white">{tool.name}</p>
      <p className="text-xs text-slate-400">{tool.description}</p>
      {tool.use_cases.length > 0 && (
        <ul className="space-y-0.5">
          {tool.use_cases.map((uc) => (
            <li key={uc} className="text-xs text-slate-500">
              · {uc}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
