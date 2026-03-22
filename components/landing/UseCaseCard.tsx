interface UseCaseCardProps {
  label: string;
}

export function UseCaseCard({ label }: UseCaseCardProps) {
  return (
    <div className="flex items-center gap-2.5 bg-bg-card border border-white/5 rounded-xl px-4 py-3 hover:border-accent-blue/20 transition-colors duration-200">
      <span className="w-1.5 h-1.5 rounded-full bg-accent-blue shrink-0" />
      <span className="text-slate-300 text-sm">{label}</span>
    </div>
  );
}
