'use client';

export function QualitySignalCard() {
  return (
    <div className="rounded-xl bg-bg-card border border-white/5 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold text-sm">Quality Signals</h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
          V5
        </span>
      </div>
      <p className="text-slate-400 text-xs mb-4">Track completion rates, revisions, and satisfaction scores.</p>
      <div className="grid grid-cols-2 gap-3 text-xs">
        {['Completion Rate', 'Approval Rate', 'Revision Rate', 'Error Rate'].map((label) => (
          <div key={label} className="rounded-lg bg-bg-deep border border-white/5 p-3">
            <span className="text-slate-500">{label}</span>
            <p className="text-white mt-0.5">—</p>
          </div>
        ))}
      </div>
    </div>
  );
}
