import type { OptimizationSuggestion } from '@/types/intelligence';

interface OptimizationSuggestionCardProps {
  suggestion: OptimizationSuggestion;
}

export default function OptimizationSuggestionCard({ suggestion }: OptimizationSuggestionCardProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-4 py-3">
      <p className="text-sm font-medium text-white">{suggestion.title}</p>
      <p className="mt-1 text-xs text-slate-400">{suggestion.description}</p>
      <p className="mt-1 text-xs text-slate-500">
        Domain: {suggestion.domain} · Est. improvement: {suggestion.estimated_improvement}
      </p>
      <p className="text-xs text-slate-500">Complexity: {suggestion.implementation_complexity}</p>
    </div>
  );
}
