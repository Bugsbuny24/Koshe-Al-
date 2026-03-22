'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { capabilities } from '@/lib/features/capabilities';
import { isFeatureEnabled } from '@/lib/features/flags';
import type { Capability } from '@/lib/features/capabilities';

const PHASE_GROUPS = [
  { label: 'V4–V6: Production & Ops Foundation', versions: ['v4', 'v5', 'v6'] },
  { label: 'V7–V9: Autonomy & Learning', versions: ['v7', 'v8', 'v9'] },
  { label: 'V10–V12: Business Operators', versions: ['v10', 'v11', 'v12'] },
  { label: 'V13–V15: Industry Packs', versions: ['v13', 'v14', 'v15'] },
  { label: 'V16–V18: Autonomous Units', versions: ['v16', 'v17', 'v18'] },
  { label: 'V19–V20: Cross-Company Intelligence', versions: ['v19', 'v20'] },
];

const OWNER_LAYER_COLORS: Record<string, string> = {
  intake: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  planning: 'bg-accent-blue/15 text-accent-blue border-accent-blue/20',
  production: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  delivery: 'bg-accent-green/15 text-accent-green border-accent-green/20',
  intelligence: 'bg-pi-gold/15 text-pi-gold border-pi-gold/20',
};

function CapabilityCard({ cap, index }: { cap: Capability; index: number }) {
  const enabled = isFeatureEnabled(cap.flag_key);
  const versionLabel = cap.version.toUpperCase();
  const ownerColor = OWNER_LAYER_COLORS[cap.owner_layer] ?? 'bg-slate-500/15 text-slate-400 border-slate-500/20';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.35 }}
      className="bg-bg-card border border-white/5 rounded-xl p-5 flex flex-col gap-3 hover:border-white/10 transition-colors"
    >
      {/* Top row: version + status */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-[11px] font-bold bg-white/8 text-slate-300 border border-white/10 px-2 py-0.5 rounded-md">
          {versionLabel}
        </span>
        {cap.status === 'scaffolded' ? (
          <span className="text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md">
            Scaffolded
          </span>
        ) : cap.status === 'active' ? (
          <span className="text-[11px] font-semibold bg-accent-green/15 text-accent-green border border-accent-green/20 px-2 py-0.5 rounded-md">
            Active
          </span>
        ) : (
          <span className="text-[11px] font-semibold bg-slate-500/15 text-slate-400 border border-slate-500/20 px-2 py-0.5 rounded-md">
            Planned
          </span>
        )}
      </div>

      {/* Name + category */}
      <div>
        <h3 className="text-white font-bold text-sm leading-snug">{cap.name}</h3>
        <p className="text-[11px] text-slate-500 mt-0.5">{cap.category}</p>
      </div>

      {/* Summary */}
      <p className="text-xs text-slate-400 leading-relaxed flex-1">{cap.summary}</p>

      {/* Footer: owner layer + route */}
      <div className="flex items-center justify-between gap-2 flex-wrap pt-1 border-t border-white/5">
        <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded-md capitalize ${ownerColor}`}>
          {cap.owner_layer}
        </span>
        {enabled ? (
          <Link
            href={cap.route_prefix}
            className="text-[11px] font-medium text-accent-blue hover:underline"
          >
            {cap.route_prefix} →
          </Link>
        ) : (
          <span className="text-[11px] text-slate-600 line-through">{cap.route_prefix}</span>
        )}
      </div>

      {/* Flag key */}
      <p className="text-[10px] text-slate-600 font-mono">{cap.flag_key}</p>
    </motion.div>
  );
}

export default function RoadmapPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white">Product Roadmap</h1>
        <p className="text-slate-400 mt-1">V4–V20 Future Scaffold Preview</p>
        <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 max-w-2xl">
          <p className="text-sm font-semibold text-amber-400">🗓 Not active yet</p>
          <p className="mt-1 text-sm text-slate-400">
            All modules below are <strong className="text-slate-300">scaffolded</strong> or <strong className="text-slate-300">planned</strong> — no active logic runs.
            V1–V3 (Chat, Execution, Workspace, Builder, Mentor) are the live active core.
          </p>
        </div>
      </div>

      {/* Phase groups */}
      <div className="space-y-12">
        {PHASE_GROUPS.map((group) => {
          const groupCaps = capabilities.filter((c) =>
            group.versions.includes(c.version)
          );

          return (
            <section key={group.label}>
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-base font-bold text-white">{group.label}</h2>
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-xs text-slate-500">{groupCaps.length} module{groupCaps.length !== 1 ? 's' : ''}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupCaps.map((cap, i) => (
                  <CapabilityCard key={cap.id} cap={cap} index={i} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </motion.div>
  );
}
