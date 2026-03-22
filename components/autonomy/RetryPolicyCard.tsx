import type { RetryStrategy } from '@/types/autonomy';

interface RetryPolicyCardProps {
  strategy: RetryStrategy;
  maxRetries: number;
}

export default function RetryPolicyCard({ strategy, maxRetries }: RetryPolicyCardProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-4 py-3">
      <p className="text-sm font-medium text-white">Retry Policy</p>
      <p className="mt-1 text-xs text-slate-400">Strategy: {strategy}</p>
      <p className="text-xs text-slate-500">Max retries: {maxRetries}</p>
    </div>
  );
}
