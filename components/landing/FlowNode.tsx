interface FlowNodeProps {
  label: string;
  isFirst?: boolean;
}

export function FlowNode({ label, isFirst = false }: FlowNodeProps) {
  return (
    <div
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
        isFirst
          ? 'bg-accent-blue/15 border-accent-blue/40 text-accent-blue'
          : 'bg-bg-card border-white/10 text-slate-300'
      }`}
    >
      {label}
    </div>
  );
}
