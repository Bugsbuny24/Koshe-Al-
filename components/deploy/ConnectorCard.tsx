'use client';

export function ConnectorCard() {
  return (
    <div className="rounded-xl bg-bg-card border border-white/5 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold text-sm">Deploy Connector</h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
          V6
        </span>
      </div>
      <p className="text-slate-400 text-xs mb-4">Connect deployment targets like Vercel and Netlify.</p>
      <div className="flex gap-2 flex-wrap text-xs">
        {['Vercel', 'Netlify', 'Static Export', 'Webhook'].map((name) => (
          <span key={name} className="px-2 py-0.5 rounded bg-bg-deep border border-white/5 text-slate-500">
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
