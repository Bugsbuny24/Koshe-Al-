'use client';

const STAGES = ['Input', 'Processing', 'Review', 'Output', 'Delivery'];

export function OutputPipelineCard() {
  return (
    <div className="rounded-xl bg-bg-card border border-white/5 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold text-sm">Output Pipeline</h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
          V4
        </span>
      </div>
      <p className="text-slate-400 text-xs mb-4">Standard pipeline stages for artifact delivery.</p>
      <div className="flex items-center gap-1">
        {STAGES.map((stage, i) => (
          <div key={stage} className="flex items-center gap-1">
            <span className="text-xs text-slate-500 bg-bg-deep rounded px-2 py-0.5">{stage}</span>
            {i < STAGES.length - 1 && <span className="text-slate-600 text-xs">›</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
