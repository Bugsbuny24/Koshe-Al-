'use client';

export function ArtifactPreviewCard() {
  return (
    <div className="rounded-xl bg-bg-card border border-white/5 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold text-sm">Artifact Preview</h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
          V4
        </span>
      </div>
      <p className="text-slate-400 text-xs mb-4">Preview generated artifacts before delivery.</p>
      <div className="rounded-lg bg-bg-deep border border-white/5 p-4 flex items-center justify-center min-h-[80px]">
        <span className="text-slate-500 text-xs">No artifact selected</span>
      </div>
    </div>
  );
}
