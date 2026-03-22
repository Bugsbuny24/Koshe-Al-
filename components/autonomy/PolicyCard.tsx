import type { RunPolicy } from '@/types/autonomy';

interface PolicyCardProps {
  policy: RunPolicy;
}

export default function PolicyCard({ policy }: PolicyCardProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-4 py-3">
      <p className="text-sm font-medium text-white">{policy.name}</p>
      <p className="mt-1 text-xs text-slate-400">{policy.description}</p>
      <p className="mt-1 text-xs text-slate-500">Type: {policy.type}</p>
    </div>
  );
}
