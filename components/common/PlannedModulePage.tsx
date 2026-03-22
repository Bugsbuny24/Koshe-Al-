'use client';

import { motion } from 'framer-motion';

interface PlannedModulePageProps {
  title: string;
  version: string;
  summary: string;
  status?: 'planned' | 'scaffolded';
  plannedCapabilities?: string[];
  dependsOn?: string[];
  ownerLayer?: string;
  flagKey?: string;
}

const statusStyles = {
  planned: {
    badge: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    label: 'Planned',
  },
  scaffolded: {
    badge: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
    label: 'Scaffolded',
  },
} as const;

export default function PlannedModulePage({
  title,
  version,
  summary,
  status = 'scaffolded',
  plannedCapabilities = [],
  dependsOn = [],
  ownerLayer,
  flagKey,
}: PlannedModulePageProps) {
  const { badge, label } = statusStyles[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="min-h-screen bg-bg-deep px-4 py-12 sm:px-8"
    >
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-bg-card px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-accent-blue border border-white/5">
              {version.toUpperCase()}
            </span>
            <span className={`rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-widest ${badge}`}>
              {label}
            </span>
            {ownerLayer && (
              <span className="rounded-md bg-bg-card px-2.5 py-1 text-xs font-medium text-slate-400 border border-white/5">
                {ownerLayer}
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold text-white sm:text-3xl">{title}</h1>

          <p className="text-base leading-relaxed text-slate-400">{summary}</p>
        </div>

        {/* Scaffolded notice */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.35 }}
          className="rounded-xl border border-white/5 bg-bg-card px-6 py-5"
        >
          <p className="text-sm font-medium text-orange-400">
            🚧 Scaffolded — Coming in{' '}
            <span className="font-bold">{version.toUpperCase()}</span>
          </p>
          <p className="mt-1 text-sm text-slate-400">
            This module is scaffolded for future versions. No active logic is
            running yet.
          </p>
        </motion.div>

        {/* Planned capabilities */}
        {plannedCapabilities.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Planned Capabilities
            </h2>
            <ul className="space-y-2">
              {plannedCapabilities.map((cap) => (
                <li
                  key={cap}
                  className="flex items-start gap-3 rounded-lg border border-white/5 bg-bg-card px-4 py-3"
                >
                  <span className="mt-0.5 flex-shrink-0 text-slate-500">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                    </svg>
                  </span>
                  <span className="text-sm text-slate-400">{cap}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Dependencies */}
        {dependsOn.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Depends On
            </h2>
            <div className="flex flex-wrap gap-2">
              {dependsOn.map((dep) => (
                <span
                  key={dep}
                  className="rounded-md border border-white/5 bg-bg-card px-3 py-1.5 text-xs font-mono text-accent-blue"
                >
                  {dep}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Flag key */}
        {flagKey && (
          <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Feature Flag
            </h2>
            <div className="inline-flex items-center gap-2 rounded-md border border-white/5 bg-bg-card px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-slate-600" />
              <code className="text-xs text-slate-400">{flagKey}</code>
              <span className="rounded bg-slate-700/50 px-1.5 py-0.5 text-xs text-slate-500">
                disabled
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export { PlannedModulePage };
