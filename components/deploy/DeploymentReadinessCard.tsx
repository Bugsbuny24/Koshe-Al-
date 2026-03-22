'use client';

export function DeploymentReadinessCard() {
  return (
    <div className="rounded-xl bg-bg-card border border-white/5 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold text-sm">Deployment Readiness</h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
          V6
        </span>
      </div>
      <p className="text-slate-400 text-xs mb-4">Check artifact readiness before triggering a deploy.</p>
      <div className="flex gap-4 text-xs">
        <div>
          <span className="text-slate-500">Artifacts</span>
          <p className="text-white mt-0.5">—</p>
        </div>
        <div>
          <span className="text-slate-500">Checks Passed</span>
          <p className="text-accent-green mt-0.5">—</p>
        </div>
        <div>
          <span className="text-slate-500">Blockers</span>
          <p className="text-red-400 mt-0.5">—</p>
        </div>
      </div>
    </div>
  );
}
