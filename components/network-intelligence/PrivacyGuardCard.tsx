import type { PrivacyGuard } from '@/types/network-intelligence';

interface PrivacyGuardCardProps {
  guard: PrivacyGuard;
}

export default function PrivacyGuardCard({ guard }: PrivacyGuardCardProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-4 py-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <span className="text-base mt-0.5">🛡️</span>
          <p className="text-sm font-semibold text-white">{guard.rule_name}</p>
        </div>
        <span
          className={`shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium ${
            guard.enforced
              ? 'bg-green-500/10 text-green-400 border-green-500/20'
              : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
          }`}
        >
          {guard.enforced ? 'Enforced' : 'Not Enforced'}
        </span>
      </div>
      <p className="text-xs text-slate-400">{guard.description}</p>
      {guard.exclusions.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">
            Excluded
          </p>
          <ul className="space-y-1">
            {guard.exclusions.map((exclusion) => (
              <li key={exclusion} className="flex items-center gap-2 text-xs text-slate-500">
                <span className="text-red-500">✕</span>
                {exclusion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
